const MIN_SCALE = 0.5
const MAX_SCALE = 4
const ZOOM_STEP = 1.2

function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
}

export function attachMermaidZoom(container: HTMLElement) {
  const svg = container.querySelector('svg')
  if (!svg || container.dataset.zoomReady === 'true') return

  container.dataset.zoomReady = 'true'
  container.classList.add('mermaid-diagram--zoomable')

  const viewport = document.createElement('div')
  viewport.className = 'mermaid-viewport'

  const canvas = document.createElement('div')
  canvas.className = 'mermaid-canvas'
  canvas.appendChild(svg)

  const controls = document.createElement('div')
  controls.className = 'mermaid-controls'
  controls.setAttribute('role', 'toolbar')
  controls.setAttribute('aria-label', 'Diagram zoom controls')

  const buttons = [
    { label: 'Zoom in', text: '+', action: 'in' },
    { label: 'Zoom out', text: '−', action: 'out' },
    { label: 'Reset zoom', text: 'Reset', action: 'reset' },
  ] as const

  for (const { label, text, action } of buttons) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'mermaid-control-btn'
    btn.title = label
    btn.setAttribute('aria-label', label)
    btn.dataset.action = action
    btn.textContent = text
    controls.appendChild(btn)
  }

  container.prepend(viewport)
  viewport.appendChild(canvas)
  container.appendChild(controls)

  let scale = 1
  let panX = 0
  let panY = 0
  let dragging = false
  let dragStartX = 0
  let dragStartY = 0
  let dragPanX = 0
  let dragPanY = 0

  const applyTransform = () => {
    canvas.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`
    viewport.classList.toggle('mermaid-viewport--pannable', scale > 1)
  }

  const reset = () => {
    scale = 1
    panX = 0
    panY = 0
    applyTransform()
  }

  const zoomBy = (factor: number, originX?: number, originY?: number) => {
    const prevScale = scale
    const nextScale = clampScale(scale * factor)
    if (nextScale === prevScale) return

    const rect = viewport.getBoundingClientRect()
    const ox = originX ?? rect.left + rect.width / 2
    const oy = originY ?? rect.top + rect.height / 2

    const localX = (ox - rect.left - panX) / prevScale
    const localY = (oy - rect.top - panY) / prevScale

    scale = nextScale
    panX = ox - rect.left - localX * scale
    panY = oy - rect.top - localY * scale
    applyTransform()
  }

  controls.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-action]')
    if (!btn) return

    switch (btn.dataset.action) {
      case 'in':
        zoomBy(ZOOM_STEP)
        break
      case 'out':
        zoomBy(1 / ZOOM_STEP)
        break
      case 'reset':
        reset()
        break
    }
  })

  viewport.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault()
      zoomBy(e.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP, e.clientX, e.clientY)
    },
    { passive: false },
  )

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return
    panX = dragPanX + (e.clientX - dragStartX)
    panY = dragPanY + (e.clientY - dragStartY)
    applyTransform()
  }

  const onMouseUp = () => {
    if (!dragging) return
    dragging = false
    viewport.classList.remove('mermaid-viewport--dragging')
  }

  viewport.addEventListener('mousedown', (e) => {
    if (scale <= 1 || e.button !== 0) return
    dragging = true
    dragStartX = e.clientX
    dragStartY = e.clientY
    dragPanX = panX
    dragPanY = panY
    viewport.classList.add('mermaid-viewport--dragging')
    e.preventDefault()
  })

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)

  applyTransform()

  return () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }
}

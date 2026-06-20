import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'
import { attachMermaidZoom } from '../utils/mermaidZoom'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import rust from 'highlight.js/lib/languages/rust'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import type { ActiveLevel } from '../context/LevelContext'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('go', go)
hljs.registerLanguage('java', java)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c', cpp)
hljs.registerLanguage('csharp', csharp)

type MarkdownArticleProps = {
  html: string
  activeLevel: ActiveLevel
}

let mermaidReady = false

function initMermaid() {
  if (mermaidReady) return
  const dark = document.documentElement.dataset.theme === 'dark'
  mermaid.initialize({
    startOnLoad: false,
    theme: dark ? 'dark' : 'neutral',
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
  })
  mermaidReady = true
}

// Walk top-level child nodes and wrap <!-- level:X --> ... <!-- /level:X --> pairs
// in <section class="level-block level-block--X" data-level="X"> elements.
function wrapLevelBlocks(container: HTMLElement): void {
  const nodes = Array.from(container.childNodes)
  let i = 0

  while (i < nodes.length) {
    const node = nodes[i]
    if (node.nodeType !== Node.COMMENT_NODE) {
      i++
      continue
    }

    const openMatch = (node as Comment).data.trim().match(/^level:(junior|senior|staff)$/)
    if (!openMatch) {
      i++
      continue
    }

    const level = openMatch[1]
    const closingText = `/level:${level}`

    let closeIdx = i + 1
    while (closeIdx < nodes.length) {
      const cn = nodes[closeIdx]
      if (cn.nodeType === Node.COMMENT_NODE && (cn as Comment).data.trim() === closingText) break
      closeIdx++
    }

    const section = document.createElement('section')
    section.className = `level-block level-block--${level}`
    section.dataset.level = level

    // Move content nodes (between open and close comments) into the section
    nodes.slice(i + 1, closeIdx).forEach((n) => section.appendChild(n))

    // Replace opening comment with the section
    container.replaceChild(section, node)

    // Remove closing comment (still in container since we didn't move it)
    if (closeIdx < nodes.length && nodes[closeIdx].parentNode === container) {
      container.removeChild(nodes[closeIdx])
    }

    i = closeIdx + 1
  }
}

function applyLevelDimming(container: HTMLElement, activeLevel: ActiveLevel): void {
  container.querySelectorAll<HTMLElement>('.level-block').forEach((section) => {
    const dimmed = activeLevel !== 'all' && section.dataset.level !== activeLevel
    section.classList.toggle('level-block--dimmed', dimmed)
  })
}

export function MarkdownArticle({ html, activeLevel }: MarkdownArticleProps) {
  const ref = useRef<HTMLElement>(null)

  // Effect 1: runs on html change — wrap level blocks, highlight code, render mermaid
  useEffect(() => {
    if (!ref.current) return

    wrapLevelBlocks(ref.current)

    ref.current.querySelectorAll('pre code:not(.language-mermaid)').forEach((block) => {
      hljs.highlightElement(block as HTMLElement)
    })

    const mermaidBlocks = ref.current.querySelectorAll('pre code.language-mermaid')
    if (mermaidBlocks.length === 0) return

    initMermaid()

    const cleanups: Array<() => void> = []

    mermaidBlocks.forEach(async (block, i) => {
      const pre = block.parentElement
      if (!pre) return
      const code = block.textContent ?? ''
      const id = `mermaid-${Date.now()}-${i}`
      try {
        const { svg } = await mermaid.render(id, code)
        const wrapper = document.createElement('div')
        wrapper.className = 'mermaid-diagram'
        wrapper.innerHTML = svg
        pre.replaceWith(wrapper)
        const cleanup = attachMermaidZoom(wrapper)
        if (cleanup) cleanups.push(cleanup)
      } catch (err) {
        console.error('Mermaid render failed', err)
      }
    })

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [html])

  // Effect 2: runs on activeLevel change — toggle dimmed class on existing level-block sections
  useEffect(() => {
    if (!ref.current) return
    applyLevelDimming(ref.current, activeLevel)
  }, [activeLevel, html])

  return (
    <article
      ref={ref}
      className="md-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'
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

export function MarkdownArticle({ html }: MarkdownArticleProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    ref.current.querySelectorAll('pre code:not(.language-mermaid)').forEach((block) => {
      hljs.highlightElement(block as HTMLElement)
    })

    const mermaidBlocks = ref.current.querySelectorAll('pre code.language-mermaid')
    if (mermaidBlocks.length === 0) return

    initMermaid()

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
      } catch (err) {
        console.error('Mermaid render failed', err)
      }
    })
  }, [html])

  return (
    <article
      ref={ref}
      className="md-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

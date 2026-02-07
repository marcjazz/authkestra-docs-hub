'use client'

import { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Check, Copy } from 'lucide-react'
import { motion } from 'framer-motion'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

// Custom Rust-inspired theme based on nightOwl
const rustTheme = {
  plain: {
    color: '#d6deeb',
    backgroundColor: '#0f172a',
  },
  styles: [
    {
      types: ['keyword', 'operator'],
      style: { color: '#f97316' },
    },
    {
      types: ['function'],
      style: { color: '#7dd3fc' },
    },
    {
      types: ['string', 'char'],
      style: { color: '#4ade80' },
    },
    {
      types: ['number', 'boolean'],
      style: { color: '#c084fc' },
    },
    {
      types: ['class-name', 'type', 'builtin'],
      style: { color: '#fbbf24' },
    },
    {
      types: ['comment'],
      style: { color: '#64748b', fontStyle: 'italic' as const },
    },
    {
      types: ['punctuation'],
      style: { color: '#94a3b8' },
    },
    {
      types: ['attr-name'],
      style: { color: '#f97316' },
    },
    {
      types: ['variable', 'constant'],
      style: { color: '#e2e8f0' },
    },
  ],
}

export function CodeBlock({
  code,
  language = 'rust',
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='code-block my-6'
    >
      {/* Header */}
      <div className='flex justify-between items-center p-5 code-header'>
        <div className='flex items-center gap-3'>
          <div className='flex gap-1.5'>
            <span
              className='w-3 h-3 rounded-full'
              style={{ background: 'hsl(0 84% 60% / 0.8)' }}
            />
            <span
              className='w-3 h-3 rounded-full'
              style={{ background: 'hsl(45 93% 47% / 0.8)' }}
            />
            <span
              className='w-3 h-3 rounded-full'
              style={{ background: 'hsl(142 76% 36% / 0.8)' }}
            />
          </div>
          {filename && (
            <span className='text-xs text-slate-400 font-mono'>{filename}</span>
          )}
        </div>
        <div className='flex justify-end gap-3'>
          {language && (
            <span className='text-xs text-slate-400 font-mono'>{language}</span>
          )}
          <button
            onClick={handleCopy}
            className='copy-btn flex items-center gap-1'
            aria-label='Copy code'
          >
            {copied ? (
              <>
                <Check className='w-3.5 h-3.5' />
                <span className='text-xs text-slate-400 font-mono'>
                  Copied!
                </span>
              </>
            ) : (
              <>
                <Copy className='w-3.5 h-3.5' />
                <span className='text-xs text-slate-400 font-mono'>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <Highlight theme={rustTheme} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} scrollbar-thin`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className='table-row'>
                {showLineNumbers && (
                  <span className='table-cell pr-4 text-right select-none text-slate-600 text-xs w-8'>
                    {i + 1}
                  </span>
                )}
                <span className='table-cell'>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </motion.div>
  )
}

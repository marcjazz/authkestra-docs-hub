import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'
import { source } from 'lib/source'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-lg flex items-center justify-center'>
              <img src={`/logo.png`} />
            </div>
            <span className='font-semibold text-xl'>Authkestra</span>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  )
}

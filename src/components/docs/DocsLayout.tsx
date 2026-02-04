import { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { TableOfContents } from "./TableOfContents";

interface DocsLayoutProps {
  children: ReactNode;
  toc?: { id: string; title: string; level: number }[];
}

export function DocsLayout({ children, toc }: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="pl-64 pt-16">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <article className="prose-docs">{children}</article>
        </div>
        
        {/* Table of Contents (desktop only) */}
        {toc && toc.length > 0 && (
          <TableOfContents items={toc} />
        )}
      </main>
    </div>
  );
}

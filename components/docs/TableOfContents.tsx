import { useEffect, useState } from "react";
import { cn } from "lib/utils";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0% -80% 0%" }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden xl:block fixed right-0 top-16 w-56 h-[calc(100vh-4rem)] p-6 overflow-y-auto">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        On this page
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "toc-link",
              item.level === 3 && "pl-6",
              activeId === item.id && "active"
            )}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}

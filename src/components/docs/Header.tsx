import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Search, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-b border-border z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">A</span>
            </div>
          </motion.div>
          <div>
            <span className="font-bold text-lg tracking-tight">Authkestra</span>
            <span className="hidden sm:inline text-muted-foreground text-sm ml-2">
              Documentation
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
          <Link
            to="/docs/examples"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Examples
          </Link>
          <a
            href="https://github.com/marcjazz/authkestra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-secondary/50 rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search...</span>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/marcjazz/authkestra"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search Modal Placeholder */}
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24"
          onClick={() => setIsSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-xl mx-4 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                autoFocus
              />
              <kbd className="px-2 py-0.5 text-xs font-medium text-muted-foreground bg-muted rounded border border-border">
                ESC
              </kbd>
            </div>
            <div className="p-4 text-sm text-muted-foreground text-center">
              Start typing to search...
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border py-4 px-6 space-y-2"
        >
          <Link
            to="/docs"
            className="block py-2 text-foreground font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Documentation
          </Link>
          <Link
            to="/docs/examples"
            className="block py-2 text-foreground font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Examples
          </Link>
          <a
            href="https://github.com/marcjazz/authkestra"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 text-foreground font-medium"
          >
            GitHub
          </a>
        </motion.div>
      )}
    </header>
  );
}

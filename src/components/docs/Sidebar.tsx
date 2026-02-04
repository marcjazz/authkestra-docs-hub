import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Box,
  Cog,
  Database,
  Key,
  Layers,
  Play,
  Server,
  Shield,
  Workflow,
  Github,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: "Getting Started",
    href: "/docs",
    icon: <BookOpen className="w-4 h-4" />,
    children: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quickstart" },
    ],
  },
  {
    title: "Core Concepts",
    href: "/docs/core",
    icon: <Box className="w-4 h-4" />,
    children: [
      { title: "Identity", href: "/docs/core/identity" },
      { title: "Traits", href: "/docs/core/traits" },
      { title: "Error Handling", href: "/docs/core/errors" },
    ],
  },
  {
    title: "Authentication Flows",
    href: "/docs/flows",
    icon: <Workflow className="w-4 h-4" />,
    children: [
      { title: "OAuth2 Flow", href: "/docs/flows/oauth2" },
      { title: "Device Flow", href: "/docs/flows/device" },
      { title: "Client Credentials", href: "/docs/flows/client-credentials" },
      { title: "Direct Credentials", href: "/docs/flows/credentials" },
    ],
  },
  {
    title: "OpenID Connect",
    href: "/docs/oidc",
    icon: <Shield className="w-4 h-4" />,
    badge: "OIDC",
    children: [
      { title: "Discovery", href: "/docs/oidc/discovery" },
      { title: "JWKS Validation", href: "/docs/oidc/jwks" },
      { title: "PKCE", href: "/docs/oidc/pkce" },
    ],
  },
  {
    title: "Token Management",
    href: "/docs/tokens",
    icon: <Key className="w-4 h-4" />,
    children: [
      { title: "JWT Signing", href: "/docs/tokens/jwt" },
      { title: "Offline Validation", href: "/docs/tokens/offline" },
    ],
  },
  {
    title: "Session Management",
    href: "/docs/sessions",
    icon: <Database className="w-4 h-4" />,
    children: [
      { title: "Session Stores", href: "/docs/sessions/stores" },
      { title: "Configuration", href: "/docs/sessions/config" },
    ],
  },
  {
    title: "Framework Integration",
    href: "/docs/frameworks",
    icon: <Server className="w-4 h-4" />,
    children: [
      { title: "Actix-web", href: "/docs/frameworks/actix" },
      { title: "Axum", href: "/docs/frameworks/axum" },
    ],
  },
  {
    title: "Providers",
    href: "/docs/providers",
    icon: <Layers className="w-4 h-4" />,
    children: [
      { title: "GitHub", href: "/docs/providers/github" },
      { title: "Google", href: "/docs/providers/google" },
      { title: "Discord", href: "/docs/providers/discord" },
    ],
  },
  {
    title: "Examples",
    href: "/docs/examples",
    icon: <Play className="w-4 h-4" />,
    badge: "NEW",
    children: [
      { title: "SPA with JWT", href: "/docs/examples/spa-jwt" },
      { title: "Resource Server", href: "/docs/examples/resource-server" },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border overflow-y-auto scrollbar-thin">
      <nav className="p-4 space-y-1">
        {navigation.map((section, idx) => (
          <SidebarSection
            key={section.href}
            section={section}
            currentPath={location.pathname}
            delay={idx * 0.05}
          />
        ))}

        {/* External links */}
        <div className="pt-6 mt-6 border-t border-sidebar-border">
          <a
            href="https://github.com/marcjazz/authkestra"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
          </a>
          <a
            href="https://crates.io/crates/authkestra"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground hover:text-foreground transition-colors"
          >
            <Cog className="w-4 h-4" />
            <span>crates.io</span>
            <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
          </a>
        </div>
      </nav>
    </aside>
  );
}

interface SidebarSectionProps {
  section: NavItem;
  currentPath: string;
  delay: number;
}

function SidebarSection({ section, currentPath, delay }: SidebarSectionProps) {
  const isActive = currentPath === section.href;
  const isParentActive = section.children?.some(
    (child) => currentPath === child.href
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="space-y-1"
    >
      {/* Section header */}
      <div className="flex items-center gap-2 px-3 py-2">
        <span
          className={cn(
            "transition-colors",
            isActive || isParentActive
              ? "text-primary"
              : "text-sidebar-foreground"
          )}
        >
          {section.icon}
        </span>
        <span
          className={cn(
            "text-sm font-semibold transition-colors",
            isActive || isParentActive ? "text-foreground" : "text-sidebar-foreground"
          )}
        >
          {section.title}
        </span>
        {section.badge && (
          <span
            className={cn(
              "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded",
              section.badge === "NEW"
                ? "badge-new"
                : section.badge === "OIDC"
                ? "badge-stable"
                : "badge-beta"
            )}
          >
            {section.badge}
          </span>
        )}
      </div>

      {/* Children */}
      {section.children && (
        <div className="ml-9 space-y-0.5">
          {section.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              className={cn(
                "nav-link block px-3 py-1.5 rounded-md transition-all duration-200",
                currentPath === child.href
                  ? "text-primary bg-sidebar-accent font-medium"
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}

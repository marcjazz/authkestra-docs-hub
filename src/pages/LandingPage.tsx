import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Box, 
  Github, 
  Key, 
  Layers, 
  Shield, 
  Workflow,
  Zap,
  Lock,
  Server
} from "lucide-react";
import { Header } from "@/components/docs/Header";
import { CodeBlock } from "@/components/docs/CodeBlock";

const features = [
  {
    icon: Box,
    title: "Modular Design",
    description: "Strictly separated concerns with composable crates for core, flow, session, token, and framework adapters.",
  },
  {
    icon: Workflow,
    title: "Explicit Control Flow",
    description: "No magic middleware. Dependencies and context are injected explicitly via Extractors or constructors.",
  },
  {
    icon: Layers,
    title: "Provider Agnostic",
    description: "Easily integrate new OAuth providers by implementing the OAuthProvider trait. GitHub, Google, and Discord included.",
  },
  {
    icon: Shield,
    title: "OpenID Connect",
    description: "Full OIDC support with automatic discovery, JWKS validation, and PKCE for enhanced security.",
  },
  {
    icon: Key,
    title: "Session Management",
    description: "Flexible session storage via the SessionStore trait with in-memory, Redis, and SQL support.",
  },
  {
    icon: Lock,
    title: "Stateless Tokens",
    description: "Comprehensive JWT signing, verification, and offline validation for scalable stateless authentication.",
  },
];

const quickstartCode = `use authkestra_axum::{Authkestra, AuthkestraAxumExt, AuthSession};
use authkestra_flow::OAuth2Flow;
use authkestra_providers_github::GithubProvider;

#[tokio::main]
async fn main() {
    let provider = GithubProvider::new(
        std::env::var("GITHUB_CLIENT_ID").unwrap(),
        std::env::var("GITHUB_CLIENT_SECRET").unwrap(),
        "http://localhost:3000/auth/github/callback".to_string(),
    );

    let authkestra = Authkestra::builder()
        .provider(OAuth2Flow::new(provider))
        .build();

    let app = Router::new()
        .authkestra_routes(&authkestra)
        .route("/protected", get(protected));

    axum::serve(listener, app).await.unwrap();
}

async fn protected(session: AuthSession) -> impl IntoResponse {
    format!("Hello, {}!", session.0.identity.username.unwrap())
}`;

const cargoCode = `[dependencies]
authkestra = { version = "0.1.0", features = ["axum", "github"] }
tokio = { version = "1", features = ["full"] }`;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'var(--gradient-hero-glow)',
            opacity: 0.5,
          }}
        />

        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/5"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">v0.1.0 Released</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Authentication for
              <span className="block text-gradient-hero">Rust Applications</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              A modular, framework-agnostic authentication orchestration system 
              emphasizing <strong className="text-foreground">explicit control flow</strong>, 
              <strong className="text-foreground"> strong typing</strong>, and 
              <strong className="text-foreground"> composability</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/docs" className="btn-hero group">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://github.com/marcjazz/authkestra"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost group"
              >
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </a>
            </div>
          </motion.div>

          {/* Code Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mx-auto mt-16"
          >
            <CodeBlock
              code={cargoCode}
              language="toml"
              filename="Cargo.toml"
              showLineNumbers={false}
            />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for <span className="text-gradient-hero">Rust Developers</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed with Rust's philosophy in mind: explicit, composable, and type-safe.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="feature-card"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Preview */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Get started in minutes
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Authkestra integrates seamlessly with Axum and Actix-web. Set up GitHub OAuth, 
                session management, and protected routes with just a few lines of code.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Type-safe extractors for session and token access",
                  "Automatic route generation for OAuth callbacks",
                  "Flexible session stores (Memory, Redis, SQL)",
                  "Built-in support for popular providers",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3 h-3 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/docs/quickstart" className="btn-hero inline-flex">
                View Quick Start Guide
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <CodeBlock
                code={quickstartCode}
                language="rust"
                filename="main.rs"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workspace Crates */}
      <section className="py-20 border-t border-border bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Modular Architecture
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Use the full facade or pick individual crates for your specific needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { name: "authkestra-core", desc: "Identity, traits, errors" },
              { name: "authkestra-flow", desc: "OAuth2, OIDC orchestration" },
              { name: "authkestra-session", desc: "Session persistence" },
              { name: "authkestra-token", desc: "JWT management" },
              { name: "authkestra-axum", desc: "Axum integration" },
              { name: "authkestra-actix", desc: "Actix-web integration" },
              { name: "authkestra-oidc", desc: "OpenID Connect" },
              { name: "authkestra-providers-*", desc: "OAuth providers" },
            ].map((crate, idx) => (
              <motion.div
                key={crate.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <code className="text-sm font-mono text-primary">{crate.name}</code>
                <p className="text-xs text-muted-foreground mt-1">{crate.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-semibold">Authkestra</span>
            </div>

            <p className="text-sm text-muted-foreground">
              Dual-licensed under MIT and Apache 2.0
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/marcjazz/authkestra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://crates.io/crates/authkestra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Server className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { Link } from "react-router-dom";
import { ArrowRight, Box, Key, Shield, Workflow } from "lucide-react";
import { motion } from "framer-motion";

const tocItems = [
  { id: "what-is-authkestra", title: "What is Authkestra?", level: 2 },
  { id: "key-features", title: "Key Features", level: 2 },
  { id: "workspace-crates", title: "Workspace Crates", level: 2 },
  { id: "design-philosophy", title: "Design Philosophy", level: 2 },
  { id: "next-steps", title: "Next Steps", level: 2 },
];

export default function DocsIntroduction() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Introduction to Authkestra</h1>
        
        <p className="text-xl leading-relaxed">
          Authkestra is a modular, framework-agnostic authentication orchestration 
          system for Rust, designed to be idiomatic and emphasize explicit control 
          flow, strong typing, and composability.
        </p>

        <h2 id="what-is-authkestra">What is Authkestra?</h2>
        
        <p>
          Unlike authentication solutions common in other ecosystems that rely heavily on 
          dynamic middleware and implicit context, Authkestra follows Rust's philosophy 
          of being <strong>explicit and type-safe</strong>. Authentication context is never 
          implicitly available—users must explicitly request it via extractors.
        </p>

        <CodeBlock
          code={`use authkestra_axum::{AuthSession, Authkestra};

// Explicit injection via extractors - no magic!
async fn protected(session: AuthSession) -> impl IntoResponse {
    let user = session.0.identity;
    format!("Hello, {}!", user.username.unwrap_or_default())
}`}
          language="rust"
          filename="example.rs"
        />

        <Callout type="tip" title="Framework Agnostic Core">
          The core authentication logic in <code className="inline-code">authkestra-flow</code> is 
          pure Rust, completely independent of any web framework. Framework adapters like 
          <code className="inline-code">authkestra-axum</code> provide the integration layer.
        </Callout>

        <h2 id="key-features">Key Features</h2>

        <div className="grid sm:grid-cols-2 gap-4 my-8">
          {[
            {
              icon: Box,
              title: "Modular Design",
              description: "Strictly separated concerns with composable crates",
            },
            {
              icon: Workflow,
              title: "Explicit Control Flow",
              description: "No magic middleware or implicit context",
            },
            {
              icon: Shield,
              title: "Provider Agnostic",
              description: "Easily implement new OAuth providers via traits",
            },
            {
              icon: Key,
              title: "Session & JWT Support",
              description: "Flexible session stores and stateless token management",
            },
          ].map((feature) => (
            <div key={feature.title} className="feature-card">
              <feature.icon className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold mb-1">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <h2 id="workspace-crates">Workspace Crates</h2>

        <p>
          Authkestra is organized as a Cargo workspace with specialized crates for different 
          responsibilities. You can use the <code className="inline-code">authkestra</code> facade 
          crate with feature flags, or import individual crates directly.
        </p>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Crate</th>
                <th>Responsibility</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="inline-code">authkestra</code></td>
                <td>Primary facade - re-exports all crates behind features</td>
              </tr>
              <tr>
                <td><code className="inline-code">authkestra-core</code></td>
                <td>Foundational types and traits (Identity, OAuthProvider, SessionStore)</td>
              </tr>
              <tr>
                <td><code className="inline-code">authkestra-flow</code></td>
                <td>Orchestrates OAuth2/OIDC flows (Authorization Code, PKCE, Device Flow)</td>
              </tr>
              <tr>
                <td><code className="inline-code">authkestra-session</code></td>
                <td>Session persistence layer (Memory, Redis, SQL)</td>
              </tr>
              <tr>
                <td><code className="inline-code">authkestra-token</code></td>
                <td>JWT signing, verification, and offline validation</td>
              </tr>
              <tr>
                <td><code className="inline-code">authkestra-oidc</code></td>
                <td>OpenID Connect discovery and validation</td>
              </tr>
              <tr>
                <td><code className="inline-code">authkestra-axum</code></td>
                <td>Axum integration with extractors and route helpers</td>
              </tr>
              <tr>
                <td><code className="inline-code">authkestra-actix</code></td>
                <td>Actix-web integration</td>
              </tr>
              <tr>
                <td><code className="inline-code">authkestra-providers-*</code></td>
                <td>Concrete provider implementations (GitHub, Google, Discord)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="design-philosophy">Design Philosophy</h2>

        <p>
          Authkestra favors <strong>compile-time guarantees</strong> over runtime flexibility:
        </p>

        <ul>
          <li>
            <strong>Trait-Based Extension:</strong> Customization is achieved by implementing 
            traits, not configuring dynamic strategies
          </li>
          <li>
            <strong>Explicit Injection:</strong> Authentication context is never implicitly 
            available; use extractors like <code className="inline-code">AuthSession</code>
          </li>
          <li>
            <strong>Framework Agnostic Core:</strong> The flow crate is pure Rust logic, 
            completely independent of any web framework
          </li>
        </ul>

        <h2 id="next-steps">Next Steps</h2>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <Link
            to="/docs/installation"
            className="feature-card group flex items-center justify-between"
          >
            <div>
              <h4 className="font-semibold">Installation</h4>
              <p className="text-sm text-muted-foreground">Add Authkestra to your project</p>
            </div>
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/docs/quickstart"
            className="feature-card group flex items-center justify-between"
          >
            <div>
              <h4 className="font-semibold">Quick Start</h4>
              <p className="text-sm text-muted-foreground">Build your first auth flow</p>
            </div>
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </DocsLayout>
  );
}

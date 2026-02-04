import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "using-facade", title: "Using the Facade Crate", level: 2 },
  { id: "available-features", title: "Available Features", level: 2 },
  { id: "individual-crates", title: "Using Individual Crates", level: 2 },
  { id: "runtime-requirements", title: "Runtime Requirements", level: 2 },
];

export default function DocsInstallation() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Installation</h1>

        <p className="text-xl leading-relaxed">
          The easiest way to use Authkestra is via the facade crate with feature flags, 
          allowing you to manage your authentication stack from a single dependency.
        </p>

        <h2 id="using-facade">Using the Facade Crate</h2>

        <p>
          Add <code className="inline-code">authkestra</code> to your <code className="inline-code">Cargo.toml</code> with 
          the features you need:
        </p>

        <CodeBlock
          code={`[dependencies]
# Use the facade with the features you need
authkestra = { version = "0.1.0", features = ["axum", "github"] }

# Async runtime
tokio = { version = "1", features = ["full"] }

# For environment variables
dotenvy = "0.15"`}
          language="toml"
          filename="Cargo.toml"
        />

        <Callout type="info" title="Feature Flags">
          Authkestra uses Cargo features to enable only what you need. This keeps compile times 
          fast and binary sizes small.
        </Callout>

        <h2 id="available-features">Available Features</h2>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="inline-code">axum</code></td>
                <td>Axum framework integration with extractors and route helpers</td>
              </tr>
              <tr>
                <td><code className="inline-code">actix</code></td>
                <td>Actix-web framework integration</td>
              </tr>
              <tr>
                <td><code className="inline-code">github</code></td>
                <td>GitHub OAuth provider</td>
              </tr>
              <tr>
                <td><code className="inline-code">google</code></td>
                <td>Google OAuth provider</td>
              </tr>
              <tr>
                <td><code className="inline-code">discord</code></td>
                <td>Discord OAuth provider</td>
              </tr>
              <tr>
                <td><code className="inline-code">oidc</code></td>
                <td>OpenID Connect support with discovery and validation</td>
              </tr>
              <tr>
                <td><code className="inline-code">session-redis</code></td>
                <td>Redis session store</td>
              </tr>
              <tr>
                <td><code className="inline-code">session-sql</code></td>
                <td>SQL session store (Postgres, MySQL, SQLite)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>You can combine multiple features:</p>

        <CodeBlock
          code={`[dependencies]
authkestra = { version = "0.1.0", features = [
    "axum",
    "github",
    "google",
    "discord",
    "oidc",
    "session-sql"
] }`}
          language="toml"
          filename="Cargo.toml"
        />

        <h2 id="individual-crates">Using Individual Crates</h2>

        <p>
          For advanced users, individual crates can be used independently:
        </p>

        <CodeBlock
          code={`[dependencies]
authkestra-core = "0.1"
authkestra-flow = "0.1"
authkestra-axum = "0.1"
authkestra-providers-github = "0.1"
authkestra-session = { version = "0.1", features = ["sql"] }`}
          language="toml"
          filename="Cargo.toml"
        />

        <Callout type="tip" title="When to use individual crates">
          Use individual crates when you need fine-grained control over versions, or when 
          implementing custom providers or session stores that don't need the full stack.
        </Callout>

        <h2 id="runtime-requirements">Runtime Requirements</h2>

        <p>Authkestra is async-first and requires a Tokio runtime:</p>

        <CodeBlock
          code={`[dependencies]
tokio = { version = "1", features = ["full"] }

# Or minimal features for smaller binaries:
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }`}
          language="toml"
          filename="Cargo.toml"
        />

        <Callout type="warning" title="Environment Variables">
          Most examples use <code className="inline-code">dotenvy</code> to load environment variables from 
          a <code className="inline-code">.env</code> file. Make sure to add it to your dependencies if you're 
          following along with the examples.
        </Callout>

      </motion.div>
    </DocsLayout>
  );
}

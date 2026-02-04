import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "session-config", title: "SessionConfig", level: 2 },
  { id: "cookie-settings", title: "Cookie Settings", level: 2 },
  { id: "ttl-strategies", title: "TTL Strategies", level: 2 },
  { id: "security-options", title: "Security Options", level: 2 },
];

export default function DocsSessionsConfig() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Session Configuration</h1>

        <p className="text-xl leading-relaxed">
          Configure session behavior including TTL, cookie settings, and security options.
        </p>

        <h2 id="session-config">SessionConfig</h2>

        <CodeBlock
          code={`use authkestra_core::SessionConfig;
use std::time::Duration;

let config = SessionConfig {
    // Session time-to-live
    ttl: Duration::from_secs(24 * 60 * 60), // 24 hours
    
    // Cookie name
    cookie_name: "authkestra_session".to_string(),
    
    // Cookie path
    cookie_path: "/".to_string(),
    
    // Secure cookie (HTTPS only)
    cookie_secure: true,
    
    // HTTP-only cookie (no JavaScript access)
    cookie_http_only: true,
    
    // Same-site policy
    cookie_same_site: SameSite::Lax,
};

let authkestra = Authkestra::builder()
    .provider(OAuth2Flow::new(provider))
    .session_config(config)
    .build();`}
          language="rust"
          filename="session_config.rs"
        />

        <h2 id="cookie-settings">Cookie Settings</h2>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Setting</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="inline-code">cookie_name</code></td>
                <td><code className="inline-code">"authkestra_session"</code></td>
                <td>Name of the session cookie</td>
              </tr>
              <tr>
                <td><code className="inline-code">cookie_path</code></td>
                <td><code className="inline-code">"/"</code></td>
                <td>Path scope for the cookie</td>
              </tr>
              <tr>
                <td><code className="inline-code">cookie_secure</code></td>
                <td><code className="inline-code">true</code></td>
                <td>Only send over HTTPS</td>
              </tr>
              <tr>
                <td><code className="inline-code">cookie_http_only</code></td>
                <td><code className="inline-code">true</code></td>
                <td>Prevent JavaScript access</td>
              </tr>
              <tr>
                <td><code className="inline-code">cookie_same_site</code></td>
                <td><code className="inline-code">Lax</code></td>
                <td>Same-site policy (Strict, Lax, None)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout type="warning" title="Development Mode">
          Set <code className="inline-code">cookie_secure: false</code> for local development without HTTPS. 
          Always enable it in production.
        </Callout>

        <h2 id="ttl-strategies">TTL Strategies</h2>

        <p>Choose a TTL based on your security requirements:</p>

        <CodeBlock
          code={`// Short-lived sessions (high security)
let config = SessionConfig {
    ttl: Duration::from_secs(30 * 60), // 30 minutes
    ..Default::default()
};

// Standard web app
let config = SessionConfig {
    ttl: Duration::from_secs(24 * 60 * 60), // 24 hours
    ..Default::default()
};

// "Remember me" sessions
let config = SessionConfig {
    ttl: Duration::from_secs(30 * 24 * 60 * 60), // 30 days
    ..Default::default()
};`}
          language="rust"
        />

        <Callout type="tip" title="Sliding Expiration">
          Use the <code className="inline-code">touch()</code> method to extend session life on activity. 
          This implements sliding expiration where active users stay logged in.
        </Callout>

        <h2 id="security-options">Security Options</h2>

        <p>Same-site cookie policies explained:</p>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Policy</th>
                <th>Behavior</th>
                <th>Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="inline-code">Strict</code></td>
                <td>Never sent cross-site</td>
                <td>Maximum security, may affect OAuth redirects</td>
              </tr>
              <tr>
                <td><code className="inline-code">Lax</code></td>
                <td>Sent on top-level navigations</td>
                <td>Recommended for most apps</td>
              </tr>
              <tr>
                <td><code className="inline-code">None</code></td>
                <td>Sent on all requests</td>
                <td>Required for cross-site embeds (requires Secure)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          code={`use tower_cookies::cookie::SameSite;

// For OAuth flows, Lax is recommended
let config = SessionConfig {
    cookie_same_site: SameSite::Lax,
    cookie_secure: true,
    cookie_http_only: true,
    ..Default::default()
};

// For embedded widgets or cross-origin requests
let config = SessionConfig {
    cookie_same_site: SameSite::None,
    cookie_secure: true, // Required for SameSite=None
    ..Default::default()
};`}
          language="rust"
        />

      </motion.div>
    </DocsLayout>
  );
}

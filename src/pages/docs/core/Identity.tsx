import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "identity-struct", title: "Identity Struct", level: 2 },
  { id: "fields", title: "Fields", level: 3 },
  { id: "attributes", title: "Custom Attributes", level: 3 },
  { id: "working-with-identity", title: "Working with Identity", level: 2 },
];

export default function DocsCoreIdentity() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Identity</h1>

        <p className="text-xl leading-relaxed">
          The <code className="inline-code">Identity</code> struct is the unified representation of an 
          authenticated user in Authkestra, regardless of which provider they used.
        </p>

        <h2 id="overview">Overview</h2>

        <p>
          When a user authenticates via OAuth, OIDC, or direct credentials, Authkestra normalizes 
          their profile information into an <code className="inline-code">Identity</code>. This provides a 
          consistent interface for working with user data across all authentication methods.
        </p>

        <h2 id="identity-struct">Identity Struct</h2>

        <CodeBlock
          code={`use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Identity {
    /// The provider that authenticated this identity (e.g., "github", "google")
    pub provider_id: String,
    
    /// The unique identifier from the provider
    pub external_id: String,
    
    /// The user's email address, if provided
    pub email: Option<String>,
    
    /// The user's username or display name
    pub username: Option<String>,
    
    /// Additional provider-specific attributes
    pub attributes: HashMap<String, String>,
}`}
          language="rust"
          filename="authkestra-core/src/identity.rs"
        />

        <h3 id="fields">Fields</h3>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="inline-code">provider_id</code></td>
                <td><code className="inline-code">String</code></td>
                <td>Identifies the authentication provider (e.g., "github", "credentials")</td>
              </tr>
              <tr>
                <td><code className="inline-code">external_id</code></td>
                <td><code className="inline-code">String</code></td>
                <td>The user's unique ID from the provider</td>
              </tr>
              <tr>
                <td><code className="inline-code">email</code></td>
                <td><code className="inline-code">Option&lt;String&gt;</code></td>
                <td>Email address if available and consented</td>
              </tr>
              <tr>
                <td><code className="inline-code">username</code></td>
                <td><code className="inline-code">Option&lt;String&gt;</code></td>
                <td>Username or display name</td>
              </tr>
              <tr>
                <td><code className="inline-code">attributes</code></td>
                <td><code className="inline-code">HashMap&lt;String, String&gt;</code></td>
                <td>Additional provider-specific data</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 id="attributes">Custom Attributes</h3>

        <p>
          The <code className="inline-code">attributes</code> field allows providers to include additional 
          information that doesn't fit the standard fields. For example, GitHub might include:
        </p>

        <CodeBlock
          code={`// GitHub provider populates these attributes
identity.attributes.insert("avatar_url".to_string(), user.avatar_url);
identity.attributes.insert("html_url".to_string(), user.html_url);
identity.attributes.insert("company".to_string(), user.company.unwrap_or_default());`}
          language="rust"
        />

        <Callout type="info" title="Provider-Specific Data">
          Check each provider's documentation for the attributes it populates. You can also 
          implement custom providers that add domain-specific attributes.
        </Callout>

        <h2 id="working-with-identity">Working with Identity</h2>

        <p>
          The identity is typically accessed through the session in your route handlers:
        </p>

        <CodeBlock
          code={`use authkestra_axum::AuthSession;
use axum::response::IntoResponse;

async fn profile(session: AuthSession) -> impl IntoResponse {
    let identity = &session.0.identity;
    
    // Access standard fields
    let username = identity.username.as_deref().unwrap_or("Anonymous");
    let email = identity.email.as_deref().unwrap_or("Not provided");
    
    // Access provider-specific attributes
    let avatar = identity.attributes.get("avatar_url")
        .map(|s| s.as_str())
        .unwrap_or("/default-avatar.png");
    
    format!(
        "User: {} | Email: {} | Avatar: {}",
        username, email, avatar
    )
}`}
          language="rust"
          filename="example.rs"
        />

        <Callout type="tip" title="Type Safety">
          Consider creating a strongly-typed wrapper around Identity for your application 
          that validates and converts the fields you need. This catches missing data at 
          compile time rather than runtime.
        </Callout>

      </motion.div>
    </DocsLayout>
  );
}

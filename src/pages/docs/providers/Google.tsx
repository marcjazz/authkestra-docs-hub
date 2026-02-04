import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "setup", title: "Setup Guide", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "scopes", title: "Available Scopes", level: 2 },
];

export default function DocsProvidersGoogle() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Google Provider</h1>

        <p className="text-xl leading-relaxed">
          Integrate Google OAuth2 authentication with OpenID Connect support.
        </p>

        <h2 id="setup">Setup Guide</h2>

        <h3>1. Create Google OAuth Credentials</h3>

        <ol>
          <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener" className="text-primary underline">Google Cloud Console</a></li>
          <li>Create a new project or select an existing one</li>
          <li>Navigate to <strong>APIs & Services → Credentials</strong></li>
          <li>Click <strong>Create Credentials → OAuth client ID</strong></li>
          <li>Select <strong>Web application</strong></li>
          <li>Add authorized redirect URI: <code className="inline-code">http://localhost:3000/auth/google/callback</code></li>
          <li>Copy the <strong>Client ID</strong> and <strong>Client Secret</strong></li>
        </ol>

        <Callout type="info" title="OAuth Consent Screen">
          You'll need to configure the OAuth consent screen before creating credentials. 
          For development, you can use "External" type and add yourself as a test user.
        </Callout>

        <h3>2. Configure Environment</h3>

        <CodeBlock
          code={`AUTHKESTRA_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
AUTHKESTRA_GOOGLE_CLIENT_SECRET=your_client_secret
AUTHKESTRA_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback`}
          language="bash"
          filename=".env"
          showLineNumbers={false}
        />

        <h2 id="implementation">Implementation</h2>

        <CodeBlock
          code={`use authkestra_flow::OAuth2Flow;
use authkestra_providers_google::GoogleProvider;

// Create the Google provider
let provider = GoogleProvider::new(
    std::env::var("AUTHKESTRA_GOOGLE_CLIENT_ID").unwrap(),
    std::env::var("AUTHKESTRA_GOOGLE_CLIENT_SECRET").unwrap(),
    std::env::var("AUTHKESTRA_GOOGLE_REDIRECT_URI")
        .unwrap_or_else(|_| "http://localhost:3000/auth/google/callback".to_string()),
);

// Add to Authkestra
let authkestra = Authkestra::builder()
    .provider(OAuth2Flow::new(provider))
    .build();`}
          language="rust"
        />

        <h2 id="scopes">Available Scopes</h2>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Scope</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="inline-code">openid</code></td>
                <td>OpenID Connect identity (default)</td>
              </tr>
              <tr>
                <td><code className="inline-code">email</code></td>
                <td>User's email address</td>
              </tr>
              <tr>
                <td><code className="inline-code">profile</code></td>
                <td>Basic profile info (name, picture)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          code={`// Request specific scopes
let flow = OAuth2Flow::new(provider)
    .with_scopes(vec!["openid", "email", "profile"]);`}
          language="rust"
        />

        <h3>Identity Attributes</h3>

        <CodeBlock
          code={`// Google provider populates these attributes
let picture = identity.attributes.get("picture");  // Profile photo URL
let given_name = identity.attributes.get("given_name");
let family_name = identity.attributes.get("family_name");
let locale = identity.attributes.get("locale");
let verified_email = identity.attributes.get("verified_email");`}
          language="rust"
        />

      </motion.div>
    </DocsLayout>
  );
}

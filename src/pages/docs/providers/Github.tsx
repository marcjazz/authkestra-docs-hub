import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "github", title: "GitHub", level: 2 },
  { id: "google", title: "Google", level: 2 },
  { id: "discord", title: "Discord", level: 2 },
];

export default function DocsProvidersGithub() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>GitHub Provider</h1>

        <p className="text-xl leading-relaxed">
          Integrate GitHub OAuth2 authentication into your application.
        </p>

        <h2 id="github">Setup Guide</h2>

        <h3>1. Create GitHub OAuth App</h3>

        <ol>
          <li>Go to <strong>GitHub Settings → Developer settings → OAuth Apps</strong></li>
          <li>Click <strong>New OAuth App</strong></li>
          <li>Fill in the details:
            <ul>
              <li><strong>Application name:</strong> Your app name</li>
              <li><strong>Homepage URL:</strong> <code className="inline-code">http://localhost:3000</code></li>
              <li><strong>Authorization callback URL:</strong> <code className="inline-code">http://localhost:3000/auth/github/callback</code></li>
            </ul>
          </li>
          <li>Click <strong>Register application</strong></li>
          <li>Copy the <strong>Client ID</strong></li>
          <li>Generate a <strong>Client Secret</strong> and copy it</li>
        </ol>

        <Callout type="warning" title="Keep Your Secret Safe">
          Never commit your client secret to version control. Use environment variables.
        </Callout>

        <h3>2. Configure Environment</h3>

        <CodeBlock
          code={`AUTHKESTRA_GITHUB_CLIENT_ID=your_client_id
AUTHKESTRA_GITHUB_CLIENT_SECRET=your_client_secret
AUTHKESTRA_GITHUB_REDIRECT_URI=http://localhost:3000/auth/github/callback`}
          language="bash"
          filename=".env"
          showLineNumbers={false}
        />

        <h3>3. Implementation</h3>

        <CodeBlock
          code={`use authkestra_flow::OAuth2Flow;
use authkestra_providers_github::GithubProvider;

// Create the provider
let provider = GithubProvider::new(
    std::env::var("AUTHKESTRA_GITHUB_CLIENT_ID").unwrap(),
    std::env::var("AUTHKESTRA_GITHUB_CLIENT_SECRET").unwrap(),
    std::env::var("AUTHKESTRA_GITHUB_REDIRECT_URI")
        .unwrap_or_else(|_| "http://localhost:3000/auth/github/callback".to_string()),
);

// Add to Authkestra
let authkestra = Authkestra::builder()
    .provider(OAuth2Flow::new(provider))
    .build();`}
          language="rust"
        />

        <h3>Available Scopes</h3>

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
                <td><code className="inline-code">user</code></td>
                <td>Read/write access to profile info</td>
              </tr>
              <tr>
                <td><code className="inline-code">user:email</code></td>
                <td>Read access to user's email addresses</td>
              </tr>
              <tr>
                <td><code className="inline-code">read:user</code></td>
                <td>Read access to profile info (default)</td>
              </tr>
              <tr>
                <td><code className="inline-code">repo</code></td>
                <td>Full control of private repositories</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          code={`// Request specific scopes
let flow = OAuth2Flow::new(provider)
    .with_scopes(vec!["read:user", "user:email"]);`}
          language="rust"
        />

        <h3>Identity Attributes</h3>

        <p>GitHub provider populates these additional attributes:</p>

        <CodeBlock
          code={`// Available in identity.attributes
let avatar_url = identity.attributes.get("avatar_url");
let html_url = identity.attributes.get("html_url");  // GitHub profile URL
let company = identity.attributes.get("company");
let location = identity.attributes.get("location");
let bio = identity.attributes.get("bio");`}
          language="rust"
        />

      </motion.div>
    </DocsLayout>
  );
}

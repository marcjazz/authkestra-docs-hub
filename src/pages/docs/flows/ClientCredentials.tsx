import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "when-to-use", title: "When to Use", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "security", title: "Security Considerations", level: 2 },
];

const clientCredentialsCode = `use authkestra_flow::ClientCredentialsFlow;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Get credentials from environment
    let client_id = std::env::var("CLIENT_ID")
        .expect("CLIENT_ID must be set");
    let client_secret = std::env::var("CLIENT_SECRET")
        .expect("CLIENT_SECRET must be set");
    let token_url = std::env::var("TOKEN_URL")
        .unwrap_or_else(|_| "https://example.com/oauth/token".to_string());

    println!("Starting Client Credentials Flow...");

    // Create the flow
    let flow = ClientCredentialsFlow::new(client_id, client_secret, token_url);

    // Request a token with optional scopes
    let scopes = ["read", "write"];
    
    match flow.get_token(Some(&scopes)).await {
        Ok(token) => {
            println!("Successfully obtained access token!");
            println!("Access Token: {}", token.access_token);
            
            if let Some(expires_in) = token.expires_in {
                println!("Expires in: {} seconds", expires_in);
            }
            if let Some(scope) = token.scope {
                println!("Scopes: {}", scope);
            }
        }
        Err(e) => {
            eprintln!("Failed to obtain access token: {}", e);
        }
    }

    Ok(())
}`;

export default function DocsFlowsClientCredentials() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Client Credentials Flow</h1>

        <p className="text-xl leading-relaxed">
          The Client Credentials flow is used for machine-to-machine (M2M) authentication 
          where no user interaction is required.
        </p>

        <h2 id="overview">Overview</h2>

        <p>
          Unlike user-facing OAuth flows, the Client Credentials grant authenticates the 
          <em>application itself</em> rather than a user. The application presents its 
          client ID and secret directly to the authorization server in exchange for an 
          access token.
        </p>

        <h2 id="when-to-use">When to Use</h2>

        <p>Use Client Credentials when:</p>

        <ul>
          <li><strong>Backend Services:</strong> API-to-API communication between your services</li>
          <li><strong>Scheduled Jobs:</strong> Cron jobs or background workers that need API access</li>
          <li><strong>Microservices:</strong> Internal service authentication in a microservices architecture</li>
          <li><strong>CLI Tools:</strong> Automated scripts that run without user intervention</li>
        </ul>

        <Callout type="warning" title="Not for User Authentication">
          Client Credentials should never be used to authenticate end users. Use the 
          Authorization Code flow or other user-facing flows instead.
        </Callout>

        <h2 id="implementation">Implementation</h2>

        <CodeBlock
          code={clientCredentialsCode}
          language="rust"
          filename="client_credentials.rs"
        />

        <p>Using the token in your API calls:</p>

        <CodeBlock
          code={`use reqwest::Client;

async fn call_protected_api(token: &str) -> Result<String, reqwest::Error> {
    let client = Client::new();
    
    let response = client
        .get("https://api.example.com/data")
        .bearer_auth(token)  // Add the access token
        .send()
        .await?
        .text()
        .await?;
    
    Ok(response)
}

// Usage
let token = flow.get_token(Some(&["read"])).await?;
let data = call_protected_api(&token.access_token).await?;`}
          language="rust"
        />

        <h2 id="security">Security Considerations</h2>

        <Callout type="danger" title="Protect Your Secrets">
          <ul className="mt-2">
            <li>Never expose client secrets in client-side code or version control</li>
            <li>Use environment variables or secure secret management</li>
            <li>Rotate secrets regularly</li>
            <li>Use the minimum required scopes</li>
          </ul>
        </Callout>

        <CodeBlock
          code={`// Good: Load from environment
let secret = std::env::var("CLIENT_SECRET")?;

// Better: Use a secrets manager
let secret = secrets_manager.get_secret("oauth/client-secret").await?;

// Never: Hardcode secrets
let secret = "my-super-secret-key"; // DON'T DO THIS`}
          language="rust"
        />

      </motion.div>
    </DocsLayout>
  );
}

import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "how-it-works", title: "How It Works", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "use-cases", title: "Use Cases", level: 2 },
];

const deviceFlowCode = `use authkestra_flow::DeviceFlow;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // GitHub's Device Authorization Flow endpoints
    let client_id = std::env::var("GITHUB_CLIENT_ID")
        .expect("GITHUB_CLIENT_ID must be set");
    let device_auth_url = "https://github.com/login/device/code";
    let token_url = "https://github.com/login/oauth/access_token";

    let flow = DeviceFlow::new(
        client_id,
        device_auth_url.to_string(),
        token_url.to_string(),
    );

    println!("Initiating device authorization flow...");

    // 1. Request device authorization
    let device_resp = flow
        .initiate_device_authorization(&["user", "repo"])
        .await?;

    // 2. Display the verification URL and code to the user
    println!("\\n1. Open your browser and go to: {}", device_resp.verification_uri);
    println!("2. Enter the code: {}", device_resp.user_code);

    if let Some(complete_uri) = &device_resp.verification_uri_complete {
        println!("\\nOR just open this URL directly: {}", complete_uri);
    }

    println!("\\nWaiting for authorization...");

    // 3. Poll for the token (blocks until authorized or timeout)
    match flow.poll_for_token(&device_resp.device_code, device_resp.interval).await {
        Ok(token) => {
            println!("\\nAuthorization successful!");
            println!("Access Token: {}", token.access_token);
            if let Some(scope) = token.scope {
                println!("Scopes: {}", scope);
            }
        }
        Err(e) => {
            eprintln!("\\nAuthorization failed: {}", e);
        }
    }

    Ok(())
}`;

export default function DocsFlowsDevice() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Device Flow</h1>

        <p className="text-xl leading-relaxed">
          The Device Authorization Flow (RFC 8628) enables authentication on devices with 
          limited input capabilities, like smart TVs, CLI tools, or IoT devices.
        </p>

        <h2 id="overview">Overview</h2>

        <p>
          When a device can't easily handle browser redirects or has no keyboard, the Device 
          Flow lets users authenticate by entering a short code on a separate device (like 
          their phone or computer).
        </p>

        <h2 id="how-it-works">How It Works</h2>

        <ol>
          <li>Device requests authorization from the provider</li>
          <li>Provider returns a user code and verification URL</li>
          <li>Device displays the code and URL to the user</li>
          <li>User visits the URL on another device and enters the code</li>
          <li>User authenticates and authorizes</li>
          <li>Device polls the token endpoint until authorization completes</li>
          <li>Provider returns access tokens to the device</li>
        </ol>

        <Callout type="info" title="Provider Support">
          Not all OAuth providers support Device Flow. GitHub, Google, and Microsoft are 
          common providers that do. Check your provider's documentation.
        </Callout>

        <h2 id="implementation">Implementation</h2>

        <p>Here's a complete example using GitHub's Device Flow:</p>

        <CodeBlock
          code={deviceFlowCode}
          language="rust"
          filename="device_flow.rs"
        />

        <Callout type="tip" title="Polling Interval">
          The <code className="inline-code">device_resp.interval</code> contains the minimum polling interval 
          (in seconds) specified by the provider. Polling more frequently may result in 
          rate limiting errors.
        </Callout>

        <h2 id="use-cases">Use Cases</h2>

        <p>Device Flow is ideal for:</p>

        <ul>
          <li><strong>CLI Applications:</strong> Authenticate users in terminal-based tools</li>
          <li><strong>Smart TVs:</strong> Login on devices with limited input</li>
          <li><strong>IoT Devices:</strong> Secure authentication for connected devices</li>
          <li><strong>Gaming Consoles:</strong> User authentication without a keyboard</li>
          <li><strong>Kiosk Mode:</strong> Public terminals or shared devices</li>
        </ul>

        <CodeBlock
          code={`// Example: CLI tool authentication
fn main() {
    println!("Welcome to MyCLI!");
    println!("You need to authenticate to continue.\\n");
    
    // Start device flow
    let token = authenticate_with_device_flow().await?;
    
    // Save token for future use
    save_token_to_config(&token)?;
    
    println!("Authenticated! You can now use the CLI.");
}`}
          language="rust"
        />

      </motion.div>
    </DocsLayout>
  );
}

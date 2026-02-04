import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const tocItems = [
  { id: "prerequisites", title: "Prerequisites", level: 2 },
  { id: "project-setup", title: "Project Setup", level: 2 },
  { id: "github-oauth-setup", title: "GitHub OAuth Setup", level: 2 },
  { id: "full-example", title: "Full Example", level: 2 },
  { id: "testing", title: "Testing the Flow", level: 2 },
];

const fullExampleCode = `use authkestra_axum::{AuthSession, Authkestra, AuthkestraAxumExt, AuthkestraState};
use authkestra_core::SessionStore;
use authkestra_flow::OAuth2Flow;
use authkestra_providers_github::GithubProvider;
use axum::{
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use std::sync::Arc;
use tower_cookies::CookieManagerLayer;

#[derive(Clone)]
struct AppState {
    authkestra_state: AuthkestraState,
}

// Implement FromRef for Axum's state extraction
impl axum::extract::FromRef<AppState> for AuthkestraState {
    fn from_ref(state: &AppState) -> Self {
        state.authkestra_state.clone()
    }
}

impl axum::extract::FromRef<AppState> for Authkestra {
    fn from_ref(state: &AppState) -> Self {
        state.authkestra_state.authkestra.clone()
    }
}

impl axum::extract::FromRef<AppState> for Arc<dyn SessionStore> {
    fn from_ref(state: &AppState) -> Self {
        state.authkestra_state.authkestra.session_store.clone()
    }
}

#[tokio::main]
async fn main() {
    // Load environment variables
    dotenvy::dotenv().ok();

    // Get OAuth credentials from environment
    let client_id = std::env::var("GITHUB_CLIENT_ID")
        .expect("GITHUB_CLIENT_ID must be set");
    let client_secret = std::env::var("GITHUB_CLIENT_SECRET")
        .expect("GITHUB_CLIENT_SECRET must be set");
    let redirect_uri = "http://localhost:3000/auth/github/callback".to_string();

    // Create the GitHub provider
    let provider = GithubProvider::new(client_id, client_secret, redirect_uri);

    // Build Authkestra with the provider
    let authkestra = Authkestra::builder()
        .provider(OAuth2Flow::new(provider))
        .build();

    let authkestra_state = AuthkestraState::new(authkestra);
    let state = AppState { authkestra_state };

    // Build the router with authentication routes
    let app = Router::new()
        .route("/", get(index))
        .route("/protected", get(protected))
        .authkestra_routes(&state.authkestra_state.authkestra)
        .layer(CookieManagerLayer::new())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("🚀 Server running at http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}

async fn index() -> impl IntoResponse {
    Html(r#"
        <h1>Welcome to Authkestra Demo</h1>
        <p><a href="/auth/github">Login with GitHub</a></p>
        <p><a href="/protected">Protected Page</a></p>
    "#)
}

async fn protected(session: AuthSession) -> impl IntoResponse {
    let identity = &session.0.identity;
    Html(format!(
        r#"
        <h1>Protected Page</h1>
        <p>Hello, {}!</p>
        <p>Email: {}</p>
        <p>Provider: {}</p>
        <p><a href="/">Home</a></p>
        "#,
        identity.username.clone().unwrap_or_else(|| "Unknown".to_string()),
        identity.email.clone().unwrap_or_else(|| "Not provided".to_string()),
        identity.provider_id
    ))
}`;

export default function DocsQuickstart() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Quick Start</h1>

        <p className="text-xl leading-relaxed">
          This guide walks you through creating a simple web application with GitHub OAuth 
          authentication using Authkestra and Axum.
        </p>

        <h2 id="prerequisites">Prerequisites</h2>

        <ul>
          <li>Rust 1.70 or later</li>
          <li>A GitHub OAuth application (we'll create one below)</li>
          <li>Basic familiarity with Axum or async Rust</li>
        </ul>

        <h2 id="project-setup">Project Setup</h2>

        <p>Create a new Rust project and add the dependencies:</p>

        <CodeBlock
          code={`cargo new authkestra-demo
cd authkestra-demo`}
          language="bash"
          showLineNumbers={false}
        />

        <p>Update your <code className="inline-code">Cargo.toml</code>:</p>

        <CodeBlock
          code={`[package]
name = "authkestra-demo"
version = "0.1.0"
edition = "2021"

[dependencies]
authkestra = { version = "0.1.0", features = ["axum", "github"] }
axum = "0.7"
tokio = { version = "1", features = ["full"] }
tower-cookies = "0.10"
dotenvy = "0.15"`}
          language="toml"
          filename="Cargo.toml"
        />

        <h2 id="github-oauth-setup">GitHub OAuth Setup</h2>

        <p>Create a GitHub OAuth application:</p>

        <ol>
          <li>Go to <strong>GitHub Settings → Developer settings → OAuth Apps → New OAuth App</strong></li>
          <li>Set the <strong>Homepage URL</strong> to <code className="inline-code">http://localhost:3000</code></li>
          <li>Set the <strong>Authorization callback URL</strong> to <code className="inline-code">http://localhost:3000/auth/github/callback</code></li>
          <li>Copy your Client ID and Client Secret</li>
        </ol>

        <p>Create a <code className="inline-code">.env</code> file:</p>

        <CodeBlock
          code={`GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here`}
          language="bash"
          filename=".env"
          showLineNumbers={false}
        />

        <Callout type="warning" title="Security">
          Never commit your <code className="inline-code">.env</code> file to version control. 
          Add it to your <code className="inline-code">.gitignore</code>.
        </Callout>

        <h2 id="full-example">Full Example</h2>

        <p>Here's a complete working example:</p>

        <CodeBlock
          code={fullExampleCode}
          language="rust"
          filename="src/main.rs"
        />

        <h2 id="testing">Testing the Flow</h2>

        <p>Run the application:</p>

        <CodeBlock
          code={`cargo run`}
          language="bash"
          showLineNumbers={false}
        />

        <p>Then:</p>

        <ol>
          <li>Visit <code className="inline-code">http://localhost:3000</code></li>
          <li>Click "Login with GitHub"</li>
          <li>Authorize the application on GitHub</li>
          <li>You'll be redirected back and can access the protected page</li>
        </ol>

        <Callout type="tip" title="What's happening?">
          Authkestra automatically registers the <code className="inline-code">/auth/github</code> and 
          <code className="inline-code">/auth/github/callback</code> routes. The <code className="inline-code">AuthSession</code> extractor 
          validates the session cookie and provides access to the user's identity.
        </Callout>

        <h2>Next Steps</h2>

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <Link
            to="/docs/core/identity"
            className="feature-card group flex items-center justify-between"
          >
            <div>
              <h4 className="font-semibold">Core Concepts</h4>
              <p className="text-sm text-muted-foreground">Learn about Identity and traits</p>
            </div>
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/docs/flows/oauth2"
            className="feature-card group flex items-center justify-between"
          >
            <div>
              <h4 className="font-semibold">OAuth2 Flows</h4>
              <p className="text-sm text-muted-foreground">Understand the authentication flow</p>
            </div>
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </DocsLayout>
  );
}

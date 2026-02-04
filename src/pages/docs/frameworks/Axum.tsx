import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "setup", title: "Setup", level: 2 },
  { id: "state-management", title: "State Management", level: 2 },
  { id: "extractors", title: "Extractors", level: 2 },
  { id: "multiple-providers", title: "Multiple Providers", level: 2 },
  { id: "full-example", title: "Full Example", level: 2 },
];

const multiProviderExample = `use authkestra_axum::{AuthSession, Authkestra, AuthkestraAxumExt, AuthkestraState};
use authkestra_flow::OAuth2Flow;
use authkestra_providers_discord::DiscordProvider;
use authkestra_providers_github::GithubProvider;
use authkestra_providers_google::GoogleProvider;
use axum::{response::Html, routing::get, Router};
use tower_cookies::CookieManagerLayer;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let mut builder = Authkestra::builder();

    // --- GitHub ---
    if let (Ok(client_id), Ok(client_secret)) = (
        std::env::var("GITHUB_CLIENT_ID"),
        std::env::var("GITHUB_CLIENT_SECRET"),
    ) {
        let provider = GithubProvider::new(
            client_id,
            client_secret,
            "http://localhost:3000/auth/github/callback".to_string(),
        );
        builder = builder.provider(OAuth2Flow::new(provider));
    }

    // --- Google ---
    if let (Ok(client_id), Ok(client_secret)) = (
        std::env::var("GOOGLE_CLIENT_ID"),
        std::env::var("GOOGLE_CLIENT_SECRET"),
    ) {
        let provider = GoogleProvider::new(
            client_id,
            client_secret,
            "http://localhost:3000/auth/google/callback".to_string(),
        );
        builder = builder.provider(OAuth2Flow::new(provider));
    }

    // --- Discord ---
    if let (Ok(client_id), Ok(client_secret)) = (
        std::env::var("DISCORD_CLIENT_ID"),
        std::env::var("DISCORD_CLIENT_SECRET"),
    ) {
        let provider = DiscordProvider::new(
            client_id,
            client_secret,
            "http://localhost:3000/auth/discord/callback".to_string(),
        );
        builder = builder.provider(OAuth2Flow::new(provider));
    }

    let authkestra = builder.build();
    let state = AuthkestraState::new(authkestra);

    let app = Router::new()
        .route("/", get(index))
        .route("/protected", get(protected))
        .authkestra_routes(&state.authkestra)
        .layer(CookieManagerLayer::new())
        .with_state(state);

    println!("🚀 Server running at http://localhost:3000");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn index() -> Html<&'static str> {
    Html(r#"
        <h1>Choose a login provider:</h1>
        <ul>
            <li><a href="/auth/github">Login with GitHub</a></li>
            <li><a href="/auth/google">Login with Google</a></li>
            <li><a href="/auth/discord">Login with Discord</a></li>
        </ul>
    "#)
}

async fn protected(session: AuthSession) -> Html<String> {
    let identity = &session.0.identity;
    Html(format!(
        "<h1>Welcome!</h1><p>Logged in as {} via {}</p>",
        identity.username.as_deref().unwrap_or("User"),
        identity.provider_id
    ))
}`;

export default function DocsFrameworksAxum() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Axum Integration</h1>

        <p className="text-xl leading-relaxed">
          Use <code className="inline-code">authkestra-axum</code> to integrate authentication into 
          your Axum applications with type-safe extractors and state management.
        </p>

        <h2 id="overview">Overview</h2>

        <p>
          The Axum adapter provides:
        </p>

        <ul>
          <li><code className="inline-code">AuthSession</code> extractor for session-based auth</li>
          <li><code className="inline-code">AuthkestraState</code> for Axum state integration</li>
          <li>Route helpers for automatic OAuth endpoint registration</li>
          <li>Full support for Axum's <code className="inline-code">FromRef</code> pattern</li>
        </ul>

        <h2 id="setup">Setup</h2>

        <CodeBlock
          code={`[dependencies]
authkestra = { version = "0.1.0", features = ["axum", "github"] }
axum = "0.7"
tower-cookies = "0.10"
tokio = { version = "1", features = ["full"] }
dotenvy = "0.15"`}
          language="toml"
          filename="Cargo.toml"
        />

        <h2 id="state-management">State Management</h2>

        <p>
          Axum uses the <code className="inline-code">FromRef</code> trait for state extraction. Authkestra 
          provides <code className="inline-code">AuthkestraState</code> to simplify this:
        </p>

        <CodeBlock
          code={`use authkestra_axum::{Authkestra, AuthkestraState};
use authkestra_core::SessionStore;
use std::sync::Arc;

// Your app state can include AuthkestraState
#[derive(Clone)]
struct AppState {
    authkestra_state: AuthkestraState,
    // ... your other state fields
}

// Implement FromRef for Axum extractors
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
}`}
          language="rust"
        />

        <h2 id="extractors">Extractors</h2>

        <p>
          Use <code className="inline-code">AuthSession</code> to get the authenticated user:
        </p>

        <CodeBlock
          code={`use authkestra_axum::AuthSession;
use axum::response::IntoResponse;

async fn protected(session: AuthSession) -> impl IntoResponse {
    let identity = &session.0.identity;
    
    // Access user data
    let username = identity.username.as_deref().unwrap_or("Anonymous");
    let email = identity.email.as_deref().unwrap_or("Not provided");
    
    format!("Hello {} ({})!", username, email)
}

// Optional session - returns Option<AuthSession>
async fn maybe_protected(session: Option<AuthSession>) -> impl IntoResponse {
    match session {
        Some(s) => format!("Logged in as {}", s.0.identity.username.unwrap_or_default()),
        None => "Not logged in".to_string(),
    }
}`}
          language="rust"
        />

        <Callout type="info" title="Automatic 401">
          If <code className="inline-code">AuthSession</code> extraction fails (no session or expired), 
          Axum automatically returns a 401 Unauthorized response.
        </Callout>

        <h2 id="multiple-providers">Multiple Providers</h2>

        <p>
          Authkestra makes it easy to support multiple OAuth providers:
        </p>

        <CodeBlock
          code={multiProviderExample}
          language="rust"
          filename="axum_oauth.rs"
        />

        <h2 id="full-example">Full Example</h2>

        <Callout type="tip" title="Environment Variables">
          Create a <code className="inline-code">.env</code> file with your OAuth credentials:
        </Callout>

        <CodeBlock
          code={`GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret`}
          language="bash"
          filename=".env"
          showLineNumbers={false}
        />

      </motion.div>
    </DocsLayout>
  );
}

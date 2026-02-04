import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "authorization-code", title: "Authorization Code Grant", level: 2 },
  { id: "how-it-works", title: "How It Works", level: 3 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "pkce", title: "PKCE Enhancement", level: 2 },
];

export default function DocsFlowsOAuth2() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>OAuth2 Flow</h1>

        <p className="text-xl leading-relaxed">
          The OAuth2 Authorization Code Grant is the most common flow for web applications 
          to authenticate users via third-party providers like GitHub, Google, or Discord.
        </p>

        <h2 id="overview">Overview</h2>

        <p>
          Authkestra's <code className="inline-code">OAuth2Flow</code> handles the complete authorization code 
          grant process, including state management, code exchange, and user info retrieval.
        </p>

        <h2 id="authorization-code">Authorization Code Grant</h2>

        <h3 id="how-it-works">How It Works</h3>

        <ol>
          <li>User clicks "Login with Provider"</li>
          <li>Your app redirects to the provider's authorization endpoint</li>
          <li>User authenticates and authorizes your app</li>
          <li>Provider redirects back with an authorization code</li>
          <li>Your app exchanges the code for tokens</li>
          <li>Your app fetches user info using the access token</li>
          <li>Session is created and user is logged in</li>
        </ol>

        <Callout type="info" title="Automatic Routes">
          When you call <code className="inline-code">.authkestra_routes()</code>, Authkestra automatically registers 
          routes for each provider: <code className="inline-code">/auth/{"{provider}"}</code> (login) and 
          <code className="inline-code">/auth/{"{provider}"}/callback</code> (callback).
        </Callout>

        <h2 id="implementation">Implementation</h2>

        <p>Here's a complete example with GitHub OAuth:</p>

        <CodeBlock
          code={`use authkestra_axum::{AuthSession, Authkestra, AuthkestraAxumExt, AuthkestraState};
use authkestra_flow::OAuth2Flow;
use authkestra_providers_github::GithubProvider;
use axum::{response::IntoResponse, routing::get, Router};
use tower_cookies::CookieManagerLayer;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    // Configure the GitHub provider
    let github = GithubProvider::new(
        std::env::var("GITHUB_CLIENT_ID").expect("GITHUB_CLIENT_ID required"),
        std::env::var("GITHUB_CLIENT_SECRET").expect("GITHUB_CLIENT_SECRET required"),
        "http://localhost:3000/auth/github/callback".to_string(),
    );

    // Build Authkestra with OAuth2 flow
    let authkestra = Authkestra::builder()
        .provider(OAuth2Flow::new(github))
        .build();

    let state = AuthkestraState::new(authkestra);

    let app = Router::new()
        .route("/", get(|| async { "Home" }))
        .route("/protected", get(protected))
        // This adds /auth/github and /auth/github/callback
        .authkestra_routes(&state.authkestra)
        .layer(CookieManagerLayer::new())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn protected(session: AuthSession) -> impl IntoResponse {
    format!("Hello, {}!", session.0.identity.username.unwrap_or_default())
}`}
          language="rust"
          filename="main.rs"
        />

        <h2 id="pkce">PKCE Enhancement</h2>

        <p>
          PKCE (Proof Key for Code Exchange) adds an extra layer of security to the OAuth 
          flow, preventing authorization code interception attacks.
        </p>

        <CodeBlock
          code={`use authkestra_flow::OAuth2Flow;

// PKCE is enabled by default for providers that support it
let flow = OAuth2Flow::new(provider)
    .with_pkce(true); // Explicitly enable PKCE

// For public clients (SPAs), PKCE is essential
let spa_flow = OAuth2Flow::new(provider)
    .with_pkce(true)
    .with_scopes(vec!["read:user", "user:email"]);`}
          language="rust"
        />

        <Callout type="tip" title="When to use PKCE">
          Always use PKCE for:
          <ul className="mt-2">
            <li>Single-page applications (SPAs)</li>
            <li>Mobile applications</li>
            <li>Any public client that can't securely store a client secret</li>
          </ul>
        </Callout>

      </motion.div>
    </DocsLayout>
  );
}

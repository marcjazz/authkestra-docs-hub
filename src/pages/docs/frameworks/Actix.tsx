import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "setup", title: "Setup", level: 2 },
  { id: "extractors", title: "Extractors", level: 2 },
  { id: "route-helpers", title: "Route Helpers", level: 2 },
  { id: "jwt-mode", title: "JWT Mode (SPA)", level: 2 },
  { id: "full-example", title: "Full Example", level: 2 },
];

const fullActixExample = `use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use authkestra_actix::{AuthSession, AuthkestraActixExt};
use authkestra_core::{SessionConfig, SessionStore};
use authkestra_flow::{Authkestra, OAuth2Flow};
use authkestra_providers_github::GithubProvider;
use authkestra_session::SqlStore;
use sqlx::sqlite::SqlitePool;
use std::sync::Arc;

struct AppState {
    authkestra: Authkestra,
}

#[get("/")]
async fn index() -> impl Responder {
    HttpResponse::Ok().body(r#"
        <h1>Welcome!</h1>
        <a href="/auth/github">Login with GitHub</a>
    "#)
}

#[get("/protected")]
async fn protected(session: AuthSession) -> impl Responder {
    let name = session.0.identity.username.clone()
        .unwrap_or_else(|| "Unknown".to_string());

    HttpResponse::Ok().body(format!(
        "<h1>Hello, {}!</h1><p>You are authenticated via GitHub.</p>",
        name
    ))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();

    // Setup provider
    let provider = GithubProvider::new(
        std::env::var("GITHUB_CLIENT_ID").expect("GITHUB_CLIENT_ID required"),
        std::env::var("GITHUB_CLIENT_SECRET").expect("GITHUB_CLIENT_SECRET required"),
        "http://localhost:8080/auth/github/callback".to_string(),
    );

    // Setup session store
    let pool = SqlitePool::connect("sqlite::memory:").await.unwrap();
    sqlx::query("CREATE TABLE sessions (id TEXT PRIMARY KEY, data TEXT, expires_at INTEGER)")
        .execute(&pool).await.unwrap();
    let store = SqlStore::new(pool);

    // Build Authkestra
    let authkestra = Authkestra::builder()
        .provider(OAuth2Flow::new(provider))
        .session_store(store)
        .build();

    let state = web::Data::new(AppState { authkestra: authkestra.clone() });

    HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .service(index)
            .service(protected)
            .authkestra_routes(&authkestra)  // Adds /auth/github and callback
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}`;

export default function DocsFrameworksActix() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Actix-web Integration</h1>

        <p className="text-xl leading-relaxed">
          Use <code className="inline-code">authkestra-actix</code> to integrate authentication into 
          your Actix-web applications with type-safe extractors.
        </p>

        <h2 id="overview">Overview</h2>

        <p>
          The Actix adapter provides:
        </p>

        <ul>
          <li><code className="inline-code">AuthSession</code> extractor for session-based auth</li>
          <li><code className="inline-code">AuthToken</code> extractor for JWT-based auth</li>
          <li>Route helpers for automatic OAuth endpoint registration</li>
          <li>Session cookie management</li>
        </ul>

        <h2 id="setup">Setup</h2>

        <CodeBlock
          code={`[dependencies]
authkestra = { version = "0.1.0", features = ["actix", "github", "session-sql"] }
actix-web = "4"
sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "sqlite"] }
tokio = { version = "1", features = ["full"] }
dotenvy = "0.15"`}
          language="toml"
          filename="Cargo.toml"
        />

        <h2 id="extractors">Extractors</h2>

        <p>
          <code className="inline-code">AuthSession</code> extracts the current user's session:
        </p>

        <CodeBlock
          code={`use authkestra_actix::AuthSession;
use actix_web::{get, HttpResponse, Responder};

#[get("/profile")]
async fn profile(session: AuthSession) -> impl Responder {
    let identity = &session.0.identity;
    
    HttpResponse::Ok().json(serde_json::json!({
        "username": identity.username,
        "email": identity.email,
        "provider": identity.provider_id
    }))
}

#[get("/dashboard")]
async fn dashboard(session: AuthSession) -> impl Responder {
    // If no valid session, AuthSession extraction fails with 401
    HttpResponse::Ok().body(format!(
        "Welcome to your dashboard, {}!",
        session.0.identity.username.as_deref().unwrap_or("User")
    ))
}`}
          language="rust"
        />

        <h2 id="route-helpers">Route Helpers</h2>

        <CodeBlock
          code={`use authkestra_actix::AuthkestraActixExt;

App::new()
    .app_data(state.clone())
    .service(index)
    .service(protected)
    // This adds:
    // GET /auth/github - Initiates OAuth flow
    // GET /auth/github/callback - Handles OAuth callback
    .authkestra_routes(&authkestra)`}
          language="rust"
        />

        <h2 id="jwt-mode">JWT Mode (SPA)</h2>

        <p>
          For single-page applications, use JWT tokens instead of session cookies:
        </p>

        <CodeBlock
          code={`use authkestra_actix::{AuthToken, handle_oauth_callback_jwt_erased};
use authkestra_token::TokenManager;

// Protected route using JWT
#[get("/api/user")]
async fn get_user(token: AuthToken) -> impl Responder {
    // Token is validated automatically
    HttpResponse::Ok().json(token.0.claims)
}

// Callback that returns JWT instead of setting cookie
#[get("/api/callback")]
async fn jwt_callback(
    query: web::Query<OAuthCallbackParams>,
    auth: web::Data<Authkestra>,
    token_manager: web::Data<TokenManager>,
) -> impl Responder {
    match handle_oauth_callback_jwt_erased(&auth, &token_manager, &query).await {
        Ok(jwt) => HttpResponse::Ok().json(serde_json::json!({
            "token": jwt,
            "type": "Bearer"
        })),
        Err(e) => HttpResponse::Unauthorized().body(e.to_string())
    }
}`}
          language="rust"
        />

        <Callout type="info" title="SPA Flow">
          In SPA mode, the frontend receives the JWT and stores it (usually in localStorage). 
          It then includes the token in the <code className="inline-code">Authorization: Bearer</code> header 
          for API requests.
        </Callout>

        <h2 id="full-example">Full Example</h2>

        <CodeBlock
          code={fullActixExample}
          language="rust"
          filename="actix_github.rs"
        />

      </motion.div>
    </DocsLayout>
  );
}

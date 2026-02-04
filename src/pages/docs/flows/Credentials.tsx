import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "credentials-provider", title: "CredentialsProvider", level: 2 },
  { id: "actix-example", title: "Actix-web Example", level: 2 },
  { id: "axum-example", title: "Axum Example", level: 2 },
  { id: "security", title: "Security Best Practices", level: 2 },
];

const actixCredentialsCode = `use actix_web::{post, web, App, HttpResponse, HttpServer, Responder};
use async_trait::async_trait;
use authkestra_actix::AuthSession;
use authkestra_core::{AuthError, CredentialsProvider, Identity, UserMapper};
use authkestra_flow::{Authkestra, CredentialsFlow};
use serde::Deserialize;
use std::collections::HashMap;

// 1. Define your credentials struct
#[derive(Deserialize)]
pub struct LoginCredentials {
    pub username: String,
    pub password: String,
}

// 2. Implement CredentialsProvider
pub struct MyCredentialsProvider;

#[async_trait]
impl CredentialsProvider for MyCredentialsProvider {
    type Credentials = LoginCredentials;

    async fn authenticate(&self, creds: Self::Credentials) -> Result<Identity, AuthError> {
        // In production: use bcrypt/argon2 for password verification!
        if creds.username == "admin" && creds.password == "password" {
            Ok(Identity {
                provider_id: "credentials".to_string(),
                external_id: "admin-id-123".to_string(),
                email: Some("admin@example.com".to_string()),
                username: Some("admin".to_string()),
                attributes: HashMap::new(),
            })
        } else {
            Err(AuthError::InvalidCredentials)
        }
    }
}

// 3. Optionally map to your local user type
#[derive(Debug, Clone, serde::Serialize)]
pub struct LocalUser {
    pub id: i32,
    pub username: String,
    pub role: String,
}

pub struct MyUserMapper;

#[async_trait]
impl UserMapper for MyUserMapper {
    type LocalUser = LocalUser;

    async fn map_user(&self, identity: &Identity) -> Result<Self::LocalUser, AuthError> {
        Ok(LocalUser {
            id: 1,
            username: identity.username.clone().unwrap_or_default(),
            role: "user".to_string(),
        })
    }
}

// 4. Create login endpoint
#[post("/login")]
async fn login(
    auth: web::Data<Authkestra>,
    creds: web::Json<LoginCredentials>,
) -> impl Responder {
    match auth.authenticate_credentials(creds.into_inner()).await {
        Ok(session) => HttpResponse::Ok().json(session),
        Err(_) => HttpResponse::Unauthorized().body("Invalid credentials"),
    }
}`;

export default function DocsFlowsCredentials() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Direct Credentials Flow</h1>

        <p className="text-xl leading-relaxed">
          The Credentials Flow enables traditional username/password authentication 
          without relying on external OAuth providers.
        </p>

        <h2 id="overview">Overview</h2>

        <p>
          While OAuth is recommended for most applications, sometimes you need direct 
          authentication with credentials stored in your own database. Authkestra's 
          <code className="inline-code">CredentialsFlow</code> provides a type-safe way to implement this.
        </p>

        <h2 id="credentials-provider">CredentialsProvider</h2>

        <p>
          You must implement the <code className="inline-code">CredentialsProvider</code> trait to define how 
          credentials are validated:
        </p>

        <CodeBlock
          code={`#[async_trait]
pub trait CredentialsProvider: Send + Sync {
    /// The type representing login credentials
    type Credentials: DeserializeOwned + Send;

    /// Validate credentials and return an Identity on success
    async fn authenticate(&self, creds: Self::Credentials) -> Result<Identity, AuthError>;
}`}
          language="rust"
        />

        <h2 id="actix-example">Actix-web Example</h2>

        <CodeBlock
          code={actixCredentialsCode}
          language="rust"
          filename="actix_credentials.rs"
        />

        <h2 id="axum-example">Axum Example</h2>

        <CodeBlock
          code={`use authkestra_axum::{AuthSession, Authkestra, SessionConfig};
use authkestra_flow::CredentialsFlow;
use axum::{extract::State, response::IntoResponse, routing::post, Json, Router};
use tower_cookies::{CookieManagerLayer, Cookies};

async fn login(
    State(auth): State<Authkestra>,
    cookies: Cookies,
    Json(creds): Json<LoginCredentials>,
) -> impl IntoResponse {
    match auth.authenticate_credentials(creds).await {
        Ok(session) => {
            // Set session cookie
            auth.create_session_cookie(&cookies, &session);
            (StatusCode::OK, Json(serde_json::json!({ "success": true })))
        }
        Err(AuthError::InvalidCredentials) => {
            (StatusCode::UNAUTHORIZED, Json(serde_json::json!({ 
                "error": "Invalid credentials" 
            })))
        }
        Err(_) => {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ 
                "error": "Authentication failed" 
            })))
        }
    }
}`}
          language="rust"
          filename="axum_credentials.rs"
        />

        <h2 id="security">Security Best Practices</h2>

        <Callout type="danger" title="Password Security">
          <strong>Never store plain-text passwords!</strong> Always use a secure hashing 
          algorithm like bcrypt or argon2.
        </Callout>

        <CodeBlock
          code={`use argon2::{self, Config};

impl CredentialsProvider for DatabaseCredentialsProvider {
    type Credentials = LoginCredentials;

    async fn authenticate(&self, creds: Self::Credentials) -> Result<Identity, AuthError> {
        // 1. Fetch user from database
        let user = sqlx::query!("SELECT * FROM users WHERE username = $1", creds.username)
            .fetch_optional(&self.pool)
            .await
            .map_err(|e| AuthError::Internal(e.to_string()))?
            .ok_or(AuthError::InvalidCredentials)?;

        // 2. Verify password hash
        let valid = argon2::verify_encoded(&user.password_hash, creds.password.as_bytes())
            .map_err(|_| AuthError::Internal("Hash verification failed".to_string()))?;

        if !valid {
            return Err(AuthError::InvalidCredentials);
        }

        // 3. Return identity
        Ok(Identity {
            provider_id: "credentials".to_string(),
            external_id: user.id.to_string(),
            email: user.email,
            username: Some(user.username),
            attributes: HashMap::new(),
        })
    }
}`}
          language="rust"
        />

        <Callout type="tip" title="Additional Security">
          <ul className="mt-2">
            <li>Implement rate limiting to prevent brute force attacks</li>
            <li>Add account lockout after failed attempts</li>
            <li>Use HTTPS in production</li>
            <li>Consider adding 2FA support</li>
          </ul>
        </Callout>

      </motion.div>
    </DocsLayout>
  );
}

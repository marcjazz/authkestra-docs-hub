import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "oauth-provider", title: "OAuthProvider Trait", level: 2 },
  { id: "credentials-provider", title: "CredentialsProvider Trait", level: 2 },
  { id: "user-mapper", title: "UserMapper Trait", level: 2 },
  { id: "session-store", title: "SessionStore Trait", level: 2 },
];

export default function DocsCoreTraits() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Core Traits</h1>

        <p className="text-xl leading-relaxed">
          Authkestra uses traits to define extension points. Implement these traits to 
          customize authentication behavior or add new providers.
        </p>

        <h2 id="oauth-provider">OAuthProvider Trait</h2>

        <p>
          The <code className="inline-code">OAuthProvider</code> trait defines the interface for OAuth2/OIDC 
          providers. Implement this to add support for new identity providers.
        </p>

        <CodeBlock
          code={`use async_trait::async_trait;
use authkestra_core::{AuthError, Identity, OAuthProvider, TokenResponse};

#[async_trait]
pub trait OAuthProvider: Send + Sync {
    /// Returns the unique identifier for this provider (e.g., "github", "google")
    fn provider_id(&self) -> &str;
    
    /// Returns the URL to redirect users for authorization
    fn authorization_url(&self, state: &str) -> String;
    
    /// Exchanges an authorization code for tokens
    async fn exchange_code(&self, code: &str) -> Result<TokenResponse, AuthError>;
    
    /// Fetches user information using the access token
    async fn get_user_info(&self, access_token: &str) -> Result<Identity, AuthError>;
}`}
          language="rust"
          filename="authkestra-core/src/traits.rs"
        />

        <Callout type="info" title="Built-in Providers">
          Authkestra includes implementations for GitHub, Google, and Discord. You can use 
          these directly or as reference when implementing custom providers.
        </Callout>

        <h2 id="credentials-provider">CredentialsProvider Trait</h2>

        <p>
          For username/password or other direct authentication methods, implement the 
          <code className="inline-code">CredentialsProvider</code> trait:
        </p>

        <CodeBlock
          code={`use async_trait::async_trait;
use authkestra_core::{AuthError, CredentialsProvider, Identity};
use serde::Deserialize;
use std::collections::HashMap;

// 1. Define your credentials structure
#[derive(Deserialize)]
pub struct LoginCredentials {
    pub username: String,
    pub password: String,
}

// 2. Implement the CredentialsProvider trait
pub struct MyCredentialsProvider;

#[async_trait]
impl CredentialsProvider for MyCredentialsProvider {
    type Credentials = LoginCredentials;

    async fn authenticate(&self, creds: Self::Credentials) -> Result<Identity, AuthError> {
        // In production: verify against your database with proper password hashing!
        if creds.username == "admin" && creds.password == "secret" {
            Ok(Identity {
                provider_id: "credentials".to_string(),
                external_id: "user-123".to_string(),
                email: Some("admin@example.com".to_string()),
                username: Some("admin".to_string()),
                attributes: HashMap::new(),
            })
        } else {
            Err(AuthError::InvalidCredentials)
        }
    }
}`}
          language="rust"
          filename="example.rs"
        />

        <Callout type="warning" title="Password Security">
          Always use proper password hashing (bcrypt, argon2) in production. Never store 
          or compare plain-text passwords.
        </Callout>

        <h2 id="user-mapper">UserMapper Trait</h2>

        <p>
          The <code className="inline-code">UserMapper</code> trait transforms an <code className="inline-code">Identity</code> into 
          your application's local user type:
        </p>

        <CodeBlock
          code={`use async_trait::async_trait;
use authkestra_core::{AuthError, Identity, UserMapper};

// Your application's user type
#[derive(Debug, Clone)]
pub struct LocalUser {
    pub id: i64,
    pub username: String,
    pub role: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

pub struct DatabaseUserMapper {
    pool: sqlx::PgPool,
}

#[async_trait]
impl UserMapper for DatabaseUserMapper {
    type LocalUser = LocalUser;

    async fn map_user(&self, identity: &Identity) -> Result<Self::LocalUser, AuthError> {
        // Find or create user in database
        let user = sqlx::query_as!(
            LocalUser,
            r#"
            INSERT INTO users (external_id, provider, username, email)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (external_id, provider) 
            DO UPDATE SET last_login = NOW()
            RETURNING id, username, role, created_at
            "#,
            identity.external_id,
            identity.provider_id,
            identity.username,
            identity.email
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| AuthError::Internal(e.to_string()))?;

        Ok(user)
    }
}`}
          language="rust"
          filename="example.rs"
        />

        <h2 id="session-store">SessionStore Trait</h2>

        <p>
          The <code className="inline-code">SessionStore</code> trait handles session persistence. Authkestra 
          provides implementations for memory, Redis, and SQL databases.
        </p>

        <CodeBlock
          code={`use async_trait::async_trait;
use authkestra_core::{AuthError, Session, SessionStore};

#[async_trait]
pub trait SessionStore: Send + Sync {
    /// Create a new session
    async fn create(&self, session: &Session) -> Result<(), AuthError>;
    
    /// Retrieve a session by ID
    async fn get(&self, session_id: &str) -> Result<Option<Session>, AuthError>;
    
    /// Delete a session
    async fn delete(&self, session_id: &str) -> Result<(), AuthError>;
    
    /// Update session expiry
    async fn touch(&self, session_id: &str) -> Result<(), AuthError>;
}`}
          language="rust"
          filename="authkestra-core/src/traits.rs"
        />

        <Callout type="tip" title="Custom Session Stores">
          You can implement custom session stores for databases like MongoDB, DynamoDB, or 
          any other storage backend by implementing this trait.
        </Callout>

      </motion.div>
    </DocsLayout>
  );
}

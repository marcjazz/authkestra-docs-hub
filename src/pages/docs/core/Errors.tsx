import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "auth-error", title: "AuthError Enum", level: 2 },
  { id: "error-variants", title: "Error Variants", level: 2 },
  { id: "handling-errors", title: "Handling Errors", level: 2 },
  { id: "custom-errors", title: "Custom Error Responses", level: 2 },
];

export default function DocsCoreErrors() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Error Handling</h1>

        <p className="text-xl leading-relaxed">
          Authkestra uses the <code className="inline-code">AuthError</code> enum for all authentication-related 
          errors, providing type-safe error handling throughout your application.
        </p>

        <h2 id="auth-error">AuthError Enum</h2>

        <CodeBlock
          code={`use thiserror::Error;

#[derive(Debug, Error)]
pub enum AuthError {
    #[error("Invalid credentials")]
    InvalidCredentials,
    
    #[error("Session not found")]
    SessionNotFound,
    
    #[error("Session expired")]
    SessionExpired,
    
    #[error("Token expired")]
    TokenExpired,
    
    #[error("Invalid token: {0}")]
    InvalidToken(String),
    
    #[error("Provider error: {0}")]
    ProviderError(String),
    
    #[error("OAuth error: {0}")]
    OAuthError(String),
    
    #[error("Configuration error: {0}")]
    ConfigurationError(String),
    
    #[error("Internal error: {0}")]
    Internal(String),
}`}
          language="rust"
          filename="authkestra-core/src/error.rs"
        />

        <h2 id="error-variants">Error Variants</h2>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Variant</th>
                <th>When It Occurs</th>
                <th>HTTP Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="inline-code">InvalidCredentials</code></td>
                <td>Username/password authentication fails</td>
                <td>401 Unauthorized</td>
              </tr>
              <tr>
                <td><code className="inline-code">SessionNotFound</code></td>
                <td>Session cookie references non-existent session</td>
                <td>401 Unauthorized</td>
              </tr>
              <tr>
                <td><code className="inline-code">SessionExpired</code></td>
                <td>Session exists but has expired</td>
                <td>401 Unauthorized</td>
              </tr>
              <tr>
                <td><code className="inline-code">TokenExpired</code></td>
                <td>JWT has passed its expiration time</td>
                <td>401 Unauthorized</td>
              </tr>
              <tr>
                <td><code className="inline-code">InvalidToken</code></td>
                <td>JWT signature invalid or malformed</td>
                <td>401 Unauthorized</td>
              </tr>
              <tr>
                <td><code className="inline-code">ProviderError</code></td>
                <td>OAuth provider returned an error</td>
                <td>502 Bad Gateway</td>
              </tr>
              <tr>
                <td><code className="inline-code">OAuthError</code></td>
                <td>Error during OAuth flow (state mismatch, etc.)</td>
                <td>400 Bad Request</td>
              </tr>
              <tr>
                <td><code className="inline-code">ConfigurationError</code></td>
                <td>Missing or invalid configuration</td>
                <td>500 Internal Server Error</td>
              </tr>
              <tr>
                <td><code className="inline-code">Internal</code></td>
                <td>Database or other internal errors</td>
                <td>500 Internal Server Error</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="handling-errors">Handling Errors</h2>

        <p>
          Use Rust's pattern matching to handle specific error cases:
        </p>

        <CodeBlock
          code={`use authkestra_core::AuthError;

async fn login(creds: LoginCredentials) -> Result<Response, AppError> {
    match auth.authenticate(creds).await {
        Ok(session) => Ok(create_session_response(session)),
        
        Err(AuthError::InvalidCredentials) => {
            // Log failed attempt, maybe rate limit
            Ok(Response::unauthorized("Invalid username or password"))
        }
        
        Err(AuthError::Internal(msg)) => {
            // Log internal error
            tracing::error!("Auth internal error: {}", msg);
            Err(AppError::InternalError)
        }
        
        Err(e) => {
            // Handle other errors
            Ok(Response::bad_request(e.to_string()))
        }
    }
}`}
          language="rust"
          filename="example.rs"
        />

        <h2 id="custom-errors">Custom Error Responses</h2>

        <p>
          Implement <code className="inline-code">IntoResponse</code> to customize how errors are returned to clients:
        </p>

        <CodeBlock
          code={`use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use authkestra_core::AuthError;
use serde_json::json;

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        let (status, message) = match &self {
            AuthError::InvalidCredentials => {
                (StatusCode::UNAUTHORIZED, "Invalid credentials")
            }
            AuthError::SessionNotFound | AuthError::SessionExpired => {
                (StatusCode::UNAUTHORIZED, "Session invalid or expired")
            }
            AuthError::TokenExpired | AuthError::InvalidToken(_) => {
                (StatusCode::UNAUTHORIZED, "Token invalid or expired")
            }
            AuthError::OAuthError(_) => {
                (StatusCode::BAD_REQUEST, "OAuth authentication failed")
            }
            AuthError::ProviderError(_) => {
                (StatusCode::BAD_GATEWAY, "Provider unavailable")
            }
            _ => {
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal error")
            }
        };

        let body = Json(json!({
            "error": message,
            "code": status.as_u16()
        }));

        (status, body).into_response()
    }
}`}
          language="rust"
          filename="example.rs"
        />

        <Callout type="tip" title="Error Logging">
          Always log internal errors with context before returning them. Use a logging 
          framework like <code className="inline-code">tracing</code> to capture error details for debugging.
        </Callout>

      </motion.div>
    </DocsLayout>
  );
}

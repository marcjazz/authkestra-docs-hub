import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "memory-store", title: "In-Memory Store", level: 2 },
  { id: "redis-store", title: "Redis Store", level: 2 },
  { id: "sql-store", title: "SQL Store", level: 2 },
  { id: "custom-store", title: "Custom Store", level: 2 },
];

export default function DocsSessionsStores() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Session Stores</h1>

        <p className="text-xl leading-relaxed">
          Authkestra provides multiple session storage backends. Choose based on your 
          deployment architecture and scaling requirements.
        </p>

        <h2 id="overview">Overview</h2>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Store</th>
                <th>Best For</th>
                <th>Persistence</th>
                <th>Scaling</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>In-Memory</strong></td>
                <td>Development, testing</td>
                <td>None (lost on restart)</td>
                <td>Single instance</td>
              </tr>
              <tr>
                <td><strong>Redis</strong></td>
                <td>Production, high traffic</td>
                <td>Optional (RDB/AOF)</td>
                <td>Multi-instance</td>
              </tr>
              <tr>
                <td><strong>SQL</strong></td>
                <td>Production, existing DB</td>
                <td>Full persistence</td>
                <td>Multi-instance</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 id="memory-store">In-Memory Store</h2>

        <p>
          The default store for quick setup. Sessions are stored in memory and lost when 
          the application restarts.
        </p>

        <CodeBlock
          code={`use authkestra_session::MemoryStore;

// Create an in-memory session store (default)
let store = MemoryStore::new();

let authkestra = Authkestra::builder()
    .provider(OAuth2Flow::new(provider))
    .session_store(store)
    .build();`}
          language="rust"
          filename="memory_store.rs"
        />

        <Callout type="warning" title="Not for Production">
          In-memory store is not suitable for production. Sessions will be lost on restart, 
          and it doesn't work in multi-instance deployments.
        </Callout>

        <h2 id="redis-store">Redis Store</h2>

        <p>
          Redis is ideal for production deployments. It provides fast access, automatic 
          expiration, and works across multiple application instances.
        </p>

        <CodeBlock
          code={`use authkestra_session::RedisStore;

// Connect to Redis
let store = RedisStore::new("redis://127.0.0.1:6379")
    .await
    .expect("Failed to connect to Redis");

let authkestra = Authkestra::builder()
    .provider(OAuth2Flow::new(provider))
    .session_store(store)
    .build();`}
          language="rust"
          filename="redis_store.rs"
        />

        <p>Add the Redis feature to your dependencies:</p>

        <CodeBlock
          code={`[dependencies]
authkestra = { version = "0.1.0", features = ["axum", "github", "session-redis"] }`}
          language="toml"
          filename="Cargo.toml"
        />

        <Callout type="tip" title="Redis Configuration">
          In production, use Redis with authentication and TLS:
          <code className="inline-code block mt-2">redis://username:password@redis.example.com:6379/0</code>
        </Callout>

        <h2 id="sql-store">SQL Store</h2>

        <p>
          SQL storage is perfect when you already have a database and want sessions 
          alongside your application data.
        </p>

        <CodeBlock
          code={`use authkestra_session::SqlStore;
use sqlx::sqlite::SqlitePool;

// Connect to SQLite (also supports PostgreSQL, MySQL)
let pool = SqlitePool::connect("sqlite::memory:").await?;

// Create the sessions table
sqlx::query(
    "CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        expires_at INTEGER NOT NULL
    )"
)
.execute(&pool)
.await?;

// Create the SQL store
let store = SqlStore::new(pool);

let authkestra = Authkestra::builder()
    .provider(OAuth2Flow::new(provider))
    .session_store(store)
    .build();`}
          language="rust"
          filename="sql_store.rs"
        />

        <CodeBlock
          code={`[dependencies]
authkestra = { version = "0.1.0", features = ["axum", "github", "session-sql"] }
sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "sqlite"] }`}
          language="toml"
          filename="Cargo.toml"
        />

        <h2 id="custom-store">Custom Store</h2>

        <p>
          Implement the <code className="inline-code">SessionStore</code> trait for custom backends:
        </p>

        <CodeBlock
          code={`use async_trait::async_trait;
use authkestra_core::{AuthError, Session, SessionStore};

pub struct MongoStore {
    collection: mongodb::Collection<Session>,
}

#[async_trait]
impl SessionStore for MongoStore {
    async fn create(&self, session: &Session) -> Result<(), AuthError> {
        self.collection
            .insert_one(session, None)
            .await
            .map_err(|e| AuthError::Internal(e.to_string()))?;
        Ok(())
    }

    async fn get(&self, session_id: &str) -> Result<Option<Session>, AuthError> {
        let filter = doc! { "id": session_id };
        self.collection
            .find_one(filter, None)
            .await
            .map_err(|e| AuthError::Internal(e.to_string()))
    }

    async fn delete(&self, session_id: &str) -> Result<(), AuthError> {
        let filter = doc! { "id": session_id };
        self.collection
            .delete_one(filter, None)
            .await
            .map_err(|e| AuthError::Internal(e.to_string()))?;
        Ok(())
    }

    async fn touch(&self, session_id: &str) -> Result<(), AuthError> {
        // Update expiry timestamp
        let filter = doc! { "id": session_id };
        let update = doc! { "$set": { "expires_at": new_expiry } };
        self.collection
            .update_one(filter, update, None)
            .await
            .map_err(|e| AuthError::Internal(e.to_string()))?;
        Ok(())
    }
}`}
          language="rust"
          filename="custom_store.rs"
        />

      </motion.div>
    </DocsLayout>
  );
}

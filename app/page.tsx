import Link from 'next/link'
import { CodeBlock } from '@/components/docs/CodeBlock'
import {
  ArrowRight,
  Box,
  Github,
  Key,
  Layers,
  Shield,
  Workflow,
  Zap,
  Lock,
  Server,
} from 'lucide-react'

const features = [
  {
    icon: Box,
    title: 'Modular Design',
    description:
      'Strictly separated concerns with composable crates for core, flow, session, token, and framework adapters.',
  },
  {
    icon: Workflow,
    title: 'Explicit Control Flow',
    description:
      'No magic middleware. Dependencies and context are injected explicitly via Extractors or constructors.',
  },
  {
    icon: Layers,
    title: 'Provider Agnostic',
    description:
      'Easily integrate new OAuth providers by implementing the OAuthProvider trait. GitHub, Google, and Discord included.',
  },
  {
    icon: Shield,
    title: 'OpenID Connect',
    description:
      'Full OIDC support with automatic discovery, JWKS validation, and PKCE for enhanced security.',
  },
  {
    icon: Key,
    title: 'Session Management',
    description:
      'Flexible session storage via the SessionStore trait with in-memory, Redis, and SQL support.',
  },
  {
    icon: Lock,
    title: 'Stateless Tokens',
    description:
      'Comprehensive JWT signing, verification, and offline validation for scalable stateless authentication.',
  },
]

export default function LandingPage() {
  return (
    <main className='flex flex-col min-h-screen'>
      {/* Hero Section */}
      <section className='relative pt-32 pb-20 overflow-hidden border-b'>
        <div className='container mx-auto px-6 relative z-10'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-fd-primary/30 bg-fd-primary/5'>
              <Zap className='w-4 h-4 text-fd-primary' />
              <span className='text-sm font-medium'>v0.1.1 Released</span>
            </div>

            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6'>
              Authentication Orchestrator for Rust
            </h1>

            <p className='text-xl text-fd-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed'>
              A modular, framework-agnostic authentication orchestration system
              emphasizing{' '}
              <strong className='text-fd-foreground'>
                explicit control flow
              </strong>
              ,<strong className='text-fd-foreground'> strong typing</strong>,
              and
              <strong className='text-fd-foreground'> composability</strong>.
            </p>

            <div className='flex flex-wrap items-center justify-center gap-4'>
              <Link
                href='/docs'
                className='inline-flex items-center justify-center rounded-md bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground shadow transition-colors hover:bg-fd-primary/90'
              >
                Get Started
                <ArrowRight className='w-4 h-4 ml-2' />
              </Link>
              <a
                href='https://github.com/marcjazz/authkestra'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center justify-center rounded-md border border-fd-border bg-fd-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground'
              >
                <Github className='w-4 h-4 mr-2' />
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className='py-24 bg-fd-muted/30 dark:bg-fd-muted/10'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Built for <span className='text-fd-secondary'>Rust Developers</span>
            </h2>
            <p className='text-lg text-fd-muted-foreground max-w-2xl mx-auto'>
              Designed with Rust's philosophy in mind: explicit, composable, and
              type-safe.
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature) => (
              <div
                key={feature.title}
                className='p-8 bg-fd-background rounded-xl border border-fd-border shadow-sm hover:border-fd-secondary/30 transition-colors'
              >
                <div className='w-12 h-12 rounded-lg bg-fd-secondary/10 flex items-center justify-center mb-6'>
                  <feature.icon className='w-6 h-6 text-fd-secondary' />
                </div>
                <h3 className='text-xl font-semibold mb-3'>{feature.title}</h3>
                <p className='text-fd-muted-foreground leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Preview */}
      <section className='py-24 border-t'>
        <div className='container mx-auto px-6'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            <div>
              <h2 className='text-3xl md:text-4xl font-bold mb-6'>
                Get started in minutes
              </h2>
              <p className='text-lg text-fd-muted-foreground mb-8 leading-relaxed'>
                Authkestra integrates seamlessly with Axum and Actix-web. Set up
                GitHub OAuth, session management, and protected routes with just
                a few lines of code.
              </p>
              <ul className='space-y-4 mb-10'>
                {[
                  'Type-safe extractors for session and token access',
                  'Automatic route generation for OAuth callbacks',
                  'Flexible session stores (Memory, Redis, SQL)',
                  'Built-in support for popular providers',
                ].map((item, idx) => (
                  <li key={idx} className='flex items-start gap-3'>
                    <div className='w-6 h-6 rounded-full bg-fd-secondary/20 flex items-center justify-center mt-0.5'>
                      <Zap className='w-3 h-3 text-fd-secondary' />
                    </div>
                    <span className='text-fd-muted-foreground'>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href='/docs/quickstart'
                className='inline-flex items-center justify-center rounded-md bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground shadow transition-colors hover:bg-fd-primary/90'
              >
                View Quick Start Guide
                <ArrowRight className='w-4 h-4 ml-2' />
              </Link>
            </div>

            <CodeBlock
              filename='main.rs'
              language='rust'
              code={`
use authkestra_axum::{AuthkestraAxumExt, AuthSession};
use authkestra_flow::{Authkestra, OAuth2Flow};
use authkestra_providers_github::GithubProvider;
use authkestra_session::MemoryStore;

#[tokio::main]
async fn main() {
    let provider = GithubProvider::new(
        env::var("GITHUB_ID")?,
        env::var("GITHUB_SECRET")?,
        "http://localhost:3000/auth/github/callback".into(),
    );

    let authkestra = Authkestra::builder()
        .provider(OAuth2Flow::new(provider))
        .session_store(Arc::new(MemoryStore::default()))
        .build();

    let app = Router::new()
        .authkestra_routes(&authkestra)
        .route("/me", get(me));

    axum::serve(listener, app).await.unwrap();
}

async fn me(AuthSession(session): AuthSession) -> String {
    format!("Hello, {}!", session.identity.username)
}`}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-12 border-t mt-auto'>
        <div className='container mx-auto px-6'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-8'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-lg flex items-center justify-center'>
                <img src={`/logo.png`} />
              </div>
              <span className='font-semibold text-xl'>Authkestra</span>
            </div>

            <p className='text-sm text-fd-muted-foreground'>
              Dual-licensed under MIT and Apache 2.0
            </p>

            <div className='flex items-center gap-6'>
              <a
                href='https://github.com/marcjazz/authkestra'
                target='_blank'
                rel='noopener noreferrer'
                className='text-fd-muted-foreground hover:text-fd-foreground transition-colors'
              >
                <Github className='w-6 h-6' />
              </a>
              <a
                href='https://crates.io/crates/authkestra'
                target='_blank'
                rel='noopener noreferrer'
                className='text-fd-muted-foreground hover:text-fd-foreground transition-colors'
              >
                <Server className='w-6 h-6' />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

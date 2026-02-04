**Role:** Expert Next.js Developer & Technical Writer
**Task:** Create a production-ready, SEO-enhanced Next.js documentation application for the open-source Rust project "Authkestra".

**Project Context:**
*   **Repository:** `https://github.com/marcjazz/authkestra`
*   **Description:** Authkestra is a modular, framework-agnostic authentication orchestration system for Rust. It emphasizes explicit control flow, strong typing, and composability, supporting frameworks like Actix-web and Axum.

**Technical Requirements:**
1.  **Framework:** Next.js (App Router) with TypeScript.
2.  **Styling:** Tailwind CSS for a modern, clean, and responsive design.
3.  **Content Engine:** Use **Nextra** (theme-docs) or **Fumadocs** for best-in-class MDX support, automatic sidebar generation, and built-in search.
4.  **SEO Optimization (Critical):**
    *   Generate a `sitemap.xml` and `robots.txt` automatically.
    *   Implement dynamic `metadata` for every page (Title, Description, Open Graph images, Twitter Cards).
    *   Use JSON-LD structured data for "SoftwareSourceCode" and "TechArticle".
    *   Ensure semantic HTML structure (proper heading hierarchy).
5.  **Performance:** Ensure 100/100 Lighthouse scores (Core Web Vitals).

**Documentation Structure & Content Modules:**
You must create a modular documentation structure that covers every concept implemented in the library. Based on the repository analysis, generate the following sections:

1.  **Introduction**
    *   **What is Authkestra?** (Modular, framework-agnostic, explicit control flow).
    *   **Installation** (Cargo.toml setup).
    *   **Quick Start** (Basic example).

2.  **Core Concepts (`authkestra-core`)**
    *   **Identity:** How the unified `Identity` struct works.
    *   **Traits:** Explain `OAuthProvider`, `CredentialsProvider`, and `UserMapper`.
    *   **Error Handling:** The `AuthError` enum.

3.  **Authentication Flows (`authkestra-flow`)**
    *   **OAuth2 Flow:** Authorization Code Grant.
    *   **Device Flow:** RFC 8628 implementation.
    *   **Client Credentials:** Machine-to-machine auth.
    *   **Direct Credentials:** Password-based auth.

4.  **OpenID Connect (`authkestra-oidc`)**
    *   Discovery (OIDC metadata fetching).
    *   JWKS & ID Token Validation.
    *   PKCE (Proof Key for Code Exchange).

5.  **Token Management (`authkestra-token`)**
    *   JWT signing and verification.
    *   Offline validation with caching.

6.  **Session Management (`authkestra-session`)**
    *   **Stores:** Redis, SQL (Postgres/MySQL/SQLite), and In-Memory.
    *   **Configuration:** TTL and persistence strategies.

7.  **Framework Integration (Guides)**
    *   **Actix-web (`authkestra-actix`):** Using `AuthSession` and `AuthToken` extractors.
    *   **Axum (`authkestra-axum`):** Using Extractors and `SessionConfig`.

8.  **Providers (`authkestra-providers-*`)**
    *   Setup guides for **GitHub**, **Google**, and **Discord**.

**Deliverables:**
*   Full source code for the Next.js application.
*   A comprehensive `README.md` for the documentation repo itself.
*   All necessary configuration files (`next.config.js`, `tailwind.config.ts`, `tsconfig.json`).
*   Placeholder MDX files for all the sections listed above, structured correctly in the `pages/` or `app/docs/` directory.

**Action:**
Start by scaffolding the Next.js application with the specified stack and generating the file structure to match the modules listed above.

***
Here are some concretes examples,
Break them accross the various section of the docs with detail explaination:

- https://raw.githubusercontent.com/marcjazz/authkestra/refs/heads/main/authkestra-examples/src/bin/actix_credentials.rs
- https://raw.githubusercontent.com/marcjazz/authkestra/refs/heads/main/authkestra-examples/src/bin/actix_github.rs
- https://raw.githubusercontent.com/marcjazz/authkestra/refs/heads/main/authkestra-examples/src/bin/actix_resource_server.rs
- https://raw.githubusercontent.com/marcjazz/authkestra/refs/heads/main/authkestra-examples/src/bin/actix_spa_jwt.rs
- https://raw.githubusercontent.com/marcjazz/authkestra/refs/heads/main/authkestra-examples/src/bin/axum_credentials.rs
- https://raw.githubusercontent.com/marcjazz/authkestra/refs/heads/main/authkestra-examples/src/bin/axum_oauth.rs
- https://raw.githubusercontent.com/marcjazz/authkestra/refs/heads/main/authkestra-examples/src/bin/axum_resource_server.rs
- https://raw.githubusercontent.com/marcjazz/authkestra/refs/heads/main/authkestra-examples/src/bin/axum_spa_jwt.rs
- https://raw.githubusercontent.com/marcjazz/authkestra/refs/heads/main/authkestra-examples/src/bin/client_credentials_flow.rs
- https://raw.githubusercontent.com/marcjazz/authkestra/refs/heads/main/authkestra-examples/src/bin/device_flow.rs
- https://raw.githubusercontent.com/marcjazz/authkestra/refs/heads/main/authkestra-examples/src/bin/offline_validation.rs
- https://raw.githubusercontent.com/marcjazz/authkestra/refs/heads/main/authkestra-examples/src/bin/oidc_generic.rs

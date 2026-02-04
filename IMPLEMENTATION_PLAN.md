# Documentation Update Plan

This plan outlines the necessary changes to align the `authkestra-docs-hub` documentation with the code in the `authkestra` examples.

## General Changes

*   **Environment Variables**: Across all relevant documents, update environment variable names to use the `AUTHKESTRA_` prefix (e.g., `AUTHKESTRA_GITHUB_CLIENT_ID`).

## 1. `content/docs/frameworks/axum.mdx`

*   **State Management Section**:
    *   Remove the complex manual `FromRef` implementation example.
    *   Replace it with a simpler explanation showing direct use of `AuthkestraState` with `with_state`, as seen in `axum_oauth.rs`.
    *   Add a note that for more complex state, `FromRef` can be used, and add the missing implementation for `SessionConfig`.
*   **Multiple Providers (OAuth Example)**:
    *   Replace the entire code block with the content of `axum_oauth.rs`.
    *   Ensure the new code block shows:
        *   Correct environment variable usage (`AUTHKESTRA_...`).
        *   The correct routing method: `.merge(authkestra.axum_router())`.
        *   An example of configuring a `SessionStore` (e.g., `MemoryStore`).

## 2. `content/docs/frameworks/actix.mdx`

*   **Route Helpers Section**:
    *   Update the routing method from `.authkestra_routes(&authkestra)` to `.service(authkestra.actix_scope())`.
*   **Full Example (OAuth Example)**:
    *   Replace the entire code block with the content of `actix_github.rs`.
    *   Crucially, the new example must show the correct `app_data` setup, registering `SessionStore` and `SessionConfig` in addition to the main `AppState`, as this is required for the `AuthSession` extractor to work.
    *   Update the `CREATE TABLE` SQL to match the more complete version from the example.

## 3. `content/docs/flows/credentials.mdx`

This document has the most significant discrepancies. The API shown (`auth.authenticate_credentials`) seems to be a high-level abstraction not used in the examples. The plan is to align the docs with the more manual, but working, `CredentialsFlow` approach.

*   **Actix-web Example**:
    *   Replace the `login` handler snippet with the full `login` function from `actix_credentials.rs`.
    *   Add the `AppState` struct definition from the example.
    *   Explain that the handler uses a `CredentialsFlow` object to authenticate, then manually creates a session and a cookie, and finally redirects the user. This is a more complete and realistic flow.
    *   Include the main function setup from `actix_credentials.rs` to show how `CredentialsFlow` and all necessary `app_data` are initialized.
*   **Axum Example**:
    *   Replace the `login` handler snippet with the `login` function from `axum_credentials.rs`.
    *   Add the `AppState` struct definition from the example.
    *   Explain the `CredentialsFlow` usage, manual session/cookie creation, and redirect flow.
    *   Include the main function setup from `axum_credentials.rs` to show the initialization of `CredentialsFlow` and the application state.

## 4. `content/docs/flows/oauth2.mdx`

*   **Implementation Section**:
    *   Update the code block with a simplified version of `axum_oauth.rs`.
    *   Ensure it shows the correct routing method: `.merge(authkestra.axum_router())`.
    *   Add the `SessionStore` configuration to the `Authkestra::builder()` chain to demonstrate a more complete setup.
    *   Update environment variables to include the `AUTHKESTRA_` prefix.

---

This plan will synchronize the documentation with the working examples, providing users with accurate, complete, and runnable code snippets.

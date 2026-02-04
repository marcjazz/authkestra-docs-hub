// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "installation.mdx": () => import("../content/docs/installation.mdx?collection=docs"), "quickstart.mdx": () => import("../content/docs/quickstart.mdx?collection=docs"), "flows/client-credentials.mdx": () => import("../content/docs/flows/client-credentials.mdx?collection=docs"), "flows/credentials.mdx": () => import("../content/docs/flows/credentials.mdx?collection=docs"), "flows/device-flow.mdx": () => import("../content/docs/flows/device-flow.mdx?collection=docs"), "flows/oauth2.mdx": () => import("../content/docs/flows/oauth2.mdx?collection=docs"), "flows/pkce.mdx": () => import("../content/docs/flows/pkce.mdx?collection=docs"), "core/errors.mdx": () => import("../content/docs/core/errors.mdx?collection=docs"), "core/identity.mdx": () => import("../content/docs/core/identity.mdx?collection=docs"), "core/traits.mdx": () => import("../content/docs/core/traits.mdx?collection=docs"), "guides/jwt-validation.mdx": () => import("../content/docs/guides/jwt-validation.mdx?collection=docs"), "guides/oidc.mdx": () => import("../content/docs/guides/oidc.mdx?collection=docs"), "frameworks/actix.mdx": () => import("../content/docs/frameworks/actix.mdx?collection=docs"), "frameworks/axum.mdx": () => import("../content/docs/frameworks/axum.mdx?collection=docs"), "providers/discord.mdx": () => import("../content/docs/providers/discord.mdx?collection=docs"), "providers/github.mdx": () => import("../content/docs/providers/github.mdx?collection=docs"), "providers/google.mdx": () => import("../content/docs/providers/google.mdx?collection=docs"), "sessions/config.mdx": () => import("../content/docs/sessions/config.mdx?collection=docs"), "sessions/stores.mdx": () => import("../content/docs/sessions/stores.mdx?collection=docs"), }),
};
export default browserCollections;
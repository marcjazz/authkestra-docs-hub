// @ts-nocheck
import { default as __fd_glob_20 } from "../content/docs/meta.json?collection=meta"
import * as __fd_glob_19 from "../content/docs/sessions/stores.mdx?collection=docs"
import * as __fd_glob_18 from "../content/docs/sessions/config.mdx?collection=docs"
import * as __fd_glob_17 from "../content/docs/providers/google.mdx?collection=docs"
import * as __fd_glob_16 from "../content/docs/providers/github.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/providers/discord.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/frameworks/axum.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/frameworks/actix.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/guides/oidc.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/guides/jwt-validation.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/flows/pkce.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/flows/oauth2.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/flows/device-flow.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/flows/credentials.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/flows/client-credentials.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/core/traits.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/core/identity.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/core/errors.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/quickstart.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/installation.mdx?collection=docs"
import * as __fd_glob_0 from "../content/docs/index.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.doc("docs", "content/docs", {"index.mdx": __fd_glob_0, "installation.mdx": __fd_glob_1, "quickstart.mdx": __fd_glob_2, "core/errors.mdx": __fd_glob_3, "core/identity.mdx": __fd_glob_4, "core/traits.mdx": __fd_glob_5, "flows/client-credentials.mdx": __fd_glob_6, "flows/credentials.mdx": __fd_glob_7, "flows/device-flow.mdx": __fd_glob_8, "flows/oauth2.mdx": __fd_glob_9, "flows/pkce.mdx": __fd_glob_10, "guides/jwt-validation.mdx": __fd_glob_11, "guides/oidc.mdx": __fd_glob_12, "frameworks/actix.mdx": __fd_glob_13, "frameworks/axum.mdx": __fd_glob_14, "providers/discord.mdx": __fd_glob_15, "providers/github.mdx": __fd_glob_16, "providers/google.mdx": __fd_glob_17, "sessions/config.mdx": __fd_glob_18, "sessions/stores.mdx": __fd_glob_19, });

export const meta = await create.meta("meta", "content/docs", {"meta.json": __fd_glob_20, });
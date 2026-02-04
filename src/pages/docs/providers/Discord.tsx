import { DocsLayout } from "@/components/docs/DocsLayout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { motion } from "framer-motion";

const tocItems = [
  { id: "setup", title: "Setup Guide", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "scopes", title: "Available Scopes", level: 2 },
];

export default function DocsProvidersDiscord() {
  return (
    <DocsLayout toc={tocItems}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Discord Provider</h1>

        <p className="text-xl leading-relaxed">
          Integrate Discord OAuth2 authentication for gaming and community applications.
        </p>

        <h2 id="setup">Setup Guide</h2>

        <h3>1. Create Discord Application</h3>

        <ol>
          <li>Go to <a href="https://discord.com/developers/applications" target="_blank" rel="noopener" className="text-primary underline">Discord Developer Portal</a></li>
          <li>Click <strong>New Application</strong></li>
          <li>Give your application a name</li>
          <li>Go to <strong>OAuth2 → General</strong></li>
          <li>Add redirect: <code className="inline-code">http://localhost:3000/auth/discord/callback</code></li>
          <li>Copy the <strong>Client ID</strong> and <strong>Client Secret</strong></li>
        </ol>

        <h3>2. Configure Environment</h3>

        <CodeBlock
          code={`AUTHKESTRA_DISCORD_CLIENT_ID=your_client_id
AUTHKESTRA_DISCORD_CLIENT_SECRET=your_client_secret
AUTHKESTRA_DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback`}
          language="bash"
          filename=".env"
          showLineNumbers={false}
        />

        <h2 id="implementation">Implementation</h2>

        <CodeBlock
          code={`use authkestra_flow::OAuth2Flow;
use authkestra_providers_discord::DiscordProvider;

// Create the Discord provider
let provider = DiscordProvider::new(
    std::env::var("AUTHKESTRA_DISCORD_CLIENT_ID").unwrap(),
    std::env::var("AUTHKESTRA_DISCORD_CLIENT_SECRET").unwrap(),
    std::env::var("AUTHKESTRA_DISCORD_REDIRECT_URI")
        .unwrap_or_else(|_| "http://localhost:3000/auth/discord/callback".to_string()),
);

// Add to Authkestra
let authkestra = Authkestra::builder()
    .provider(OAuth2Flow::new(provider))
    .build();`}
          language="rust"
        />

        <h2 id="scopes">Available Scopes</h2>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Scope</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="inline-code">identify</code></td>
                <td>Access user's username, discriminator, avatar (default)</td>
              </tr>
              <tr>
                <td><code className="inline-code">email</code></td>
                <td>Access user's email address</td>
              </tr>
              <tr>
                <td><code className="inline-code">guilds</code></td>
                <td>Access list of user's guilds (servers)</td>
              </tr>
              <tr>
                <td><code className="inline-code">guilds.members.read</code></td>
                <td>Read user's guild member info</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          code={`// Request specific scopes
let flow = OAuth2Flow::new(provider)
    .with_scopes(vec!["identify", "email", "guilds"]);`}
          language="rust"
        />

        <h3>Identity Attributes</h3>

        <CodeBlock
          code={`// Discord provider populates these attributes
let discriminator = identity.attributes.get("discriminator");  // Discord tag #1234
let avatar = identity.attributes.get("avatar");  // Avatar hash
let banner = identity.attributes.get("banner");
let premium_type = identity.attributes.get("premium_type");  // Nitro status

// Build avatar URL
let avatar_url = format!(
    "https://cdn.discordapp.com/avatars/{}/{}.png",
    identity.external_id,
    identity.attributes.get("avatar").unwrap_or(&"".to_string())
);`}
          language="rust"
        />

        <Callout type="tip" title="Bot Integration">
          If you're building a Discord bot, you can use the same OAuth flow to let users 
          link their Discord accounts. Request the <code className="inline-code">bot</code> scope to add 
          your bot to their servers.
        </Callout>

      </motion.div>
    </DocsLayout>
  );
}

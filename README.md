# Authkestra Documentation Hub

The official documentation for [Authkestra](https://github.com/marcjazz/authkestra), a flexible and lightweight authentication library for Rust.

## Features

- **Modern UI**: Built with Next.js and Fumadocs for a fast, searchable, and responsive experience.
- **Comprehensive Guides**: Detailed documentation for flows (OAuth2, PKCE, Device Flow), frameworks (Axum, Actix), and providers (GitHub, Google, Discord).
- **Interactive Examples**: Code snippets and examples synchronized with the main Authkestra repository.
- **Dark Mode Support**: Built-in support for light and dark themes.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Documentation**: [Fumadocs](https://fumadocs.vercel.app/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended) or [bun](https://bun.sh/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/marcjazz/authkestra-docs-hub.git
   cd authkestra-docs-hub
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `content/docs/`: MDX files containing the documentation content.
- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable React components and specialized documentation components.
- `lib/`: Utility functions and Fumadocs configuration.

## Contributing

Contributions are welcome! If you find a typo or want to add a new guide, please feel free to open a Pull Request.

## License

This project is licensed under the MIT License.
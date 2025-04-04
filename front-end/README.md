# weDAO Front-end

This is the front-end application for weDAO, built with modern web technologies and optimized for the Algorand blockchain interaction.

## Tech Stack

- **Framework**: [Remix](https://remix.run/) with [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Blockchain**: Algorand (with various wallet connectors)
- **Node Version**: >=22.0.0
- **NPM Version**: >=10.9.0

## Project Structure

```
front-end/
├── app/                    # Main application code
│   ├── components/         # Reusable UI components
│   ├── interfaces/         # TypeScript interfaces and types
│   ├── routes/            # Application routes
│   ├── contract-methods/   # Algorand smart contract interactions
│   ├── context/           # React context providers
│   ├── services/          # API and service integrations
│   ├── data/             # Data models and constants
│   └── utils.ts           # Utility functions
├── public/                # Static assets
└── build/                # Production build output
```

## Key Features

- Algorand wallet integration (@txnlab/use-wallet-react)
- Support for multiple wallet providers (PeraWallet, Defly, Lute)
- Modern UI components with Framer Motion animations
- Type-safe development with TypeScript
- Responsive design with TailwindCSS

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
4. Configure your environment variables in `.env`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Development

The project uses Vite as the build tool with Remix for server-side rendering. Key configurations:

- **Vite Config**: Configured for optimal development experience with polyfills for global, buffer, and process
- **TypeScript**: Strict type checking enabled
- **ESLint**: Comprehensive linting rules for React and TypeScript
- **TailwindCSS**: Utility-first CSS framework for styling

## Blockchain Integration

The project integrates with Algorand blockchain through:

- AlgoKit utilities for blockchain interactions
- Multiple wallet providers (Pera, Defly, Lute)
- Custom contract method implementations in `app/contract-methods/`

## Environment Variables

The project supports multiple environment configurations:
- `.env` - Main environment file
- `.env.example` - Template for environment variables
- `.env.monko.example` - Monko-specific configuration
- `.env.nfd.example` - NFD-specific configuration


# SolSwap: Solana DEX Frontend

A modern, sleek decentralized exchange frontend for Solana, built with Next.js, TypeScript, and featuring Lazorkit passkey wallet integration.

![SolSwap Screenshot](/public/images/screenshot.png)

## 🌟 Features

- **Modern UI** - Clean, responsive design inspired by Jupiter.ag with dark and light themes
- **Lazorkit Wallet Integration** - Secure passkey (WebAuthn) wallet connections
- **Instant Token Swaps** - Swap tokens with real-time quotes, prices, and charts
- **Fast Performance** - Built with Next.js App Router for optimal performance
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/solswap.git
   cd solswap
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit `.env.local` to include your API keys and configuration settings:
   \`\`\`
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet
   # Add other environment variables as needed
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🛠️ Project Structure

\`\`\`
solswap/
├── app/             # Next.js app router files
│   ├── globals.css  # Global styles
│   ├── layout.tsx   # Root layout component
│   └── page.tsx     # Homepage
├── components/      # Reusable UI components
│   ├── navbar.tsx   # Navigation bar
│   ├── swap-container.tsx  # Main swap interface
│   └── ...          # Other components
├── constants/       # App constants 
├── hooks/           # React hooks
├── lib/             # Utility functions
├── public/          # Static assets
└── types/           # TypeScript type definitions
\`\`\`

## 💻 Development

### Key Components

- **WalletProvider**: Manages Lazorkit wallet connection state
- **SwapContainer**: Main swap interface with token selection and price display
- **TokenSelector**: Component for selecting tokens with search and balance display
- **PriceChart**: Displays price chart for the selected token pair

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code quality issues

## 📦 Deployment

### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Sign up or log in to [Vercel](https://vercel.com)
3. Click "New Project" and import your repository
4. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Environment Variables: Add all variables from your `.env.local`
5. Click "Deploy" and wait for the build to complete

### Manual Deployment

1. Build the production application:
   \`\`\`bash
   npm run build
   \`\`\`

2. Start the production server:
   \`\`\`bash
   npm run start
   \`\`\`

## 🔐 Security Considerations

- **Wallet Security**: Lazorkit uses WebAuthn for secure wallet authentication
- **Transaction Signing**: All transactions are signed locally in the user's browser
- **No Private Key Storage**: Private keys are never stored or transmitted
- **Environment Variables**: Sensitive values should always be stored in environment variables

## 🧩 Integrations

- **Lazorkit Wallet**: Secure passkey wallet integration
- **Jupiter Aggregator**: For optimal swap routing
- **Solana Web3.js**: For blockchain interactions
- **TanStack Query**: For efficient data fetching and caching

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Jupiter.ag](https://jup.ag) for inspiration
- [Lazorkit](https://docs.lazorkit.xyz/) for the wallet SDK
- [Solana](https://solana.com) for the blockchain
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
\`\`\`

Let's create the necessary environment file:

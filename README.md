# Invoice AI - Intelligent Invoice Analysis Platform

> AI-Powered Carrier Invoice Analysis with Premium Chat Experience

![Invoice AI](https://img.shields.io/badge/Invoice_AI-v1.0.0-violet)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**Invoice AI** is a production-ready, AI-powered platform for analyzing carrier invoices with automated extraction, intelligent insights, and a premium chat interface that feels like ChatGPT/Claude.

---

## ✨ Features

### 🚀 Core Capabilities

- **📄 Invoice Analysis** - Upload and analyze carrier invoices (DHL, FedEx, UPS, USPS) with automated field extraction
- **🤖 Premium AI Chat** - ChatGPT-like experience with streaming responses, markdown rendering, and code highlighting
- **📊 Smart Dashboard** - Real-time analytics, cost tracking, and AI-powered insights
- **💼 Production Ready** - Built for scale with proper error handling, loading states, and backend integration

### 💬 Premium Chat Experience

- **Streaming Responses** - Real-time message streaming like ChatGPT/Claude
- **Markdown Support** - Full markdown rendering with syntax highlighting
- **Code Blocks** - Beautiful code highlighting with \`highlight.js\`
- **Context Awareness** - Invoice-specific context in conversations
- **Copy to Clipboard** - One-click code/message copying
- **Responsive Design** - Perfect on desktop, tablet, and mobile

### 📈 Invoice Analysis Features

- **Drag-and-Drop Upload** - Intuitive file upload with validation
- **Automatic Carrier Detection** - AI-powered carrier identification with confidence scores
- **Real-time Processing** - Live progress tracking with polling
- **Comprehensive Results** - Detailed tables with shipments, accessorial costs, and summaries
- **Export Capability** - Download results as CSV for further analysis
- **Error Recovery** - Robust error handling with retry options

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API for invoice processing and chat

### Installation

1. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment variables**
   Create a \`.env\` file:
   \`\`\`env
   VITE_API_BASE_URL=https://your-api.com/api/v1
   VITE_CHAT_API_BASE_URL=https://your-api.com/api/v1/chat
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production**
   \`\`\`bash
   npm run build
   \`\`\`

---

## 📡 API Integration

### Invoice Analysis API

**Required Endpoints:**
- \`POST /api/v1/documents/upload\` - Upload invoice
- \`POST /api/v1/jobs/{job_id}/confirm\` - Confirm job
- \`GET /api/v1/jobs/{job_id}/status\` - Poll status
- \`GET /api/v1/jobs/{job_id}/results\` - Get results

### AI Chat API

**Required Endpoints:**
- \`POST /api/v1/chat/messages/stream\` - Streaming chat (SSE)
- \`POST /api/v1/chat/messages\` - Non-streaming chat
- \`GET /api/v1/chat/sessions\` - List sessions
- \`POST /api/v1/chat/sessions\` - Create session

**Stream Response Format:**
\`\`\`
data: {"type":"content","content":"Hello"}
data: {"type":"content","content":" World"}
data: {"type":"end"}
\`\`\`

See [INVOICE_ANALYSIS_README.md](./INVOICE_ANALYSIS_README.md) for full API documentation.

---

## 🏗️ Architecture

### Tech Stack

- **Frontend:** React 19, TypeScript 5.9, Vite 7
- **Routing:** TanStack Router (file-based)
- **State:** TanStack Query, Zustand
- **Forms:** React Hook Form + Zod
- **UI:** shadcn/ui (Radix UI + Tailwind CSS 4)
- **Chat:** React Markdown, Highlight.js, Streaming API

### Project Structure

\`\`\`
src/
├── routes/              # File-based routing
│   └── _authenticated/  # Protected routes
│       ├── index.tsx    # Dashboard
│       ├── invoices/    # Invoice analysis
│       ├── chat/        # AI chat
│       └── settings/    # Settings
├── features/            # Feature modules
│   ├── invoices/       # Invoice analysis
│   ├── chat/           # AI chat
│   └── dashboard/      # Dashboard
└── components/          # Shared components
    ├── ui/             # shadcn/ui
    └── layout/         # Layout
\`\`\`

---

## 🎯 Key Features

### 1. Invoice Analysis Flow

\`\`\`
Upload → Review Detection → Confirm → Process → View Results
\`\`\`

### 2. Premium AI Chat

- Streaming responses with SSE
- Markdown rendering with \`react-markdown\`
- Code syntax highlighting
- Invoice context awareness
- Copy to clipboard

### 3. Smart Dashboard

- Real-time analytics
- Savings identification
- Recent invoices
- AI-powered insights

---

## 📦 Deployment

### Production Build

\`\`\`bash
npm run build
\`\`\`

Output: \`dist/\` directory

### Environment Variables

Set in your hosting platform:
- \`VITE_API_BASE_URL\`
- \`VITE_CHAT_API_BASE_URL\`

---

## 🎨 Customization

### Update Branding
- \`package.json\` - App name
- \`index.html\` - Page title
- \`src/components/layout/data/sidebar-data.ts\` - Navigation

### Theme Colors
Edit \`src/styles/theme.css\` for custom colors.

---

## 📝 Documentation

- [Invoice Analysis API](./INVOICE_ANALYSIS_README.md)
- Full API documentation included

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push and open PR

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

Built with [shadcn/ui](https://ui.shadcn.com), [React](https://react.dev), and [Tailwind CSS](https://tailwindcss.com)

---

<div align="center">

**Built with ❤️ for logistics professionals**

[Documentation](./INVOICE_ANALYSIS_README.md)

</div>

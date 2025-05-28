# SyncAgenda - AI Meeting Assistant

SyncAgenda is an AI-powered meeting assistant built with [React](https://react.dev/) and [Vite](https://vitejs.dev/) that automates post-meeting workflows like transcription, summarization, semantic Q\&A, sentiment analysis, and multilingual translation. Designed for modern teams, SyncAgenda significantly reduces manual work while improving meeting clarity, accessibility, and documentation accuracy.

---

## 🚀 Features

<!-- * 🌍 **Multi-Language Translation** – Translate transcripts to multiple languages to bridge accessibility gaps. -->
* 🎤 **Automatic Transcription** – Convert meeting audio/video to accurate text using ASR microservice.
* ✨ **AI-Powered Summarization** – Generate concise summaries of long discussions using LLMs.
* 📝 **Automated MoM Extraction** – Extract structured Minutes of Meeting (MoM) from recordings.
* ❓ **Semantic Q\&A, AI Chatbot** – Ask natural language questions and retrieve relevant meeting responses instantly.
* 😊 **Sentiment Analysis** – Detect speaker sentiment throughout the meeting to analyze tone and dynamics.
* 🎥 **Flexible Input Formats** – Supports uploading .mp4, .mp3, .wav, or .txt meeting content.
<!-- * 🔗 **Platform Integration Ready** – Ready for integration with platforms like Google Meet and Microsoft Teams. -->

---

## 🛠 Tech Stack

**Frontend:**

* React
* Vite
* Material UI
* Redux Toolkit

**Backend:**

* FastAPI (Python)
* PostgreSQL (with SQLAlchemy ORM)
* Redis with RediSearch (for embeddings and semantic search)
* Local file storage

**Microservices:**

* ASR (Speech to Text)
* Data Preparation
* LLM (Summarization, Q\&A, MoM)
* Embeddings and Retriever
* Document Summary

**DevOps:**

* Docker (Containerization)

---

## 📁 Project Structure

```
.
├── public/              # Static assets
├── redux/               # Redux store and slices
├── src/                 # Source code
│   ├── api/             # API utilities
│   ├── assets/          # Images and SVGs
│   ├── component/       # Reusable components
│   ├── layout/          # Layout components
│   ├── pages/           # Page components
│   └── theme/           # Theme and styling
├── index.html           # HTML entry point
├── package.json         # Project metadata and scripts
├── vite.config.js       # Vite configuration
└── README.md            # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v16+ recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit: [http://localhost:5173](http://localhost:5173)

### Building for Production

```bash
npm run build
# or
yarn build
```

### Previewing the Production Build

```bash
npm run preview
# or
yarn preview
```

### Linting

```bash
npm run lint
# or
yarn lint
```

---

<!-- ## 📈 Expected Impact

* 70–90% time saved in MoM preparation
* Better meeting insights and decision-making
* Greater inclusivity with translation support
* Improved productivity with semantic search and AI automation -->

## 📜 License

This project is licensed under the MIT License.

---

Made with ❤️ by Team Ghostpye for the Intel AI Hackathon.

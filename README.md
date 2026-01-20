# MindCare - Mental Health & Wellness Platform 🧠

A comprehensive mental health and wellness platform providing AI-powered support, mood tracking, screening tools, and personalized wellness resources.

## Project Overview

**URL**: https://lovable.dev/projects/e7146b5d-df27-49a4-b0dd-26acb64c1320

MindCare is a dual-application platform:
1. **React Web Application** - Full-featured mental health platform with AI support, mood tracking, and screening tools
2. **Streamlit Demo App** - Simplified demonstration interface for basic mental health assessments

## 🚀 Quick Start - Running Locally

> **📖 For detailed setup instructions, see [SETUP.md](./SETUP.md)**

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** - Comes with Node.js
- **Python 3.8+** - For the Streamlit app (optional)
- **Git** - For cloning the repository

### Setup Instructions

#### 1️⃣ Clone the Repository

```sh
# Clone this repository
git clone https://github.com/Preethu356/Saravadamana.git

# Navigate to the project directory
cd Saravadamana
```

#### 2️⃣ Set Up Environment Variables

```sh
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Supabase credentials
# You can get these from https://supabase.com/dashboard
```

Required environment variables:
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key
- `VITE_SUPABASE_URL` - Your Supabase project URL

#### 3️⃣ Running the React Web Application

```sh
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

#### 4️⃣ Running the Streamlit Demo App (Optional)

```sh
# Install Python dependencies
pip install -r requirements.txt

# Run the Streamlit app
streamlit run app.py
```

The Streamlit app will be available at `http://localhost:8501`.

### 🛠️ Available Scripts

**React Application:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build

**Python Application:**
- `streamlit run app.py` - Run the Streamlit demo app

## 📖 How to Edit This Code

There are several ways to edit and contribute to this application:

### **Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e7146b5d-df27-49a4-b0dd-26acb64c1320) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

### **Use Your Preferred IDE**

Work locally using your favorite IDE. Any changes you push will be reflected in Lovable.

### **Edit Directly in GitHub**

- Navigate to the desired file(s)
- Click the "Edit" button (pencil icon) at the top right
- Make your changes and commit

### **Use GitHub Codespaces**

- Click the "Code" button on the repository page
- Select the "Codespaces" tab
- Click "New codespace" to launch a cloud development environment

## 🎯 Features

- **AI-Powered Mental Health Support** - 24/7 AI chatbot assistance
- **Mood Tracking** - Daily mood logging and analytics
- **Screening Tools** - PHQ-9 (Depression), GAD-7 (Anxiety), WHO-5 (Wellbeing)
- **Personalized Care Levels** - Primary, Secondary, and Tertiary care pathways
- **Mind Sequencing** - Audio-guided mental wellness exercises
- **Journal & Reflection** - Private journaling with AI insights
- **Wellness Resources** - Diet, exercise, and sleep guidance
- **Research Updates** - Latest mental health research and news

## 🛠️ Technology Stack

**React Web Application:**
- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Components:** shadcn-ui, Radix UI
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** TanStack Query
- **Authentication:** Supabase Auth
- **Database:** Supabase (PostgreSQL)
- **AI Integration:** ElevenLabs for voice AI

**Streamlit Demo App:**
- **Framework:** Streamlit
- **Language:** Python 3.8+

## 📁 Project Structure

```
Saravadamana/
├── src/                    # React application source
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── integrations/      # Third-party integrations
├── public/                # Static assets
├── data/                  # Data files (assessments, etc.)
├── app.py                 # Streamlit demo application
├── requirements.txt       # Python dependencies
├── package.json           # Node.js dependencies
└── .env                   # Environment variables (not committed)
```

## 🚢 Deployment

**Deploy with Lovable:**
Simply open [Lovable](https://lovable.dev/projects/e7146b5d-df27-49a4-b0dd-26acb64c1320) and click on Share -> Publish.

**Deploy to Other Platforms:**
- **Vercel/Netlify:** Connect your GitHub repository
- **Self-hosted:** Run `npm run build` and serve the `dist/` folder

## 🔒 Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=https://your_project.supabase.co
```

## 🌐 Custom Domain

To connect a custom domain:
1. Navigate to Project > Settings > Domains
2. Click Connect Domain
3. Follow the setup instructions

[Learn more about custom domains](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of the Lovable platform.

## ⚠️ Disclaimer

This application is for educational and informational purposes only. It does not replace professional medical advice, diagnosis, or treatment. If you are experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.

## 📞 Support & Resources

- **National Suicide Prevention Lifeline:** 988 (US)
- **Crisis Text Line:** Text HOME to 741741
- **International Association for Suicide Prevention:** https://www.iasp.info/resources/Crisis_Centres/

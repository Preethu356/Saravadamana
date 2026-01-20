# Local Setup Guide for MindCare Platform

This guide will help you set up and run the MindCare platform on your local machine.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Running the Applications](#running-the-applications)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - **macOS/Linux:** Use [nvm](https://github.com/nvm-sh/nvm) (verify script integrity before running)
     ```bash
     # Visit https://github.com/nvm-sh/nvm for the latest version
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
     nvm install 18
     nvm use 18
     ```
   - **Windows:** Download from [nodejs.org](https://nodejs.org/)

2. **Git**
   - **macOS:** `brew install git` (with [Homebrew](https://brew.sh/))
   - **Linux:** `sudo apt-get install git` (Ubuntu/Debian) or `sudo yum install git` (RedHat/CentOS)
   - **Windows:** Download from [git-scm.com](https://git-scm.com/)

3. **Python 3.8+** (Optional, for Streamlit app)
   - **macOS/Linux:** Usually pre-installed, or use `brew install python3` or `sudo apt-get install python3`
   - **Windows:** Download from [python.org](https://www.python.org/)

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Preethu356/Saravadamana.git
cd Saravadamana

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Run the React app
npm install
npm run dev

# 4. (Optional) Run the Streamlit app in another terminal
pip install -r requirements.txt
streamlit run app.py
```

## Detailed Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Preethu356/Saravadamana.git
cd Saravadamana
```

### Step 2: Configure Environment Variables

The application requires Supabase credentials to function properly.

#### Getting Supabase Credentials

1. Sign up for a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to Project Settings > API
4. Copy the following values:
   - Project URL → `VITE_SUPABASE_URL`
   - Project Reference ID → `VITE_SUPABASE_PROJECT_ID`
   - anon/public key → `VITE_SUPABASE_PUBLISHABLE_KEY`

#### Setting Up .env File

```bash
# Copy the example file
cp .env.example .env

# Edit the file with your favorite editor
# macOS/Linux:
nano .env
# or
vim .env

# Windows:
notepad .env
```

Update the `.env` file with your credentials:

```env
VITE_SUPABASE_PROJECT_ID=your_actual_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_actual_publishable_key
VITE_SUPABASE_URL=https://your_actual_project_id.supabase.co
```

### Step 3: Install Dependencies

#### React Application

```bash
# Install Node.js dependencies
npm install

# This will install all packages listed in package.json
# First run may take a few minutes
```

#### Python Streamlit App (Optional)

```bash
# Using pip
pip install -r requirements.txt

# Or using a virtual environment (recommended)
# Note: Use .venv or a custom name to avoid confusion
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Running the Applications

### React Web Application

```bash
# Start the development server
npm run dev
```

The app will be available at:
- Local: `http://localhost:5173`
- Network: `http://<your-ip>:5173`

**Available Commands:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Check code quality

### Python Streamlit App

```bash
# Run the Streamlit app
streamlit run app.py
```

The app will be available at:
- Local: `http://localhost:8501`
- Network: `http://<your-ip>:8501`

**Streamlit Options:**
```bash
# Run on a specific port
streamlit run app.py --server.port 8502

# Run with auto-reload disabled
streamlit run app.py --server.runOnSave false
```

## Troubleshooting

### Common Issues

#### Port Already in Use

If port 5173 or 8501 is already in use:

**React/Vite:**
```bash
# Vite will automatically try the next available port
# Or specify a custom port in vite.config.ts
```

**Streamlit:**
```bash
streamlit run app.py --server.port 8502
```

#### Node Version Issues

```bash
# Check your Node version
node --version

# Should be v18 or higher
# If not, install the correct version:
nvm install 18
nvm use 18
```

#### Python Module Not Found

```bash
# Make sure you're in the correct directory
cd /path/to/Saravadamana

# Reinstall dependencies
pip install -r requirements.txt
```

#### Permission Denied Errors

**macOS/Linux:**
```bash
# Use sudo only if necessary
sudo npm install
# or
sudo pip install -r requirements.txt
```

**Windows:**
- Run Command Prompt or PowerShell as Administrator

#### .env File Not Loading

- Make sure the file is named `.env` (not `.env.txt`)
- Ensure it's in the root directory of the project
- Restart the development server after making changes

### Getting Help

If you encounter issues:

1. Check the [Issues](https://github.com/Preethu356/Saravadamana/issues) page
2. Search for similar problems
3. Create a new issue with:
   - Your operating system
   - Node.js and Python versions
   - Error messages
   - Steps to reproduce

## Development Tips

### Hot Reload

Both applications support hot reload:
- React app automatically reloads when you save files
- Streamlit app reloads when you save Python files

### IDE Setup

**Recommended Extensions for VS Code:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Python

### Code Quality

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Next Steps

After setup:
1. Explore the application features
2. Read the main [README.md](./README.md) for more information
3. Check out the [documentation](https://lovable.dev/projects/e7146b5d-df27-49a4-b0dd-26acb64c1320)
4. Start developing!

## Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Streamlit Documentation](https://docs.streamlit.io/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

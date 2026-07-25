# AI SQL & Excel Query Generator

An AI-powered SaaS application that converts natural language in plain English into production-ready **SQL queries** and **Excel formulas** using the **Gemini 3.6 API**.

## Features

- **Natural Language to Query**: Describe what you want in plain English (e.g., "Find total sales by region for the last 30 days and rank top 3 customers").
- **Multi-Dialect SQL Support**: PostgreSQL, MySQL, SQLite, SQL Server (T-SQL), and Oracle PL/SQL.
- **Multi-Version Excel Formulas**: Excel 365 (`XLOOKUP`, `FILTER`, `LET`), Excel 2019, Excel 2016 (`VLOOKUP`, `INDEX` + `MATCH`, `SUMIFS`).
- **15 Built-in Table Schemas**: Quick-load domain schemas for Orders, Employees, Students, Products, Inventory, Sales, HR, Library, Hospital, Bank, College, Movies, Flights, Hotel, and Retail.
- **Rich Output UI**:
  - Formatted SQL Code Block with Copy & Download `.sql` actions
  - Formatted Excel Formula Code Block with Copy & Download actions
  - Step-by-step Collapsible Explanation
  - Warning Card highlighting Common Mistakes
  - Success Card providing Performance Optimization Tips
- **Extra Feature 1 - Explain Existing Query**: Paste complex SQL or Excel formulas to get line-by-line clause deconstruction, performance warnings, and refactoring tips.
- **Extra Feature 2 - Generate Sample Data**: Auto-generate realistic mock table records (5 to 20 rows) with interactive cell copy and instant CSV file export.
- **Bonus Features**: Query History, Search & Favorites bookmarking, Dark Mode, and 8 Quick Clickable Prompt Presets.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Full-stack Express.js server
- **AI Model**: Google Gemini API (`gemini-3.6-flash`) with structured JSON response schema
- **Bundler & Build**: Vite, `esbuild`, `tsx`

## Environment Setup

Define `GEMINI_API_KEY` in `.env`:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

## Running Locally

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build production bundle
npm run build

# Start production server
npm start
```

## Deployment Instructions

### Vercel / Cloud Run / Railway / Render
1. Set Environment Variable `GEMINI_API_KEY` in the hosting platform control panel.
2. Build Command: `npm run build`
3. Start Command: `npm start`

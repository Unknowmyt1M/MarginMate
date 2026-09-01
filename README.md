# MarginMate — Dish Costing Calculator (V0 MVP)

> **Know your food. Know your margin.**
> Calculate the real cost and gross margin of any dish in seconds.

[![Deployment Status](https://img.shields.io/badge/Vercel-Live_Demo-emerald?style=flat-square&logo=vercel)](https://marginmate-v0.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-slate?style=flat-square&logo=github)](https://github.com/Unknowmyt1M/MarginMate)

---

## 🚀 Overview

**MarginMate** is a simple, frictionless dish-costing calculator built specifically for small food-business owners in India (cloud kitchens, restaurants, food trucks, home bakers).

This V0 Validation MVP helps owners immediately answer:
> *"Meri dish banane mein actually kitna cost aa raha hai aur selling price ke baad kitna gross profit bachta hai?"*

Live App: [https://marginmate-v0.vercel.app](https://marginmate-v0.vercel.app)

---

## ✨ Features (V0 Scope)

- **Flexible Ingredients**: Add, edit, or remove ingredients with custom quantities and prices.
- **Multi-Unit Normalization**:
  - Weight: Grams (`g`), Kilograms (`kg`)
  - Volume: Milliliters (`ml`), Liters (`litre`)
  - Count: Pieces (`piece`)
- **Packaging Cost Integration**: Factor in containers, boxes, cutlery, carry bags, etc.
- **Instant Financial Breakdown**:
  - **Total Cost**: Total ingredient cost + packaging cost.
  - **Gross Profit**: `Selling Price - Total Cost`.
  - **Gross Margin %**: `(Gross Profit / Selling Price) × 100`.
- **Negative Profit Alerts**: Clear loss indicators if dish cost exceeds selling price.
- **Indian Number Formatting**: Formatted in INR (`₹1,499`, `₹1,25,000`, `-₹25`).
- **Share Result**: One-click sharing via Web Share API or quick copy to clipboard.
- **Local Auto-Save**: Saves draft inputs in `localStorage` so accidental refresh won't erase work.
- **Mobile-Responsive**: Designed mobile-first for quick on-the-go calculation.

---

## 🧮 Calculation Logic

```text
Unit Normalization:
- 150g @ ₹280/kg  =>  280 × (150 / 1000) = ₹42
- 200ml @ ₹150/L  =>  150 × (200 / 1000) = ₹30
- 2 pcs @ ₹12/pc  =>  12 × 2             = ₹24

Totals:
Total Cost    = Total Ingredients Cost + Packaging Cost
Gross Profit  = Selling Price - Total Cost
Gross Margin  = (Gross Profit / Selling Price) × 100
```

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Testing**: Vitest
- **Deployment**: Vercel

---

## 💻 Local Setup

```bash
# Clone repository
git clone https://github.com/Unknowmyt1M/MarginMate.git
cd MarginMate

# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm test

# Production build
npm run build
```

---

## 📄 License

[MIT](LICENSE)

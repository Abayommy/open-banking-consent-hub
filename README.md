# Open Banking Consent Hub

A two-sided Open Banking consent management demo showing PSD2 consent flows from both the Bank (ASPSP) and User (PSU) perspectives.

![Open Banking Consent Hub](https://img.shields.io/badge/PSD2-Compliant-green) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🎯 What This Demonstrates

- **Full ecosystem understanding** of Open Banking consent management
- **Bank Dashboard (ASPSP)**: Analytics, TPP monitoring, compliance metrics
- **User Portal (PSU)**: Connected apps management, grant/revoke consent
- **Real-time sync**: Actions in one view reflect in the other

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
open-banking-consent-hub/
├── app/
│   ├── page.tsx              # Landing page (role selector)
│   ├── bank/
│   │   ├── layout.tsx        # Bank dashboard layout
│   │   └── page.tsx          # Bank analytics dashboard
│   └── user/
│       ├── layout.tsx        # User portal layout
│       ├── page.tsx          # My Connected Apps
│       ├── apps/[consentId]/ # Consent detail view
│       └── connect/          # New consent flow
├── components/               # Reusable components
├── lib/
│   ├── store/               # Zustand state management
│   ├── data/                # Mock data (TPPs, accounts, consents)
│   ├── types/               # TypeScript definitions
│   └── utils/               # Utility functions
```

## 🏦 Bank Dashboard Features

- **Metric Cards**: Active consents, expiring soon, revoked today, new today
- **Consents by Status**: Donut chart showing consent distribution
- **Consent Funnel**: Visualization of consent completion rates
- **TPP Performance Table**: Risk scores, revocation rates, activity
- **Trend Charts**: 14-day activity trends
- **Alerts Panel**: Expiring consent warnings

## 👤 User Portal Features

- **My Connected Apps**: List of active and inactive consents
- **App Detail View**: Permissions, accounts shared, activity log
- **Revoke Access**: One-click consent revocation
- **Renew Access**: Extend expiring consents
- **Connect New App**: 4-step consent creation wizard

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📊 Mock Data

The demo includes realistic mock data:
- 8 TPPs (Budget Buddy, Plaid, Tink, TrueLayer, etc.)
- 3 User Accounts (Current, Savings, Business)
- 7 Pre-configured consents (various statuses)
- Activity logs with API endpoint details

## 🔐 PSD2 Compliance Features

- Berlin Group NextGenPSD2 specification alignment
- Consent lifecycle management (90-day validity)
- Permission granularity (AIS/PIS separation)
- TPP authorization types (AISP, PISP, CBPII)
- NCA registration display
- SCA flow simulation

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/open-banking-consent-hub)

Or manually:
```bash
npm run build
vercel deploy
```

## 📝 Portfolio Use

This project demonstrates:
- Deep understanding of PSD2/Open Banking regulations
- Full-stack development skills (React, TypeScript, Node.js)
- Data visualization and analytics
- UX design for complex regulatory workflows
- State management across multiple views

## 🔗 Related Links

- [Berlin Group NextGenPSD2](https://www.berlin-group.org/)
- [PSD2 Regulatory Technical Standards](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32018R0389)
- [DORA Regulation](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R2554)

## 👨‍💻 Author

**Abayomi Ajayi**  
Open Banking & Payments Product Manager | PSD2 | ISO 20022 | API Platforms

---

Built to demonstrate PSD2 Open Banking consent management expertise.

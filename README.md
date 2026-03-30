# 🚀 Anonymous Message Platform

A full-stack anonymous messaging web application built with Next.js, where users can receive messages anonymously, verify their identity via email, and manage messages securely through a modern dashboard.

---
## 📸 Screenshots


### 🏠 Home Page
<img width="1919" height="960" alt="Screenshot 2026-03-30 153557" src="https://github.com/user-attachments/assets/95ad7a1d-4e98-4fe8-95ea-f207eb3f49a3" />


### User Dashboard
<img width="1919" height="959" alt="Screenshot 2026-03-30 153453" src="https://github.com/user-attachments/assets/f74a64b4-82cb-4fe3-bcc0-cc77b0289d51" />


<img width="1919" height="955" alt="Screenshot 2026-03-30 153532" src="https://github.com/user-attachments/assets/be72b38e-57a3-4eea-963e-f116bb598d10" />

---


## ✨ Features

- 🔐 Authentication using NextAuth
- 📩 Send & Receive Anonymous Messages
- 📧 Email Verification (OTP/Code-based)
- 🧾 Schema Validation using Zod
- 📝 Form Handling with React Hook Form
- 🤖 AI-powered Message Suggestions
- 🗑️ Delete Messages
- 🎯 Accept/Reject Messages Toggle
- 🔔 Toast Notifications (Sonner)
- ⚡ Modern UI using shadcn/ui

---

## 🛠️ Tech Stack

### 🚀 Frontend
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI)
- next-themes

### 🔧 Backend
- Next.js API Routes

### 🔐 Authentication
- NextAuth.js

### 🗄️ Database
- MongoDB (Database)
- Mongoose (ODM)

### 📦 Validation & Forms
- Zod
- React Hook Form

### 🤖 AI Integration
- OpenRouter API

### 📧 Email Services
- Resend
- React Email

### 🔒 Security & Utilities
- bcryptjs (password hashing)
- Axios (API calls)
- Day.js (date handling)
- clsx & tailwind-merge (class management)

### 🔒 Utilities
- bcryptjs
- Axios
- Day.js
- clsx + tailwind-merge

---

## ⚙️ Installation & Setup


### 1. Clone the repository

```bash
git clone https://github.com/Sarvesh7617/Anonymous-message-platform.git
```

### 2. Navigate to project directory

```bash
cd navigate_to_dir
```

### 3. Install dependencies
```bash
npm install
```

### 4. ⚙️ Environment Variables

#### Create a .env file in the root of your project:

```bash
# MongoDB connection string
MONGOOSE_URL="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net"

# Resend email API key
RESEND_API_KEY=" "

# NextAuth secret for authentication
NEXTAUTH_SECRET=""

# OpenRouter API credentials
OPENROUTER_API_KEY=""
OPENROUTE_URL="https://openrouter.ai/api/v1"

# Google OAuth credentials
CLIENT_ID=""
CLIENT_SECRET=""

```

### 5. Run development server

```bash
npm run dev
```


---


## 🔗 Live Website

👉 [Click here to visit project](https://anonymous-message-platform.vercel.app/)

---


## 📂 Project Structure

```bash
email/
│ └── verificationEmail.tsx        # Email template for OTP/verification
public/
│ └── logo.webp                   # Static asset (logo)
src/
├── app/
│    ├── (app)/
│    │   └── dashboard/
│    │       ├── layout.tsx       # Dashboard shared layout
│    │       └── page.tsx         # Dashboard main UI
│    │
│    ├── (auth)/
│    │   ├── sign-in              # Login page
│    │   ├── sign-up              # Register page
│    │   └── verify/
│    │        └── [username]/
│    │              └── page.tsx  # OTP verification (dynamic route)
│    │
│    ├── api/
│    │    ├── accept-message-status   # Toggle message accept/reject
│    │    ├── auth/
│    │    │    └── [...nextauth]/
│    │    │         ├── option.ts     # NextAuth configuration
│    │    │         └── route.ts      # NextAuth API handler
│    │    ├── check-username-unique   # Check username availability
│    │    ├── delete-message/
│    │    │    └── [messageId]/
│    │    │       └── route.ts        # Delete specific message
│    │    ├── get-message             # Fetch user messages
│    │    ├── send-message            # Send anonymous message
│    │    ├── signUp                  # User registration API
│    │    ├── suggest-message         # AI message suggestions
│    │    └── verify-code             # Verify OTP/code
│    │
│    ├── u/
│    │   └── [username]/
│    │       └── page.tsx             # Public user message page
│    │
│    ├── favicon                      # App favicon
│    ├── global.css                   # Global styles
│    └── layout.tsx                   # Root layout
│
├── components/
│    ├── ui/                          # shadcn UI components
│    ├── MessageCard.tsx              # Message display card
│    ├── Navbar.tsx                   # Navigation bar
│    └── otp.tsx                      # OTP input component
│
├── lib/
│   ├── dbconnect.ts                  # MongoDB connection setup
│   ├── resend.ts                     # Resend email configuration
│   └── utils.ts                      # Utility functions (shadcn helpers)
│
├── models/
│   ├── user.ts                       # User schema/model
│   └── message.ts                    # Message schema/model
│
├── schemas/
│    ├── acceptmessageSchema.ts       # Validation for message toggle
│    ├── messageSchema.ts             # Message validation schema
│    ├── signinSchema.ts              # Sign-in validation
│    ├── signupSchema.ts              # Sign-up validation
│    └── verifycodeSchema.ts          # OTP verification validation
│
├── Types/
│    ├── ApiResponse.ts               # API response types
│    ├── dbTypes.ts                   # Database-related types
│    └── next-auth.d.ts               # NextAuth type extensions
│
├── helper/
│  └── sendVerificationEmail.tsx      # Function to send verification email
│
├── ClientProvider.tsx                # Global client-side providers (session/theme)
├── Constant.ts                       # App constants (e.g., DB name)
├── messages.json                     # Default/homepage messages
└── proxy                             # Proxy/config related setup
```
---

## 🔑 Core Functionalities

### 📨 Anonymous Messaging

- Users can receive messages without revealing sender identity.

### 🔐 Authentication System
- Signup / Login via NextAuth
- Secure session management

### 📧 Email Verification
- OTP/Code sent via Resend
- Verification before account activation
- 🧾 Data Validation
- Zod ensures type-safe validation on both frontend & backend
- 🤖 AI Message Suggestions
- Uses OpenRouter API to generate smart suggestions

### 🎨 UI/UX
- Built with shadcn/ui + Radix
- Fully responsive & theme-enabled

---

## 📈 Future Improvements
- 🔔 Real-time messaging (WebSockets)
- 🛡️ Rate limiting & spam protection
- 📱 Enhanced mobile UX
- 📬 Email notifications for new messages
- 🧠 Better AI personalization


---


## 📄 License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute this software with proper attribution.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

\# AI Donation Management System



\### AI-Powered Donation–NGO Matching and Resource Distribution Platform



An AI-powered full-stack web application designed to manage donations, identify donated items using computer vision, match resources with NGO requirements, and support efficient pickup scheduling.



\---



\## 🚀 Features



\- 🔐 User Registration and Login

\- 🔑 JWT-based Authentication

\- 👤 User Profile Management

\- 🎁 Donation Management

\- 📷 Image Upload for Donations

\- 🤖 AI-based Item Detection using YOLOv8

\- 🏢 NGO Management

\- 📋 NGO Demand Registry

\- 🎯 Intelligent Donation–NGO Matching

\- ⭐ Priority-based Match Scoring

\- ✅ Match Confirmation

\- 🚚 Pickup Scheduling

\- 📊 Dynamic Dashboard Statistics

\- 📜 Donation History

\- 🗄️ PostgreSQL Database Integration



\---



\## 🏗️ System Architecture



```text

&#x20;                   ┌─────────────────────┐

&#x20;                   │   React Frontend    │

&#x20;                   │   Vite + MUI        │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;                              │ REST API

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │ Node.js + Express   │

&#x20;                   │ Backend API         │

&#x20;                   └───────┬───────┬─────┘

&#x20;                           │       │

&#x20;                           │       │

&#x20;                           ▼       ▼

&#x20;                  ┌────────────┐  ┌─────────────────┐

&#x20;                  │ PostgreSQL │  │ Python Flask    │

&#x20;                  │ Database   │  │ AI Service      │

&#x20;                  └────────────┘  └────────┬────────┘

&#x20;                                           │

&#x20;                                           ▼

&#x20;                                     ┌────────────┐

&#x20;                                     │  YOLOv8    │

&#x20;                                     │ AI Model   │

&#x20;                                     └────────────┘


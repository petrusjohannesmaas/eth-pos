# Ethereum Point of Sale System

## Vision
A self-hostable PoS that can run either as a Trad-fi or Defi commerce solution using Docker Compose.

## Current Progress
Currently, the project implements a **cash-based Point of Sale (POS)** system using the **MERN stack** for GUI (MongoDB, Express, React, Node.js) with **n8n workflows** for database operations and automation.  
The schema design is documented in [`cash-pos-schema.md`](./cash-pos-schema.md).

---

## 🎯 MVP Milestones
- Build a **simple POS MVP** with MongoDB as the datastore.
- Use **n8n workflows** to handle queries, inserts, and reporting.
- Provide a **React (Vite + Router v7)** frontend for cashiers and admins.
- Support **receipt-based transactions** and **daily cash sessions**.
- Prepare the system for **future blockchain payment integration**.

---

## 📂 Collections Overview
The schema defines the following MongoDB collections:

- **categories** → Group products for UI display  
- **products** → Inventory items with barcode, SKU, stock, and pricing  
- **users** → Staff members (cashiers/admin)  
- **sales** → Completed transactions with embedded line items  
- **cash_sessions** → Cashier shifts with opening/closing balances  

See [`cash-pos-schema.md`](./cash-pos-schema.md) for full details.

---

## 🛠 Tech Stack
- **Frontend**: React + Vite + Router v7
- **Backend**: Node.js + Express
- **Database**: MongoDB (Dockerized)
- **Automation**: n8n (MongoDB nodes + webhooks)
- **Containerization**: Docker Compose

---

## 🚀 Getting Started
1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/cash-pos.git
   cd cash-pos
   ```
2. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
   - Frontend: http://localhost:3000  
   - Backend API: http://localhost:5000  
   - MongoDB: localhost:27017  
   - n8n UI: http://localhost:5678  

---

## 📌 Core Operations (via n8n)
- Lookup product by barcode  
- Create sale and reduce inventory  
- Open/close cash sessions  
- Generate daily sales reports  

---

## 🔮 Future Extensions
- Blockchain payments integration  
- Card payments and refunds  
- Customer profiles and loyalty  
- Multi-store support  
- Advanced reporting and analytics  

---

This way your repo looks **clean, modern, and forward-looking**: it highlights MERN + n8n, references the schema file, and clearly states blockchain integration as the next milestone.  

Would you like me to also **add a sample diagram (in text form)** showing how the frontend, backend, MongoDB, and n8n interact, so the README visually explains the flow?

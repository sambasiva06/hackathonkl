# 🌿 AyurSutra — Panchakarma Patient Management System

AyurSutra is a full-stack healthcare MVP designed to digitize manual clinic workflows for Panchakarma therapy. It provides a seamless interface for Practitioners to manage patients/sessions and for Patients to track their healing journey.

## 🚀 Quick Start Instructions

### Prerequisites
- **Java 17+**
- **Node.js 18+**
- **No external Database required** (Uses H2 In-Memory by default for rapid hackathon testing)

### 1. Database & H2 Console
- The application uses an **H2 In-Memory Database**. 
- It resets EVERY time you restart the backend (Perfect for clean hackathon demos).
- You can access the H2 Web Console at: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:ayursutra`
- **User**: `sa` | **Password**: `password`

### 2. Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
- API will be available at: `http://localhost:8080`

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Web App will be available at: `http://localhost:5173`

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Practitioner** | `arjun@ayursutra.com` | `password123` |
| **Patient** | `priya@gmail.com` | `password123` |

---

## 🛠️ Tech Stack
- **Backend**: Java Spring Boot, Spring Security (JWT), Hibernate/JPA
- **Frontend**: React.js (Vite), Axios, Framer Motion, Lucide React
- **Database**: PostgreSQL
- **Design**: Clean modern healthcare UI with Teal/Emerald palette and Glassmorphism.

## 📊 Core Workflow
1. **Practitioner** logs in and creates a **Patient Profile**.
2. **Practitioner** creates a **Therapy Plan** (Purvakarma → Pradhanakarma → Paschatkarma).
3. **Practitioner** schedules **Therapy Sessions** for the plan.
4. **Patient** logs in to view their **Visual Timeline** and upcoming sessions.
5. After a session, **Patient** submits **Feedback** (Rating + Message).
6. **Practitioner** views feedback on their dashboard to monitor progress.

---
Built for the Hackathon MVP — Focusing on digitizing the ancient science of Panchakarma. 🙏

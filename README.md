 # 🎤 AI Speech Learning Assistant (Full-Stack)

An intelligent, full-stack mobile platform designed to help children master pronunciation through real-time AI feedback. This project integrates a high-performance **Expo (React Native)** frontend with a robust **Django** backend, powered by **Azure AI Services**.

---

## 🏗️ System Architecture
The project follows a modern **Monorepo** architecture:
1. **Frontend (Mobile):** Captures user speech and displays gamified feedback.
2. **Backend (API):** Processes audio, manages the database, and communicates with AI services.
3. **AI Layer (Cloud):** Performs phoneme-level pronunciation assessment.
4. **Database (Cloud):** Persists user attempts and scores for progress tracking.

---

## 🚀 Technologies Used & Why

### **1. Frontend: Expo (React Native)**
*   **Why:** Cross-platform efficiency and rapid prototyping.
*   **How it works:** Uses `expo-av` to record high-quality audio in `.m4a` format. It manages the application state using **Custom Hooks** and **Context API** to provide a seamless UI experience.

### **2. Backend: Django REST Framework (Python)**
*   **Why:** Python is the industry standard for AI/ML integrations. Django provides a secure, scalable "batteries-included" framework.
*   **How it works:** Receives the audio via a POST request, uses **Pydub** and **FFmpeg** to convert audio to the specific `.wav` format required by Azure, and handles business logic (scoring/feedback).

### **3. AI Brain: Azure Speech & OpenAI Services**
*   **Why:** Provides enterprise-grade accuracy for **Pronunciation Assessment** (Phoneme-level analysis) which simple STT (Speech-to-Text) cannot do.
*   **How it works:** Analyzes the audio wave against the target word, calculating accuracy based on fluency, completeness, and pronunciation. It then uses **GPT-4 (Azure OpenAI)** to generate child-friendly, encouraging feedback.

### **4. Database: PostgreSQL (Supabase)**
*   **Why:** A reliable relational database to store user history and analytics.
*   **How it works:** Every speech attempt is logged with the target word, accuracy score, and recognized text for future progress reporting.

### **5. API Documentation: Swagger (OpenAPI)**
*   **Why:** Ensures the API is professional, testable, and easy for other developers to integrate.
*   **How it works:** Uses `drf-spectacular` to automatically generate interactive documentation at `/api/docs/`.

---

## ✨ Key Features
- **Phonetic Scoring:** Real-time accuracy percentage (0-100%).
- **Smart Teacher Feedback:** AI-generated emojis and encouraging messages tailored for kids.
- **Audio Pre-processing:** Automated server-side conversion from `.m4a` to `16kHz Mono WAV`.
- **Progress Tracking:** Interactive progress bars and lesson navigation.
- **Clean Architecture:** Follows MVVM (Model-View-ViewModel) and Separation of Concerns.

---

## 🛠️ Installation & Setup

### **Backend (Django)**
1. Navigate to directory: `cd learning-backend`
2. Create Virtual Env: `python -m venv venv` and activate it.
3. Install dependencies: `pip install -r requirements.txt`
4. Set up `.env` file with your **Azure Keys** and **Database URL**.
5. Run migrations: `python manage.py migrate`
6. Start server: `python manage.py runserver`

### **Frontend (Expo)**
1. Navigate to directory: `cd my-learning-app`
2. Install packages: `npm install`
3. Update the `BACKEND_URL` in `LessonContext.tsx` with your local IP.
4. Start App: `npx expo start`

---

## 📸 Project Folder Structure
```text
.
├── learning-backend/       # Django Project (Python)
│   ├── api/                # Speech logic and REST endpoints
│   └── backend/            # Project configuration
├── my-learning-app/        # Expo Project (React Native)
│   ├── app/                # Screens and Navigation
│   └── context/            # Global state management
└── README.md               # Project Documentation
👨‍💻 Developed By
Merab Iftikhar
React Native Developer & AI Automation Specialist
LinkedIn | GitHub
code
Code
---

### **Final Instructions for You:**

1.  **Save this file:** Save it as `README.md` in your main `Expo` folder.
2.  **Add and Commit:**
    ```bash
    git add README.md
    git commit -m "Add professional documentation with tech stack details"
    ```
3.  **Push to GitHub:**
    ```bash
    git push origin main

## 👨‍💻 Developed By
**Merab Iftikhar**  
*React Native Developer & AI Automation Specialist*  
[LinkedIn](https://linkedin.com/in/merab-iftikhar-butt-a5480b343) | [GitHub](https://github.com/MerabIftikar)

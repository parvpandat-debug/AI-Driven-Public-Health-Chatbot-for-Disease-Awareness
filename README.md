# AI Driven Public Health Chatbot for Disease Awareness

[![GSSoC'26](https://img.shields.io/badge/GSSoC-2026-orange?style=for-the-badge)](https://gssoc.girlscript.tech/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Health-AI** is an intelligent, accessible platform designed to provide real-time disease awareness and preventive health information. Built with a modern frontend stack and integrated with open-source AI models, it aims to make reliable health guidance free and available to everyone.

---

## 🚀 Features

* **AI-Powered Guidance:** Get instant information on symptoms, prevention, and general health queries.
* **No-Key Architecture:** Runs using public inference models—no expensive API keys required for basic functionality.
* **Knowledge Dashboard:** Quick-access cards for common illnesses (Flu, Diabetes, Mental Health).
* **Medical Disclaimer:** Built-in safeguards to ensure users prioritize professional medical advice.
* **Responsive Design:** Fully optimized for mobile, tablet, and desktop views.

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **AI Integration:** xAI Grok via Vite dev-server proxy
* **Deployment:** Vercel

---

## 📦 Getting Started

### Prerequisites
* Node.js (v18.0 or higher)
* npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/parvpandat-debug/health-ai.git](https://github.com/parvpandat-debug/health-ai.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd health-ai
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a `.env` file in the project root:**
    ```bash
    XAI_API_KEY=your_xai_api_key_here
    ```
5.  **Start the development server:**
    ```bash
    npm run dev
    ```
6.  Open [http://localhost:5173](http://localhost:5173) in your browser.

### Check your xAI key with Postman

Run the temporary local server:

```bash
npm run xai:test-server
```

Then call this in Postman:

```http
POST http://localhost:8787/check-key
Content-Type: application/json

{
    "message": "Give practical health measures for staying healthy during flu season."
}
```

You can also verify the server is up with:

```http
GET http://localhost:8787/health
```

---

## 🤝 Contributing to GSSoC 2026

We welcome contributors of all skill levels! To contribute:

1.  **Fork** the repository.
2.  **Create a branch** for your feature (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

> **Note:** Please ensure you are assigned to an issue before working on it to earn GSSoC points!

---

## 📜 Roadmap

- [ ] Add Multi-language support (Hindi, Spanish, French).
- [ ] Implement Dark Mode toggle.
- [ ] Add a "Find Nearest Hospital" feature using Geolocation API.
- [ ] Convert into a Progressive Web App (PWA) for offline access.

---

## ⚖️ Disclaimer


> [!WARNING]  
> **MEDICAL DISCLAIMER:** This AI-Driven Public Health Chatbot is designed strictly for educational purposes, public literacy, and preventive health awareness. It **does not** provide official medical diagnoses, clinical assessments, or treatment plans. The system is not a replacement for professional medical advice, consultation, or emergency healthcare services. Always encourage users to consult a qualified medical professional for health concerns.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
**Project Admin:** [parvpandat-debug](https://github.com/parvpandat-debug)  

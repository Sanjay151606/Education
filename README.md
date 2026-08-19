# 🧠 Learning Trajectory Graph Intelligence Platform (v1.0)

Modern education systems measure outcomes at fixed checkpoints, often ignoring the non-linear and individualized nature of learning.

This platform is a first-of-its-kind **AI Intelligence System** capable of modeling, predicting, and optimizing learner trajectories as evolving knowledge graphs.

---

## 🚀 Key Features

### 🔹 Multimodal Sensing

Captures real-time facial expressions and voice feedback to determine cognitive load states such as:

* Confusion
* Engagement
* Boredom

### 🔹 Non-Linear Trajectory Modeling

Uses **Gemini 2.5 Flash (Preview)** to:

* Identify conceptual gaps
* Reason through prerequisite dependencies
* Dynamically re-route learners through an optimized knowledge graph

### 🔹 Conceptual Comparison Engine

Analyzes the “bridge” between two distinct concepts by:

* Identifying shared prerequisites
* Mapping mastery paths
* Suggesting optimal learning transitions

### 🔹 Adaptive Intelligence

Automatically recommends the next learning **Node** based on:

* Emotional signals
* Vocal patterns
* Detected cognitive state

### 🔹 Local Secure Storage

Uses a local **SQLite3 database** to securely store:

* User credentials
* Session metadata
* Learning trajectory data

---

## 🛠️ Tech Stack

**Frontend**

* HTML5
* Tailwind CSS (Glassmorphism UI)
* JavaScript (MediaRecorder API, Canvas API)

**Backend**

* Python
* Flask
* Flask-CORS

**AI Engine**

* **Gemini 2.5 Flash Preview**
* Multimodal REST Integration

**Database**

* SQLite3

---

## 📦 Project Structure

```
learning_platform/
│
├── app.py             # Flask Backend: Gemini Integration & Database Logic
├── index.html         # Frontend: UI, Sensing Module & Comparison Tool
├── requirements.txt   # Python Dependencies
└── users.db           # Local SQLite Database (Auto-generated on first run)
```

---

## ⚙️ Installation & Setup

### 1️⃣ Create or Clone the Project Folder

```bash
mkdir learning_platform
cd learning_platform
```

---

### 2️⃣ Install Dependencies

Make sure Python is installed, then run:

```bash
python -m pip install flask flask-cors requests google-genai python-dotenv
```

---

### 3️⃣ Configure API Key

In `app.py`, set your Gemini API key:

```python
API_KEY = "YOUR_GEMINI_API_KEY_HERE"
```

**Model Used:**

```
gemini-2.5-flash-preview-09-2025
```

---

### 4️⃣ Run the Application

```bash
python app.py
```

---

### 5️⃣ Open the Platform

Navigate to:

```
http://127.0.0.1:5000
```

---

## 📖 Usage Guide

### 🟢 Step 1 — Initialize Hardware

Click **“Initialize”** to grant Camera and Microphone access.

### 🎥 Step 2 — Capture Learner State

Click **“Capture Learner State”**
The system records 3 seconds of video and audio input.

### 🧠 Step 3 — Trajectory Optimization

View the **Trajectory Optimization Output** to see:

* Predicted next node
* Identified conceptual gaps
* Suggested learning path

### 🔎 Step 4 — Concept Comparison

Use the **Conceptual Comparison Engine** to:

* Compare any two topics
* Discover shared foundations
* Identify transition bridges



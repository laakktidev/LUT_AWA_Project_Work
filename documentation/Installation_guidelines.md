# Installation Guidelines

Follow these steps to install and run the project locally.

---

## 1. Prerequisites

Ensure the following are installed:

- **Node.js** (LTS recommended)  
- **npm** or **yarn**  
- **MongoDB** (local or cloud, e.g., MongoDB Atlas)

---

## 2. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

---

## 3. Install Dependencies

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

---

## 4. Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-db
JWT_SECRET=your-secret-key
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000
```

---

## 5. Start Development Servers

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---


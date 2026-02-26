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
cd client
npm install
```

### Backend
```bash
cd server
npm install
```

---

## 4. Environment Variables

### Backend `.env`
```
MONGO_URL = "mongodb://127.0.0.1:27017/testdb2"
SECRET=520933kl2klsdfvklsdmfrwR52452p948u
PORT=8000
RESEND_API_KEY=re_59K2u6nw_DtemQz7qwB2VTwgdnk6S5R12
APP_URL=http://localhost:3000
```

### Frontend services/config.ts
```
export const BASE_URL = **"http://localhost:8000/api**
```

---

## 5. Start Development Servers

### Backend
```bash
cd server
npm run dev
```

### Frontend
```bash
cd client
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

---


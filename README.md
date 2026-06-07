# Cartico 🔍

> **"Brands Have Secrets, Cartico Has Answers"**

Cartico is a QR/barcode-based product authenticity and trust verification platform built for Indian consumers. Scan any product, get instant truth.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## 🌐 Live Demo

**Frontend:** [cartico-theta.vercel.app](https://cartico-theta.vercel.app)  
**Backend API:** Coming soon on Render

---

## 💡 What Does Cartico Do?

Indian consumers often fall victim to fake products, misleading discounts, and hidden ingredients. Cartico solves this by letting users:

- 📷 **Scan** any product's QR code or barcode
- ✅ **Verify** product authenticity instantly
- 📊 **View** trust score, health score, and ingredient breakdown
- 🔍 **Compare** two products side by side
- 📁 **Track** personal scan history on their dashboard

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React.js | UI framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Axios | API requests |
| Vercel | Deployment |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | Server framework |
| MongoDB Atlas | Cloud database |
| Mongoose | Database modeling |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Render | Deployment |

---

## 📁 Project Structure

```
Cartico/
├── public/               # Static assets
├── server/               # Backend (Node.js + Express)
│   ├── index.js          # Server entry point
│   ├── .env              # Environment variables (not committed)
│   ├── package.json      # Backend dependencies
│   └── README.md         # Backend documentation
├── src/                  # Frontend (React)
│   ├── assets/           # Images and icons
│   ├── components/       # Reusable UI components
│   ├── pages/            # Application pages
│   │   ├── AuthPage.jsx          # Login / Signup
│   │   ├── ScannerPage.jsx       # QR / Barcode scanner
│   │   ├── ProductAnalysisPage.jsx # Product details & trust score
│   │   ├── ComparePage.jsx       # Compare two products
│   │   └── DashboardPage.jsx     # User scan history
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🔌 API Routes

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/product/:id` | Get product by barcode/ID |
| GET | `/api/product/compare?ids=x,y` | Compare two products |
| POST | `/api/products` | Add new product |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/:userId` | Get user scan history |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Frontend

```bash
git clone https://github.com/surbhii-thisside/Cartico.git
cd Cartico
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
node index.js
```

---

## 📈 Development Progress

| Step | Task | Status |
|------|------|--------|
| 1 | Express server setup | ✅ Done |
| 2 | MongoDB Atlas connection | ✅ Done |
| 3 | Auth routes (register + login) | 🔄 In Progress |
| 4 | Product APIs | ⏳ Pending |
| 5 | Dashboard API | ⏳ Pending |
| 6 | Deploy backend on Render | ⏳ Pending |

---

## 👩‍💻 Developer

**Surbhi** — B.Tech CSE, 1st Year  

GitHub: [@surbhii-thisside](https://github.com/surbhii-thisside)

---

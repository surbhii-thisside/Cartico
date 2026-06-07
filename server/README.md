# Cartico — Backend API

> **"Brands Have Secrets, Cartico Has Answers"**  
> A QR/barcode-based product authenticity and trust verification platform for Indian consumers.

---

## 🚀 Live

| Layer | URL |
|-------|-----|
| Frontend | [cartico-theta.vercel.app](https://cartico-theta.vercel.app) |
| Backend | Coming soon on Render |

---

## 🧠 What is Cartico?

Cartico helps Indian consumers verify whether a product is genuine before buying it. Users can scan a QR code or barcode on any product and instantly get:

- ✅ Product authenticity status
- 📊 Trust score based on brand data
- 🧪 Ingredient breakdown and health score
- 🔍 Side-by-side product comparison
- 📁 Personal scan history dashboard

---

## 🛠️ Tech Stack

### Backend
| Tool | Purpose |
|------|---------|
| Node.js | Runtime environment |
| Express.js | Web server framework |
| MongoDB Atlas | Cloud database (free tier) |
| Mongoose | MongoDB object modeling |
| JSON Web Token (JWT) | User authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variable management |
| CORS | Cross-origin request handling |

### Frontend (separate repo)
- React.js, Tailwind CSS, Framer Motion, Axios
- Deployed on **Vercel**

---

## 📁 Project Structure

```
server/
├── index.js          # Entry point — Express app setup
├── .env              # Environment variables (not committed)
├── package.json      # Dependencies
└── node_modules/     # Installed packages
```

> **Note:** Full MVC folder structure (routes/, models/, controllers/, middleware/) will be added as development progresses.

---

## 🗄️ Database Collections (MongoDB)

| Collection | Purpose |
|------------|---------|
| `users` | Stores registered user accounts |
| `products` | Stores product data linked to barcodes/QR codes |
| `scan_history` | Tracks each user's scanned products |

---

## 🔌 API Routes

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Products
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/product/:id` | Get product details by barcode/ID |
| GET | `/api/product/compare?ids=x,y` | Compare two products |
| POST | `/api/products` | Add a new product (admin) |

### Dashboard
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/dashboard/:userId` | Get user's scan history and saved items |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/surbhii-thisside/Cartico.git

# 2. Navigate to server folder
cd Cartico/server

# 3. Install dependencies
npm install

# 4. Create .env file
touch .env
```

Add the following to your `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
```

```bash
# 5. Start the server
node index.js
```

Server will run on `http://localhost:5000`

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port number for the server (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

---

## 📈 Development Progress

| Step | Task | Status |
|------|------|--------|
| 1 | Express server setup | ✅ Done |
| 2 | MongoDB Atlas connection | ✅ Done |
| 3 | Auth routes (register + login) | 🔄 In Progress |
| 4 | Product APIs | ⏳ Pending |
| 5 | Dashboard API | ⏳ Pending |
| 6 | Deploy on Render | ⏳ Pending |

---

## 👩‍💻 Developer

**Surbhi** — B.Tech CSE, 1st Year  
Lingaya's Vidyapeeth, Faridabad  
GitHub: [@surbhii-thisside](https://github.com/surbhii-thisside)

---

*Built with 💚 as a real-world backend learning project.*
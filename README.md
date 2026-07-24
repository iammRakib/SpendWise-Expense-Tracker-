# SpendWise 💰

SpendWise is a full-stack expense tracking application designed to help users manage their personal expenses and keep track of their spending.

## 🚀 Features

- User registration and login
- Secure user authentication
- Add and manage expenses
- Track personal spending
- Categorize expenses
- View expense data and financial insights
- Responsive user interface

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

## 📁 Project Structure
```text
SpendWise/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Expense.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── expenseRoutes.js
│   │
│   └── server.js
│
├── frontend/
│   ├── css/
│   │   ├── auth.css
│   │   ├── responsive.css
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── analytics.js
│   │   ├── auth.js
│   │   ├── expenses.js
│   │   └── index.js
│   │
│   ├── analytics.html
│   ├── expenses.html
│   ├── index.html
│   ├── login.html
│   └── signup.html
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
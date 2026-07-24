const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

dotenv.config();

const app = express();


// =========================
// DATABASE CONNECTION
// =========================

connectDB();


// =========================
// MIDDLEWARE
// =========================

app.use(
    cors({
        origin: "*"
    })
);

app.use(express.json());


// =========================
// ROUTES
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/expenses", expenseRoutes);


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to SpendWise API"
    });
});


// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `SpendWise server running on http://localhost:${PORT}`
    );


});
const express = require("express");

const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// GET ALL EXPENSES
// =========================

router.get("/", authMiddleware, async (req, res) => {
    try {
        const expenses = await Expense.find({
            user: req.user.id
        }).sort({
            date: -1
        });

        res.status(200).json(expenses);

    } catch (error) {
        console.error("Get expenses error:", error);

        res.status(500).json({
            message: "Failed to fetch expenses"
        });
    }
});


// =========================
// ADD EXPENSE
// =========================

router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            title,
            amount,
            category,
            date
        } = req.body;


        if (!title || !amount || !category) {
            return res.status(400).json({
                message: "Please fill in all required fields"
            });
        }


        const expense = await Expense.create({
            user: req.user.id,
            title,
            amount,
            category,
            date: date || new Date()
        });


        res.status(201).json({
            message: "Expense added successfully",
            expense
        });


    } catch (error) {
        console.error("Add expense error:", error);

        res.status(500).json({
            message: "Failed to add expense"
        });
    }
});


// =========================
// ANALYTICS
// =========================

router.get("/analytics", authMiddleware, async (req, res) => {

    try {

        // =========================
        // GET USER EXPENSES
        // =========================

        const expenses = await Expense.find({
            user: req.user.id
        }).sort({
            date: 1
        });


        // =========================
        // TOTAL EXPENSES
        // =========================

        const totalExpenses = expenses.reduce(
            (total, expense) => {

                return (
                    total +
                    Number(expense.amount)
                );

            },
            0
        );


        // =========================
        // CATEGORY TOTALS
        // =========================

        const categoryTotals = {};


        expenses.forEach((expense) => {

            const category =
                expense.category;


            if (!categoryTotals[category]) {

                categoryTotals[category] =
                    0;

            }


            categoryTotals[category] +=
                Number(expense.amount);

        });


        // =========================
        // CURRENT MONTH TOTAL
        // =========================

        const currentDate =
            new Date();


        const currentMonthExpenses =
            expenses.filter((expense) => {

                const expenseDate =
                    new Date(
                        expense.date
                    );


                return (

                    expenseDate.getMonth() ===
                    currentDate.getMonth()

                    &&

                    expenseDate.getFullYear() ===
                    currentDate.getFullYear()

                );

            });


        const currentMonthTotal =
            currentMonthExpenses.reduce(
                (total, expense) => {

                    return (
                        total +
                        Number(expense.amount)
                    );

                },
                0
            );


        // =========================
        // MONTHLY TOTALS
        // =========================

        const monthlyTotals = {};


        expenses.forEach((expense) => {

            const expenseDate =
                new Date(
                    expense.date
                );


            const month =
                expenseDate.toLocaleString(
                    "en-IN",
                    {
                        month: "short"
                    }
                );


            const year =
                expenseDate.getFullYear();


            const monthKey =
                `${month} ${year}`;


            if (!monthlyTotals[monthKey]) {

                monthlyTotals[monthKey] =
                    0;

            }


            monthlyTotals[monthKey] +=
                Number(expense.amount);

        });


        // =========================
        // SEND ANALYTICS
        // =========================

        res.status(200).json({

            totalExpenses,

            transactionCount:
                expenses.length,

            currentMonthTotal,

            categoryTotals,

            monthlyTotals

        });


    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch analytics"

        });

    }

});


// =========================
// DELETE EXPENSE
// =========================

router.delete("/:id", authMiddleware, async (req, res) => {

    try {

        const expense =
            await Expense.findOneAndDelete({

                _id:
                    req.params.id,

                user:
                    req.user.id

            });


        if (!expense) {

            return res.status(404).json({

                message:
                    "Expense not found"

            });

        }


        res.status(200).json({

            message:
                "Expense deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete expense error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to delete expense"

        });

    }

});


module.exports = router;
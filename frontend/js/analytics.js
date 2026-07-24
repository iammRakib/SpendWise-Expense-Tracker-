const API_URL =
    "http://localhost:5001/api";


// =========================
// AUTH CHECK
// =========================

const token =
    localStorage.getItem(
        "spendwiseToken"
    );


if (!token) {

    window.location.href =
        "login.html";

}


// =========================
// DOM ELEMENTS
// =========================

const totalSpending =
    document.getElementById(
        "totalSpending"
    );


const transactionCount =
    document.getElementById(
        "transactionCount"
    );


const monthlySpending =
    document.getElementById(
        "monthlySpending"
    );


const topCategory =
    document.getElementById(
        "topCategory"
    );


const topCategoryMessage =
    document.getElementById(
        "topCategoryMessage"
    );


// =========================
// CHART VARIABLES
// =========================

let categoryChart;

let monthlyChart;


// =========================
// LOAD ANALYTICS
// =========================

async function loadAnalytics() {

    try {

        const response =
            await fetch(
                `${API_URL}/expenses/analytics`,
                {
                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }
                }
            );


        // Check authentication

        if (
            response.status === 401
        ) {

            logout();

            return;

        }


        if (!response.ok) {

            throw new Error(
                "Failed to load analytics"
            );

        }


        const data =
            await response.json();


        console.log(
            "Analytics data:",
            data
        );


        // =========================
        // UPDATE SUMMARY CARDS
        // =========================

        totalSpending.textContent =
            `₹${Number(
                data.totalExpenses
            ).toFixed(2)}`;


        transactionCount.textContent =
            data.transactionCount;


        monthlySpending.textContent =
            `₹${Number(
                data.currentMonthTotal
            ).toFixed(2)}`;


        // =========================
        // CATEGORY ANALYTICS
        // =========================

        const categoryData =
            data.categoryTotals;


        const categories =
            Object.entries(
                categoryData
            );


        if (
            categories.length > 0
        ) {

            // Find highest spending category

            const highestCategory =
                categories.reduce(
                    (
                        highest,
                        current
                    ) => {

                        return current[1] >
                            highest[1]
                            ? current
                            : highest;

                    }
                );


            topCategory.textContent =
                `${highestCategory[0]} is your biggest expense`;


            topCategoryMessage.textContent =
                `You spent ₹${Number(
                    highestCategory[1]
                ).toFixed(2)} on ${
                    highestCategory[0]
                }.`;

        }


        // =========================
        // CREATE CATEGORY CHART
        // =========================

        createCategoryChart(
            categoryData
        );


        // =========================
        // CREATE MONTHLY CHART
        // =========================

        createMonthlyChart(
            data.monthlyTotals
        );


    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );


        topCategory.textContent =
            "Unable to load analytics";


        topCategoryMessage.textContent =
            "Please try again later.";

    }

}


// =========================
// CATEGORY CHART
// =========================

function createCategoryChart(
    categoryData
) {

    const canvas =
        document.getElementById(
            "categoryChart"
        );


    if (!canvas) {

        return;

    }


    const categories =
        Object.keys(
            categoryData
        );


    const amounts =
        Object.values(
            categoryData
        );


    // No data

    if (
        categories.length === 0
    ) {

        return;

    }


    // Destroy previous chart

    if (categoryChart) {

        categoryChart.destroy();

    }


    categoryChart =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",


                data: {

                    labels:
                        categories,


                    datasets: [

                        {

                            label:
                                "Spending",


                            data:
                                amounts,


                            backgroundColor: [

                                "#2563eb",

                                "#16a34a",

                                "#f59e0b",

                                "#dc2626",

                                "#9333ea",

                                "#0891b2",

                                "#db2777",

                                "#64748b"

                            ],


                            borderWidth:
                                2,


                            borderColor:
                                "#0b1a2d"

                        }

                    ]

                },


                options: {

                    responsive:
                        true,


                    maintainAspectRatio:
                        false,


                    plugins: {

                        legend: {

                            position:
                                "bottom",


                            labels: {

                                color:
                                    "#cbd5e1",


                                padding:
                                    15

                            }

                        }

                    }

                }

            }
        );

}


// =========================
// MONTHLY CHART
// =========================

function createMonthlyChart(
    monthlyData
) {

    const canvas =
        document.getElementById(
            "monthlyChart"
        );


    if (!canvas) {

        return;

    }


    const months =
        Object.keys(
            monthlyData
        );


    const amounts =
        Object.values(
            monthlyData
        );


    // No data

    if (
        months.length === 0
    ) {

        return;

    }


    // Destroy previous chart

    if (monthlyChart) {

        monthlyChart.destroy();

    }


    monthlyChart =
        new Chart(
            canvas,
            {

                type:
                    "bar",


                data: {

                    labels:
                        months,


                    datasets: [

                        {

                            label:
                                "Monthly Spending",


                            data:
                                amounts,


                            backgroundColor:
                                "#2563eb",


                            borderRadius:
                                8

                        }

                    ]

                },


                options: {

                    responsive:
                        true,


                    maintainAspectRatio:
                        false,


                    scales: {

                        x: {

                            ticks: {

                                color:
                                    "#94a3b8"

                            },


                            grid: {

                                display:
                                    false

                            }

                        },


                        y: {

                            beginAtZero:
                                true,


                            ticks: {

                                color:
                                    "#94a3b8",


                                callback:
                                    function (
                                        value
                                    ) {

                                        return (
                                            "₹" +
                                            value
                                        );

                                    }

                            },


                            grid: {

                                color:
                                    "#1b2d44"

                            }

                        }

                    },


                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    "#cbd5e1"

                            }

                        }

                    }

                }

            }
        );

}


// =========================
// LOGOUT
// =========================

function logout() {

    localStorage.removeItem(
        "spendwiseToken"
    );


    localStorage.removeItem(
        "spendwiseUser"
    );


    window.location.href =
        "login.html";

}


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}


// =========================
// MOBILE SIDEBAR
// =========================

const menuButton =
    document.getElementById(
        "menuButton"
    );


const sidebar =
    document.getElementById(
        "sidebar"
    );


if (
    menuButton &&
    sidebar
) {

    menuButton.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "sidebar-open"
            );

        }
    );

}


// =========================
// INITIAL LOAD
// =========================

loadAnalytics();
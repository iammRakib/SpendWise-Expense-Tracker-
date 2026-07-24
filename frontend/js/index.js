const API_URL = "http://localhost:5001/api";


// =========================
// AUTH CHECK
// =========================

const token =
    localStorage.getItem("spendwiseToken");


if (!token) {

    window.location.href =
        "login.html";

}


// =========================
// USER INFORMATION
// =========================

const userData =
    JSON.parse(
        localStorage.getItem("spendwiseUser")
    );


const userName =
    document.getElementById("userName");


if (userData && userName) {

    userName.textContent =
        userData.name;

}


// =========================
// FETCH ANALYTICS
// =========================

async function loadDashboardStats() {

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


        if (response.status === 401) {

            logout();

            return;
        }


        const data =
            await response.json();


        document
            .getElementById("totalExpenses")
            .textContent =
            `₹${data.totalExpenses.toFixed(2)}`;


        document
            .getElementById("transactionCount")
            .textContent =
            data.transactionCount;


        document
            .getElementById("monthlyExpenses")
            .textContent =
            `₹${data.currentMonthTotal.toFixed(2)}`;


    } catch (error) {

        console.error(
            "Failed to load dashboard stats:",
            error
        );

    }

}


// =========================
// FETCH RECENT EXPENSES
// =========================

async function loadRecentExpenses() {

    const expenseContainer =
        document.getElementById(
            "recentExpenses"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/expenses`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        if (response.status === 401) {

            logout();

            return;
        }


        const expenses =
            await response.json();


        expenseContainer.innerHTML = "";


        const recentExpenses =
            expenses.slice(0, 5);


        if (recentExpenses.length === 0) {

            expenseContainer.innerHTML =
                `<p class="empty-state">
                    No expenses yet.
                </p>`;

            return;
        }


        recentExpenses.forEach(
            (expense) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "expense-item";


                const date =
                    new Date(
                        expense.date
                    ).toLocaleDateString(
                        "en-IN"
                    );


                item.innerHTML = `
                    <div class="expense-info">

                        <div class="expense-category-icon">
                            ₹
                        </div>

                        <div>

                            <p class="expense-title">
                                ${expense.title}
                            </p>

                            <p class="expense-date">
                                ${expense.category}
                                •
                                ${date}
                            </p>

                        </div>

                    </div>

                    <p class="expense-amount">
                        ₹${Number(
                            expense.amount
                        ).toFixed(2)}
                    </p>
                `;


                expenseContainer.appendChild(
                    item
                );

            }
        );


    } catch (error) {

        console.error(
            "Failed to load expenses:",
            error
        );

    }

}


// =========================
// ADD EXPENSE
// =========================

const expenseForm =
    document.getElementById(
        "expenseForm"
    );


if (expenseForm) {

    expenseForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const title =
                document
                    .getElementById(
                        "expenseTitle"
                    )
                    .value
                    .trim();


            const amount =
                Number(
                    document
                        .getElementById(
                            "expenseAmount"
                        )
                        .value
                );


            const category =
                document
                    .getElementById(
                        "expenseCategory"
                    )
                    .value;


            const date =
                document
                    .getElementById(
                        "expenseDate"
                    )
                    .value;


            try {

                const response =
                    await fetch(
                        `${API_URL}/expenses`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body:
                                JSON.stringify({
                                    title,
                                    amount,
                                    category,
                                    date:
                                        date ||
                                        undefined
                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to add expense."
                    );

                    return;
                }


                expenseForm.reset();


                await loadDashboardStats();

                await loadRecentExpenses();


            } catch (error) {

                console.error(
                    "Add expense error:",
                    error
                );


                alert(
                    "Unable to connect to server."
                );

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


if (menuButton && sidebar) {

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

loadDashboardStats();

loadRecentExpenses();
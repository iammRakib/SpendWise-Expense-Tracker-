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
// GLOBAL EXPENSE DATA
// =========================

let allExpenses = [];


// =========================
// DOM ELEMENTS
// =========================

const expenseList =
    document.getElementById(
        "expenseList"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );


const visibleTotal =
    document.getElementById(
        "visibleTotal"
    );


const visibleCount =
    document.getElementById(
        "visibleCount"
    );


// =========================
// FETCH EXPENSES
// =========================

async function loadExpenses() {

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


        if (!response.ok) {

            throw new Error(
                "Failed to fetch expenses"
            );

        }


        allExpenses =
            await response.json();


        displayExpenses(
            allExpenses
        );


    } catch (error) {

        console.error(
            "Error loading expenses:",
            error
        );


        expenseList.innerHTML = `
            <p class="empty-state">
                Unable to load expenses.
            </p>
        `;

    }

}


// =========================
// DISPLAY EXPENSES
// =========================

function displayExpenses(
    expenses
) {

    expenseList.innerHTML = "";


    // Update summary

    const total =
        expenses.reduce(
            (sum, expense) =>
                sum +
                Number(
                    expense.amount
                ),
            0
        );


    visibleTotal.textContent =
        `₹${total.toFixed(2)}`;


    visibleCount.textContent =
        expenses.length;


    // No expenses

    if (expenses.length === 0) {

        expenseList.innerHTML = `
            <p class="empty-state">
                No expenses found.
            </p>
        `;

        return;

    }


    // Create expense items

    expenses.forEach(
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

                    <div
                        class="expense-category-icon"
                    >
                        ₹
                    </div>


                    <div>

                        <p
                            class="expense-title"
                        >
                            ${expense.title}
                        </p>


                        <p
                            class="expense-date"
                        >
                            ${expense.category}
                            •
                            ${date}
                        </p>

                    </div>

                </div>


                <div
                    style="
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    "
                >

                    <p
                        class="expense-amount"
                    >
                        ₹${Number(
                            expense.amount
                        ).toFixed(2)}
                    </p>


                    <button
                        class="delete-button"
                        onclick="deleteExpense('${expense._id}')"
                    >
                        Delete
                    </button>

                </div>

            `;


            expenseList.appendChild(
                item
            );

        }
    );

}


// =========================
// SEARCH EXPENSES
// =========================

function filterExpenses() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categoryFilter.value;


    const filteredExpenses =
        allExpenses.filter(
            (expense) => {

                const matchesSearch =
                    expense.title
                        .toLowerCase()
                        .includes(
                            searchText
                        );


                const matchesCategory =
                    selectedCategory ===
                    "all" ||
                    expense.category ===
                    selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    displayExpenses(
        filteredExpenses
    );

}


// =========================
// DELETE EXPENSE
// =========================

async function deleteExpense(
    expenseId
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/expenses/${expenseId}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to delete expense."
            );

            return;

        }


        // Reload expenses

        await loadExpenses();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Unable to connect to server."
        );

    }

}


// =========================
// SEARCH EVENT
// =========================

searchInput.addEventListener(
    "input",
    filterExpenses
);


// =========================
// CATEGORY FILTER EVENT
// =========================

categoryFilter.addEventListener(
    "change",
    filterExpenses
);


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

loadExpenses();
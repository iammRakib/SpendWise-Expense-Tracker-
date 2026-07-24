const API_URL = "http://localhost:5001/api";


// =========================
// LOGIN
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        const message =
            document.getElementById("loginMessage");


        message.textContent = "";


        try {

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message || "Login failed.";

                return;
            }


            localStorage.setItem(
                "spendwiseToken",
                data.token
            );


            localStorage.setItem(
                "spendwiseUser",
                JSON.stringify(data.user)
            );


            window.location.href = "index.html";

        } catch (error) {

            console.error("Login error:", error);

            message.textContent =
                "Unable to connect to the server.";

        }

    });

}


// =========================
// SIGNUP
// =========================

const signupForm =
    document.getElementById("signupForm");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                document
                    .getElementById("signupName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("signupEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("signupPassword")
                    .value;


            const message =
                document
                    .getElementById("signupMessage");


            message.textContent = "";


            try {

                const response = await fetch(
                    `${API_URL}/auth/signup`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    }
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.textContent =
                        data.message ||
                        "Signup failed.";

                    return;
                }


                alert(
                    "Account created successfully. Please login."
                );


                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "Signup error:",
                    error
                );


                message.textContent =
                    "Unable to connect to the server.";

            }

        }
    );

}
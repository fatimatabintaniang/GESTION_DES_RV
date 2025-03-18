document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    
    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");
    let incorrect = document.getElementById("incorect");

    emailError.innerText = "";
    passwordError.innerText = "";
    incorrect.innerText = "";

    let valid = true;

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        emailError.innerText = "Veuillez entrer une adresse email valide.";
        valid = false;
    }

    if (password.length < 4) {
        passwordError.innerText = "Veuillez entrer un mot de passe valide.";
        valid = false;
    }

    if (!valid) return;

    try {
        let roles = ["medecin", "secretaire", "patient"];

        for (let role of roles) {
            let response = await fetch(`http://localhost:3000/${login}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ role, login: email, password }) // Correction ici
            });
            let users = await response.json();

            if (users && users.length > 0) {
                let user = users[0];

                // Stocker l'utilisateur en localStorage
                localStorage.setItem("user", JSON.stringify(user));

                if (role === "medecin") {
                    window.location.href = "dashboard_medecin.html";
                } else if (role === "secretaire") {
                    window.location.href = "dashboard_secretaire.html";
                } else if (role === "patient") {
                    window.location.href = "dashboard_patient.html";
                }
                return;
            }
        }

        incorrect.innerText = "Identifiant ou mot de passe incorrect.";
        
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
    }
});

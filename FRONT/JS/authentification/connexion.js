document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    
    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");
    let incorrect = document.getElementById("incorrect");

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

    async function getJsonDataByKey(key) {
        const url = `http://localhost:3000/${key}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            return null;
        }
    }

    // Vérification des rôles
    let roles = ["secretaire", "medecin", "patient"];
    let userFound = false;

    for (let role of roles) {
        let users = await getJsonDataByKey(role);
        
        if (users) {
            let user = users.find(user => user.login === email && user.password === password);
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));

                // Redirection en fonction du rôle
                const dashboardPaths = {
                    medecin: "../../HTML/medecin/medecin.html",
                    secretaire: "../../HTML/secretaire/dashboard.html",
                    patient: "../../HTML/patient/patient.html"
                };

                window.location.href = dashboardPaths[role];
                userFound = true;
                break; // On arrête la recherche une fois l'utilisateur trouvé
            }
        }
    }

    if (!userFound) {
        incorrect.innerText = "Identifiant ou mot de passe incorrect.";
    }
});

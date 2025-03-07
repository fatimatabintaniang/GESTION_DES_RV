
document.addEventListener("DOMContentLoaded", function () {
    let user = localStorage.getItem('user');

    if (!user) {
        window.location.href = "index.html";
    } else {
        let userData = JSON.parse(user);
        console.log("Utilisateur connecté :", userData);
    }
});
// Gestion de la déconnexion
document.getElementById("logoutButton").addEventListener("click", function () {
    // Supprimer les données de l'utilisateur
    localStorage.removeItem('user');

    // Rediriger vers la page de connexion
    window.location.href = "index.html";
});

document.addEventListener("DOMContentLoaded", function() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "../../HTML/connexion/connexion.html";
   
    }
});

document.getElementById("logoutBtn").addEventListener("click", function() {
    localStorage.removeItem("user");
    window.location.href = "../../index.html";
});

// document.addEventListener("DOMContentLoaded", function () {
//     fetch("/FRONT/HTML/composant/navbar.html")
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById("mainContent").innerHTML = data;
//         })
//         .catch(error => console.error("Erreur lors du chargement du navbar :", error));
// });

const menuButton = document.getElementById('menuButton');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

menuButton.addEventListener('click', () => {
const isHidden = sidebar.classList.contains('hidden-sidebar');
if (isHidden) {
sidebar.classList.remove('hidden-sidebar');
mainContent.classList.remove('content-full');
mainContent.classList.add('content-with-sidebar');
} else {
sidebar.classList.add('hidden-sidebar');
mainContent.classList.add('content-full');
mainContent.classList.remove('content-with-sidebar');
}
});






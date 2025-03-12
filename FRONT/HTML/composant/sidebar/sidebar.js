// function includeHTML() {
//     document.querySelectorAll("[data-include]").forEach(element => {
//         let file = element.getAttribute("data-include");

//         fetch(file)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`Erreur de chargement : ${file}`);
//                 }
//                 return response.text();
//             })
//             .then(data => {
//                 element.innerHTML = data;
//             })
//             .catch(error => console.error(error));
//     });
// }

// Appelle la fonction après le chargement de la page
document.addEventListener("DOMContentLoaded", includeHTML);


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






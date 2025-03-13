// Fonction pour filtrer les rendez-vous
document.getElementById('medecinSearch').addEventListener('input', function() {
    let searchTerm = this.value.toLowerCase(); // Récupère le terme de recherche en minuscule
    let rows = document.querySelectorAll('#tbody tr'); // Sélectionne toutes les lignes du tableau

    rows.forEach(row => {
        let medecinCell = row.cells[2]; // Colonne du médecin (index 2)
        let medecinName = medecinCell.textContent.toLowerCase(); // Récupère le nom du médecin en minuscule

        // Vérifie si le terme de recherche est contenu dans le nom du médecin
        if (medecinName.includes(searchTerm)) {
            row.style.display = ''; // Affiche la ligne si le médecin correspond
        } else {
            row.style.display = 'none'; // Cache la ligne si elle ne correspond pas
        }
    });
});

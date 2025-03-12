// Fonction pour afficher les rendez-vous
function afficherRendezVous(patientId) {
    // Charger le fichier JSON
    fetch('http://localhost:3000/rv')
        .then(response => response.json())
        .then(data => {
            // Filtrer les rendez-vous pour le patient spécifique
            const rendezVous = data.filter(rv => rv.id_patient === patientId);

            // Récupérer le conteneur du tableau
            const container = document.getElementById('Container');

            // Vider le conteneur
            container.innerHTML = '';

            // Ajouter chaque rendez-vous au tableau
            rendezVous.forEach(rv => {
                const row = document.createElement('tr');
                row.innerHTML = `
                        <td class="p-3"><input type="checkbox" class="form-checkbox h-5 w-5 text-blue-600"></td>
                        <td class="p-3">${rv.date}</td>
                        <td class="p-3">${rv.heure}</td>
                        <td class="p-3">${rv.specialite}</td>
                        <td class="p-3">${rv.motif}</td>
                        <td class="p-3 flex items-center justify-center">
                                 <button class="px-3 py-1 rounded-lg text-green-600 ${rv.statut === 'VALIDER' ? 'bg-[#ECFDF3]' : 'bg-[#F934340A] text-red-600'} flex items-center justify-center gap-2">
                                ${rv.statut === 'VALIDER' ? '<i class="ri-check-line"></i> Valider' : '<i class="ri-close-line"></i> Annuler'}
                                 </button>
                        </td>
                    `;
                container.appendChild(row);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des données:', error));
}

afficherRendezVous("1");

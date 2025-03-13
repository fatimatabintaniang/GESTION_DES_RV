document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("tbody");

    // URL des données
    const URL_RENDEZVOUS = "http://localhost:3000/rv";
    const URL_PATIENTS = "http://localhost:3000/patient";
    const URL_MEDECINS = "http://localhost:3000/medecin";

    // Fonction pour récupérer et afficher les rendez-vous
    async function fetchRendezVous() {
        try {
            const [rvResponse, patientsResponse, medecinsResponse] = await Promise.all([
                fetch(URL_RENDEZVOUS),
                fetch(URL_PATIENTS),
                fetch(URL_MEDECINS)
            ]);

            const rendezvous = await rvResponse.json();
            const patients = await patientsResponse.json();
            const medecins = await medecinsResponse.json();

            // Nettoyage du tableau
            tableBody.innerHTML = "";

            // Ajout des rendez-vous dans le tableau
            rendezvous.forEach(rv => {
                const patient = patients.find(p => p.id === rv.id_patient);
                const medecin = medecins.find(m => m.id === rv.id_medecin);

                const row = document.createElement("tr");
                row.classList.add("border-b", "border-gray-200", "hover:bg-gray-50");

                row.innerHTML = `
                    <td class="py-3 px-6"><input type="checkbox" class="w-5 h-5 accent-blue-500"></td>
                    <td class="py-3 px-6">${rv.date}</td>
                    <td class="py-3 px-6">${rv.heure}</td>
                    <td class="py-3 px-6">${medecin ? medecin.specialite : "Non spécifié"}</td>
                    <td class="py-3 px-6">${rv.Motif}</td>
                    <td class="py-3 px-6 flex space-x-3">
                        ${getStatusButton(rv.statut)}
                    </td>
                `;

                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    }

    // Fonction pour générer le bouton de statut
    function getStatusButton(statut) {
        let buttonClass = "";
        let buttonText = "";

        if (statut === "VALIDER") {
            buttonClass = "bg-green-100 text-green-800 hover:bg-green-200";
            buttonText = "Validé";
        } else if (statut === "EN ATTENTE") {
            buttonClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
            buttonText = "En attente";
        } else {
            buttonClass = "bg-red-100 text-red-800 hover:bg-red-200";
            buttonText = "Annulé";
        }

        return `
            <button class="${buttonClass} px-3 py-1 rounded-lg text-sm flex items-center space-x-1">
                <span class="text-lg font-bold">•</span>
                <span class="font-semibold">${buttonText}</span>
            </button>
        `;
    }

    // Charger les rendez-vous au démarrage
    fetchRendezVous();
});

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("tbody");

    async function fetchRendezVous() {
        try {
            const [rvResponse, patientsResponse, medecinsResponse] = await Promise.all([
                fetch("http://localhost:3000/rv"),
                fetch("http://localhost:3000/patient"),
                fetch("http://localhost:3000/medecin")
            ]);

            const rendezvous = await rvResponse.json();
            const patients = await patientsResponse.json();
            const medecins = await medecinsResponse.json();

            tableBody.innerHTML = "";

            rendezvous.forEach(rv => {
                const patient = patients.find(p => p.id === rv.id_patient);
                const medecin = medecins.find(m => m.id === rv.id_medecin);

                const row = document.createElement("tr");
                row.classList.add("border-b", "border-gray-200", "hover:bg-gray-50");
                row.setAttribute("data-id", rv.id);

                row.innerHTML = `
                    <td class="py-3 px-6">${rv.date}</td>
                    <td class="py-3 px-6">${patient ? patient.nom : "Inconnu"}</td>
                    <td class="py-3 px-6">${medecin ? medecin.nom : "Non spécifié"}</td>
                    <td class="py-3 px-6">${rv.Motif}</td>
                    <td class="py-3 px-6 statut">${getStatusLabel(rv.statut)}</td>
                    <td class="py-3 px-6 flex space-x-3 actions">
                        ${getStatusButton(rv.statut, rv.id)}
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
        }
    }

    function getStatusButton(statut, id) {
        return `
            <button onclick="updateStatut(${id}, 'VALIDER')" class="bg-green-500 text-white px-3 py-1 rounded-lg text-sm">Valider</button>
            <button onclick="updateStatut(${id}, 'ANNULER')" class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm">Annuler</button>
        `;
    }

    function getStatusLabel(statut) {
        if (statut === "VALIDER") {
            return `<span class="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm">Validé</span>`;
        } else if (statut === "ANNULER") {
            return `<span class="bg-red-100 text-red-800 px-3 py-1 rounded-lg text-sm">Annulé</span>`;
        } else {
            return `<span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-sm">En cours</span>`;
        }
    }

    window.updateStatut = async function (id, statut) {
        try {
            await fetch(`http://localhost:3000/rv/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ statut })
            });

            // Mise à jour dynamique de la ligne concernée
            const row = document.querySelector(`tr[data-id="${id}"]`);
            if (row) {
                row.querySelector(".statut").innerHTML = getStatusLabel(statut);
            }
        } catch (error) {
            console.error("Erreur mise à jour statut:", error);
        }
    };

    fetchRendezVous();
});

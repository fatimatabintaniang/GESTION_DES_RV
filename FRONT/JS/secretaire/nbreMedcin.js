async function getNombreMedecins() {
    try {
        const response = await fetch('http://localhost:3000/medecin'); // Appel à l'API JSON Server
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des médecins');
        }
        const medecins = await response.json();
        console.log(`Nombre de médecins : ${medecins.length}`);
        return medecins.length; // Retourne le nombre de médecins
    } catch (error) {
        console.error("Erreur:", error);
        return 0; // Retourne 0 en cas d'erreur
    }
}

async function getNombrePatient() {
    try {
        const response = await fetch('http://localhost:3000/patient'); // Appel à l'API JSON Server
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des patients');
        }
        const patients = await response.json();
        console.log(`Nombre de patients : ${patients.length}`);
        return patients.length; // Retourne le nombre de patients
    } catch (error) {
        console.error("Erreur:", error);
        return 0; // Retourne 0 en cas d'erreur
    }
}

// Exemple d'utilisation
getNombreMedecins().then(nombre => {
    document.getElementById("nombreMedecins").innerText = nombre;
});

getNombrePatient().then(nombre => { // Correction ici
    document.getElementById("nombrePatients").innerText = nombre;
});



async function getNombreRV(mois, annee) {
    try {
        const response = await fetch('http://localhost:3000/rv'); // Appel à JSON Server
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des rendez-vous');
        }
        
        const rendezvous = await response.json();
        
        
        // Filtrer les rendez-vous du mois et de l'année demandés
        const rvMois = rendezvous.filter(rv => {
            const dateRv = new Date(rv.date);
            return dateRv.getMonth() + 1 === mois && dateRv.getFullYear() === annee;
        });

        console.log(`Nombre de rendez-vous pour ${mois}/${annee} : ${rvMois.length}`);
        return rvMois.length; // Retourne le nombre de RV du mois
    } catch (error) {
        console.error("Erreur:", error);
        return 0; // Retourne 0 en cas d'erreur
    }
}

// Exemple d'utilisation : récupérer les RV de mars 2024 (mois = 3, année = 2024)
// getNombreRV(3, 2024).then(nombre => {
//     document.getElementById("nombreRV").innerText = nombre;
// });
const ctx = document.getElementById('myLineChart').getContext('2d');

getNombreRV(2, 2024).then(moi => {
    console.log(moi);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
            datasets: [{
                label: 'Nombre de rendez-vous',
                data: [moi, 19, 3, 5, 2, 3],
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

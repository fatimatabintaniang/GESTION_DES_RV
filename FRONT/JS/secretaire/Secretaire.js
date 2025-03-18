e943efa2c373683e2fd8e76c4170fb6de874291a
async function getNombreMedecins() {
    try {
        const response = await fetch('http://localhost:3000/medecins'); // Appel à l'API JSON Server
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }
        const medecins = await response.json();
        console.log(`Nombre de médecins : ${medecins.length}`);
        return medecins.length; // Retourne le nombre de médecins
    } catch (error) {
        console.error("Erreur:", error);
        return 0; // Retourne 0 en cas d'erreur
    }
}

// Exemple d'utilisation
getNombreMedecins().then(nombre => {
    document.getElementById("nombreMedecins").innerText = nombre;
});
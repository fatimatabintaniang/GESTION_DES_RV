document.addEventListener("DOMContentLoaded", async function () {
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("myBtn");
    const closeBtn = document.getElementById("closeModal");
    const formAdd = document.getElementById("addPatientForm");
    const container = document.getElementById("Container");
    const deleteBtn = document.getElementById("deleteBtn"); // Bouton de suppression
    const confirmDeleteModal = document.createElement("div"); // Création du modal de confirmation



    // Gestion de l'affichage du modal
    btn.addEventListener("click", function () {
        modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Fonction pour récupérer et afficher les patients depuis l'API
    async function fetchPatients() {
        try {
            const response = await fetch("http://localhost:3000/patient");
            const patients = await response.json();

            const rvResponse = await fetch("http://localhost:3000/rv");
            const rvs = await rvResponse.json();


            // Initialiser patientRvCount avec 0 pour chaque patient
            const patientRvCount = {};
            patients.forEach(patient => {
                patientRvCount[patient.id] = 0; // Par défaut, 0 RV
            });

            // Compter le nombre de RV pour chaque patient
            rvs.forEach(rv => {
                if (patientRvCount[rv.id_patient]) {
                    patientRvCount[rv.id_patient]++;
                } else {
                    patientRvCount[rv.id_patient] = 1;
                }
            });

            container.innerHTML = ""; // Vider le tableau


            patients.forEach(patient => {
                const row = document.createElement("tr");
                row.classList.add("border-b", "border-gray-200", "hover:bg-gray-100");
                row.innerHTML = `
                    <td class="py-3 px-6"><input type="checkbox" class="w-5 h-5 accent-blue-500 patient-checkbox" data-id="${patient.id}"></td>
                    <td class="py-3 px-6">${patient.prenom}</td>
                    <td class="py-3 px-6">${patient.nom}</td>
                    <td class="py-3 px-6">${patient.genre}</td>
                    <td class="py-3 px-6">${patient.login}</td>
                    <td class="py-3 px-6">${patient.adress}</td>
                    <td class="py-3 px-6">${patient.telephone}</td>
                    <td class="py-3 px-6 text-center">${patientRvCount[patient.id] || 0}</td>
                           <td class="py-3 px-6">
                    <button class="px-4 py-2  text-blue-800 rounded-lg hover:bg-blue-500 transition-all edit-btn" data-id="${patient.id}">
                        <i class="ri-edit-line mr-2"></i>
                    </button>
                </td>
                `;
                container.appendChild(row);
            });
            // Ajout d'un événement pour chaque bouton d'édition

            // Ajouter des écouteurs d'événements pour les boutons "Edit"
            document.querySelectorAll(".edit-btn").forEach(button => {
                button.addEventListener("click", () => openEditModal(button.getAttribute("data-id")));
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des patients :", error);
        }
    }

    // Charger les patients au chargement de la page
    fetchPatients();

    async function getNextPatientId() {
        try {
            const response = await fetch("http://localhost:3000/patient");
            const patients = await response.json();
            if (patients.length === 0) return 1; // Si aucun patient, commence à 1

            // Récupérer le dernier ID et l'incrémenter
            const lastId = Math.max(...patients.map(p => parseInt(p.id)));
            return (lastId + 1).toString(); // Convertir en chaîne de caractères
        } catch (error) {
            console.error("Erreur lors de la récupération du dernier ID :", error);
            return Date.now(); // Fallback
        }
    }


    // Gestion du formulaire pour ajouter ou modifier une matière
    document.getElementById("addPatientForm").addEventListener("submit", async function (e) {
        e.preventDefault(); // Empêcher le rechargement de la page

        // Récupération des valeurs des champs
        let prenom = document.getElementById("prenom").value.trim();
        let nom = document.getElementById("nom").value.trim();
        let genre = document.getElementById("genre").value;
        let email = document.getElementById("login").value.trim();
        let password = document.getElementById("password").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let adress = document.getElementById("adress").value.trim();

        // Vérifier si l'email, le mot de passe ou le téléphone existent déjà
        const patientsResponse = await fetch("http://localhost:3000/patient");
        const patients = await patientsResponse.json();

        const isEmailUnique = !patients.some(patient => patient.login === email);
        const isPasswordUnique = !patients.some(patient => patient.password === password);
        const isPhoneUnique = !patients.some(patient => patient.telephone === phone);

        if (!isEmailUnique) {
            alert("Cet email est déjà utilisé par un autre patient.");
            return;
        }

        if (!isPasswordUnique) {
            alert("Ce mot de passe est déjà utilisé par un autre patient.");
            return;
        }

        if (!isPhoneUnique) {
            alert("Ce numéro de téléphone est déjà utilisé par un autre patient.");
            return;
        }

        // Vérification des champs vides
        let isValid = true;
        if (!prenom) {
            document.getElementById("PrenomError").classList.remove("hidden");
            isValid = false;
        } else {
            document.getElementById("PrenomError").classList.add("hidden");
        }

        if (!nom) {
            document.getElementById("NomError").classList.remove("hidden");
            isValid = false;
        } else {
            document.getElementById("NomError").classList.add("hidden");
        }

        if (!email) {
            document.getElementById("EmailError").classList.remove("hidden");
            isValid = false;
        } else if (!email.includes("@") || !email.includes(".") || email.indexOf(" ") >= 0) {
            document.getElementById("EmailError").classList.add("hidden");
            document.getElementById("ConfirmEmail").classList.remove("hidden");
            isValid = false;

        } else {
            document.getElementById("EmailError").classList.add("hidden");
        }




        if (!password) {
            document.getElementById("PasswordError").classList.remove("hidden");
            isValid = false;
        } else if (password.length > 4) {
            document.getElementById("PasswordError").classList.add("hidden");
            document.getElementById("ConfirmPasswordError").classList.remove("hidden");
            isValid = false;
        }
        else {
            document.getElementById("PasswordError").classList.add("hidden");
        }


        if (!phone) {
            document.getElementById("PhoneError").classList.remove("hidden");
            isValid = false;
        } else {
            document.getElementById("PhoneError").classList.add("hidden");
        }

        if (!adress) {
            document.getElementById("AdressError").classList.remove("hidden");
            isValid = false;
        } else {
            document.getElementById("AdressError").classList.add("hidden");
        }

        if (!isValid) return; // Si un champ est invalide, on arrête l'exécution

        let newPatientId = await getNextPatientId(); // Récupérer l'ID incrémenté

        // Création de l'objet patient
        let newPatient = {
            id: newPatientId, // ID unique basé sur le timestamp
            prenom: prenom,
            nom: nom,
            genre: genre,
            login: email,
            password: password,
            telephone: phone,
            adress: adress,
        };

        // Envoi du patient à l'API
        try {
            const response = await fetch("http://localhost:3000/patient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPatient),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout du patient");
            }

            // Fermer le modal après ajout
            modal.style.display = "none";

            // Rafraîchir la liste des patients depuis l'API
            fetchPatients();

        } catch (error) {
            console.error("Erreur:", error);
        }


        // Fermer le modal après ajout
        document.getElementById("myModal").classList.add("hidden");

        // Rafraîchir la liste des patients
        renderPatients();
    });

    // Fonction pour afficher la boîte de dialogue de confirmation
    function showConfirmationModal(callback) {
        confirmDeleteModal.innerHTML = `
            <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">Confirmation</h2>
                    <p>Êtes-vous sûr de vouloir supprimer ces patients ?</p>
                    <div class="flex justify-end mt-4 space-x-2">
                        <button id="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded">Oui</button>
                        <button id="cancelDelete" class="px-4 py-2 bg-gray-500 text-white rounded">Non</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(confirmDeleteModal);

        document.getElementById("confirmDelete").addEventListener("click", () => {
            callback(true);
            confirmDeleteModal.remove();
        });

        document.getElementById("cancelDelete").addEventListener("click", () => {
            callback(false);
            confirmDeleteModal.remove();
        });
    }
    // Suppression des patients cochés
    document.getElementById("deleteBtn").addEventListener("click", async function () {
        const checkboxes = document.querySelectorAll(".patient-checkbox:checked");
        if (checkboxes.length === 0) {
            alert("Veuillez sélectionner au moins un patient à supprimer.");
            return;
        }

        showConfirmationModal(async function (confirm) {
            if (confirm) {
                for (const checkbox of checkboxes) {
                    const patientId = checkbox.getAttribute("data-id");
                    try {
                        await fetch(`http://localhost:3000/patient/${patientId}`, {
                            method: "DELETE",
                        });
                    } catch (error) {
                        console.error(`Erreur lors de la suppression du patient ${patientId}:`, error);
                    }
                }
                fetchPatients(); // Rafraîchir la liste après suppression
            }
        });
    });

    async function openEditModal(patientId) {
        try {
            // Récupérer les informations du patient
            const response = await fetch(`http://localhost:3000/patient/${patientId}`);
            const patient = await response.json();

            if (!patient) {
                throw new Error("Patient non trouvé");
            }

            // Remplir le formulaire de modification
            document.getElementById("editPrenom").value = patient.prenom;
            document.getElementById("editNom").value = patient.nom;
            document.getElementById("editGenre").value = patient.genre;
            document.getElementById("editLogin").value = patient.login;
            document.getElementById("editPassword").value = patient.password;
            document.getElementById("editPhone").value = patient.telephone;
            document.getElementById("editAdress").value = patient.adress;

            // Afficher le modal de modification
            document.getElementById("editModal").classList.remove("hidden");
            document.getElementById("editModal").setAttribute("data-id", patientId); // Stocker l'ID du patient
        } catch (error) {
            console.error("Erreur :", error);
        }
    }

    document.getElementById("editPatientForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        // Récupérer l'ID du patient
        const patientId = document.getElementById("editModal").getAttribute("data-id");

        // Récupérer les valeurs du formulaire
        const updatedPatient = {
            prenom: document.getElementById("editPrenom").value,
            nom: document.getElementById("editNom").value,
            genre: document.getElementById("editGenre").value,
            login: document.getElementById("editLogin").value,
            password: document.getElementById("editPassword").value,
            telephone: document.getElementById("editPhone").value,
            adress: document.getElementById("editAdress").value,
        };

        // Vérifier si l'email, le mot de passe ou le téléphone existent déjà (sauf pour le patient actuel)
        const patientsResponse = await fetch("http://localhost:3000/patient");
        const patients = await patientsResponse.json();

        const isEmailUnique = !patients.some(patient => patient.login === updatedPatient.login && patient.id !== patientId);
        const isPasswordUnique = !patients.some(patient => patient.password === updatedPatient.password && patient.id !== patientId);
        const isPhoneUnique = !patients.some(patient => patient.telephone === updatedPatient.telephone && patient.id !== patientId);

        if (!isEmailUnique) {
            alert("Cet email est déjà utilisé par un autre patient.");
            return;
        }

        if (!isPasswordUnique) {
            alert("Ce mot de passe est déjà utilisé par un autre patient.");
            return;
        }

        if (!isPhoneUnique) {
            alert("Ce numéro de téléphone est déjà utilisé par un autre patient.");
            return;
        }


        try {
            // Envoyer une requête PUT pour mettre à jour le patient
            const response = await fetch(`http://localhost:3000/patient/${patientId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPatient),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour du patient");
            }

            // Fermer le modal et rafraîchir la liste des patients
            document.getElementById("editModal").classList.add("hidden");
            fetchPatients();
        } catch (error) {
            console.error("Erreur :", error);
        }
    });

    document.getElementById("closeEditModal").addEventListener("click", function () {
        document.getElementById("editModal").classList.add("hidden");
    });

});

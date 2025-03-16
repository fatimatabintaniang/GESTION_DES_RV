document.addEventListener("DOMContentLoaded", async () => {

    const user=JSON.parse(localStorage.getItem("user"))
    const medecin = await fetcher("medecin");
     
     listeMedcin(medecin); 
     const add_medecin=document.querySelector("#add_medecin");
     const annuler=document.querySelector("#annuler");
     const contenu=document.querySelector("#contenu");
     const form=document.getElementById("medecinForm")
     const popup=document.getElementById("popup")
     
        //pupup
     add_medecin.addEventListener("click",() => {
        popup.classList.remove("hidden");
        popup.classList.add("z-50");
      contenu.classList.remove("hidden");
     });

//pour l'annulation
     annuler.addEventListener("click",() => {
      popup.classList.add("hidden");
     contenu.classList.add("hidden");
   }); 
     
     //pour l'ajout
     form.addEventListener("submit", async function(event) {
      event.preventDefault();
  
      const nom = document.getElementById("nomMedecin").value;
      const prenom = document.getElementById("prenomMedecin").value;
      const specialite = document.getElementById("specialiteMedecin").value;
      const login = document.getElementById("loginMedecin").value;
      const adresse = document.getElementById("adresseMedecin").value;
      const password = document.getElementById("passwordMedecin").value;

           // pour les erreurs
           const NomError = document.getElementById("NomError");
           const PrenomError = document.getElementById("PrenomError");
           const SpecError = document.getElementById("SpecError");
           const EmailError = document.getElementById("EmailError");
           const AdressError = document.getElementById("AdressError");
           const PassError = document.getElementById("PassError");
          
           let isValid=true;

           //initialisation
           NomError.textContent="";
           PrenomError.textContent="";
           SpecError.textContent="";
           EmailError.textContent="";
           AdressError.textContent="";
           PassError.textContent="";

           if (!nom) {
            NomError.textContent="Nom Obligatoire*";
            isValid = false;
            }

           if (!prenom) {
            PrenomError.textContent="Prénom Obligatoire*";
            isValid = false;
            } 

            if (!specialite) {
              SpecError.textContent="Specialité Obligatoire*";
              isValid = false;
              }

              if (!adresse) {
                AdressError.textContent="Adresse Obligatoire*";
                isValid = false;
                }

              let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

             if (!login) {
              EmailError.textContent="Email Obligatoire*";
              isValid = false;
              } else if (!emailRegex.test(login)) {
                EmailError.textContent="Veuillez entrer un email valide";
                isValid = false;
              }

              if (!password) {
                PassError.textContent="Mot de pass oblgatoire Obligatoire*";
                isValid = false;
                } else if (password.length < 3) {
                  PassError.textContent="Le mot de pass devrait contenir au minimum 3 carctères";
                  isValid = false;
                }

                if (!isValid) {
                  return;
                  }
       
      const response = await fetch("http://localhost:3000/medecin", {
  
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nom, prenom, specialite, login, password })
      });
  
      const data = await response.json();
      console.log("Médecin ajouté:", data);
      suppopup()
  });
  
});

    
  async function fetcher(cle) {
      try {
          const reponse = await fetch(`http://localhost:3000/${cle}`);
          const donne = await reponse.json();
          return donne; 
      } catch (error) {
          console.error("Erreur lors du fetch :", error); 
          return null; 
      }
   
  }
  function popup() {
}

  function suppopup() {
    const form_medecin=document.querySelector("#medecinForm");
    form_medecin.classList.add("hidden");
    const contenu=document.querySelector("#contenu");
    contenu.classList.remove("bg-black opacity-50");
  }
  
  async function listeMedcin(medecin) {
  
    const listeMedcin = document.getElementById("liste-medecin");
    listeMedcin.innerHTML = "";
  
    medecin.forEach((med) => {
        const row = document.createElement("tr");
        row.className = "border-b border-gray-200 hover:bg-gray-50";
        row.innerHTML = `
          <td class="py-3 px-6"><input type="checkbox" class="checkbox-medecin  w-5 h-5 accent-blue-500" data-id="${med.id}"></td>
          <td class="px-6 py-3">${med.prenom} ${med.nom}</td>
          <td class="px-6 py-3">${med.specialite}</td>
          <td class="px-6 py-3">${med.login}</td>
          <td class="px-6 py-3">${med.adresse}</td>
          <td class="py-3 px-6 flex space-x-3">
            <button class=" modifier bg-[#F2F4F7] text-[#0070FF] font-medium px-3 py-1 rounded-lg text-sm flex items-center space-x-1 hover:bg-green-200" data-id="${med.id}">
                <span class=" text-lg font-bold">•</span>
                <span class="">Modifier</span>
            </button>
         </td>`;
        listeMedcin.appendChild(row);

      });

               // Les événements de modification
               const button=document.querySelectorAll(".modifier")
               button.forEach(btn => {
                btn.addEventListener("click",function(){
                  modifierMedecin(event);
                  const contenu=document.querySelector("#contenu");
                  contenu.classList.remove("bg-black opacity-75");              
                }); 
      });
  }
  
   // Sélectionner tous les médecins
//    document.getElementById("select-all").addEventListener("change", function() {
//     document.querySelectorAll(".checkbox-medecin").forEach(cb => cb.checked = this.checked);
// });

// Fonction de suppression
// document.getElementById("supprimer").addEventListener("click", function() {
//     medecins = medecins.filter((_, index) => !document.querySelector(`.checkbox-medecin[data-index="${index}"]`).checked);
//     listeMedcin(medecin);
// });

document.getElementById("supprimer").addEventListener("click", async function () {
  // alert("yoo");
  // Récupérer tous les médecins cochés
  const checkboxes = document.querySelectorAll(".checkbox-medecin:checked");
  const checksup = Array.from(checkboxes).map(cb => cb.dataset.id);

  if (checksup.length === 0) {
      alert("Aucun médecin sélectionné !");
      return;
  }

  // Supprimer chaque médecin avec `DELETE`
  try {
      await Promise.all(checksup.map(id =>
          fetch(`http://localhost:3000/medecin/${id}`, {
              method: "DELETE"
          })
      ));

      // Recharger la liste après suppression
      chargerMedecins();
  } catch (error) {
      console.error("Erreur lors de la suppression", error);
  }
});


// Fonction de modification
async function modifierMedecin(event) {
  const id = event.target.dataset.id;
  const med = await fetcher("medecin");

  document.getElementById("id-modif").value = id;
  document.getElementById("prenom-modif").value = med.prenom;
  document.getElementById("nom-modif").value = med.nom;
  document.getElementById("specialite-modif").value = med.specialite;
  document.getElementById("login-modif").value = med.login;
  document.getElementById("pass-modif").value = med.password;
  document.getElementById("adresse-modif").value = med.adresse;
  document.getElementById("form-modif").classList.remove("hidden");
}

// Valider la modification
document.getElementById("valider-modif").addEventListener("click", async function() {
  const id = document.getElementById("id-modif").value;
 const medecinModif= {
      prenom: document.getElementById("prenom-modif").value,
      nom: document.getElementById("nom-modif").value,
      specialite: document.getElementById("specialite-modif").value,
      login: document.getElementById("login-modif").value,
      adresse: document.getElementById("adresse-modif").value
  };
  try {
    await fetch(`http://localhost:3000/medecin/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medecinModif)
    });

    document.getElementById("form-modif").classList.add("hidden");
    listeMedcin(medecin);
  } catch (error) {
    console.error("Erreur lors de la mise à jour", error);
}
});
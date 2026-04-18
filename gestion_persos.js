const btnAjouter = document.getElementById('btnAjouter');
const listeDiv = document.getElementById('liste-persos');
let modeEditionId = null; // Variable pour savoir quel perso on modifie

window.onload = afficherPersos;

btnAjouter.addEventListener('click', () => {
    const nom = document.getElementById('nom').value;
    const titre = document.getElementById('titre').value;
    const race = document.getElementById('race').value;
    const capacite = document.getElementById('capacite').value;
    const image = document.getElementById('imageLink').value || 'https://via.placeholder.com/150?text=No+Image';
    const bio = document.getElementById('bio').value;

    if(nom === "") return alert("Le nom est obligatoire !");

    let persos = JSON.parse(localStorage.getItem('monGrimoirePersos')) || [];

    if (modeEditionId) {
        // MODE MODIFICATION
        persos = persos.map(p => p.id === modeEditionId ? { ...p, nom, titre, race, capacite, image, bio } : p);
        btnAjouter.innerText = "Inscrire au Grimoire";
        modeEditionId = null;
    } else {
        // MODE AJOUT
        const perso = { id: Date.now(), nom, titre, race, capacite, image, bio };
        persos.push(perso);
    }
    
    localStorage.setItem('monGrimoirePersos', JSON.stringify(persos));
    resetFormulaire();
    afficherPersos();
});

function afficherPersos() {
    let persos = JSON.parse(localStorage.getItem('monGrimoirePersos')) || [];
    listeDiv.innerHTML = "";

    persos.forEach(p => {
        listeDiv.innerHTML += `
            <div class="fiche-cadre display-perso">
                <div class="photo-perso">
                    <img src="${p.image}" alt="Portrait">
                </div>
                <div class="infos-perso">
                    <div class="fiche-entete">
                        <h3>${p.nom}</h3>
                        <span class="sous-titre">${p.titre}</span>
                        <div class="actions-fiche">
                            <button class="btn-action edit" onclick="preparerModification(${p.id})">✎ Modifier</button>
                            <button class="btn-action delete" onclick="supprimerPerso(${p.id})">❌</button>
                        </div>
                    </div>
                    <p><strong>Race :</strong> ${p.race} | <strong>Capacité :</strong> ${p.capacite}</p>
                    <p class="biographie">${p.bio}</p>
                </div>
            </div>
        `;
    });
}

function preparerModification(id) {
    let persos = JSON.parse(localStorage.getItem('monGrimoirePersos')) || [];
    const p = persos.find(p => p.id === id);
    
    if(p) {
        document.getElementById('nom').value = p.nom;
        document.getElementById('titre').value = p.titre;
        document.getElementById('race').value = p.race;
        document.getElementById('capacite').value = p.capacite;
        document.getElementById('imageLink').value = p.image;
        document.getElementById('bio').value = p.bio;

        modeEditionId = id;
        btnAjouter.innerText = "Enregistrer les Changements";
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte au formulaire
    }
}

function supprimerPerso(id) {
    if(confirm("Voulez-vous rayer ce nom du grimoire ?")) {
        let persos = JSON.parse(localStorage.getItem('monGrimoirePersos')) || [];
        persos = persos.filter(p => p.id !== id);
        localStorage.setItem('monGrimoirePersos', JSON.stringify(persos));
        afficherPersos();
    }
}

function resetFormulaire() {
    document.querySelectorAll('.formulaire-ajout input, .formulaire-ajout textarea').forEach(el => el.value = "");
    modeEditionId = null;
    btnAjouter.innerText = "Inscrire au Grimoire";
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formPerso');
    const liste = document.getElementById('listePersos');
    const btnToggle = document.getElementById('toggleFormPerso');
    const zoneForm = document.getElementById('zoneFormPerso');
    
    let personnages = JSON.parse(localStorage.getItem('monGrimoirePersos')) || [];

    // --- REMPLIR LES OPTIONS LIÉES (CARTE & BESTIAIRE) ---
    function chargerOptionsLies() {
        const lieux = JSON.parse(localStorage.getItem('monGrimoireCarte')) || [];
        const monstres = JSON.parse(localStorage.getItem('monGrimoireBestiaire')) || [];
        
        const selectLieu = document.getElementById('lieuPerso');
        const selectNemesis = document.getElementById('nemesisPerso');

        selectLieu.innerHTML = '<option value="">-- Originaire de... --</option>';
        lieux.forEach(l => {
            selectLieu.innerHTML += `<option value="${l.nom}">${l.nom}</option>`;
        });

        selectNemesis.innerHTML = '<option value="">-- Ennemi juré... --</option>';
        monstres.forEach(m => {
            selectNemesis.innerHTML += `<option value="${m.nom}">${m.nom}</option>`;
        });
    }

    btnToggle.onclick = () => {
        const estCache = zoneForm.style.display === "none";
        zoneForm.style.display = estCache ? "block" : "none";
        if(estCache) chargerOptionsLies();
    };

    function afficherPersos() {
        liste.innerHTML = "";
        personnages.forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'carte-perso';
            card.innerHTML = `
                <h3>${p.nom}</h3>
                <p><strong>${p.role}</strong></p>
                <button onclick="ouvrirFiche(${index})">Consulter la fiche</button>
                <button onclick="supprimerPerso(${index})" style="color:red; font-size:0.8em; margin-top:10px; background:none; border:none; cursor:pointer;">[Effacer]</button>
            `;
            liste.appendChild(card);
        });
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        const nouveauPerso = {
            nom: document.getElementById('nom').value,
            role: document.getElementById('role').value,
            lieu: document.getElementById('lieuPerso').value,
            nemesis: document.getElementById('nemesisPerso').value,
            histoire: document.getElementById('histoire').value
        };
        personnages.push(nouveauPerso);
        localStorage.setItem('monGrimoirePersos', JSON.stringify(personnages));
        form.reset();
        zoneForm.style.display = "none";
        afficherPersos();
    };

    window.ouvrirFiche = (index) => {
        const p = personnages[index];
        const modale = document.getElementById('modalePerso');
        const details = document.getElementById('detailsPerso');
        
        // Création des liens croisés
        const lienLieu = p.lieu ? `<a href="carte.html" class="lien-interne">📍 ${p.lieu}</a>` : "Inconnue";
        const lienNemesis = p.nemesis ? `<a href="bestiaire.html" class="lien-interne" style="color:#ff4444;">💀 ${p.nemesis}</a>` : "Aucune";

        details.innerHTML = `
            <h2>${p.nom}</h2>
            <p style="text-align:center; color:#e3d3ad;"><em>${p.role}</em></p>
            <hr>
            <p><strong>Terre d'origine :</strong> ${lienLien}</p>
            <p><strong>Némésis :</strong> ${lienNemesis}</p>
            <div class="histoire-bloc">
                <h3>Légende</h3>
                <p>${p.histoire.replace(/\n/g, '<br>')}</p>
            </div>
        `;
        modale.style.display = "flex";
    };

    window.supprimerPerso = (index) => {
        if(confirm("Supprimer ce héros des archives ?")) {
            personnages.splice(index, 1);
            localStorage.setItem('monGrimoirePersos', JSON.stringify(personnages));
            afficherPersos();
        }
    };

    // Fermeture modale
    document.querySelector('.fermer-modal').onclick = () => {
        document.getElementById('modalePerso').style.display = "none";
    };

    afficherPersos();
});
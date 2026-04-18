document.addEventListener('DOMContentLoaded', () => {
    const formPerso = document.getElementById('formPerso');
    const zoneFormulaire = document.getElementById('zoneFormulaire');
    const toggleBtn = document.getElementById('toggleFormBtn');
    const listePersos = document.getElementById('listePersos');
    const modal = document.getElementById('modalFiche');
    const contenuModal = document.getElementById('contenuFicheComplete');
    const fermerBtn = document.getElementById('fermerModal');

    let persos = JSON.parse(localStorage.getItem('monGrimoirePersos')) || [];

    // --- 1. GESTION DE L'AFFICHAGE DU FORMULAIRE ---
    toggleBtn.addEventListener('click', () => {
        if (zoneFormulaire.style.display === "none") {
            zoneFormulaire.style.display = "block";
            toggleBtn.textContent = "◈ Fermer le registre ◈";
        } else {
            zoneFormulaire.style.display = "none";
            toggleBtn.textContent = "◈ Inscrire un nouveau Héros ◈";
        }
    });

    // --- 2. AFFICHAGE DE LA GRILLE ---
    function afficherGrille() {
        if (!listePersos) return;
        listePersos.innerHTML = "";
        
        persos.sort((a, b) => a.nom.localeCompare(b.nom));

        persos.forEach((p, index) => {
            const container = document.createElement('div');
            container.className = 'medaillon-container';
            container.innerHTML = `
                <img src="${p.photo || 'https://via.placeholder.com/150'}" class="medaillon-perso">
                <span class="medaillon-name">${p.nom}</span>
            `;
            container.onclick = () => ouvrirModale(index);
            listePersos.appendChild(container);
        });
    }

    // --- 3. OUVERTURE DE LA FICHE (MODALE) ---
    function ouvrirModale(index) {
        const p = persos[index];
        contenuModal.innerHTML = `
            <div style="display:flex; gap:30px; align-items:flex-start;">
                <img src="${p.photo || 'https://via.placeholder.com/200'}" style="width:250px; border:1px solid #e3d3ad33;">
                <div style="flex:1; text-align:left;">
                    <h2 style="text-align:left; margin-top:0;">${p.nom}</h2>
                    <p><strong>Race :</strong> ${p.race || 'Inconnue'} | <strong>Classe :</strong> ${p.classe || 'Inconnue'}</p>
                    <p><strong>Alignement :</strong> ${p.alignement || 'Neutre'}</p>
                    <hr style="margin: 15px 0; opacity: 0.2;">
                    <p style="white-space: pre-wrap;">${p.histoire || 'Aucun récit n\'a encore été écrit...'}</p>
                    <button onclick="supprimerPerso(${index})" class="btn-suppr">Bannir des archives</button>
                </div>
            </div>
        `;
        modal.style.display = 'flex';
    }

    // --- 4. SAUVEGARDE ---
    if(formPerso) {
        formPerso.addEventListener('submit', function(e) {
            e.preventDefault();
            const f = document.getElementById('photoPerso').files[0];
            
            const pData = {
                nom: document.getElementById('nomPerso').value,
                race: document.getElementById('racePerso').value,
                classe: document.getElementById('classePerso').value,
                alignement: document.getElementById('alignPerso').value,
                histoire: document.getElementById('histoirePerso').value
            };

            if(f) {
                const reader = new FileReader();
                reader.onload = function() {
                    pData.photo = reader.result;
                    finaliserSauvegarde(pData);
                };
                reader.readAsDataURL(f);
            } else {
                finaliserSauvegarde(pData);
            }
        });
    }

    function finaliserSauvegarde(data) {
        persos.push(data);
        localStorage.setItem('monGrimoirePersos', JSON.stringify(persos));
        formPerso.reset();
        zoneFormulaire.style.display = "none";
        toggleBtn.textContent = "◈ Inscrire un nouveau Héros ◈";
        afficherGrille();
    }

    // --- 5. SUPPRESSION ---
    window.supprimerPerso = (index) => {
        if(confirm("Effacer ce héros pour l'éternité ?")) {
            persos.splice(index, 1);
            localStorage.setItem('monGrimoirePersos', JSON.stringify(persos));
            modal.style.display = 'none';
            afficherGrille();
        }
    };

    fermerBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if(e.target == modal) modal.style.display = 'none'; };
    
    afficherGrille();
});
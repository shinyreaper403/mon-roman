const btnAjouter = document.getElementById('btnAjouterLexique');
const listeDiv = document.getElementById('liste-lexique');
let modeEditionId = null;

// Chargement automatique au démarrage
window.onload = afficherLexique;

btnAjouter.addEventListener('click', () => {
    const terme = document.getElementById('terme').value;
    const categorie = document.getElementById('categorie').value;
    const definition = document.getElementById('definition').value;

    if (terme.trim() === "") {
        alert("Veuillez entrer un nom de terme.");
        return;
    }

    let lexique = JSON.parse(localStorage.getItem('monGrimoireLexique')) || [];

    if (modeEditionId) {
        // On met à jour un terme existant
        lexique = lexique.map(item => 
            item.id === modeEditionId ? { ...item, terme, categorie, definition } : item
        );
        modeEditionId = null;
        btnAjouter.innerText = "Inscrire au Lexique";
    } else {
        // On crée un nouveau terme
        const nouvelItem = {
            id: Date.now(),
            terme: terme,
            categorie: categorie,
            definition: definition
        };
        lexique.push(nouvelItem);
    }
    
    localStorage.setItem('monGrimoireLexique', JSON.stringify(lexique));
    
    // On vide les champs
    document.getElementById('terme').value = "";
    document.getElementById('categorie').value = "";
    document.getElementById('definition').value = "";
    
    afficherLexique();
});

function afficherLexique() {
    let lexique = JSON.parse(localStorage.getItem('monGrimoireLexique')) || [];
    
    // Tri alphabétique automatique
    lexique.sort((a, b) => a.terme.localeCompare(b.terme));
    
    listeDiv.innerHTML = "";

    lexique.forEach(item => {
        listeDiv.innerHTML += `
            <div class="fiche-lexique">
                <div class="actions-fiche">
                    <button class="btn-action edit" onclick="preparerModif(${item.id})">Modifier</button>
                    <button class="btn-action delete" onclick="supprimerTerme(${item.id})">❌</button>
                </div>
                <h3>${item.terme}</h3>
                <span class="categorie-label">${item.categorie || 'Non classé'}</span>
                <p class="definition-texte">${item.definition}</p>
            </div>
        `;
    });
}

function preparerModif(id) {
    let lexique = JSON.parse(localStorage.getItem('monGrimoireLexique')) || [];
    const item = lexique.find(i => i.id === id);
    
    if(item) {
        document.getElementById('terme').value = item.terme;
        document.getElementById('categorie').value = item.categorie;
        document.getElementById('definition').value = item.definition;
        
        modeEditionId = id;
        btnAjouter.innerText = "Mettre à jour le terme";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function supprimerTerme(id) {
    if(confirm("Voulez-vous vraiment effacer ce terme du lexique ?")) {
        let lexique = JSON.parse(localStorage.getItem('monGrimoireLexique')) || [];
        lexique = lexique.filter(i => i.id !== id);
        localStorage.setItem('monGrimoireLexique', JSON.stringify(lexique));
        afficherLexique();
    }
}
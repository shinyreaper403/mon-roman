/**
 * GESTIONNAIRE DU LEXIQUE - VERSION STABLE
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. ÉLÉMENTS DU DOM
    const formLexique = document.getElementById('formLexique');
    const listeLexique = document.getElementById('listeLexique');
    
    // 2. RÉCUPÉRATION DES DONNÉES
    // On s'assure d'utiliser la même clé que recherche.js
    let lexique = JSON.parse(localStorage.getItem('monGrimoireLexique')) || [];

    // 3. FONCTION D'AFFICHAGE DES FICHES
    function afficherLexique() {
        if (!listeLexique) return;
        
        // On vide la liste actuelle
        listeLexique.innerHTML = "";

        // Tri par ordre alphabétique
        lexique.sort((a, b) => a.terme.localeCompare(b.terme));

        // Création des fiches
        lexique.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'fiche-lexique';
            card.innerHTML = `
                <div class="actions-fiche" style="float: right;">
                    <button class="btn-suppr" data-index="${index}" style="background:none; border:1px solid #630000; color:#ff3300; cursor:pointer; font-size:0.7em; padding:2px 5px;">Supprimer</button>
                </div>
                <span class="res-type" style="display:block; margin-bottom:5px;">📖 ${item.categorie}</span>
                <h3 class="res-name" style="margin:0; font-size:1.4em;">${item.terme}</h3>
                <p style="margin-top:10px; line-height:1.6; color:#c9c2b5;">${item.definition}</p>
            `;
            listeLexique.appendChild(card);
        });

        // On attache les événements de suppression après la création
        attacherEvenementsSuppression();
    }

    // 4. FONCTION D'AJOUT
    if (formLexique) {
        formLexique.addEventListener('submit', (e) => {
            e.preventDefault();

            // Récupération précise des valeurs
            const termeInput = document.getElementById('terme');
            const catSelect = document.getElementById('categorieLexique');
            const defTextarea = document.getElementById('definition');

            if (!termeInput || !defTextarea) return;

            const nouveauTerme = {
                terme: termeInput.value.trim(),
                categorie: catSelect.value,
                definition: defTextarea.value.trim()
            };

            // Ajout et Sauvegarde
            lexique.push(nouveauTerme);
            localStorage.setItem('monGrimoireLexique', JSON.stringify(lexique));
            
            // Reset et Rafraîchissement
            formLexique.reset();
            afficherLexique();
            console.log("Terme ajouté : " + nouveauTerme.terme);
        });
    }

    // 5. GESTION DE LA SUPPRESSION (MÉTHODE MODERNE)
    function attacherEvenementsSuppression() {
        const boutons = document.querySelectorAll('.btn-suppr');
        boutons.forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                if (confirm("Voulez-vous effacer ce savoir des archives ?")) {
                    lexique.splice(index, 1);
                    localStorage.setItem('monGrimoireLexique', JSON.stringify(lexique));
                    afficherLexique();
                }
            });
        });
    }

    // Lancement au chargement de la page
    afficherLexique();
});
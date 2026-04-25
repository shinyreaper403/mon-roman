document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('globalSearch');
    const results = document.getElementById('resultatsRecherche');

    if (!input || !results) return; // Sécurité si les éléments n'existent pas sur la page

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        
        // On cache les résultats si la recherche est vide
        if (query.length < 1) { 
            results.style.display = 'none'; 
            return; 
        }

        // Récupération de toutes les données du grimoire
        const persos = JSON.parse(localStorage.getItem('monGrimoirePersos')) || [];
        const lexique = JSON.parse(localStorage.getItem('monGrimoireLexique')) || [];
        const notes = JSON.parse(localStorage.getItem('monGrimoireNotes')) || [];
        const monstres = JSON.parse(localStorage.getItem('monGrimoireBestiaire')) || [];
        
        let found = [];

        // 1. Recherche dans les Personnages
        persos.forEach(p => { 
            if(p.nom.toLowerCase().includes(query)) 
                found.push({ n: p.nom, t: 'Héros', url: 'persos.html' }); 
        });
        
        // 2. Recherche dans le Lexique
        lexique.forEach(l => { 
            if(l.terme.toLowerCase().includes(query)) 
                found.push({ n: l.terme, t: 'Lexique', url: 'lexique.html' }); 
        });

        // 3. Recherche dans les Notes
        notes.forEach(n => { 
            if(n.titre.toLowerCase().includes(query)) 
                found.push({ n: n.titre, t: 'Note', url: 'notes.html' }); 
        });

        // 4. Recherche dans le Bestiaire
        monstres.forEach(m => { 
            if(m.nom.toLowerCase().includes(query)) 
                found.push({ n: m.nom, t: 'Bestiaire', url: 'bestiaire.html' }); 
        });

        // Affichage des résultats
        if (found.length > 0) {
            results.innerHTML = found.map(item => `
                <div class="res-item">
                    <a href="${item.url}">
                        <span class="res-type" style="font-size:0.7em; color:#868177; text-transform:uppercase; margin-right:8px;">[${item.t}]</span>
                        <span class="res-name" style="color:#e3d3ad; font-weight:bold;">${item.n}</span>
                    </a>
                </div>
            `).join('');
            results.style.display = 'block';
        } else {
            results.innerHTML = `<div class="res-item" style="color:#666; padding:10px;">Aucune archive trouvée...</div>`;
            results.style.display = 'block';
        }
    });

    // Fermer le menu de recherche si on clique ailleurs sur la page
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
            results.style.display = 'none';
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const formNote = document.getElementById('formNote');
    const listeNotes = document.getElementById('listeNotes');
    const searchNotes = document.getElementById('searchNotes');

    let notes = JSON.parse(localStorage.getItem('monGrimoireNotes')) || [];

    function afficherNotes(filtre = "") {
        listeNotes.innerHTML = "";
        
        const notesFiltrees = notes.filter(n => 
            n.titre.toLowerCase().includes(filtre.toLowerCase()) || 
            n.tags.some(t => t.toLowerCase().includes(filtre.toLowerCase()))
        );

        notesFiltrees.forEach((n, index) => {
            const card = document.createElement('div');
            card.className = 'note-card';
            card.innerHTML = `
                <button onclick="supprimerNote(${index})" style="float:right; padding:2px 5px; font-size:0.6em; border-color:#630000; color:#ff3300;">X</button>
                <h4>${n.titre}</h4>
                <p>${n.contenu}</p>
                <div class="tag-container">
                    ${n.tags.map(t => `<span class="tag">#${t.trim()}</span>`).join('')}
                </div>
            `;
            listeNotes.appendChild(card);
        });
    }

    formNote.onsubmit = (e) => {
        e.preventDefault();
        const nouvelleNote = {
            titre: document.getElementById('titreNote').value,
            contenu: document.getElementById('contenuNote').value,
            tags: document.getElementById('tagsNote').value.split(',')
        };
        notes.push(nouvelleNote);
        localStorage.setItem('monGrimoireNotes', JSON.stringify(notes));
        formNote.reset();
        afficherNotes();
    };

    searchNotes.addEventListener('input', (e) => {
        afficherNotes(e.target.value);
    });

    window.supprimerNote = (index) => {
        if(confirm("Détruire cette note ?")) {
            notes.splice(index, 1);
            localStorage.setItem('monGrimoireNotes', JSON.stringify(notes));
            afficherNotes();
        }
    };

    afficherNotes();
});
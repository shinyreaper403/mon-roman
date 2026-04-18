document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('globalSearch');
    const results = document.getElementById('resultatsRecherche');

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        if (query.length < 1) { results.style.display = 'none'; return; }

        const p = JSON.parse(localStorage.getItem('monGrimoirePersos')) || [];
        const l = JSON.parse(localStorage.getItem('monGrimoireLexique')) || [];
        
        let found = [];
        p.forEach(x => { if(x.nom.toLowerCase().includes(query)) found.push({n: x.nom, t: 'Personnage', url: 'persos.html'}); });
        l.forEach(x => { if(x.terme.toLowerCase().includes(query)) found.push({n: x.terme, t: 'Lexique', url: 'lexique.html'}); });

        if (found.length > 0) {
            results.innerHTML = found.map(i => `
                <div class="res-item"><a href="${i.url}">
                    <span class="res-type">${i.t}</span><span class="res-name">${i.n}</span>
                </a></div>`).join('');
            results.style.display = 'block';
        } else {
            results.style.display = 'none';
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const first = results.querySelector('a');
            if(first) window.location.href = first.href;
        }
    });
});
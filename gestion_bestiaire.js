document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formBestiaire');
    const zone = document.getElementById('zoneFormBestiaire');
    const btnToggle = document.getElementById('toggleBestiaire');
    const liste = document.getElementById('listeBestiaire');

    let bestiaire = JSON.parse(localStorage.getItem('monGrimoireBestiaire')) || [];

    btnToggle.onclick = () => {
        zone.style.display = zone.style.display === "none" ? "block" : "none";
    };

    function afficherBestiaire() {
        liste.innerHTML = "";
        bestiaire.forEach((m, index) => {
            const card = document.createElement('div');
            card.className = 'carte-monstre';
            card.innerHTML = `
                <span class="danger-badge ${m.danger}">${m.danger}</span>
                <h4>${m.nom}</h4>
                <div class="stat-ligne">
                    <strong>PV:</strong> ${m.pv || '?'} | <strong>Habitat:</strong> ${m.habitat || 'Inconnu'}
                </div>
                <p style="font-style: italic; font-size: 0.9em;">${m.capacite}</p>
                <button onclick="supprimerMonstre(${index})" style="background:none; border:none; color:#666; cursor:pointer; font-size:0.7em;">[Effacer de la mémoire]</button>
            `;
            liste.appendChild(card);
        });
    }

    form.onsubmit = (e) => {
        e.preventDefault();
        const nouveau = {
            nom: document.getElementById('nomMonstre').value,
            danger: document.getElementById('dangerMonstre').value,
            pv: document.getElementById('pvMonstre').value,
            habitat: document.getElementById('habitatMonstre').value,
            capacite: document.getElementById('capaciteMonstre').value
        };
        bestiaire.push(nouveau);
        localStorage.setItem('monGrimoireBestiaire', JSON.stringify(bestiaire));
        form.reset();
        zone.style.display = "none";
        afficherBestiaire();
    };

    window.supprimerMonstre = (index) => {
        if(confirm("Bannir cette créature ?")) {
            bestiaire.splice(index, 1);
            localStorage.setItem('monGrimoireBestiaire', JSON.stringify(bestiaire));
            afficherBestiaire();
        }
    };

    afficherBestiaire();
});
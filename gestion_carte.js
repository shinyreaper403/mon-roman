document.addEventListener('DOMContentLoaded', () => {
    const conteneur = document.getElementById('conteneurCarte');
    const dynamique = document.getElementById('carteDynamique');
    const img = document.getElementById('imageCarte');
    const pinsContainer = document.getElementById('pinsContainer');
    const modal = document.getElementById('formPoint');
    
    let points = JSON.parse(localStorage.getItem('monGrimoireCarte')) || [];
    let scale = 1;
    let originX = 0, originY = 0;
    let isDragging = false;
    let startX, startY;
    let tempCoords = { x: 0, y: 0 };

    // --- ZOOM (Molette) ---
    conteneur.onwheel = (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        const oldScale = scale;
        
        if (e.deltaY < 0) scale += zoomSpeed;
        else scale = Math.max(1, scale - zoomSpeed);

        // Ajustement pour zoomer vers la souris
        const rect = conteneur.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        originX -= (mouseX / oldScale - mouseX / scale) * scale;
        originY -= (mouseY / oldScale - mouseY / scale) * scale;

        appliquerTransfo();
    };

    // --- DÉPLACEMENT (Drag) ---
    conteneur.onmousedown = (e) => {
        if (e.target.classList.contains('pin')) return;
        isDragging = true;
        startX = e.clientX - originX;
        startY = e.clientY - originY;
    };

    window.onmousemove = (e) => {
        if (!isDragging) return;
        originX = e.clientX - startX;
        originY = e.clientY - startY;
        appliquerTransfo();
    };

    window.onmouseup = () => { isDragging = false; };

    function appliquerTransfo() {
        dynamique.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
    }

    // --- PLACER UN POINT (Calcul précis) ---
    dynamique.onclick = (e) => {
        // Si on a bougé pendant le clic, on n'ajoute pas de point
        if (isDragging) return; 
        if (e.target.classList.contains('pin') || e.target.tagName === 'BUTTON') return;

        const rect = img.getBoundingClientRect();
        // Coordonnées relatives à l'image réelle, peu importe le zoom
        const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

        tempCoords = { x: xPercent, y: yPercent };
        modal.style.display = 'flex';
        document.getElementById('nomLieu').focus();
    };

    // --- SAUVEGARDE & AFFICHAGE ---
    window.supprimerPoint = (index) => {
        points.splice(index, 1);
        localStorage.setItem('monGrimoireCarte', JSON.stringify(points));
        afficherPoints();
    };

    document.getElementById('savePoint').onclick = () => {
        const nom = document.getElementById('nomLieu').value;
        const desc = document.getElementById('descLieu').value;
        if (nom) {
            points.push({ nom, desc, x: tempCoords.x, y: tempCoords.y });
            localStorage.setItem('monGrimoireCarte', JSON.stringify(points));
            afficherPoints();
            modal.style.display = 'none';
            document.getElementById('nomLieu').value = "";
            document.getElementById('descLieu').value = "";
        }
    };

    function afficherPoints() {
        pinsContainer.innerHTML = "";
        points.forEach((p, index) => {
            const div = document.createElement('div');
            div.className = 'pin';
            div.style.left = p.x + "%";
            div.style.top = p.y + "%";
            div.innerHTML = `
                <div class="pin-tooltip">
                    <strong>${p.nom}</strong><br><small>${p.desc}</small><br>
                    <button onclick="event.stopPropagation(); window.supprimerPoint(${index})" class="btn-suppr-carte">Supprimer</button>
                </div>`;
            pinsContainer.appendChild(div);
        });
    }

    document.getElementById('cancelPoint').onclick = () => modal.style.display = 'none';
    
    // On attend que l'image soit chargée pour bien calculer les dimensions
    img.onload = afficherPoints;
    if(img.complete) afficherPoints();
});
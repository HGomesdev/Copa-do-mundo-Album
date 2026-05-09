const albumData = {
    "ESPECIAIS": { id: "esp", stickers: ["00", "FWC1", "FWC2", "FWC3", "FWC4", "FWC5", "FWC6", "FWC7", "FWC8"], img: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
    "SELEÇÕES ESPECIAIS": { id: "fwc_spec", stickers: Array.from({ length: 11 }, (_, i) => `FWC${i + 9}`), img: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png" },
    "COCA-COLA": { id: "coca", stickers: Array.from({ length: 14 }, (_, i) => `CC${i + 1}`), img: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg" },
    "GRUPO A": { teams: [{ n: "México", s: "MEX", c: "mx" }, { n: "África do Sul", s: "RSA", c: "za" }, { n: "Coreia do Sul", s: "KOR", c: "kr" }, { n: "República Tcheca", s: "CZE", c: "cz" }] },
    "GRUPO B": { teams: [{ n: "Canadá", s: "CAN", c: "ca" }, { n: "Bósnia", s: "BIH", c: "ba" }, { n: "Catar", s: "QAT", c: "qa" }, { n: "Suíça", s: "SUI", c: "ch" }] },
    "GRUPO C": { teams: [{ n: "Brasil", s: "BRA", c: "br" }, { n: "Marrocos", s: "MAR", c: "ma" }, { n: "Haiti", s: "HAI", c: "ht" }, { n: "Escócia", s: "SCO", c: "scotland" }] },
    "GRUPO D": { teams: [{ n: "EUA", s: "USA", c: "us" }, { n: "Paraguai", s: "PAR", c: "py" }, { n: "Austrália", s: "AUS", c: "au" }, { n: "Turquia", s: "TUR", c: "tr" }] },
    "GRUPO E": { teams: [{ n: "Alemanha", s: "GER", c: "de" }, { n: "Curaçao", s: "CUW", c: "cw" }, { n: "Costa Marfim", s: "CIV", c: "ci" }, { n: "Equador", s: "ECU", c: "ec" }] },
    "GRUPO F": { teams: [{ n: "Holanda", s: "NED", c: "nl" }, { n: "Japão", s: "JPN", c: "jp" }, { n: "Suécia", s: "SWE", c: "se" }, { n: "Tunísia", s: "TUN", c: "tn" }] },
    "GRUPO G": { teams: [{ n: "Bélgica", s: "BEL", c: "be" }, { n: "Egito", s: "EGY", c: "eg" }, { n: "Irã", s: "IRN", c: "ir" }, { n: "N. Zelândia", s: "NZL", c: "nz" }] },
    "GRUPO H": { teams: [{ n: "Espanha", s: "ESP", c: "es" }, { n: "Cabo Verde", s: "CPV", c: "cv" }, { n: "Arábia Saudita", s: "KSA", c: "sa" }, { n: "Uruguai", s: "URU", c: "uy" }] },
    "GRUPO I": { teams: [{ n: "França", s: "FRA", c: "fr" }, { n: "Senegal", s: "SEN", c: "sn" }, { n: "Iraque", s: "IRQ", c: "iq" }, { n: "Noruega", s: "NOR", c: "no" }] },
    "GRUPO J": { teams: [{ n: "Argentina", s: "ARG", c: "ar" }, { n: "Argélia", s: "ALG", c: "dz" }, { n: "Áustria", s: "AUT", c: "at" }, { n: "Jordânia", s: "JOR", c: "jo" }] },
    "GRUPO K": { teams: [{ n: "Portugal", s: "POR", c: "pt" }, { n: "Congo", s: "COD", c: "cd" }, { n: "Uzbequistão", s: "UZB", c: "uz" }, { n: "Colômbia", s: "COL", c: "co" }] },
    "GRUPO L": { teams: [{ n: "Inglaterra", s: "ENG", c: "gb-eng" }, { n: "Croácia", s: "CRO", c: "hr" }, { n: "Gana", s: "GHA", c: "gh" }, { n: "Panamá", s: "PAN", c: "pa" }] }
};

let owned = JSON.parse(localStorage.getItem('album_2026_final')) || {};
let totalMax = 670;

window.oncontextmenu = (e) => { e.preventDefault(); return false; };

function render() {
    const main = document.getElementById('album-content');
    main.innerHTML = '';
    let count = 0;
    for (const [title, data] of Object.entries(albumData)) {
        const section = document.createElement('section');
        section.className = 'group-section';
        section.innerHTML = `<h2 class="section-title">${title}</h2>`;
        if (data.stickers) {
            section.appendChild(createCard(title, data.stickers, data.img));
            count += data.stickers.length;
        } else {
            data.teams.forEach(t => {
                const list = Array.from({ length: 20 }, (_, i) => `${t.s}${i + 1}`);
                const flag = t.c === "scotland" ? "https://flagcdn.com/w80/gb-sct.png" : `https://flagcdn.com/w80/${t.c}.png`;
                section.appendChild(createCard(t.n, list, flag));
                count += 20;
            });
        }
        main.appendChild(section);
    }
    totalMax = count;
    updateStats();
}

function createCard(name, stickers, img) {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.innerHTML = `<div class="team-header"><img src="${img}"> <span class="name">${name}</span></div>`;
    const body = document.createElement('div');
    body.className = 'team-body';

    const grid = document.createElement('div');
    grid.className = 'sticker-grid';

    stickers.forEach(sid => {
        const s = document.createElement('div');
        s.id = `st-${sid}`;
        updateVisual(s, sid);

        let lastTap = 0;
        const handleInteraction = (e) => {
            e.preventDefault(); e.stopPropagation();
            const now = new Date().getTime();
            const timesince = now - lastTap;

            if (timesince < 300 && timesince > 0) {
                if (owned[sid] > 0) {
                    owned[sid]--;
                    if (owned[sid] === 0) delete owned[sid];
                    saveQuiet(s, sid);
                }
            } else {
                owned[sid] = (owned[sid] || 0) + 1;
                saveQuiet(s, sid);
            }
            lastTap = now;
        };

        s.onclick = handleInteraction;
        s.ontouchstart = handleInteraction;
        grid.appendChild(s);
    });

    card.querySelector('.team-header').onclick = () => body.classList.toggle('active');
    body.appendChild(grid); card.appendChild(body);
    return card;
}

function updateVisual(el, sid) {
    const count = owned[sid] || 0;
    el.className = `sticker ${count > 0 ? 'owned' : ''}`;
    el.innerHTML = `${sid}${count > 1 ? `<span class="badge-repeat">${count - 1}</span>` : ''}`;
}

function saveQuiet(el, sid) {
    localStorage.setItem('album_2026_final', JSON.stringify(owned));
    updateVisual(el, sid);
    updateStats();
}

function updateStats() {
    const unique = Object.keys(owned).length;
    const percent = ((unique / totalMax) * 100).toFixed(1);
    document.getElementById('total-count').innerText = unique;
    document.getElementById('max-total').innerText = totalMax;
    document.getElementById('progress-percent').innerText = percent + "%";
    document.getElementById('bar').style.width = percent + "%";
}

document.getElementById('searchSticker').addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase().trim();
    if (val.length >= 3) {
        const target = document.getElementById(`st-${val}`);
        if (target) {
            const parentBody = target.closest('.team-body');
            if (parentBody && !parentBody.classList.contains('active')) parentBody.classList.add('active');
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

const modal = document.getElementById("modal-repetidas");
document.getElementById("btn-repetidas").onclick = () => {
    const lista = document.getElementById("lista-repetidas");
    lista.innerHTML = "";
    Object.keys(owned).forEach(sid => {
        if (owned[sid] > 1) {
            const s = document.createElement('div');
            s.className = 'sticker owned';
            s.innerHTML = `${sid} <span class="badge-repeat">${owned[sid] - 1}</span>`;
            lista.appendChild(s);
        }
    });
    modal.style.display = "block";
};
document.querySelector(".close-modal").onclick = () => modal.style.display = "none";

document.getElementById("btn-whatsapp").onclick = () => {
    let t = "*MINHAS REPETIDAS 2026*\n";
    Object.keys(owned).forEach(sid => { if (owned[sid] > 1) t += `• ${sid} (${owned[sid] - 1}x)\n`; });
    window.open(`https://wa.me/?text=${encodeURIComponent(t)}`);
};

window.onload = render;
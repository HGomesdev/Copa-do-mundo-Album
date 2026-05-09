const albumData = {
    "ESPECIAIS": { 
        id: "esp", 
        stickers: ["00", "FWC1", "FWC2", "FWC3", "FWC4", "FWC5", "FWC6", "FWC7", "FWC8"], 
        img: "https://www.svgrepo.com/show/513354/star.svg" 
    },
    "SELEÇÕES ESPECIAIS": { 
        id: "fwc_spec", 
        stickers: Array.from({length: 11}, (_, i) => `FWC${i + 9}`), 
        img: "https://www.svgrepo.com/show/500431/trophy.svg" 
    },
    "COCA-COLA": { 
        id: "coca", 
        stickers: Array.from({length: 14}, (_, i) => `CC${i + 1}`), 
        img: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg" 
    },
    "GRUPO A": { teams: [{n: "México", s: "MEX", c: "mx"}, {n: "África do Sul", s: "RSA", c: "za"}, {n: "Coreia do Sul", s: "KOR", c: "kr"}, {n: "República Tcheca", s: "CZE", c: "cz"}] },
    "GRUPO B": { teams: [{n: "Canadá", s: "CAN", c: "ca"}, {n: "Bósnia", s: "BIH", c: "ba"}, {n: "Catar", s: "QAT", c: "qa"}, {n: "Suíça", s: "SUI", c: "ch"}] },
    "GRUPO C": { teams: [{n: "Brasil", s: "BRA", c: "br"}, {n: "Marrocos", s: "MAR", c: "ma"}, {n: "Haiti", s: "HAI", c: "ht"}, {n: "Escócia", s: "SCO", c: "scotland"}] },
    "GRUPO D": { teams: [{n: "EUA", s: "USA", c: "us"}, {n: "Paraguai", s: "PAR", c: "py"}, {n: "Austrália", s: "AUS", c: "au"}, {n: "Turquia", s: "TUR", c: "tr"}] },
    "GRUPO E": { teams: [{n: "Alemanha", s: "GER", c: "de"}, {n: "Curaçao", s: "CUW", c: "cw"}, {n: "Costa Marfim", s: "CIV", c: "ci"}, {n: "Equador", s: "ECU", c: "ec"}] },
    "GRUPO F": { teams: [{n: "Holanda", s: "NED", c: "nl"}, {n: "Japão", s: "JPN", c: "jp"}, {n: "Suécia", s: "SWE", c: "se"}, {n: "Tunísia", s: "TUN", c: "tn"}] },
    "GRUPO G": { teams: [{n: "Bélgica", s: "BEL", c: "be"}, {n: "Egito", s: "EGY", c: "eg"}, {n: "Irã", s: "IRN", c: "ir"}, {n: "N. Zelândia", s: "NZL", c: "nz"}] },
    "GRUPO H": { teams: [{n: "Espanha", s: "ESP", c: "es"}, {n: "Cabo Verde", s: "CPV", c: "cv"}, {n: "Arábia Saudita", s: "KSA", c: "sa"}, {n: "Uruguai", s: "URU", c: "uy"}] },
    "GRUPO I": { teams: [{n: "França", s: "FRA", c: "fr"}, {n: "Senegal", s: "SEN", c: "sn"}, {n: "Iraque", s: "IRQ", c: "iq"}, {n: "Noruega", s: "NOR", c: "no"}] },
    "GRUPO J": { teams: [{n: "Argentina", s: "ARG", c: "ar"}, {n: "Argélia", s: "ALG", c: "dz"}, {n: "Áustria", s: "AUT", c: "at"}, {n: "Jordânia", s: "JOR", c: "jo"}] },
    "GRUPO K": { teams: [{n: "Portugal", s: "POR", c: "pt"}, {n: "Congo", s: "COD", c: "cd"}, {n: "Uzbequistão", s: "UZB", c: "uz"}, {n: "Colômbia", s: "COL", c: "co"}] },
    "GRUPO L": { teams: [{n: "Inglaterra", s: "ENG", c: "gb-eng"}, {n: "Croácia", s: "CRO", c: "hr"}, {n: "Gana", s: "GHA", c: "gh"}, {n: "Panamá", s: "PAN", c: "pa"}] }
};

let owned = JSON.parse(localStorage.getItem('album_v10_fix')) || {};
let openSections = {};

function render() {
    const main = document.getElementById('album-content');
    if (!main) return;
    main.innerHTML = '';
    let totalPossible = 0;

    for (const [title, data] of Object.entries(albumData)) {
        const section = document.createElement('section');
        section.className = 'group-section';
        section.innerHTML = `<h2 class="section-title">${title}</h2>`;

        if (data.stickers) {
            section.appendChild(createCard(title, data.stickers, data.img, data.id));
            totalPossible += data.stickers.length;
        } else {
            data.teams.forEach(t => {
                const list = Array.from({length: 20}, (_, i) => `${t.s.toUpperCase()}${i + 1}`);
                let flag = t.c === "scotland" ? "https://flagcdn.com/w80/gb-sct.png" : `https://flagcdn.com/w80/${t.c}.png`;
                section.appendChild(createCard(t.n, list, flag, t.s));
                totalPossible += 20;
            });
        }
        main.appendChild(section);
    }
    document.getElementById('max-total').innerText = totalPossible;
    updateStats(totalPossible);
}

function createCard(name, stickers, img, id) {
    const card = document.createElement('div');
    card.className = 'team-card';

    const header = document.createElement('div');
    header.className = 'team-header';
    header.innerHTML = `<img src="${img}" loading="lazy"> <span class="name">${name}</span>`;
    header.onclick = () => {
        const body = card.querySelector('.team-body');
        body.classList.toggle('active');
        openSections[id] = body.classList.contains('active');
    };

    const body = document.createElement('div');
    body.className = `team-body ${openSections[id] ? 'active' : ''}`;

    const btnFill = document.createElement('button');
    btnFill.className = 'btn-fill';
    btnFill.innerText = 'Completar Seleção';
    btnFill.onclick = (e) => {
        e.stopPropagation();
        stickers.forEach(sid => { if(!owned[sid]) owned[sid] = 1; });
        save();
    };

    const grid = document.createElement('div');
    grid.className = 'sticker-grid';

    stickers.forEach(sid => {
        const s = document.createElement('div');
        const count = owned[sid] || 0;
        s.className = `sticker ${count > 0 ? 'owned' : ''}`;
        s.innerHTML = `${sid} ${count > 1 ? `<span class="badge-repeat">${count-1}</span>` : ''}`;

        let timer;
        s.addEventListener('touchstart', (e) => {
            timer = setTimeout(() => { removeSticker(sid); }, 500);
        }, {passive: true});
        s.addEventListener('touchend', () => clearTimeout(timer));
        s.addEventListener('touchmove', () => clearTimeout(timer));

        s.onclick = (e) => {
            e.stopPropagation();
            owned[sid] = (owned[sid] || 0) + 1;
            save();
        };

        s.oncontextmenu = (e) => { e.preventDefault(); removeSticker(sid); };
        grid.appendChild(s);
    });

    body.appendChild(btnFill);
    body.appendChild(grid);
    card.appendChild(header);
    card.appendChild(body);
    return card;
}

function removeSticker(sid) {
    if (owned[sid] > 0) {
        owned[sid]--;
        if (owned[sid] === 0) delete owned[sid];
        save();
    }
}

function save() {
    localStorage.setItem('album_v10_fix', JSON.stringify(owned));
    render();
}

function updateStats(max) {
    const unique = Object.keys(owned).length;
    const percent = max > 0 ? ((unique / max) * 100).toFixed(1) : 0;
    document.getElementById('total-count').innerText = unique;
    document.getElementById('progress-percent').innerText = percent + "%";
    document.getElementById('bar').style.width = percent + "%";
}

// Inicialização segura
window.onload = render;
const albumData = {
    "ESPECIAIS": { id: "esp", stickers: ["00", "FWC1", "FWC2", "FWC3", "FWC4", "FWC5", "FWC6", "FWC7", "FWC8"], img: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png" },
    "SELEÇÕES ESPECIAIS": { id: "fwc_spec", stickers: Array.from({length: 11}, (_, i) => `FWC${i + 9}`), img: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png" },
    "COCA-COLA": { id: "coca", stickers: Array.from({length: 14}, (_, i) => `CC${i + 1}`), img: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg" },
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

let owned = JSON.parse(localStorage.getItem('album_2026_final')) || {};
let deferredPrompt;

// --- DETECÇÃO DE DISPOSITIVO E INSTALAÇÃO ---
window.addEventListener('DOMContentLoaded', () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    
    const iosBanner = document.getElementById('ios-install-banner');
    const btnAndroid = document.getElementById('btn-instalar');

    // Se for iOS e NÃO estiver instalado, mostra o banner clean
    if (isIOS && !isStandalone) {
        if (iosBanner) iosBanner.style.display = 'block';
    }
});

window.addEventListener('beforeinstallprompt', (e) => {
    // Só mostra botão de instalar se não for iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (!isIOS) {
        e.preventDefault();
        deferredPrompt = e;
        const btnAndroid = document.getElementById('btn-instalar');
        if (btnAndroid) btnAndroid.style.display = 'block';
    }
});

// --- RENDERIZAÇÃO DO ÁLBUM ---
function render() {
    const main = document.getElementById('album-content');
    if (!main) return;
    main.innerHTML = '';
    let totalGeralVal = 994; // Total fixo para o progresso

    for (const [title, data] of Object.entries(albumData)) {
        const section = document.createElement('section');
        section.className = 'group-section';
        section.innerHTML = `<h2 class="section-title">${title}</h2>`;
        
        if (data.stickers) {
            section.appendChild(createCard(title, data.stickers, data.img));
        } else {
            data.teams.forEach(t => {
                const list = Array.from({length: 20}, (_, i) => `${t.s}${i + 1}`);
                const flag = t.c === "scotland" ? "https://flagcdn.com/w80/gb-sct.png" : `https://flagcdn.com/w80/${t.c}.png`;
                section.appendChild(createCard(t.n, list, flag));
            });
        }
        main.appendChild(section);
    }
    updateStats(totalGeralVal);
}

function createCard(name, stickers, img) {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.innerHTML = `<div class="team-header"><img src="${img}" onerror="this.src='logo.png'"> <span class="team-name">${name}</span></div>`;
    const body = document.createElement('div');
    body.className = 'team-body';
    const grid = document.createElement('div');
    grid.className = 'sticker-grid';

    stickers.forEach(sid => {
        const s = document.createElement('div');
        s.id = `st-${sid}`;
        updateVisual(s, sid);

        let clicks = 0;
        let timeout;

        const handleAction = (e) => {
            e.preventDefault();
            clicks++;
            if (clicks === 1) {
                timeout = setTimeout(() => {
                    owned[sid] = (owned[sid] || 0) + 1;
                    saveData(s, sid);
                    clicks = 0;
                }, 250);
            } else {
                clearTimeout(timeout);
                if (owned[sid] > 0) {
                    owned[sid]--;
                    if (owned[sid] === 0) delete owned[sid];
                    saveData(s, sid);
                }
                clicks = 0;
            }
        };

        s.addEventListener('touchend', handleAction);
        s.addEventListener('click', (e) => { if (e.pointerType === 'mouse' || !e.pointerType) handleAction(e); });
        grid.appendChild(s);
    });

    card.querySelector('.team-header').onclick = () => body.classList.toggle('active');
    body.appendChild(grid); card.appendChild(body);
    return card;
}

function updateVisual(el, sid) {
    const count = owned[sid] || 0;
    el.className = `sticker ${count > 0 ? 'owned' : ''}`;
    el.innerHTML = `${sid}${count > 1 ? `<span class="badge-repeat">${count-1}</span>` : ''}`;
}

function saveData(el, sid) {
    localStorage.setItem('album_2026_final', JSON.stringify(owned));
    updateVisual(el, sid);
    updateStats(994);
}

function updateStats(maxVal) {
    const unique = Object.keys(owned).length;
    const percent = ((unique / maxVal) * 100).toFixed(1);
    document.getElementById('total-count').innerText = unique;
    document.getElementById('progress-percent').innerText = percent + "%";
    document.getElementById('bar').style.width = percent + "%";
}

// --- BUSCA ---
document.getElementById('searchSticker').addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase().trim();
    document.querySelectorAll('.sticker').forEach(s => s.classList.remove('sticker-foco'));
    if(val.length >= 2) {
        const stickers = Array.from(document.querySelectorAll('.sticker'));
        const alvo = stickers.find(s => s.id.replace('st-', '') === val) || stickers.find(s => s.id.replace('st-', '').startsWith(val));
        if(alvo) {
            alvo.closest('.team-body').classList.add('active');
            alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
            alvo.classList.add('sticker-foco');
        }
    }
});

// --- PIX ---
document.getElementById('copy-pix').onclick = () => {
    navigator.clipboard.writeText("18981427594").then(() => alert("Chave PIX copiada! 👊"));
};

// --- INICIALIZAÇÃO ---
window.onload = render;

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
let totalGeralVal = 0;
let deferredPrompt;

// --- LÓGICA DE INSTALAÇÃO (PWA) ---
const btnInstalar = document.getElementById('btn-instalar');

// Detecta se é iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Se for iOS, mostra o botão de baixar sempre
if (isIOS && btnInstalar) {
    btnInstalar.style.display = 'block';
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (btnInstalar) btnInstalar.style.display = 'block';
});

if (btnInstalar) {
    btnInstalar.addEventListener('click', async () => {
        if (isIOS) {
            alert("Para baixar no iPhone:\n\n1. Clique no ícone de 'Compartilhar' (seta no meio da barra inferior).\n2. Selecione 'Adicionar à Tela de Início'.");
            return;
        }
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') btnInstalar.style.display = 'none';
            deferredPrompt = null;
        }
    });
}

// --- RENDERIZAÇÃO DO ÁLBUM ---
function render() {
    const main = document.getElementById('album-content');
    if (!main) return;
    main.innerHTML = '';
    totalGeralVal = 0;

    for (const [title, data] of Object.entries(albumData)) {
        const section = document.createElement('section');
        section.className = 'group-section';
        section.innerHTML = `<h2 class="section-title">${title}</h2>`;
        
        if (data.stickers) {
            section.appendChild(createCard(title, data.stickers, data.img));
            totalGeralVal += data.stickers.length;
        } else {
            data.teams.forEach(t => {
                const list = Array.from({length: 20}, (_, i) => `${t.s}${i + 1}`);
                const flag = t.c === "scotland" ? "https://flagcdn.com/w80/gb-sct.png" : `https://flagcdn.com/w80/${t.c}.png`;
                section.appendChild(createCard(t.n, list, flag));
                totalGeralVal += 20;
            });
        }
        main.appendChild(section);
    }
    document.getElementById('max-total').innerText = totalGeralVal;
    updateStats();
}

function createCard(name, stickers, img) {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.innerHTML = `<div class="team-header"><img src="${img}" onerror="this.src='logo.png'"> <span class="name">${name}</span></div>`;
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
        let touchMoved = false;

        const handleAction = (e) => {
            if (touchMoved) return;
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

        s.addEventListener('touchstart', () => { touchMoved = false; });
        s.addEventListener('touchmove', () => { touchMoved = true; });
        s.addEventListener('touchend', handleAction);
        s.addEventListener('click', (e) => { if (e.pointerType === 'mouse') handleAction(e); });
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
    updateStats();
}

function updateStats() {
    const unique = Object.keys(owned).length;
    const maxVal = totalGeralVal || 994;
    const percent = ((unique / maxVal) * 100).toFixed(1);
    const totalCountEl = document.getElementById('total-count');
    const progPercentEl = document.getElementById('progress-percent');
    const barEl = document.getElementById('bar');
    
    if(totalCountEl) totalCountEl.innerText = unique;
    if(progPercentEl) progPercentEl.innerText = percent + "%";
    if(barEl) barEl.style.width = percent + "%";
}

// --- BUSCA ---
document.getElementById('searchSticker').addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase().trim();
    document.querySelectorAll('.sticker').forEach(s => s.classList.remove('sticker-foco'));
    if(val.length >= 2) {
        const stickers = Array.from(document.querySelectorAll('.sticker'));
        let alvo = stickers.find(s => s.id.replace('st-', '') === val);
        if (!alvo) alvo = stickers.find(s => s.id.replace('st-', '').startsWith(val));
        
        if(alvo) {
            alvo.closest('.team-body').classList.add('active');
            alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
            alvo.classList.add('sticker-foco');
        }
    }
});

// --- ANÚNCIO ---
setTimeout(() => {
    const modalAds = document.getElementById('modal-anuncio');
    const btnPular = document.getElementById('btn-pular-ads');
    let segundos = 7;
    if(modalAds) {
        modalAds.style.display = 'flex';
        const intervalo = setInterval(() => {
            segundos--;
            if (segundos > 0) {
                btnPular.innerText = `Aguarde ${segundos}s`;
            } else {
                clearInterval(intervalo);
                btnPular.innerText = "Pular Anúncio ✕";
                btnPular.classList.add('ativo');
                btnPular.disabled = false;
            }
        }, 1000);
        btnPular.onclick = () => modalAds.style.display = 'none';
    }
}, 3000);

// --- PIX ---
document.getElementById('copy-pix').onclick = function() {
    const chave = "18981427594";
    navigator.clipboard.writeText(chave).then(() => alert("Chave PIX copiada! 👊"));
};

// --- REPETIDAS ---
document.getElementById("btn-repetidas").onclick = () => {
    const lista = document.getElementById("lista-repetidas");
    lista.innerHTML = "";
    Object.keys(owned).forEach(sid => {
        if(owned[sid] > 1) {
            const s = document.createElement('div');
            s.className = 'sticker owned';
            s.innerHTML = `${sid} <span class="badge-repeat">${owned[sid]-1}</span>`;
            lista.appendChild(s);
        }
    });
    document.getElementById("modal-repetidas").style.display = "block";
};

document.querySelector(".close-modal").onclick = () => document.getElementById("modal-repetidas").style.display = "none";

document.getElementById("btn-whatsapp").onclick = () => {
    let t = "*MINHAS REPETIDAS 2026*\n";
    let cont = 0;
    Object.keys(owned).forEach(sid => { if(owned[sid]>1) { t += `• ${sid} (${owned[sid]-1}x)\n`; cont++; } });
    if(cont === 0) t = "Não tenho figurinhas repetidas no momento.";
    window.open(`https://wa.me/?text=${encodeURIComponent(t)}`);
};

// --- INICIALIZAÇÃO ---
window.onload = () => {
    render();
};

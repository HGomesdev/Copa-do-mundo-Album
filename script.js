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
let filtroRepetidas = false;
let deferredPrompt;

// --- ANÚNCIO ---
function iniciarAnuncio() {
    const modal = document.getElementById('modal-anuncio');
    const btn = document.getElementById('btn-pular-ads');
    if (!modal) return;
    modal.style.display = 'flex';
    let tempo = 7;
    const contagem = setInterval(() => {
        tempo--;
        if (tempo > 0) { btn.innerText = `Aguarde ${tempo}s...`; } 
        else {
            clearInterval(contagem);
            btn.innerText = "Pular Anúncio ✕";
            btn.style.background = "#fedd00"; btn.style.color = "#012169";
            btn.disabled = false;
        }
    }, 1000);
    btn.onclick = () => modal.style.display = 'none';
}

// --- RENDERIZAÇÃO ---
function render() {
    const main = document.getElementById('album-content');
    if (!main) return;
    main.innerHTML = '';

    if (filtroRepetidas) {
        const shareDiv = document.createElement('div');
        shareDiv.style = "text-align: center; margin-bottom: 20px;";
        shareDiv.innerHTML = `<button onclick="compartilharNoZap()" style="background: #25d366; color: white; border: none; padding: 12px 24px; border-radius: 50px; font-weight: bold; cursor: pointer; display: flex; align-items: center; margin: 0 auto; gap: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
            <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" style="width: 20px; filter: brightness(0) invert(1);"> COMPARTILHAR REPETIDAS
        </button>`;
        main.appendChild(shareDiv);
    }

    for (const [title, data] of Object.entries(albumData)) {
        const section = document.createElement('section');
        section.className = 'group-section';
        section.innerHTML = `<h2 class="section-title">${title}</h2>`;
        let temConteudo = false;

        if (data.stickers) {
            const possuiRepetida = data.stickers.some(id => owned[id] > 1);
            if (!filtroRepetidas || possuiRepetida) {
                section.appendChild(createCard(title, data.stickers, data.img));
                temConteudo = true;
            }
        } else {
            data.teams.forEach(t => {
                const list = Array.from({ length: 20 }, (_, i) => `${t.s}${i + 1}`);
                const possuiRepetida = list.some(id => owned[id] > 1);
                if (!filtroRepetidas || possuiRepetida) {
                    const flag = t.c === "scotland" ? "https://flagcdn.com/w80/gb-sct.png" : `https://flagcdn.com/w80/${t.c}.png`;
                    section.appendChild(createCard(t.n, list, flag));
                    temConteudo = true;
                }
            });
        }
        if (temConteudo) main.appendChild(section);
    }
    updateStats();
}

function configurarBotao(card, nome, sigla, listaFigurinhas) {
    if (filtroRepetidas) return; 

    const header = card.querySelector('.team-header');
    let btn = header.querySelector('.btn-completar-selecao');
    
    if (!btn) {
        btn = document.createElement('button');
        btn.className = 'btn-completar-selecao';
        btn.style = "margin-left: auto; border: none; padding: 6px 10px; border-radius: 6px; font-size: 0.6rem; font-weight: 900; z-index: 10; position: relative; cursor: pointer;";
        header.appendChild(btn);
    }

    const estaCompleta = listaFigurinhas.every(sid => owned[sid] > 0);

    if (estaCompleta) {
        btn.innerText = "COMPLETO ✓";
        btn.style.background = "#d32f2f"; btn.style.color = "white";
        btn.onclick = (e) => { e.stopPropagation(); };
    } else {
        btn.innerText = "COMPLETAR";
        btn.style.background = "#009739"; btn.style.color = "white";
        btn.onclick = (e) => { e.stopPropagation(); completarSelecao(nome, sigla); };
    }
}

function createCard(name, stickers, img) {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.innerHTML = `<div class="team-header"><img src="${img}" onerror="this.src='logo.png'"> <span>${name}</span></div>`;
    
    const body = document.createElement('div');
    body.className = 'team-body';
    if (filtroRepetidas) body.classList.add('active');

    const grid = document.createElement('div');
    grid.className = 'sticker-grid';

    stickers.forEach(sid => {
        if (filtroRepetidas && (owned[sid] || 0) <= 1) return;
        const s = document.createElement('div');
        s.id = `st-${sid}`;
        updateVisual(s, sid);
        
        let startX, startY, movendo = false, cliques = 0, timer;
        const acao = (e) => {
            if (e.type === 'touchend' && movendo) return;
            cliques++;
            if (cliques === 1) {
                timer = setTimeout(() => {
                    owned[sid] = (owned[sid] || 0) + 1;
                    saveData(s, sid);
                    cliques = 0;
                }, 250);
            } else {
                clearTimeout(timer);
                if (owned[sid] > 0) {
                    owned[sid]--;
                    if (owned[sid] === 0) delete owned[sid];
                    saveData(s, sid);
                }
                cliques = 0;
            }
        };
        s.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; movendo = false; }, { passive: true });
        s.addEventListener('touchmove', (e) => { if (Math.abs(e.touches[0].clientX - startX) > 10 || Math.abs(e.touches[0].clientY - startY) > 10) movendo = true; }, { passive: true });
        s.addEventListener('touchend', acao);
        s.addEventListener('click', (e) => { if (e.pointerType === 'mouse') acao(e); });
        grid.appendChild(s);
    });

    body.appendChild(grid);
    card.appendChild(body);

    if (!filtroRepetidas) {
        let siglaParaBotao = "";
        const primeiroSticker = stickers[0];
        if (primeiroSticker.startsWith("FWC")) siglaParaBotao = "FWC";
        else if (primeiroSticker.startsWith("CC")) siglaParaBotao = "CC";
        else if (primeiroSticker === "00") siglaParaBotao = "especial";
        else siglaParaBotao = primeiroSticker.replace(/[0-9]/g, '');
        configurarBotao(card, name, siglaParaBotao, stickers);
    }

    card.querySelector('.team-header').onclick = (e) => { 
        if (!e.target.classList.contains('btn-completar-selecao')) { body.classList.toggle('active'); }
    };
    return card;
}

function compartilharNoZap() {
    const linkApp = "https://hgomesdev.github.io/Copa-do-mundo-Album/"; 
    let texto = "⚽ *MINHAS REPETIDAS - ÁLBUM 2026* ⚽\n\n";
    let encontrou = false;
    for (const [title, data] of Object.entries(albumData)) {
        let listaRep = [];
        if (data.stickers) {
            data.stickers.forEach(id => { if (owned[id] > 1) listaRep.push(`${id} (x${owned[id] - 1})`); });
        } else {
            data.teams.forEach(t => {
                const list = Array.from({ length: 20 }, (_, i) => `${t.s}${i + 1}`);
                list.forEach(id => { if (owned[id] > 1) listaRep.push(`${id} (x${owned[id] - 1})`); });
            });
        }
        if (listaRep.length > 0) { encontrou = true; texto += `*${title}:*\n${listaRep.join(", ")}\n\n`; }
    }
    if (!encontrou) { alert("Nenhuma repetida encontrada!"); return; }
    texto += "---------------------------\n";
    texto += "✅ *Marque suas figurinhas aqui também:* \n" + linkApp;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
}

// --- BOTÃO REPETIDAS (CORREÇÃO DE COR PERMANENTE) ---
document.getElementById('btn-repetidas').onclick = function() {
    filtroRepetidas = !filtroRepetidas;
    if (filtroRepetidas) {
        this.innerText = "VER TUDO";
        this.style.background = "#fedd00"; // Amarelo quando você está vendo as repetidas
        this.style.color = "#012169";
    } else {
        this.innerText = "REPETIDAS";
        this.style.background = "#e31a1a"; // VOLTA PARA VERMELHO (Igual ao carregar o site)
        this.style.color = "#ffffff";    // VOLTA PARA BRANCO
    }
    render();
};

function updateVisual(el, sid) {
    const count = owned[sid] || 0;
    el.className = `sticker ${count > 0 ? 'owned' : ''}`;
    el.innerHTML = `${sid}${count > 1 ? `<span class="badge-repeat">${count - 1}</span>` : ''}`;
}

function saveData(el, sid) {
    localStorage.setItem('album_2026_final', JSON.stringify(owned));
    updateVisual(el, sid);
    updateStats();
    if (filtroRepetidas) render();
    else {
        const card = el.closest('.team-card');
        const stickersNoCard = Array.from(card.querySelectorAll('.sticker')).map(s => s.id.replace('st-', ''));
        const nome = card.querySelector('.team-header span').innerText;
        let siglaParaBotao = "";
        const primeiro = stickersNoCard[0];
        if (primeiro.startsWith("FWC")) siglaParaBotao = "FWC";
        else if (primeiro.startsWith("CC")) siglaParaBotao = "CC";
        else if (primeiro === "00") siglaParaBotao = "especial";
        else siglaParaBotao = primeiro.replace(/[0-9]/g, '');
        configurarBotao(card, nome, siglaParaBotao, stickersNoCard);
    }
}

function updateStats() {
    const unique = Object.keys(owned).length;
    const percent = ((unique / 994) * 100).toFixed(1);
    if(document.getElementById('total-count')) document.getElementById('total-count').innerText = unique;
    if(document.getElementById('progress-percent')) document.getElementById('progress-percent').innerText = percent + "%";
    if(document.getElementById('bar')) document.getElementById('bar').style.width = percent + "%";
}

function completarSelecao(nome, sigla) {
    if (!confirm(`Marcar todas de ${nome}?`)) return;
    let lista = [];
    if (sigla === 'especial' || sigla === 'FWC' || sigla === 'CC') {
        for (let key in albumData) { if (key === nome) { lista = albumData[key].stickers; break; } }
    } else {
        lista = Array.from({ length: 20 }, (_, i) => `${sigla}${i + 1}`);
    }
    lista.forEach(sid => { if (!owned[sid]) owned[sid] = 1; });
    localStorage.setItem('album_2026_final', JSON.stringify(owned));
    render();
}

// --- BUSCA ---
document.getElementById('searchSticker').addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase().trim();
    document.querySelectorAll('.sticker').forEach(s => s.classList.remove('sticker-foco'));
    if (val.length >= 2) {
        const alvo = Array.from(document.querySelectorAll('.sticker')).find(s => s.id.replace('st-', '') === val);
        if (alvo) {
            alvo.closest('.team-body').classList.add('active');
            alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
            alvo.classList.add('sticker-foco');
        }
    }
});

window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; if (document.getElementById('btn-instalar')) document.getElementById('btn-instalar').style.display = 'block'; });
document.getElementById('btn-instalar').onclick = async () => { if (deferredPrompt) { deferredPrompt.prompt(); const { outcome } = await deferredPrompt.userChoice; if (outcome === 'accepted') document.getElementById('btn-instalar').style.display = 'none'; deferredPrompt = null; } };
window.addEventListener('DOMContentLoaded', () => { if(document.getElementById('current-year')) document.getElementById('current-year').innerText = new Date().getFullYear(); iniciarAnuncio(); render(); });
document.getElementById('copy-pix').onclick = () => { navigator.clipboard.writeText("18981427594").then(() => alert("PIX Copiado! 👊")); };
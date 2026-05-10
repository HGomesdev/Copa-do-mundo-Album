/* ALBUM DIGITAL 2026 - Versão Final Estabilizada
   Correção: Lógica de atraso para diferenciar clique simples de duplo
*/

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
    const imgAds = modal.querySelector('img');
    if (imgAds) {
        imgAds.onclick = () => {
            const msg = encodeURIComponent("Olá Hugo! Gostaria de anunciar no seu app de figurinhas. Como funciona?");
            window.open(`https://wa.me/5518981427594?text=${msg}`, "_blank");
        };
    }
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

// --- RENDER ---
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
            const temRep = data.stickers.some(id => owned[id] > 1);
            if (!filtroRepetidas || temRep) { section.appendChild(createCard(title, data.stickers, data.img)); temConteudo = true; }
        } else {
            data.teams.forEach(t => {
                const list = Array.from({ length: 20 }, (_, i) => `${t.s}${i + 1}`);
                const temRep = list.some(id => owned[id] > 1);
                if (!filtroRepetidas || temRep) {
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
        
        let clickTimer = null;

        // --- LÓGICA DE CLIQUE COM DELAY PARA DUPLO CLIQUE ---
        s.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (clickTimer === null) {
                // PRIMEIRO CLIQUE: Aguarda um pouco para ver se vem o segundo
                clickTimer = setTimeout(() => {
                    // Se o tempo passou e não houve segundo clique: ADICIONA
                    owned[sid] = (owned[sid] || 0) + 1;
                    saveData(s, sid);
                    clickTimer = null;
                }, 250); // 250ms é o tempo ideal para humanos
            } else {
                // SEGUNDO CLIQUE: Cancela a adição e REMOVE
                clearTimeout(clickTimer);
                clickTimer = null;
                if (owned[sid] > 0) {
                    owned[sid]--;
                    if (owned[sid] === 0) delete owned[sid];
                    saveData(s, sid);
                }
            }
        }, { passive: false });

        grid.appendChild(s);
    });

    body.appendChild(grid);
    card.appendChild(body);

    if (!filtroRepetidas) {
        let sigla = "";
        const ref = stickers[0];
        if (ref.startsWith("FWC")) sigla = "FWC";
        else if (ref.startsWith("CC")) sigla = "CC";
        else if (ref === "00") sigla = "especial";
        else sigla = ref.replace(/[0-9]/g, '');
        configurarBotao(card, name, sigla, stickers);
    }

    card.querySelector('.team-header').onclick = (e) => { 
        if (!e.target.classList.contains('btn-completar-selecao')) { body.classList.toggle('active'); }
    };
    return card;
}

function configurarBotao(card, nome, sigla, lista) {
    const header = card.querySelector('.team-header');
    let btn = header.querySelector('.btn-completar-selecao') || document.createElement('button');
    btn.className = 'btn-completar-selecao';
    btn.style = "margin-left: auto; border: none; padding: 6px 10px; border-radius: 6px; font-size: 0.6rem; font-weight: 900; cursor: pointer;";
    if (!header.querySelector('.btn-completar-selecao')) header.appendChild(btn);
    const completo = lista.every(sid => owned[sid] > 0);
    btn.innerText = completo ? "COMPLETO ✓" : "COMPLETAR";
    btn.style.background = completo ? "#d32f2f" : "#009739";
    btn.style.color = "white";
    btn.onclick = (e) => { e.stopPropagation(); if (!completo) completarSelecao(nome, sigla); };
}

function compartilharNoZap() {
    let texto = "⚽ *MINHAS REPETIDAS - ÁLBUM 2026* ⚽\n\n";
    let encontrou = false;
    for (const [title, data] of Object.entries(albumData)) {
        let aux = [];
        const ids = data.stickers || [].concat(...data.teams.map(t => Array.from({length:20}, (_,i)=>`${t.s}${i+1}`)));
        ids.forEach(id => { if (owned[id] > 1) aux.push(`${id} (x${owned[id]-1})`); });
        if (aux.length > 0) { encontrou = true; texto += `*${title}:*\n${aux.join(", ")}\n\n`; }
    }
    if (!encontrou) return alert("Sem repetidas!");
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto + "https://hgomesdev.github.io/Copa-do-mundo-Album/")}`, '_blank');
}

document.getElementById('btn-repetidas').onclick = function() {
    filtroRepetidas = !filtroRepetidas;
    this.innerText = filtroRepetidas ? "VER TUDO" : "REPETIDAS";
    this.style.background = filtroRepetidas ? "#fedd00" : "#e31a1a";
    this.style.color = filtroRepetidas ? "#012169" : "#ffffff";
    render();
};

function updateVisual(el, sid) {
    const n = owned[sid] || 0;
    el.className = `sticker ${n > 0 ? 'owned' : ''}`;
    el.innerHTML = `${sid}${n > 1 ? `<span class="badge-repeat">${n - 1}</span>` : ''}`;
}

function saveData(el, sid) {
    localStorage.setItem('album_2026_final', JSON.stringify(owned));
    updateVisual(el, sid);
    updateStats();
    if (filtroRepetidas) render();
}

function updateStats() {
    const total = Object.keys(owned).length;
    const perc = ((total / 994) * 100).toFixed(1);
    if(document.getElementById('total-count')) document.getElementById('total-count').innerText = total;
    if(document.getElementById('progress-percent')) document.getElementById('progress-percent').innerText = perc + "%";
    if(document.getElementById('bar')) document.getElementById('bar').style.width = perc + "%";
}

function completarSelecao(nome, sigla) {
    if (!confirm(`Marcar todas de ${nome}?`)) return;
    let lista = [];
    if (['especial', 'FWC', 'CC'].includes(sigla)) { lista = albumData[nome].stickers; } 
    else { lista = Array.from({ length: 20 }, (_, i) => `${sigla}${i + 1}`); }
    lista.forEach(id => { if (!owned[id]) owned[id] = 1; });
    localStorage.setItem('album_2026_final', JSON.stringify(owned));
    render();
}

document.getElementById('searchSticker').addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase().trim();
    if (val.length >= 2) {
        const alvo = Array.from(document.querySelectorAll('.sticker')).find(s => s.id === `st-${val}`);
        if (alvo) {
            alvo.closest('.team-body').classList.add('active');
            alvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
            alvo.classList.add('sticker-foco');
            setTimeout(() => alvo.classList.remove('sticker-foco'), 3000);
        }
    }
});

document.getElementById('copy-pix').onclick = () => { navigator.clipboard.writeText("18981427594").then(() => alert("PIX Copiado!")); };
window.addEventListener('DOMContentLoaded', () => { if(document.getElementById('current-year')) document.getElementById('current-year').innerText = new Date().getFullYear(); iniciarAnuncio(); render(); });

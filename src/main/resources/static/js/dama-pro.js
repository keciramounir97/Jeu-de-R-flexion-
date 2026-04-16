const damaBoard = document.getElementById("damaBoard");
const damaStatus = document.getElementById("damaStatus");
const damaReset = document.getElementById("damaReset");
const damaScoreInput = document.getElementById("damaScoreInput");
const damaStateData = document.getElementById("damaStateData");
const motionApi = window.motion;

let selectedDama = null;
let turnDama = "r";
let damaState = [];
let capturesR = 0;
let capturesB = 0;

function syncDamaSaveFields() {
    if (damaScoreInput) damaScoreInput.value = String((capturesR * 20) + (turnDama === "r" ? 8 : 4));
    if (damaStateData) {
        damaStateData.value = JSON.stringify({
            turn: turnDama,
            capturesR,
            capturesB,
            board: damaState
        });
    }
}

function countPieces(color) {
    let n = 0;
    for (let r = 0; r < 8; r += 1) for (let c = 0; c < 8; c += 1) if (damaState[r][c] === color) n += 1;
    return n;
}

function hasAnyCapture(color) {
    const forward = color === "r" ? -1 : 1;
    for (let r = 0; r < 8; r += 1) {
        for (let c = 0; c < 8; c += 1) {
            if (damaState[r][c] !== color) continue;
            for (const dc of [-2, 2]) {
                const tr = r + (2 * forward);
                const tc = c + dc;
                const mr = r + forward;
                const mc = c + (dc / 2);
                if (tr < 0 || tr > 7 || tc < 0 || tc > 7) continue;
                const middle = damaState[mr][mc];
                if (!damaState[tr][tc] && middle && middle !== color) return true;
            }
        }
    }
    return false;
}

function initDama() {
    damaState = Array.from({ length: 8 }, () => Array(8).fill(""));
    for (let r = 0; r < 3; r += 1) {
        for (let c = 0; c < 8; c += 1) if ((r + c) % 2 === 1) damaState[r][c] = "b";
    }
    for (let r = 5; r < 8; r += 1) {
        for (let c = 0; c < 8; c += 1) if ((r + c) % 2 === 1) damaState[r][c] = "r";
    }
    selectedDama = null;
    turnDama = "r";
    capturesR = 0;
    capturesB = 0;
    damaStatus.textContent = "Tour: Rouge";
    syncDamaSaveFields();
    renderDama();
}

function renderDama() {
    if (!damaBoard) return;
    damaBoard.innerHTML = "";
    for (let r = 0; r < 8; r += 1) {
        for (let c = 0; c < 8; c += 1) {
            const cell = document.createElement("button");
            cell.type = "button";
            cell.className = `dama-cell ${(r + c) % 2 === 0 ? "light" : "dark"}`;
            if (selectedDama && selectedDama[0] === r && selectedDama[1] === c) cell.classList.add("selected");
            const piece = damaState[r][c];
            if (piece) {
                const dot = document.createElement("span");
                dot.className = `dama-piece ${piece === "r" ? "red" : "black"}`;
                cell.appendChild(dot);
                if (motionApi?.animate) motionApi.animate(dot, { scale: [0.85, 1] }, { duration: 0.2, easing: "ease-out" });
            }
            cell.addEventListener("click", () => onDamaClick(r, c));
            damaBoard.appendChild(cell);
        }
    }
}

function onDamaClick(r, c) {
    const piece = damaState[r][c];
    if (!selectedDama) {
        if (piece === turnDama) {
            selectedDama = [r, c];
            renderDama();
        }
        return;
    }
    const [sr, sc] = selectedDama;
    const dr = r - sr;
    const dc = Math.abs(c - sc);
    const forward = turnDama === "r" ? -1 : 1;
    const captureRequired = hasAnyCapture(turnDama);
    if (!captureRequired && dc === 1 && dr === forward && !damaState[r][c] && (r + c) % 2 === 1) {
        damaState[r][c] = turnDama;
        damaState[sr][sc] = "";
        turnDama = turnDama === "r" ? "b" : "r";
        damaStatus.textContent = `Tour: ${turnDama === "r" ? "Rouge" : "Noir"}`;
    } else if (dc === 2 && dr === (2 * forward) && !damaState[r][c] && (r + c) % 2 === 1) {
        const mr = (sr + r) / 2;
        const mc = (sc + c) / 2;
        const middle = damaState[mr][mc];
        if (middle && middle !== turnDama) {
            damaState[r][c] = turnDama;
            damaState[sr][sc] = "";
            damaState[mr][mc] = "";
            if (turnDama === "r") capturesR += 1;
            else capturesB += 1;
            turnDama = turnDama === "r" ? "b" : "r";
            damaStatus.textContent = `Capture réussie. Tour: ${turnDama === "r" ? "Rouge" : "Noir"}`;
        }
    } else if (captureRequired) {
        damaStatus.textContent = "Capture obligatoire !";
    }
    selectedDama = null;
    const reds = countPieces("r");
    const blacks = countPieces("b");
    if (!reds || !blacks) damaStatus.textContent = `Partie terminée: ${reds ? "Rouge" : "Noir"} gagne.`;
    syncDamaSaveFields();
    renderDama();
}

damaReset?.addEventListener("click", initDama);
initDama();

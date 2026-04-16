const grid2048 = document.getElementById("grid2048");
const scoreDisplay = document.getElementById("scoreDisplay");
const status2048 = document.getElementById("status2048");
const new2048Btn = document.getElementById("new2048");
const saveScoreInput = document.getElementById("saveScore2048");
const state2048Input = document.getElementById("state2048");
const motionApi = window.motion;

let board2048 = [];
let score2048 = 0;

function createBoard2048() {
    board2048 = Array.from({ length: 4 }, () => Array(4).fill(0));
    score2048 = 0;
    addRandomTile();
    addRandomTile();
    render2048();
}

function addRandomTile() {
    const empty = [];
    for (let r = 0; r < 4; r += 1) {
        for (let c = 0; c < 4; c += 1) {
            if (board2048[r][c] === 0) empty.push([r, c]);
        }
    }
    if (!empty.length) return;
    const [row, col] = empty[Math.floor(Math.random() * empty.length)];
    board2048[row][col] = Math.random() < 0.9 ? 2 : 4;
}

function colorForValue(v) {
    const colors = {
        0: "#0d1733", 2: "#1f3a8a", 4: "#2563eb", 8: "#0ea5e9",
        16: "#14b8a6", 32: "#22c55e", 64: "#84cc16", 128: "#f59e0b",
        256: "#f97316", 512: "#ef4444", 1024: "#d946ef", 2048: "#fde047"
    };
    return colors[v] || "#fafafa";
}

function render2048() {
    grid2048.innerHTML = "";
    for (let r = 0; r < 4; r += 1) {
        for (let c = 0; c < 4; c += 1) {
            const tile = document.createElement("div");
            const value = board2048[r][c];
            tile.className = "tile-2048";
            tile.textContent = value === 0 ? "" : String(value);
            tile.style.background = colorForValue(value);
            tile.style.color = value >= 128 ? "#111827" : "#f8fafc";
            grid2048.appendChild(tile);
            if (motionApi?.animate && value !== 0) {
                motionApi.animate(tile, { scale: [0.8, 1], rotate: [-2, 0] }, { duration: 0.22, easing: "ease-out" });
            }
        }
    }
    scoreDisplay.textContent = `Score: ${score2048}`;
    if (saveScoreInput) saveScoreInput.value = String(score2048);
    if (state2048Input) {
        state2048Input.value = JSON.stringify({
            score: score2048,
            board: board2048
        });
    }
}

function hasMovesAvailable() {
    if (board2048.flat().includes(0)) return true;
    for (let r = 0; r < 4; r += 1) {
        for (let c = 0; c < 4; c += 1) {
            const v = board2048[r][c];
            if ((r < 3 && board2048[r + 1][c] === v) || (c < 3 && board2048[r][c + 1] === v)) return true;
        }
    }
    return false;
}

function compactRow(row) {
    const items = row.filter((n) => n !== 0);
    for (let i = 0; i < items.length - 1; i += 1) {
        if (items[i] === items[i + 1]) {
            items[i] *= 2;
            score2048 += items[i];
            items[i + 1] = 0;
        }
    }
    return items.filter((n) => n !== 0).concat(Array(4 - items.filter((n) => n !== 0).length).fill(0));
}

function moveLeft() {
    const old = JSON.stringify(board2048);
    board2048 = board2048.map((row) => compactRow(row));
    return old !== JSON.stringify(board2048);
}

function rotateRight(board) {
    const n = board.length;
    const out = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) out[c][n - 1 - r] = board[r][c];
    return out;
}

function applyMove(direction) {
    let moved = false;
    if (direction === "ArrowLeft") moved = moveLeft();
    if (direction === "ArrowRight") {
        board2048 = board2048.map((row) => [...row].reverse());
        moved = moveLeft();
        board2048 = board2048.map((row) => [...row].reverse());
    }
    if (direction === "ArrowUp") {
        board2048 = rotateRight(board2048);
        moved = moveLeft();
        board2048 = rotateRight(rotateRight(rotateRight(board2048)));
    }
    if (direction === "ArrowDown") {
        board2048 = rotateRight(rotateRight(rotateRight(board2048)));
        moved = moveLeft();
        board2048 = rotateRight(board2048);
    }
    if (moved) {
        addRandomTile();
        render2048();
        if (board2048.flat().includes(2048)) status2048.textContent = "Bravo, tu as atteint 2048 !";
        else if (!hasMovesAvailable()) status2048.textContent = "Partie terminée. Appuie sur Nouvelle partie.";
    } else if (!hasMovesAvailable()) {
        status2048.textContent = "Aucun coup possible: partie terminée.";
    }
}

document.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    applyMove(e.key);
});

let touchStart = null;
grid2048?.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    touchStart = { x: t.clientX, y: t.clientY };
}, { passive: true });

grid2048?.addEventListener("touchend", (e) => {
    if (!touchStart) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    if (Math.abs(dx) < 25 && Math.abs(dy) < 25) return;
    if (Math.abs(dx) > Math.abs(dy)) applyMove(dx > 0 ? "ArrowRight" : "ArrowLeft");
    else applyMove(dy > 0 ? "ArrowDown" : "ArrowUp");
    touchStart = null;
}, { passive: true });

new2048Btn?.addEventListener("click", createBoard2048);
createBoard2048();

const boardElement = document.getElementById("chessBoard");
const moveListElement = document.getElementById("moveList");
const statusLabel = document.getElementById("statusLabel");
const turnLabel = document.getElementById("turnLabel");
const timerElement = document.getElementById("timer");
const whiteCaptureElement = document.getElementById("capturedByWhite");
const blackCaptureElement = document.getElementById("capturedByBlack");
const resetBtn = document.getElementById("resetBtn");
const newGameBtn = document.getElementById("newGameBtn");
const chessScoreInput = document.getElementById("scoreInput");
const chessStateData = document.getElementById("chessStateData");
const motionApi = window.motion;

const pieceIcons = {
    w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
    b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" }
};

const initialBoard = [
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
];

let board = [];
let selected = null;
let legalMoves = [];
let turn = "w";
let moveHistory = [];
let capturedByWhite = [];
let capturedByBlack = [];
let elapsed = 0;
let timerRef = null;
let gameEnded = false;

function cloneBoardState() {
    return initialBoard.map((row) => [...row]);
}

function squareName(r, c) {
    const file = String.fromCharCode("a".charCodeAt(0) + c);
    const rank = 8 - r;
    return `${file}${rank}`;
}

function isInside(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function pieceColor(piece) {
    return piece ? piece.charAt(0) : "";
}

function pieceType(piece) {
    return piece ? piece.charAt(1) : "";
}

function formatPiece(piece) {
    if (!piece) return "";
    return pieceIcons[pieceColor(piece)][pieceType(piece)] || "";
}

function addRayMoves(moves, r, c, dr, dc, color) {
    let nr = r + dr;
    let nc = c + dc;
    while (isInside(nr, nc)) {
        const target = board[nr][nc];
        if (!target) {
            moves.push([nr, nc]);
        } else {
            if (pieceColor(target) !== color) moves.push([nr, nc]);
            break;
        }
        nr += dr;
        nc += dc;
    }
}

function getLegalMoves(r, c) {
    const piece = board[r][c];
    if (!piece) return [];
    const color = pieceColor(piece);
    const type = pieceType(piece);
    const moves = [];
    const dir = color === "w" ? -1 : 1;

    if (type === "p") {
        const oneStep = r + dir;
        if (isInside(oneStep, c) && !board[oneStep][c]) moves.push([oneStep, c]);
        const startRow = color === "w" ? 6 : 1;
        const twoStep = r + (2 * dir);
        if (r === startRow && !board[oneStep][c] && isInside(twoStep, c) && !board[twoStep][c]) {
            moves.push([twoStep, c]);
        }
        [[dir, -1], [dir, 1]].forEach(([dr, dc]) => {
            const nr = r + dr;
            const nc = c + dc;
            if (isInside(nr, nc) && board[nr][nc] && pieceColor(board[nr][nc]) !== color) {
                moves.push([nr, nc]);
            }
        });
    }

    if (type === "n") {
        [[-2, -1], [-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [-1, -2], [1, -2]].forEach(([dr, dc]) => {
            const nr = r + dr;
            const nc = c + dc;
            if (!isInside(nr, nc)) return;
            const target = board[nr][nc];
            if (!target || pieceColor(target) !== color) moves.push([nr, nc]);
        });
    }

    if (type === "b" || type === "q") {
        addRayMoves(moves, r, c, -1, -1, color);
        addRayMoves(moves, r, c, -1, 1, color);
        addRayMoves(moves, r, c, 1, -1, color);
        addRayMoves(moves, r, c, 1, 1, color);
    }

    if (type === "r" || type === "q") {
        addRayMoves(moves, r, c, -1, 0, color);
        addRayMoves(moves, r, c, 1, 0, color);
        addRayMoves(moves, r, c, 0, -1, color);
        addRayMoves(moves, r, c, 0, 1, color);
    }

    if (type === "k") {
        for (let dr = -1; dr <= 1; dr += 1) {
            for (let dc = -1; dc <= 1; dc += 1) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr;
                const nc = c + dc;
                if (!isInside(nr, nc)) continue;
                const target = board[nr][nc];
                if (!target || pieceColor(target) !== color) moves.push([nr, nc]);
            }
        }
    }

    return moves;
}

function refreshSidePanel() {
    moveListElement.innerHTML = "";
    moveHistory.slice(-60).forEach((move) => {
        const li = document.createElement("li");
        li.textContent = move;
        moveListElement.appendChild(li);
    });
    whiteCaptureElement.textContent = capturedByWhite.length ? capturedByWhite.join(" ") : "Aucune";
    blackCaptureElement.textContent = capturedByBlack.length ? capturedByBlack.join(" ") : "Aucune";
    turnLabel.textContent = `Tour: ${turn === "w" ? "Blanc" : "Noir"}`;
    const score = (capturedByWhite.length * 12) + Math.max(0, 200 - elapsed) + (moveHistory.length * 2);
    if (chessScoreInput) chessScoreInput.value = String(score);
    if (chessStateData) {
        chessStateData.value = JSON.stringify({
            turn,
            elapsed,
            capturesWhite: capturedByWhite.length,
            capturesBlack: capturedByBlack.length,
            moves: moveHistory.length
        });
    }
}

function renderBoard() {
    boardElement.innerHTML = "";
    for (let r = 0; r < 8; r += 1) {
        for (let c = 0; c < 8; c += 1) {
            const square = document.createElement("button");
            square.type = "button";
            square.className = `square ${(r + c) % 2 === 0 ? "light" : "dark"}`;
            square.dataset.row = String(r);
            square.dataset.col = String(c);
            square.textContent = formatPiece(board[r][c]);
            if (selected && selected[0] === r && selected[1] === c) square.classList.add("selected");
            if (legalMoves.some(([lr, lc]) => lr === r && lc === c)) square.classList.add("legal");
            square.addEventListener("click", () => onSquareClick(r, c));
            boardElement.appendChild(square);
            if (motionApi?.animate) {
                motionApi.animate(square, { opacity: [0.2, 1], scale: [0.9, 1] }, { duration: 0.18, easing: "ease-out" });
            }
        }
    }
}

function onSquareClick(r, c) {
    if (gameEnded) return;
    const clickedPiece = board[r][c];
    if (selected) {
        const isLegalTarget = legalMoves.some(([lr, lc]) => lr === r && lc === c);
        if (isLegalTarget) {
            moveSelectedPiece(r, c);
            return;
        }
    }

    if (!clickedPiece) {
        statusLabel.textContent = "Choisis une piece de la couleur active.";
        return;
    }

    if (pieceColor(clickedPiece) !== turn) {
        statusLabel.textContent = "Ce n'est pas le tour de cette couleur.";
        return;
    }

    selected = [r, c];
    legalMoves = getLegalMoves(r, c);
    statusLabel.textContent = `Piece selectionnee: ${squareName(r, c)} (${legalMoves.length} coups possibles)`;
    renderBoard();
}

function moveSelectedPiece(targetR, targetC) {
    if (!selected) return;
    const [fromR, fromC] = selected;
    const movingPiece = board[fromR][fromC];
    const targetPiece = board[targetR][targetC];

    if (targetPiece) {
        const icon = formatPiece(targetPiece);
        if (turn === "w") capturedByWhite.push(icon);
        else capturedByBlack.push(icon);
        if (pieceType(targetPiece) === "k") {
            gameEnded = true;
            statusLabel.textContent = `Partie terminée: Roi ${turn === "w" ? "Noir" : "Blanc"} capturé.`;
            clearInterval(timerRef);
        }
    }

    board[targetR][targetC] = movingPiece;
    board[fromR][fromC] = "";

    const moveText = `${turn === "w" ? "Blanc" : "Noir"}: ${squareName(fromR, fromC)} -> ${squareName(targetR, targetC)}`;
    moveHistory.push(moveText);

    selected = null;
    legalMoves = [];
    if (!gameEnded) {
        turn = turn === "w" ? "b" : "w";
        statusLabel.textContent = `Dernier coup: ${moveText}`;
    }

    refreshSidePanel();
    renderBoard();
    if (motionApi?.animate) motionApi.animate("#statusLabel", { x: [-8, 0], opacity: [0.5, 1] }, { duration: 0.2 });
}

function startTimer() {
    if (timerRef) clearInterval(timerRef);
    timerRef = setInterval(() => {
        elapsed += 1;
        const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const seconds = String(elapsed % 60).padStart(2, "0");
        timerElement.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

function initializeGame() {
    board = cloneBoardState();
    selected = null;
    legalMoves = [];
    turn = "w";
    moveHistory = [];
    capturedByWhite = [];
    capturedByBlack = [];
    elapsed = 0;
    gameEnded = false;
    timerElement.textContent = "00:00";
    statusLabel.textContent = "Selectionne une piece pour commencer.";
    refreshSidePanel();
    renderBoard();
    startTimer();
}

resetBtn?.addEventListener("click", initializeGame);
newGameBtn?.addEventListener("click", initializeGame);

initializeGame();

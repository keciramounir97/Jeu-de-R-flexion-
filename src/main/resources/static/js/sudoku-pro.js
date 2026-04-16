const sudokuGrid = document.getElementById("sudokuGrid");
const sudokuStatus = document.getElementById("sudokuStatus");
const checkSudokuBtn = document.getElementById("checkSudoku");
const sudokuScoreInput = document.getElementById("sudokuScoreInput");
const sudokuStateData = document.getElementById("sudokuStateData");
const motionApi = window.motion;

const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

function drawSudoku() {
    if (!sudokuGrid) return;
    sudokuGrid.innerHTML = "";
    for (let r = 0; r < 9; r += 1) {
        for (let c = 0; c < 9; c += 1) {
            const input = document.createElement("input");
            input.type = "number";
            input.min = "1";
            input.max = "9";
            input.className = "sudoku-cell";
            input.dataset.row = String(r);
            input.dataset.col = String(c);
            if (puzzle[r][c] !== 0) {
                input.value = String(puzzle[r][c]);
                input.readOnly = true;
                input.classList.add("fixed");
            }
            input.addEventListener("input", () => {
                if (!input.value) {
                    input.style.background = "#fff8f1";
                    return;
                }
                const value = Number(input.value);
                input.style.background = value >= 1 && value <= 9 ? "#ecfff1" : "#ffe9ec";
            });
            sudokuGrid.appendChild(input);
        }
    }
}

function readBoard() {
    const values = Array.from({ length: 9 }, () => Array(9).fill(0));
    document.querySelectorAll(".sudoku-cell").forEach((cell) => {
        const r = Number(cell.dataset.row);
        const c = Number(cell.dataset.col);
        values[r][c] = Number(cell.value || "0");
    });
    return values;
}

function countFilled(board) {
    return board.flat().filter((v) => v !== 0).length;
}

function syncSudokuSave(board) {
    const filled = countFilled(board);
    if (sudokuScoreInput) sudokuScoreInput.value = String(filled);
    if (sudokuStateData) sudokuStateData.value = JSON.stringify({ filled, board });
}

function isGroupValid(values) {
    const nums = values.filter((v) => v !== 0);
    return new Set(nums).size === nums.length;
}

function validateSudoku(board) {
    for (let i = 0; i < 9; i += 1) {
        const row = board[i];
        const col = board.map((r) => r[i]);
        if (!isGroupValid(row) || !isGroupValid(col)) return false;
    }
    for (let sr = 0; sr < 9; sr += 3) {
        for (let sc = 0; sc < 9; sc += 3) {
            const box = [];
            for (let r = sr; r < sr + 3; r += 1) for (let c = sc; c < sc + 3; c += 1) box.push(board[r][c]);
            if (!isGroupValid(box)) return false;
        }
    }
    return true;
}

checkSudokuBtn?.addEventListener("click", () => {
    const board = readBoard();
    const valid = validateSudoku(board);
    const complete = countFilled(board) === 81;
    sudokuStatus.textContent = valid
        ? (complete ? "Sudoku complet et valide. Excellent !" : "Structure valide pour le moment. Continue !")
        : "Conflit detecte dans une ligne, colonne ou bloc 3x3.";
    syncSudokuSave(board);
    if (motionApi?.animate) motionApi.animate("#sudokuStatus", { scale: [0.96, 1], opacity: [0.6, 1] }, { duration: 0.2 });
});

drawSudoku();
syncSudokuSave(readBoard());

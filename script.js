document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("playButton");
    playButton.addEventListener("click", startGame);

    function startGame() {
        const gameContainer = document.createElement("div");
        gameContainer.id = "gameContainer";
        gameContainer.innerHTML = `
            <div class="menu">
                <label for="sizeSelector">Select Puzzle Size:</label>
                <select id="sizeSelector">
                    <option value="3">3x3</option>
                    <option value="4" selected>4x4</option>
                    <option value="5">5x5</option>
                </select>
                <button id="startButton">Start Game</button>
                <div id="status">
                    <span id="moveCounter">Moves: 0</span>
                    <span id="timer">Time: 00:00</span>
                </div>
            </div>
            <div id="puzzleGrid"></div>
        `;

        document.body.appendChild(gameContainer);

        const startButton = document.getElementById("startButton");
        const sizeSelector = document.getElementById("sizeSelector");
        const puzzleGrid = document.getElementById("puzzleGrid");
        const moveCounter = document.getElementById("moveCounter");
        const timerLabel = document.getElementById("timer");

        let puzzleSize;
        let puzzle;
        let buttons;
        let moveCount;
        let timer;
        let startTime;

        startButton.addEventListener("click", () => {
            puzzleSize = parseInt(sizeSelector.value);
            puzzleGrid.style.gridTemplateColumns = `repeat(${puzzleSize}, 1fr)`;
            puzzleGrid.innerHTML = "";

            buttons = [];
            puzzle = Array.from({ length: puzzleSize * puzzleSize - 1 }, (_, i) => i + 1).concat(0);

            shufflePuzzle();
            moveCount = 0;
            moveCounter.textContent = `Moves: ${moveCount}`;
            if (timer) clearInterval(timer);
            startTime = Date.now();
            timer = setInterval(updateTimer, 1000);

            puzzle.forEach((num, index) => {
                const button = document.createElement("div");
                button.classList.add("puzzle-button");
                button.textContent = num === 0 ? "" : num;
                button.addEventListener("click", () => moveTile(index));
                puzzleGrid.appendChild(button);
                buttons.push(button);
            });

            updateTileColors();
        });

        function shufflePuzzle() {
            for (let i = puzzle.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [puzzle[i], puzzle[j]] = [puzzle[j], puzzle[i]];
            }
        }

        function moveTile(index) {
            const emptyIndex = puzzle.indexOf(0);
            const [emptyRow, emptyCol] = [Math.floor(emptyIndex / puzzleSize), emptyIndex % puzzleSize];
            const [tileRow, tileCol] = [Math.floor(index / puzzleSize), index % puzzleSize];

            if (Math.abs(emptyRow - tileRow) + Math.abs(emptyCol - tileCol) === 1) {
                [puzzle[emptyIndex], puzzle[index]] = [puzzle[index], puzzle[emptyIndex]];
                buttons[emptyIndex].textContent = buttons[index].textContent;
                buttons[index].textContent = "";
                moveCount++;
                moveCounter.textContent = `Moves: ${moveCount}`;
                updateTileColors();
                if (isPuzzleSolved()) {
                    clearInterval(timer);
                    buttons.forEach(button => button.style.backgroundColor = "gold");
                    alert("Congratulations! You solved the puzzle!");
                }
            }
        }

        function updateTileColors() {
            puzzle.forEach((num, index) => {
                if (num !== 0 && num === index + 1) {
                    buttons[index].style.backgroundColor = "lightgreen";
                } else {
                    buttons[index].style.backgroundColor = "white";
                }
            });
        }

        function updateTimer() {
            const elapsedTime = Date.now() - startTime;
            const minutes = Math.floor(elapsedTime / 60000);
            const seconds = Math.floor((elapsedTime % 60000) / 1000);
            timerLabel.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        function isPuzzleSolved() {
            return puzzle.slice(0, -1).every((num, i) => num === i + 1);
        }
    }
});

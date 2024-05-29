let size, puzzle, timer, moveCounter, time, moves, interval;

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSection(anchor.getAttribute('href').substring(1));
        });
    });
    toggleSection('about'); // Automatically open the About section on load
});

function openSlidingPuzzle() {
    document.getElementById('popup').style.display = 'block';
}

function closeSlidingPuzzle() {
    document.getElementById('popup').style.display = 'none';
    clearInterval(interval); // Stop the timer when the popup is closed
}

function startGame() {
    size = parseInt(document.getElementById('size').value);
    puzzle = generatePuzzle(size);
    time = 0;
    moves = 0;
    updateTimerDisplay();
    document.getElementById('moveCounter').textContent = moves;
    document.getElementById('congratulationsMessage').style.display = 'none';
    clearInterval(interval);
    interval = setInterval(() => {
        time++;
        updateTimerDisplay();
    }, 1000);
    renderPuzzle();
}

function updateTimerDisplay() {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${hours}:${minutes}:${seconds}`;
}

function generatePuzzle(size) {
    const tiles = Array.from({ length: size * size }, (_, i) => i + 1);
    tiles[size * size - 1] = 0; // Blank tile
    do {
        shuffleArray(tiles);
    } while (!isSolvable(tiles) || isSolved(tiles));
    return tiles;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function isSolvable(tiles) {
    let inversions = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
            if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) {
                inversions++;
            }
        }
    }
    const blankRow = Math.floor(tiles.indexOf(0) / size);
    return (size % 2 === 1 && inversions % 2 === 0) || (size % 2 === 0 && (inversions + blankRow) % 2 === 1);
}

function isSolved(tiles) {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] !== i + 1) return false;
    }
    return true;
}

function renderPuzzle() {
    const container = document.getElementById('puzzleContainer');
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    container.innerHTML = '';
    puzzle.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        if (tile === 0) {
            tileElement.style.visibility = 'hidden';
        } else {
            tileElement.textContent = tile;
            tileElement.addEventListener('click', () => moveTile(index));
        }
        if (tile === index + 1) {
            tileElement.classList.add('correct');
        }
        container.appendChild(tileElement);
    });
}

function moveTile(index) {
    const blankIndex = puzzle.indexOf(0);
    const validMoves = [blankIndex - size, blankIndex + size];
    if (blankIndex % size !== 0) validMoves.push(blankIndex - 1);
    if (blankIndex % size !== size - 1) validMoves.push(blankIndex + 1);
    if (validMoves.includes(index)) {
        [puzzle[blankIndex], puzzle[index]] = [puzzle[index], puzzle[blankIndex]];
        moves++;
        document.getElementById('moveCounter').textContent = moves;
        renderPuzzle();
        checkWin();
    }
}

function checkWin() {
    if (isSolved(puzzle)) {
        clearInterval(interval);
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => tile.classList.add('finished'));
        document.getElementById('congratulationsMessage').style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.dropdown-btn').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-target');
            toggleDropdown(projectId);
        });
    });

    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSection(anchor.getAttribute('href').substring(1));
        });
    });
    toggleSection('about'); // Automatically open the About section on load
});

function toggleDropdown(projectId) {
    const container = document.getElementById(projectId);
    if (container) {
        container.classList.toggle('hidden');
    } else {
        console.error('Project container not found:', projectId);
    }
}

function toggleSection(sectionId) {
    var sections = document.querySelectorAll('.container section');
    sections.forEach(function(section) {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

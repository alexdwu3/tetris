document.addEventListener('DOMContentLoaded', () => {
    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 20;
    const GRID_SIZE = GRID_HEIGHT * GRID_WIDTH;
    const FALL_SPEED = 700; // time to fall one row in ms;
    let fall = null; // set to null when stuff is not falling, use setInterval 
    let started = false; // has the game started 
    let lastDownPress; // stores last time it was pressed
    let score = 0;
    let level = 1;
    let scoreElement = document.querySelector('.score');
    let levelElement = document.querySelector('.level');
    let linesCleared = 0;


    const grid = createGrid();

    // add GRID_SIZE boxes to grid
    function createGrid() {
        const grid = document.querySelector('.grid')

        for(let i = 0; i < GRID_SIZE; i++) {
            const cell = document.createElement('div');
            grid.appendChild(cell);
        }

        // illegal base layer of cells (to prevent cells from going under the board)
        for(let i = 0; i < GRID_WIDTH; i++) {
            const illegalCell = document.createElement('div');
            illegalCell.classList.add('illegal')
            grid.appendChild(illegalCell);
        }
        return grid;
        
    }

    let cells = Array.from(grid.querySelectorAll('div')); // assign div boxes to an array (cells)
    const startButton = document.querySelector('#start-button');


    const colors = [
        'url(cellStyles/blue_cell.png)',
        'url(cellStyles/navy_cell.png)',
        'url(cellStyles/peach_cell.png)',
        'url(cellStyles/yellow_cell.png)',
        'url(cellStyles/green_cell.png)',
        'url(cellStyles/purple_cell.png)',
        'url(cellStyles/pink_cell.png)',
    ]
    
    // the following piece configurations have 4 numbers representing the 4 boxes in array "cells"
    // that we want to style so that they represent the correct tetris piece
    // piece configurations: see https://static.wikia.nocookie.net/tetrisconcept/images/3/3d/SRS-pieces.png/revision/latest/scale-to-width-down/336?cb=20060626173148
    const barPiece = [
        [GRID_WIDTH + 0, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
        [2, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2, GRID_WIDTH * 3 + 2],
        [GRID_WIDTH * 2 + 0, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2, GRID_WIDTH * 2 + 3],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1]
    ];

    const blueLPiece = [
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, 2, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    ];

    const orangeLPiece = [
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
        [GRID_WIDTH * 2, GRID_WIDTH * 1, GRID_WIDTH * 1 + 1, GRID_WIDTH * 1 + 2],
        [0, 1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    ];

    const boxPiece = [
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    ];

    const greenZPiece = [
        [GRID_WIDTH, GRID_WIDTH + 1, 1, 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    ];

    const redZPiece = [
        [0, 1, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [GRID_WIDTH * 2 + 1, GRID_WIDTH + 1, GRID_WIDTH + 2, 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
        [GRID_WIDTH * 2, GRID_WIDTH, GRID_WIDTH + 1, 1],
    ];

    const tPiece = [
        [GRID_WIDTH, GRID_WIDTH + 1, 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH + 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH + 2],
        [GRID_WIDTH, GRID_WIDTH + 1, 1, GRID_WIDTH * 2 + 1]
    ];

    // pieces stores 7 piece configs, each piece config has 
    const pieces = [barPiece, blueLPiece, orangeLPiece, boxPiece, greenZPiece, redZPiece, tPiece];

    let currentPosition = 3; // set position of piece to 3rd column

    let rand = Math.floor(Math.random() * pieces.length); // picks random piece
    let currentRotation = 0; // set piece to first rotation position
    let currentPiece = pieces[rand][currentRotation];
    let currentColor = colors[rand]; // color of current piece


    // draw the piece by giving each of the 4 cells that the piece occupies the "piece" class, which
    // gives them the appropriate styling to indicate that it is a tetris piece
    function drawPiece() {
        currentPiece.forEach(i => {
            cells[currentPosition + i].style.backgroundImage = currentColor;
        });
    }

    // erase piece by removing style from all of the cells 
    function erasePiece() {
        currentPiece.forEach(i => {
            cells[currentPosition + i].style.backgroundImage = 'none';
        });
    }

    function movePieceDown() { // redraw piece one row down
        erasePiece();
        currentPosition += GRID_WIDTH; // move position down by a row
        drawPiece();
        checkPiece();
    }

    function dropPiece() {
        // don't want to accidentally hit space twice if someone just taps the space bar
        if (lastDownPress && (Date.now() - lastDownPress < 30)) {
            return;
        }

        while(!currentPiece.some(i => cells[currentPosition + i + GRID_WIDTH].classList.contains('illegal'))) {
            // state: none of the cells in the current piece are illegal (frozen or not on board)
            erasePiece();
            currentPosition += GRID_WIDTH; // move position down by a row
            drawPiece();
            // need to check piece
        }
        checkPiece();

        lastDownPress = Date.now();
        // CALL CHECKPIECE WITH A DIFFERENT MODE, REWRITE CHECKPIECE WITH NEW PIECE MEtHOD
    }

    // check validity of a piece
    // if any of the cells of current piece sit directly above the bottom of the grid or a frozen piece,
    // current piece becomes frozen and we generate a new piece
    // here, currentposition acts like an offset, while i provides the cell's value
    function checkPiece() {
        if(currentPiece.some(i => cells[currentPosition + i + GRID_WIDTH].classList.contains('illegal'))) {
            currentPiece.forEach(i => cells[currentPosition + i].classList.add('illegal'));
            rand = Math.floor(Math.random() * pieces.length); // picks random 0-5
            currentPosition = 3; // center new piece at position 3
            currentRotation = 0; // 0 - 3 rotations
            currentPiece = pieces[rand][currentRotation];
            currentColor = colors[rand];
            checkLineClear();
            checkGameOver();
            drawPiece();

        }
        // fix the redundancy of creating a piece here
    }

    function checkLineClear() {
        for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT - 1; i += GRID_WIDTH) {
            let row = [];
            row.push(i);
            for (let j = 1; j < GRID_WIDTH; j++) {
                row.push(i+j);
            }
            if (row.every(i => cells[i].classList.contains('illegal'))) { // row is full, clear row
                row.forEach(i => cells[i].classList.remove('illegal'));
                row.forEach(i => cells[i].style.backgroundImage = 'none');
                score += 100 * level;
                linesCleared += 1;
                scoreElement.innerHTML = "Score: " + score;
                console.log("line clear #: " + linesCleared)

                // removing squares
                const rowToRemove = cells.splice(i, GRID_WIDTH);
                cells = rowToRemove.concat(cells);
                cells.forEach(cell => grid.appendChild(cell));
            }
        }  
        if (linesCleared % 10 == 0 && linesCleared != 0) {
            level += 1;
            levelElement.innerHTML = "Level: " + level;
        }         


    }

    function checkGameOver() {
        if(currentPiece.some(i => cells[currentPosition + i].classList.contains('illegal'))) {
            console.log("game over");
            window.alert("GAME OVER");
            // set score and level to 0 
            clearInterval(fall);
        }
    }




    // move current piece left
    function moveLeft() {
        if(currentPiece.some(i => cells[currentPosition + i - 1].classList.contains('illegal'))) {
            console.log("collided with illegal");
            checkPiece();
            return;
        }
        if (!started)
            return;
        erasePiece();

        // check if any of the cells in the piece are at the left boundary (at 0, 10, etc (assuming width is 10))
        const atleftBoundary = currentPiece.some(i => (currentPosition + i) % GRID_WIDTH === 0);
        if (!atleftBoundary) {
            currentPosition -= 1;
        }
        drawPiece();
    }

    // move current piece right
    function moveRight() {
        if(currentPiece.some(i => cells[currentPosition + i + 1].classList.contains('illegal'))) {
            console.log("collided with illegal");
            checkPiece();
            return;
        }
        if (!started)
            return;

        erasePiece();

        // check if any of the cells in the piece are at 0, 10, etc (assuming width is 10)
        const atRightBoundary = currentPiece.some(i => (currentPosition + i) % GRID_WIDTH === GRID_WIDTH - 1);
        if (!atRightBoundary) {
            currentPosition += 1;
        }
        drawPiece();
    }

    // move current piece down
    function moveDown() {
        if(currentPiece.some(i => cells[currentPosition + i].classList.contains('illegal'))) {
            return;
        }
        if (!started)
            return;
        if (lastDownPress && (Date.now() - lastDownPress < 30)) {
            return;
        }
        erasePiece();

        // check if any of the cells in the piece are at 0, 10, etc (assuming width is 10)
        if(!currentPiece.some(i => cells[currentPosition + i + GRID_WIDTH].classList.contains('illegal'))) {
            movePieceDown();
        }
        drawPiece();
        lastDownPress = Date.now();
        console.log(lastDownPress);
    }

    function rotate(direction) {
        if (direction == 'clockwise') { // clockwise
            erasePiece();
            currentRotation = myModulo(currentRotation + 1, 4);
            console.log(currentRotation);   
            currentPiece = pieces[rand][currentRotation]
            drawPiece();
        }
        else { // countercockwise
            erasePiece();
            currentRotation = myModulo(currentRotation - 1, 4);
            currentPiece = pieces[rand][currentRotation]
            drawPiece();
        }
    }

    // direct traffic of keypresses to trigger correct methods
    function keypressConfig(keypress) {
        console.log(keypress);
        if (keypress.keyCode === 37)
            moveLeft();
        if (keypress.keyCode === 39)
            moveRight();
        if (keypress.keyCode === 40)
            moveDown();
        if (keypress.keyCode === 90)
            rotate('counterclockwise');
        if (keypress.keyCode === 38 || keypress.keyCode === 88)
            rotate('clockwise'); 
        if (keypress.keyCode === 32 && started)
            dropPiece();
    }
    

    startButton.addEventListener('click', () => {
        // console.log(keypress);
        if(!fall) {
            drawPiece(); 
            fall = setInterval(movePieceDown, FALL_SPEED);
            started = true;
            startButton.innerHTML = "Pause";

        }
        else {
            clearInterval(fall);
            fall = null;
            startButton.innerHTML = "Resume";
            // maybe have an overlay/menu displayed on the screen that says paused
        }
    })

    // any keypress (keydown) is passed into keypressConfig
    document.addEventListener('keydown', keypressConfig);

    // taken from stackoverflow, default modulo doesn't recognize negative numbers
    function myModulo(n, m) { 
        return ((n % m) + m) % m;
    }
}) 


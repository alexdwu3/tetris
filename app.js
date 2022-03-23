document.addEventListener('DOMContentLoaded', () => {
    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 20;
    const GRID_SIZE = GRID_HEIGHT * GRID_WIDTH;
    const FALL_SPEED = 1000000; // in ms;
    let fall = null; // set to null when stuff is not falling, use setInterval 
    let started = false; // has the game started yet?
    let lastDownPress; // stores last time it was pressed



    const grid = createGrid();
    // add GRID_SIZE boxes to grid
    function createGrid() {
        const grid = document.querySelector('.grid')
        // main grid
        for(let i = 0; i < GRID_SIZE; i++) {
            const cell = document.createElement('div');
            grid.appendChild(cell);
        }

        // invisible base layer beneath grid
        for(let i = 0; i < GRID_WIDTH; i++) {
            const illegalCell = document.createElement('div');
            illegalCell.classList.add('illegal')
            grid.appendChild(illegalCell);
        }
        return grid;
        
    }

    let cells = Array.from(grid.querySelectorAll('div')); // assign div boxes to an array
    const scoreDisplay = document.querySelector('#score');
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

    let currentPosition = 3; // position of piece

    // pick first piece randomly
    let rand = Math.floor(Math.random() * pieces.length); // picks random 0-5
    currentPosition = 3; // center new piece at position 3
    let currentRotation = 0; // 0 - 3 rotations
    let currentPiece = pieces[rand][currentRotation];
    let currentColor = colors[rand];


    // draw the piece by giving each of the 4 boxes that the piece occupies the "piece" class, which
    // gives them the appropriate styling to indicate that it is a tetris piece
    function drawPiece() {
        currentPiece.forEach(i => {
            cells[currentPosition + i].style.backgroundImage = currentColor
        });
    }

    function erasePiece() {
        currentPiece.forEach(i => {
            cells[currentPosition + i].style.backgroundImage = 'none'
        });
    }

    function movePieceDown() { // redraw piece one row down
        erasePiece();
        currentPosition += GRID_WIDTH;
        drawPiece();
        suspendPiece();
    }


    function suspendPiece() {
        // if any of the cells of current piece sit directly above the bottom of the grid
        // or another piece, 
        // here, currentposition acts like an offset, while i provides the cell's value
        if(currentPiece.some(i => cells[currentPosition + i + GRID_WIDTH].classList.contains('illegal'))) {
            currentPiece.forEach(i => cells[currentPosition + i].classList.add('illegal'));
            rand = Math.floor(Math.random() * pieces.length); // picks random 0-5
            currentPosition = 3; // center new piece at position 3
            currentRotation = 0; // 0 - 3 rotations
            currentPiece = pieces[rand][currentRotation];
            currentColor = colors[rand];
            drawPiece();
        }
    }

    // piece movement

    function moveLeft() {
        if(currentPiece.some(i => cells[currentPosition + i - 1].classList.contains('illegal'))) {
            console.log("collided with illegal");
            suspendPiece();
            return;
        }
        if (!started)
            return;
        erasePiece();

        // check if any of the cells in the piece are at 0, 10, etc (assuming width is 10)
        const atleftBoundary = currentPiece.some(i => (currentPosition + i) % GRID_WIDTH === 0);
        if (!atleftBoundary) {
            currentPosition -= 1;
        }
        drawPiece();
    }

    function moveRight() {
        if(currentPiece.some(i => cells[currentPosition + i + 1].classList.contains('illegal'))) {
            console.log("collided with illegal");
            suspendPiece();
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
        else { // counterCockwise
            erasePiece();
            currentRotation = myModulo(currentRotation - 1, 4);
            currentPiece = pieces[rand][currentRotation]
            drawPiece();
        }
    }

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

    }
    

    startButton.addEventListener('click', () => {
        if(!fall) {
            drawPiece(); 
            fall = setInterval(movePieceDown, FALL_SPEED);
            started = true;
            startButton.innerHTML = "Pause";
            // change text of start to be pause
        }
        else {
            clearInterval(fall);
            fall = null;
            startButton.innerHTML = "Resume";
            // change text to start, maybe have an overlay that says paused
        }
    })
    document.addEventListener('keydown', keypressConfig);

    function myModulo(n, m) { // modulo doesn't recognize negative numbers
        return ((n % m) + m) % m;
      }
}) // this fires when index.html has been completely loaded 


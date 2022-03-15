document.addEventListener('DOMContentLoaded', () => {
    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 20;
    const GRID_SIZE = GRID_HEIGHT * GRID_WIDTH;
    const FALL_SPEED = 100; // in ms;

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
    const ScoreDisplay = document.querySelector('#score');
    const StartButton = document.querySelector('#start-button');

    // the following piece configurations have 4 numbers representing the 4 boxes in array "cells"
    // that we want to style so that they represent the correct tetris piece
    // piece configurations: see https://static.wikia.nocookie.net/tetrisconcept/images/3/3d/SRS-pieces.png/revision/latest/scale-to-width-down/336?cb=20060626173148
    const barPiece = [
        [GRID_WIDTH + 0, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
        [GRID_WIDTH * 2 + 0, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2, GRID_WIDTH * 2 + 3],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [2, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2, GRID_WIDTH * 3 + 2],
    ];

    const blueLPiece = [
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, 2, GRID_WIDTH + 1, GRID_WIDTH*2 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH],
    ];

    const orangeLPiece = [
        [2, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
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

    function getRandPiece(currentRotation) {
        let rand = Math.floor(Math.random() * pieces.length); // picks random 0-5

        return pieces[rand][currentRotation];
    }
    // pick first piece randomly
    let currentRotation = 0; // 0 - 3 rotations
    let currentPiece = getRandPiece(currentRotation)

    // draw the piece by giving each of the 4 boxes that the piece occupies the "piece" class, which
    // gives them the appropriate styling to indicate that it is a tetris piece
    function drawPiece() {
        currentPiece.forEach(i => {
            cells[currentPosition + i].classList.add('pieceCell') // add piece styling
        });
    }

    function erasePiece() {
        currentPiece.forEach(i => {
            cells[currentPosition + i].classList.remove('pieceCell') // add piece styling
        });
    }

    fall = setInterval(movePieceDown, FALL_SPEED);
    console.log("hi")

    function movePieceDown() { // redraw piece one row down
        erasePiece();
        currentPosition += GRID_WIDTH;
        drawPiece();
        suspendPiece();
    }


    function suspendPiece() {
        // if any of the cells of current piece sit directly above the bottom of the grid
        // or another piece, 
        if(currentPiece.some(i => cells[currentPosition + i + GRID_WIDTH].classList.contains('illegal'))) {
            currentPiece.forEach(i => cells[currentPosition + i].classList.add('illegal'));
            currentPiece = getRandPiece(currentRotation);
            currentPosition = 3;
            drawPiece();
        };

    }
    drawPiece();
}) // this fires when index.html has been completely loaded 


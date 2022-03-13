document.addEventListener('DOMContentLoaded', () => {
    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 20;

    // add 200 boxes to grid
    const grid = document.querySelector('.grid')
    const toAdd = document.createDocumentFragment();
    for(let i = 0; i < 200; i++) {
        const newDiv = document.createElement('div');
        toAdd.appendChild(newDiv);
    }
    grid.appendChild(toAdd);

    let squares = Array.from(document.querySelectorAll('.grid div')); // assign div boxes to an array
    const ScoreDisplay = document.querySelector('#score');
    const StartButton = document.querySelector('#start-button');

    // piece configurations: see https://static.wikia.nocookie.net/tetrisconcept/images/3/3d/SRS-pieces.png/revision/latest/scale-to-width-down/336?cb=20060626173148
    const barPiece = [
        [GRID_WIDTH + 0, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
        [GRID_WIDTH * 2 + 0, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2, GRID_WIDTH * 2 + 3],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
        [2, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2, GRID_WIDTH * 3 + 2],
    ]

    const blueLPiece = [
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, 2, GRID_WIDTH + 1, GRID_WIDTH*2 + 1],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH],
    ]

    const orangeLPiece = [
        [2, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
        [GRID_WIDTH * 2, GRID_WIDTH * 1, GRID_WIDTH * 1 + 1, GRID_WIDTH * 1 + 2],
        [0, 1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    ]

    const boxPiece = [
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
        [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    ]

    const greenZPiece = [
        [GRID_WIDTH, GRID_WIDTH + 1, 1, 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
        [GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    ]

    const redZPiece = [
        [0, 1, GRID_WIDTH + 1, GRID_WIDTH + 2],
        [GRID_WIDTH * 2 + 1, GRID_WIDTH + 1, GRID_WIDTH + 2, 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
        [GRID_WIDTH * 2, GRID_WIDTH, GRID_WIDTH + 1, 1],
    ]

    const tPiece = [
        [GRID_WIDTH, GRID_WIDTH + 1, 1, GRID_WIDTH + 2],
        [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH + 2],
        [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH + 2],
        [GRID_WIDTH, GRID_WIDTH + 1, 1, GRID_WIDTH * 2 + 1]
    ]

    const pieces = [barPiece, blueLPiece, orangeLPiece, boxPiece, greenZPiece, redZPiece, tPiece]

    let currentPosition = 4 // ?
    let current = pieces[1][0]

    // draw first rotation in first tetromino
    function drawPiece() {
        current.forEach(i => {
            squares[currentPosition + i].classList.add('piece') // add piece styling
        });
    }
    drawPiece()
}) // this fires when index.html has been completely loaded 


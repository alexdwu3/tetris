document.addEventListener('DOMContentLoaded', () => {
    const toAdd = document.createDocumentFragment();
    for(let i = 0; i < 200; i++) {
        const newDiv = document.createElement('div');
        toAdd.appendChild(newDiv);
    }
    document.getElementById('grid').appendChild(toAdd);
}) // this fires when index.html has been completely loaded 


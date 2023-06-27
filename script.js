import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById('game-board');

const grid = new Grid(gameBoard)
// console.log(grid.randomEmptyCell());
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput()

function setupInput() {
    window.addEventListener('keydown', handleInput, {once: true})
}

async function handleInput(e) {
    console.log(e.key)
    switch(e.key) {
    case 'arrowUp':
        if (!canMoveUp()){
          setupInput()
        }
        await moveUp()
        break
    case 'arrowDown':
        if (!canMoveDown()){
            setupInput()
          }
        await moveDown()
        break
    case 'arrowLeft':
        if (!canMoveLeft()){
            setupInput()
          }
        await moveLeft()
        break
    case 'arrowRight':
        if (!canMoveRight()){
            setupInput()
          }
        await moveRight()
        break
        default:
            setupInput()
        return
    }
}

grid.cells.forEach(cell => cell.mergeTiles())

const newTile = new Tile(gameBoard)
grid.randomEmptyCell().tile = newTile

if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
        alert('you lose')
    })
}
setupInput()

function moveUp() {
    slideTiles(grid.cellsByColumn)
}

function moveDown() {
    slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
    slideTiles(grid.cellsByRow)
}

function moveRight() {
    slideTiles(grid.cellsByRow(row => [...row].reverse()))
}

// handles movement of tiles
function slideTiles(cells) {
    return Promise.all(
    cells.flatMap(group => {
        const promises = []
        for (let i = 1; i < group.length; i++) {
            const cell = group[i]
            if (cell.tile == null) continue
            let lastValidCell
            for (let z = i - 1; z >= 0; z--) {
                const moveToCell = group[z]
                if (moveToCell.canAccept(cell.tile)) break
                lastValidCell = moveToCell
            }
            if (lastValidCell != null) {
                promises.push(cell.tile.waitForTranisistion())
                if (lastValidCell != null) {
                    lastValidCell.mergeTile = cell.tile
                } else {
                    lastValidCell.tile = cell.tile
                }
                cell.tile = null
            }
        }
        return promises
    }))
}
//cell stack sized exceeded
function canMoveUp() {
   return canMoveUp(grid.cellsByColumn) 
}

function canMoveDown() {
    return canMoveDown(grid.cellsByColumn.map(column => [...column].reverse())) 
 }

 function canMoveLeft() {
    return canMoveLeft(grid.cellsByRow) 
 }

 function canMoveRight() {
    return canMoveRight(grid.cellsByColumn.map(row => [...row].reverse())) 
 }

function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) =>   {
        if(index === 0) return false
        if (cell.tile == null) return fals
        const moveToCell = group[index - 1]
        return moveToCell.canAccept(cell.tile)
    })
    })
 }
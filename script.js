import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById('game-board');

const grid = new Grid(gameBoard)
// console.log(grid.randomEmptyCell());
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
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
          return
        }
        await moveUp()
        break
    case 'arrowDown':
        if (!canMoveDown()){
            setupInput()
            return
          }
        await moveDown()
        break
    case 'arrowLeft':
        if (!canMoveLeft()){
            setupInput()
            return
          }
        await moveLeft()
        break
    case 'arrowRight':
        if (!canMoveRight()){
            setupInput()
            return
          }
        await moveRight()
        break
        default:
            setupInput()
        return
    }


grid.cells.forEach(cell => cell.mergeTiles())

const newTile = new Tile(gameBoard)
grid.randomEmptyCell().tile = newTile

if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
        alert('you lose')
    })
    return
}

setupInput()

}
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
    // console.log(slideTiles);
    return Promise.all(
    cells.flatMap(group => {
        const promises = []
        for (let i = 1; i < group.length; i++) {
            const cell = group[i]
            if (cell.tile == null) continue
            let lastValidCell
            for (let z = i - 1; z >= 0; z--) {
                const moveToCell = group[z]
                if (!moveToCell.canAccept(cell.tile)) break
                lastValidCell = moveToCell
            }
            if (lastValidCell != null) {
                promises.push(cell.tile.waitForTranisistion())
                if (lastValidCell.tile != null) {
                    lastValidCell.mergeTile = cell.tile
                } else {
                    lastValidCell.tile = cell.tile
                }
                cell.tile = null
            }
        }
        return promises
    })
    )
}
//cell stack sized exceeded
function canMoveUp() {
   return canMove(grid.cellsByColumn) 
}

function canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse())) 
 }

 function canMoveLeft() {
    return canMove(grid.cellsByRow) 
 }

 function canMoveRight() {
    return canMove(grid.cellsByColumn.map(row => [...row].reverse())) 
 }

function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) =>   {
        if(index === 0) return false
        if (cell.tile == null) return false
        const moveToCell = group[index - 1]
        return moveToCell.canAccept(cell.tile)
    })
    })
 }
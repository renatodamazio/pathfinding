const rows = 20;
const cols = 20;
const wrapperStyle = {
    width: 800,
    height: 600,
};

const gridStyle = {
    width: wrapperStyle.width / rows,
    height:  wrapperStyle.height / cols
}

const gridMatrix = [];
let cellPress = false;
function convertCellinWall(ev) {
    if (cellPress) {
        const grid = ev.target;
        if (grid.cell.wall) {
            grid.cell.wall = false;
            grid.classList.remove("wall-cell")
        } else {
            grid.cell.wall = true;
            grid.classList.add("wall-cell")

        }
    }
}

function handleCellClick(ev) {
    const cell = ev.target;
    const handle = cell.classList.contains("handle");

    if (!handle) {
        cellPress = true;
        cell.onmouseover = convertCellinWall;
    }
}

function createCells() {
    const cell = document.createElement("div");
    const style = gridStyle;

    cell.setAttribute("class", "cell");
    cell.setAttribute("style", `width: ${style.width}px; height: ${style.height}px`);
    cell.addEventListener("mousedown", function(ev) { handleCellClick(ev) })
    cell.addEventListener("mouseover", function(ev) { convertCellinWall(ev) })
    cell.addEventListener("click", function(ev) { convertCellinWall(ev) })
    cell.addEventListener("mouseup", function(ev) {if (cellPress) cellPress = false })

    return cell;
}

export function updateCells() {
    var list = document.querySelectorAll(".cell");
    var elementsPerSubArray = rows;
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
};

const createGrid = () => {
    for (var x = 0; x < rows; x++) {
        gridMatrix[x] = [];

        for (var y = 0; y < cols; y++) {
            gridMatrix[x][y] = new createCells();
        }
    }

    return gridMatrix;
};

createGrid();

export const returnGrids =  () => { return gridMatrix };

export const returnMatrix = () => { return { rows, cols, wrapperStyle } };

export const drawGrid = () => {
    const wrapper = document.getElementById("wrapper_grid");
    const style = wrapperStyle;
    const grids = gridMatrix;

    wrapper.setAttribute("style", `width: ${style.width}px; height: ${style.height}px`);

    for (var x = 0; x < rows; x++) {
        for (var y = 0; y < cols; y++) {
            wrapper.appendChild(grids[x][y]);
        }
    }

}


export default drawGrid;

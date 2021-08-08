import { allowDrop, drag, drop } from "./draggable";

const rows = 32;
const cols = 32;
const wrapperGrid = document.getElementById("wrapper_grid");

const wrapperStyle = {
    width: 1200, 
    height: 900,
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
        toggleCellWall(grid);
    }
}

function toggleCellWall(grid) {
    if (!grid.cell) return;
    if ((grid.cell) && grid.cell.target || grid.cell.start) return;

    if (grid.cell.wall) {
        
        grid.cell.wall = false;
        grid.classList.remove("wall-cell");

    } else {

        grid.classList.remove("openset-cell", "closeset-cell", "path-cell");
        grid.cell.wall = true;
        grid.classList.add("wall-cell")

    }
}

function handleCellClick(ev) {
    const cell = ev.target;
    const handle = cell.classList.contains("handle");

    if (!handle) {
        cellPress = true;
        wrapperGrid.onmouseover = convertCellinWall;
    }
}

wrapperGrid.addEventListener("mousedown", function(ev) {
    handleCellClick(ev) 
})

wrapperGrid.addEventListener("mouseup", function(ev) {
    cellPress = false;
})

document.onmouseup = () => cellPress = false;

function createCells() {
    const cell = document.createElement("div");
    const style = gridStyle;

    cell.setAttribute("class", "cell");

    cell.addEventListener("dragover", (event) => allowDrop(event));

    cell.addEventListener("drop", (event) => {
        const props = (drop(event));
        const grid = (props.path[0]);
        const classProp = grid.children[0].id;

        const oldGridStart = document.querySelectorAll(`.${classProp}`)[0];

        if (oldGridStart) {
            oldGridStart.classList.remove(classProp, "wall-cell", "path-cell", "openset-cell", "closeset-cell");
            oldGridStart.cell.start = false;
        }

        grid.classList.remove(classProp, "wall-cell", "path-cell", "openset-cell", "closeset-cell");

        grid.cell.visited = false;

        if (classProp == "start-cell") {
            grid.cell.start = true;
        } else {
            grid.cell.target = true;
        }
        
        grid.cell.wall = false;
        grid.cell.visited = false;

        grid.classList.add(`${classProp}`);
    });
    
    cell.setAttribute("style", `width: ${style.width}px; height: ${style.height}px`);
    
    cell.addEventListener("mouseup", function() { 
        cellPress = false 
    });
    
    cell.addEventListener("click", function(ev) { 
        toggleCellWall(ev.target);
    });

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

const createPoints = (className, id, ) => {
    const point = document.createElement("div");
    point.setAttribute("class", className);
    point.setAttribute("id", id);
    point.setAttribute("draggable", true);
    point.setAttribute("style", `width: ${gridStyle.width}px; height: ${gridStyle.height}px`);

    point.addEventListener("dragstart", (event) => drag(event));

    return point;
}

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

export const pinPoints = () => {
    const startCell = document.querySelectorAll('.start-cell');
    const targetCell = document.querySelectorAll(".target-cell");
    const pointStart = createPoints("point-start handle ", "start-cell");
    const pontTarget = createPoints("point-target handle ", "target-cell");

    startCell[0].appendChild(pointStart);
    targetCell[0].appendChild(pontTarget);
}


export default drawGrid;

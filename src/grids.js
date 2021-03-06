import { allowDrop, drag, drop } from "./draggable";
import { APathFinding } from './astar';

let rows = 32;
let cols = 32;
const wrapperGrid = document.getElementById("wrapper_grid");

let wrapperStyle = {};
let gridStyle = {};

const gridMatrix = [];
let cellPress = false;

function setupSizes() {
    wrapperStyle = {
        width: wrapperGrid.offsetWidth - 20, 
        height: wrapperGrid.offsetHeight - 80,
    };

    gridStyle = {
        width: wrapperStyle.width / rows,
        height:  wrapperStyle.height / cols
    }
}

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
        grid.classList.add("wall-cell");

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

function handleDrop(event) {
    const props = (drop(event));
    const grid = (props.path[0]);
    const classProp = grid.children[0].id;
    const oldGridStart = document.querySelectorAll(`.${classProp}`)[0];

    if (oldGridStart) {
        oldGridStart.classList.remove(classProp, "wall-cell", "path-cell", "openset-cell", "closeset-cell");
        oldGridStart.cell.start = false;
    };

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
    
    const paths = document.querySelectorAll(".path-cell");

    if (paths.length) {
        APathFinding();
    }
}

function createCells() {
    const cell = document.createElement("div");

    cell.setAttribute("class", "cell");

    cell.addEventListener("dragover", (event) => allowDrop(event));

    cell.addEventListener("drop", (event) => handleDrop(event));
        
    cell.addEventListener("mouseup", () => cellPress = false );
    
    cell.addEventListener("click", (ev) => toggleCellWall(ev.target));

    cell.setAttribute("style", `width: ${gridStyle.width}px; height: ${gridStyle.height}px`);

    return cell;
}

export function updateCells() {
    const list = document.querySelectorAll(".cell");
    const elementsPerSubArray = rows;
    let matrix = [], i, k;

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
    setupSizes();

    for (var x = 0; x < rows; x++) {
        gridMatrix[x] = [];

        for (var y = 0; y < cols; y++) {
            gridMatrix[x][y] = new createCells();
        }
    }

    return gridMatrix;
};

export const returnGrids =  () => { return gridMatrix };

export const returnMatrix = () => { return { rows, cols, wrapperStyle }};

export const createPoints = (className, id, ) => {
    const point = document.createElement("div");

    point.setAttribute("class", className);
    point.setAttribute("id", id);
    point.setAttribute("draggable", true);
    point.setAttribute("style", `width: ${gridStyle.width}px; height: ${gridStyle.height}px`);

    point.addEventListener("dragstart", (event) => drag(event));

    return point;
};

export const pinPoints = () => {
    const startCell = document.querySelectorAll('.start-cell');
    const targetCell = document.querySelectorAll(".target-cell");
    const pointStart = createPoints("point-start handle drag-drop", "start-cell");
    const pontTarget = createPoints("point-target handle drag-drop", "target-cell");

    startCell[0].appendChild(pointStart);
    targetCell[0].appendChild(pontTarget);
};

export const drawGrid = () => {
    createGrid();
    
    const wrapper = document.getElementById("wrapper_grid");

    wrapper.setAttribute("style", `width: ${wrapperStyle.width}px; height: ${wrapperStyle.height}px`);

    for (var x = 0; x < rows; x++) {
        for (var y = 0; y < cols; y++) {
            wrapper.appendChild(gridMatrix[x][y]);
        }
    }
}

export default drawGrid;

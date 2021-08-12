"use strict";

import { returnGrids, returnMatrix, updateCells } from "./grids";

let openSet = new Array();

let startCell;
let targetCell;
let buildPath;
let current;
let closeSet = [];
let path = [];
let globalGrids = [];

const lowestFScore = (arr) => {
    return arr.reduce((prev, curr) => { return prev.f < curr.f ? prev : curr })
}

function removeFromArray(arr, item) {
    const index = arr.indexOf(item);
    arr.splice(index, 1);
};

const heuristic = (num1, num2) => { 
    const e = num1.cell;
    const n = num2.cell;

    const a = e.i - n.i;
    const b =  e.j - n.j;
        
    const c = Math.sqrt(a*a + b*b);

    return c;
};

function MazeBuilder(el, grids) {
    const cell = el.cell;
    const neighbors = cell.neighbors;

    cell.visited = true;

    if (cell.target) {
        return;
    }

    if (neighbors.length) {
        try {
            const notVisitedNeighbors = neighbors.filter((n) => !n.cell.visited);
            const neighborIndex = Math.floor((Math.random() * notVisitedNeighbors.length));
            const neighbor = notVisitedNeighbors[neighborIndex];

            if(neighbor && (!neighbor.cell.start && !neighbor.cell.target)) {

                const j = neighbor.cell.j;
                const i = neighbor.cell.i;

                if (j % 2 === 0 || notVisitedNeighbors.length > 2) {
                    neighbor.cell.wall = true;
                    neighbor.classList.add("wall-cell")
                };


                if ( Math.floor(Math.random() * i + j) % 2 > i) {
                    neighbor.cell.wall = true;
                    neighbor.classList.add("wall-cell")
                };

                notVisitedNeighbors.forEach((element) => MazeBuilder(element, grids));

            }
        } catch(err) {
            console.log("Something went wrong");
        }
    }
};

function cells(i, j) {
    const config = returnMatrix();
    let cols = config.cols;
    let rows = config.rows;
    let grids = globalGrids;
        this.i = i;
        this.j = j;
        this.g = 0;
        this.h = 0;
        this.visited = false;
        this.start = false;
        this.target = false;
        this.f = i + j;
        this.wall = false;
        this.neighbors = [];
        
        this.setNeighbors = function() {
            let i = this.i;
            let j = this.j;

            if (i < cols - 1) {
                this.neighbors.push(grids[i+1][j]);
            }

            if (i > 0) {
                this.neighbors.push(grids[i-1][j]);
            }

            if (j < rows - 1) {
                this.neighbors.push(grids[i][j+1]);
            }

            if (j > 0) {
                this.neighbors.push(grids[i][j - 1]);
            }
        }
}

function applyNeighborstoCells() {
    const grids = globalGrids;
    grids.forEach((row, x) => {
        row.forEach((col, y) => {
            grids[x][y].cell.setNeighbors(x, y);
        })
    });
}

function applyCellsConfigToGridCell() {
    const grids = globalGrids;
    grids.forEach((row, x) => {
        row.forEach((col, y) => {
            grids[x][y].cell = new cells(x, y);
        })
    });
}

function Setup(grids) {
    globalGrids = grids;

    applyCellsConfigToGridCell();

    applyNeighborstoCells();

    const returnRandomCell = () => {
        const randomPosX = Math.abs(Math.floor(Math.random() * (0 - globalGrids.length / 2 )) + 0);
        const randomPosY = Math.abs(Math.floor(Math.random() * (0 - globalGrids.length / 2 )) + 0);

        return (globalGrids[randomPosX][randomPosY]);
    };

    startCell = returnRandomCell();
    targetCell = returnRandomCell();

    startCell.cell.start = true;
    targetCell.cell.target = true;

    startCell.classList.add("start-cell", "handle");
    targetCell.classList.add("target-cell", "handle");

    openSet.push(startCell);

    MazeBuilder(startCell, grids);
}

function runVisitedPaths(arr, className) {
    for (var o = 0; o < arr.length; o++) {
        if (arr[o]) {
            if (!arr[o].cell.start && !arr[o].cell.target) {
                arr[o].classList.add(className)
            }
        }
    }
}

const reconstructPath = () => {
    let x = 0;

    buildPath = setInterval(() => {
        if (x < path.length -1) {
            x++
        } else {
            clearInterval(buildPath)
        }

        if (path[x]) {
            if (!path[x].cell.start) {
                 path[x].classList.add("path-cell");
            }
        } else {
            clearInterval(buildPath);
        }
    }, x * 100 / 2)
}

function AStar({ openSet, targetCell }) {
    const constructPath = async () => {
        if (openSet.length) {
            current = lowestFScore(openSet);

            if (current == targetCell) {

                let temp = current;
                path.unshift(temp);

                while(temp.previous) {
                    path.unshift(temp.previous);
                    temp = temp.previous;
                };


                reconstructPath();
                return;
            };

            const neighbors = current.cell.neighbors;

            removeFromArray(openSet, current);

            closeSet.push(current);

            for (var n = 0; n < neighbors.length; n++) {  
                const neighborCell = neighbors[n].cell;
                const neighbor = neighbors[n];

                if (!closeSet.includes(neighbor) && !neighborCell.wall) {

                    let tempg = (current.cell.g + 1);
                    let newPath = false;

                    if (openSet.includes(neighbor)) {

                        if (tempg < neighborCell.g) {
                            neighbor.g = tempg;
                            newPath = true;
                        }
                    } else {
                        newPath = true;
                        neighbor.g = tempg;
                        openSet.push(neighbor);
                    };


                    if (newPath) {
                        neighbor.h = heuristic(neighbor, targetCell);
                        neighbor.f = neighbor.g + neighbor.h;

                        neighbor.previous = current;
                    }
                }
            };

            constructPath();

            runVisitedPaths(openSet, "openset-cell");
            runVisitedPaths(closeSet, "closeset-cell");


        } else {
            console.log("nenhum caminho encontrado");
        }
    }
    
    constructPath();
}

function cleanCell () {
    clearInterval(buildPath);

    document.querySelectorAll(".cell").forEach((grid) => {
        grid.classList.remove("openset-cell")
        grid.classList.remove("closeset-cell")
        grid.classList.remove("path-cell");
        grid.classList.remove("wall-cell");
        grid.previous = false;
        grid.cell.visited = false;
        grid.cell.wall = false;
    });
}

async function cleanCellConfig() {
    await document.querySelectorAll(".cell").forEach((grid) => {
        grid.previous = false;
        grid.cell.visited = false;
    })

    return true;
}

export async function resetAstar() {
    clearInterval(buildPath);

    openSet = [];
    startCell = [];
    targetCell = [];
    buildPath = [];
    current = [];
    closeSet = [];
    path = [];

    await document.querySelectorAll(".openset-cell").forEach((item) =>  item.classList.remove("openset-cell"));
    await document.querySelectorAll(".closeset-cell").forEach((item) => item.classList.remove("closeset-cell"))
    await document.querySelectorAll(".path-cell").forEach((item) => item.classList.remove("path-cell"))

    return true;
}

export function updateWallCell() {
    globalGrids.forEach((globalGrid) => {
        globalGrid.forEach((grid) => {
            if (grid.classList.contains("wall-cell") && (!grid.cell.start || !grid.cell.target)) {
                grid.cell.wall = true;
            }
        })
    })
}

export function cleanWalls() {
    cleanCell();
}

export function setCellasTargetandStart() {
    document.querySelectorAll(".start-cell")[0].cell.start = true;
    document.querySelectorAll(".target-cell")[0].cell.target = true;
}

export function generateWalls() {
    cleanCell();

    const config = returnMatrix();
    const i = Math.floor(Math.random() * config.rows);
    const j = Math.floor(Math.random() * config.cols);

    setCellasTargetandStart();

    const el = globalGrids[i][j];

    return MazeBuilder(el, returnGrids())
};

export async function APathFinding() {    
    await resetAstar();

    globalGrids = await updateCells();

    await applyCellsConfigToGridCell();
    await applyNeighborstoCells();

    await cleanCellConfig();

    await updateWallCell();
       
    const targetCell = document.querySelectorAll(".target-cell")[0];
    const startCell = document.querySelectorAll(".start-cell")[0];

    startCell.cell.start = true;
    targetCell.cell.target = true;

    openSet.push(startCell);

    AStar({ openSet, targetCell });
}

export default Setup;


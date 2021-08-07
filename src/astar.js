"use strict";

import { returnGrids, returnMatrix, updateCells } from "./grids";

let openSet = new Array();

let startCell;
let targetCell;

let buildPath;
let current;
let closeSet = [];
let path = [];
let intervalOpenSet;
let globalGrids = [];

let visitedAllFindPath = [0, 0]

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
        
    const c = Math.sqrt(a*a, + b*b);

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

            // if (j > 0 && i > 0) {
            //     this.neighbors.push(grids[i - 1][j-1]);
            // }

            // if (j > 0 && i < cols - 1) {
            //     this.neighbors.push(grids[i + 1][j-1]);
            // }

            // if (j < rows - 1 && i > 0) {
            //     this.neighbors.push(grids[i - 1][j + 1]);
            // }

            // if (i < cols - 1 && j < rows - 1) {
            //     this.neighbors.push(grids[i + 1][j + 1]);
            // }
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
        const randomPosX = Math.abs(Math.floor(Math.random() * (0 - globalGrids.length)) + 0);
        const randomPosY = Math.abs(Math.floor(Math.random() * (0 - globalGrids.length)) + 0);

        return (globalGrids[randomPosX][randomPosY]);
    };

    targetCell = returnRandomCell();
    startCell = returnRandomCell();

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
                arr[o].style.transitionDelay = `.${o}s`;
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
            path[x].style.transitionDelay = `${x}s`;
            path[x].classList.add("path-cell");
        } else {
            clearInterval(buildPath);
        }
    }, 160)
}

function AStar({ openSet, targetCell }) {    

    
    const constructPath = async () => {        
        if (openSet.length) {
            
            current = (lowestFScore(openSet));

            if (current == targetCell) {
                let temp = current;
                path.unshift(temp);

                while(temp.previous) {
                    path.unshift(temp.previous);
                    temp = temp.previous;
                }
                reconstructPath();
                return;
            }

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

                    // constructOpenSetPath();
                    // constructClosesetPath();
                }
            
            }

                runVisitedPaths(openSet, "openset-cell");
                runVisitedPaths(closeSet, "closeset-cell");

            constructPath();

        } else {
            console.log("nenhum caminho encontrado");
        }
    }
    
    constructPath();
}

function cleanCell () {
    document.querySelectorAll(".cell").forEach((grid) => {
        grid.style.transitionDelay = '0s';
        grid.classList.remove("openset-cell")
        grid.classList.remove("closeset-cell")
        grid.classList.remove("path-cell");
        grid.classList.remove("wall-cell");

        grid.cell.visited = false;
        grid.cell.wall = false;
    })
}

export function resetAstar() {
    clearInterval(buildPath);

    openSet = [];
    startCell = [];
    targetCell = [];
    buildPath = [];
    current = [];
    closeSet = [];
    path = [];


    document.querySelectorAll(".openset-cell").forEach((item) =>  item.classList.remove("openset-cell"));
    document.querySelectorAll(".closeset-cell").forEach((item) => item.classList.remove("closeset-cell"))
    document.querySelectorAll(".path-cell").forEach((item) => item.classList.remove("path-cell"))

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
    // const walls = document.querySelectorAll(".wall-cell");
    // walls.forEach((wall) => { wall.classList.remove("wall-cell"); wall.cell.wall = false; })
}

export function generateWalls() {
    cleanCell();
    const config = returnMatrix();
    const i = Math.floor(Math.random() * config.rows);
    const j = Math.floor(Math.random() * config.cols);

    const el = globalGrids[i][j];
    return MazeBuilder(el, returnGrids())
}

export function Start() {
    resetAstar();

    globalGrids = updateCells();

    applyCellsConfigToGridCell();
    applyNeighborstoCells();
    
    const targetCell = document.querySelectorAll(".target-cell")[0];
    const startCell = document.querySelectorAll(".start-cell")[0];

    updateWallCell();

    openSet.push(startCell);
    AStar({openSet, targetCell})
}

export default Setup;


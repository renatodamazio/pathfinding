"use strict";

import { returnMatrix } from "./grids";

let openSet = new Array();


const lowestFScore = (arr) => {
    return arr.reduce((prev, curr) => { return prev.f < curr.f ? prev : curr })
}

function removeFromArray(arr, item) {
    const index = arr.indexOf(item);
    arr.splice(index, 1);
};

const heuristic = (num1, num2) => {
    const a = num1.cell;
    const b = num2.cell;

    const _math = Math.abs(a.i - b.i) + Math.abs(a.j - a.j);
    return _math;
};

function MazeBuilder(el, grids) {
    const cell = el.cell;
    const neighbors = cell.neighbors;

    cell.visited = true;

    if (cell.target) {
        return;
    }

    if (neighbors.length) {
        const notVisitedNeighbors = neighbors.filter((n) => !n.cell.visited);
        const neighborIndex = Math.floor((Math.random() * notVisitedNeighbors.length));
        const neighbor = notVisitedNeighbors[neighborIndex];

        if(neighbor) {
            neighbor.cell.wall = true;
            neighbor.style.backgroundColor = "#fff";

            notVisitedNeighbors.forEach((element) => MazeBuilder(element, grids));
        }
    }
};


function Setup(grids) {
    const config = returnMatrix();

    let cols = config.cols;
    let rows = config.rows;

    let startCell;
    let targetCell;

    const cells = function(i, j) {
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
        
        this.generateWall = function() {
            if ( Math.random(i+j) < 0.3) {
                // this.wall = true;
            }
        }
        
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

    grids.forEach((row, x) => {
        row.forEach((col, y) => {
            grids[x][y].cell = new cells(x, y);
        })
    });

    grids.forEach((row, x) => {
        row.forEach((col, y) => {
            grids[x][y].cell.setNeighbors(x, y);
        })
    });

    grids[0][0].cell.start = true;
    grids[cols -1][rows -1].cell.target = true;

    startCell = (grids[0][0]);
    targetCell = (grids[cols -1][rows -1]);

    startCell.classList.add("start-cell");
    targetCell.classList.add("target-cell");
    

    openSet.push(startCell);

    grids.forEach((row, x) => {
        row.forEach((col, y) => {
            const gridexpecetion = grids[x][y].cell
            if (!gridexpecetion.start && !gridexpecetion.target) {
                gridexpecetion.generateWall();
            }
        })
    });

    MazeBuilder(startCell, grids);
    
    AStar({ openSet, targetCell });
}

function AStar({ openSet, targetCell }) {
    let current;
    let closeSet = [];
    let path = [];

    const reconstructPath = () => {
        let x = 0;
        
        const startPath = setInterval(() => {
            if (x <= path.length -1) {
                x++
            } else {
                clearInterval(startPath)
            }

            if (path[x]) {
                path[x].classList.add("path-cell");
            } else {
                clearInterval(startPath);
            }
        }, 100)
       
    }
    
    const constructPath = () => {        
        if (openSet.length) {
            
            current = (lowestFScore(openSet));

            if (current == targetCell) {
                let temp = current;
                path.push(temp);

                while(temp.previous) {
                    path.push(temp.previous);
                    temp = temp.previous;
                    reconstructPath();
                }
                return;
            }

            const neighbors = current.cell.neighbors;

            removeFromArray(openSet, current);

            closeSet.push(current);

            for (var n = 0; n < neighbors.length; n++) {  
                const neighborCell = neighbors[n].cell;
                const neighbor = neighbors[n];


                if (neighborCell.wall) {
                    neighbor.style.backgroundColor = "purple";
                }


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
            
            }
            for (var o = 0; o < openSet.length; o++) {
                openSet[o].style.backgroundColor = "green"
            }
        
            for (var o = 0; o < closeSet.length; o++) {
                closeSet[o].style.backgroundColor = "pink"
            }

            constructPath();
        } else {
            console.log("nenhum caminho encontrado");
        }
    }
    
    constructPath();
}

export default Setup;


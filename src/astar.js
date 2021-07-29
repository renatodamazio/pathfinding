"use strict";

import { returnMatrix, returnElementGrids } from "./grids";

let openSet = new Array();

const lowestFScore = (arr) => {
    return arr.reduce((prev, curr) => { return prev.f < curr.f ? prev : curr })
}

function removeFromArray(arr, item) {
    const index = arr.indexOf(item);
    arr.splice(index, 1);
};

const heuristic = (num1, num2) => {
    const a = num1;
    const b = num2;

    const _math = Math.abs(a.i - b.i) + Math.abs(a.j - a.j);
    return _math;
}

function Setup(params) {
    let grids = params;
    const config = returnMatrix();
    let cols = config.cols;
    
    let rows = config.rows;

    let startCell;
    let targetCell;

    const data = function(i, j) {
        this.i = i;
        this.j = j;
        this.g = 0;
        this.h = 0;
        this.f = i + j;
        this.wall = false;
        this.className = false;
        this.neighbors = [];

        if (Math.random(1) < 0.3) {
            this.wall = true;
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
    };



    grids.forEach((row, x) => {
        row.forEach((col, y) => {
            grids[x][y] = new data(x, y)
        })
    });

    grids.forEach((row, x) => {
        row.forEach((col, y) => {
            grids[x][y].setNeighbors(x, y);
        })
    });


    startCell = (grids[0][0]);
    targetCell = (grids[3][2]);

    startCell.className = ("start-cell");
    targetCell.className = ("target-cell");

    openSet.push(startCell);

    AStar({ openSet, targetCell, startCell }) 
}

function AStar({ openSet, targetCell, startCell }) {
    let current;
    let closeSet = [];
    let path = [];

    const reconstructPath = () => {   
       const elements = (returnElementGrids());

        path.forEach((item, i) => {
            elements[item.i][item.j].classList.add("path-cell");
        });

        closeSet.forEach((item, i) => {
           if(item.wall) {
            elements[item.i][item.j].classList.add("wall-cell");
           } else {
            elements[item.i][item.j].classList.add("close-cell");
           }

        });

        openSet.forEach((item, i) => {
            elements[item.i][item.j].classList.add("open-cell");
        })
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

            const neighbors = current.neighbors;

            removeFromArray(openSet, current);

            closeSet.push(current);

            for (var n = 0; n < neighbors.length; n++) {  
                const neighbor = neighbors[n];

                if (neighbor.wall) {
                    neighbor.className = "wall";
                }


                if (!closeSet.includes(neighbor) && !neighbor.wall) {

                    let tempg = (current.g + 1);
                    let newPath = false;

                    if (openSet.includes(neighbor)) {

                        if (tempg < neighbor.g) {
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
                // openSet[o].style.backgroundColor = "green"
            }
        
            for (var o = 0; o < closeSet.length; o++) {
                // closeSet[o].style.backgroundColor = "pink"
            }

            constructPath();
        } else {
            console.log("nenhum caminho encontrado");
        }
    }
    
    constructPath();
}

export default Setup;


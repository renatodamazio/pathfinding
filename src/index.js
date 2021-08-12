import '../assets/main.scss';
import('babel-polyfill');
import drawGrid, { returnGrids, pinPoints } from './grids';
import Setup, { APathFinding, cleanCell, generateWalls } from './astar';

window.onload = () => {
    drawGrid();

    async function getGrids() {
        const grids = await returnGrids();
        Setup(grids);

        pinPoints();
    };

    getGrids();

   const buttonStart = document.getElementById("button-start");
   const buttonCleanWalls = document.getElementById("button-clean-walls");
   const buttonGenerateWalls = document.getElementById("button-generate-walls");

   buttonStart.addEventListener("click", () => { 
        APathFinding();
    });

    buttonCleanWalls.addEventListener("click", () => { 
        cleanCell();
    })

    buttonGenerateWalls.addEventListener("click", () => { 
        generateWalls();
    })    
}
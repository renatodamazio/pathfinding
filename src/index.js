import '../assets/main.scss';
import('babel-polyfill');
import drawGrid, { returnGrids, pinPoints } from './grids';
import Setup, { Start, cleanWalls, generateWalls } from './astar';

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
        Start();
    });

    buttonCleanWalls.addEventListener("click", () => { 
        cleanWalls();
    })

    buttonGenerateWalls.addEventListener("click", () => { 
        generateWalls();
    })    
}
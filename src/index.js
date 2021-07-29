import '../assets/main.scss';
import('babel-polyfill');
import drawGrid, { returnGrids, createGrid } from './grids';
import Setup from './astar';

window.onload = () => {
    drawGrid();

    async function getGrids() {
        const grids = await createGrid();
        Setup(grids);
    };
    
    getGrids()
}
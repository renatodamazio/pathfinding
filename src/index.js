import '../assets/main.scss';
import('babel-polyfill');
import drawGrid, { returnGrids } from './grids';
import Setup from './astar';

window.onload = () => {
    drawGrid();

    async function getGrids() {
        const grids = await returnGrids();
        Setup(grids);
    }
    getGrids()
}
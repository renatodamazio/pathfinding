import '../assets/main.scss';
import('babel-polyfill');
import drawGrid, { returnGrids } from './grids';
import Setup, {restartAStar} from './astar';
import Sortable from 'sortablejs';

window.onload = () => {
    drawGrid();

    async function getGrids() {
        const grids = await returnGrids();
        Setup(grids);
    }
    getGrids();

    Sortable.create(wrapper_grid, {
        handle: ".cell.handle",
        draggable: ".cell",
        filter: ".wall-cell",
        animation: 150,
        ghostClass: 'blue-background-class',

        onEnd: (e) => {
            restartAStar(e)
        }
    })
}
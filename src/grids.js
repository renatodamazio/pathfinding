const rows = 50;
const cols = 50;
const wrapperStyle = {
    width: 1280,
    height: 900,
};

const gridStyle = {
    width: wrapperStyle.width / rows,
    height:  wrapperStyle.height / cols
}

const gridMatrix = [];

function handleCellClick() {
    console.log('do somenting')
}

function createCells() {
    const cell = document.createElement("div");
    const style = gridStyle;

    cell.setAttribute("class", "cell");
    cell.setAttribute("style", `width: ${style.width}px; height: ${style.height}px`);
    cell.addEventListener("click", function() { handleCellClick() })

    return cell;
}

const createGrid = () => {
    for (var x = 0; x < rows; x++) {
        gridMatrix[x] = [];

        for (var y = 0; y < cols; y++) {
            gridMatrix[x][y] = new createCells();
        }
    }

    return gridMatrix;
};

export const returnGrids =  () => { return gridMatrix };

export const returnMatrix = () => { return { rows, cols, wrapperStyle } };

export const drawGrid = () => {
    const wrapper = document.getElementById("wrapper_grid");
    const style = wrapperStyle;
    const grids = createGrid();

    wrapper.setAttribute("style", `width: ${style.width}px; height: ${style.height}px`);

    for (var x = 0; x < rows; x++) {
        for (var y = 0; y < cols; y++) {
            wrapper.appendChild(grids[x][y]);
        }
    }

}


export default drawGrid;

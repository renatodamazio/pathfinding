const rows = 16;
const cols = 16;
const wrapperStyle = {
    width: 800,
    height: 400,
};

const gridStyle = {
    width: wrapperStyle.width / rows,
    height:  wrapperStyle.height / cols
}

const gridMatrix = [];
const gridElementMatrix = [];

function handleCellClick() {
    console.log('do somenting')
}

function createCells() {
    const cell = document.createElement("div");
    const style = gridStyle;

    cell.setAttribute("class", "cell");
    cell.setAttribute("style", `width: ${style.width}px; height: ${style.height}px`)
    cell.addEventListener("click", function() { handleCellClick() })

    return cell;
}

export const createGridElements = () => {
    for (var x = 0; x < rows; x++) {
        gridElementMatrix[x] = [];

        for (var y = 0; y < cols; y++) {
            gridElementMatrix[x][y] = new createCells();
        }
    }

    return gridElementMatrix;
};

export const createGrid = () => {
    for (var x = 0; x < rows; x++) {
        gridMatrix[x] = [];

        for (var y = 0; y < cols; y++) {
            gridMatrix[x][y] = {};
        }
    }

    return gridMatrix;
};

export const returnElementGrids =  () => { return gridElementMatrix };

export const returnMatrixGrids =  () => { return gridMatrix };

export const returnMatrix = () => { return { rows, cols, wrapperStyle } };

export const drawGrid = () => {
    const wrapper = document.getElementById("wrapper_grid");
    const style = wrapperStyle;
    const grids = createGridElements();

    wrapper.setAttribute("style", `width: ${style.width}px; height: ${style.height}px`);

    for (var x = 0; x < rows; x++) {
        for (var y = 0; y < cols; y++) {
            wrapper.appendChild(grids[x][y]);
        }
    }

}


export default drawGrid;

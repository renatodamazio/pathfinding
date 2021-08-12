export function MazeBuilder(el, grids) {
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
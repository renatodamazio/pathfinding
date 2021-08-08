export function allowDrop(ev) {
    ev.preventDefault();

    return ev;
}

export function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);

    return ev;
}

export function drop(ev) {
    try {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.innerHTML = "";
        ev.target.appendChild(document.getElementById(data));

        return ev;
    } catch(err) {
        throw err
    }
}


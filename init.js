const w = window.innerWidth
const h = window.innerHeight

const boxSize = 50;

const gridColumns = Math.floor(w/boxSize)
const gridRows = Math.floor(h/boxSize)

const container = document.getElementById("container")
container.style.gridTemplateColumns = `repeat(${gridColumns}, ${boxSize}px)`
container.style.gridTemplateRows = `repeat(${gridRows}, ${boxSize}px)`

for(let y=0; y<gridRows; y++) {
    for(let x=0; x<gridColumns; x++) {
        let box = document.createElement("div")
        box.classList.add("box", `${x}x${y}`)
        box.style.gridArea = `${y+1} / ${x+1} / ${y+2} / ${x+2}`
        container.appendChild(box)
    }
}

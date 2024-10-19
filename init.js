// const w = window.innerWidth
// const h = window.innerHeight

// const boxSize = 50;

// const gridColumns = Math.floor(w/boxSize)
// const gridRows = Math.floor(h/boxSize)

// const container = document.getElementById("container")
// container.style.gridTemplateColumns = `repeat(${gridColumns}, ${boxSize}px)`
// container.style.gridTemplateRows = `repeat(${gridRows}, ${boxSize}px)`

// data = []
// for(let y=0; y<gridRows; y++) {
//     datay = []
//     for(let x=0; x<gridColumns; x++) {
//         datay.push(0)
//     }
//     data.push(datay)
// }

// let boxes = {}
// let sprites = {}

// for(let y=0; y<gridRows; y++) {
//     for(let x=0; x<gridColumns; x++) {
//         new Box(x, y)
//     }
// }

// function destroyBox(x, y) {
//     let box = boxes[`${x}x${y}`]
//     box.destroyEffect()
//     if(sprites[`${x}x${y}`]!=undefined) {
//         sprites[`${x}x${y}`].destroy()
//     }
// }

// class Sprite {

//     constructor(xo, yo, spriteCode) {
        
//         this.element = document.createElement("div")
//         this.element.classList.add(spriteCodes[spriteCode], "sprite")

//         this.x = xo
//         this.y = yo

//         this.spriteCode = spriteCode

//         this.velx = 0
//         this.vely = 0

//         this.living = true

//         this.timeout = 200

//         this.repaint.bind(this)()
//         this.move.bind(this)()
//     }

//     getPosition() {
//         return [this.x, this.y]
//     }

//     repaint() {
//         let x = this.x
//         let y = this.y
//         this.element.style.gridArea = `${y+1} / ${x+1} / ${y+2} / ${x+2}`
//     }

//     move() {
//         if(!this.living){
//             return
//         }
//         console.log(this.canMove())
//         if(!this.canMove()) {
//             setTimeout(this.move.bind(this), this.timeout)
//             return
//         }
//         data[this.y][this.x] = 0
//         sprites[`${this.x}x${this.y}`] = undefined

//         this.x += this.velx
//         this.y += this.vely

//         data[this.y][this.x] = this.spriteCode
//         sprites[`${this.x}x${this.y}`] = this

//         this.repaint()
//         setTimeout(this.move.bind(this), this.timeout)
//     }

//     canMove() {

//         let xn = this.x + this.velx
//         let yn = this.y + this.vely
        
//         let edgeSpace = 0<=xn && xn<gridColumns && 0<=yn && yn<gridRows
//         let wallSpace = data[yn][xn]!=1

//         console.log(this.y, yn, 0<=yn)

//         return edgeSpace && wallSpace
//     }

//     destroy() {
//         data[this.y][this.x] = 0
//         sprites[`${this.x}x${this.y}`] = undefined
//         container.removeChild(this.element)
//         delete this
//     }

//     collision() { }
// }

// class Box {
    
//     constructor(x, y) {

//         this.element = document.createElement("div")
//         this.element.classList.add("box", `${x}x${y}`)
//         this.element.style.gridArea = `${y+1} / ${x+1} / ${y+2} / ${x+2}`
//     }

//     getElement() {
//         return this.element;
//     }

//     destroyEffect() {
//         this.element.style.transition = ""
//         this.element.style.backgroundColor = "pink"
//         setTimeout((() => {
//             this.element.style.transition = "background-color 0.6s ease-out"
//             this.element.style.backgroundColor = "blue"
//         }).bind(this), 100)
//     }
// }

// class Data {

//     constructor() {
        
//         this.sprites = []
//         this.boxes = {}
//     }

//     addBox(x, y) {
//         let box = new Box(x, y)
//         boxes[`${x}x${y}`] = box
//         container.appendChild(box.getElement())
//     }

//     killBox(x, y) {
//         let box = boxes[`${x}x${y}`]
//         box.destroyEffect()
//         this.getSprites(x, y).forEach(sprite => {
//             sprite.destroy()
//         })
//     }

//     addSprite(xo, yo, spriteCode) {
        
//         let sprite = new Sprite(xo, yo, spriteCode)

//         container.appendChild(sprite)
//     }

//     getSprites(x, y) {
//         return sprites.filter(sprite => {
//             return [x, y] == sprite.getPosition()
//         })
//     }
// }
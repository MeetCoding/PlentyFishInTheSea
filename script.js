// Sprite Codes
// 0: Default
// 1: Wall
// 2: Main Character
// 3: Shark
// 4: Small Fish

const container = document.getElementById("container")

function removeItemAtIndex(arr, index) {
    if (index < 0 || index >= arr.length) {
      return null;
    }
    const removedItem = arr[index];
    arr.splice(index, 1);
    return removedItem;
}

function equalArray(arr1, arr2) {
    if(arr1.length != arr2.length) {
        return false
    }
    for(let i=0; i<arr1.length; i++) {
        if(arr1[i] != arr2[i]) {
            return false
        }
    }
    return true
}

function bindKey(sprite) {
    document.addEventListener("keydown", event => {
        if(event.key=="ArrowUp" || event.key=="w") {sprite.setVelocity(0, -1)}
        if(event.key=="ArrowDown" || event.key=="s") {sprite.setVelocity(0, 1)}
        if(event.key=="ArrowRight" || event.key=="d") {sprite.setVelocity(1, 0)}
        if(event.key=="ArrowLeft" || event.key=="a") {sprite.setVelocity(-1, 0)}
    })
}

class Sprite {

    constructor(game, x, y, spriteCode) {

        this.game = game

        this.living = true

        this.element = document.createElement("div")
        this.element.classList.add("sprite", `code${spriteCode}`)

        this.setPosition(x, y)
        this.setVelocity(0, 0)
    }

    setPosition(x, y) {
        this.x = x
        this.y = y
    }

    getPosition() {
        return [this.x, this.y]
    }

    updateElement() {
        let [x, y] = this.getPosition()
        this.element.style.gridArea = `${y+1} / ${x+1} / ${y+2} / ${x+2}`
    }

    setVelocity(velx, vely) {
        this.velx = velx
        this.vely = vely
    }

    getNextPosition() {
        return [this.x + this.velx, this.y + this.vely]
    }

    getElement() {
        return this.element
    }

    canMove() {
        let [x, y] = this.getNextPosition()
        return this.game.isPositionFree(x, y)
    }

    move() {
        let [x, y] = this.getNextPosition()
        this.setPosition(x, y)
        this.updateElement()
    }

    destroy() {
        this.game.removeSprite(this.id)
        delete this
    }

    setId(id) {
        this.id = id
    }

    loop() {
        this.updateElement()
        if(this.canMove()) {
            this.move()
        }
    }
}

class Box {
    
    constructor(x, y) {

        this.element = document.createElement("div")
        this.element.classList.add("box")
        this.element.style.gridArea = `${y+1} / ${x+1} / ${y+2} / ${x+2}`
    }

    getElement() {
        return this.element;
    }

    destroyEffect() {

        let element = this.getElement()

        element.style.transition = ""
        element.style.backgroundColor = "pink"
        setTimeout((() => {
            element.style.transition = "background-color 0.6s ease-out"
            element.style.backgroundColor = "blue"
        }).bind(this), 100)
    }
}

class Game {

    constructor() {
        
        this.sprites = []
        this.boxes = {}

        this.timout = 100
        this.boxSize = 50

        this.setDimensions()
    }

    setDimensions() {

        let w = window.innerWidth
        let h = window.innerHeight

        this.gridColumns = Math.floor(w/this.boxSize)
        this.gridRows = Math.floor(h/this.boxSize)

        container.style.gridTemplateColumns = `repeat(${this.gridColumns}, ${this.boxSize}px)`
        container.style.gridTemplateRows = `repeat(${this.gridRows}, ${this.boxSize}px)`
    }

    getDimensions() {
        return [this.gridColumns, this.gridRows]
    }

    addBox(x, y) {
        let box = new Box(x, y)
        this.setBox(x, y, box)
        container.appendChild(box.getElement())
    }

    setBox(x, y, box) {
        this.boxes[`${x}x${y}`] = box
    }

    getBox(x, y) {
        return this.boxes[`${x}x${y}`]
    }

    killBox(x, y) {
        let box = this.getBox(x, y)
        box.destroyEffect()
        this.getSprites(x, y).forEach(sprite => {
            sprite.destroy()
        })
    }

    addSprite(xo, yo, spriteCode) {
        
        let sprite = new Sprite(this, xo, yo, spriteCode)
        sprite.setId(this.sprites.length)
        this.sprites.push(sprite)
        container.appendChild(sprite.getElement())
    }

    getAllSprites() {
        return this.sprites
    }

    getSprites(x, y) {
        return this.sprites.filter(sprite => {
            return equalArray([x, y], sprite.getPosition())
        })
    }

    removeSprite(id) {
        let sprite = removeItemAtIndex(this.sprites, id)
        container.removeChild(sprite.getElement())
    }

    isPositionFree(x, y) {
        let freeSpace = this.getSprites(x, y).length == 0
        let endSpace = x>=0 && x<this.gridColumns && y>=0 && y<this.gridRows
        return freeSpace && endSpace
    }

    loop() {
        this.sprites.forEach(sprite => {
            sprite.loop()
        })
        setTimeout(this.loop.bind(this), this.timout)
    }
}

const game = new Game()

let [gridColumns, gridRows] = game.getDimensions()
for(let x=0; x<gridColumns; x++) {
    for(let y=0; y<gridRows; y++) {
        game.addBox(x, y)
    }
}

game.loop()
game.addSprite(5, 5, 2)
bindKey(game.getAllSprites()[0])


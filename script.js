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

function bindJoyStick(sprite) {
    document.addEventListener("keydown", event => {
        if(event.key=="ArrowUp" || event.key=="w") {sprite.setVelocity(0, -1)}
        if(event.key=="ArrowDown" || event.key=="s") {sprite.setVelocity(0, 1)}
        if(event.key=="ArrowRight" || event.key=="d") {sprite.setVelocity(1, 0)}
        if(event.key=="ArrowLeft" || event.key=="a") {sprite.setVelocity(-1, 0)}
    })
}

function range(min, max) {
    let arr = []
    for(let i=min; i<=max; i++) {
        arr.push(i)
    }
    return arr
 }

class Sprite {

    constructor(game, x, y, spriteCode) {

        this.game = game

        this.living = true
        this.spriteCode = spriteCode

        this.element = document.createElement("div")
        this.element.classList.add("sprite", `code${spriteCode}`)

        this.skipMove = 0
        this.maxSkipMove = 1

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

    getCode() {
        return this.spriteCode
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

    setMaxSkipMove(maxSkipMove) {
        this.maxSkipMove = maxSkipMove
    }

    move() {
        if(this.skipMove >= this.maxSkipMove) {
            let [x, y] = this.getNextPosition()
            this.setPosition(x, y)
            this.updateElement()
            this.skipMove = 0
        }
        else {
            this.skipMove++
        }
    }

    destroy() {
        console.log('hey')
        this.preDeath()
        this.game.removeSprite(this.id)
        delete this
    }

    setId(id) {
        this.id = id
    }

    preDeath() { }

    loop() {
        this.updateElement()
        if(this.canMove()) {
            this.move()
        }
    }
}

class Wall extends Sprite {

    constructor(game, x, y) {
        super(game, x, y, 1)
        this.getElement().addEventListener("click", event => {
            game.killBox(x, y)
        })
    }
}

class AttackWall extends Wall {

    constructor(game, x, y) {

        super(game, x, y)

        this.attackCount = 0
        this.attackMaxCount = 15

        this.xRange = []
        this.yRange = []

        this.range = 1;
        
        this.setAttackRange()
        this.bindWheel()
    }

    getRangeIndexes() {
        let ranges = []
        for(let xCord of this.xRange) {
            if(xCord!=0) {ranges.push([this.x+xCord, this.y])}
        }
        for(let yCord of this.yRange) {
            if(yCord!=0){ranges.push([this.x, this.y+yCord])}
        }
        return ranges.filter(range => {
            return this.game.isBoxAvailable(range[0], range[1])
        })
    }

    bindWheel() {
        this.getElement().addEventListener("wheel", event => {
            this.range -= Math.sign(event.deltaY)
            if(this.range < 1) {
                this.range = 1
            }
            if(this.range > Math.max(...this.game.getDimensions())) {
                this.range = Math.max(...this.game.getDimensions())
            }
            this.setAttackRange()
        })
    }

    highlightRange() {
        for(let index of this.getRangeIndexes()) {
            this.game.highlightBox(index[0], index[1])
        }
    }

    removeHighlightRange() {
        for(let index of this.getRangeIndexes()) {
            this.game.removeHighlightBox(index[0], index[1])
        }
    }

    setAttackRange() {
        this.removeHighlightRange()
        let roundRange = Math.round(this.range)
        this.xRange = range(-roundRange, roundRange)
        this.yRange = range(-roundRange, roundRange)
        this.highlightRange()
    }

    preDeath() {
        this.removeHighlightRange()
    }

    loop() {
        this.updateElement()
        this.highlightRange()
        if(this.attackCount<this.attackMaxCount) {
            this.attackCount++
            return
        }
        this.attackCount = 0
        for(let index of this.getRangeIndexes()) {
            this.game.killBox(index[0], index[1])
        }
    }
}

class Shark extends Sprite {

    constructor(game, x, y, target) {
        super(game, x, y, 3)
        this.target = target
        this.switchWatcher = 0
        this.switchMax = 5
        this.setMaxSkipMove(2)
    }

    loop() {
        if(this.canMove()) {
            this.move()
        }
        this.steerX()
        let [xn, yn] = this.getNextPosition()
        if(xn==this.target.x && yn==this.target.y) {
            this.game.killBox(xn, yn)
        }
    }

    steerX() {
        if(this.switchWatcher >= this.switchMax) {
            this.switchWatcher = 0
            this.steerY()
            return
        }
        this.switchWatcher++
        let x = this.target.x
        if(x>this.x) {this.setVelocity(1, 0)}
        if(x<this.x) {this.setVelocity(-1, 0)}
        if(x==this.x) {
            this.steerY()
            this.switchWatcher = this.switchMax
        }
    }

    steerY() {
        if(this.switchWatcher >= this.switchMax) {
            this.switchWatcher = 0
            this.steerX()
            return
        }
        this.switchWatcher++
        let y = this.target.y
        if(y>this.y) {this.setVelocity(0, 1)}
        if(y<this.y) {this.setVelocity(0, -1)}
        if(y==this.y) {
            this.steerX()
            this.switchWatcher = this.switchMax
        }
    }
}

class Box {
    
    constructor(game, x, y) {

        this.defaultColor = "#0d61ff"
        this.highlightedColor = "#6498fa"
        this.killColor = "#ff5e5e"

        this.game = game
        this.element = document.createElement("div")
        this.element.classList.add("box")
        this.element.style.gridArea = `${y+1} / ${x+1} / ${y+2} / ${x+2}`
        this.element.style.background = this.defaultColor

        this.x = x
        this.y = y

        this.highlighted = false

        this.bindClick()
    }

    getElement() {
        return this.element;
    }

    getPosition() {
        return [this.x, this.y]
    }

    destroyEffect() {

        let element = this.getElement()

        element.style.transition = ""
        element.style.backgroundColor = this.killColor
        setTimeout((() => {
            element.style.transition = "background-color 0.6s ease-out"
            element.style.backgroundColor = this.highlighted?this.highlightedColor:this.defaultColor
        }).bind(this), 100)
    }

    highlight() {

        if(this.highlighted) {
            return
        }
        let element = this.getElement()
        this.highlighted = true
        element.style.background = this.highlightedColor
    }

    removeHighlight() {
        
        if(!this.highlight) {
            return
        }
        let element = this.getElement()
        this.highlighted = false
        element.style.background = this.defaultColor
    }

    bindClick() {
        this.element.addEventListener("click", event => {
            this.game.addAttackWall(this.x, this.y)
        })
    }
}

class Game {

    constructor() {
        
        this.sprites = []
        this.boxes = {}

        this.timout = 100
        this.boxSize = 50

        this.sharkCount = 0
        this.sharkMaxCount = 80

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
        let box = new Box(this, x, y)
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
            if(sprite!=undefined) {
                sprite.destroy()
            }
        })
    }

    highlightBox(x, y) {
        let box = this.getBox(x, y)
        box.highlight()
    }

    removeHighlightBox(x, y) {
        let box = this.getBox(x, y)
        box.removeHighlight()
    }

    setMainCharacter(xo, yo) {
        let main = new Sprite(this, xo, yo, 2)
        main.setId(this.sprites.length)
        main.preDeath = () => {
            location.reload()
        }
        this.sprites.push(main)
        container.appendChild(main.getElement())
        return main
    }

    addSprite(xo, yo, spriteCode) {
        let sprite = new Sprite(this, xo, yo, spriteCode)
        sprite.setId(this.sprites.length)
        this.sprites.push(sprite)
        container.appendChild(sprite.getElement())
    }

    addWall(xo, yo) {
        let wall = new Wall(this, xo, yo)
        wall.setId(this.sprites.length)
        this.sprites.push(wall)
        container.appendChild(wall.getElement())
    }

    addAttackWall(xo, yo) {
        let awall = new AttackWall(this, xo, yo)
        awall.setId(this.sprites.length)
        this.sprites.push(awall)
        container.appendChild(awall.getElement())
    }

    addShark(xo, yo, target) {
        let shark = new Shark(this, xo, yo, target)
        shark.setId(this.sprites.length)
        this.sprites.push(shark)
        container.appendChild(shark.getElement())
    }

    getAllSprites() {
        return this.sprites
    }

    getSpritesByCode(spriteCode) {
        return this.sprites.filter(sprite => {
            if(sprite == undefined) {
                return false
            }
            return spriteCode == sprite.getCode()
        })
    }

    getSprites(x, y) {
        return this.sprites.filter(sprite => {
            if(sprite == undefined) {
                return false
            }
            return equalArray([x, y], sprite.getPosition())
        })
    }

    removeSprite(id) {
        container.removeChild(this.sprites[id].getElement())
        this.sprites[id] = undefined
    }

    isPositionFree(x, y) {
        let freeSpace = this.getSprites(x, y).length == 0
        let endSpace = x>=0 && x<this.gridColumns && y>=0 && y<this.gridRows
        return freeSpace && endSpace
    }

    isBoxAvailable(x, y) {
        return x>=0 && x<this.gridColumns && y>=0 && y<this.gridRows
    }

    start() {
        let main = game.setMainCharacter(0, 0)
        this.main = main
        let [columns, rows] = this.getDimensions()
        this.addShark(columns-1, rows-1, main)
        this.addShark(0, rows-1, main)
        this.addShark(columns-1, 0, main)
        game.loop()
        bindJoyStick(main)
    }

    loop() {
        if(this.sharkCount>=this.sharkMaxCount) {
            let [columns, rows] = this.getDimensions()
            this.addShark(columns-1, rows-1, this.main)
            this.sharkCount = 0
        }
        this.sharkCount++
        this.sprites.forEach(sprite => {
            if(sprite != undefined)
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

game.start()


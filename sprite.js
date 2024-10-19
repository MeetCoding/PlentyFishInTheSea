const spriteCodes = {
    0: "box",
    1: "wall",
    2: "main",
    3: "shark",
}

class MainSprite extends Sprite {

    constructor() {
        let xo = Math.floor(gridColumns/2)
        let yo = Math.floor(gridRows/2)
        super(xo, yo, 2)
        this.bindKey()
    }

    bindKey() {
        document.addEventListener("keydown", event => {
            if(event.key=="ArrowUp" || event.key=="w") {
                this.velx = 0
                this.vely = -1
            }
            if(event.key=="ArrowDown" || event.key=="s") {
                this.velx = 0
                this.vely = 1
            }
            if(event.key=="ArrowRight" || event.key=="d") {
                this.velx = 1
                this.vely = 0
            }
            if(event.key=="ArrowLeft" || event.key=="a") {
                this.velx = -1
                this.vely = 0
            }
        })
    }
}

class Wall extends Sprite {
    
    constructor(xo, yo) {
        super(xo, yo, 1)
    }
}

let main = new MainSprite()
// let wall = new Wall(5,5)
setTimeout(() => destroyBox(5,5), 5000)
// function printData() {
//     console.log(data)
//     setTimeout(printData, 1000)
// }
// printData()
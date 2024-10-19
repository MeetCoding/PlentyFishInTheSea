const spriteCodes = {
    0: "box",
    1: "wall",
    2: "main",
    3: "shark",
}

class Sprite {

    constructor(xo, yo, spriteCode) {
        
        this.element = document.createElement("div")
        this.element.classList.add(spriteCodes[spriteCode], "sprite", `${xo}x${yo}`)
        container.appendChild(this.element)

        this.x = xo
        this.y = yo

        this.spriteCode = spriteCode

        this.velx = 0
        this.vely = 0

        this.timeout = 200

        this.repaint()
        this.move()
    }

    repaint() {
        let x = this.x
        let y = this.y
        this.element.style.gridArea = `${y+1} / ${x+1} / ${y+2} / ${x+2}`
    }

    move() {
        data[this.y][this.x] = 0
        if(this.canMove()) {
            this.x += this.velx
            this.y += this.vely
        }
        data[this.y][this.x] = this.spriteCode
        this.repaint()
        console.log(data)
        setTimeout(this.move.bind(this), this.timeout)
    }

    canMove() {
        return true
    }
}

let sprite = new Sprite(5,10,2)

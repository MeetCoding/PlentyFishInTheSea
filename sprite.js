class Sprite {

    constructor(xo, yo, className) {
        
        this.element = document.createElement("div")
        this.element.classList.add(className, "sprite")
        container.appendChild(this.element)

        this.x = xo
        this.y = yo

        this.velx = 0
        this.vely = 0

        this.timeout = 200

        this.repaint()
    }

    repaint() {
        let x = this.x
        let y = this.y
        this.element.style.gridArea = `${y+1} / ${x+1} / ${y+2} / ${x+2}`
    }

    move() {
        if(this.canMove()) {
            this.x += this.velx
            this.y += this.vely
        }
        this.repaint()
        setTimeout(this.move.bind(this), this.timeout)
    }

    canMove() {
        return true
    }
}

let sprite = new Sprite(10,10)

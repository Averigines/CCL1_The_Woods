import GameObject from "./gameObject.js";
import { createLaser } from "./script.js";

class Enemy_1 extends GameObject {
    constructor(context, x, y, width, height, velocity, CONFIG, dx) {
        super(context, x, y, width, height, velocity, CONFIG);
        this.dx = dx;
        this.laserIsShot = false;
        this.lasers = [];
        this.age = 0;
        this.creationTime = performance.now();
        this.spriteOffset = 32;

        this.flightDiff = 1.5;
        this.dy = 0;
        this.originalY = this.y;
        this.goingUp = true;
        this.gravity = 0.05;
        
        this.laserWidth = 16;
        this.laserHeight = 16;
    }

    init() {
        this.sprites = {
            src: "./assets/enemy_1.png",
            frames: 7,
            fps: 6,
            image: null,
            frameSize: {
                width: 64,
                height: 32,
            }
        };
        this.sprites.image = new Image();
        this.sprites.image.src = this.sprites.src;
    }

    update(delta) {
        this.age = (performance.now() - this.creationTime) / 1000;
        if (this.dx === 0) {
            this.x -= delta * this.velocity;
        }
        if (this.dx === 1) {
            this.x += delta * this.velocity;
        }

        //changes direction of gravity to make y-position loop
        if (this.y === this.originalY) {
            this.dy = 0;
            if (this.goingUp === true) {
                this.goingUp = false;
                this.dy += this.flightDiff;
            }
            else {
                this.goingUp = true;
                this.dy -= this.flightDiff;
            }
        }

        if (this.goingUp) {
            this.dy += this.gravity;
        }
        else {
            this.dy -= this.gravity;
        }

        this.y += this.dy;

        // corrects y-value to be exactly on starting value
        if (this.goingUp && this.y >= this.originalY) {
            this.y = this.originalY;
        }
        if (!this.goingUp && this.y <= this.originalY) {
            this.y = this.originalY;
        }

        let coords = this.getSpriteCoords(this.sprites);
        if (coords.x === this.sprites.frameSize.width && this.laserIsShot === false) {
            if (this.dx === 1) {
                createLaser(this.context, this.x + this.width/2 + 10, this.y + 8, this.laserWidth, this.laserHeight, 0.2, this.CONFIG, this.dx);
            }
            if (this.dx === 0) {
                createLaser(this.context, this.x - this.width/2 - 10, this.y + 8, this.laserWidth, this.laserHeight, 0.2, this.CONFIG, this.dx);
            }
            this.laserIsShot = true;
        }
        if (coords.x === this.sprites.frameSize.width * 2 && this.laserIsShot === true) {
            this.laserIsShot = false;
        }
    }
    

    render() {
        super.render();
        
        this.context.translate(this.x, this.y);
        
        let coords = this.getSpriteCoords(this.sprites);
        if (this.dx === 1) {
            this.context.scale(-1, 1);
            coords.x -= 1;
        }

        this.context.drawImage(
            this.sprites.image,
            coords.x,
            coords.y,
            coords.w,
            coords.h,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height);
            
        this.context.resetTransform();
    }

    onRemove(removeCallback) {
        this.removeCallback = removeCallback;
    }

    getBoundingBox() {
        let bb = super.getBoundingBox();
        if (this.dx === 1) {
            bb.x += this.spriteOffset;
        }
        bb.w -= this.spriteOffset;
        bb.y += 5;
        bb.h -= 10;
        return bb;
    }
}


class Laser extends GameObject {
    constructor(context, x, y, width, height, velocity, CONFIG, dx) {
        super(context, x, y, width, height, velocity, CONFIG);
        this.dx = dx;
        this.age = 0;
        this.creationTime = performance.now();
    }

    init() {
        this.image = new Image();
        this.image.src = "./assets/laser.png";
    }

    update(delta) {
        this.age = (performance.now() - this.creationTime) / 1000;
        if (this.dx === 0) {
            this.x -= delta * this.velocity;
        }
        if (this.dx === 1) {
            this.x += delta * this.velocity;
        }
        this.y += delta * this.velocity;
    }

    render() {
        this.context.translate(this.x, this.y);
        if (this.dx === 1) {
            this.context.scale(-1, 1);
        }
        this.context.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
        this.context.resetTransform();
    }
}

export default Enemy_1;
export {Laser};
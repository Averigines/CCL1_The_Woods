import GameObject from "./gameObject.js";
import {createTear, randomNumberBetween} from "./script.js";

class Enemy_2 extends GameObject {
    constructor(context, x, y, width, height, velocity, CONFIG, dx, currSprite) {
        super(context, x, y, width, height, velocity, CONFIG);
        this.dx = dx;
        this.dy = 0;
        this.age = 0;
        this.creationTime = performance.now();
        this.currSprite = currSprite;
        this.startTimeSprite = undefined;
        this.totalTimeSprite = 0;
        this.timeOnSprite =  {
            sprite_1: 1000,
            sprite_2: 800,
        }
        this.jumpHeight = 6.5;
        this.gravity = 0.3;
        this.jumping = false;

        this.tearWidth = 8;
        this.tearHeight = 8;
    }

    init() {
        this.sprites = {
            src: "./assets/enemy_2.png",
            frames: 3,
            fps: 6,
            image: null,
            frameSize: {
                width: 32,
                height: 32,
            }
        };
        this.sprites.image = new Image();
        this.sprites.image.src = this.sprites.src;
    }

    update(delta) {
        this.age = (performance.now() - this.creationTime) / 1000;

        // checks for current sprite and calculates the total time on the same sprite for checking if next sprite should be loaded
        if (this.currSprite === 0) {
            if (this.startTimeSprite === undefined) {
                this.startTimeSprite = performance.now();
            }
            this.totalTimeSprite = performance.now() - this.startTimeSprite;
            if (this.totalTimeSprite > this.timeOnSprite.sprite_1) {
                this.currSprite = 1;
                this.totalTimeSprite = 0;
                this.startTimeSprite = undefined;
            }
        }
        else if (this.currSprite === 1) {
            if (this.startTimeSprite === undefined) {
                this.startTimeSprite = performance.now();
            }
            this.totalTimeSprite = performance.now() - this.startTimeSprite;
            if (this.totalTimeSprite > this.timeOnSprite.sprite_2) {
                this.currSprite = 2;
                this.totalTimeSprite = 0;
                this.startTimeSprite = undefined;
            }
        }
        else if (this.currSprite === 2) {
            if (this.jumping === false) {
                this.jumping = true;
                this.dy -= this.jumpHeight;
            }
            this.dy += this.gravity;
            if (this.dx === 0) {
                this.x -= delta * this.velocity;
            }
            else if (this.dx === 1) {
                this.x += delta * this.velocity;
            }
        }

        this.y += this.dy;
        if (this.y + this.height / 2 > this.CONFIG.groundHeight) {
            this.jumping = false;
            this.currSprite = 0;
            this.y = this.CONFIG.groundHeight - this.height / 2;
            this.dy = 0;
        }

        // creates a projectile at random times
        if (randomNumberBetween(1,500) === 1) {
            if (this.dx === 1) {
                if (this.currSprite != 1) {
                    createTear(this.context, this.x + this.width/2 - 10, this.y - 15, this.tearWidth, this.tearHeight, 0.3, this.CONFIG, this.dx, this.currSprite);
                }
                else {
                    createTear(this.context, this.x + this.width/2 - 30, this.y - 25, this.tearWidth, this.tearHeight, 0.3, this.CONFIG, this.dx, this.currSprite);
                }
            }
            if (this.dx === 0) {
                if (this.currSprite != 1) {
                    createTear(this.context, this.x - this.width/2 + 10, this.y - 15, this.tearWidth, this.tearHeight, 0.3, this.CONFIG, this.dx, this.currSprite);
                }
                else {
                    createTear(this.context, this.x - this.width/2 + 30, this.y - 25, this.tearWidth, this.tearHeight, 0.3, this.CONFIG, this.dx, this.currSprite);
                }
            }
        }

    }

    render() {
        super.render();
        this.context.translate(this.x, this.y);
        if (this.dx === 0) {
            this.context.scale(-1, 1);
        }

        let coords = this.getSpriteCoords(this.sprites);
        coords.x = this.currSprite * this.sprites.frameSize.width;

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

    getBoundingBox() {
        let bb = super.getBoundingBox();
        bb.x += bb.w/4;
        bb.w -= bb.w/2;
        bb.y += 5;
        return bb;
    }
    
    onRemove(removeCallback) {
        this.removeCallback = removeCallback;
    }
}

class Tear extends GameObject {
    constructor(context, x, y, width, height, velocity, CONFIG, dx, currSprite) {
        super(context, x, y, width, height, velocity, CONFIG);
        this.dx = dx;
        this.dy = 0;
        this.currSprite = currSprite;

        this.gravity = 0.03;
        this.spitHeight = 2;
    }

    init() {
        this.image = new Image();
        this.image.src = "./assets/bloody_tear.png";
    }

    update(delta) {
        if (this.dx === 0) {
            this.x -= delta * this.velocity;
        }
        else if (this.dx === 1) {
            this.x += delta * this.velocity;
        }

        // projectile starts going upward if enemy at time of creation was looking upwards
        if (this.currSprite === 1) {
            this.dy -= this.spitHeight;
            this.currSprite = undefined;
        }

        this.dy += this.gravity;
        this.y += this.dy;
    }

    render() {
        this.context.translate(this.x, this.y);
        if (this.dx === 0) {
            this.context.scale(-1, 1);
        }
        this.context.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
        this.context.resetTransform();
    }
}

export default Enemy_2;
export {Tear};
import GameObject from "./gameObject.js";
import RandomDispatch from "./randomDispatch.js";
import {gameOver} from "./script.js";

class Player extends GameObject{
    constructor(context, x, y, width, height, velocity, CONFIG) {
        super(context, x, y, width, height, velocity, CONFIG);
        
        this.dx = 0;
        this.dy = 0;
        this.lastX = 1; // saves previous direction if idle
        this.status = "idle";

        this.currentKeys = {};

        this.jumpHeight = {
            smallJump: 11,
            bigJump: 15,
        }

        this.onGround = true;
        this.originalY = this.y;
        this.gravity = 0.5;

        this.startTimeDead;
        this.totalTimeDead;
        this.timePerSpriteDead = 500;
        this.isDead = false;

        this.startTimeWin;
        this.totalTimeWin;
        this.timePerSpriteWin = 400;
        this.isWin = false;
    }

    init() {
        document.addEventListener("keydown", (event) => {
            if (event.code === "ArrowRight" || event.code === "ArrowLeft" || event.code === "ArrowUp" || event.code === "ArrowDown" || event.code === "Space") {
                event.preventDefault();
                this.currentKeys[event.code] = true;
            }
        });

        document.addEventListener("keyup", (event) => {
            this.currentKeys[event.code] = false;
        });

        this.sprites = {
            idle: {
                src: "./assets/character_idle.png",
                frames: 4,
                fps: 4,
                image: null,
                frameSize: {
                    width: 32,
                    height: 32,
                },
            },

            running: {
                src: "./assets/character_running.png",
                frames: 4,
                fps: 8,
                image: null,
                frameSize: {
                    width: 32,
                    height: 32,
                },
            },

            death: {
                src: "./assets/character_death.png",
                frames: 5,
                fps: 3,
                image: null,
                frameSize: {
                    width: 32,
                    height: 32,
                },
            },

            win: {
                src: "./assets/character_win.png",
                frames: 8,
                fps: 3,
                image: null,
                frameSize: {
                    width: 32,
                    height: 35,
                },
            },

            duck: {
                src: "./assets/character_duck.png",
                frames: 1,
                fps: 1,
                image: null,
                frameSize: {
                    width: 32,
                    height: 32,
                }
            }
        };

        Object.values(this.sprites).forEach(sprite => {
            sprite.image = new Image();
            sprite.image.src = sprite.src;
        });
    }

    update(delta) {
        // checks for facing and sets correct status
        if (!this.isDead && !this.isWin) {
            if (this.currentKeys["ArrowDown"]) {
                this.status = "duck";
            }

            if (!this.currentKeys["ArrowDown"]) {
                if (this.currentKeys["ArrowRight"]) {
                    this.dx = 1;
                }
                else if (this.currentKeys["ArrowLeft"]) {
                    this.dx = -1;
                }
                else {
                    this.dx = 0;
                    this.status = "idle";
                }
    
                if (this.dx !== 0) {
                    this.status = "running";
                    this.lastX = this.dx;
                }
            }
        }
        
        // checks for bottom boundary
        if (this.y + this.height / 2 > this.CONFIG.groundHeight) {
            this.onGround = true;
            this.y = this.originalY;
        }

        // removes jumpForce and gravity, if player stands on platform or ground
        if (this.onGround) {
            this.dy = 0;
        }

        // initiates jumping
        if ((this.currentKeys["Space"] || this.currentKeys["ArrowUp"]) && this.onGround && !this.isDead && !this.isWin && this.status !== "duck") {
            this.onGround = false;
            if(this.currentKeys["Space"]) {
                this.dy -= this.jumpHeight.bigJump;
            }
            else if (this.currentKeys["ArrowUp"]) {
                this.dy -= this.jumpHeight.smallJump;
            }
        }

        // applies gravity whenever the player is in the air
        if (this.onGround === false) {
            this.dy += this.gravity;
        }
    
        if (this.isDead) {
            this.totalTimeDead = performance.now() - this.startTimeDead;
            if (this.totalTimeDead > this.sprites.death.frames * this.timePerSpriteDead) {
                // do the Game Over screen function
                gameOver();
            }
        }

        if (this.isWin) {
            console.log(this.totalTimeWin);
            console.log(this.startTimeWin);
            this.totalTimeWin = performance.now() - this.startTimeWin;
            if (this.totalTimeWin > this.sprites.win.frames * this.timePerSpriteWin) {
                gameOver();
            }
        }

        if (this.isDead || this.isWin || this.status === "duck") {
            this.dx = 0;
        }

        this.x += delta * this.dx * this.velocity;
        this.y += this.dy;

        // checks for right and left boundary
        if (this.x + this.width/2 > this.CONFIG.width) {
            this.x = this.CONFIG.width - this.width/2;
        }
        if (this.x - this.width/2 < 0) {
            this.x = 0 + this.width/2;
        }
    }

    render() {
        super.render();
        this.context.translate(this.x, this.y);
        this.context.scale(this.lastX, 1);

        let coords = this.getSpriteCoords(this.sprites[this.status]);
        
        // adjusts x-coord of spritesheet to only have one loop throguh the spritesheet on winning and losing the game
        if (this.isDead) {
            coords.x = Math.floor(this.totalTimeDead / this.timePerSpriteDead) * this.sprites.death.frameSize.width;
            if (coords.x > (this.sprites.death.frames - 1) * this.sprites.death.frameSize.width) {
                coords.x = (this.sprites.death.frames - 1) * this.sprites.death.frameSize.width;
            }
        }

        if (this.isWin) {
            coords.x = Math.floor(this.totalTimeWin / this.timePerSpriteWin) * this.sprites.win.frameSize.width;
            if (coords.x > (this.sprites.win.frames - 1) * this.sprites.win.frameSize.width) {
                coords.x = (this.sprites.win.frames - 1) * this.sprites.win.frameSize.width;
            }
        }

        this.context.drawImage(
            this.sprites[this.status].image,
            coords.x,
            coords.y,
            coords.w,
            coords.h,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height,
        )
        this.context.resetTransform();
    }

    // checks for collision with platform
    collisionDirection(platform, direction) {
        //console.log(direction);

        if (direction === "top") {
            this.y = platform.y - platform.height*2.5 + 1;
            this.onGround = true;
        }

        else if (direction === "bottom") {
            this.y = platform.y + platform.height*2.5;
            this.dy = 0; // removes jumpForce to only apply gravity
        }
    
        else if (direction === "right") {
            this.x = platform.x - (platform.width/2 + this.width / 4);
            this.onGround = false;
        }
    
        else if (direction === "left") {
            this.x = platform.x + platform.width/2 + this.width / 4;
            this.onGround = false;
        }
    }

    getBoundingBox() {
        let bb = super.getBoundingBox();

        bb.x += bb.w/4;
        bb.w -= bb.w/2;
        
        if (this.status === "duck") {
            bb.y += 25;
            bb.h -= 25;
        }
        return bb;
    }

    onDeath() {
        this.status = "death";
        this.isDead = true;
        this.startTimeDead = performance.now();
    }

    onWin() {
        this.status = "win";
        this.isWin = true;
        this.startTimeWin = performance.now();
    }
}

export default Player;
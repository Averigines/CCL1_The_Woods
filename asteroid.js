import GameObject from "./gameObject.js";

class Asteroid extends GameObject{
    constructor(context, x, y, width, height, velocity, CONFIG, dx) {
        super(context, x, y, width, height, velocity, CONFIG);
        this.dx = dx;
        this.age = 0;
        this.creationTime = performance.now();
    }

    init() {
        this.sprites = {
            src: "./assets/asteroid.png",
            frames: 4,
            fps: 10,
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
        if (this.dx === 0) {
            this.x -= delta * this.velocity * 0.5;
        }

        if (this.dx === 1) {
            this.x += delta * this.velocity * 0.5;
        }
        this.y += delta * this.velocity;

    }

    render() {
        super.render();
        
        this.context.translate(this.x, this.y);
        if (this.dx === 1) {
            this.context.scale(-1, 1);
        }

        let coords = this.getSpriteCoords(this.sprites);
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
}

export default Asteroid;
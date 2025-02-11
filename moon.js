import GameObject from "./gameObject.js";

class Moon extends GameObject{
    constructor(context, x, y, width, height, velocity, CONFIG) {
        super(context, x, y, width, height, velocity, CONFIG);

        this.goingDown = false;
        this.velocityX = 0.25;
        this.velocityXRatio = 128;
        this.curve = 1.8;
    }

    init() {
        this.moonImage = new Image();
        this.moonImage.src = "./assets/moon.png";
    }

    update(delta) {
        this.x -= delta * this.velocity;
        this.y -= delta * this.velocity * this.velocityX * this.curve;
        this.velocityX -= this.velocity / this.velocityXRatio;
    }

    render() {
        super.render();
        this.context.translate(this.x, this.y);
        this.context.drawImage(this.moonImage, -this.width/2, -this.height/2, this.width, this.height);
        this.context.resetTransform();
    }
}

export default Moon;

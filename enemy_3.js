import GameObject from "./gameObject.js";

class Enemy_3 extends GameObject {
    constructor(context, x, y, width, height, velocity, CONFIG) {
        super(context, x, y, width, height, velocity, CONFIG);

        this.gravity = 0.006;
        this.dy = this.velocity;
        
        this.age = 0;
        this.creationTime = performance.now();
    }

    init() {
        this.image = new Image();
        this.image.src = "./assets/enemy_3.png"
    }

    update(delta) {
        this.age = (performance.now() - this.creationTime) / 1000;
        this.dy -= this.gravity;
        this.y += this.dy * delta;
    }

    render() {
        super.render();
        
        this.context.translate(this.x, this.y);
        this.context.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);

        this.context.resetTransform();
    }

    onRemove(removeCallback) {
        this.removeCallback = removeCallback;
    }
}

class WebString extends GameObject {
    constructor(context, x, y, width, height, velocity, CONFIG) {
        super(context, x, y, width, height, velocity, CONFIG);

        this.gravity = 0.006;
        this.dy = this.velocity;

        this.age = 0;
        this.creationTime = performance.now();
    }

    init() {
        this.image = new Image();
        this.image.src = "./assets/webString.png";
    }

    update(delta) {
        this.age = (performance.now() - this.creationTime) / 1000;
        this.dy -= this.gravity;
        this.height += this.dy * delta;

        if (this.height < 0 && typeof this.removeCallback === "function") {
            this.removeCallback();
        }
    }

    render() {
        super.render();
        
        this.context.translate(this.x, 0);
        this.context.drawImage(this.image, -this.width/2, this.y, this.width, this.height);

        this.context.resetTransform();
    }

    onRemove(removeCallback) {
        this.removeCallback = removeCallback;
    }
}

export default Enemy_3;
export {WebString};
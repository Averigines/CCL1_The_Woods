import GameObject from "./gameObject.js";

class Platform extends GameObject{
    constructor(context, x, y, width, height, velocity, CONFIG) {
        super(context, x, y, width, height, velocity, CONFIG);

    }

    init() {
        this.platformImage = new Image();
        this.platformImage.src = "./assets/platform_2.png";
        
    }

    update(delta) {

    }

    render() {
        super.render();
        this.context.translate(this.x, this.y);
        this.context.drawImage(this.platformImage, -this.width/2, -this.height/2, this.width, this.height);
        this.context.resetTransform();
    }

    getBoundingBox() {
        let bb = super.getBoundingBox();
        bb.y = this.y - this.height/2;
        bb.h = this.height;
        
        return bb;
    }
}

export default Platform;
class GameObject {
    constructor(context, x, y, width, height, velocity, CONFIG) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.CONFIG = CONFIG;

        this.init();
    }

    init() {

    }

    update() {

    }

    render() {
        
    }

    

    getSpriteCoords(sprite) {

        let currentSprite = Math.floor(performance.now() / 1000 * sprite.fps % sprite.frames);

        let coords = {
            x: currentSprite * sprite.frameSize.width,
            y: 0,
            w: sprite.frameSize.width,
            h: sprite.frameSize.height,
        }

        return coords;
    }

    getBoundingBox() {
        return {
            x: this.x - this.width/2,
            y: this.y - this.height/2,
            w: this.width,
            h: this.height
        }
    }
}

export default GameObject;
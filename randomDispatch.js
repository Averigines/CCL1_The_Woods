import randomNumberBetween from "./script.js";

class RandomDispatch {

    constructor(callback, options = {min: 1000, max: 5000}) {

        if(typeof callback !== "function") throw Error("Callback must be a function!");

        this.callback = callback;
        this.options = options;
        this.running = true;
        
        this.loop();
    }

    loop() {
        if (!this.running) {
            return;
        }
        let wait = randomNumberBetween(this.options.min, this.options.max);
        window.setTimeout(() => {
            this.callback();
            this.loop();
        }, wait);
    }
    
    
}

export default RandomDispatch;
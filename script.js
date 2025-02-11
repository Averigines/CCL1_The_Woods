import Player from "./player.js";
import Moon from "./moon.js";
import Asteroid from "./asteroid.js";
import Platform from "./platform.js";
import Enemy_1, {Laser} from "./enemy_1.js";
import Enemy_2, {Tear} from "./enemy_2.js";
import Enemy_3, {WebString} from "./enemy_3.js";
import RandomDispatch from "./randomDispatch.js";
import GameObject from "./gameObject.js";

// Global variables
let context;
let player;
let moon;
let platform_1;
let platform_2;
let platform_3;
let platform_4;
let platform_5;
let platform_6;
let platform_7;
let platform_8;
let platform_9;
let platform_10;
let platform_11;
let platform_12;

let rdAsteroid;
let rdEnemy_1;
let rdEnemy_2;
let rdEnemy_3;

// Arrays to store gameObjects
let gameObjects = [];
let platforms = [];
let asteroids = [];
let enemies = [];
let projectiles = [];
let totalArrays = [gameObjects, platforms, asteroids, enemies, projectiles];
let totalTime = 0;
let prevTime = 0;
let fpsInterval = 1000/60;

let ticks = 0;
let ticksTime = 0;

let itemList = [];

let activeGame = undefined;

const CONFIG = {
    width: 1200,
    height: 700,
    debug: false,
    groundHeight: 638,
};

let canvas = document.getElementById("canvas");
let startScreen = document.getElementById("startScreen");
let startBtn = document.getElementById("startButton");

startBtn.addEventListener('click', (e) => {
    gameLoad();
  });

function gameLoad() {
    startScreen.style.display = "none";
    canvas.style.display = "block";
    prevTime = performance.now();
    activeGame = true;
    
    init();
}

function gameOver() {
    activeGame = false;
    startScreen.style.display = "block";
    canvas.style.display = "none";

    rdAsteroid.running = false;
    rdEnemy_1.running = false;
    rdEnemy_2.running = false;
    rdEnemy_3.running = false;

    player.status = "idle";
    player.isDead = "false";

    totalArrays.forEach((array) => {
        array.length = 0;
    });
}

function init() {
    context = canvas.getContext("2d");

    canvas.setAttribute("width", CONFIG.width);
    canvas.setAttribute("height", CONFIG.height);

    context.imageSmoothingEnabled = false; // for pixelated look

    player = new Player(context, CONFIG.width/2, CONFIG.groundHeight - 32, 64, 64, 0.3, CONFIG);
    moon = new Moon(context, CONFIG.width + 50, 150, 250, 250, 0.03, CONFIG);
    platform_1 = new Platform(context, CONFIG.width-750, 277, 64, 16, 0, CONFIG);
    platform_2 = new Platform(context, CONFIG.width-900, 387, 64, 16, 0, CONFIG);
    platform_3 = new Platform(context, CONFIG.width-1030, 348, 64, 16, 0, CONFIG);
    platform_4 = new Platform(context, CONFIG.width-210, 227, 64, 16, 0, CONFIG);
    platform_5 = new Platform(context, CONFIG.width-410, 272, 64, 16, 0, CONFIG);
    platform_6 = new Platform(context, CONFIG.width-285, 333, 64, 16, 0, CONFIG);
    platform_7 = new Platform(context, CONFIG.width-140, 412, 64, 16, 0, CONFIG);
    platform_8 = new Platform(context, CONFIG.width-970, 512, 64, 16, 0, CONFIG);
    platform_9 = new Platform(context, CONFIG.width-860, 142, 64, 16, 0, CONFIG);
    platform_10 = new Platform(context, CONFIG.width-510, 167, 64, 16, 0, CONFIG);
    platform_11 = new Platform(context, CONFIG.width-580, 394, 64, 16, 0, CONFIG);
    platform_12 = new Platform(context, CONFIG.width-260, 495, 64, 16, 0, CONFIG);

    itemList = [moon, player, platform_1, platform_2, platform_3, platform_4, platform_5, platform_6, platform_7, platform_8, platform_9, platform_10, platform_11, platform_12];
    itemList.forEach(element => {
        gameObjects.push(element);
        if(element instanceof Platform) {
            platforms.push(element);
        }
    });

    // create Asteroid callback with random x-value and facing
    rdAsteroid = new RandomDispatch(function() {
        let direction = randomNumberBetween(0, 1);
        let spawnX;
        if(direction === 1) {
            spawnX = randomNumberBetween(-50, CONFIG.width / 2);
        }
        else {
            spawnX = randomNumberBetween(CONFIG.width / 2, CONFIG.width + 50);
        }
        let asteroid = new Asteroid(context, spawnX, 0, 64, 64, 0.2, CONFIG, direction);
        asteroid.onRemove(() => {
            removeGameObject(asteroid);
        });
        
        gameObjects.push(asteroid);
        asteroids.push(asteroid);

    }, {min: 4000, max: 7000});

    // create enemy callback with random x- and y-value and facing
    rdEnemy_1 = new RandomDispatch(function() {
        let directionX = randomNumberBetween(0, 1);
        let spawnX;
        if (directionX === 1) {
            spawnX = -50;
        }
        else {
            spawnX = CONFIG.width + 50;
        }
        let spawnY = randomNumberBetween(100, CONFIG.height - 400);

        let enemy_1 = new Enemy_1(context, spawnX, spawnY, 96, 48, 0.15, CONFIG, directionX);
        enemy_1.onRemove(() => {
            removeGameObject(enemy_1);
        });

        gameObjects.push(enemy_1);
        enemies.push(enemy_1);
        
    }, {min: 3000, max: 5000});

    // create enemy callback with random facing
    rdEnemy_2 = new RandomDispatch(function() {
        let directionX = randomNumberBetween(0, 1);
        let spawnX;
        if (directionX === 1) {
            spawnX = -50;
        }
        else {
            spawnX = CONFIG.width + 50;
        }

        let enemy_2 = new Enemy_2(context, spawnX, CONFIG.groundHeight - 16, 64, 64, 0.25, CONFIG, directionX, 0);
        enemy_2.onRemove(() => {
            removeGameObject(enemy_2);
        });
        gameObjects.push(enemy_2);
        enemies.push(enemy_2);
    }, {min: 3000, max: 6000});

    // create enemy callback with random x value
    rdEnemy_3 = new RandomDispatch(function() {
        let spawnX = randomNumberBetween(50, CONFIG.width - 50);
        let enemy_3 = new Enemy_3(context, spawnX, -50, 32, 32, 0.6, CONFIG);
        let webString = new WebString(context, spawnX, -50, 2, 8, 0.6, CONFIG);
        enemy_3.onRemove(() => {
            removeGameObject(enemy_3);
        });
        webString.onRemove(() => {
            removeGameObject(webString);
        });
        gameObjects.push(enemy_3, webString);
        enemies.push(enemy_3);
    }, {min: 3000, max: 5000});

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (!activeGame) {
        return;
    }
    requestAnimationFrame(gameLoop);
    
    totalTime = performance.now();
    let delta = totalTime - prevTime;

    if(delta <= fpsInterval) return;

    delta = fpsInterval + 4;
    prevTime = totalTime - (delta % fpsInterval);
    update(delta);
    render();
}

function update(delta) {
    //console.log(gameObjects);
    //console.log(projectiles);
    gameObjects.forEach(function(gameObject) {
        gameObject.update(delta);
    });

    if (moon.x + 50 < 0 && !player.isDead && !player.isWin) {
        player.onWin();
    }

    let removeItems = []; // gameObjects to be removed

    // removes gameObjects that are out of screen
    gameObjects.forEach((object) => {
        if (object.age > 2) {
            if (object.x - object.width > CONFIG.width) {
                removeItems.push(object);
            }
    
            if (object.x + object.width < 0) {
                removeItems.push(object);
            }

            if (object.y + 100 < 0) {
                removeItems.push(object);
            }
        }
        if (object.y + object.height / 2 > CONFIG.groundHeight && object != player) {
            removeItems.push(object);
        }
    })

    // causes player to die if hit by an enemy
    enemies.forEach((enemy) => {
        if (checkCollisionBetween(enemy, player)) {
            if (!player.isDead && !player.isWin) {
                player.onDeath();
            }
        }
    })

    // removes projectile that hit the player or a platform and causes player to die
    projectiles.forEach((projectile) => {
        if (checkCollisionBetween(projectile, player)) {
            removeItems.push(projectile);
            if (!player.isDead && !player.isWin) {
                player.onDeath();
            }
        }
        platforms.forEach((platform) => {
            if (checkCollisionBetween(projectile, platform)) {
                removeItems.push(projectile);
            }
        })
    })

    // removes asteroid that hit the player and causes player to die
    asteroids.forEach((asteroid) => {
        if (checkCollisionBetween(player, asteroid)) {
            removeItems.push(asteroid);
            if (!player.isDead && !player.isWin) {
                player.onDeath();
            }
        }
    });

    // removes asteroid and platforms if asteroid hits a platform
    platforms.forEach((platform) => {
        let direction = checkCollisionBetween(player, platform);
        if(direction) {
            player.collisionDirection(platform, direction);
        }
        asteroids.forEach((asteroid) => {
            if (checkCollisionBetween(platform, asteroid)) {
                removeItems.push(asteroid, platform);
                if (checkCollisionBetween(player, platform)) {
                    player.onGround = false;
                    player.onPlatform = false;
                }
            }
        })
    });

    removeItems.forEach((item) => {
        removeGameObject(item);
    });
}

function render() {
    context.clearRect(0, 0, CONFIG.width, CONFIG.height);

    //makes boundingboxes visible
    if(CONFIG.debug) {
        gameObjects.forEach((object) => {
            object.context.strokeStyle = "white";
            let boundingBox = object.getBoundingBox();
            object.context.translate(boundingBox.x, boundingBox.y);
            object.context.strokeRect(0, 0, boundingBox.w, boundingBox.h);
            object.context.resetTransform();
        })
    }

    gameObjects.forEach(function(gameObject) {
        gameObject.render();
    });
}

// removes all gameObjects stored in removeItems-Array
function removeGameObject(gameObject) {
    gameObjects.splice(gameObjects.indexOf(gameObject), 1);
    if(gameObject instanceof Asteroid) {
        asteroids.splice(asteroids.indexOf(gameObject), 1);
    }
    if(gameObject instanceof Platform) {
        platforms.splice(platforms.indexOf(gameObject), 1);
    }
    if(gameObject instanceof Enemy_1 || gameObject instanceof Enemy_2 || gameObject instanceof Enemy_3) {
        enemies.splice(enemies.indexOf(gameObject), 1);
    }
    if(gameObject instanceof Laser || gameObject instanceof Tear) {
        projectiles.splice(projectiles.indexOf(gameObject), 1);
    }
}

/*  checks collision between two gameObjects.
    If gameObjects are player and platform, also checks for direction the player is hitting the platform from. */
let checkCollisionBetween = (gameObjectA, gameObjectB) => {
    let bbA = gameObjectA.getBoundingBox();
    let bbB = gameObjectB.getBoundingBox();
    if(bbA.x < bbB.x + bbB.w && bbA.x + bbA.w > bbB.x && bbA.y < bbB.y + bbB.h && bbA.y + bbA.h > bbB.y)
    {
        let xA = bbA.x + bbA.w/2;
        let xB = bbB.x + bbB.w/2;
        let yA = bbA.y + bbA.h/2;
        let yB = bbB.y + bbB.h/2;

        let xDiff = xB - xA;
        let yDiff = yB - yA;

        if (gameObjectA instanceof Player && gameObjectB instanceof Platform || gameObjectB instanceof Player && gameObjectA instanceof Platform) {
            if(Math.abs(xDiff) > Math.abs(yDiff)) {
                if(xDiff > 0) {
                    return "right";
                }
                else {
                    return "left";
                }
            }
            else {
                if(yDiff > 0) {
                    return "top";
                }
                else {
                    return "bottom";
                }
            }
        }
        else {
            return true;
        }       
    }
    else {
        return false;
    }
}

// create a random number between two values
let randomNumberBetween = (minRandomNumber, maxRandomNumber) => {
    return Math.floor(Math.random() * (maxRandomNumber - minRandomNumber + 1) + minRandomNumber);
}

// create an object of the class Laser (try to get it into enemy class with return value to assign to arrays in script.js)
function createLaser(context, x, y, width, height, velocity, CONFIG, dx) {
    let laser_1 = new Laser(context, x, y, width, height, velocity, CONFIG, dx);
    gameObjects.push(laser_1);
    projectiles.push(laser_1);
}

function createTear(context, x, y, width, height, velocity, CONFIG, dx, currSprite) {
    let tear_1 = new Tear(context, x, y, width, height, velocity, CONFIG, dx, currSprite);
    gameObjects.push(tear_1);
    projectiles.push(tear_1);
}

export default randomNumberBetween;
export {createLaser, createTear, randomNumberBetween, gameOver};
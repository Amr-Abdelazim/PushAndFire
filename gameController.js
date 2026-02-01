import Bullet from "./bullet.js";
import { ctx, canvas } from "./canvas.js";
import collisionManager from "./collisionManager.js";
import { Ship } from "./ship.js";
import { randomFloat } from "./utils.js";
import ship from "./ship.js";
class GameController {
    constructor() {
        this.init();
        this._loop = this._loop.bind(this);
        requestAnimationFrame(this._loop);

    }
    init() {
        this.lastTime = 0;
        this.gameObjects = [];
    }
    trigerShake(shakeStrength, shakeTime) {
        this.shakeStrength = shakeStrength;
        this.shakeTime = shakeTime;
        this.maxShakeTime = shakeTime;
    }
    _loop(time) {
        if (!this.lastTime) {
            this.lastTime = time;
            requestAnimationFrame(this._loop);
            return;
        }
        const delta = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.update(delta);
        ctx.save();

        if (this.shakeTime > 0) {
            this.shakeTime -= delta;
            const dx = randomFloat(-1, 1) * this.shakeStrength * (this.shakeTime / this.maxShakeTime);
            const dy = randomFloat(-1, 1) * this.shakeStrength * (this.shakeTime / this.maxShakeTime);

            ctx.translate(dx, dy);
        }

        this.render(ctx);
        ctx.restore();
        requestAnimationFrame(this._loop);
    }
    _checkCollision() {
        for (let i = 0; i < this.gameObjects.length; i++) {
            for (let j = i + 1; j < this.gameObjects.length; j++) {
                const obj1 = this.gameObjects[i].getCollisionInfo?.();
                const obj2 = this.gameObjects[j].getCollisionInfo?.();
                if (!obj1 || !obj2 || !collisionManager.isCollide(obj1, obj2)) continue;

                this.gameObjects[i].collision?.(this.gameObjects[j]);
                this.gameObjects[j].collision?.(this.gameObjects[i], false);

            }
        }
    }
    update(delta) {
        for (let obj of this.gameObjects)
            obj.update?.(delta);
        this.gameObjects = this.gameObjects.filter(obj => {
            if (obj.destroyed) {
                obj.destroy?.();
                return false;
            }
            return true;
        });
        this._checkCollision();
    }
    render(ctx) {
        ctx.fillStyle = "#161925";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let obj of this.gameObjects)
            obj.render?.(ctx);
    }
    addObject(obj) {
        this.gameObjects.push(obj);
    }
}

export default new GameController();
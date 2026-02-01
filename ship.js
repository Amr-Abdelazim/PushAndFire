import inputManager from "./inputManager.js";
import Bullet from "./bullet.js";
import gameController from "./gameController.js";
import { angleLengthVector } from "./utils.js";
import { drawPoint } from "./test.js";
import { canvas } from "./canvas.js";
import EnemyTriangle from "./enemyTriangle.js";
import MovementAttack from "./movementAttack.js";
import PushEffect from "./pushEffect.js";
export class Ship {
    constructor() {
        this.posX = 200;
        this.posY = 200;
        this.angle = 0.5 * Math.PI;
        this.width = 50;
        this.height = 100;
        this.maxSpeed = 1000;
        this.force = 800;
        this.edgeBouncingForce = 100;
        this.velocity = { x: 0, y: 0 };
        this.friction = 0.03;
        this.health = { cur: 700, max: 700 };
        this.pushSamina = { cur: 250, max: 250 };
        this.fireStamina = { cur: 250, max: 250 };
        this.pushCost = 70;
        this.fireCost = 105;
        this.regenerationRate = { pushSamina: 100, fireStamina: 100 };
        this.eyeFramePeriod = 1.7;//seconds
        this.invisable = false;
    }
    setPosition(x, y) {
        this.posX = x;
        this.posY = y;
    }
    getPosision() {
        return { x: this.posX, y: this.posY };
    }
    getCollisionInfo() {
        return { type: 'polygon', points: this._getFourCorners() };
    }
    async sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
    async blinkyEye() {
        if (!this.invisable) return;
        await this.sleep(200);
        this.eyeFrameVisual = !this.eyeFrameVisual;
        this.blinkyEye();
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.posX, this.posY);
        ctx.rotate(this.angle + 0.5 * Math.PI);
        if (this.invisable) {
            if (this.eyeFrameVisual) {
                ctx.strokeStyle = '#F1E7E8';
                ctx.beginPath();
                ctx.rect(-this.width / 2, - this.height / 2, this.width, this.height);
                ctx.stroke();
                ctx.globalAlpha = 0.5;
            }
        }
        ctx.fillStyle = '#235789';
        ctx.fillRect(-this.width / 2, - this.height / 2, this.width, this.height);
        ctx.restore();
    }
    _keyboardControlls(delta) {
        if (inputManager.keyboard.ArrowUp)
            this.posY -= this.maxSpeed * delta;

        if (inputManager.keyboard.ArrowDown)
            this.posY += this.maxSpeed * delta;

        if (inputManager.keyboard.ArrowLeft)
            this.posX -= this.maxSpeed * delta;

        if (inputManager.keyboard.ArrowRight)
            this.posX += this.maxSpeed * delta;
    }
    _updateAngel() {
        const mouse = inputManager.mouse;
        if (!mouse.posY) return;
        const vector = { x: mouse.posX - this.posX, y: mouse.posY - this.posY };
        this.angle = Math.atan2(vector.y, vector.x);

    }
    _mouseControlls(delta) {
        this._updateAngel();
        if (inputManager.mouse.rightBtn && !this.holdingRightBtn) {
            this.push(delta);
            this.holdingRightBtn = true;
        } else if (!inputManager.mouse.rightBtn) {
            this.holdingRightBtn = false;
        }

        if (inputManager.mouse.leftBtn && !this.holdingLeftBtn) {
            this.fire(delta);
            this.holdingLeftBtn = true;
        } else if (!inputManager.mouse.leftBtn) {
            this.holdingLeftBtn = false;
        }

    }
    updateStamina(delta) {
        const pushValue = this.regenerationRate.pushSamina * delta;
        this.pushSamina.cur = Math.min(this.pushSamina.max, this.pushSamina.cur + pushValue);
        const fireValue = this.regenerationRate.fireStamina * delta;
        this.fireStamina.cur = Math.min(this.fireStamina.max, this.fireStamina.cur + fireValue);
    }
    fire(delta) {
        //console.log(this.fireStamina.cur);
        if (this.fireStamina.cur <= this.fireCost) return;
        this.fireStamina.cur = Math.max(0, this.fireStamina.cur - this.fireCost);
        gameController.addObject(new Bullet(this.posX, this.posY, this.angle));
    }
    push(delta) {
        if (this.pushSamina.cur <= this.pushCost) return;
        this.pushSamina.cur = Math.max(0, this.pushSamina.cur - this.pushCost);
        this.velocity.x += this.force * Math.cos(this.angle);
        this.velocity.y += this.force * Math.sin(this.angle);
        const speed = Math.hypot(this.velocity.x, this.velocity.y);
        if (speed > this.maxSpeed) {
            this.velocity.x *= this.maxSpeed / speed;
            this.velocity.y *= this.maxSpeed / speed;
        }

        gameController.addObject(new MovementAttack(this.posX, this.posY));

        //gameController.addObject(new PushEffect(this.posX, this.posY, this.angle, this._getFourCorners()));
    }
    move(delta) {
        this.posX += this.velocity.x * delta;
        this.posY += this.velocity.y * delta;
        const factor = Math.pow(1 - this.friction, delta * 60);
        this.velocity.x *= factor;
        this.velocity.y *= factor;
        this.handleScreenEdges(delta);
    }
    _getFourCorners() {
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        const diagonalAngle = Math.atan2(halfHeight, halfWidth) + 0.5 * Math.PI;
        const length = Math.hypot(halfWidth, halfHeight);
        const ans = [
            angleLengthVector(this.angle + diagonalAngle, length),
            angleLengthVector(this.angle - diagonalAngle, length),
            angleLengthVector(this.angle - Math.PI + diagonalAngle, length),
            angleLengthVector(this.angle + Math.PI - diagonalAngle, length),
        ];
        for (let p of ans) {
            p.x += this.posX;
            p.y += this.posY;
        }
        return ans;
    }
    handleScreenEdges(delta) {
        const corners = this._getFourCorners();
        for (const p of corners) {
            if (p.x <= 0) {
                this.velocity.x = this.edgeBouncingForce;
            }
            else if (p.x >= canvas.width) {
                this.velocity.x = -this.edgeBouncingForce;
            }
            else if (p.y <= 0) {
                this.velocity.y = this.edgeBouncingForce;
            }
            else if (p.y >= canvas.height) {
                this.velocity.y = -this.edgeBouncingForce;
            }
        }
    }

    update(delta) {
        this._mouseControlls(delta);
        this.updateStamina(delta);
        this.move(delta);

    }
    render(ctx) {
        this.draw(ctx);
    }
    hit(hitCost) {
        if (this.invisable) return;
        this.health.cur = Math.max(0, this.health.cur - hitCost);
        this.invisable = true;
        this.eyeFrameVisual = true;
        this.blinkyEye();
        gameController.trigerShake(30, 0.15);
        console.log(this.health.cur);
        setTimeout(() => this.invisable = false, this.eyeFramePeriod * 1000);
    }
    collision(obj, first = true) {


    }

}

export default new Ship();
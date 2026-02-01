import BulletDestroyEffect from "./bulletDestroyEffect.js";
import { canvas } from "./canvas.js";
import EnemyTriangle from "./enemyTriangle.js";
import gameController from "./gameController.js";
export default class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.radius = 30;
        this.angle = angle;
        this.speed = 1300;
    }
    getPosision() {
        return { x: this.x, y: this.y };
    }
    getCollisionInfo() {
        return { type: 'circle', radius: this.radius, pos: this.getPosision() };
    }
    update(delta) {
        this.move(delta);
        if (this.outOfScreen()) {
            this.destroyed = true;
        }
    }
    render(ctx) {
        this.draw(ctx);
    }
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        const grad = ctx.createRadialGradient(this.x, this.y, this.radius * 0.4, this.x, this.y, this.radius);
        grad.addColorStop(0, '#EBFF2B');
        grad.addColorStop(1, '#eaff2b00');
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
    move(delta) {
        this.x += this.speed * Math.cos(this.angle) * delta;
        this.y += this.speed * Math.sin(this.angle) * delta;
    }

    outOfScreen() {
        if (!(this.x <= canvas.width + this.radius && this.x >= -this.radius && this.y <= canvas.height + this.radius && this.y >= -this.radius)) {
            return true;
        }
        return false;
    }
    collision(obj, first = true) {
        if (obj instanceof EnemyTriangle) {
            obj.hit?.(30);
            this.destroy();
        }
    }
    destroy() {
        gameController.addObject(new BulletDestroyEffect(this.x, this.y, this.radius));
        this.destroyed = true;
    }

}


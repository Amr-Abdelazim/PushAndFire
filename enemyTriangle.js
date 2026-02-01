import { angleLengthVector, randomFloat, randomInt } from "./utils.js";
import ship from "./ship.js";
import { Ship } from "./ship.js";
import { canvas } from "./canvas.js";
import DynamicBar from "./dynamicBar.js";
import gameController from "./gameController.js";
import EnemyDestroyEffect from "./enemyDestroyEffect.js";
export default class EnemyTriangle {
    constructor(x, y) {
        this.sideLength = randomInt(40, 80);
        this.baseLength = randomInt(this.sideLength + 10, 1.5 * this.sideLength - 10);
        this.pos = { x, y };
        this.angle = randomFloat(-1, 1) * Math.PI;
        this.color = { 'chase': '#C1292E', 'drift': 'green' };
        this.speed = 300;
        this.movingMode = 'chase';
        this.timeMovingMode = { action: -1, pass: 0 };
        this.hitCost = 50;
        this.health = { cur: 50, max: 50 };
        this.healthBar = new DynamicBar(x, y, this.angle, this.baseLength, this.health.max, this.health.cur);
        this.levelColor = '1B2628';
    }
    getCollisionInfo() {
        return { type: 'polygon', points: this._getHeadPoints() };
    }
    getPosision() {
        return this.pos;
    }
    update(delta) {
        this.move(delta);
        this.handleSreenEdge(delta);
        const p = this._getHeadPoints();
        this.healthBar.update((p[1].x + p[2].x) / 2, (p[1].y + p[2].y) / 2, this.angle, this.health.cur);

    }
    render(ctx) {
        this.draw(ctx);
        this.healthBar.render(ctx);
    }
    _calcHeadAngle() {
        const a = this.baseLength;
        const b = this.sideLength;
        const res = (b * b + b * b - a * a) / (2 * b * b);
        return Math.acos(res);
    }
    _getHeadPoints() {
        //const height = Math.hypot(this.sideLength, -this.baseLength / 2);
        const height = Math.sqrt(this.sideLength * this.sideLength - (this.baseLength / 2) * (this.baseLength / 2));
        const diamiter = Math.hypot(height / 2, this.baseLength / 2);
        const headAngle = this._calcHeadAngle();
        const baseAngle = (Math.PI - headAngle) / 2;
        const a = angleLengthVector(this.angle, height / 2, this.pos);
        const b = angleLengthVector(this.angle + Math.PI - headAngle / 2 - baseAngle / 2, diamiter, this.pos);
        const c = angleLengthVector(this.angle - (Math.PI - headAngle / 2 - baseAngle / 2), diamiter, this.pos);
        return [a, b, c];
    }
    draw(ctx) {
        ctx.save();

        const points = this._getHeadPoints();
        //console.log(points);
        ctx.beginPath();
        ctx.strokeStyle = this.color[this.movingMode];
        ctx.fillStyle = this.levelColor;
        ctx.shadowColor = this.color[this.movingMode];
        ctx.shadowBlur = 50;
        ctx.lineWidth = 3;
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.lineTo(points[2].x, points[2].y);
        ctx.lineTo(points[0].x, points[0].y);
        ctx.fill();
        //ctx.stroke();
        ctx.restore();
    }
    move(delta) {
        this.timeMovingMode.pass += delta;
        if (this.timeMovingMode.action < this.timeMovingMode.pass) {
            this.movingMode = this.movingMode === 'chase' ? 'drift' : 'chase';
            this.timeMovingMode.action = randomInt(5, 10);
            this.timeMovingMode.pass = 0;
        }
        if (this.movingMode === 'chase')
            this._updateAngle();
        this.lastMove = {
            x: this.speed * Math.cos(this.angle) * delta,
            y: this.speed * Math.sin(this.angle) * delta
        }
        this.pos.x += this.lastMove.x;
        this.pos.y += this.lastMove.y;
    }
    _cancelLastMove(val = 0.8) {
        this.pos.x -= this.lastMove.x * val;
        this.pos.y -= this.lastMove.y * val;
        this.lastMove = { x: 0, y: 0 };
    }
    _updateAngle(delta) {
        let shipPos = ship.getPosision();
        this.angle = Math.atan2(shipPos.y - this.pos.y, shipPos.x - this.pos.x);
    }

    handleSreenEdge(delta) {
        const points = this._getHeadPoints();
        for (const p of points) {
            if (p.x <= 0 || p.x >= canvas.width || p.y <= 0 || p.y >= canvas.height) {
                this._updateAngle();
            }
        }
    }
    hit(val) {
        this.health.cur = Math.max(0, this.health.cur - val);
        if (this.health.cur <= 0) this.destroy();
    }
    collision(obj, first = true) {
        if (obj instanceof EnemyTriangle) {
            if (!first) return;
            this._cancelLastMove();
        }
        if (obj instanceof Ship) {
            this._cancelLastMove(0.98);
            obj.hit(this.hitCost);
        }
    }
    destroy() {
        if (this.destroyed) return;
        gameController.addObject(new EnemyDestroyEffect(this.pos.x, this.pos.y, this._getHeadPoints(), this.color[this.movingMode]));
        this.destroyed = true;
    }
}


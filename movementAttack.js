import EnemyTriangle from "./enemyTriangle.js";
export default class MovementAttack {
    constructor(x, y, level = 1) {
        this.posX = x;
        this.posY = y;
        this.speed = 100;
        this.curRadius = 1;
        this.maxRadius = 30;

    }
    getPosision() {
        return { x: this.posX, y: this.posY };
    }
    getCollisionInfo() {
        return { type: 'circle', radius: this.curRadius, pos: this.getPosision() };
    }
    update(delta) {
        this.curRadius += this.speed * delta;
        if (this.curRadius >= this.maxRadius) this.destroy();
    }
    render(ctx) {
        if (this.destroyed) return;
        ctx.save();
        ctx.strokeStyle = '#EBFF2B';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.curRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
    collision(obj, first = true) {
        if (obj instanceof EnemyTriangle) {
            obj.hit?.(2);

        }
    }
    destroy() {
        this.destroyed = true;
    }
}
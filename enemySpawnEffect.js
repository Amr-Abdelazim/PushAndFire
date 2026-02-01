import gameController from "./gameController.js";

export default class EnemySpawnEffect {
    constructor(points, e) {
        this.points = points;
        // console.log(points);
        this.ratios = [];
        for (let i = 0; i < points.length; i++) {
            this.ratios.push(0.1);
        }
        this.speed = 0.8;
        this.e = e;
    }
    update(delta) {
        if (this.ratios[0] >= 1) {
            this.destroy();
            return;
        }
        for (let i = 0; i < this.ratios.length; i++)
            this.ratios[i] += this.speed * delta;
    }
    drawLine(dx, ctx) {
        const nxt = (dx + 1) % this.points.length;
        ctx.moveTo(this.points[dx].x, this.points[dx].y);
        ctx.lineTo(this.points[dx].x + (this.points[nxt].x - this.points[dx].x) * this.ratios[dx],
            this.points[dx].y + (this.points[nxt].y - this.points[dx].y) * this.ratios[dx]);

    }
    render(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        for (let i = 0; i < this.points.length; i++)
            this.drawLine(i, ctx);
        ctx.stroke();
        ctx.restore();
    }
    destroy() {
        this.destroyed = true;
        gameController.addObject(this.e);
    }
}
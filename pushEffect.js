export default class PushEffect {
    constructor(x, y, angle, points) {
        this.posX = x;
        this.posY = y;
        this.angle = angle;
        this.p1 = points[2];
        this.p2 = points[3];
        console.log(points);
        this.lengthWave = 170;
        this.speed = 700;
        this.lines = [{ p1: this.p1, p2: this.p2 }];
    }
    getMagnetPoint() {
        const mid = { x: (this.p1.x + this.p2.x) / 2, y: (this.p1.y + this.p2.y) / 2 };
        return { x: mid.x + Math.cos(this.angle) * this.lengthWave, y: mid.y + Math.sin(this.angle) * this.lengthWave }
    }
    updatePoint(p, delta) {
        return {
            x: p.x + Math.cos(this.angle) * this.speed * delta,
            y: p.y + Math.sin(this.angle) * this.speed * delta
        };
    }
    update(delta) {
        this.lengthWave -= this.speed * delta;
        if (this.lengthWave < 10) {
            this.destroy();
            return;
        }
        this.p1 = this.updatePoint(this.p1, delta);
        this.p2 = this.updatePoint(this.p2, delta);
        // this.lines.push({ p1: this.p1, p2: this.p2 });
    }
    drawCurve(p1, p2, ctx) {
        ctx.moveTo(p1.x, p1.y);
        // console.log(this.p1);
        const magnet = this.getMagnetPoint();
        ctx.quadraticCurveTo(magnet.x, magnet.y, p2.x, p2.y);
        ctx.stroke();
    }
    render(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        this.drawCurve(this.p1, this.p2, ctx);

        ctx.restore();
    }
    destroy() {
        this.destroyed = true;
    }
}
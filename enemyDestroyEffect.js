export default class EnemyDestroyEffect {
    constructor(x, y, points, color = 'red') {
        this.posX = x;
        this.posY = y;
        // console.log(points);
        this.lines = [
            { p1: points[0], p2: points[1] },
            { p1: points[1], p2: points[2] },
            { p1: points[2], p2: points[0] },];
        this.alpha = 1;
        this.tSpeed = 100;
        this.rSpeed = 0.1;
        this.color = color;
        this.time = 0;
    }
    angleToPoint(p, angle, tSpeed, delta) {
        return { x: p.x + Math.cos(angle) * tSpeed * delta, y: p.y + Math.sin(angle) * tSpeed * delta };
    }
    updateLine(line, delta) {

        const mid = { x: (line.p1.x + line.p2.x) / 2, y: (line.p1.y + line.p2.y) / 2 }
        const vec = { x: mid.x - this.posX, y: mid.y - this.posY };
        const tAngle = Math.atan2(vec.y, vec.x);
        return {
            p1: this.angleToPoint(line.p1, tAngle, this.tSpeed, delta),
            p2: this.angleToPoint(line.p2, tAngle, this.tSpeed, delta)
        }

    }
    update(delta) {
        this.time += delta;
        if (this.time > 1) {
            this.destroy();
            return;
        }
        for (let i = 0; i < 3; i++) {

            this.lines[i] = this.updateLine(this.lines[i], delta);
        }
    }
    drawLine(line, ctx) {
        ctx.moveTo(line.p1.x, line.p1.y);
        ctx.lineTo(line.p2.x, line.p2.y);
    }
    render(ctx) {
        ctx.save();
        ctx.beginPath();
        //console.log(this.lines);
        ctx.strokeStyle = this.color;
        for (const line of this.lines)
            this.drawLine(line, ctx);
        ctx.stroke();
        ctx.restore();
    }
    destroy() {
        this.destroyed = true;
    }
}

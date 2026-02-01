
export default class BulletDestroyEffect {
    constructor(x, y, radius) {
        this.posX = x;
        this.posY = y;
        this.radius = radius / 10;
        this.outRadius = radius * 1.2;
        this.alpha = 0.8;
        this.time = 0;
    }
    update(delta) {
        this.outRadius += 14 * delta;
        this.radius += 170 * delta;
        this.alpha = Math.max(this.alpha, this.alpha - 0.04 * delta);
        this.time += delta;
        if (this.radius >= this.outRadius) this.destroy();
    }
    render(ctx) {
        ctx.save();
        ctx.beginPath();
        const grad = ctx.createRadialGradient(this.posX, this.posY, this.radius, this.posX, this.posY, 2 * this.outRadius);
        ctx.globalAlpha = this.alpha;
        grad.addColorStop(1, '#EBFF2B');
        grad.addColorStop(0, '#eaff2b00');
        ctx.fillStyle = grad;
        ctx.arc(this.posX, this.posY, this.outRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
    destroy() {
        this.destroyed = true;
    }
};
export default class DynamicBar {
    constructor(x, y, angel, width, maxValue, curValue = 0) {
        this.posX = x;
        this.posY = y;
        this.angle = angel;
        this.maxValue = maxValue;
        this.curValue = curValue;
        this.width = width;
        this.height = 7;

    }

    update(x, y, angle, curValue) {
        this.curValue = curValue;
        this.posX = x - Math.cos(angle) * 1.1 * this.height;
        this.posY = y - Math.sin(angle) * 1.1 * this.height;;
        this.angle = angle + 0.5 * Math.PI;
    }
    render(ctx) {
        ctx.save();
        const ratio = this.curValue / this.maxValue;
        //console.log(this.maxValue);
        const fillWidth = ratio * this.width;
        ctx.translate(this.posX, this.posY);
        ctx.rotate(this.angle);
        ctx.fillStyle = 'red';
        ctx.fillRect(-this.width / 2, -this.height / 2, fillWidth, this.height);
        ctx.restore();



        ctx.save();

        ctx.translate(this.posX, this.posY);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.stroke();
        ctx.restore();
    }

}
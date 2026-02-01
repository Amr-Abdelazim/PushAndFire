class InputManager {
    constructor() {
        this.keyboard = {};
        this.mouse = {
            posX: 0,
            posY: 0,
            leftBtn: false,
            rightBtn: false
        };
        this.init();
    }
    init() {
        window.addEventListener('contextmenu', (e) => e.preventDefault());
        window.addEventListener('keydown', (e) => {
            this.keyboard[e.code] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keyboard[e.code] = false;
        });
        window.addEventListener('mousemove', (e) => {
            this.mouse['posX'] = e.clientX;
            this.mouse['posY'] = e.clientY;
        });
        window.addEventListener('mousedown', (e) => {
            if (e.button == 0) this.mouse['leftBtn'] = true;
            if (e.button == 2) this.mouse['rightBtn'] = true;
        });
        window.addEventListener('mouseup', (e) => {
            if (e.button == 0) this.mouse['leftBtn'] = false;
            if (e.button == 2) this.mouse['rightBtn'] = false;
        });
    }
}

export default new InputManager();
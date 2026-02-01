
function init() {
    const canvas = document.querySelector("#myCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    return { ctx, canvas };
}
const res = init();
export const ctx = res.ctx;
export const canvas = res.canvas;
export function angleLengthVector(angle, length, origin = { x: 0, y: 0 }) {
    const x = Math.cos(angle) * length;
    const y = Math.sin(angle) * length;
    return {
        x: x + origin.x,
        y: y + origin.y
    };
}
export function randomInt(l, r) {
    return Math.floor(Math.random() * (r - l + 1)) + l;
}
export function randomFloat(l, r) {
    return Math.random() * (r - l) + l;
}

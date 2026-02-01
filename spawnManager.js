import gameController from "./gameController.js";
import { canvas } from "./canvas.js";
import { randomFloat, randomInt } from "./utils.js";
import ship from "./ship.js";
import EnemySpawnEffect from "./enemySpawnEffect.js";
export default class SpawnManager {
    constructor() {
        this.MaxObjectsOnScreen = 10;
        this.entities = [];//[{entity:class,probability:number}]
        this.time = 0;
        this.spawnTime = 2;
    }
    setEntities(arr) {
        this.entities = arr;
    }
    addEntity(e) {
        this.entities.push(e);
    }
    getQuarter(x, y) {
        const width = canvas.width;
        const height = canvas.height;
        if (x < width / 2) {
            if (y < height / 2) return 0;
            else return 2;
        } else {
            if (y < height / 2) return 1;
            else return 3;
        }
    }
    getQPosition(quarter) {
        const width = canvas.width;
        const height = canvas.height;
        if (quarter == 0)
            return { x: randomInt(0, width / 2 - 1), y: randomInt(0, height / 2 - 1) };
        if (quarter == 1)
            return { x: randomInt(width / 2, width), y: randomInt(0, height / 2 - 1) };
        if (quarter == 2)
            return { x: randomInt(0, width / 2 - 1), y: randomInt(height / 2, height) };
        if (quarter == 3)
            return { x: randomInt(width / 2, width), y: randomInt(height / 2, height) };

    }
    getPosition() {
        let quarter = [0, 1, 2, 3]; // 0:topLeft , 1:topRight , 2:bottomLeft , 3:bottomRight 
        const shipPos = ship.getPosision();
        const shipQ = this.getQuarter(shipPos.x, shipPos.y);
        quarter = quarter.filter(q => q != shipQ);
        const Qindex = randomInt(0, 2);
        return this.getQPosition(quarter[Qindex]);

    }
    selectEntity() {
        const rnd = randomFloat(0, 1);
        let cur = 0;
        for (let i = 0; i < this.entities.length; i++) {
            cur += this.entities[i].probability;
            if (rnd <= cur) {
                return this.entities[i].entity;
            }
        }
        return null;
    }
    spawn(e, pos) {
        if (gameController.gameObjects.length > this.MaxObjectsOnScreen) return;
        const obj = new e(pos.x, pos.y);
        gameController.addObject(new EnemySpawnEffect(obj.getCollisionInfo().points, obj));
    }

    update(delta) {
        this.time += delta;
        if (this.time >= this.spawnTime) {
            this.time = 0;
            const pos = this.getPosition();
            const e = this.selectEntity();
            this.spawn(e, pos);
            this.spawnTime = Math.max(0.8, this.spawnTime - 0.1);
        }
    }
    render(ctx) {

    }
}
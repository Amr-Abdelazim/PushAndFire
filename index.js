import gameController from "./gameController.js";
import ship from "./ship.js";
import EnemyTriangle from "./enemyTriangle.js";
import { randomInt } from "./utils.js";
import SpawnManager from "./spawnManager.js";
function main() {
    gameController.init();
    gameController.addObject(ship);
    const spawnManager = new SpawnManager();
    spawnManager.setEntities([{ entity: EnemyTriangle, probability: 1 }]);
    gameController.addObject(spawnManager);
    for (let i = 0; i < 0; i++)
        gameController.addObject(new EnemyTriangle(randomInt(50, 500), randomInt(50, 500)));

}

main();



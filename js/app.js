let newPlayer;
let newGame;

class MorphPixs {
  constructor(colorId) {
    this.color = '';
    this.colorId = 0;
    this.width = 0;
    this.heigth = 0;
    this.x = 0;
    this.y = 0;
    this.score = 1;
  }

  blockMoveX(clickPositionX, clickPositionColorId) {
    if (this.x > clickPositionX) {
      while (this.x > clickPositionX) {
        this.x -= 1;
      }
    } else if (this.x < clickPositionX) {
      while (this.x < clickPositionX) {
        this.x += 1;
      }
    } else if (this.x === clickPositionX) {
      ifBlocksMatch(this.colorId, clickPositionColorId);
    }
  }
}

class EnemiesPixs {
  constructor(colorId) {
    this.color = '';
    this.colorId = 0;
    this.width = 0;
    this.heigth = 0;
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;
  }
}

class GamePlay {
  constructor() {
    this.arena = [[null, null, null, null, null], [null, null, null, null, null]];
    this.hero = [];
    this.enemy = [];
  }

  startGame() {}

  shuffleEnemiesColor(enemiesArr) {
    let remainEnemy = enemiesArr.length;

    while (remainEnemy > 0) {
      const randomEnemy = Math.floor(Math.random() * enemiesArr.length);

      remainEnemy -= 1;

      const tempEnemy = enemiesArr[remainEnemy];
      enemiesArr[remainEnemy] = enemiesArr[randomEnemy];
      enemiesArr[randomEnemy] = tempEnemy;
    }
    this.enemy.push(enemiesArr);

    addEnemies(this.enemy);
    
  }

  addEnemies(enemyArr) {
    this.arena.push(enemyArr);
  }

  ifBlocksMatch(morphColorId, clickPositionColorId) {
    if (morphColorId === clickPositionColorId) {
      this.arena[newPlayer.y + 1] = [null, null, null, null, null];
      newPlayer.y += 1;
    }
  }
}

let getClickY = 0;
let getClickX = 0;
document.querySelectorAll('.block').forEach((block, position) => {
  block.onclick = () => {
    getClickY = Math.ceil((position + 1) / 5) - 1
    getClickX = Math.ceil((position) % 5)

  }
} )
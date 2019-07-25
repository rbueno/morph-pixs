let thePlayer;
let theEnemies;
let theGame;

// Princpal Block class (the Hero's name is MorphPixs)
class MorphPixs {
  constructor(colorId, x, y) {
    // this.color = colorId;
    this.colorId = 0;
    // this.width = 0;
    // this.heigth = 0;
    this.x = x;
    this.y = y;
    // this.score = 1;
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

// Enemies class (all other blocks are the enamies)
class EnemiesPixs {
  constructor(colorId, x, y) {
//    this.color = '';
    this.colorId = colorId;
 //   this.width = 0;
 //   this.heigth = 0;
    this.x = x;
    this.y = y;
  //  this.speedX = 0;
  //  this.speedY = 0;
  }
}

// game constructor

class GamePlay {
  constructor() {
    this.arena = [];
    this.hero = [];
    this.enemy = [];
  }

  shuffleEnemiesColor(enemiesArr) {
    let remainEnemy = enemiesArr.length;

    while (remainEnemy > 0) {
      const randomEnemy = Math.floor(Math.random() * enemiesArr.length);

      remainEnemy -= 1;

      const tempEnemy = enemiesArr[remainEnemy];
      enemiesArr[remainEnemy] = enemiesArr[randomEnemy];
      enemiesArr[randomEnemy] = tempEnemy;
    }
    return enemiesArr;
    //this.enemy[8].push(enemiesArr);

    // addEnemies(this.enemy);
  }

  // addEnemies(enemyArr) {
  //   this.arena.push(enemyArr);
  // }

  ifBlocksMatch(morphColorId, morphPositionY, clickPositionColorId) {
    if (morphColorId === clickPositionColorId) {
      this.arena[morphPositionY + 1] = [null, null, null, null, null];
      // morphPositionY += 1;
    }
  }

}

thePlayer = new MorphPixs (0, 2, 8);
theGame = new GamePlay ();
const enemiesColorsId = [0, 1, 2, 3, 4];


function generatesEnemies(arr) {
  let xCount = 0;
  // create enemies array
  const enemiesSquad = arr.reduce((acc, colorID) => {
    theEnemies = new EnemiesPixs(colorID, xCount, 9);
    acc.push(theEnemies);
    xCount += 1;
    return acc;
  }, []);

  // shuffle the enemies array
  const shuffleEnemiesSquad = theGame.shuffleEnemiesColor(enemiesSquad);

  // set the position X to each new enemy
  const setEnemiesPositionX = shuffleEnemiesSquad.reduce((acc, enemy, position) => {
    enemy.x = position;
    acc.push(enemy);
    return acc;
  }, []);

  theGame.arena[9] = setEnemiesPositionX;
}

// iterate array inside array (row of blocks)
function moveBlocksUp() {

  theGame.arena.forEach((el) => {
    let newPositionY = 0;
    const tempArr = [];
    el.forEach((block) => {
      if (block !== null) {
      block.y -= 1;
      newPositionY = block.y;
      }
      tempArr.push(block);
      

    });

     theGame.arena[newPositionY] = tempArr;

  });
  console.log("moveUP: ", theGame.arena);

  generatesEnemies(enemiesColorsId);
  
}

let getClickY = 0;
let getClickX = 0;
document.querySelectorAll('.block').forEach((block, position) => {
  block.onclick = () => {
    getClickY = Math.ceil((position + 1) / 5) - 1
    getClickX = Math.ceil((position) % 5)

    //  console.log("x:" + getClickX + " y:" + getClickY)
    
  };
});


function startGame() {

  theGame.arena[8] = [null, null, thePlayer, null, null]
  generatesEnemies(enemiesColorsId);
  console.log("Start Game: ", theGame.arena);
}
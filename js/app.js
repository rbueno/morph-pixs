let thePlayer;
let theEnemies;
let theGame;
let countScore = 0;

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
    // if (this.x > clickPositionX) {
    //   while (this.x > clickPositionX) {
    //     this.x -= 1;
    //  }
    // } else if (this.x < clickPositionX) {
    //   while (this.x < clickPositionX) {
    //     this.x += 1;
    //   }
    // } else if (this.x === clickPositionX) {
    //   ifBlocksMatch(this.colorId, clickPositionColorId);
    // }

    this.x = clickPositionX;
    setHeroXtoArr(this.x, this.y, this);
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
}

thePlayer = new MorphPixs (0, 2, 8);
theGame = new GamePlay ();
const enemiesColorsId = [0, 1, 2, 3, 4];


function generatesEnemies(arr) {
  let xCount = 0;
  // create enemies array
  const enemiesSquad = arr.reduce((acc, colorId) => {
    theEnemies = new EnemiesPixs(colorId, xCount, 9);
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
  setInterval(() => {
  theGame.arena.forEach((el) => {
    let newPositionY = 0;
    const tempArr = [];
    el.forEach((block) => {
      if (block !== null) {
        block.y -= 1;
        newPositionY = block.y;
      }
      tempArr.push(block);
      cancelAnimationFrame
    });

    theGame.arena[newPositionY] = tempArr;
    renderBlocks(thePlayer.x, thePlayer.y);
    checkGameOver(newPositionY);
  });
  console.log("moveUP: ", theGame.arena);

  generatesEnemies(enemiesColorsId);
},2000)
}

function setHeroXtoArr(x, y, hero) {
  theGame.arena[y] = [null, null, null, null, null];
  theGame.arena[y][x] = hero;
  
  renderBlocks(hero.x, hero.y);

  setTimeout(() => {
    ifBlocksMatch(hero.colorId, hero.x, hero.y, hero);
  }, 300);

  console.log("after move x: ", theGame.arena);
}

function ifBlocksMatch(heroColorId, heroX, heroY, hero) {

  
  let nextDownEnemy = theGame.arena[heroY + 1][heroX];


  if (heroColorId === nextDownEnemy.colorId) {
    theGame.arena[heroY] = [null, null, null, null, null];
    theGame.arena[heroY + 1] = [null, null, null, null, null];
    hero.y += 1; 
    theGame.arena[heroY + 1][heroX] = hero;
    renderBlocks(hero.x, hero.y);
    // morphPositionY += 1;
    countScore += 1;
    document.getElementById('morph').innerText = countScore;

    setTimeout(() => {
      ifBlocksMatch(hero.colorId, hero.x, hero.y, hero);
    }, 50);
  }
}

let getClickY = 0;
let getClickX = 0;
document.querySelectorAll('.block').forEach((block, position) => {
  block.onclick = () => {
    getClickX = Math.ceil((position) % 5);
    getClickY = Math.ceil((position + 1) / 5) - 1;

    //  console.log("x:" + getClickX + " y:" + getClickY);
    thePlayer.blockMoveX(getClickX, thePlayer.colorId);
  };
  
});

function startGame() {
  // add hero
  theGame.arena[8] = [null, null, thePlayer, null, null];
  renderBlocks(thePlayer.x, thePlayer.y);

  // add enemies
  generatesEnemies(enemiesColorsId);

  moveBlocksUp();
  console.log("Start Game: ", theGame.arena);
}

function checkGameOver(heroY) {
  if (heroY < 0) {console.log('Game over'); }
}

function renderBlocks(heroX, heroY) {
   document.querySelector('.hero').style.left = `${heroX * 70}px`;
   document.querySelector('.hero').style.top = `${heroY * 70}px`;
  //document.querySelector('.hero').style.transform = `translate(${heroX * 70}px, ${heroY * 70}px)`;
  //  setAttribute('transform', `translate(${heroX * 70}px, ${heroY * 70}px)`);

  console.log('chegou no render')
}



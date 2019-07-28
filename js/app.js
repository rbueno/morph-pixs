let thePlayer;
let theEnemies;
let theGame;
let changinId = null;
let gameOver = false;

// Princpal Block class (the morph's name is MorphPixs)
class MorphPixs {
  constructor(colorId, x, y, score) {
    this.color = 'set-color-0';
    this.colorId = colorId;
    // this.width = 0;
    // this.heigth = 0;
    this.type = 'hero';
    this.x = x;
    this.y = y;
    this.score = score;
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
    setmorphXtoArr(this.x, this.y, this);
  }
}

// Enemies class (all other blocks are the enamies)
class EnemiesPixs {
  constructor(colorId, classSuffixId, x, y) {
    //    this.color = '';
    this.colorId = colorId;
    this.classSuffixId = classSuffixId;


    //   this.width = 0;
    //   this.heigth = 0;
    this.x = x;
    this.y = y;
    this.type = 'enemy';
  //  this.speedX = 0;
  //  this.speedY = 0;
  }
}

class GamePlay {
  constructor() {
    this.arena = [];
    this.morph = [];
    this.enemy = [];
    this.speed = 900;
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
  }
}



const enemiesColorsId = [0, 1, 2, 3, 4];
let enemySuffixClassIdCount = 0;

function generatesEnemies(arr) {
  let positionX = 0;
  let getNewLiContent = '';
  let getDivs = '';

  // create enemies array
  const enemiesSquad = arr.reduce((acc, colorId) => {
    theEnemies = new EnemiesPixs(colorId, enemySuffixClassIdCount, positionX, 9);
    acc.push(theEnemies);
    positionX += 1;
    getDivs += `<div class="enemy-${enemySuffixClassIdCount}"></div>`;
    enemySuffixClassIdCount += 1;
    return acc;
  }, []);

  getNewLiContent = `<li>${getDivs}</li>`;

  document.getElementById('enemies-squad').insertAdjacentHTML('beforeend', getNewLiContent);

  // shuffle the enemies array
  const shuffleEnemiesSquad = theGame.shuffleEnemiesColor(enemiesSquad);

  // set the position X to each new enemy
  const setEnemiesPositionX = shuffleEnemiesSquad.reduce((acc, enemy, position) => {
    enemy.x = position;
    acc.push(enemy);
    return acc;
  }, []);

  theGame.arena[9] = setEnemiesPositionX;
  renderEnemies();
}

function setmorphXtoArr(x, y, morph) {
  theGame.arena[y] = [null, null, null, null, null];
  theGame.arena[y][x] = morph;

  renderBlocks(morph.x, morph.y);

  setTimeout(() => {
    ifBlocksMatch(morph.colorId, morph.x, morph.y, morph);
  }, 300);
}

function ifBlocksMatch(morphColorId, morphX, morphY, morph) {
  const nextDownEnemy = theGame.arena[morphY + 1][morphX];

  if (morphColorId === nextDownEnemy.colorId) {
    theGame.arena[morphY] = [null, null, null, null, null];
    theGame.arena[morphY + 1] = [null, null, null, null, null];
    morph.y += 1;
    theGame.arena[morphY + 1][morphX] = morph;

    document.getElementById('enemies-squad').children[0].remove();

    renderBlocks(morph.x, morph.y);
    thePlayer.score += 1;
    document.getElementById('morph').innerText = thePlayer.score;

    setTimeout(() => {
      ifBlocksMatch(morph.colorId, morph.x, morph.y, morph);
    }, 50);
  }
}

let getClickY = 0;
let getClickX = 0;
document.querySelectorAll('.block').forEach((block, position) => {
  block.onclick = () => {
    getClickX = Math.ceil((position) % 5);
    getClickY = Math.ceil((position + 1) / 5) - 1;
    if (!gameOver) {
    thePlayer.blockMoveX(getClickX, thePlayer.colorId);
    }
  };
});

function startGame() {
  // clear previous game
  thePlayer = new MorphPixs(0, 2, 8, 0);
  theGame = new GamePlay();

  document.getElementById('enemies-squad').innerHTML = '';
  document.querySelector('.morph').innerText = 'Go!';
  gameOver = false;

  
  
  // add morph
  theGame.arena[8] = [null, null, thePlayer, null, null];
  renderBlocks(thePlayer.x, thePlayer.y);
  changeMorphId();
  // add enemies
  generatesEnemies(enemiesColorsId);

  runningGame = setInterval (moveBlocksUp, theGame.speed);
}

function checkGameOver(morphY) {
  if (morphY <= 0) {
    clearInterval(runningGame);
    document.querySelector('.morph').innerText = '*_*';
    gameOver = true;
  }
}

function renderBlocks(morphX, morphY) {
  document.querySelector('.morph').style.left = `${morphX * 70}px`;
  document.querySelector('.morph').style.top = `${morphY * 70}px`;
  
}

function renderEnemies() {
  theGame.arena.forEach((el) => {
    el.forEach((block) => {
      if (block !== null && block.type === 'enemy') {
        const getEnemyClassId = `.enemy-${block.classSuffixId}`;
        document.querySelectorAll(getEnemyClassId).forEach((enemyClass) => {
          enemyClass.classList.add(`set-color-${block.colorId}`);
          enemyClass.classList.add('block-geral-style');
          enemyClass.style.top = `${block.y * 70}px`;
          enemyClass.style.left = `${block.x * 70}px`;
        });
      }
    });
  });
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
    renderBlocks(thePlayer.x, thePlayer.y);
    checkGameOver(thePlayer.y);
  });
  generatesEnemies(enemiesColorsId);
}

function changeMorphId() {
  if (!gameOver) {
  // remove actual css color class
  document.querySelector('.morph').classList.remove(thePlayer.color);

  // set new id and new css color to thePlayer
  let getRandomColor = Math.floor(Math.random() * enemiesColorsId.length);
  console.log(getRandomColor)
  thePlayer.colorId = getRandomColor;
  thePlayer.color = `set-color-${thePlayer.colorId}`;

  // set the thePlayer new css Color to html div player
  document.querySelector('.morph').classList.add(thePlayer.color);

  
  setTimeout (() => {
    changeMorphId();
  }, 6000)
}
}

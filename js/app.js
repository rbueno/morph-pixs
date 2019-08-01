let thePlayer;
let theEnemies;
let theGame;
let runningGame;
let changingId;
let gameOver = false;
let matchAudio;
let failAudio;
let levelAudio;
let selectingGameLevel;
let bgAudio;

// Princpal Block class (the morph's name is MorphPixs)
class MorphPixs {
  constructor(colorId, x, y, score) {
    this.color = 'set-color-0';
    this.colorId = colorId;
    this.type = 'hero';
    this.x = x;
    this.y = y;
    this.score = score;
  }

  blockMoveX(clickPositionX) {
    this.x = clickPositionX;
    setmorphXtoArr(this.x, this.y, this);
  }
}

// Enemies class (all other blocks are the enamies)
class EnemiesPixs {
  constructor(colorId, classSuffixId, x, y) {
    this.colorId = colorId;
    this.classSuffixId = classSuffixId;
    this.x = x;
    this.y = y;
    this.type = 'enemy';
  }
}

class GamePlay {
  constructor(speed) {
    this.arena = [];
    this.speed = speed;
  }
}

function PlayAudio() {
  matchAudio.load;
  matchAudio.currentTime = 0;
  matchAudio.play();
}

function playLevelAudio() {
  levelAudio.load;
  levelAudio.currentTime = 0;
  levelAudio.play();
}

function PauseAudio() {
  matchAudio.pause();
}


function shuffleEnemiesColor(enemiesArr) {
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
  const shuffleEnemiesSquad = shuffleEnemiesColor(enemiesSquad);

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
    if (morphY <= 0) {
      keepGameRunning();
    }


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

    // matchAudio.currentTime = 0;
    // matchAudio.play();
    PlayAudio();
  }
}

function clickControler() {
  let getClickX = 0;
  document.querySelectorAll('.block').forEach((block, position) => {
    block.onclick = () => {
      getClickX = Math.ceil((position) % 5);
      // getClickY = Math.ceil((position + 1) / 5) - 1;
      if (!gameOver) {
        thePlayer.blockMoveX(getClickX, thePlayer.colorId);
      }
    };
  });
}

function startGame() {

  // add new Instances
  thePlayer = new MorphPixs(0, 2, 8, 0);
  theGame = new GamePlay(600);

  // add controlers
  for (let i = 0; i <= 4; i += 1) {
    document.querySelector('.blocks-grid').innerHTML += `
    <div class="block"> - </div>`;
  }

  // clear and add Morph
  document.getElementById('morph').removeAttribute('class');

  // clear and add enemies
  document.getElementById('enemies-squad').innerHTML = '';
  document.getElementById('morph').innerText = 'Go!';
  gameOver = false;

  // add morph to the arena
  theGame.arena[8] = [null, null, thePlayer, null, null];
  renderBlocks(thePlayer.x, thePlayer.y);
  changeMorphId();

  // add enemies
  generatesEnemies(enemiesColorsId);

  runningGame = setInterval(moveBlocksUp, theGame.speed);
  ifBlocksMatch(thePlayer.colorId, thePlayer.x, thePlayer.y, thePlayer);

  bgAudio.load;
    bgAudio.currentTime = 0;
    bgAudio.loop = true;
    bgAudio.play();

  clickControler();
  selectGameLevel(0);

}

function checkGameOver(morphY) {
  if (morphY <= 0) {
    clearInterval(runningGame);
    clearTimeout(changingId);
    document.getElementById('morph').innerText = '*_*';
    gameOver = true;
    waitToGameOverScreen = setTimeout(() => {
      if (gameOver) {
        gameOverScreen();
      }
    }, 500);
  }
}

function renderBlocks(morphX, morphY) {
  document.getElementById('morph').style.left = `${morphX * 70}px`;
  document.getElementById('morph').style.top = `${morphY * 70}px`;
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
    document.getElementById('morph').classList.remove(thePlayer.color);

    // set new id and new css color to thePlayer
    const getRandomColor = Math.floor(Math.random() * enemiesColorsId.length);

    thePlayer.colorId = getRandomColor;
    thePlayer.color = `set-color-${thePlayer.colorId}`;

    // set the thePlayer new css Color to html div player
    document.getElementById('morph').classList.add(thePlayer.color);
  }

  changingId = setTimeout(() => {
    changeMorphId();
  }, 6000);
}

function keepGameRunning() {
  runningGame = setInterval(moveBlocksUp, theGame.speed);
  gameOver = false;
  thePlayer.score += 4;

  setTimeout(() => { changeMorphId(); }, 1000);
}

function setGameLevel(level) {
  const el = document.documentElement;

  switch (level) {
    case 0:
    // normal level
      playLevelAudio();
      clearInterval(runningGame);
      theGame.speed = 700;
      runningGame = setInterval(moveBlocksUp, theGame.speed);
      console.log(theGame.speed);
      el.style.setProperty('--bg-block-0', '#fbb238');
      el.style.setProperty('--bg-block-1', '#8e40df');
      el.style.setProperty('--bg-block-2', '#eb4337');
      el.style.setProperty('--bg-block-3', '#43e43f');
      el.style.setProperty('--bg-block-4', '#158eb4');

      break;

    case 1:
    // color degrade
      playLevelAudio();
      clearInterval(runningGame);
      theGame.speed = 1300;
      runningGame = setInterval(moveBlocksUp, theGame.speed);
      console.log(theGame.speed);
      el.style.setProperty('--bg-block-0', '#fc3e04');
      el.style.setProperty('--bg-block-1', '#fd6500');
      el.style.setProperty('--bg-block-2', '#fe8a01');
      el.style.setProperty('--bg-block-3', '#ff5603');
      el.style.setProperty('--bg-block-4', '#d57f10');

      clearTimeout(selectingGameLevel);
      selectingGameLevel = setTimeout(() => {
        if (!gameOver) {
          selectGameLevel(4)
        }
      }, 8000);

      break;

    case 2:
    // teste dautonsimo
      break;

    case 3:
      // teste de visão (letras pequeas)
      break;

    case 4:
      // foto de pessoas
      playLevelAudio();
      clearInterval(runningGame);
      theGame.speed = 1000;
      runningGame = setInterval(moveBlocksUp, theGame.speed);
      console.log(theGame.speed);
      el.style.setProperty('--bg-block-0', `URL('../img/img-bg-0.jpg')`);
      el.style.setProperty('--bg-block-1', `URL('../img/img-bg-1.jpg')`);
      el.style.setProperty('--bg-block-2', `URL('../img/img-bg-2.jpg')`);
      el.style.setProperty('--bg-block-3', `URL('../img/img-bg-3.jpg')`);
      el.style.setProperty('--bg-block-4', `URL('../img/img-bg-4.jpg')`);

      clearTimeout(selectingGameLevel);
      selectingGameLevel = setTimeout(() => {
        if (!gameOver) {
          selectGameLevel(0)
        }
      }, 8000);
      break;

    default:
      //gameNormalLevel();
  }
}

function selectGameLevel(level) {

  switch (level) {
    case 0:
    // normal level
    setGameLevel(0);

      break;

    case 1:
    // color degrade
    setGameLevel(1);

      break;

    case 2:
    // teste dautonsimo
      break;

    case 3:
      // teste de visão (letras pequeas)
      break;

    case 4:
      // foto de pessoas
      setGameLevel(4);
      break;

    default:
      //gameNormalLevel();
  }

selectingGameLevel =  setTimeout(() => {
    selectGameLevel(1);
  }, 20000);

}
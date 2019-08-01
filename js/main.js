window.onload = () => {
    launchScreen();
    matchAudio = document.getElementById('match-audio');
    failAudio = document.getElementById('fail-audio');
    levelAudio = document.getElementById('level-audio');
    bgAudio = document.getElementById('bg-audio');
    

    
  };

function launchScreen() {
  document.getElementById('myModal').style.display = 'block';
  document.getElementById('startBtn').onclick = () => {
    document.getElementById('myModal').style.display = 'none';
    document.querySelector('.blocks-grid').style.display = 'grid';
    startGame();
  };
}

function gameOverScreen() {
  clearTimeout(changingId);
  clearTimeout(selectingGameLevel);
  bgAudio.pause();
  failAudio.load;
  failAudio.currentTime = 0;
  failAudio.play();

    document.querySelector('.blocks-grid').style.display = 'none';
    document.getElementById('myGameOverModal').style.display = 'block';

    document.getElementById('displayScore').innerText = thePlayer.score;

    document.getElementById('playAgainBtn').onclick = () => {
      document.getElementById('myGameOverModal').style.display = 'none';
      document.querySelector('.blocks-grid').style.display = 'grid';
      startGame();
}

shareScore(thePlayer.score);

// document.getElementById('shareScoreBtn').onclick = () => {
//     shareScore(thePlayer.score);
// }
}
function shareScore(score) {
    let getUrl =`https://twitter.com/intent/tweet?text=I%20Scored%20${score}%20in%20Morph%20Pix!%20You%27ll%20never%20beat%20me!%20%23morphpix%20https://lappidar.com/morph-pixs/%20&lang=en`;
    document.getElementById('shareScoreBtn').setAttribute('href', getUrl);
    document.getElementById('shareScoreBtn').setAttribute('target', '_blank');
}


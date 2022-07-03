let ball;
let paddle;
let playingArea;
let score;
let gear;
let controls;
let newButton;
let difficultySelect;
let doneButton;
let snd;
let music;

let avWidth;    // Available width
let avHeight;   // Available height
let plWidth;    // Playing area width
let plHeight;   // playing area height
let dx = 2;     // Horizontal speed 
let dy = 2;     // Vertical speed
let pdx = 48;   //paddle speed
let currentScore = 0;
let timer;
let paddleLeft = 228;
let ballLeft = 100;
let ballTop = 8;
let drag = false;
let sndEnabled = false
let musicEnabled = false

let beepX;
let beepY;
let beepPaddle;
let beepGameOver;
let bgMusic;


window.addEventListener('load', init)
window.addEventListener('resize', init)

function init() {
    ball = document.getElementById('ball')
    paddle = document.getElementById('paddle')
    score = document.getElementById('score')
    playingArea = document.getElementById('playingArea')
    gear = document.getElementById('gear')
    controls = document.getElementById('controls')
    newButton = document.getElementById('new')
    difficultySelect= document.getElementById('difficulty')
    doneButton = document.getElementById('done')
    snd = document.getElementById('snd')
    music = document.getElementById('music')

    document.addEventListener('keydown', keyListener, false)

  playingArea.addEventListener('mousedown',mouseDown,false);
  playingArea.addEventListener('mousemove',mouseMove,false);
  playingArea.addEventListener('mouseup',mouseUp,false);
  playingArea.addEventListener('touchstart',mouseDown,false);
  playingArea.addEventListener('touchmove',mouseMove,false);
  playingArea.addEventListener('touchend',mouseUp,false);

    gear.addEventListener('click', showSettings,false)
    newButton.addEventListener('click', newGame, false)
    doneButton.addEventListener('click', hideSettings, false)
    difficultySelect.addEventListener('change', function() {
        setDifficulty(difficultySelect.selectedIndex)
    }, false)

    snd.addEventListener('click', toggleSound, false)
    music.addEventListener('click', toggleMusic, false)
    
    layoutArea()
    timer = requestAnimationFrame(start)
}

function layoutArea() {
    avWidth = innerWidth
    avHeight = innerHeight
    plWidth = avWidth - 22
    plHeight = avHeight -22
    playingArea.style.width = `${plWidth}px`
    playingArea.style.height = `${plHeight}px`
}

function keyListener(e) {
    let key = e.keyCode

    if ((key === 37 || key === 65) && paddleLeft > 0) {
        paddleLeft -= pdx
        if (paddleLeft < 0) paddleLeft = 0
    }
    else if((key === 39 || key === 68) && paddleLeft < plWidth - 64) {
        paddleLeft += pdx
        if (paddleLeft > plWidth - 64 ) paddleLeft = plWidth - 64
    }
}

function start() {
    render();
    detectCollisitions();
    difficulty();
    if (ballTop < plHeight - 36) {
        timer = requestAnimationFrame(start)
    }else {
        gameOver()
    }
}

function render() {
    moveBall()
    updateScore()
}

function moveBall() {
    ballLeft += dx
    ballTop += dy

    ball.style.left = `${ballLeft}px`
    ball.style.top = `${ballTop}px`
}

function updateScore() {
    currentScore += 5
    score.innerHTML = `score: ${currentScore}`
}

function detectCollisitions() {
    if(collisionX()) dx *= -1
    if(collisionY()) dy *= -1
}

function collisionX() {
    if(ballLeft < 4 || ballLeft > plWidth - 20) {
      playSound(beepX)
        return true
    }
    return false
}
function collisionY() {
    if(ballTop < 4) {
        playSound(beepY)
        return true
    }
    if(ballTop > plHeight - 64){
        // if(ballLeft >= paddleLeft && ballLeft <= paddleLeft + 64){
        //     return true
        
        // centre of the paddle
        
        if (ballLeft >= paddleLeft + 16 && ballLeft < paddleLeft + 48) {
          if (dx < 0) {
            dx = -2
          } else {
            dx = 2
          }
          console.log('center')
          playSound(beepPaddle)
          return true
          
          // left side of the paddle
        } else if (ballLeft >= paddleLeft && ballLeft < paddleLeft + 16) {
          if (dx < 0) {
            dx = -8
          } else {
            dx = 8
          }
          console.log('left')
          playSound(beepPaddle)
          return true
          
          // Right side of the paddle
        } else if (ballLeft >= paddleLeft + 48 && ballLeft <= paddleLeft + 64) {
          if (dx < 0) {
            dx = -8
          } else {
            dx = 8
          }
          console.log('right');
          playSound(beepPaddle)
          return true
        }        
    }
    return false
}

function difficulty() {
    if(currentScore % 1000 === 0) {
        if (dy > 0) dy += 2
        else dy -= 2
    }
}

function gameOver() {
    cancelAnimationFrame(timer)
    score.innerHTML += '   Game Over'
    score.style.backgroundColor += 'rgb(128,0,0)'
    playSound(beepGameOver)
}
function mouseDown(e) {
    drag = true
}

function mouseUp(e) {
    drag = false
}

function mouseMove(e) {
    if(drag) {
        e.preventDefault;
        paddleLeft = e.clientX - 32 || e.targetTouches[0].pageX - 32
        if (paddleLeft < 0)
            paddleLeft = 0
        if (paddleLeft > (plWidth - 64))
            paddleLeft = plWidth - 64
        paddle.style.left = `${paddleLeft}px`
    }
}

function showSettings() {
    controls.style.display = 'block'
    cancelAnimationFrame(timer)
}

function hideSettings() {
    controls.style.display = 'none'
    timer = requestAnimationFrame(start)
}

function setDifficulty(diff) {
  switch (diff) {
    case 0:
      dy = 2
      pdx = 48
      break
    case 1:
      dy = 4
      pdx = 32
      break
    case 2:
      dy = 6
      pdx = 16
      break
    default:
      dy = 2
      pdx = 48
  }
}

function newGame() {
  ballTop = 8
  currentScore = 0
  dx = 2
  setDifficulty(difficultySelect.selectedIndex)
  score.style.backgroundColor = 'rgb(32,128,64)'
  hideSettings()
}


function initAudio() {
  //load audio files
  beepX = new Audio('sounds/beepX.mp3')
  beepY = new Audio('sounds/beepY.mp3')
  beepPaddle = new Audio('sounds/beepPaddle.mp3')
  beepGameOver = new Audio('sounds/beepGameOver.mp3')
  bgMusic = new Audio('sounds/music.mp3')
  //turn off volume
  beepX.volume = 0
  beepY.volume = 0
  beepPaddle.volume = 0
  beepGameOver.volume = 0
  bgMusic.volume = 0
  //play each file
  //this grants permission
  beepX.play()
  beepY.play()
  beepPaddle.play()
  beepGameOver.play()
  bgMusic.play()
  //pause each file
  //this stores them in memory for later
  beepX.pause()
  beepY.pause()
  beepPaddle.pause()
  beepGameOver.pause()
  bgMusic.pause()
  //set the volume back for next time
  beepX.volume = 1
  beepY.volume = 1
  beepPaddle.volume = 1
  beepGameOver.volume = 1
  bgMusic.volume = 1
}


function toggleSound() {
  if(beepX == null) initAudio()
  sndEnabled = !sndEnabled
}

function playSound(objSound) {
  if(sndEnabled) objSound.play()
}

function toggleMusic() {
  if (bgMusic == null) initAudio()
  if(musicEnabled) {
    bgMusic.pause()
  }else {
    bgMusic.loop = true
    bgMusic.play()
  }
  musicEnabled = !musicEnabled
}

function touchStart() {
  console.log('touchStart')
}

function touchMove() {
  console.log('touchMove')
}

function touchEnd() {
  console.log('touchEnd')
}
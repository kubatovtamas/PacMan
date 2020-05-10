const N = 14 // height
const M = 20 // width
const blockSize = 800 / M
const pacmanPos = { x: 9, y: 8 }
const KEYLEFT = 'ArrowLeft'
const KEYUP = 'ArrowUp'
const KEYRIGHT = 'ArrowRight'
const KEYDOWN = 'ArrowDown'
const Map = [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'nothing', 'wall', 'wall', 'wall', 'wall', 'nothing', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'powerup', 'normal', 'normal', 'normal', 'normal', 'wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall', 'normal', 'normal', 'normal', 'normal', 'powerup', 'wall'],
  ['wall', 'normal', 'wall', 'wall', 'wall', 'normal', 'normal', 'normal', 'wall', 'wall', 'wall', 'wall', 'normal', 'normal', 'normal', 'wall', 'wall', 'wall', 'normal', 'wall'],
  ['wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall'],
  ['wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'wall', 'wall', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall'],
  ['wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'nothing', 'nothing', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall'],
  ['nothing', 'normal', 'wall', 'normal', 'normal', 'normal', 'wall', 'normal', 'wall', 'nothing', 'nothing', 'nothing', 'normal', 'wall', 'normal', 'normal', 'normal', 'wall', 'normal', 'nothing'],
  ['wall', 'normal', 'wall', 'wall', 'wall', 'normal', 'wall', 'normal', 'wall', 'wall', 'wall', 'wall', 'normal', 'wall', 'normal', 'wall', 'wall', 'wall', 'normal', 'wall'],
  ['wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'nothing', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall'],
  ['wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall'],
  ['wall', 'normal', 'normal', 'normal', 'wall', 'normal', 'wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall', 'normal', 'wall', 'normal', 'normal', 'normal', 'wall'],
  ['wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'wall', 'wall', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall'],
  ['wall', 'powerup', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'powerup', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'nothing', 'wall', 'wall', 'wall', 'wall', 'nothing', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
]
const dirs = ['left', 'up', 'right', 'down']

let pacman

let g1
const g1Pos = { x: 9, y: 5 }
let g1Dir = 'down'

let g2
const g2Pos = { x: 10, y: 5 }
let g2Dir = 'down'

let g3
const g3Pos = { x: 9, y: 6 }
let g3Dir = 'right'

let g4
const g4Pos = { x: 10, y: 6 }
let g4Dir = 'right'

let dir1 = ''
let dir2 = ''
let score = 0
const winningScore = 131

let mainMenu
let gameArea
let scoreArea
let currentScore
let topScore
let lifeScore
let timer

let lives = 3
let seconds = 0
let panicMode = false
let panicCount = 0

let movePacmanInterval
let changeDirectionInterval
let updateInterval
let timerInterval
let song

let moveGInterval
// #############################################################################

/**
 * Generates the map for the gamearea
 */
function generateMap () {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const block = $('<div></div>')
      // block.addClass('normal')
      block.addClass('nothing')
      if (Map[i][j] === 'normal') {
        block.addClass('normal')
      } else if (Map[i][j] === 'wall') {
        block.addClass('wall')
      } else if (Map[i][j] === 'powerup') {
        block.addClass('powerup')
      } else if (Map[i][j] === 'ghost') {
        block.addClass('ghost')
      }

      block.css({
        width: blockSize,
        height: blockSize,
        top: i * blockSize,
        left: j * blockSize
      })

      block.appendTo(gameArea)
    }
  }
}

/**
 * Check if Map[y][x] is wall
 * @param y
 * @param x
 * @returns {boolean}
 */
function isWall (y, x) {
  return Map[y][x] === 'wall'
}

/**
 * Supposed to be called in intervals!
 * Checks if dir1 and dir2 is equal.
 * If not check if moving in dir2 is valid.
 * If it is, then set dir1 to the value of dir2,
 * and set dir2 to empty string.
 */
function changeDirection () {
  if (panicMode) {
    checkCollisionPanic()
  } else {
    checkCollision()
  }
  if (dir1 !== dir2) {
    switch (dir2) {
      case 'down':
        if (!isWall(pacmanPos.y + 1, pacmanPos.x)) {
          dir1 = dir2
          dir2 = ''
        }
        break
      case 'up':
        if (!isWall(pacmanPos.y - 1, pacmanPos.x)) {
          dir1 = dir2
          dir2 = ''
        }
        break
      case 'right':
        if (!isWall(pacmanPos.y, pacmanPos.x + 1)) {
          dir1 = dir2
          dir2 = ''
        }
        break
      case 'left':
        if (!isWall(pacmanPos.y, pacmanPos.x - 1)) {
          dir1 = dir2
          dir2 = ''
        }
        break
    }
  }
}

/**
 * Takes a Keypress event.
 * If Keypress is KEYDOWN/KEYUP/KEYRIGHT/KEYLEFT:
 *  If Keypress direction is valid move:
 *    set dir1 to Keypress
 *  Else:
 *    set dir2 to Keypress
 *
 * @param e event
 */
function setDirection (e) {
  const key = e.key
  switch (key) {
    case KEYDOWN:
      if (isWall(pacmanPos.y + 1, pacmanPos.x)) {
        dir2 = 'down'
        break
      }
      dir1 = 'down'
      break
    case KEYUP:
      if (isWall(pacmanPos.y - 1, pacmanPos.x)) {
        dir2 = 'up'
        break
      }
      dir1 = 'up'
      break
    case KEYRIGHT:
      if (isWall(pacmanPos.y, pacmanPos.x + 1)) {
        dir2 = 'right'
        break
      }
      dir1 = 'right'
      break
    case KEYLEFT:
      if (isWall(pacmanPos.y, pacmanPos.x - 1)) {
        dir2 = 'left'
        break
      }
      dir1 = 'left'
      break
    case 'p':
      showPlay()
      break
    case 'r':
      reset()
      break
  }
}

function checkCollision () {
  gameArea.find('.ghost').each(function () {
    if (pacmanPos.y === g1Pos.y && pacmanPos.x === g1Pos.x) {
      playHit()
      lives--
      if (lives === 0) {
        showLose()
      }
      resetPacman()
      resetGhosts()
    } else if (pacmanPos.y === g2Pos.y && pacmanPos.x === g2Pos.x) {
      playHit()
      lives--
      if (lives === 0) {
        showLose()
      }
      resetPacman()
      resetGhosts()
    } else if (pacmanPos.y === g3Pos.y && pacmanPos.x === g3Pos.x) {
      playHit()
      lives--
      if (lives === 0) {
        showLose()
      }
      resetPacman()
      resetGhosts()
    } else if (pacmanPos.y === g4Pos.y && pacmanPos.x === g4Pos.x) {
      playHit()
      lives--
      if (lives === 0) {
        showLose()
      }
      resetPacman()
      resetGhosts()
    }
  })
}

function checkCollisionPanic () {
  gameArea.find('.ghost').each(function () {
    if (pacmanPos.y === g1Pos.y && pacmanPos.x === g1Pos.x) {
      playHit()
      resetG1()
    } else if (pacmanPos.y === g2Pos.y && pacmanPos.x === g2Pos.x) {
      playHit()
      resetG2()
    } else if (pacmanPos.y === g3Pos.y && pacmanPos.x === g3Pos.x) {
      playHit()
      resetG3()
    } else if (pacmanPos.y === g4Pos.y && pacmanPos.x === g4Pos.x) {
      playHit()
      resetG4()
    }
  })
}

// #############################################################################

/**
 * Add the player model to the gamearea
 */
function addPacman () {
  pacman = $('<img src="pognom.gif" id="pacman" />')
  pacman.css({
    width: blockSize,
    height: blockSize
  })

  pacman.appendTo(gameArea)
}

function addG1 () {
  g1 = $('<img src="boomer.gif" id="g1" />')
  g1.css({
    width: blockSize,
    height: blockSize
  })
  g1.addClass('ghost')
  g1.appendTo(gameArea)
}

function addG2 () {
  g2 = $('<img src="boomer.gif" id="g2" />')
  g2.css({
    width: blockSize,
    height: blockSize
  })
  g2.addClass('ghost')
  g2.appendTo(gameArea)
}

function addG3 () {
  g3 = $('<img src="boomer.gif" id="g3" />')
  g3.css({
    width: blockSize,
    height: blockSize
  })
  g3.addClass('ghost')
  g3.appendTo(gameArea)
}

function addG4 () {
  g4 = $('<img src="boomer.gif" id="g4" />')
  g4.css({
    width: blockSize,
    height: blockSize
  })
  g4.addClass('ghost')
  g4.appendTo(gameArea)
}

/**
 * Add the 4 ghosts to the gamearea
 */
function addAllGhosts () {
  addG1()
  addG2()
  addG3()
  addG4()
}

function addEverything () {
  addPacman()
  addAllGhosts()
}

// #############################################################################

/**
 * Render the moving of the player
 * to the gamearea.
 */
function animatePacman () {
  pacman.animate({
    top: pacmanPos.y * blockSize,
    left: pacmanPos.x * blockSize
  }, 200, function () {
    gameArea.find('.nothing').each(function () {
      if (
        $(this).css('top') === pacman.css('top') &&
        $(this).css('left') === pacman.css('left')
      ) {
        if ($(this).hasClass('normal')) {
          score++
          // playCrunch()
          $(this).removeClass('normal')
        }
        if ($(this).hasClass('powerup')) {
          $(this).removeClass('powerup')
          playPowerup()
          setPanicMode()
        }
      }
    })
  })
}

function setPanicMode () {
  panicMode = true
  pacman.attr('src', 'reee.gif')
  g1.attr('src', 'zoomer.png')
  g2.attr('src', 'zoomer.png')
  g3.attr('src', 'zoomer.png')
  g4.attr('src', 'zoomer.png')
  panicCount += 11
  const counter = setInterval(timer, 1000)
  function timer () {
    panicCount--
    console.log('panic: ' + panicCount)
    if (panicCount <= 0) {
      if (checkWin === true) {
        showWin()
      } else {
        pacman.attr('src', 'pognom.gif')
        g1.attr('src', 'boomer.gif')
        g2.attr('src', 'boomer.gif')
        g3.attr('src', 'boomer.gif')
        g4.attr('src', 'boomer.gif')
      }

      panicMode = false
      clearInterval(counter)
    }
  }
}

/**
 * animatePacman but much faster
 */
function teleportPacman () {
  pacman.animate({
    top: pacmanPos.y * blockSize,
    left: pacmanPos.x * blockSize
  }, 0
  )
}

function animateG1 () {
  g1.animate({
    top: g1Pos.y * blockSize,
    left: g1Pos.x * blockSize
  }, 100)
}

function animateG2 () {
  g2.animate({
    top: g2Pos.y * blockSize,
    left: g2Pos.x * blockSize
  }, 100)
}

function animateG3 () {
  g3.animate({
    top: g3Pos.y * blockSize,
    left: g3Pos.x * blockSize
  }, 100)
}

function animateG4 () {
  g4.animate({
    top: g4Pos.y * blockSize,
    left: g4Pos.x * blockSize
  }, 100)
}

function teleportG1 () {
  g1.animate({
    top: g1.y * blockSize,
    left: g1.x * blockSize
  }, 0)
}

function teleportG2 () {
  g2.animate({
    top: g2.y * blockSize,
    left: g2.x * blockSize
  }, 0)
}

function teleportG3 () {
  g3.animate({
    top: g3.y * blockSize,
    left: g3.x * blockSize
  }, 0)
}

function teleportG4 () {
  g4.animate({
    top: g4.y * blockSize,
    left: g4.x * blockSize
  }, 0)
}

/**
 * Animate the ghosts
 */
function animateAllGhosts () {
  animateG1()
  animateG2()
  animateG3()
  animateG4()
}

// #############################################################################

/**
 * Supposed to be called in intervals!
 * Tries to move the player
 * depending on the state of
 * dir1 variable.
 *
 * Rule checks for valid steps
 * are implemented here.
 */
function movePacman () {
  const originalY = pacmanPos.y
  const originalX = pacmanPos.x
  switch (dir1) {
    case 'down':
      pacmanPos.y++
      break
    case 'up':
      pacmanPos.y--
      break
    case 'right':
      pacmanPos.x++
      break
    case 'left':
      pacmanPos.x--
      break
  }

  // Boundary checks
  if (pacmanPos.x < 0) { // Out of Bounds: Left
    pacmanPos.x = M - 1
    teleportPacman()
  } else if (pacmanPos.x > M - 1) { // Out of Bounds: Right
    pacmanPos.x = 0
    teleportPacman()
  } else if (pacmanPos.y < 0) { // Out of Bounds: Up
    pacmanPos.y = N - 1
    teleportPacman()
  } else if (pacmanPos.y > N - 1) { // Out of Bounds: Down
    pacmanPos.y = 0
    teleportPacman()
  } else if (isWall(pacmanPos.y, pacmanPos.x)) { // Wall hit
    pacmanPos.x = originalX
    pacmanPos.y = originalY
  } else { // Move
    animatePacman()
  }
}

function moveG1 () {
  const originalY = g1Pos.y
  const originalX = g1Pos.x
  switch (g1Dir) {
    case 'down':
      g1Pos.y++
      break
    case 'up':
      g1Pos.y--
      break
    case 'right':
      g1Pos.x++
      break
    case 'left':
      g1Pos.x--
      break
  }

  // Boundary checks
  if (g1Pos.x < 0) { // Out of Bounds: Left
    g1Pos.x = M - 1
    teleportG1()
  } else if (g1Pos.x > M - 1) { // Out of Bounds: Right
    g1Pos.x = 0
    teleportG1()
  } else if (g1Pos.y < 0) { // Out of Bounds: Up
    g1Pos.y = N - 1
    teleportG1()
  } else if (g1Pos.y > N - 1) { // Out of Bounds: Down
    g1Pos.y = 0
    teleportG1()
  } else if (isWall(g1Pos.y, g1Pos.x)) { // Wall hit
    g1Pos.x = originalX
    g1Pos.y = originalY
    g1Dir = dirs[getRandomInt(0, 3)]
  } else { // Move
    animateG1()
  }
}

function moveG2 () {
  const originalY = g2Pos.y
  const originalX = g2Pos.x
  switch (g2Dir) {
    case 'down':
      g2Pos.y++
      break
    case 'up':
      g2Pos.y--
      break
    case 'right':
      g2Pos.x++
      break
    case 'left':
      g2Pos.x--
      break
  }

  // Boundary checks
  if (g2Pos.x < 0) { // Out of Bounds: Left
    g2Pos.x = M - 1
    teleportG2()
  } else if (g2Pos.x > M - 1) { // Out of Bounds: Right
    g2Pos.x = 0
    teleportG2()
  } else if (g2Pos.y < 0) { // Out of Bounds: Up
    g2Pos.y = N - 1
    teleportG2()
  } else if (g2Pos.y > N - 1) { // Out of Bounds: Down
    g2Pos.y = 0
    teleportG2()
  } else if (isWall(g2Pos.y, g2Pos.x)) { // Wall hit
    g2Pos.x = originalX
    g2Pos.y = originalY
    g2Dir = dirs[getRandomInt(0, 3)]
  } else { // Move
    animateG2()
  }
}

function moveG3 () {
  const originalY = g3Pos.y
  const originalX = g3Pos.x
  switch (g3Dir) {
    case 'down':
      g3Pos.y++
      break
    case 'up':
      g3Pos.y--
      break
    case 'right':
      g3Pos.x++
      break
    case 'left':
      g3Pos.x--
      break
  }

  // Boundary checks
  if (g3Pos.x < 0) { // Out of Bounds: Left
    g3Pos.x = M - 1
    teleportG3()
  } else if (g2Pos.x > M - 1) { // Out of Bounds: Right
    g2Pos.x = 0
    teleportG3()
  } else if (g3Pos.y < 0) { // Out of Bounds: Up
    g3Pos.y = N - 1
    teleportG3()
  } else if (g3Pos.y > N - 1) { // Out of Bounds: Down
    g3Pos.y = 0
    teleportG3()
  } else if (isWall(g3Pos.y, g3Pos.x)) { // Wall hit
    g3Pos.x = originalX
    g3Pos.y = originalY
    g3Dir = dirs[getRandomInt(0, 3)]
  } else { // Move
    animateG3()
  }
}

function moveG4 () {
  const originalY = g4Pos.y
  const originalX = g4Pos.x
  switch (g4Dir) {
    case 'down':
      g4Pos.y++
      break
    case 'up':
      g4Pos.y--
      break
    case 'right':
      g4Pos.x++
      break
    case 'left':
      g4Pos.x--
      break
  }

  // Boundary checks
  if (g4Pos.x < 0) { // Out of Bounds: Left
    g4Pos.x = M - 1
    teleportG4()
  } else if (g4Pos.x > M - 1) { // Out of Bounds: Right
    g4Pos.x = 0
    teleportG4()
  } else if (g4Pos.y < 0) { // Out of Bounds: Up
    g4Pos.y = N - 1
    teleportG4()
  } else if (g4Pos.y > N - 1) { // Out of Bounds: Down
    g4Pos.y = 0
    teleportG4()
  } else if (isWall(g4Pos.y, g4Pos.x)) { // Wall hit
    g4Pos.x = originalX
    g4Pos.y = originalY
    g4Dir = dirs[getRandomInt(0, 3)]
  } else { // Move
    animateG4()
  }
}

function moveAllGhosts () {
  moveG1()
  moveG2()
  moveG3()
  moveG4()
}

// #############################################################################

function checkWin () {
  // console.log('score:' + score)
  // console.log('winning: ' + winningScore)
  return score >= winningScore
}

function showWin () {
  playWin()
  pacman.attr('src', 'clap.gif')
  clearInterval(movePacmanInterval)
  clearInterval(changeDirectionInterval)
  clearInterval(timerInterval)
  clearInterval(updateInterval)
  clearInterval(moveGInterval)
}

function showLose () {
  update()
  playLose()
  pacman.attr('src', 'sadspin.gif')
  clearInterval(movePacmanInterval)
  clearInterval(changeDirectionInterval)
  clearInterval(timerInterval)
  clearInterval(updateInterval)
  clearInterval(moveGInterval)
}

/**
 * Updates the current score, timer, top score, and lives fields.
 * Handles localStorage calling for top score
 */
function update () {
  storage()
  if (checkWin()) {
    showWin()
  }
  $('#currentScore').text('score: ' + score)
  $('#timer').text('Time: ' + seconds)
  $('#topScore').text('TOP: ' + localStorage.getItem('topScore'))
  $('#lifeScore').text('Lives: ' + lives)
}

/**
 * Check if localStorage has a topScore, by default 0.
 * Set top score to current score if needed
 */
function storage () {
  if (typeof (Storage) !== 'undefined') {
    if (localStorage.getItem('topScore')) {
      if (Number(localStorage.getItem('topScore')) < score) {
        localStorage.setItem('topScore', Number(score))
      }
    } else {
      localStorage.setItem('topScore', Number(0))
    }
  }
}

// #############################################################################

/**
 * From main -> play
 */
function showPlay () {
  if ($('#mainMenu').css('z-index') === '100') {
    moveGInterval = setInterval(moveAllGhosts, 100)

    $('#mainMenu').css('z-index', 0)

    song = new Audio('song.mp3')
    song.volume = 0.5
    song.addEventListener('ended', function () {
      this.currentTime = 0
      this.play()
    }, false)
    song.play()
  }
}

/**
 * From play -> main
 */
// function showMain () {
//   if ($('#mainMenu').css('z-index') === '0') {
//     $('#mainMenu').css('z-index', 100)
//     console.log('goto main')
//   }
// }

/**
 * resets the game
 */
function reset () {
  location.reload()
}

/**
 * Reset pacman position
 */
function resetPacman () {
  pacmanPos.y = 8
  pacmanPos.x = 9
  teleportPacman()
}

function resetG1 () {
  g1Pos.x = 9
  g1Pos.y = 5
  teleportG1()
}

function resetG2 () {
  g2Pos.x = 10
  g2Pos.y = 5
  teleportG2()
}

function resetG3 () {
  g3Pos.x = 9
  g3Pos.y = 6
  teleportG3()
}

function resetG4 () {
  g4Pos.x = 10
  g4Pos.y = 6
  teleportG4()
}

function resetGhosts () {
  resetG1()
  resetG2()
  resetG3()
  resetG4()
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// #############################################################################

function playHit () {
  new Audio('hit.mp3').play()
}

function playLose () {
  song.pause()
  new Audio('lose.mp3').play()
}

function playWin () {
  song.pause()
  new Audio('win.mp3').play()
}

function playPowerup () {
  const powerup = new Audio('powerup.mp3')
  powerup.volume = 0.2
  powerup.play()
}

/**
 * Main driver
 */
function main () {
  // Set up gameArea and scoreArea jQuery elements
  mainMenu = $('<div><h1>MAIN MENU</h1><h2>CONTROLS: ARROW KEYS</h2><h2>R: RESET</h2><h2>PRESS P TO PLAY</h2></div>')
  gameArea = $('<div></div>')
  scoreArea = $('<div></div>')

  // Add mainMenu to body
  mainMenu.appendTo('body')
  mainMenu.attr('id', 'mainMenu')
  mainMenu.find(':header').addClass('text')

  // Init functions
  generateMap()
  addEverything()
  teleportPacman()
  animateAllGhosts()

  // Add gameArea to body
  gameArea.appendTo('body')
  gameArea.attr('id', 'gamearea')

  // Add scoreArea to gameArea
  scoreArea.appendTo('#gamearea')
  scoreArea.attr('id', 'scorearea')

  // Add currentScore to scoreArea
  currentScore = $('<p></p>')
  currentScore.appendTo('#scorearea')
  currentScore.attr('id', 'currentScore')

  // Add topScore to scoreArea
  topScore = $('<p></p>')
  topScore.appendTo('#scorearea')
  topScore.attr('id', 'topScore')

  // Add lives to scoreArea
  lifeScore = $('<p></p>')
  lifeScore.appendTo('#scorearea')
  lifeScore.attr('id', 'lifeScore')

  // Add timer to scoreArea
  timer = $('<p></p>')
  timer.appendTo('#scorearea')
  timer.attr('id', 'timer')

  // Interval functions
  movePacmanInterval = setInterval(movePacman, 200) // for every 'timeout' ms, move
  changeDirectionInterval = setInterval(changeDirection, 20) // for every 'timeout' ms, check  if changing direction is valid
  updateInterval = setInterval(update, 10)
  timerInterval = setInterval(function () { seconds++ }, 1000)

  // Keydown listener
  $(window).on('keydown', setDirection) // on keydown, call setDirection
}

/**
 * Calls main if document is ready
 */
$(function () {
  main()
})

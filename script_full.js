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
  ['wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'nothing', /* 'ghost', 'ghost', */'nothing', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall'],
  ['nothing', 'normal', 'wall', 'normal', 'normal', 'normal', 'wall', 'normal', 'wall', 'nothing', /* 'ghost', 'ghost', */'nothing', 'nothing', 'normal', 'wall', 'normal', 'normal', 'normal', 'wall', 'normal', 'nothing'],
  ['wall', 'normal', 'wall', 'wall', 'wall', 'normal', 'wall', 'normal', 'wall', 'wall', 'wall', 'wall', 'normal', 'wall', 'normal', 'wall', 'wall', 'wall', 'normal', 'wall'],
  ['wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'nothing', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall'],
  ['wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall'],
  ['wall', 'normal', 'normal', 'normal', 'wall', 'normal', 'wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall', 'normal', 'wall', 'normal', 'normal', 'normal', 'wall'],
  ['wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'wall', 'wall', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall'],
  ['wall', 'powerup', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'powerup', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'nothing', 'wall', 'wall', 'wall', 'wall', 'nothing', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
]

let pacman
let g1
const g1Pos = { x: 9, y: 5 }
let g2
const g2Pos = { x: 10, y: 5 }
let g3
const g3Pos = { x: 9, y: 6 }
let g4
const g4Pos = { x: 10, y: 6 }

let dir1 = ''
let dir2 = ''
let score = 0

let mainMenu
let gameArea
let scoreArea
let currentScore
let topScore
let lifeScore
let timer

const lives = 3
let seconds = 0

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
    case 'm':
      showMain()
      break
  }
}

function checkCollision () {
  gameArea.find('.ghost').each(function () {
    if (pacmanPos.y === g1Pos.y && pacmanPos.x === g1Pos.x) {
      console.log('HIT')
    } else if (pacmanPos.y === g2Pos.y && pacmanPos.x === g2Pos.x) {
      console.log('HIT')
    } else if (pacmanPos.y === g3Pos.y && pacmanPos.x === g3Pos.x) {
      console.log('HIT')
    } else if (pacmanPos.y === g4Pos.y && pacmanPos.x === g4Pos.x) {
      console.log('HIT')
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
  g1 = $('<img src="juli.png" id="g1" />')
  g1.css({
    width: blockSize,
    height: blockSize
  })
  g1.addClass('ghost')
  g1.appendTo(gameArea)
}

function addG2 () {
  g2 = $('<img src="juli.png" id="g2" />')
  g2.css({
    width: blockSize,
    height: blockSize
  })
  g2.addClass('ghost')
  g2.appendTo(gameArea)
}

function addG3 () {
  g3 = $('<img src="juli.png" id="g3" />')
  g3.css({
    width: blockSize,
    height: blockSize
  })
  g3.addClass('ghost')
  g3.appendTo(gameArea)
}

function addG4 () {
  g4 = $('<img src="juli.png" id="g4" />')
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
          $(this).removeClass('normal')
        }
        if ($(this).hasClass('powerup')) {
          $(this).removeClass('powerup')
        }
      }
    })
  })
}

function animateg1 () {
  g1.animate({
    top: g1Pos.y * blockSize,
    left: g1Pos.x * blockSize
  }, 0)
}

function animateg2 () {
  g2.animate({
    top: g2Pos.y * blockSize,
    left: g2Pos.x * blockSize
  }, 0)
}

function animateg3 () {
  g3.animate({
    top: g3Pos.y * blockSize,
    left: g3Pos.x * blockSize
  }, 0)
}

function animateg4 () {
  g4.animate({
    top: g4Pos.y * blockSize,
    left: g4Pos.x * blockSize
  }, 0)
}

/**
 * Animate the ghosts
 */
function animateAllGhosts () {
  animateg1()
  animateg2()
  animateg3()
  animateg4()
  checkCollision()
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
  console.log(dir1)
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

// #############################################################################

/**
 * Updates the current score, timer, top score, and lives fields.
 * Handles localStorage calling for top score
 */
function update () {
  storage()
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

/**
 * Reset pacman position
 */
// function resetPacman () {
//   pacmanPos.y = 8
//   pacmanPos.x = 9
// }

// #############################################################################

/**
 * From main -> play
 */
function showPlay () {
  if ($('#mainMenu').css('z-index') === '100') {
    $('#mainMenu').css('z-index', 0)
    console.log('start game')
  }
}

/**
 * From play -> main
 */
function showMain () {
  if ($('#mainMenu').css('z-index') === '0') {
    $('#mainMenu').css('z-index', 100)
    console.log('goto main')
  }
}

/**
 * resets the game
 */
function reset () {
  location.reload()
}

// #############################################################################

/**
 * Main driver
 */
function main () {
  // Set up gameArea and scoreArea jQuery elements
  mainMenu = $('<div><h1>MAIN MENU</h1><h2>CONTROLS: ARROW KEYS</h2><h2>M: MAIN</h2><h2>R: RESET</h2><h2>PRESS P TO PLAY</h2></div>')
  gameArea = $('<div></div>')
  scoreArea = $('<div></div>')

  // Add mainMenu to body
  mainMenu.appendTo('body')
  mainMenu.attr('id', 'mainMenu')
  mainMenu.find(':header').addClass('text')

  // Init functions

  addEverything()
  teleportPacman()
  animateAllGhosts()
  generateMap()

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
  setInterval(movePacman, 200) // for every 'timeout' ms, move
  setInterval(animateAllGhosts, 200) // for every 'timeout' ms, move
  setInterval(changeDirection, 20) // for every 'timeout' ms, check  if changing direction is valid
  setInterval(update, 10)
  setInterval(function () { seconds++ }, 1000)

  // Keydown listener
  $(window).on('keydown', setDirection) // on keydown, call setDirection
}

/**
 * Calls main if document is ready
 */
$(function () {
  main()
})

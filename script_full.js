const N = 14
const M = 20
const blockSize = 800 / M
const pacmanPos = { x: 9, y: 8 }
const KEYLEFT = 'ArrowLeft'
const KEYUP = 'ArrowUp'
const KEYRIGHT = 'ArrowRight'
const KEYDOWN = 'ArrowDown'
const Map = [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'normal', 'wall', 'wall', 'wall', 'wall', 'normal', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'powerup', 'normal', 'normal', 'normal', 'normal', 'wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall', 'normal', 'normal', 'normal', 'normal', 'powerup', 'wall'],
  ['wall', 'normal', 'wall', 'wall', 'wall', 'normal', 'normal', 'normal', 'wall', 'wall', 'wall', 'wall', 'normal', 'normal', 'normal', 'wall', 'wall', 'wall', 'normal', 'wall'],
  ['wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall'],
  ['wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'wall', 'wall', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall'],
  ['wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'ghost', 'ghost', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall'],
  ['normal', 'normal', 'wall', 'normal', 'normal', 'normal', 'wall', 'normal', 'wall', 'ghost', 'ghost', 'normal', 'normal', 'wall', 'normal', 'normal', 'normal', 'wall', 'normal', 'normal'],
  ['wall', 'normal', 'wall', 'wall', 'wall', 'normal', 'wall', 'normal', 'wall', 'wall', 'wall', 'wall', 'normal', 'wall', 'normal', 'wall', 'wall', 'wall', 'normal', 'wall'],
  ['wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall'],
  ['wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall', 'normal', 'wall', 'wall'],
  ['wall', 'normal', 'normal', 'normal', 'wall', 'normal', 'wall', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'wall', 'normal', 'wall', 'normal', 'normal', 'normal', 'wall'],
  ['wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'wall', 'wall', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall', 'normal', 'wall'],
  ['wall', 'powerup', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'powerup', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'normal', 'wall', 'wall', 'wall', 'wall', 'normal', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
]
let gameArea
let pacman
let direction

function generateMap () {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const block = $('<div></div>')
      block.addClass('normal')
      if (Map[i][j] === 'wall') {
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

function addPacman () {
  pacman = $('<img src="pognom.gif" id="pacman" />')
  pacman.css({
    width: blockSize,
    height: blockSize
  })

  pacman.appendTo(gameArea)
}

function setDirection (e) {
  const key = e.key
  switch (key) {
    case KEYDOWN:
      direction = 'down'
      break
    case KEYUP:
      direction = 'up'
      break
    case KEYRIGHT:
      direction = 'right'
      break
    case KEYLEFT:
      direction = 'left'
      break
  }
}

function movePacman (e) {
  // const key = e.key
  const originalY = pacmanPos.y
  const originalX = pacmanPos.x

  switch (direction) {
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

  // Tartományok ellenőrzése
  if (Map[pacmanPos.y][pacmanPos.x] === 'wall') {
    pacmanPos.x = originalX
    pacmanPos.y = originalY
  } else if (pacmanPos.x < 0) {
    pacmanPos.x = 0
  } else if (pacmanPos.x > M - 1) {
    pacmanPos.x = M - 1
  } else if (pacmanPos.y < 0) {
    pacmanPos.y = 0
  } else if (pacmanPos.y > N - 1) {
    pacmanPos.y = N - 1
  } else {
    animatePacman()
  }
}

function animatePacman () {
  pacman.animate({
    top: pacmanPos.y * blockSize,
    left: pacmanPos.x * blockSize
  }, 100, function () {
    // setTimeout(movePacman(), 500)
    // gameArea.find('.wall').each(function () {
    //   if (
    //     $(this).css('top') === pacman.css('top') &&
    //     $(this).css('left') === pacman.css('left')
    //   ) {
    //     console.log('ide nem kene lepni')
    //     if (Math.random() < 0.33) {
    //       $(this).removeClass('chest')
    //       $(this).addClass('nothing')
    //     } else if (Math.random() < 0.66) {
    //       $(this).removeClass('chest')
    //       $(this).addClass('monster')
    //     } else {
    //       $(this).removeClass('chest')
    //       $(this).addClass('loot')
    //     }
    //   }
    // })
  })
}

$(function () {
  gameArea = $('<div></div>')
  gameArea.appendTo('body')
  gameArea.attr('id', 'gamearea')

  addPacman()
  animatePacman() // kell, hogy ne bal felül kezdjen az animacio
  generateMap()
  setInterval(movePacman, 300)
  $(window).on('keydown', setDirection)
})

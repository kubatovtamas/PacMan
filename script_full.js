const N = 14 // height
const M = 20 // width
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
let dir1 = 'right'
let dir2 = 'up'

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

function isWall (y, x) {
  return Map[y][x] === 'wall'
}

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
      // direction = 'up'
      // break
    case KEYRIGHT:
      if (isWall(pacmanPos.y, pacmanPos.x + 1)) {
        dir2 = 'right'
        break
      }
      dir1 = 'right'
      break
      // direction = 'right'
      // break
    case KEYLEFT:
      if (isWall(pacmanPos.y, pacmanPos.x - 1)) {
        dir2 = 'left'
        break
      }
      dir1 = 'left'
      break
      // direction = 'left'
      // break
  }
}

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

  // Tartományok ellenőrzése
  if (pacmanPos.x < 0) {
    pacmanPos.x = M - 1
    teleportPacman()
  } else if (pacmanPos.x > M - 1) {
    pacmanPos.x = 0
    teleportPacman()
  } else if (pacmanPos.y < 0) {
    pacmanPos.y = N - 1
    teleportPacman()
  } else if (pacmanPos.y > N - 1) {
    pacmanPos.y = 0
    teleportPacman()
  } else if (isWall(pacmanPos.y, pacmanPos.x)) {
    pacmanPos.x = originalX
    pacmanPos.y = originalY
  } else {
    animatePacman()
  }
}

function teleportPacman () {
  pacman.animate({
    top: pacmanPos.y * blockSize,
    left: pacmanPos.x * blockSize
  }, 0
  )
}

function animatePacman () {
  pacman.animate({
    top: pacmanPos.y * blockSize,
    left: pacmanPos.x * blockSize
  }, 150, function () {
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
  animatePacman()
  generateMap()

  setInterval(movePacman, 200) // timeout ms-onként lép
  setInterval(changeDirection, 50)
  $(window).on('keydown', setDirection) // on keydown, állítunk directiont
})

/**
 * Változók létrehozása.
 * N: tábla mérete (10x10);
 * blockSize: egy elem mérete;
 * shipPos: hajó pozíciója, (0,0)-ból indul;
 * gameArea: jQuery elem a járéktér tárolására
 * ship: jQuery elem a hajó tárolására
 */
const N = 14
const M = 20
const blockSize = 800 / M
const pacmanPos = {
  x: 9,
  y: 8
}
let gameArea
let pacman

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

// Nyílbillentyűk
const KEYLEFT = 'ArrowLeft'
const KEYUP = 'ArrowUp'
const KEYRIGHT = 'ArrowRight'
const KEYDOWN = 'ArrowDown'

/**
 * Jég generálása.
 * Végigmegyünk az N*N-es táblán,
 * alapvetően minden mező víz osztályba tarozik,
 * de egy randomgenerálás után, 50% eséllyel
 * jég osztálybeli lesz.
 * Beállítjuk a CSS tulajdonságokat,
 * minden egyes mező elhelyezkedése abszolút a
 * játéktérhez képest.
 * Végül hozzáfűzzük a játéktérhez.
 */
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

/**
 * A hajót létrehozó, kirajzoló fv.
 * HTML image objektum.
 * Mérete megfelel egy mező méretének,
 * hozzáfűzzűk a játéktérhez.
 */
function addPacman () {
  pacman = $('<img src="pognom.gif" id="pacman" />')
  pacman.css({
    width: blockSize,
    height: blockSize
  })

  pacman.appendTo(gameArea)
}

/**
 *  Eseménykezelő, amely a billentyű lenyomásakor
 *  zajlik le.
 *  Input paraméter az event objektum.
 */
function movePacman (e) {
  const key = e.key
  const originalY = pacmanPos.y
  const originalX = pacmanPos.x

  switch (key) {
    case KEYDOWN:
      pacmanPos.y++
      break
    case KEYUP:
      pacmanPos.y--
      break
    case KEYRIGHT:
      pacmanPos.x++
      break
    case KEYLEFT:
      pacmanPos.x--
      break
  }

  // gameArea.find('.wall').each(function () {
  //   if (
  //     $(this).css('top') === pacman.css('top') &&
  //     $(this).css('left') === pacman.css('left')
  //   ) {
  //     pacmanPos.x = originalX
  //     pacmanPos.y = originalY
  //     console.log('Each:' + pacmanPos.y + ' - ' + pacmanPos.x)
  //   }
  // })

  // Tartományok ellenőrzése
  if (Map[pacmanPos.y][pacmanPos.x] === 'wall') {
    console.log('WALL')
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

/**
 * Animációért felelős függvény
 * Alapvetően az animate függvényt hívjuk meg,
 * beállítjuk, hogy mit animáljon (pacman)
 * hogyan (módosítsa a pozíciót)
 * és mennyi idő alatt (300 ms).
 * Végül pedig jön a callback függvény (az animáció végén hívandó fv.).
 * Esetünkben ez felelős azért, hogy amennyiben a hajó jégre ért, akkor
 * "törje azt fel", azaz a jég osztályt kell eltávolítani.
 * */
function animatePacman () {
  pacman.animate({
    top: pacmanPos.y * blockSize,
    left: pacmanPos.x * blockSize
  }, 100, function () {
    // alternatív változat:
    // $('.ice').each(function(){
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

/**
 * Ez fut le akkor, amikor az oldal betöltődött.
 * A gameArea-t helyezi el a body-ba az appendTo
 * fv. segítségével.
 * Ezután a pacmant, a falakat, a szellemeket,
 * a powerupokat rajzoljuk ki
 * és definiálunk egy eseménykezelőt a bill.
 * lenyomásának figyelésére.
 */
$(function () {
  gameArea = $('<div></div>')
  gameArea.appendTo('body')
  gameArea.attr('id', 'gamearea')

  addPacman()
  animatePacman() // kell, hogy ne bal felül kezdjen az animacio
  generateMap()

  $(window).on('keydown', movePacman)
})

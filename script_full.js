/**
 * Változók létrehozása.
 * N: tábla mérete (10x10);
 * blockSize: egy elem mérete;
 * shipPos: hajó pozíciója, (0,0)-ból indul;
 * gameArea: jQuery elem a járéktér tárolására
 * ship: jQuery elem a hajó tárolására
 */
const N = 12
const blockSize = 500 / N
const shipPos = { x: 0, y: 0 }
let gameArea
let ship

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
function randomizeIce () {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const block = $('<div></div>')
      block.addClass('normal')

      if (Math.random() > 0.5) {
        block.addClass('chest')
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
function addShip () {
  ship = $('<img src="pognom.gif" id="ship" />')
  ship.css({
    width: blockSize,
    height: blockSize
  })

  ship.appendTo(gameArea)
}

/**
 *  Eseménykezelő, amely a billentyű lenyomásakor
 *  zajlik le.
 *  Input paraméter az event objektum.
 */
function moveShip (e) {
  const key = e.key // lekérjük a lenyomott billentyűt
  /* A lenyomott bill. alapján beállítjuk a hajó
      új pozícióját, és az animációval odamegyünk.
     */
  switch (key) {
    case KEYDOWN:
      shipPos.y++
      break
    case KEYUP:
      shipPos.y--
      break
    case KEYRIGHT:
      shipPos.x++
      break
    case KEYLEFT:
      shipPos.x--
      break
  }

  // Tartományok ellenőrzése
  if (shipPos.x < 0) {
    shipPos.x = 0
  } else if (shipPos.x > N - 1) {
    shipPos.x = N - 1
  } else if (shipPos.y < 0) {
    shipPos.y = 0
  } else if (shipPos.y > N - 1) {
    shipPos.y = N - 1
  } else {
    animateShip()
  }
}

/**
 * Animációért felelős függvény
 * Alapvetően az animate függvényt hívjuk meg,
 * beállítjuk, hogy mit animáljon (hajó)
 * hogyan (módosítsa a pozíciót)
 * és mennyi idő alatt (300 ms).
 * Végül pedig jön a callback függvény (az animáció végén hívandó fv.).
 * Esetünkben ez felelős azért, hogy amennyiben a hajó jégre ért, akkor
 * "törje azt fel", azaz a jég osztályt kell eltávolítani.
 * */
function animateShip () {
  ship.animate({
    top: shipPos.y * blockSize,
    left: shipPos.x * blockSize
  }, 100, function () {
    // alternatív változat:
    // $('.ice').each(function(){
    gameArea.find('.chest').each(function () {
      if (
        $(this).css('top') === ship.css('top') &&
        $(this).css('left') === ship.css('left')
      ) {
        if (Math.random() < 0.33) {
          $(this).removeClass('chest')
          $(this).addClass('nothing')
        } else if (Math.random() < 0.66) {
          $(this).removeClass('chest')
          $(this).addClass('monster')
        } else {
          $(this).removeClass('chest')
          $(this).addClass('loot')
        }
      }
    })
  })
}

/**
 * Ez fut le akkor, amikor az oldal betöltődött.
 * A gameArea-t helyezi el a body-ba az appendTo
 * fv. segítségével.
 * Ezután a hajót és a jeget rajzoljuk ki,
 * és definiálunk egy eseménykezelőt a bill.
 * lenyomásának figyelésére.
 */
$(function () {
  gameArea = $('<div></div>')
  gameArea.appendTo('body')
  gameArea.attr('id', 'gamearea')

  addShip()
  randomizeIce()

  $(window).on('keydown', moveShip)
})

const easyN = 4 // number of rows per easy game
const hardN = 5 // number of rows per hard game

let types = 6 // number of domino types

let topLevel // the top level
let bottomLevel // the lower level

let oldClicked // old clicked domino
let newClicked // new clicked domino

let pieces // all the dominoes left
let topPieces
let bottomPieces
let topWidth

let topDominoes
let bottomDominoes
let dominoSkins

let t // timer
let time = 0 // time per game

let score = 0 // current score

let started = false
let playing = false

const player = { name: '', score: 0 }
const players = []

function covering (bot) {
  let top
  let covers = false

  for (let i = 0; i < topDominoes[0].length; i++) {
    for (let j = 0; j < topDominoes[0][0].length; j++) {
      top = topDominoes[0][i][j]

      if (top.status !== 'unavailable') {
        if (
          (
            (top.tl.x > bot.tl.x) && (top.tl.x < bot.tr.x) ||
                        (top.tl.x < bot.tl.x) && (top.tr.x > bot.tl.x)
          ) && (
            (top.tl.y > bot.tl.y) && (top.tl.y < bot.bl.y) ||
                        (top.tl.y < bot.tl.y) && (top.bl.y > bot.tl.y)
          )

        ) {
          console.log(`${top.id} takarja ${bot.id}-t`)
          covers = true
        }
      }
    }
  }
  return covers
}

function canClick (id) {
  const level = parseInt(id.split('level')[1].split('row')[0])
  const row = parseInt(id.split('row')[1].split('col')[0]) - 1
  const col = parseInt(id.split('col')[1]) - 1

  let dominoes

  if (level === 1) { dominoes = bottomDominoes } else { dominoes = topDominoes }

  const domino = dominoes[0][col][row]

  console.log(
        `id:			${domino.id},\n` +
        `level:			${domino.level},\n` +
        `level:         ${domino.status},\n` +
        `top-left:		(${domino.tl.x};${domino.tl.y}),\n` +
        `top-right:		(${domino.tr.x};${domino.tr.y}),\n` +
        `bottom-left:	(${domino.bl.x};${domino.bl.y}),\n` +
        `bottom-right:	(${domino.br.x};${domino.br.y})`
  )
  return (
    level === 2 ||
        level === 1 &&
        !covering(dominoes[0][col][row])
  ) && (
    col === 0 ||
        col === dominoes[0].length - 1 ||
        (
          dominoes[0][col - 1][row] !== undefined &&
            dominoes[0][col - 1][row].status === 'unavailable'
        ) || (
      dominoes[0][col + 1][row] !== undefined &&
            dominoes[0][col + 1][row].status === 'unavailable'
    )
  )
}

function deleteDomino (id) {
  const level = parseInt(id.split('level')[1].split('row')[0])
  const row = parseInt(id.split('row')[1].split('col')[0]) - 1
  const col = parseInt(id.split('col')[1]) - 1

  let dominoes

  if (level === 1) { dominoes = bottomDominoes } else { dominoes = topDominoes }

  dominoes[0][col][row].status = 'unavailable'
}

function placeDominoes (rows, cols, blockWidth, blockHeight, N, level) {
  const dominoCol = []
  let dominoRow
  let domino
  let skin
  let domPos

  for (let i = 0; i < cols; i++) {
    dominoRow = []
    for (let j = 0; j < rows; j++) {
      domino = $('<div></div>')
      domino.get(0).id = `level${level}row${j + 1}col${i + 1}`
      domino.addClass('domino')
      domino.addClass(`domino_${level}`)

      domino.css({
        width: blockWidth,
        height: blockHeight,
        top: j * blockHeight,
        left: i * blockWidth
      })

      let plus = 0
      if (level === 2) { plus = 40 }

      domPos = {
        id: domino.get(0).id,
        status: 'available',
        level: level,
        row: i + 1,
        col: j + 1,
        tl: { x: i * blockWidth + plus, y: j * blockHeight + plus },
        tr: { x: (i + 1) * blockWidth + plus, y: j * blockHeight + plus },
        bl: { x: i * blockWidth + plus, y: (j + 1) * blockHeight + plus },
        br: { x: (i + 1) * blockWidth + plus, y: (j + 1) * blockHeight + plus }
      }

      dominoRow.push(domPos)
      /*
                        console.log(
                            `id:			${domPos.id},\n` +
                            `level:			${domPos.level},\n` +
                            `level:         ${domPos.status},\n` +
                            `top-left:		(${domPos.tl.x};${domPos.tl.y}),\n` +
                            `top-right:		(${domPos.tr.x};${domPos.tr.y}),\n` +
                            `bottom-left:	(${domPos.bl.x};${domPos.bl.y}),\n` +
                            `bottom-right:	(${domPos.br.x};${domPos.br.y})`
                        )
            */
      $(domino).css('background-size', `${blockWidth}px ${blockHeight}px`)

      skin = dominoSkins.splice(Math.floor(Math.random() * dominoSkins.length), 1)
      domino.addClass(skin)

      $(domino).bind('click', function () {
        if (playing) {
          const nowClicked = $(this).get(0).id

          if (canClick(nowClicked)) {
            oldClicked = newClicked

            newClicked = {
              id: nowClicked,
              type: $(this).prop('className').split(' ')[2]
            }

            let oldClickedDiv

            if (
              oldClicked !== undefined &&
                            oldClicked.id !== undefined
            ) { oldClickedDiv = document.getElementById(oldClicked.id) }
            const newClickedDiv = document.getElementById(newClicked.id)

            if (
              oldClickedDiv !== undefined &&
                            oldClickedDiv !== null
            ) {
              if (
                oldClicked.type === newClicked.type &&
                                oldClicked.id !== newClicked.id
              ) {
                oldClickedDiv.remove()
                newClickedDiv.remove()

                updateScore(1)

                pieces -= 2

                document.getElementById('pieces').innerHTML = `Még ${pieces} db maradt`

                deleteDomino(oldClicked.id)
                deleteDomino(newClicked.id)

                oldClicked = undefined
                newClicked = undefined

                if (pieces === 0) {
                  setPlayers(player)
                  clearInterval(t)
                  alert(`${time} másodperc alatt végeztél, és ${score} pontot szereztél`)
                }
              } else {
                if (N === easyN) {
                  if (oldClicked.id === newClicked.id) { updateScore(-0.25) } else { updateScore(-0.5) }
                } else {
                  if (oldClicked.id === newClicked.id) { updateScore(-0.5) } else { updateScore(-1) }
                }

                oldClickedDiv.style.filter = 'drop-shadow(4px 4px 3px rgba(0, 0, 0, .7))'

                if (oldClicked.id !== newClicked.id) {
                  oldClicked = undefined
                  newClickedDiv.style.filter = 'grayscale(100%)'
                } else { newClicked = undefined }
              }
            } else { newClickedDiv.style.filter = 'grayscale(100%)' }
          }
        }
      })

      if (level === 1) { domino.appendTo(bottomLevel) } else { domino.appendTo(topLevel) }
    }
    dominoCol.push(dominoRow)
  }
  if (level === 1) { bottomDominoes.push(dominoCol) } else { topDominoes.push(dominoCol) }
}

function setup (N) {
  if (N === hardN) { types = 8 }

  const bottomRows = N
  const bottomCols = N + 1

  const topRows = bottomRows - 1
  const topCols = bottomCols - 1

  const bottomBlockWidth = 480 / bottomCols
  const bottomBlockHeight = 480 / bottomRows

  const topBlockWidth = 400 / topCols
  const topBlockHeight = 400 / topRows

  bottomPieces = bottomRows * bottomCols
  topPieces = topRows * topCols

  pieces = bottomPieces + topPieces

  topDominoes = []
  bottomDominoes = []

  document.getElementById('pieces').innerHTML = `Még ${pieces} db maradt`

  dominoSkins = []
  let counter = 0

  topLevel = $('<div></div>')
  topLevel.get(0).setAttribute('id', 'dominoContainer2')
  topLevel.appendTo(bottomLevel)

  for (let i = 0; i < pieces / 2; i++) {
    counter++
    for (let j = 0; j < 2; j++) {
      dominoSkins.push(`domino${counter}`)
      if (counter === types && j > 0) { counter = 0 }
    }
  }

  placeDominoes(bottomRows, bottomCols, bottomBlockWidth, bottomBlockHeight, N, 1)
  placeDominoes(topRows, topCols, topBlockWidth, topBlockHeight, N, 2)
}

function getPlayers () {
  let p
  for (let i = 1; i <= 5; i++) {
    try {
      p = String(localStorage.getItem(`player${i}`))
      if (
        p !== undefined &&
                p != null &&
                p.split('=')[0] !== undefined &&
                p.split('=')[1] !== undefined
      ) {
        players.push({
          name: p.split('=')[0],
          score: p.split('=')[1]
        })
        console.log(`Adding ${p.split('=')[0]}, ${p.split('=')[1]} points to ŁeaDerBoard`)
      }
    } catch (e) {
    }
  }
}

function setPlayers (player) {
  players.push(player)

  let smallest = 9000000000
  let pl

  players.forEach(p => {
    if (
      p.name === 'null' ||
            p.score === 'undefined'
    ) {
      try {
        index = players.indexOf(p)
        if (index !== -1) { players.splice(index, 1) }
      } catch (e) {
      }
    } else if (players.length > 5 && p.score < smallest) {
      smallest = p.score
      pl = p
    }
  })

  let index = players.indexOf(pl)
  if (index !== -1) { players.splice(index, 1) }

  for (let i = 0; i < 5; i++) {
    console.log(`saving "${players[i].name}=${players[i].score}" into the Łeaderboard`)
    localStorage.setItem(`player${i + 1}`, `${players[i].name}=${players[i].score}`)
  }
}

function printPlayers () {
  getPlayers()
  let tr
  let td
  for (let i = 0; i < players.length; i++) {
    if (
      players[i].name !== 'null' &&
            players[i].score !== 'undefined'
    ) {
      tr = $('<tr></tr>')
      td = $('<td></td>')
      td.get(0).innerHTML = `${i + 1}.)  ${players[i].name}, ${players[i].score} pont`
      td.appendTo(tr.get(0))
      tr.appendTo(document.getElementById('ŁeaDerBoard'))
    }
  }
}

function updateScore (value) {
  score += value
  document.getElementById('score').innerHTML = `Jelenlegi pontszám: ${score * 1.0} pont`
  player.score = score
}

function updateClock () {
  document.getElementById('clock').innerHTML = `Eltelt idő: ${time}s`
}

function currTime () {
  time++
  updateClock()
}

function startGame () {
  if (playing) {
    playing = false
    document.getElementById('startBtn').innerHTML = 'Start'
    clearInterval(t)
    t = undefined
  } else {
    if (!started) {
      player.name = document.getElementById('playerName').value
      time = 0
      updateScore(0)
      topLevel = undefined
      if (document.getElementById('easy').checked) { setup(easyN) } else { setup(hardN) }
      started = true
    }
    playing = true
    document.getElementById('startBtn').innerHTML = 'Stop'
    t = setInterval(currTime, 1000)
  }
}

function resetGame () {
  if (started) {
    bottomLevel.innerHTML = ''
    topLevel.innerHTML = ''
    started = false
    playing = false
    time = 0
    clearInterval(t)
  }
  startGame()
}

$(function () {
  document.getElementById('dingding').play()
  bottomLevel = document.getElementById('dominoContainer')
  printPlayers()
})

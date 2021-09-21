const grid = document.querySelector('.grid')
let width = 9
let bombAmount = 10
let flags = 0
let squares = []
let isGameOver = false

// Create board
function createBoard() {

    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width*width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5)


    for (let i = 0; i < width*width; i++) {
        const square = document.createElement('div')
        square.setAttribute('id', i)
        square.classList.add(shuffledArray[i])
        // square.innerHTML = i + '<br>' + i % width
        grid.appendChild(square)
        squares.push(square)

        // normal click
        square.addEventListener('click', function (e) {
            click(square)
        })

        // left click
        square.oncontextmenu = function (e) {
            e.preventDefault()
            addFlag(square)
        }
    }

    // iterate through every square
    for (let i = 0; i < squares.length; i++) {
        let total = 0
        const isLeftEdge = i % width === 0 
        const isRightEdge = i % width === width - 1

        // add numbers to the valid squares
        if (squares[i].classList.contains('valid')) {
            
            // left
            if (i < squares.length - 1 && !isRightEdge && squares[i + 1].classList.contains('bomb')) {
                total++
            }

            // bottomleft
            if (i > width - 1 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) {
                total++
            }

            // bottom
            if (i > width && squares[i - width].classList.contains('bomb')) {
                total++
            }

            // bottomright
            if (i > width + 1 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) {
                total++
            }

            // right
            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) {
                total++
            }
            
            // topright
            if (i < squares.length - width && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) {
                total++
            }

            // top
            if (i < squares.length - width && squares[i + width].classList.contains('bomb')) {
                total++
            }

            // topleft
            if (i < squares.length - 1 - width && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) {
                total++
            }

            squares[i].setAttribute('data', total)
            // squares[i].innerHTML = total

        }
    }

}

createBoard()

// add flag with right click 
function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
        if (!square.classList.contains('flag')) {
            square.classList.add('flag')
            square.innerHTML = '🚩'
            flags++

            setTimeout(checkForWin, 10)

        } else {
            square.classList.remove('flag')
            square.innerHTML = ''
            flags--
        }
    }
}

// click on square actions
function click(square) {
    let currentId = square.id
    if (isGameOver) return

    if (square.classList.contains('checked') || square.classList.contains('flag')) return

    if (square.classList.contains('bomb')) {
        gameOver(square)
    } else {
        let total = square.getAttribute('data')
        if (total != 0) {
            square.classList.add('checked')
            square.innerHTML = total
            return
        }
        checkSquare(square, currentId)
    }
    square.classList.add('checked')
}

// check squares next to the clicked square
function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0)
    const isRightEdge = (currentId % width === width - 1)

    setTimeout(() => {
        if (currentId > 0 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId > width - 1 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1 - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId > width + 1) {
            const newId = squares[parseInt(currentId) - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId > width + 2 && !isLeftEdge) {
            const newId = squares[parseInt(currentId) -1 - width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId < squares.length - 1 && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId < squares.length - width && !isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1 + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId < squares.length - 1 - width && !isRightEdge) {
            const newId = squares[parseInt(currentId) + 1 + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }
        if (currentId < squares.length - width) {
            const newId = squares[parseInt(currentId) + width].id
            const newSquare = document.getElementById(newId)
            click(newSquare)
        }


    }, 10);
}

// gameover
function gameOver(square) {
    console.log('Boom')
    isGameOver = true;

    // show all bombsArray
    squares.forEach(square => {
        if (square.classList.contains('bomb')) {
            square.innerHTML = '💣'
        }
    })
}

// check for win
function checkForWin() {
    let matches = 0

    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('bomb') && squares[i].classList.contains('flag')) {
            matches++
        }
        if (matches === bombAmount) {
            squares.forEach(square => {
                if (!square.classList.contains('bomb') && !square.classList.contains('checked')) {
                    square.classList.add('checked')
                }
            })

            setTimeout(() => {
                alert('You win!')
            }, 10);

            isGameOver = true
            return
        }
    }
}
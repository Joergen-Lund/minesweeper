const grid = document.querySelector('.grid')
let width = 0
let bombAmount = 0
let flags = 0
let squares = []
let isGameOver = false

const div = document.querySelectorAll('.option')
const divCon = document.querySelector('.chooseSize')
div.forEach(div => {
    div.addEventListener('click', () => {
        divCon.style.display = 'none'
        init(div)
    })
});

function init(div) {
    option = div.id
    
    if (option == 'easy') {
        width = 9
        bombAmount = 10
        grid.style.width = '364px'
        grid.style.height = '364px'
        grid.style.display = 'flex'
        createBoard()
    } else if (option == 'medium') {
        width = 16
        bombAmount = 40
        grid.style.width = '644px'
        grid.style.height = '644px'
        grid.style.display = 'flex'
        createBoard()
    } else if (option == 'hard'){
        width = 20
        bombAmount = 60
        grid.style.width = '804px'
        grid.style.height = '804px'
        grid.style.display = 'flex'
        createBoard()
    }
}

// Create board
function createBoard() {

    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width * width - bombAmount).fill('valid')
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

        // right click
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
            if (i > width -1 && squares[i - width].classList.contains('bomb')) {
                total++
            }

            // bottomright
            if (i > width && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) {
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

// createBoard()

// add flags
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
    } else if (!square.classList.contains('checked') && flags == bombAmount) {
        square.classList.remove('flag')
        square.innerHTML = ''
        flags--
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

    // show all bombs
    squares.forEach(square => {
        if (square.classList.contains('bomb')) {
            square.innerHTML = '💣'
        } else if (parseInt(square.getAttribute('data')) > 0) {
            square.classList.add('checked')
            square.innerHTML = square.getAttribute('data')
        } else {
            square.classList.add('checked')
        }
    })

    setTimeout(() => {
        alert('You lose!')
    }, 10);

    setTimeout(() => {
        restart()
    }, 100);

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
            setTimeout(() => {
                restart()
                
            }, 100);
            return
        }
    }
}

function restart() {
    grid.style.display = 'none'
    grid.innerHTML = ''
    divCon.style.display = 'block'
    flags = 0
    squares = []
    isGameOver = false
}
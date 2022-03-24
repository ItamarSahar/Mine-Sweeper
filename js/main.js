'use strict'
var gMouseCode
var gIntervalID = 0
var gStartTime = 0
var gElBtn = document.querySelector('.restart')
var gMines = []
var gBoard = []
var gLevel = {
	size: 4,
	mines: 3,
}
var gGame = {
	isOn: false,
	shownCount: 0,
	markedCount: 0,
	numOfLife: 3,
}

function init() {
	endTimer()
	resatrtGame()
	gGame.isOn = true
	gBoard = buildBoard()
	renderBoard(gBoard, '.table')
	countShown()
	gElBtn.innerText = '😁'
	// console.log(' init mines location ', gMines)
	// console.log(gBoard)
}

function buildBoard() {
	var board = []
	for (var i = 0; i < gLevel.size; i++) {
		var row = []
		for (var j = 0; j < gLevel.size; j++) {
			row.push(createCell(i, j))
		}
		board.push(row)
	}

	return board
}

function createCell(i, j, isMine = false) {
	var cell = {
		location: {
			i,
			j,
		},
		minesAroundCount: 0,
		isShown: false,
		isMine: isMine,
		isMarked: false,
	}
	return cell
}

function renderBoard(mat, selector) {
	var strHTML = '<table border="0"><tbody>'
	for (var i = 0; i < mat.length; i++) {
		strHTML += '<tr >'
		for (var j = 0; j < mat[0].length; j++) {
			var cell = ''
			var className = 'cell-' + i + '-' + j
			strHTML += `<td class='${className}' onmouseup="getMouseClickCode(${i}, ${j} ,event)" onclick="cellClicked(this, ${i}, ${j})"  >${cell} </td>`
		}
		strHTML += '</tr>'
	}
	strHTML += '</tbody></table>'
	var elContainer = document.querySelector(selector)
	elContainer.innerHTML = strHTML
}

function findMinedNeghbors(cellI, cellJ, mat) {
	var neighborsCount = 0
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= mat.length) continue
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (i === cellI && j === cellJ) continue
			if (j < 0 || j >= mat[i].length) continue
			var currCell = mat[i][j]
			if (currCell.isMine) neighborsCount++
			// console.log('currcell' , cellI,cellJ);
			// console.log('i ,j' , i ,j);
			// console.log(mat[i][j].isMine);
			// console.log('neighborsCount' , neighborsCount);
		}
	}
	return neighborsCount
}

function setMinesNegsCount(board) {
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			board[i][j].minesAroundCount = findMinedNeghbors(i, j, gBoard)
		}
	}
}
//catch the left-click from the mouse and active the function
function cellClicked(elCell, i, j) {
	// console.log(event.button)
	var clickedCell = gBoard[i][j]
	if (clickedCell.isMarked) return
	if (clickedCell.isShown) return

	if (gGame.markedCount === 0 && gGame.shownCount === 0) {
		clickedCell.isShown = true
		creatMines()
		setMinesNegsCount(gBoard)
		if (gIntervalID === 0) startTimer()
		console.log('mines location ', gMines)

		console.log(gBoard)
	}
	if (!gGame.isOn) return

	showCell(elCell, clickedCell, i, j)
	return
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
	// Select the elCell and set the value
	var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
	elCell.innerHTML = value
}
//render a cell with .seleceted class
function renderShownCell(location, value) {
	// Select the elCell and set the value
	var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
	elCell.innerHTML = value
	elCell.classList.add('selected')
}
//create the moines and push all the mines location to an array
function creatMines() {
	gMines = []
	var lastI
	var lastJ
	while (gMines.length !== gLevel.mines) {
		var randomI = getRandomInt(0, gBoard.length)
		var randomJ = getRandomInt(0, gBoard[0].length)
		if (gBoard[randomI][randomJ].isShown) continue
		if (lastI === randomI && lastJ === randomJ) continue
		gBoard[randomI][randomJ] = createCell(randomI, randomJ, true)
		gMines.push(gBoard[randomI][randomJ].location)
		lastI = randomI
		lastJ = randomJ
	}
	// console.log(gMines)
}
//get a random number to the mines location
function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min)
}
//when game is over its show all the miens on the board
function gameOver() {
	for (var i = 0; i < gMines.length; i++) {
		renderCell(gMines[i], '💣')
	}
	finishGame(false)
	gGame.isOn = false
}
//start the timer
function startTimer() {
	var elSeconds = document.querySelector('.sec')
	var elMinutes = document.querySelector('.min')

	gStartTime = Date.now()
	gIntervalID = setInterval(function () {
		var timeDiff = Date.now() - gStartTime
		var currTime = new Date(timeDiff)
		elSeconds.innerHTML = pad(currTime.getSeconds())
		elMinutes.innerHTML = pad(currTime.getMinutes())
	}, 1000)
}
//stop the timer
function endTimer() {
	clearInterval(gIntervalID)
	gIntervalID = 0
}
//make the timer format 00:00
function pad(val) {
	var valString = val + ''
	if (valString.length < 2) {
		return '0' + valString
	} else {
		return valString
	}
}
//catch the right-click from the mouse and active the function
function getMouseClickCode(i, j, event) {
	var clickedCell = gBoard[i][j]
	if (gIntervalID === 0) startTimer()
	if (event.button === 2) {
		// console.log('press')
		markCell(clickedCell)
		// console.log(gBoard)
		return
	}
}
//add or remove a flag from a cell
function markCell(clickedCell) {
	if (clickedCell.isShown) return
	if (!gGame.isOn) return
	if (!clickedCell.isMarked) {
		clickedCell.isMarked = true
		renderCell(clickedCell.location, '🚩')

		// console.log('press')
	} else {
		clickedCell.isMarked = false
		renderCell(clickedCell.location, '')
	}
	if (checkVictory()) {
		finishGame(true)
	}
	// console.log(clickedCell);
}
//catch from the button the selected level
function selectedLevel(size, mine, elBtn) {
	console.log(size, mine)
	gLevel = {
		size: size,
		mines: mine,
	}

	init()
}
//make the cell show and render the cell to show
function showCell(elCell, clickedCell, i, j) {
	if (clickedCell.isMine) {
		renderShownCell(clickedCell.location, '💣')
		countLife()
		clickedCell.isShown = true
		if (gGame.numOfLife === 0) gameOver()
		return
	}
	if (clickedCell.minesAroundCount > 0) {
		var value = clickedCell.minesAroundCount
		renderCell(clickedCell.location, value)
	}
	if (clickedCell.minesAroundCount === 0) {
		showNeghbors(clickedCell)
	}
	elCell.classList.add('selected')
	clickedCell.isShown = true

	if (checkVictory()) {
		finishGame(true)
	}
	console.log('Shown Count', gGame.shownCount)
}
//returns true or false depends on the win condition
function checkVictory() {
	countShown()
	countMarked()
	return (
		gGame.markedCount === gLevel.mines &&
		gGame.shownCount === gLevel.size * gLevel.size - gLevel.mines
	)
}
//render the finish game modal and the smiley button depends if
//win or lose stop timer
function finishGame(val) {
	endTimer()
	var elCenter = document.querySelector('.center')
	elCenter.style.display = 'none'
	var elModal = document.querySelector('.modal')
	elModal.style.display = 'block'
	gGame.isOn = false

	if (val) {
		gElBtn.innerText = '🤩'
		elModal.innerText = 'YOU WIN !!! PRESS ON IMOJI TO RESTART'
	} else {
		gElBtn.innerText = '🤯'
		elModal.innerText = 'YOU LOSE !!! PRESS ON IMOJI TO RESTART'
	}
}

//close the finish modal active in the init()
function closeModal() {
	var elCenter = document.querySelector('.center')
	elCenter.style.display = 'block'
	var elModal = document.querySelector('.modal')
	elModal.style.display = 'none'
}

//the expend function the shows all 1st of the
function showNeghbors(clickedCell) {
	var currCell = clickedCell.location
	for (var i = currCell.i - 1; i <= currCell.i + 1; i++) {
		if (i < 0 || i >= gBoard.length) continue
		for (var j = currCell.j - 1; j <= currCell.j + 1; j++) {
			if (i === currCell.i && j === currCell.j) continue
			if (j < 0 || j >= gBoard[0].length) continue
			if (gBoard[i][j].isMarked) continue

			gBoard[i][j].isShown = true
			// console.log(gBoard[i][j])
			var value =
				gBoard[i][j].minesAroundCount > 0 ? gBoard[i][j].minesAroundCount : ''
			renderShownCell(gBoard[i][j].location, value)
		}
	}
}
//count how much non-mines cells are shown
function countShown() {
	gGame.shownCount = 0
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			if (gBoard[i][j].isShown && !gBoard[i][j].isMine) gGame.shownCount++
		}
	}
	var elscore = document.querySelector('.score')
	elscore.innerText = gGame.shownCount
}
//count how muck non-shown mines cells
function countMarked() {
	gGame.markedCount = 0
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[0].length; j++) {
			if (gBoard[i][j].isMine && gBoard[i][j].isMarked) gGame.markedCount++
			if (gBoard[i][j].isMine && gBoard[i][j].isShown) gGame.markedCount++
		}
	}
	console.log('Marked count', gGame.markedCount)
}
//count and render the life state
function countLife() {
	gGame.numOfLife--
	var elLife = document.querySelector('.life')
	if (gGame.numOfLife === 2) elLife.innerText = '💖 💖'
	if (gGame.numOfLife === 1) elLife.innerText = '💖'
	if (gGame.numOfLife === 0) elLife.innerText = '💀💀💀'
}
//restar the game and restart global valeus
function resatrtGame() {
	gMines = []
	gBoard = []
	gStartTime = 0

	gGame = {
		isOn: false,
		shownCount: 0,
		markedCount: 0,
		numOfLife: 3,
	}
	var elLife = document.querySelector('.life')
	elLife.innerText = '💖 💖 💖'
	var elSeconds = document.querySelector('.sec')
	var elMinutes = document.querySelector('.min')
	elSeconds.innerHTML = '00'
	elMinutes.innerHTML = '00'
}

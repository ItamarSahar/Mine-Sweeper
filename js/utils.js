'use strict'
var gMat = []
var gDiscoIntervalID = 0
var gIsDiscoOn = false

function init() {
	gMat = createMat(10, 10)
	console.table(gMat)
	renderBoard(gMat, '.table')
}

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min)
}

function sumCols(mat, colIdx) {
	var sum = 0
	for (var i = 0; i < mat.length; i++) {
		var currRow = mat[i]
		sum += currRow
	}
	return sum
}

function sumRows(mat, rowIdx) {
	var currRow = mat[rowIdx]
	var sum = 0
	for (var i = 0; i < currRow.length; i++) {
		var currCell = currRow[i]
		sum += currCell
	}
	return sum
}

function sumMainDiagnal(mat) {
	var sum = 0
	for (var i = 0; i < mat.length; i++) {
		sum += mat[i][i]
	}
	return sum
}

function sumSconderyDiagnal(mat) {
	var sum = 0
	for (var i = 0; i < mat.length; i++) {
		sum += mat[i][mat.length - i - 1]
	}
	return sum
}
function createMat(ROWS, COLS) {
	var mat = []
	for (var i = 0; i < ROWS; i++) {
		var row = []
		for (var j = 0; j < COLS; j++) {
			row.push({ i, j })
		}
		mat.push(row)
	}
	return mat
}

function getRandomColor() {
	var letters = '0123456789ABCDEF'
	var color = '#'
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

function renderBoard(mat, selector) {
	var strHTML = '<table border="0"><tbody>'
	for (var i = 0; i < mat.length; i++) {
		strHTML += '<tr>'
		for (var j = 0; j < mat[0].length; j++) {
			var cell = mat[i][j]
			var className = 'cell-' + i + '-' + j
			strHTML += `<td class='${className}'  ${cell} > </td>`
		}
		strHTML += '</tr>'
	}
	strHTML += '</tbody></table>'
	var elContainer = document.querySelector(selector)
	elContainer.innerHTML = strHTML
}

function getRandomIntInclusive(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function getGhostHTML(ghost) {
	var color = gPacman.isSuper ? gSuperColor : ghost.color

	return `<span style="color:${color}">${GHOST}</span>`
}

function getNextLocation(eventKey) {
	// DONE: figure out nextLocation
	var nextLocation = {
		i: gPacman.location.i,
		j: gPacman.location.j,
	}

	switch (eventKey) {
		case 'ArrowUp':
			nextLocation.i--
			break
		case 'ArrowRight':
			nextLocation.j++
			break
		case 'ArrowDown':
			nextLocation.i++
			break
		case 'ArrowLeft':
			nextLocation.j--
			break

		default:
			return null
	}

	return nextLocation
}

function toggleGame(elBtn) {
	if (gGameInterval) {
		clearInterval(gGameInterval)
		gGameInterval = null
		elBtn.innerText = 'Play'
	} else {
		gGameInterval = setInterval(play, GAME_FREQ)
		elBtn.innerText = 'Pause'
	}
}
// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
	var parts = strCellId.split('-')
	var coord = { i: +parts[1], j: +parts[2] }
	return coord
}
//creat the selector
function getSelector(coord) {
	return '#cell-' + coord.i + '-' + coord.j
}

//returns an shuffled array
function shuffle(items) {
	var randIdx, keep
	for (var i = items.length - 1; i > 0; i--) {
		randIdx = getRandomInt(0, items.length)
		keep = items[i]
		items[i] = items[randIdx]
		items[randIdx] = keep
	}
	return items
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
	// Select the elCell and set the value
	var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
	elCell.innerHTML = value
}

function getEmptyCells(mat, empty) {
	var emptyCells = []
	for (var i = 0; i < mat.length; i++) {
		for (var j = 0; j < mat.length; j++) {
			if (mat[i][j] === empty) emptyCells.push({ i, j })
		}
	}

	return emptyCells
}

function getRandomFromArray(arr) {
	return arr[getRandomInt(0, arr.length - 1)]
}

function runOnMat(mat) {
	for (var i = 0; i < mat.length; i++) {
		for (var j = 0; j < mat[0].length; j++) {
			var color = getRandomColor()
			renderCellColor({ i, j }, color)
		}
	}
}

function changeColor(mat) {
	getCellCoord(strCellId)
}

// location such as: {i: 2, j: 7}
function renderCellColor(location, value) {
	// Select the elCell and set the value
	var elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
	elCell.style.backgroundColor = value
}

function shuffleColor(elBtn) {
	if (!gIsDiscoOn) {
		gDiscoIntervalID = setInterval(runOnMat, 500, gMat)
		gIsDiscoOn = true
		elBtn.innerText = `PREES TO STOP DISCO`
		return
	}
	clearInterval(gDiscoIntervalID)
	elBtn.innerText = `PREES TO DISCO`
	gIsDiscoOn = false
	renderBoard(gMat, '.table')
	console.log(gDiscoIntervalID)
}

function countNeighbors(cellI, cellJ, mat) {
	var neighborsCount = 0
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= mat.length) continue
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (i === cellI && j === cellJ) continue
			if (j < 0 || j >= mat[i].length) continue

			if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) neighborsCount++
		}
	}
	return neighborsCount
}

function onSetLevel(level) {
	gLevel = level
	generateNums(gLevel) //the borad bulid gets the size an then the render works
	renderTable()
}

function cellClicked(elCell) {
	// console.log('clickedNum.innerText',clickedNum.innerText);
	// console.log('gCurrNum',gCurrNum);
	// // console.log(typeof(clickedNum.innerText));
	var clickedNum = +elCell.innerText

	if (clickedNum !== gCurrNum) return

	if (clickedNum === 1) {
		startTimer()
	} else if (clickedNum === gNums.length) {
		endTimer()
		renderVictory()
		return
	}

	gCurrNum++
	elCell.classList.add('clicked')

	// switch (clickedNum) {
	//   case 1:
	//     startTimer();
	//     gCurrNum++;
	//     elCell.classList.add('clicked');
	//     break;
	//   case gNums.length:

	//     endTimer();
	//     renderVictory();
	//     //temp:
	//     // init();
	//     break;
	//   default:
	//     gCurrNum++;
	//     elCell.classList.add('clicked');
	// }
	// }
}



// function setMinesNegsCount(mat) {
// 	var neighborsCount = 0
//     for ( var i=0;i<mat.length;i++) {
//         var currRow =mat[i]
//         for(var j=0;j<mat[0];j++) {
//             var currCell =currRow[j]
//             if (currCell[i-1][j-1].isMine) neighborsCount++
//             if (currCell[i-1][j].isMine) neighborsCount++
//             if (currCell[i-1][j+1].isMine) neighborsCount++
//             if (currCell[i][j-1].isMine) neighborsCount++
//             if (currCell[i][j+1].isMine) neighborsCount++
//             if (currCell[i+1][j-1].isMine) neighborsCount++
//             if (currCell[i+1][j].isMine) neighborsCount++
//             if (currCell[i+1][j+1].isMine) neighborsCount++
//         }
//     }
// 	return neighborsCount
// }
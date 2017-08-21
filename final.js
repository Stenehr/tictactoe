var utils = {
    // Checks if the move is free and returns the index of the move
    getPlayerMove: function (board, move) {
        if (this.isSpaceFree(board, move)) {
            return move;
        }
    }, 
    /**
     * Makes a move on the game board
     * @param {Array} board
     * @param {String} letter
     * @param {Number} move
     */
    makeMove: function (board, letter, move) {
        board[move] = letter;
    },
    /**
     * Checks if the letter is a winner
     * @param {Array} bo
     * @param {String} le
     */
    isWinner: function(bo, le) {
        // Given a board && a player’s letter, this function returns True if that player has won.
        // We use bo instead of board && le instead of letter so we don’t have to type as much.
       if ((bo[6] == le && bo[7] == le && bo[8] == le) ||
                (bo[3] == le && bo[4] == le && bo[5] == le) || 
                (bo[0] == le && bo[1] == le && bo[2] == le) ||
                (bo[6] == le && bo[3] == le && bo[0] == le) ||
                (bo[7] == le && bo[4] == le && bo[1] == le) ||
                (bo[8] == le && bo[5] == le && bo[2] == le) ||
                (bo[6] == le && bo[4] == le && bo[2] == le) ||
                (bo[8] == le && bo[4] == le && bo[0] == le)) {
            return true;
        } else {
            return false;
        }
    },
    // Makes a copy of the gameboard
    makeBoardCopy: function (board) {
        var dupeBoard = [];

        for (var i = 0; i < board.length; i++) {
            dupeBoard[i] = board[i];
        }
        return dupeBoard;
    },
    // Checks if the place on the gameboard is free
    isSpaceFree: function(board, move) {
        return board[move] == '';
    },
    /**
     * Chooses a random free index from the moveList
     * @param {Array} board {game board}
     * @param {Array} moveList {a list of move indexes to consider e.g. [1, 4, 7]} 
     * @returns 
     */
    chooseRandomNumberFromList: function (board, moveList) {
        var possibleMoves = moveList.filter(function (elem) {
            return this.isSpaceFree(board, elem);
        }.bind(this));
        
        if (possibleMoves.length > 0) {
            randomIndex = Math.floor(Math.random() * (possibleMoves.length - 1));
            return possibleMoves[randomIndex];
        } else {
            return 'None';
        }
    },
    /**
     * 1. Checks if it can win
     * 2. Checks if the player can win
     * 3. Checks if corners are open - chooses a random corner
     * 4. Checks if middle is open
     * 5. If all above fail - chooses a random side
     * @param {[]} board
     * @param {String} computerLetter
     * @param {String} playerLetter
     * @return {Integer}
     */
    getComputerMove: function (board, computerLetter, playerLetter) {
        var copy;
        var move;
    
        // Check if the computer can win with the next move
        for (var i = 0; i < 10; i++) {
            copy = this.makeBoardCopy(board);
            if (this.isSpaceFree(copy, i)) {
                this.makeMove(copy, computerLetter, i)
                if (this.isWinner(copy, computerLetter)) {
                    return i;
                }
            }
        }
        // Check if the player can win with next move
        for (var j = 0; j < 10; j++) {
            copy = this.makeBoardCopy(board);
            if (this.isSpaceFree(copy, j)) {
                this.makeMove(copy, playerLetter, j);
                if (this.isWinner(copy, playerLetter)) {
                    return j;
                }
            }
        }
    
        // Try to take a corner if their free
        move = this.chooseRandomNumberFromList(board, [0, 2, 6, 8]);
        if (move !== 'None') {
            return move;
        }
    
        // Try to take the middle
        if (this.isSpaceFree(board, 5)) {
            return 5;
        }
    
        // Just take one of the sides
        return this.chooseRandomNumberFromList(board, [1, 3, 5, 7]);
    },
    // Check if the board is full
    isBoardFull: function (board) {
        for (var i = 0; i < 10; i++) {
            if (this.isSpaceFree(board, i)) {
                return false;
            }
        }
        return true;
    }
}

var Game = {
    gameBoard: ['', '', '', '', '', '', '', '', '',],
    playerSymbol: 'X',
    computerSymbol: 'Y',
    gamePlaying: false,
    gameStatus: '',
    init: function () {
        this.bindEvents();
        this.gamePlay();
    },
    bindEvents: function () {
        var xBtn = document.querySelector('#X');
        var oBtn = document.querySelector('#O');
        var playAgainBtn = document.querySelector('#playAgain');
        var playAgainNoBtn = document.querySelector('#playAgainNo');

        xBtn.addEventListener('click', function () {
            this.afterLetterChoosing('X');
        }.bind(this))

        oBtn.addEventListener('click', function () {
            this.afterLetterChoosing('O');
        }.bind(this));

        playAgainBtn.addEventListener('click', this.playAgain.bind(this));

        playAgainNoBtn.addEventListener('click', function () {
            window.location.reload();
        });
    },
    playAgain: function () {
        this.gameBoard = ['', '', '', '', '', '', '', '', '',];
        this.afterLetterChoosing(this.playerSymbol);
        this.gamePlay();
    },
    /**
     * Actions to be done after the player has chosen a letter
     * @param {String} playerChosenLetter
     */
    afterLetterChoosing: function (playerChosenLetter) {
        var XorOdisplay = document.querySelector('#XorO');
        var welcomeContainer = document.querySelector('#welcomeContainer');
        var welcomeMessageTitle = document.querySelector('#title');

        this.playerSymbol = playerChosenLetter;
        if (playerChosenLetter === 'X') {
            this.computerSymbol = 'O';
        } else {
            this.computerSymbol = 'X';
        }
        XorOdisplay.style.display = 'none';
        welcomeMessageTitle.textContent = "Computer will go first";
        setTimeout(function () {
            welcomeMessageTitle.textContent = "";
            welcomeContainer.style.display = 'none';
        }, 500);
        this.computerTurn(100);
    },
    renderView: function () {
        var spaces = document.querySelectorAll('.square');

        for (var i = 0; i < spaces.length; i++) {
            spaces[i].textContent = this.gameBoard[i];
        }
    },
    // Loop throught the buttons and add a click event
    // that will trigger the gameplay 
    gamePlay: function () {
        var playFieldsButton = document.querySelectorAll('.square');
        for (var i = 0; i < playFieldsButton.length; i++ ) {
            playFieldsButton[i].addEventListener('click', function (event) {

                // If the spot is already occupied return;
                var moveIndex = Number(event.target.getAttribute('value'));
                if (!utils.isSpaceFree(this.gameBoard, moveIndex)) {
                    return;
                }

                // Player plays first
                this.playerTurn(moveIndex);
                // after .5secs computer makes its decision
                this.computerTurn(500);     

            }.bind(this));
        }
    },
    playerTurn: function (userMoveIndex) {
        this.renderView();
        
        move = utils.getPlayerMove(this.gameBoard, userMoveIndex);
        utils.makeMove(this.gameBoard, this.playerSymbol, userMoveIndex);
        this.renderView();

        if (utils.isWinner(this.gameBoard, this.playerSymbol)) {
            setTimeout(function () {
                this.onGameOver("Congratulations you won!");
            }.bind(this), 500);
        } else {
            if (utils.isBoardFull(this.gameBoard)) {
                setTimeout(function () {
                    this.onGameOver("Its a tie!");
                }.bind(this), 500);
            }
        }
        
    },
    computerTurn: function (waitAmount) {
        setTimeout( function () {
            move = utils.getComputerMove(this.gameBoard, this.computerSymbol, this.playerSymbol);
            utils.makeMove(this.gameBoard, this.computerSymbol, move);
            this.renderView();
    
            if (utils.isWinner(this.gameBoard, this.computerSymbol)) {
                setTimeout(function () {
                    this.onGameOver("Sorry, the computer won");
                }.bind(this), 500);
                
            } else {
                if (utils.isBoardFull(this.gameBoard)) {
                    setTimeout(function () {
                        this.onGameOver("Its a tie!");
                    }.bind(this), 500);
                }
            }
        }.bind(this), waitAmount )
    },
    onGameOver: function (status) {
        var welcomeContainer = document.querySelector('#welcomeContainer');
        var welcomeMessageTitle = document.querySelector('#title');
        var playAgainBtn = document.querySelector('#playAgain');
        var playAgainNoBtn = document.querySelector('#playAgainNo');
        var playAgainMsg = document.querySelector('#playAgainMsg');

        welcomeContainer.style.backgroundColor = 'rgba(70, 33, 26, .9)'
        welcomeContainer.style.display = 'block';
        welcomeMessageTitle.textContent = status;
        

        playAgainMsg.textContent = "Play Again?";
        playAgainBtn.style.display = "initial";
        playAgainNoBtn.style.display = "initial";

    }
}
Game.init();

// Game.gamePlay();

// gamePlay: function (userChoice) {
//     var move;
//     this.gamePlaying = true;

//     while(this.gamePlaying) {
//         var exitPlayerMove = false;
//         move = undefined;

//         if (this.turn === 'player') {
//             this.renderView();
//             while(move === undefined) {
//                 move = this.getUserMove();
//             }

//             move = utils.getPlayerMove(this.gameBoard, move);
            
//             utils.makeMove(this.gameBoard, this.playerSymbol, move);
//             this.renderView();

//             if (utils.isWinner(this.gameBoard, this.playerSymbol)) {
//                 alert("Hurray you won!");
//                 this.gamePlaying = false;
//             } else {
//                 if (utils.isBoardFull(this.gameBoard)) {
//                     alert("Its a tie!");
//                     break;
//                 } else {
//                     this.turn = 'computer';
//                 }
//             }
//         } else {
//             move = utils.getComputerMove(this.gameBoard, this.computerSymbol, this.playerSymbol);
//             utils.makeMove(this.gameBoard, this.computerSymbol, move);
//             this.renderView();

//             if (utils.isWinner(this.gameBoard, this.computerSymbol)) {
//                 alert("The computer won! You lost.")
//                 this.gamePlaying = false;
//             } else {
//                 if (utils.isBoardFull(this.gameBoard)) {
//                     alert("The game is a tie!");
//                     break;
//                 } else {
//                     this.turn = 'player';
//                 }
//             }
//         }
//     }
// }

// // Checks if the move is free and returns the index of the move
// function getPlayerMove(board, move) {

//     if (isSpaceFree(board, move)) {
//         return move;
//     }
// }

// // Adds a move to the gameboard
// function makeMove(board, letter, move) {
//     board[move] = letter;
// }


// function isWinner(bo, le) {
//     // Given a board && a player’s letter, this function returns True if that player has won.
//     // We use bo instead of board && le instead of letter so we don’t have to type as much.
//     return ((bo[7] == le && bo[8] == le && bo[9] == le) ||
//             (bo[4] == le && bo[5] == le && bo[6] == le) || 
//             (bo[1] == le && bo[2] == le && bo[3] == le) ||
//             (bo[7] == le && bo[4] == le && bo[1] == le) ||
//             (bo[8] == le && bo[5] == le && bo[2] == le) ||
//             (bo[9] == le && bo[6] == le && bo[3] == le) ||
//             (bo[7] == le && bo[5] == le && bo[3] == le) ||
//             (bo[9] == le && bo[5] == le && bo[1] == le));
// }

// // Makes a copy of the gameboard
// function makeBoardCopy(board) {
//     var dupeBoard = [];

//     for (var i = 0; i < board.length; i++) {
//         dupeBoard[i] = board[i];
//     }
//     return dupeBoard;
// }

// // Checks if the place on the gameboard is free
// function isSpaceFree(board, move) {
//     return board[move] == '';
// }

// /**
//  * Chooses a random free index from the moveList
//  * @param {Array} board {game board}
//  * @param {Array} moveList {a list of move indexes to consider e.g. [1, 4, 7]} 
//  * @returns 
//  */
// function chooseRandomNumberFromList(board, moveList) {
//     var possibleMoves = moveList.filter(function (elem) {
//         return isSpaceFree(board, elem);
//     });
    
//     if (possibleMoves.length > 0) {
//         randomIndex = Math.floor(Math.random() * (possibleMoves.length - 1));
//         return possibleMoves[randomIndex];
//     } else {
//         return 'None';
//     }
// }

// function getComputerMove(board, computerLetter) {
//     var playerLetter;
//     var copy;
//     var move;

//     if (computerLetter === 'X') {
//         playerLetter = 'O';
//     } else {
//         playerLetter = 'X';
//     }

//     // Check if the computer can win with the next move
//     for (var i = 0; i < 10; i++) {
//         copy = makeBoardCopy(board);
//         if (isSpaceFree(copy, i)) {
//             makeMove(copy, computerLetter, i)
//             if (isWinner(copy, computerLetter)) {
//                 return i;
//             }
//         }
//     }
//     // Check if the player can win with next move
//     for (var j = 0; j < 10; j++) {
//         copy = makeBoardCopy(board);
//         if (isSpaceFree(copy, i)) {
//             makeMove(copy, playerLetter);
//             if (isWinner(copy, playerLetter)) {
//                 return i;
//             }
//         }
//     }

//     // Try to take a corner if their free
//     move = chooseRandomNumberFromList(board, [0, 2, 6, 8]);
//     if (move === 'None') {
//         return move;
//     }

//     // Try to take the middle
//     if (isSpaceFree(board, 5)) {
//         return 5;
//     }

//     // Just take one of the sides
//     return chooseRandomNumberFromList(board, [1, 3, 5, 7]);
// }

// // Check if the board is full
// function isBoardFull(board) {
//     for (var i = 0; i < 10; i++) {
//         if (isSpaceFree(board, i)) {
//             return false;
//         }
//     }
//     return true;
// }

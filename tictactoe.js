(function() {

    var winners = new Array(),
        player0Selections = new Array(),
        player1Selections = new Array(),
        currentPlayer = 1,
        size = 3,
        moves = 0,
        wins0 = 0,
        wins1 = 0,
        gameMessages = new Object(),
        selectedClass = 'selected',
        messageDisplay = document.getElementById('message'),
        scores = document.getElementById('scores'),
        modal = document.getElementById('myModal'),
        gameOver = false;

    function loadAnswers() {
        //Horizontal: [1, 2, 3] [4, 5, 6] [7, 8, 9]
        //Vertical: [1, 4, 7] [2, 5, 8] [3, 6, 9]
        //Diagonal: [1, 5, 9] [3, 5, 7]
        winners.push([1, 2, 3]);
        winners.push([4, 5, 6]);
        winners.push([7, 8, 9]);
        winners.push([1, 4, 7]);
        winners.push([2, 5, 8]);
        winners.push([3, 6, 9]);
        winners.push([1, 5, 9]);
        winners.push([3, 5, 7]);
    }

    function loadMessages() {
        gameMessages.win = 'You win player ';
        gameMessages.next = 'Your turn player ';
        gameMessages.error = 'Sorry, you cannot select that square player ';
        gameMessages.nowinner = 'Game is void ';
    }

    function setupModal() {

        // Modal Reset Button
        var modalReset = document.getElementsByClassName("modal-reset")[0];

        modalReset.addEventListener('click', function() {
            resetGame(true);
        })

        // Modal Restart
        var modalRestart = document.getElementsByClassName("modal-restart")[0];

        modalRestart.addEventListener('click', function() {
            resetGame();
        })

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.addEventListener('click', function() {
            modal.style.display = "none";
            resetGame();
        })

        // When the user clicks anywhere outside of the modal, close it
        window.addEventListener('click', function(evt) {
            if (evt.target == modal) {
                modal.style.display = "none";
                resetGame();
            }
        })
    }

    function setupBoard() {

        var resetButton = document.getElementById('reset-button');

        resetButton.addEventListener('click', function() {
            resetGame();
        })

        setupModal();

        // click handler
        var handler = function(e) {

            var player = (currentPlayer === 1) ? 1 : 0

            if (!e.target.classList.contains(selectedClass) && !gameOver) {

                // set player tag
                var playerTag = (player === 1) ? 'X' : 'O';

                //just in case we wanna do something funky when we mark the board
                toggleSelection.call(this, playerTag);

                //set selection to players array
                if (player == 0) {
                    player0Selections.push(parseInt(this.id));
                    player0Selections.sort(function(a, b) {
                        return a - b
                    });
                } else {
                    player1Selections.push(parseInt(this.id));
                    player1Selections.sort(function(a, b) {
                        return a - b
                    });
                }
                console.log('player0Selections',player0Selections)
                console.log('player1Selections',player1Selections)

                moves++;

                // handle a winning game, void game, or continuation
                if (checkForWin(player)) {
                    //resetGame();
                    gameOver = true;
                    setMessage.call(messageDisplay, gameMessages.win + ((currentPlayer === 1) ? 'X' : 'O'));
                    modal.style.display = "block";
                    // tally wins
                    if (player === 0) {
                        wins0++;
                    } else {
                        wins1++;
                    }
                } else {
                    switchPlayer(Math.abs(player - 1));
                    if (moves >= 9) {
                        //resetGame();
                        setMessage.call(messageDisplay, gameMessages.nowinner)
                        gameOver = true;
                        modal.style.display = "block";
                    } else {
                        setMessage.call(messageDisplay, gameMessages.next + ((currentPlayer === 1) ? 'X' : 'O'));
                    }
                }

                setMessage.call(scores, 'X score: '+ wins0  + '/ O score: ' + wins1);


            } else {

                if (!gameOver) {
                    setMessage.call(messageDisplay, gameMessages.error + ((currentPlayer === 1) ? 'X' : 'O'));
                    //modal.style.display = "block";
                }

            }

        };

        var td;
        // setup the board
        for (var t = 1; t < 10; t++) {

            td = document.getElementById(t); // selection

            // reset board
            toggleSelection.call(td)

            // check if addEventListener is available
            if (typeof window.addEventListener === 'function') {
                // bind listener to click handler
                (function(_td) {
                    td.removeEventListener('click', handler);
                    td.addEventListener('click', handler);
                })(td);
            }

        }

    }

    function checkForWin(player) {

        // check if current player has a winning hand
        var win = false,
            playerSelections = new Array();

        //set selection to players array
        if (player == 0) {
            playerSelections = player0Selections;
        } else {
            playerSelections = player1Selections;
        }

        // make sure player made 3 selections
        if (playerSelections.length >= size) {

            // check if any 'winners' are also in your selections
            for (var i = 0; i < winners.length; i++) {
                var sets = winners[i], // winning hand
                    setFound = true;

                for (var r = 0; r < sets.length; r++) {
                    // check if number is in current players selections
                    var found = false;

                    // players selections
                    for (var s = 0; s < playerSelections.length; s++) {
                        if (sets[r] == playerSelections[s]) {
                            found = true;
                            break;
                        }
                    }

                    // value not found in players selections
                    if (found === false) {
                        setFound = false;
                        break;
                    }
                }

                if (setFound === true) {
                    win = true;
                    break;
                }
            }
        }

        return win;
    }

    function toggleSelection(mark) {

        if (mark) {
            this.innerHTML = mark;
            this.classList.add(selectedClass);
        } else {
            this.classList.remove(selectedClass);
            this.innerHTML = " ";
        }

    }

    function switchPlayer(player) {
        currentPlayer = (player) ? player : !currentPlayer;
    }

    function setMessage(msg) {
        this.innerHTML = msg ? msg : " ";
    }

    function clearBoard() {

        for (var h = 1; h < 10; h++) {
            toggleSelection.call(document.getElementById(h));
        }
    }

    function resetGame(restart) {
        currentPlayer = 1;
        moves = 0;
        gameOver = false;
        player0Selections = new Array();
        player1Selections = new Array();
        clearBoard();
        setMessage.call(messageDisplay, gameMessages.next + 'X');
        if (restart) {
            clearWins();
        }
    }

    function clearWins() {
        wins0 = 0;
        wins1 = 0;
    }

    loadAnswers();
    loadMessages();
    setupBoard();






})();
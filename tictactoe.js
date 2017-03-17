(function(){

	var winners = new Array(),
		player0Selections = new Array(),
		player1Selections = new Array(),
		currentPlayer = 1,
		size = 3;

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

	function setupBoard() {

		var handler = function(e) {

			var player = ( currentPlayer === 1 ) ? 1 : 0

			if ( !e.target.classList.contains('selected' ) ) {

				var playerTag = (player === 1) ? 'X': 'O';

	            //this.innerHTML = playerTag;
	            //this.classList.add('selected');

	            //just in case we wanna do something funky when we mark the board
	            markBoard.call( this, playerTag )

            	if (player == 0) {
			        player0Selections.push(parseInt(this.id));
            		player0Selections.sort(function(a, b) { return a - b });
			    }
			    else {
			    	player1Selections.push(parseInt(this.id));
            		player1Selections.sort(function(a, b) { return a - b });
			    }

            	if(checkForWin(player)){
            		resetGame();
            	} else {
            		switchPlayer(Math.abs( player-1 ) );
            	};

			}
            
        }

        var td;
		for ( var t = 1; t < 10; t++ ){
		    td = document.getElementById(t);
		    td.classList.remove('selected');
		    td.innerHTML = " ";

		    if (typeof window.addEventListener === 'function'){
		        ( function ( _td ) {
		            td.removeEventListener('click' , handler);
		            td.addEventListener( 'click', handler, { passive: false });
		        } )( td );
		    }

		}

	}

	function checkForWin(player) {

	    // check if current player has a winning hand
	    var win = false,
	    	playerSelections = new Array();

	    if (player == 0) {
	        playerSelections = player0Selections;
	    }
	    else {
	    	playerSelections = player1Selections;
	    }
	    
	    if (playerSelections.length >= size) {

	        // check if any 'winners' are also in your selections
	        for ( var i = 0; i < winners.length; i++ ) {
	            var sets = winners[i],  // winning hand
	            	setFound = true;
	            
	            for ( var r = 0; r < sets.length; r++) {
	                // check if number is in current players selection
	                var found = false;
	                
	                // players hand
	                for ( var s = 0; s < playerSelections.length; s++) {
	                    if (sets[r] == playerSelections[s]) {
	                        found = true;
	                        break;
	                    }
	                }

	                // value not found in players hand
	                // not a valid set, move on
	                if (found == false) {
	                    setFound = false;
	                    break;
	                }
	            }

	            if (setFound == true) {
	                win = true;
	                break;
	            }
	        }
	    }

	    return win;
	}

	function markBoard( mark ) {
		this.innerHTML = mark;
	    this.classList.add('selected');
	}

	function switchPlayer(player) {
		currentPlayer = (player) ? player : !currentPlayer;
	}

	function setMessage( msg ) {
		
	}

	function resetGame() {
		currentPlayer = 1;
    	player0Selections = new Array();
    	player1Selections = new Array();
    	setupBoard();
	}

	loadAnswers();
	setupBoard();

})();
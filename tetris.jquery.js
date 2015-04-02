
var Tetris = function(){
	this.board = {};
	this.boardColumnsWide = 10;
	this.boardRowsHigh = 18;
	this.pieceStartColumn = 4;
	this.cellWidthPx = 20;
	this.cellHeightPx = 20;


	this.currentPiece = {
		'type':'',
		'blockIds':[],
		'blockPositions':[],
		'class':'',
		'row':1,
		'col':this.pieceStartColumn,
		'position':1
	};

	this.previewPiece = {
		'type':'',
		'class':'',
		'blocks':[]
	};
		
	this.gameIntervalTimer = {
		'obj': false,
		'ms': 400
	};

	this.currentGame = {
		'score':0,
		'scoreMultiplier':100,
		'rowsEliminated':0,
		'level':1
	};

}

Tetris.prototype.setupBoard = function(){
	var jTetrisBoard = $('#tetris-board');

	// Clear the board
	jTetrisBoard.html("");
	this.board = {};

	// Set the board size
	jTetrisBoard.width(this.boardColumnsWide*this.cellWidthPx);
	jTetrisBoard.height(this.boardRowsHigh*this.cellHeightPx);

	
	for(i=1; i<=this.boardRowsHigh; i++){
		this.board[i] = {};
		var top_pos = (i-1)*this.cellHeightPx;
		for(j=1; j<=this.boardColumnsWide; j++){
			// Setup the object for storing block positions
			this.board[i][j] = {};

			// Add the block to the board
			var left_pos = (j-1)*this.cellWidthPx;
			var tmp_pos = " style='left:"+left_pos+"px; top:"+top_pos+"px;' ";
			var tmp_div = "<div class='tetris-board-block' id='tb_"+j+"_"+i+"' "+tmp_pos+"></div>"
			jTetrisBoard.append(tmp_div);
		}
	}
}

Tetris.prototype.setupPreviewBoard = function(){
	var jPreviewBoard = $('#tetris-next-piece-preview-container');
	var preview_sections_wide = 6;
	var preview_sections_high = 4;

	// Clear the board
	jPreviewBoard.html("");
	
	jPreviewBoard.width(preview_sections_wide*this.cellWidthPx);
	jPreviewBoard.height(preview_sections_high*this.cellHeightPx);

	for(i=1; i<=preview_sections_high; i++){
		var top_pos = (i-1)*this.cellHeightPx;
		for(j=1; j<=preview_sections_wide; j++){
			var left_pos = (j-1)*this.cellWidthPx;
			var tmp_pos = " style='left:"+left_pos+"px; top:"+top_pos+"px;' ";
			var tmp_div = "<div class='tetris-board-block' id='tp_"+j+"_"+i+"' "+tmp_pos+"></div>"
			jPreviewBoard.append(tmp_div);
		}
	}
}

Tetris.prototype.generateRandomBlockType = function(){
	return BLOCK_TYPES[Math.floor(Math.random()*BLOCK_TYPES.length)];
}

Tetris.prototype.makePreviewBlock = function(){
	
	//Remove the current block from the preview
	var parent = this;
	$.each(this.previewPiece.blocks, function(index, block_id){
		$(block_id).removeClass(parent.previewPiece.class);
	});
	this.previewPiece.blocks = [];

	//Get a random block
	this.previewPiece.type = this.generateRandomBlockType();
	
	var curr_block_position_rows = BLOCKS[this.previewPiece.type]['positions'][0]['rows'];
	this.previewPiece.class = BLOCKS[this.previewPiece.type]['class'];
	var start_col=2;
	var start_row=2;
	var parent = this;
	$.each(curr_block_position_rows, function(row_index, row){
		$.each(row, function(col_index, col_is_active){
			if(col_is_active==1){
				var block_col = start_col+parseInt(col_index);
				var block_row = start_row+parseInt(row_index);
				var id = '#tp_'+block_col+'_'+block_row;
				$(id).addClass(parent.previewPiece.class);

				parent.previewPiece.blocks.push(id);
			}
		});
	});
	
}

Tetris.prototype.movePiece = function(desired_direction){

	var curr_block_no_positions = BLOCKS[this.currentPiece.type]['no_positions'];
	var curr_block_pos_trans_row = 0;
	var curr_block_pos_trans_col = 0;
	var desired_position = this.currentPiece.position;
	if(desired_direction=='up'){
		desired_position = this.currentPiece.position + 1;
		if(desired_position>(curr_block_no_positions-1)){
			//Reset the transition back to 0
			desired_position = 0;
		} 

		// The amount to move the desired row and column 
		// during the transformation
		curr_block_pos_trans_row = BLOCKS[this.currentPiece.type]['positions'][desired_position]['trans_row'];
		curr_block_pos_trans_col = BLOCKS[this.currentPiece.type]['positions'][desired_position]['trans_col'];
	} 
	var curr_block_position_rows = BLOCKS[this.currentPiece.type]['positions'][desired_position]['rows'];

	var tmp_desired_positions = [];
	var lock_current_block = false;
	var tmp_lowest_col = this.boardColumnsWide;
	var tmp_lowest_row = this.boardRowsHigh;
	var error = false;
	var parent = this;
	$.each(curr_block_position_rows, function(row_index, row){
		//Loop over the rows
		
		$.each(row, function(col_index, col_is_active){
			
			if(col_is_active==1){
				var tmp_piece_col_pos = parent.currentPiece.col + parseInt(col_index);
				var tmp_piece_row_pos = parent.currentPiece.row + parseInt(row_index);
				
				var tmp_piece_desired_col = tmp_piece_col_pos+curr_block_pos_trans_col;
				var tmp_piece_desired_row = tmp_piece_row_pos+curr_block_pos_trans_row;

				if(desired_direction=='none'){
					if(parent.board[tmp_piece_desired_row][tmp_piece_desired_col].hasOwnProperty('class')){
						// New piece but a space is already taken 
						parent.gameOver();
					}
				}
				
				if(desired_direction=='left'){
					tmp_piece_desired_col = tmp_piece_col_pos-1;
				}

				if(desired_direction=='right'){
					tmp_piece_desired_col = tmp_piece_col_pos+1;
				}

				if(desired_direction=='down'){
					tmp_piece_desired_row = tmp_piece_row_pos+1;

					if(tmp_piece_desired_row > parent.boardRowsHigh ||
						parent.board[tmp_piece_desired_row][tmp_piece_desired_col].hasOwnProperty('class')){
						// Already a block in the next downward position
						lock_current_block = true;
					}
				}
				
				if(!parent.board.hasOwnProperty(tmp_piece_desired_row)){
					//Can't move down, so error
					error = true;
				} else if(!parent.board[tmp_piece_desired_row].hasOwnProperty(tmp_piece_desired_col)){
					//Off the board error out
					error = true;
				} else if(parent.board[tmp_piece_desired_row][tmp_piece_desired_col].hasOwnProperty('class')) {
					//Board spot already taken
					error = true;
				}
				
				//console.log('tmp_piece_desired_col= '+tmp_piece_desired_col+' tmp_piece_desired_row= '+tmp_piece_desired_row);
				
				if(!error){
					if(tmp_piece_desired_col<tmp_lowest_col){
						tmp_lowest_col = tmp_piece_desired_col;
					}
					if(tmp_piece_desired_row<tmp_lowest_row){
						tmp_lowest_row = tmp_piece_desired_row;
					}
					
					tmp_desired_positions.push({'col':tmp_piece_desired_col,'row':tmp_piece_desired_row});
				}

			}
		});
	});

	if(!error){

		if(!lock_current_block){
			// remove the current piece 
			this.removeCurrentPieceFromBoard();
			
			//Set the new current direction
			if(desired_direction=='up') {
				this.currentPiece.position = desired_position;
			}

			// Set the new current row and column
			this.currentPiece.col = tmp_lowest_col;
			this.currentPiece.row = tmp_lowest_row;
			var parent = this;
			// Apply the 'movement' by modifying the block's class
			$.each(tmp_desired_positions, function(pos_index, pos){

				var tmp_id = '#tb_'+pos['col']+'_'+pos['row'];
				var jTMP = $(tmp_id);
				jTMP.addClass(parent.currentPiece.class);
				parent.currentPiece.blockIds.push(tmp_id);
				parent.currentPiece.blockPositions.push(pos);
	
			});
		} 
	}

	if(lock_current_block){
		var parent = this;
		$.each(this.currentPiece.blockPositions, function(pos_index, pos){
			// Lock the current block on the board
			// by setting the more permanent board class
			parent.board[pos['row']][pos['col']] = {'class':parent.currentPiece.class};
		});
		
		this.checkAndEliminateRows();
		
		this.newPiece();
	}
}

Tetris.prototype.checkAndEliminateRows = function(){
	var no_rows_eliminated = 0;
	//Loop over the board rows
	var parent = this;
	$.each(this.board, function(r_index, row){
		//Loop over the columns
		var column_full_count = 0;
		$.each(row, function(c_index, col){
			if(col.hasOwnProperty('class')){
				column_full_count++;
			}
		});

		if(column_full_count == parent.boardColumnsWide){
			
			no_rows_eliminated++;
			
			//Row is full, so move every previous row down
			for(var i=r_index; i>=1; i--){

				$.each(parent.board[i], function(c_index, col){
					var prev_class = '';
					if(parent.board.hasOwnProperty(i-1) &&
						parent.board[i-1][c_index].hasOwnProperty('class')){
							// The class from this column in the previous row
							prev_class = parent.board[i-1][c_index]['class'];
					}
					var cur_id = "#tb_"+c_index+"_"+i;

					var jCur = $(cur_id);
					
					if(col.hasOwnProperty('class')){
						jCur.removeClass(col['class']);
					}

					if(prev_class!=''){
						//Copy down the previous row's class for this column
						jCur.addClass(prev_class);
						parent.board[i][c_index] = {'class':prev_class};
					} else {
						//Blank block
						parent.board[i][c_index] = {}
					}
				});
				
			}
		}
	});

	if(no_rows_eliminated>0){
		this.score(no_rows_eliminated);
	}
}

Tetris.prototype.score = function(no_rows_eliminated){
	
	var multiple_row_bonus = 0;
	var current_multiplier = this.currentGame.scoreMultiplier*this.currentGame.level;

	this.currentGame.rowsEliminated = this.currentGame.rowsEliminated+no_rows_eliminated;
	
	if(no_rows_eliminated>1){
		// Give users a bonus for eliminating more than one row
		multiple_row_bonus = no_rows_eliminated*(current_multiplier*.5);
	}
	this.currentGame.score = this.currentGame.score+(no_rows_eliminated*current_multiplier)+multiple_row_bonus;

	this.setScoreText();

	if(this.currentGame.rowsEliminated == this.boardRowsHigh){
		
		// Level up
		this.currentGame.rowsEliminated = 0;

		this.currentGame.level = this.currentGame.level+1;

		this.setLevelText();

		// Increase the speed of the game interval
		this.gameIntervalTimer.ms = this.gameIntervalTimer.ms - 20;
	}
}

Tetris.prototype.setScoreText = function(){
	$("#tetris-score-container").text(this.currentGame.score);
}

Tetris.prototype.setLevelText = function(){
	$("#tetris-level-container").text("LEVEL "+this.currentGame.level);
}

Tetris.prototype.removeCurrentPieceFromBoard = function(){

	//Remove the current class from the visible blocks
	var parent = this;
	$.each(this.currentPiece.blockIds, function(index,block_id){
		$(block_id).removeClass(parent.currentPiece.class);
	});
	
	//Reset the current set of blocks
	this.currentPiece.blockIds = [];
	this.currentPiece.blockPositions = [];
}

Tetris.prototype.newPiece = function(){
	// Reset all the variables
	this.currentPiece.blockIds = [];
	this.currentPiece.blockPositions = [];

	// The preview block becomes the current piece
	this.currentPiece.type = this.previewPiece.type;
	this.currentPiece.class = BLOCKS[this.currentPiece.type]['class'];

	// Reset the start location for the block to appear
	this.currentPiece.row = 1;
	this.currentPiece.col = this.pieceStartColumn;

	this.currentPiece.position = 0;

	this.movePiece('none');

	//Reset the game interval
	this.killGameInterval();
	this.startGameInterval();
	
	// Make the next preview block
	this.makePreviewBlock();
}

Tetris.prototype.setupKeyEvents = function(){
	var parent = this;
	$(document).keydown(function(e) {
		switch(e.which) {
			case 37: // left
			
			parent.movePiece('left');
			break;

			case 38: // up
			parent.movePiece('up');
			break;

			case 39: // right
			parent.movePiece('right');

			break;

			case 40: // down
			parent.movePiece('down');

			break;

			default: return; // exit this handler for other keys
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	});
}

Tetris.prototype.startPlay = function(){

	if(this.previewPiece.type==""){
		//NEW GAME!
		//Generate the first block type
		this.previewPiece.type = this.generateRandomBlockType();

		//Create the new piece
		this.newPiece();
	}

	this.startGameInterval();

	this.hideMessage();
}

Tetris.prototype.startGameInterval = function(){
	if(!this.gameIntervalTimer.obj){
		var parent = this;
		//Start the action (just move the current piece down)
		this.gameIntervalTimer.obj = setInterval(function(){
			parent.movePiece('down');
		}, this.gameIntervalTimer.ms);
	}
}

Tetris.prototype.killGameInterval = function(){
	clearInterval(this.gameIntervalTimer.obj);
	this.gameIntervalTimer.obj = false;
}

Tetris.prototype.pauseGame = function(){

	this.killGameInterval();
	this.showMessage('tmpl-paused');
}

Tetris.prototype.gameOver = function(){
	this.killGameInterval();
	this.showMessage('tmpl-gameover');
}


Tetris.prototype.newGame = function(){
	this.killGameInterval();
	
	this.currentGame.score = 0;
	this.currentGame.level = 1;
	this.gameIntervalTimer.ms = 460;

	this.setScoreText();
	this.setLevelText()
	
	this.setupBoard();
	this.setupPreviewBoard();

	this.startPlay();
}


Tetris.prototype.hideMessage = function(){
	var jCont = $('#tetris-message');
	jCont.fadeOut();
}
Tetris.prototype.showMessage = function(template_name){
	var jCont = $('#tetris-message');
	var html = Mustache.render($('#'+template_name).html());
	jCont.html(html);
	jCont.fadeIn();
}

var tetris = new Tetris();
$(function(){
	
	/*
	$(window).focusout(function(){
		console.log("focusout event fired");
		tetris.pauseGame();
	});
	*/
	
	tetris.setupKeyEvents();

	tetris.newGame();
});

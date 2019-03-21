/**
 * Tetrjs is a javascript implementation of Tetris.
 *
 * @author Destin Moulton
 * @license MIT
 * @version 1.0
 * @link https://github.com/destinmoulton/tetrjs
 */

import util from "./util";
import { BLOCKS, BLOCK_TYPES } from "./blocks";
import { SETTINGS } from "./settings";

/**
 * The constructor.
 * Initializes the basic configuration values.
 * @return void
 */
export default class Tetrjs {
    board = {};

    isPaused = false;

    DOM_IDS = {
        BOARD: "tetrjs-board",
        PREVIEW_CONTAINER: "tetrjs-next-piece-preview-container",
        SCORE_CONTAINER: "#tetrjs-score-container",
        LEVEL_CONTAINER: "#tetrjs-level-container",
        MODAL: "#tetrjs-modal",
        MODAL_VEIL: "#tetrjs-modal-veil"
    };

    DOM_CLASSES = {
        BOARD_BLOCK: "tetrjs-board-block"
    };

    currentBlock = {
        type: "",
        blockIds: [],
        blockPositions: [],
        class: "",
        row: SETTINGS.PIECE_START_ROW,
        col: SETTINGS.PIECE_START_COL,
        position: SETTINGS.PIECE_START_POS
    };

    previewPiece = {
        type: "",
        class: "",
        blocks: []
    };

    gameIntervalTimer = {
        obj: false,
        ms: SETTINGS.GAME_INTERVAL_MS
    };

    currentGame = {
        score: 0,
        rowsEliminated: 0,
        level: 1
    };

    /**
     * Setup the Tetrjs board.
     *  1. Clear the board
     *     i. Remove any existing HTML
     *     ii. Clear the multidimensional/matrix board object
     *  2. Set the board width and height (in px)
     *  3. Create the new, clean, board
     *     i. Instantiate the multidimensional/matrix board container
     *     ii. Create div boxes at absolute position to hold blocks
     *
     * @return void
     */
    setupBoard() {
        const $tetrjsBoard = document.getElementById(this.DOM_IDS.BOARD);

        // Clear the board
        $tetrjsBoard.innerHTML = "";
        this.board = {};

        // Set the board size
        const boardWidth = SETTINGS.BOARD_COLS_WIDE * SETTINGS.CELL_WIDTH_PX;
        const boardHeight = SETTINGS.BOARD_ROWS_HIGH * SETTINGS.CELL_HEIGHT_PX;
        $tetrjsBoard.style.width = `${boardWidth}px`;
        $tetrjsBoard.style.height = `${boardHeight}px`;

        for (let i = 1; i <= SETTINGS.BOARD_ROWS_HIGH; i++) {
            this.board[i] = {};
            const top_pos = (i - 1) * SETTINGS.CELL_HEIGHT_PX;
            for (let j = 1; j <= SETTINGS.BOARD_COLS_WIDE; j++) {
                // Setup the object for storing block positions
                this.board[i][j] = {};

                // Calculate left px position of the cell
                const left_pos = (j - 1) * SETTINGS.CELL_WIDTH_PX;

                // Add the block to the board
                const block = document.createElement("div");
                block.style.left = left_pos.toString() + "px";
                block.style.top = top_pos.toString() + "px";
                block.className = this.DOM_CLASSES.BOARD_BLOCK;
                block.setAttribute("id", `tb_${j}_${i}`);
                $tetrjsBoard.appendChild(block);
            }
        }
    }

    /**
     * Setup the small preview board to display the next piece.
     *
     * Almost identical to the setupBoard function, except we
     * do not need a multidimensional representation of the board.
     *
     * @return void
     */
    setupPreviewBoard() {
        var $previewBoard = document.getElementById(
            this.DOM_IDS.PREVIEW_CONTAINER
        );
        var preview_sections_wide = 6;
        var preview_sections_high = 4;

        // Clear the board
        const boardWidth = preview_sections_wide * SETTINGS.CELL_WIDTH_PX;
        const boardHeight = preview_sections_high * SETTINGS.CELL_HEIGHT_PX;
        $previewBoard.innerHTML = "";
        $previewBoard.style.width = `${boardWidth}px`;
        $previewBoard.style.height = `${boardHeight}px`;

        for (let i = 1; i <= preview_sections_high; i++) {
            var top_pos = (i - 1) * SETTINGS.CELL_HEIGHT_PX;
            for (let j = 1; j <= preview_sections_wide; j++) {
                var left_pos = (j - 1) * SETTINGS.CELL_WIDTH_PX;
                let block = document.createElement("div");
                block.style.top = top_pos + "px";
                block.style.left = left_pos + "px";
                block.className = this.DOM_CLASSES.BOARD_BLOCK;
                block.setAttribute("id", `tp_${j}_${i}`);
                $previewBoard.appendChild(block);
            }
        }
    }

    /**
     * Get a random block type.
     *
     * @return string Block type
     */
    generateRandomBlockType() {
        return BLOCK_TYPES[Math.floor(Math.random() * BLOCK_TYPES.length)];
    }

    /**
     * Make the preview block in the preview board.
     *
     * @return void
     */
    makePreviewPiece() {
        if (this.isPaused) {
            return;
        }

        //Remove the current block from the preview
        for (let block_id of this.previewPiece.blocks) {
            const block = document.getElementById(block_id);
            util.removeClass(block, this.previewPiece.class);
        }
        this.previewPiece.blocks = [];

        //Get a random block
        this.previewPiece.type = this.generateRandomBlockType();

        this.previewPiece.class = BLOCKS[this.previewPiece.type]["class"];
        const start_col = 2;
        const start_row = 2;
        const curr_block_position_rows =
            BLOCKS[this.previewPiece.type]["positions"][0]["rows"];

        // Rows are stored as an object-matrix
        const row_keys = Object.keys(curr_block_position_rows);
        for (let row_index of row_keys) {
            const row = curr_block_position_rows[row_index];
            const col_keys = Object.keys(row);
            for (let col_index of col_keys) {
                if (row[col_index] === 1) {
                    const block_col = start_col + parseInt(col_index);
                    const block_row = start_row + parseInt(row_index);
                    const id = "tp_" + block_col + "_" + block_row;
                    const el = document.getElementById(id);
                    util.addClass(el, this.previewPiece.class);

                    this.previewPiece.blocks.push(id);
                }
            }
        }
    }

    /**
     * Move a block on the board.
     * This is mostly called as the keyboard event handler.
     *
     * @return void
     */
    moveBlock(desired_direction) {
        var curr_block_no_positions =
            BLOCKS[this.currentBlock.type]["no_positions"];
        var curr_block_pos_trans_row = 0;
        var curr_block_pos_trans_col = 0;
        var desired_position = this.currentBlock.position;

        // 'up' rotates the block
        if (desired_direction == "up") {
            desired_position = this.currentBlock.position + 1;
            if (desired_position > curr_block_no_positions - 1) {
                //Reset the transition back to 0
                desired_position = 0;
            }

            // The amount to move the desired row and column
            // during the transformation
            curr_block_pos_trans_row =
                BLOCKS[this.currentBlock.type]["positions"][desired_position][
                    "trans_row"
                ];
            curr_block_pos_trans_col =
                BLOCKS[this.currentBlock.type]["positions"][desired_position][
                    "trans_col"
                ];
        }

        var tmp_desired_positions = [];
        var lock_current_block = false;
        var tmp_lowest_col = SETTINGS.BOARD_COLS_WIDE;
        var tmp_lowest_row = SETTINGS.BOARD_ROWS_HIGH;

        var error = false;
        var curr_block_position_rows =
            BLOCKS[this.currentBlock.type]["positions"][desired_position][
                "rows"
            ];
        const rowKeys = Object.keys(curr_block_position_rows);
        for(let row_index = 0; row_index < rowKeys.length; row_index++){
            const row = curr_block_position_rows[row_index];
            const colKeys = Object.keys(row);
            for(let col_index = 0; col_index<colKeys.length; col_index++ ){
                if (row[col_index] === 1) {
                    var tmp_piece_col_pos =
                        this.currentBlock.col + parseInt(col_index);
                    var tmp_piece_row_pos =
                        this.currentBlock.row + parseInt(row_index);

                    var tmp_piece_desired_col =
                        tmp_piece_col_pos + curr_block_pos_trans_col;
                    var tmp_piece_desired_row =
                        tmp_piece_row_pos + curr_block_pos_trans_row;

                    if (desired_direction == "none") {
                        if (
                            this.board[tmp_piece_desired_row][
                                tmp_piece_desired_col
                            ].hasOwnProperty("class")
                        ) {
                            // New piece but a space is already taken
                            this.gameOver();
                        }
                    }

                    if (desired_direction == "left") {
                        tmp_piece_desired_col = tmp_piece_col_pos - 1;
                    }

                    if (desired_direction == "right") {
                        tmp_piece_desired_col = tmp_piece_col_pos + 1;
                    }

                    if (desired_direction == "down") {
                        tmp_piece_desired_row = tmp_piece_row_pos + 1;
                        if (
                            tmp_piece_desired_row >
                                this.SETTINGS.BOARD_ROWS_HIGH ||
                            this.board[tmp_piece_desired_row][
                                tmp_piece_desired_col
                            ].hasOwnProperty("class")
                        ) {
                            // Already a block in the next downward position
                            lock_current_block = true;
                        }
                    }

                    if (!this.board.hasOwnProperty(tmp_piece_desired_row)) {
                        //Can't move down, so error
                        error = true;
                    } else if (
                        !this.board[tmp_piece_desired_row].hasOwnProperty(
                            tmp_piece_desired_col
                        )
                    ) {
                        //Off the board error out
                        error = true;
                    } else if (
                        this.board[tmp_piece_desired_row][
                            tmp_piece_desired_col
                        ].hasOwnProperty("class")
                    ) {
                        //Board spot already taken
                        error = true;
                    }

                    if (!error) {
                        if (tmp_piece_desired_col < tmp_lowest_col) {
                            tmp_lowest_col = tmp_piece_desired_col;
                        }
                        if (tmp_piece_desired_row < tmp_lowest_row) {
                            tmp_lowest_row = tmp_piece_desired_row;
                        }

                        tmp_desired_positions.push({
                            col: tmp_piece_desired_col,
                            row: tmp_piece_desired_row
                        });
                    }
                }
            }
        }

        if (!error) {
            if (!lock_current_block) {
                // remove the current piece
                this.removeCurrentBlockFromBoard();

                //Set the new current direction
                if (desired_direction == "up") {
                    this.currentBlock.position = desired_position;
                }

                // Set the new current row and column
                this.currentBlock.col = tmp_lowest_col;
                this.currentBlock.row = tmp_lowest_row;
                // Apply the 'movement' by modifying the block's class
                for(let pos of tmp_desired_positions){
                    var tmp_id = `tb_${pos["col"]}_${pos["row"]}`;
                    var jTMP = document.getElementById(tmp_id);
                    jTMP.addClass(this.currentBlock.class);
                    this.currentBlock.blockIds.push(tmp_id);
                    this.currentBlock.blockPositions.push(pos);
                }
            }
        }

        // The block has reached its final destination
        if (lock_current_block) {
            for(let pos of this.currentBlock.blockPositions){
                // Lock the current block on the board
                // by setting the permanent board class
                this.board[pos["row"]][pos["col"]] = {
                    class: this.currentBlock.class
                };
            }

            // Check if the block has caused rows to be eliminated
            this.checkAndEliminateRows();

            // Create the next block
            this.nextBlock();
        }
    }

    /**
     * Check if there are any rows to remove
     *
     * @return void
     */
    checkAndEliminateRows() {
        var no_rows_eliminated = 0;

        //Loop over the board rows
        $.each(this.board, function(r_index, row) {
            var column_full_count = 0;

            //Loop over the columns in this row
            $.each(row, function(c_index, col) {
                // A class indicates the column in this row is full
                if (col.hasOwnProperty("class")) {
                    column_full_count++;
                }
            });

            // The entire row is full
            if (column_full_count == this.SETTINGS.BOARD_COLS_WIDE) {
                no_rows_eliminated++;

                //Move the upper rows down, from the bottom up
                for (var i = r_index; i >= 1; i--) {
                    $.each(this.board[i], function(c_index, col) {
                        var prev_class = "";
                        if (
                            this.board.hasOwnProperty(i - 1) &&
                            this.board[i - 1][c_index].hasOwnProperty("class")
                        ) {
                            // The class from the block directly above
                            prev_class = this.board[i - 1][c_index]["class"];
                        }

                        var cur_id = "#tb_" + c_index + "_" + i;
                        var jCur = $(cur_id);

                        if (col.hasOwnProperty("class")) {
                            jCur.removeClass(col["class"]);
                        }

                        if (prev_class != "") {
                            //Copy down the class from above to the block in this row
                            jCur.addClass(prev_class);
                            this.board[i][c_index] = { class: prev_class };
                        } else {
                            //Blank block (no block above)
                            this.board[i][c_index] = {};
                        }
                    });
                }
            }
        });

        if (no_rows_eliminated > 0) {
            // Give the user their score
            this.score(no_rows_eliminated);
        }
    }

    /**
     * Score a move based on the number of rows eliminated
     *
     * @param int no_rows_eliminated The number of rows eliminated.
     * @return void
     */
    score(no_rows_eliminated) {
        var multiple_row_bonus = 0;
        var current_multiplier =
            SETTINGS.GAME_SCORE_MULTIPLIER * this.currentGame.level;

        this.currentGame.rowsEliminated =
            this.currentGame.rowsEliminated + no_rows_eliminated;

        if (no_rows_eliminated > 1) {
            // Give users a bonus for eliminating more than one row
            multiple_row_bonus =
                no_rows_eliminated * (current_multiplier * 0.5);
        }
        this.currentGame.score =
            this.currentGame.score +
            no_rows_eliminated * current_multiplier +
            multiple_row_bonus;

        this.setScoreText();

        if (this.currentGame.rowsEliminated == SETTINGS.BOARD_ROWS_HIGH) {
            // Level up
            this.currentGame.rowsEliminated = 0;

            this.currentGame.level = this.currentGame.level + 1;

            this.setLevelText();

            // Increase the speed of the game interval
            this.gameIntervalTimer.ms = this.gameIntervalTimer.ms - 20;
        }
    }

    /**
     * Set the Score text
     *
     * @return void
     */
    setScoreText() {
        $(this.DOM_IDS.SCORE_CONTAINER).text(this.currentGame.score);
    }

    /**
     * Set the Level text.
     *
     * @return void
     */
    setLevelText() {
        $(this.DOM_IDS.LEVEL_CONTAINER).text("LEVEL " + this.currentGame.level);
    }

    /**
     * Remove the current block from the board
     *
     * @return void
     */
    removeCurrentBlockFromBoard() {
        //Remove the current class from the visible blocks
        var this = this;
        $.each(this.currentBlock.blockIds, function(index, block_id) {
            $(block_id).removeClass(this.currentBlock.class);
        });

        //Reset the current set of blocks
        this.currentBlock.blockIds = [];
        this.currentBlock.blockPositions = [];
    }

    /**
     * Add the next block to the board
     *
     * @return void
     */
    nextBlock() {
        if (this.isPaused) {
            return;
        }

        // Reset all the variables
        this.currentBlock.blockIds = [];
        this.currentBlock.blockPositions = [];

        // The preview block becomes the current piece
        this.currentBlock.type = this.previewPiece.type;
        this.currentBlock.class = BLOCKS[this.currentBlock.type]["class"];

        // Reset the start location for the block to appear
        this.currentBlock.row = 1;
        this.currentBlock.col = SETTINGS.PIECE_START_COL;

        this.currentBlock.position = 0;

        this.moveBlock("none");

        //Reset the game interval
        this.killGameInterval();
        this.startGameInterval();

        // Make the next preview block
        this.makePreviewPiece();
    }

    /**
     * Setup the keyboard events.
     *   - Arrow keys control the motion of the blocks.
     *   - 'p' Pauses the game.
     *
     * @return void
     */
    setupKeyEvents() {
        var this = this;
        $(document).keydown(function(e) {
            switch (e.which) {
                case 37:
                    // Left arrow key
                    this.moveBlock("left");
                    break;

                case 38:
                    // Up arrow key
                    this.moveBlock("up");
                    break;

                case 39:
                    // Right arrow key
                    this.moveBlock("right");
                    break;

                case 40:
                    // Down arrow key
                    this.moveBlock("down");
                    break;

                case 80:
                    // 'p' pressed to pause
                    this.pauseGame();
                    break;

                // Default - don't do anything
                default:
                    return;
            }
            // Prevent the default action (scroll or char-move)
            e.preventDefault();
        });
    }

    /**
     * Start playing
     *
     * @return void
     */
    startPlay() {
        this.isPaused = false;

        if (this.previewPiece.type == "") {
            //New game is starting

            //Generate the first block type
            this.previewPiece.type = this.generateRandomBlockType();

            //Create the new piece
            this.nextBlock();
        }

        this.startGameInterval();

        this.hideMessage();
    }

    /**
     * Start the game interval
     *
     * @return void
     */
    startGameInterval() {
        if (!this.gameIntervalTimer.obj) {
            var this = this;

            // Setup the interval object using the std js function
            this.gameIntervalTimer.obj = setInterval(function() {
                //Start the action (just move the current piece down)
                this.moveBlock("down");
            }, this.gameIntervalTimer.ms);
        }
    }

    /**
     * Stop the game interval
     *
     * @return void
     */
    killGameInterval() {
        // Clear it using the standard js function
        clearInterval(this.gameIntervalTimer.obj);
        this.gameIntervalTimer.obj = false;
    }

    /**
     * Pause or unpause the game
     *
     * @return void
     */
    pauseGame() {
        var this = this;
        if (this.isPaused) {
            //Already paused, so start the game
            this.startPlay();
            return;
        }
        this.killGameInterval();
        this.isPaused = true;

        // Show the paused modal message (from template)
        this.showMessage("paused");

        $("button#tetrjs-pause-play").click(function() {
            this.startPlay();
        });
    }

    /**
     * Game over occurred.
     *
     * @return void
     */
    gameOver() {
        var this = this;
        this.isPaused = true;

        // Stop the game interval
        this.killGameInterval();

        var template_vars = {
            score: this.currentGame["score"],
            rowsEliminated: this.currentGame["rowsEliminated"],
            level: this.currentGame["level"]
        };
        // Show the gameover modal message (from template)
        this.showMessage("gameover", template_vars);

        $("button#tetrjs-gameover-newgame").click(function() {
            this.newGame();
        });
    }

    /**
     * Setup a new game
     *
     * @return void
     **/
    newGame() {
        // Stop the game interval
        this.killGameInterval();

        // Reset the the score, level, and interval
        this.currentGame.score = 0;
        this.currentGame.level = 1;
        this.gameIntervalTimer.ms = SETTINGS.GAME_INTERVAL_MS;

        // Reset the score and level text
        this.setScoreText();
        this.setLevelText();

        // Setup the main and preview boards
        this.setupBoard();
        this.setupPreviewBoard();

        // Remove the old preview piece type
        this.previewPiece.type = "";

        // Start the game
        this.startPlay();
    }

    /**
     * Show the introduction message;
     * should be run when game loads.
     *
     * @return void
     **/
    showIntro() {
        var this = this;
        this.setupBoard();
        this.setupPreviewBoard();

        this.showMessage("intro");
        $("button#tetrjs-intro-newgame").click(function() {
            this.newGame();
        });
    }

    /**
     * Show the About Popover
     *
     * @return void
     */
    showAbout() {
        var this = this;

        this.killGameInterval();
        this.isPaused = true;

        this.showMessage("about");
        $("button#tetrjs-about-close").click(function() {
            this.startPlay();
        });
    }

    /**
     * Show a message in the modal window.
     *
     * @return void
     */
    showMessage(template_name, vars) {
        var $modal = $(this.DOM_IDS.MODAL);
        var $veil = $(this.DOM_IDS.MODAL_VEIL);

        var html = templates[template_name].render(vars);

        $modal.html(html);

        //Center the message in the veil
        var leftOffset = Math.floor(($veil.width() - $modal.outerWidth()) / 2);
        var topOffset = Math.floor(($veil.height() - $modal.outerHeight()) / 2);

        $modal.css("left", leftOffset);
        $modal.css("top", topOffset);

        $veil.fadeIn(200, function() {
            $modal.fadeIn(200);
        });
    }

    /**
     * Hide the modal message.
     *
     * @return void
     */
    hideMessage() {
        var $modal = $(this.DOM_IDS.MODAL);
        var $veil = $(this.DOM_IDS.MODAL_VEIL);
        $modal.fadeOut(100, function() {
            $veil.hide();

            //Clear after the fade
            $modal.html("");
        });
    }

    /**
     * Run tetrjs.
     *
     * @param string containerID The container id for tetrjs.
     */
    run(containerID) {
        var this = this;
        $("#" + containerID).html(templates["container"].render());

        $("button#tetrjs-button-pause").click(function() {
            this.pauseGame();
        });

        $("button#tetrjs-button-new").click(function() {
            this.newGame();
        });

        $("button#tetrjs-button-about").click(function() {
            this.showAbout();
        });

        this.setupKeyEvents();

        this.showIntro();
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRldHJqcyBpcyBhIGphdmFzY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgVGV0cmlzLlxuICpcbiAqIEBhdXRob3IgRGVzdGluIE1vdWx0b25cbiAqIEBsaWNlbnNlIE1JVFxuICogQHZlcnNpb24gMS4wXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi90ZXRyanNcbiAqL1xuXG5pbXBvcnQgdXRpbCBmcm9tIFwiLi91dGlsXCI7XG5pbXBvcnQgeyBCTE9DS1MsIEJMT0NLX1RZUEVTIH0gZnJvbSBcIi4vYmxvY2tzXCI7XG5pbXBvcnQgeyBTRVRUSU5HUyB9IGZyb20gXCIuL3NldHRpbmdzXCI7XG5cbi8qKlxuICogVGhlIGNvbnN0cnVjdG9yLlxuICogSW5pdGlhbGl6ZXMgdGhlIGJhc2ljIGNvbmZpZ3VyYXRpb24gdmFsdWVzLlxuICogQHJldHVybiB2b2lkXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRldHJqcyB7XG4gICAgYm9hcmQgPSB7fTtcblxuICAgIGlzUGF1c2VkID0gZmFsc2U7XG5cbiAgICBET01fSURTID0ge1xuICAgICAgICBCT0FSRDogXCJ0ZXRyanMtYm9hcmRcIixcbiAgICAgICAgUFJFVklFV19DT05UQUlORVI6IFwidGV0cmpzLW5leHQtcGllY2UtcHJldmlldy1jb250YWluZXJcIixcbiAgICAgICAgU0NPUkVfQ09OVEFJTkVSOiBcIiN0ZXRyanMtc2NvcmUtY29udGFpbmVyXCIsXG4gICAgICAgIExFVkVMX0NPTlRBSU5FUjogXCIjdGV0cmpzLWxldmVsLWNvbnRhaW5lclwiLFxuICAgICAgICBNT0RBTDogXCIjdGV0cmpzLW1vZGFsXCIsXG4gICAgICAgIE1PREFMX1ZFSUw6IFwiI3RldHJqcy1tb2RhbC12ZWlsXCJcbiAgICB9O1xuXG4gICAgRE9NX0NMQVNTRVMgPSB7XG4gICAgICAgIEJPQVJEX0JMT0NLOiBcInRldHJqcy1ib2FyZC1ibG9ja1wiXG4gICAgfTtcblxuICAgIGN1cnJlbnRCbG9jayA9IHtcbiAgICAgICAgdHlwZTogXCJcIixcbiAgICAgICAgYmxvY2tJZHM6IFtdLFxuICAgICAgICBibG9ja1Bvc2l0aW9uczogW10sXG4gICAgICAgIGNsYXNzOiBcIlwiLFxuICAgICAgICByb3c6IFNFVFRJTkdTLlBJRUNFX1NUQVJUX1JPVyxcbiAgICAgICAgY29sOiBTRVRUSU5HUy5QSUVDRV9TVEFSVF9DT0wsXG4gICAgICAgIHBvc2l0aW9uOiBTRVRUSU5HUy5QSUVDRV9TVEFSVF9QT1NcbiAgICB9O1xuXG4gICAgcHJldmlld1BpZWNlID0ge1xuICAgICAgICB0eXBlOiBcIlwiLFxuICAgICAgICBjbGFzczogXCJcIixcbiAgICAgICAgYmxvY2tzOiBbXVxuICAgIH07XG5cbiAgICBnYW1lSW50ZXJ2YWxUaW1lciA9IHtcbiAgICAgICAgb2JqOiBmYWxzZSxcbiAgICAgICAgbXM6IFNFVFRJTkdTLkdBTUVfSU5URVJWQUxfTVNcbiAgICB9O1xuXG4gICAgY3VycmVudEdhbWUgPSB7XG4gICAgICAgIHNjb3JlOiAwLFxuICAgICAgICByb3dzRWxpbWluYXRlZDogMCxcbiAgICAgICAgbGV2ZWw6IDFcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgdGhlIFRldHJqcyBib2FyZC5cbiAgICAgKiAgMS4gQ2xlYXIgdGhlIGJvYXJkXG4gICAgICogICAgIGkuIFJlbW92ZSBhbnkgZXhpc3RpbmcgSFRNTFxuICAgICAqICAgICBpaS4gQ2xlYXIgdGhlIG11bHRpZGltZW5zaW9uYWwvbWF0cml4IGJvYXJkIG9iamVjdFxuICAgICAqICAyLiBTZXQgdGhlIGJvYXJkIHdpZHRoIGFuZCBoZWlnaHQgKGluIHB4KVxuICAgICAqICAzLiBDcmVhdGUgdGhlIG5ldywgY2xlYW4sIGJvYXJkXG4gICAgICogICAgIGkuIEluc3RhbnRpYXRlIHRoZSBtdWx0aWRpbWVuc2lvbmFsL21hdHJpeCBib2FyZCBjb250YWluZXJcbiAgICAgKiAgICAgaWkuIENyZWF0ZSBkaXYgYm94ZXMgYXQgYWJzb2x1dGUgcG9zaXRpb24gdG8gaG9sZCBibG9ja3NcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNldHVwQm9hcmQoKSB7XG4gICAgICAgIGNvbnN0ICR0ZXRyanNCb2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRE9NX0lEUy5CT0FSRCk7XG5cbiAgICAgICAgLy8gQ2xlYXIgdGhlIGJvYXJkXG4gICAgICAgICR0ZXRyanNCb2FyZC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICB0aGlzLmJvYXJkID0ge307XG5cbiAgICAgICAgLy8gU2V0IHRoZSBib2FyZCBzaXplXG4gICAgICAgIGNvbnN0IGJvYXJkV2lkdGggPSBTRVRUSU5HUy5CT0FSRF9DT0xTX1dJREUgKiBTRVRUSU5HUy5DRUxMX1dJRFRIX1BYO1xuICAgICAgICBjb25zdCBib2FyZEhlaWdodCA9IFNFVFRJTkdTLkJPQVJEX1JPV1NfSElHSCAqIFNFVFRJTkdTLkNFTExfSEVJR0hUX1BYO1xuICAgICAgICAkdGV0cmpzQm9hcmQuc3R5bGUud2lkdGggPSBgJHtib2FyZFdpZHRofXB4YDtcbiAgICAgICAgJHRldHJqc0JvYXJkLnN0eWxlLmhlaWdodCA9IGAke2JvYXJkSGVpZ2h0fXB4YDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBTRVRUSU5HUy5CT0FSRF9ST1dTX0hJR0g7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ib2FyZFtpXSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgdG9wX3BvcyA9IChpIC0gMSkgKiBTRVRUSU5HUy5DRUxMX0hFSUdIVF9QWDtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IFNFVFRJTkdTLkJPQVJEX0NPTFNfV0lERTsgaisrKSB7XG4gICAgICAgICAgICAgICAgLy8gU2V0dXAgdGhlIG9iamVjdCBmb3Igc3RvcmluZyBibG9jayBwb3NpdGlvbnNcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2ldW2pdID0ge307XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgbGVmdCBweCBwb3NpdGlvbiBvZiB0aGUgY2VsbFxuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRfcG9zID0gKGogLSAxKSAqIFNFVFRJTkdTLkNFTExfV0lEVEhfUFg7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIGJsb2NrIHRvIHRoZSBib2FyZFxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBibG9jay5zdHlsZS5sZWZ0ID0gbGVmdF9wb3MudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBibG9jay5zdHlsZS50b3AgPSB0b3BfcG9zLnRvU3RyaW5nKCkgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgYmxvY2suY2xhc3NOYW1lID0gdGhpcy5ET01fQ0xBU1NFUy5CT0FSRF9CTE9DSztcbiAgICAgICAgICAgICAgICBibG9jay5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgdGJfJHtqfV8ke2l9YCk7XG4gICAgICAgICAgICAgICAgJHRldHJqc0JvYXJkLmFwcGVuZENoaWxkKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHVwIHRoZSBzbWFsbCBwcmV2aWV3IGJvYXJkIHRvIGRpc3BsYXkgdGhlIG5leHQgcGllY2UuXG4gICAgICpcbiAgICAgKiBBbG1vc3QgaWRlbnRpY2FsIHRvIHRoZSBzZXR1cEJvYXJkIGZ1bmN0aW9uLCBleGNlcHQgd2VcbiAgICAgKiBkbyBub3QgbmVlZCBhIG11bHRpZGltZW5zaW9uYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGJvYXJkLlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2V0dXBQcmV2aWV3Qm9hcmQoKSB7XG4gICAgICAgIHZhciAkcHJldmlld0JvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICB0aGlzLkRPTV9JRFMuUFJFVklFV19DT05UQUlORVJcbiAgICAgICAgKTtcbiAgICAgICAgdmFyIHByZXZpZXdfc2VjdGlvbnNfd2lkZSA9IDY7XG4gICAgICAgIHZhciBwcmV2aWV3X3NlY3Rpb25zX2hpZ2ggPSA0O1xuXG4gICAgICAgIC8vIENsZWFyIHRoZSBib2FyZFxuICAgICAgICBjb25zdCBib2FyZFdpZHRoID0gcHJldmlld19zZWN0aW9uc193aWRlICogU0VUVElOR1MuQ0VMTF9XSURUSF9QWDtcbiAgICAgICAgY29uc3QgYm9hcmRIZWlnaHQgPSBwcmV2aWV3X3NlY3Rpb25zX2hpZ2ggKiBTRVRUSU5HUy5DRUxMX0hFSUdIVF9QWDtcbiAgICAgICAgJHByZXZpZXdCb2FyZC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAkcHJldmlld0JvYXJkLnN0eWxlLndpZHRoID0gYCR7Ym9hcmRXaWR0aH1weGA7XG4gICAgICAgICRwcmV2aWV3Qm9hcmQuc3R5bGUuaGVpZ2h0ID0gYCR7Ym9hcmRIZWlnaHR9cHhgO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHByZXZpZXdfc2VjdGlvbnNfaGlnaDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdG9wX3BvcyA9IChpIC0gMSkgKiBTRVRUSU5HUy5DRUxMX0hFSUdIVF9QWDtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IHByZXZpZXdfc2VjdGlvbnNfd2lkZTsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxlZnRfcG9zID0gKGogLSAxKSAqIFNFVFRJTkdTLkNFTExfV0lEVEhfUFg7XG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBibG9jay5zdHlsZS50b3AgPSB0b3BfcG9zICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGJsb2NrLnN0eWxlLmxlZnQgPSBsZWZ0X3BvcyArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBibG9jay5jbGFzc05hbWUgPSB0aGlzLkRPTV9DTEFTU0VTLkJPQVJEX0JMT0NLO1xuICAgICAgICAgICAgICAgIGJsb2NrLnNldEF0dHJpYnV0ZShcImlkXCIsIGB0cF8ke2p9XyR7aX1gKTtcbiAgICAgICAgICAgICAgICAkcHJldmlld0JvYXJkLmFwcGVuZENoaWxkKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIHJhbmRvbSBibG9jayB0eXBlLlxuICAgICAqXG4gICAgICogQHJldHVybiBzdHJpbmcgQmxvY2sgdHlwZVxuICAgICAqL1xuICAgIGdlbmVyYXRlUmFuZG9tQmxvY2tUeXBlKCkge1xuICAgICAgICByZXR1cm4gQkxPQ0tfVFlQRVNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogQkxPQ0tfVFlQRVMubGVuZ3RoKV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFrZSB0aGUgcHJldmlldyBibG9jayBpbiB0aGUgcHJldmlldyBib2FyZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIG1ha2VQcmV2aWV3UGllY2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzUGF1c2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvL1JlbW92ZSB0aGUgY3VycmVudCBibG9jayBmcm9tIHRoZSBwcmV2aWV3XG4gICAgICAgIGZvciAobGV0IGJsb2NrX2lkIG9mIHRoaXMucHJldmlld1BpZWNlLmJsb2Nrcykge1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9ja19pZCk7XG4gICAgICAgICAgICB1dGlsLnJlbW92ZUNsYXNzKGJsb2NrLCB0aGlzLnByZXZpZXdQaWVjZS5jbGFzcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmV2aWV3UGllY2UuYmxvY2tzID0gW107XG5cbiAgICAgICAgLy9HZXQgYSByYW5kb20gYmxvY2tcbiAgICAgICAgdGhpcy5wcmV2aWV3UGllY2UudHlwZSA9IHRoaXMuZ2VuZXJhdGVSYW5kb21CbG9ja1R5cGUoKTtcblxuICAgICAgICB0aGlzLnByZXZpZXdQaWVjZS5jbGFzcyA9IEJMT0NLU1t0aGlzLnByZXZpZXdQaWVjZS50eXBlXVtcImNsYXNzXCJdO1xuICAgICAgICBjb25zdCBzdGFydF9jb2wgPSAyO1xuICAgICAgICBjb25zdCBzdGFydF9yb3cgPSAyO1xuICAgICAgICBjb25zdCBjdXJyX2Jsb2NrX3Bvc2l0aW9uX3Jvd3MgPVxuICAgICAgICAgICAgQkxPQ0tTW3RoaXMucHJldmlld1BpZWNlLnR5cGVdW1wicG9zaXRpb25zXCJdWzBdW1wicm93c1wiXTtcblxuICAgICAgICAvLyBSb3dzIGFyZSBzdG9yZWQgYXMgYW4gb2JqZWN0LW1hdHJpeFxuICAgICAgICBjb25zdCByb3dfa2V5cyA9IE9iamVjdC5rZXlzKGN1cnJfYmxvY2tfcG9zaXRpb25fcm93cyk7XG4gICAgICAgIGZvciAobGV0IHJvd19pbmRleCBvZiByb3dfa2V5cykge1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gY3Vycl9ibG9ja19wb3NpdGlvbl9yb3dzW3Jvd19pbmRleF07XG4gICAgICAgICAgICBjb25zdCBjb2xfa2V5cyA9IE9iamVjdC5rZXlzKHJvdyk7XG4gICAgICAgICAgICBmb3IgKGxldCBjb2xfaW5kZXggb2YgY29sX2tleXMpIHtcbiAgICAgICAgICAgICAgICBpZiAocm93W2NvbF9pbmRleF0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxvY2tfY29sID0gc3RhcnRfY29sICsgcGFyc2VJbnQoY29sX2luZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxvY2tfcm93ID0gc3RhcnRfcm93ICsgcGFyc2VJbnQocm93X2luZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSBcInRwX1wiICsgYmxvY2tfY29sICsgXCJfXCIgKyBibG9ja19yb3c7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICAgICAgICAgICAgICB1dGlsLmFkZENsYXNzKGVsLCB0aGlzLnByZXZpZXdQaWVjZS5jbGFzcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2aWV3UGllY2UuYmxvY2tzLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1vdmUgYSBibG9jayBvbiB0aGUgYm9hcmQuXG4gICAgICogVGhpcyBpcyBtb3N0bHkgY2FsbGVkIGFzIHRoZSBrZXlib2FyZCBldmVudCBoYW5kbGVyLlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgbW92ZUJsb2NrKGRlc2lyZWRfZGlyZWN0aW9uKSB7XG4gICAgICAgIHZhciBjdXJyX2Jsb2NrX25vX3Bvc2l0aW9ucyA9XG4gICAgICAgICAgICBCTE9DS1NbdGhpcy5jdXJyZW50QmxvY2sudHlwZV1bXCJub19wb3NpdGlvbnNcIl07XG4gICAgICAgIHZhciBjdXJyX2Jsb2NrX3Bvc190cmFuc19yb3cgPSAwO1xuICAgICAgICB2YXIgY3Vycl9ibG9ja19wb3NfdHJhbnNfY29sID0gMDtcbiAgICAgICAgdmFyIGRlc2lyZWRfcG9zaXRpb24gPSB0aGlzLmN1cnJlbnRCbG9jay5wb3NpdGlvbjtcblxuICAgICAgICAvLyAndXAnIHJvdGF0ZXMgdGhlIGJsb2NrXG4gICAgICAgIGlmIChkZXNpcmVkX2RpcmVjdGlvbiA9PSBcInVwXCIpIHtcbiAgICAgICAgICAgIGRlc2lyZWRfcG9zaXRpb24gPSB0aGlzLmN1cnJlbnRCbG9jay5wb3NpdGlvbiArIDE7XG4gICAgICAgICAgICBpZiAoZGVzaXJlZF9wb3NpdGlvbiA+IGN1cnJfYmxvY2tfbm9fcG9zaXRpb25zIC0gMSkge1xuICAgICAgICAgICAgICAgIC8vUmVzZXQgdGhlIHRyYW5zaXRpb24gYmFjayB0byAwXG4gICAgICAgICAgICAgICAgZGVzaXJlZF9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoZSBhbW91bnQgdG8gbW92ZSB0aGUgZGVzaXJlZCByb3cgYW5kIGNvbHVtblxuICAgICAgICAgICAgLy8gZHVyaW5nIHRoZSB0cmFuc2Zvcm1hdGlvblxuICAgICAgICAgICAgY3Vycl9ibG9ja19wb3NfdHJhbnNfcm93ID1cbiAgICAgICAgICAgICAgICBCTE9DS1NbdGhpcy5jdXJyZW50QmxvY2sudHlwZV1bXCJwb3NpdGlvbnNcIl1bZGVzaXJlZF9wb3NpdGlvbl1bXG4gICAgICAgICAgICAgICAgICAgIFwidHJhbnNfcm93XCJcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgY3Vycl9ibG9ja19wb3NfdHJhbnNfY29sID1cbiAgICAgICAgICAgICAgICBCTE9DS1NbdGhpcy5jdXJyZW50QmxvY2sudHlwZV1bXCJwb3NpdGlvbnNcIl1bZGVzaXJlZF9wb3NpdGlvbl1bXG4gICAgICAgICAgICAgICAgICAgIFwidHJhbnNfY29sXCJcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRtcF9kZXNpcmVkX3Bvc2l0aW9ucyA9IFtdO1xuICAgICAgICB2YXIgbG9ja19jdXJyZW50X2Jsb2NrID0gZmFsc2U7XG4gICAgICAgIHZhciB0bXBfbG93ZXN0X2NvbCA9IFNFVFRJTkdTLkJPQVJEX0NPTFNfV0lERTtcbiAgICAgICAgdmFyIHRtcF9sb3dlc3Rfcm93ID0gU0VUVElOR1MuQk9BUkRfUk9XU19ISUdIO1xuXG4gICAgICAgIHZhciBlcnJvciA9IGZhbHNlO1xuICAgICAgICB2YXIgY3Vycl9ibG9ja19wb3NpdGlvbl9yb3dzID1cbiAgICAgICAgICAgIEJMT0NLU1t0aGlzLmN1cnJlbnRCbG9jay50eXBlXVtcInBvc2l0aW9uc1wiXVtkZXNpcmVkX3Bvc2l0aW9uXVtcbiAgICAgICAgICAgICAgICBcInJvd3NcIlxuICAgICAgICAgICAgXTtcbiAgICAgICAgY29uc3Qgcm93S2V5cyA9IE9iamVjdC5rZXlzKGN1cnJfYmxvY2tfcG9zaXRpb25fcm93cyk7XG4gICAgICAgIGZvcihsZXQgcm93X2luZGV4ID0gMDsgcm93X2luZGV4IDwgcm93S2V5cy5sZW5ndGg7IHJvd19pbmRleCsrKXtcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IGN1cnJfYmxvY2tfcG9zaXRpb25fcm93c1tyb3dfaW5kZXhdO1xuICAgICAgICAgICAgY29uc3QgY29sS2V5cyA9IE9iamVjdC5rZXlzKHJvdyk7XG4gICAgICAgICAgICBmb3IobGV0IGNvbF9pbmRleCA9IDA7IGNvbF9pbmRleDxjb2xLZXlzLmxlbmd0aDsgY29sX2luZGV4KysgKXtcbiAgICAgICAgICAgICAgICBpZiAocm93W2NvbF9pbmRleF0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRtcF9waWVjZV9jb2xfcG9zID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmNvbCArIHBhcnNlSW50KGNvbF9pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0bXBfcGllY2Vfcm93X3BvcyA9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5yb3cgKyBwYXJzZUludChyb3dfaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0bXBfcGllY2VfZGVzaXJlZF9jb2wgPVxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wX3BpZWNlX2NvbF9wb3MgKyBjdXJyX2Jsb2NrX3Bvc190cmFuc19jb2w7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0bXBfcGllY2VfZGVzaXJlZF9yb3cgPVxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wX3BpZWNlX3Jvd19wb3MgKyBjdXJyX2Jsb2NrX3Bvc190cmFuc19yb3c7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2lyZWRfZGlyZWN0aW9uID09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFt0bXBfcGllY2VfZGVzaXJlZF9yb3ddW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXBfcGllY2VfZGVzaXJlZF9jb2xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLmhhc093blByb3BlcnR5KFwiY2xhc3NcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5ldyBwaWVjZSBidXQgYSBzcGFjZSBpcyBhbHJlYWR5IHRha2VuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lT3ZlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2lyZWRfZGlyZWN0aW9uID09IFwibGVmdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0bXBfcGllY2VfZGVzaXJlZF9jb2wgPSB0bXBfcGllY2VfY29sX3BvcyAtIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZF9kaXJlY3Rpb24gPT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0bXBfcGllY2VfZGVzaXJlZF9jb2wgPSB0bXBfcGllY2VfY29sX3BvcyArIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZF9kaXJlY3Rpb24gPT0gXCJkb3duXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcF9waWVjZV9kZXNpcmVkX3JvdyA9IHRtcF9waWVjZV9yb3dfcG9zICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXBfcGllY2VfZGVzaXJlZF9yb3cgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLlNFVFRJTkdTLkJPQVJEX1JPV1NfSElHSCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbdG1wX3BpZWNlX2Rlc2lyZWRfcm93XVtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wX3BpZWNlX2Rlc2lyZWRfY29sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5oYXNPd25Qcm9wZXJ0eShcImNsYXNzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBbHJlYWR5IGEgYmxvY2sgaW4gdGhlIG5leHQgZG93bndhcmQgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NrX2N1cnJlbnRfYmxvY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJvYXJkLmhhc093blByb3BlcnR5KHRtcF9waWVjZV9kZXNpcmVkX3JvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQ2FuJ3QgbW92ZSBkb3duLCBzbyBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuYm9hcmRbdG1wX3BpZWNlX2Rlc2lyZWRfcm93XS5oYXNPd25Qcm9wZXJ0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXBfcGllY2VfZGVzaXJlZF9jb2xcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL09mZiB0aGUgYm9hcmQgZXJyb3Igb3V0XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3RtcF9waWVjZV9kZXNpcmVkX3Jvd11bXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wX3BpZWNlX2Rlc2lyZWRfY29sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmhhc093blByb3BlcnR5KFwiY2xhc3NcIilcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL0JvYXJkIHNwb3QgYWxyZWFkeSB0YWtlblxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRtcF9waWVjZV9kZXNpcmVkX2NvbCA8IHRtcF9sb3dlc3RfY29sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wX2xvd2VzdF9jb2wgPSB0bXBfcGllY2VfZGVzaXJlZF9jb2w7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG1wX3BpZWNlX2Rlc2lyZWRfcm93IDwgdG1wX2xvd2VzdF9yb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXBfbG93ZXN0X3JvdyA9IHRtcF9waWVjZV9kZXNpcmVkX3JvdztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wX2Rlc2lyZWRfcG9zaXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbDogdG1wX3BpZWNlX2Rlc2lyZWRfY29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogdG1wX3BpZWNlX2Rlc2lyZWRfcm93XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICghbG9ja19jdXJyZW50X2Jsb2NrKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBjdXJyZW50IHBpZWNlXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDdXJyZW50QmxvY2tGcm9tQm9hcmQoKTtcblxuICAgICAgICAgICAgICAgIC8vU2V0IHRoZSBuZXcgY3VycmVudCBkaXJlY3Rpb25cbiAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZF9kaXJlY3Rpb24gPT0gXCJ1cFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJsb2NrLnBvc2l0aW9uID0gZGVzaXJlZF9wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIG5ldyBjdXJyZW50IHJvdyBhbmQgY29sdW1uXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suY29sID0gdG1wX2xvd2VzdF9jb2w7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmxvY2sucm93ID0gdG1wX2xvd2VzdF9yb3c7XG4gICAgICAgICAgICAgICAgLy8gQXBwbHkgdGhlICdtb3ZlbWVudCcgYnkgbW9kaWZ5aW5nIHRoZSBibG9jaydzIGNsYXNzXG4gICAgICAgICAgICAgICAgZm9yKGxldCBwb3Mgb2YgdG1wX2Rlc2lyZWRfcG9zaXRpb25zKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRtcF9pZCA9IGB0Yl8ke3Bvc1tcImNvbFwiXX1fJHtwb3NbXCJyb3dcIl19YDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGpUTVAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0bXBfaWQpO1xuICAgICAgICAgICAgICAgICAgICBqVE1QLmFkZENsYXNzKHRoaXMuY3VycmVudEJsb2NrLmNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suYmxvY2tJZHMucHVzaCh0bXBfaWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5ibG9ja1Bvc2l0aW9ucy5wdXNoKHBvcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGJsb2NrIGhhcyByZWFjaGVkIGl0cyBmaW5hbCBkZXN0aW5hdGlvblxuICAgICAgICBpZiAobG9ja19jdXJyZW50X2Jsb2NrKSB7XG4gICAgICAgICAgICBmb3IobGV0IHBvcyBvZiB0aGlzLmN1cnJlbnRCbG9jay5ibG9ja1Bvc2l0aW9ucyl7XG4gICAgICAgICAgICAgICAgLy8gTG9jayB0aGUgY3VycmVudCBibG9jayBvbiB0aGUgYm9hcmRcbiAgICAgICAgICAgICAgICAvLyBieSBzZXR0aW5nIHRoZSBwZXJtYW5lbnQgYm9hcmQgY2xhc3NcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3Bvc1tcInJvd1wiXV1bcG9zW1wiY29sXCJdXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHRoaXMuY3VycmVudEJsb2NrLmNsYXNzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGJsb2NrIGhhcyBjYXVzZWQgcm93cyB0byBiZSBlbGltaW5hdGVkXG4gICAgICAgICAgICB0aGlzLmNoZWNrQW5kRWxpbWluYXRlUm93cygpO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIG5leHQgYmxvY2tcbiAgICAgICAgICAgIHRoaXMubmV4dEJsb2NrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGVyZSBhcmUgYW55IHJvd3MgdG8gcmVtb3ZlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBjaGVja0FuZEVsaW1pbmF0ZVJvd3MoKSB7XG4gICAgICAgIHZhciBub19yb3dzX2VsaW1pbmF0ZWQgPSAwO1xuXG4gICAgICAgIC8vTG9vcCBvdmVyIHRoZSBib2FyZCByb3dzXG4gICAgICAgICQuZWFjaCh0aGlzLmJvYXJkLCBmdW5jdGlvbihyX2luZGV4LCByb3cpIHtcbiAgICAgICAgICAgIHZhciBjb2x1bW5fZnVsbF9jb3VudCA9IDA7XG5cbiAgICAgICAgICAgIC8vTG9vcCBvdmVyIHRoZSBjb2x1bW5zIGluIHRoaXMgcm93XG4gICAgICAgICAgICAkLmVhY2gocm93LCBmdW5jdGlvbihjX2luZGV4LCBjb2wpIHtcbiAgICAgICAgICAgICAgICAvLyBBIGNsYXNzIGluZGljYXRlcyB0aGUgY29sdW1uIGluIHRoaXMgcm93IGlzIGZ1bGxcbiAgICAgICAgICAgICAgICBpZiAoY29sLmhhc093blByb3BlcnR5KFwiY2xhc3NcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uX2Z1bGxfY291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gVGhlIGVudGlyZSByb3cgaXMgZnVsbFxuICAgICAgICAgICAgaWYgKGNvbHVtbl9mdWxsX2NvdW50ID09IHRoaXMuU0VUVElOR1MuQk9BUkRfQ09MU19XSURFKSB7XG4gICAgICAgICAgICAgICAgbm9fcm93c19lbGltaW5hdGVkKys7XG5cbiAgICAgICAgICAgICAgICAvL01vdmUgdGhlIHVwcGVyIHJvd3MgZG93biwgZnJvbSB0aGUgYm90dG9tIHVwXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHJfaW5kZXg7IGkgPj0gMTsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZWFjaCh0aGlzLmJvYXJkW2ldLCBmdW5jdGlvbihjX2luZGV4LCBjb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmV2X2NsYXNzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmhhc093blByb3BlcnR5KGkgLSAxKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbaSAtIDFdW2NfaW5kZXhdLmhhc093blByb3BlcnR5KFwiY2xhc3NcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBjbGFzcyBmcm9tIHRoZSBibG9jayBkaXJlY3RseSBhYm92ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZfY2xhc3MgPSB0aGlzLmJvYXJkW2kgLSAxXVtjX2luZGV4XVtcImNsYXNzXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VyX2lkID0gXCIjdGJfXCIgKyBjX2luZGV4ICsgXCJfXCIgKyBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGpDdXIgPSAkKGN1cl9pZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2wuaGFzT3duUHJvcGVydHkoXCJjbGFzc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpDdXIucmVtb3ZlQ2xhc3MoY29sW1wiY2xhc3NcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldl9jbGFzcyAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9Db3B5IGRvd24gdGhlIGNsYXNzIGZyb20gYWJvdmUgdG8gdGhlIGJsb2NrIGluIHRoaXMgcm93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgakN1ci5hZGRDbGFzcyhwcmV2X2NsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2ldW2NfaW5kZXhdID0geyBjbGFzczogcHJldl9jbGFzcyB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0JsYW5rIGJsb2NrIChubyBibG9jayBhYm92ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2ldW2NfaW5kZXhdID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG5vX3Jvd3NfZWxpbWluYXRlZCA+IDApIHtcbiAgICAgICAgICAgIC8vIEdpdmUgdGhlIHVzZXIgdGhlaXIgc2NvcmVcbiAgICAgICAgICAgIHRoaXMuc2NvcmUobm9fcm93c19lbGltaW5hdGVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNjb3JlIGEgbW92ZSBiYXNlZCBvbiB0aGUgbnVtYmVyIG9mIHJvd3MgZWxpbWluYXRlZFxuICAgICAqXG4gICAgICogQHBhcmFtIGludCBub19yb3dzX2VsaW1pbmF0ZWQgVGhlIG51bWJlciBvZiByb3dzIGVsaW1pbmF0ZWQuXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2NvcmUobm9fcm93c19lbGltaW5hdGVkKSB7XG4gICAgICAgIHZhciBtdWx0aXBsZV9yb3dfYm9udXMgPSAwO1xuICAgICAgICB2YXIgY3VycmVudF9tdWx0aXBsaWVyID1cbiAgICAgICAgICAgIFNFVFRJTkdTLkdBTUVfU0NPUkVfTVVMVElQTElFUiAqIHRoaXMuY3VycmVudEdhbWUubGV2ZWw7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50R2FtZS5yb3dzRWxpbWluYXRlZCA9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLnJvd3NFbGltaW5hdGVkICsgbm9fcm93c19lbGltaW5hdGVkO1xuXG4gICAgICAgIGlmIChub19yb3dzX2VsaW1pbmF0ZWQgPiAxKSB7XG4gICAgICAgICAgICAvLyBHaXZlIHVzZXJzIGEgYm9udXMgZm9yIGVsaW1pbmF0aW5nIG1vcmUgdGhhbiBvbmUgcm93XG4gICAgICAgICAgICBtdWx0aXBsZV9yb3dfYm9udXMgPVxuICAgICAgICAgICAgICAgIG5vX3Jvd3NfZWxpbWluYXRlZCAqIChjdXJyZW50X211bHRpcGxpZXIgKiAwLjUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudEdhbWUuc2NvcmUgPVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50R2FtZS5zY29yZSArXG4gICAgICAgICAgICBub19yb3dzX2VsaW1pbmF0ZWQgKiBjdXJyZW50X211bHRpcGxpZXIgK1xuICAgICAgICAgICAgbXVsdGlwbGVfcm93X2JvbnVzO1xuXG4gICAgICAgIHRoaXMuc2V0U2NvcmVUZXh0KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEdhbWUucm93c0VsaW1pbmF0ZWQgPT0gU0VUVElOR1MuQk9BUkRfUk9XU19ISUdIKSB7XG4gICAgICAgICAgICAvLyBMZXZlbCB1cFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50R2FtZS5yb3dzRWxpbWluYXRlZCA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudEdhbWUubGV2ZWwgPSB0aGlzLmN1cnJlbnRHYW1lLmxldmVsICsgMTtcblxuICAgICAgICAgICAgdGhpcy5zZXRMZXZlbFRleHQoKTtcblxuICAgICAgICAgICAgLy8gSW5jcmVhc2UgdGhlIHNwZWVkIG9mIHRoZSBnYW1lIGludGVydmFsXG4gICAgICAgICAgICB0aGlzLmdhbWVJbnRlcnZhbFRpbWVyLm1zID0gdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5tcyAtIDIwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBTY29yZSB0ZXh0XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzZXRTY29yZVRleHQoKSB7XG4gICAgICAgICQodGhpcy5ET01fSURTLlNDT1JFX0NPTlRBSU5FUikudGV4dCh0aGlzLmN1cnJlbnRHYW1lLnNjb3JlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIExldmVsIHRleHQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzZXRMZXZlbFRleHQoKSB7XG4gICAgICAgICQodGhpcy5ET01fSURTLkxFVkVMX0NPTlRBSU5FUikudGV4dChcIkxFVkVMIFwiICsgdGhpcy5jdXJyZW50R2FtZS5sZXZlbCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBjdXJyZW50IGJsb2NrIGZyb20gdGhlIGJvYXJkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICByZW1vdmVDdXJyZW50QmxvY2tGcm9tQm9hcmQoKSB7XG4gICAgICAgIC8vUmVtb3ZlIHRoZSBjdXJyZW50IGNsYXNzIGZyb20gdGhlIHZpc2libGUgYmxvY2tzXG4gICAgICAgIHZhciB0aGlzID0gdGhpcztcbiAgICAgICAgJC5lYWNoKHRoaXMuY3VycmVudEJsb2NrLmJsb2NrSWRzLCBmdW5jdGlvbihpbmRleCwgYmxvY2tfaWQpIHtcbiAgICAgICAgICAgICQoYmxvY2tfaWQpLnJlbW92ZUNsYXNzKHRoaXMuY3VycmVudEJsb2NrLmNsYXNzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9SZXNldCB0aGUgY3VycmVudCBzZXQgb2YgYmxvY2tzXG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrSWRzID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrUG9zaXRpb25zID0gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHRoZSBuZXh0IGJsb2NrIHRvIHRoZSBib2FyZFxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgbmV4dEJsb2NrKCkge1xuICAgICAgICBpZiAodGhpcy5pc1BhdXNlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzZXQgYWxsIHRoZSB2YXJpYWJsZXNcbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suYmxvY2tJZHMgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suYmxvY2tQb3NpdGlvbnMgPSBbXTtcblxuICAgICAgICAvLyBUaGUgcHJldmlldyBibG9jayBiZWNvbWVzIHRoZSBjdXJyZW50IHBpZWNlXG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLnR5cGUgPSB0aGlzLnByZXZpZXdQaWVjZS50eXBlO1xuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5jbGFzcyA9IEJMT0NLU1t0aGlzLmN1cnJlbnRCbG9jay50eXBlXVtcImNsYXNzXCJdO1xuXG4gICAgICAgIC8vIFJlc2V0IHRoZSBzdGFydCBsb2NhdGlvbiBmb3IgdGhlIGJsb2NrIHRvIGFwcGVhclxuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5yb3cgPSAxO1xuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5jb2wgPSBTRVRUSU5HUy5QSUVDRV9TVEFSVF9DT0w7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2sucG9zaXRpb24gPSAwO1xuXG4gICAgICAgIHRoaXMubW92ZUJsb2NrKFwibm9uZVwiKTtcblxuICAgICAgICAvL1Jlc2V0IHRoZSBnYW1lIGludGVydmFsXG4gICAgICAgIHRoaXMua2lsbEdhbWVJbnRlcnZhbCgpO1xuICAgICAgICB0aGlzLnN0YXJ0R2FtZUludGVydmFsKCk7XG5cbiAgICAgICAgLy8gTWFrZSB0aGUgbmV4dCBwcmV2aWV3IGJsb2NrXG4gICAgICAgIHRoaXMubWFrZVByZXZpZXdQaWVjZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHVwIHRoZSBrZXlib2FyZCBldmVudHMuXG4gICAgICogICAtIEFycm93IGtleXMgY29udHJvbCB0aGUgbW90aW9uIG9mIHRoZSBibG9ja3MuXG4gICAgICogICAtICdwJyBQYXVzZXMgdGhlIGdhbWUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzZXR1cEtleUV2ZW50cygpIHtcbiAgICAgICAgdmFyIHRoaXMgPSB0aGlzO1xuICAgICAgICAkKGRvY3VtZW50KS5rZXlkb3duKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZS53aGljaCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMzc6XG4gICAgICAgICAgICAgICAgICAgIC8vIExlZnQgYXJyb3cga2V5XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUJsb2NrKFwibGVmdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICAvLyBVcCBhcnJvdyBrZXlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmxvY2soXCJ1cFwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgICAgICAgICAvLyBSaWdodCBhcnJvdyBrZXlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmxvY2soXCJyaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICAvLyBEb3duIGFycm93IGtleVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVCbG9jayhcImRvd25cIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA4MDpcbiAgICAgICAgICAgICAgICAgICAgLy8gJ3AnIHByZXNzZWQgdG8gcGF1c2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXVzZUdhbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAvLyBEZWZhdWx0IC0gZG9uJ3QgZG8gYW55dGhpbmdcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiAoc2Nyb2xsIG9yIGNoYXItbW92ZSlcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgcGxheWluZ1xuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc3RhcnRQbGF5KCkge1xuICAgICAgICB0aGlzLmlzUGF1c2VkID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMucHJldmlld1BpZWNlLnR5cGUgPT0gXCJcIikge1xuICAgICAgICAgICAgLy9OZXcgZ2FtZSBpcyBzdGFydGluZ1xuXG4gICAgICAgICAgICAvL0dlbmVyYXRlIHRoZSBmaXJzdCBibG9jayB0eXBlXG4gICAgICAgICAgICB0aGlzLnByZXZpZXdQaWVjZS50eXBlID0gdGhpcy5nZW5lcmF0ZVJhbmRvbUJsb2NrVHlwZSgpO1xuXG4gICAgICAgICAgICAvL0NyZWF0ZSB0aGUgbmV3IHBpZWNlXG4gICAgICAgICAgICB0aGlzLm5leHRCbG9jaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGFydEdhbWVJbnRlcnZhbCgpO1xuXG4gICAgICAgIHRoaXMuaGlkZU1lc3NhZ2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGFydCB0aGUgZ2FtZSBpbnRlcnZhbFxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc3RhcnRHYW1lSW50ZXJ2YWwoKSB7XG4gICAgICAgIGlmICghdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5vYmopIHtcbiAgICAgICAgICAgIHZhciB0aGlzID0gdGhpcztcblxuICAgICAgICAgICAgLy8gU2V0dXAgdGhlIGludGVydmFsIG9iamVjdCB1c2luZyB0aGUgc3RkIGpzIGZ1bmN0aW9uXG4gICAgICAgICAgICB0aGlzLmdhbWVJbnRlcnZhbFRpbWVyLm9iaiA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vU3RhcnQgdGhlIGFjdGlvbiAoanVzdCBtb3ZlIHRoZSBjdXJyZW50IHBpZWNlIGRvd24pXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmxvY2soXCJkb3duXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5tcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdG9wIHRoZSBnYW1lIGludGVydmFsXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBraWxsR2FtZUludGVydmFsKCkge1xuICAgICAgICAvLyBDbGVhciBpdCB1c2luZyB0aGUgc3RhbmRhcmQganMgZnVuY3Rpb25cbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVJbnRlcnZhbFRpbWVyLm9iaik7XG4gICAgICAgIHRoaXMuZ2FtZUludGVydmFsVGltZXIub2JqID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGF1c2Ugb3IgdW5wYXVzZSB0aGUgZ2FtZVxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgcGF1c2VHYW1lKCkge1xuICAgICAgICB2YXIgdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLmlzUGF1c2VkKSB7XG4gICAgICAgICAgICAvL0FscmVhZHkgcGF1c2VkLCBzbyBzdGFydCB0aGUgZ2FtZVxuICAgICAgICAgICAgdGhpcy5zdGFydFBsYXkoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtpbGxHYW1lSW50ZXJ2YWwoKTtcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IHRydWU7XG5cbiAgICAgICAgLy8gU2hvdyB0aGUgcGF1c2VkIG1vZGFsIG1lc3NhZ2UgKGZyb20gdGVtcGxhdGUpXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXCJwYXVzZWRcIik7XG5cbiAgICAgICAgJChcImJ1dHRvbiN0ZXRyanMtcGF1c2UtcGxheVwiKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRQbGF5KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdhbWUgb3ZlciBvY2N1cnJlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIGdhbWVPdmVyKCkge1xuICAgICAgICB2YXIgdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIFN0b3AgdGhlIGdhbWUgaW50ZXJ2YWxcbiAgICAgICAgdGhpcy5raWxsR2FtZUludGVydmFsKCk7XG5cbiAgICAgICAgdmFyIHRlbXBsYXRlX3ZhcnMgPSB7XG4gICAgICAgICAgICBzY29yZTogdGhpcy5jdXJyZW50R2FtZVtcInNjb3JlXCJdLFxuICAgICAgICAgICAgcm93c0VsaW1pbmF0ZWQ6IHRoaXMuY3VycmVudEdhbWVbXCJyb3dzRWxpbWluYXRlZFwiXSxcbiAgICAgICAgICAgIGxldmVsOiB0aGlzLmN1cnJlbnRHYW1lW1wibGV2ZWxcIl1cbiAgICAgICAgfTtcbiAgICAgICAgLy8gU2hvdyB0aGUgZ2FtZW92ZXIgbW9kYWwgbWVzc2FnZSAoZnJvbSB0ZW1wbGF0ZSlcbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZShcImdhbWVvdmVyXCIsIHRlbXBsYXRlX3ZhcnMpO1xuXG4gICAgICAgICQoXCJidXR0b24jdGV0cmpzLWdhbWVvdmVyLW5ld2dhbWVcIikuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLm5ld0dhbWUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dXAgYSBuZXcgZ2FtZVxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICoqL1xuICAgIG5ld0dhbWUoKSB7XG4gICAgICAgIC8vIFN0b3AgdGhlIGdhbWUgaW50ZXJ2YWxcbiAgICAgICAgdGhpcy5raWxsR2FtZUludGVydmFsKCk7XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIHRoZSBzY29yZSwgbGV2ZWwsIGFuZCBpbnRlcnZhbFxuICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLnNjb3JlID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50R2FtZS5sZXZlbCA9IDE7XG4gICAgICAgIHRoaXMuZ2FtZUludGVydmFsVGltZXIubXMgPSBTRVRUSU5HUy5HQU1FX0lOVEVSVkFMX01TO1xuXG4gICAgICAgIC8vIFJlc2V0IHRoZSBzY29yZSBhbmQgbGV2ZWwgdGV4dFxuICAgICAgICB0aGlzLnNldFNjb3JlVGV4dCgpO1xuICAgICAgICB0aGlzLnNldExldmVsVGV4dCgpO1xuXG4gICAgICAgIC8vIFNldHVwIHRoZSBtYWluIGFuZCBwcmV2aWV3IGJvYXJkc1xuICAgICAgICB0aGlzLnNldHVwQm9hcmQoKTtcbiAgICAgICAgdGhpcy5zZXR1cFByZXZpZXdCb2FyZCgpO1xuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgb2xkIHByZXZpZXcgcGllY2UgdHlwZVxuICAgICAgICB0aGlzLnByZXZpZXdQaWVjZS50eXBlID0gXCJcIjtcblxuICAgICAgICAvLyBTdGFydCB0aGUgZ2FtZVxuICAgICAgICB0aGlzLnN0YXJ0UGxheSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIGludHJvZHVjdGlvbiBtZXNzYWdlO1xuICAgICAqIHNob3VsZCBiZSBydW4gd2hlbiBnYW1lIGxvYWRzLlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICoqL1xuICAgIHNob3dJbnRybygpIHtcbiAgICAgICAgdmFyIHRoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnNldHVwQm9hcmQoKTtcbiAgICAgICAgdGhpcy5zZXR1cFByZXZpZXdCb2FyZCgpO1xuXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXCJpbnRyb1wiKTtcbiAgICAgICAgJChcImJ1dHRvbiN0ZXRyanMtaW50cm8tbmV3Z2FtZVwiKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMubmV3R2FtZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBBYm91dCBQb3BvdmVyXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzaG93QWJvdXQoKSB7XG4gICAgICAgIHZhciB0aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLmtpbGxHYW1lSW50ZXJ2YWwoKTtcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZShcImFib3V0XCIpO1xuICAgICAgICAkKFwiYnV0dG9uI3RldHJqcy1hYm91dC1jbG9zZVwiKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRQbGF5KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgYSBtZXNzYWdlIGluIHRoZSBtb2RhbCB3aW5kb3cuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzaG93TWVzc2FnZSh0ZW1wbGF0ZV9uYW1lLCB2YXJzKSB7XG4gICAgICAgIHZhciAkbW9kYWwgPSAkKHRoaXMuRE9NX0lEUy5NT0RBTCk7XG4gICAgICAgIHZhciAkdmVpbCA9ICQodGhpcy5ET01fSURTLk1PREFMX1ZFSUwpO1xuXG4gICAgICAgIHZhciBodG1sID0gdGVtcGxhdGVzW3RlbXBsYXRlX25hbWVdLnJlbmRlcih2YXJzKTtcblxuICAgICAgICAkbW9kYWwuaHRtbChodG1sKTtcblxuICAgICAgICAvL0NlbnRlciB0aGUgbWVzc2FnZSBpbiB0aGUgdmVpbFxuICAgICAgICB2YXIgbGVmdE9mZnNldCA9IE1hdGguZmxvb3IoKCR2ZWlsLndpZHRoKCkgLSAkbW9kYWwub3V0ZXJXaWR0aCgpKSAvIDIpO1xuICAgICAgICB2YXIgdG9wT2Zmc2V0ID0gTWF0aC5mbG9vcigoJHZlaWwuaGVpZ2h0KCkgLSAkbW9kYWwub3V0ZXJIZWlnaHQoKSkgLyAyKTtcblxuICAgICAgICAkbW9kYWwuY3NzKFwibGVmdFwiLCBsZWZ0T2Zmc2V0KTtcbiAgICAgICAgJG1vZGFsLmNzcyhcInRvcFwiLCB0b3BPZmZzZXQpO1xuXG4gICAgICAgICR2ZWlsLmZhZGVJbigyMDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJG1vZGFsLmZhZGVJbigyMDApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIaWRlIHRoZSBtb2RhbCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgaGlkZU1lc3NhZ2UoKSB7XG4gICAgICAgIHZhciAkbW9kYWwgPSAkKHRoaXMuRE9NX0lEUy5NT0RBTCk7XG4gICAgICAgIHZhciAkdmVpbCA9ICQodGhpcy5ET01fSURTLk1PREFMX1ZFSUwpO1xuICAgICAgICAkbW9kYWwuZmFkZU91dCgxMDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHZlaWwuaGlkZSgpO1xuXG4gICAgICAgICAgICAvL0NsZWFyIGFmdGVyIHRoZSBmYWRlXG4gICAgICAgICAgICAkbW9kYWwuaHRtbChcIlwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIHRldHJqcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdHJpbmcgY29udGFpbmVySUQgVGhlIGNvbnRhaW5lciBpZCBmb3IgdGV0cmpzLlxuICAgICAqL1xuICAgIHJ1bihjb250YWluZXJJRCkge1xuICAgICAgICB2YXIgdGhpcyA9IHRoaXM7XG4gICAgICAgICQoXCIjXCIgKyBjb250YWluZXJJRCkuaHRtbCh0ZW1wbGF0ZXNbXCJjb250YWluZXJcIl0ucmVuZGVyKCkpO1xuXG4gICAgICAgICQoXCJidXR0b24jdGV0cmpzLWJ1dHRvbi1wYXVzZVwiKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2VHYW1lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoXCJidXR0b24jdGV0cmpzLWJ1dHRvbi1uZXdcIikuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLm5ld0dhbWUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChcImJ1dHRvbiN0ZXRyanMtYnV0dG9uLWFib3V0XCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zaG93QWJvdXQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zZXR1cEtleUV2ZW50cygpO1xuXG4gICAgICAgIHRoaXMuc2hvd0ludHJvKCk7XG4gICAgfVxufVxuIl0sImZpbGUiOiJpbmRleC5qcyJ9

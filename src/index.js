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
/**
 * The constructor.
 * Initializes the basic configuration values.
 * @return void
 */
export default class Tetrjs {
    board = {};

    isPaused = false;

    SETTINGS = {
        BOARD_COLS_WIDE: 10,
        BOARD_ROWS_HIGH: 18,
        PIECE_START_COL: 4,
        PIECE_START_ROW: 1,
        PIECE_START_POS: 1,
        GAME_INTERVAL_MS: 460,
        GAME_SCORE_MULTIPLIER: 100,
        CELL_WIDTH_PX: 20,
        CELL_HEIGHT_PX: 20
    };

    DOM_IDS = {
        BOARD: "#tetrjs-board",
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
        row: this.SETTINGS.PIECE_START_ROW,
        col: this.SETTINGS.PIECE_START_COL,
        position: this.SETTINGS.PIECE_START_POS
    };

    previewPiece = {
        type: "",
        class: "",
        blocks: []
    };

    gameIntervalTimer = {
        obj: false,
        ms: this.SETTINGS.GAME_INTERVAL_MS
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
        var $tetrjsBoard = $(this.DOM_IDS.BOARD);

        // Clear the board
        $tetrjsBoard.html("");
        this.board = {};

        // Set the board size
        $tetrjsBoard.width(
            this.SETTINGS.BOARD_COLS_WIDE * this.SETTINGS.CELL_WIDTH_PX
        );
        $tetrjsBoard.height(
            this.SETTINGS.BOARD_ROWS_HIGH * this.SETTINGS.CELL_HEIGHT_PX
        );

        for (let i = 1; i <= this.SETTINGS.BOARD_ROWS_HIGH; i++) {
            this.board[i] = {};
            var top_pos = (i - 1) * this.SETTINGS.CELL_HEIGHT_PX;
            for (let j = 1; j <= this.SETTINGS.BOARD_COLS_WIDE; j++) {
                // Setup the object for storing block positions
                this.board[i][j] = {};

                // Calculate left px position of the cell
                var left_pos = (j - 1) * this.SETTINGS.CELL_WIDTH_PX;

                // Add the block to the board
                var tmp_pos =
                    " style='left:" + left_pos + "px; top:" + top_pos + "px;' ";
                var tmp_div =
                    "<div class='" +
                    this.DOM_CLASSES.BOARD_BLOCK +
                    "' id='tb_" +
                    j +
                    "_" +
                    i +
                    "' " +
                    tmp_pos +
                    "></div>";
                $tetrjsBoard.append(tmp_div);
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
        $previewBoard.innerHTML = "";
        $previewBoard.style.width =
            (preview_sections_wide * this.SETTINGS.CELL_WIDTH_PX).toString() +
            "px";
        $previewBoard.style.height =
            (preview_sections_high * this.SETTINGS.CELL_HEIGHT_PX).toString() +
            "px";

        for (let i = 1; i <= preview_sections_high; i++) {
            var top_pos = (i - 1) * this.SETTINGS.CELL_HEIGHT_PX;
            for (let j = 1; j <= preview_sections_wide; j++) {
                var left_pos = (j - 1) * this.SETTINGS.CELL_WIDTH_PX;
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
        var self = this;
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
        var tmp_lowest_col = this.SETTINGS.BOARD_COLS_WIDE;
        var tmp_lowest_row = this.SETTINGS.BOARD_ROWS_HIGH;

        var error = false;
        var curr_block_position_rows =
            BLOCKS[this.currentBlock.type]["positions"][desired_position][
                "rows"
            ];
        $.each(curr_block_position_rows, function(row_index, row) {
            //Loop over the columns in each row
            $.each(row, function(col_index, col_is_active) {
                if (col_is_active == 1) {
                    var tmp_piece_col_pos =
                        self.currentBlock.col + parseInt(col_index);
                    var tmp_piece_row_pos =
                        self.currentBlock.row + parseInt(row_index);

                    var tmp_piece_desired_col =
                        tmp_piece_col_pos + curr_block_pos_trans_col;
                    var tmp_piece_desired_row =
                        tmp_piece_row_pos + curr_block_pos_trans_row;

                    if (desired_direction == "none") {
                        if (
                            self.board[tmp_piece_desired_row][
                                tmp_piece_desired_col
                            ].hasOwnProperty("class")
                        ) {
                            // New piece but a space is already taken
                            self.gameOver();
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
                                self.SETTINGS.BOARD_ROWS_HIGH ||
                            self.board[tmp_piece_desired_row][
                                tmp_piece_desired_col
                            ].hasOwnProperty("class")
                        ) {
                            // Already a block in the next downward position
                            lock_current_block = true;
                        }
                    }

                    if (!self.board.hasOwnProperty(tmp_piece_desired_row)) {
                        //Can't move down, so error
                        error = true;
                    } else if (
                        !self.board[tmp_piece_desired_row].hasOwnProperty(
                            tmp_piece_desired_col
                        )
                    ) {
                        //Off the board error out
                        error = true;
                    } else if (
                        self.board[tmp_piece_desired_row][
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
            });
        });

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
                var self = this;
                // Apply the 'movement' by modifying the block's class
                $.each(tmp_desired_positions, function(pos_index, pos) {
                    var tmp_id = "#tb_" + pos["col"] + "_" + pos["row"];
                    var jTMP = $(tmp_id);
                    jTMP.addClass(self.currentBlock.class);
                    self.currentBlock.blockIds.push(tmp_id);
                    self.currentBlock.blockPositions.push(pos);
                });
            }
        }

        // The block has reached its final destination
        if (lock_current_block) {
            var self = this;
            $.each(this.currentBlock.blockPositions, function(pos_index, pos) {
                // Lock the current block on the board
                // by setting the permanent board class
                self.board[pos["row"]][pos["col"]] = {
                    class: self.currentBlock.class
                };
            });

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
        var self = this;

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
            if (column_full_count == self.SETTINGS.BOARD_COLS_WIDE) {
                no_rows_eliminated++;

                //Move the upper rows down, from the bottom up
                for (var i = r_index; i >= 1; i--) {
                    $.each(self.board[i], function(c_index, col) {
                        var prev_class = "";
                        if (
                            self.board.hasOwnProperty(i - 1) &&
                            self.board[i - 1][c_index].hasOwnProperty("class")
                        ) {
                            // The class from the block directly above
                            prev_class = self.board[i - 1][c_index]["class"];
                        }

                        var cur_id = "#tb_" + c_index + "_" + i;
                        var jCur = $(cur_id);

                        if (col.hasOwnProperty("class")) {
                            jCur.removeClass(col["class"]);
                        }

                        if (prev_class != "") {
                            //Copy down the class from above to the block in this row
                            jCur.addClass(prev_class);
                            self.board[i][c_index] = { class: prev_class };
                        } else {
                            //Blank block (no block above)
                            self.board[i][c_index] = {};
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
            this.SETTINGS.GAME_SCORE_MULTIPLIER * this.currentGame.level;

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

        if (this.currentGame.rowsEliminated == this.SETTINGS.BOARD_ROWS_HIGH) {
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
        var self = this;
        $.each(this.currentBlock.blockIds, function(index, block_id) {
            $(block_id).removeClass(self.currentBlock.class);
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
        this.currentBlock.col = this.SETTINGS.PIECE_START_COL;

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
        var self = this;
        $(document).keydown(function(e) {
            switch (e.which) {
                case 37:
                    // Left arrow key
                    self.moveBlock("left");
                    break;

                case 38:
                    // Up arrow key
                    self.moveBlock("up");
                    break;

                case 39:
                    // Right arrow key
                    self.moveBlock("right");
                    break;

                case 40:
                    // Down arrow key
                    self.moveBlock("down");
                    break;

                case 80:
                    // 'p' pressed to pause
                    self.pauseGame();
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
            var self = this;

            // Setup the interval object using the std js function
            this.gameIntervalTimer.obj = setInterval(function() {
                //Start the action (just move the current piece down)
                self.moveBlock("down");
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
        var self = this;
        if (self.isPaused) {
            //Already paused, so start the game
            self.startPlay();
            return;
        }
        self.killGameInterval();
        self.isPaused = true;

        // Show the paused modal message (from template)
        self.showMessage("paused");

        $("button#tetrjs-pause-play").click(function() {
            self.startPlay();
        });
    }

    /**
     * Game over occurred.
     *
     * @return void
     */
    gameOver() {
        var self = this;
        self.isPaused = true;

        // Stop the game interval
        self.killGameInterval();

        var template_vars = {
            score: self.currentGame["score"],
            rowsEliminated: self.currentGame["rowsEliminated"],
            level: self.currentGame["level"]
        };
        // Show the gameover modal message (from template)
        self.showMessage("gameover", template_vars);

        $("button#tetrjs-gameover-newgame").click(function() {
            self.newGame();
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
        this.gameIntervalTimer.ms = this.SETTINGS.GAME_INTERVAL_MS;

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
        var self = this;
        self.setupBoard();
        self.setupPreviewBoard();

        self.showMessage("intro");
        $("button#tetrjs-intro-newgame").click(function() {
            self.newGame();
        });
    }

    /**
     * Show the About Popover
     *
     * @return void
     */
    showAbout() {
        var self = this;

        self.killGameInterval();
        self.isPaused = true;

        self.showMessage("about");
        $("button#tetrjs-about-close").click(function() {
            self.startPlay();
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
        var self = this;
        $("#" + containerID).html(templates["container"].render());

        $("button#tetrjs-button-pause").click(function() {
            self.pauseGame();
        });

        $("button#tetrjs-button-new").click(function() {
            self.newGame();
        });

        $("button#tetrjs-button-about").click(function() {
            self.showAbout();
        });

        this.setupKeyEvents();

        this.showIntro();
    }
}

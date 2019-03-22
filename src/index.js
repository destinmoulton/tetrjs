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
        LEVEL_CONTAINER: "tetrjs-level-container",
        MODAL: "tetrjs-modal",
        MODAL_VEIL: "tetrjs-modal-veil"
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
        for (let row_index = 0; row_index < rowKeys.length; row_index++) {
            const row = curr_block_position_rows[row_index];
            const colKeys = Object.keys(row);
            for (let col_index = 0; col_index < colKeys.length; col_index++) {
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
                            tmp_piece_desired_row > SETTINGS.BOARD_ROWS_HIGH ||
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
                for (let pos of tmp_desired_positions) {
                    var tmp_id = `tb_${pos["col"]}_${pos["row"]}`;
                    var jTMP = document.getElementById(tmp_id);
                    util.addClass(jTMP, this.currentBlock.class);
                    this.currentBlock.blockIds.push(tmp_id);
                    this.currentBlock.blockPositions.push(pos);
                }
            }
        }

        // The block has reached its final destination
        if (lock_current_block) {
            for (let pos of this.currentBlock.blockPositions) {
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
        const rowKeys = Object.keys(this.board);
        for (let r_index of rowKeys) {
            const row = this.board[r_index];
            var column_full_count = 0;

            //Loop over the columns in this row
            const colKeys = Object.keys(row);
            for (let col_index of colKeys) {
                const col = row[col_index];
                // A class indicates the column in this row is full
                if (col.hasOwnProperty("class")) {
                    column_full_count++;
                }
            }

            // The entire row is full
            if (column_full_count === SETTINGS.BOARD_COLS_WIDE) {
                no_rows_eliminated++;

                //Move the upper rows down, from the bottom up
                for (var i = r_index; i >= 1; i--) {
                    const colKeys = Object.keys(this.board[i]);
                    for (let c_index of colKeys) {
                        const col = row[c_index];
                        var prev_class = "";
                        if (
                            this.board.hasOwnProperty(i - 1) &&
                            this.board[i - 1][c_index].hasOwnProperty("class")
                        ) {
                            // The class from the block directly above
                            prev_class = this.board[i - 1][c_index]["class"];
                        }

                        var jCur = document.getElementById(
                            `tb_${c_index}_${i}`
                        );

                        if (col.hasOwnProperty("class")) {
                            util.removeClass(jCur, col["class"]);
                        }

                        if (prev_class != "") {
                            //Copy down the class from above to the block in this row
                            util.addClass(jCur, prev_class);
                            this.board[i][c_index] = { class: prev_class };
                        } else {
                            //Blank block (no block above)
                            this.board[i][c_index] = {};
                        }
                    }
                }
            }
        }

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
        const el = document.getElementById(this.DOM_IDS.LEVEL_CONTAINER);
        el.innerText = "LEVEL " + this.currentGame.level;
    }

    /**
     * Remove the current block from the board
     *
     * @return void
     */
    removeCurrentBlockFromBoard() {
        //Remove the current class from the visible blocks
        for (let block_id of this.currentBlock.blockIds) {
            const block = document.getElementById(block_id);
            util.removeClass(block, this.currentBlock.class);
        }

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
        document.addEventListener("keydown", e => {
            switch (e.keyCode) {
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
            // Setup the interval object using the std js function
            this.gameIntervalTimer.obj = setInterval(() => {
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
        if (this.isPaused) {
            //Already paused, so start the game
            this.startPlay();
            return;
        }
        this.killGameInterval();
        this.isPaused = true;

        // Show the paused modal message (from template)
        this.showMessage("paused");
        const button = document.getElementById("tetrjs-pause-play");
        button.addEventListener("click", ev => {
            this.startPlay();
        });
    }

    /**
     * Game over occurred.
     *
     * @return void
     */
    gameOver() {
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
        const button = document.getElementById("tetrjs-gameover-newgame");
        button.addEventListener("click", e => {
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
        this.setupBoard();
        this.setupPreviewBoard();

        this.showMessage("intro");
        const button = document.getElementById("tetrjs-intro-newgame");
        button.addEventListener("click", e => {
            this.newGame();
        });
    }

    /**
     * Show the About Popover
     *
     * @return void
     */
    showAbout() {
        this.killGameInterval();
        this.isPaused = true;

        this.showMessage("about");
        const button = document.getElementById("tetrjs-about-close");
        button.addEventListener("click", e => {
            this.startPlay();
        });
    }

    /**
     * Show a message in the modal window.
     *
     * @return void
     */
    showMessage(template_name, vars) {
        var $modal = document.getElementById(this.DOM_IDS.MODAL);
        var $veil = document.getElementById(this.DOM_IDS.MODAL_VEIL);

        var html = templates[template_name].render(vars);

        $modal.innerHTML = html;

        //Center the message in the veil
        var leftOffset = Math.floor(
            ($veil.style.width - util.outerWidth($modal)) / 2
        );
        var topOffset = Math.floor(
            ($veil.style.height - util.outerHeight($modal)) / 2
        );

        $modal.style.left = leftOffset + "px";
        $modal.style.top = topOffset + "px";

        util.fadeIn($veil, () => {});
        util.fadeIn($modal, () => {});
    }

    /**
     * Hide the modal message.
     *
     * @return void
     */
    hideMessage() {
        var $modal = document.getElementById(this.DOM_IDS.MODAL);
        var $veil = document.getElementById(this.DOM_IDS.MODAL_VEIL);
        util.fadeOut($modal, () => {
            //Clear after the fade
            $modal.innerHTML = "";
        });
        util.fadeOut($veil, () => {});
    }

    /**
     * Run tetrjs.
     *
     * @param string containerID The container id for tetrjs.
     */
    run(containerID) {
        const el = document.getElementById(containerID);
        el.innerHTML = templates["container"].render();

        const button = document.getElementById("tetrjs-button-pause");
        button.addEventListener("click", e => {
            this.pauseGame();
        });

        const newButton = document.getElementById("tetrjs-button-new");
        newButton.addEventListener("click", e => {
            this.newGame();
        });

        const about = document.getElementById("tetrjs-button-about");
        about.addEventListener("click", e => {
            this.showAbout();
        });

        this.setupKeyEvents();

        this.showIntro();
    }
}

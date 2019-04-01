(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('Tetrjs', factory) :
  (global = global || self, global.Tetrjs = factory());
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  /**
   * Determine if an element has a class.
   *
   * @param {HTMLElement} ele
   * @param {string} cls
   */
  function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
  }
  /**
   * Add a class to an element.
   *
   * @param {HTMLElement} ele
   * @param {string} cls
   */


  function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += " " + cls;
  }
  /**
   * Remove a class from an element
   *
   * @param {HTMLElement} ele
   * @param {string} cls
   */


  function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
      var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
      ele.className = ele.className.replace(reg, " ");
    }
  }
  /**
   * https://stackoverflow.com/a/6121270
   * @param {HTMLElement} element
   * @param {function} cb
   */


  function fadeIn(element, cb) {
    var op = 0.1; // initial opacity

    element.style.display = "block";
    var timer = setInterval(function () {
      if (op >= 0.5) {
        clearInterval(timer);
        return cb();
      }

      element.style.opacity = op;
      element.style.filter = "alpha(opacity=" + op * 100 + ")";
      op += op * 0.1;
    }, 10);
  }
  /**
   * https://stackoverflow.com/a/6121270
   * @param {HTMLElement} element
   * @param {function} cb
   */


  function fadeOut(element, cb) {
    var op = 1; // initial opacity

    var timer = setInterval(function () {
      if (op <= 0.1) {
        clearInterval(timer);
        element.style.display = "none";
        return cb();
      }

      element.style.opacity = op;
      element.style.filter = "alpha(opacity=" + op * 100 + ")";
      op -= op * 0.1;
    }, 10);
  }

  var util = {
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    fadeIn: fadeIn,
    fadeOut: fadeOut,
    outerHeight: outerHeight,
    outerWidth: outerWidth
  };

  /*
   * Defines the Tetrjs block types and their
   * possible positions.
   *
   * @author Destin Moulton
   * @version 1.0
   * @license MIT
   *
   *
   * The BLOCKS object is keyed to the block names defined in BLOCK_TYPES.
   *
   * Each BLOCK is composed of:
   * 'class': The css class for the active blocks.
   * 'no_positions': The number of possible positions for a block.
   * 'positions': Object to store the different block positions
   *    'trans_row': the row where the block is "rotated" for a position
   *    'trans_col': the col where the block is "rotated" for a position
   *    'rows': the rows that form the block.
   *            - Each row is an object in {column:boolean, ...} format
   *              i.e. Straight blocks in the 1st (0th) position are
   *                   active in all 4 columns: {0:1, 1:1, 2:1, 3:1}
   *
   */
  var BLOCK_TYPES = ["STRAIGHT", "L_LEFT", "L_RIGHT", "SQUARE", "S", "Z", "T"];
  var BLOCKS = {
    STRAIGHT: {
      class: "tetrjs-block-straight",
      no_positions: 2,
      positions: [{
        trans_row: 1,
        trans_col: -1,
        rows: [[1, 1, 1, 1]]
      }, {
        trans_row: -1,
        trans_col: 1,
        rows: [[1], [1], [1], [1]]
      }]
    },
    L_LEFT: {
      class: "tetrjs-block-l-left",
      no_positions: 4,
      positions: [{
        trans_row: 1,
        trans_col: -1,
        rows: [[1, 1, 1], [0, 0, 1]]
      }, {
        trans_row: -1,
        trans_col: 0,
        rows: [[0, 1], [0, 1], [1, 1]]
      }, {
        trans_row: 0,
        trans_col: 0,
        rows: [[1, 0, 0], [1, 1, 1]]
      }, {
        trans_row: 0,
        trans_col: 1,
        rows: [[1, 1], [1, 0], [1, 0]]
      }]
    },
    L_RIGHT: {
      class: "tetrjs-block-l-right",
      no_positions: 4,
      positions: [{
        trans_row: 1,
        trans_col: -1,
        rows: [[1, 1, 1], [1, 0, 0]]
      }, {
        trans_row: -1,
        trans_col: 0,
        rows: [[1, 1], [0, 1], [0, 1]]
      }, {
        trans_row: 0,
        trans_col: 0,
        rows: [[0, 0, 1], [1, 1, 1]]
      }, {
        trans_row: 0,
        trans_col: 1,
        rows: [[1, 0], [1, 0], [1, 1]]
      }]
    },
    SQUARE: {
      class: "tetrjs-block-square",
      no_positions: 1,
      positions: [{
        trans_row: 0,
        trans_col: 0,
        rows: [[1, 1], [1, 1]]
      }]
    },
    S: {
      class: "tetrjs-block-s",
      no_positions: 2,
      positions: [{
        trans_row: 1,
        trans_col: 0,
        rows: [[0, 1, 1], [1, 1, 0]]
      }, {
        trans_row: -1,
        trans_col: 0,
        rows: [[1, 0], [1, 1], [0, 1]]
      }]
    },
    Z: {
      class: "tetrjs-block-z",
      no_positions: 2,
      positions: [{
        trans_row: 1,
        trans_col: 0,
        rows: [[1, 1, 0], [0, 1, 1]]
      }, {
        trans_row: -1,
        trans_col: 0,
        rows: [[0, 1], [1, 1], [1, 0]]
      }]
    },
    T: {
      class: "tetrjs-block-t",
      no_positions: 4,
      positions: [{
        trans_row: 1,
        trans_col: -1,
        rows: [[1, 1, 1], [0, 1, 0]]
      }, {
        trans_row: -1,
        trans_col: 0,
        rows: [[0, 1], [1, 1], [0, 1]]
      }, {
        trans_row: 0,
        trans_col: 0,
        rows: [[0, 1, 0], [1, 1, 1]]
      }, {
        trans_row: 0,
        trans_col: 1,
        rows: [[1, 0], [1, 1], [1, 0]]
      }]
    }
  };

  var SETTINGS = {
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

  var about = function about() {
    return "\n    Tetrjs is a Tetris clone written in JavaScript.\n    <br />\n    <br />\n    Tetrjs was written by\n    <a href=\"https://destinmoulton.com\" target=\"_blank\">Destin Moulton</a>.\n    <br />\n    <br />\n    Available on\n    <a href=\"https://github.com/destinmoulton/tetrjs\" target=\"_blank\">GitHub</a>.\n    <br />\n    Open source under the\n    <a href=\"https://en.wikipedia.org/wiki/MIT_License\">MIT License</a>.\n    <br />\n    <br />\n    <button type=\"button\" id=\"tetrjs-about-close\">Resume Game</button>\n";
  };

  var container = function container() {
    return "\n    <!-- The Game Container -->\n    <div id=\"tetrjs-container\">\n        <div id=\"tetrjs-title-container\">Tetrjs</div>\n        <div id=\"tetrjs-board-wrapper\"><div id=\"tetrjs-board\"></div></div>\n        <div id=\"tetrjs-next-piece-preview-container\"></div>\n        <div id=\"tetrjs-score-container\"></div>\n        <div id=\"tetrjs-level-container\"></div>\n        <div id=\"tetrjs-actions-container\">\n            <br />\n            <button id=\"tetrjs-button-pause\">\n                <div class=\"button-text\">Pause</div>\n            </button>\n            <br />\n            <br />\n            <button id=\"tetrjs-button-new\">New Game</button>\n            <br />\n            <br />\n            <button id=\"tetrjs-button-about\">\n                About Tetrjs\n            </button>\n        </div>\n        <div id=\"tetrjs-modal-veil\"></div>\n        <div id=\"tetrjs-modal\"></div>\n    </div>\n";
  };

  var gameover = function gameover(_ref) {
    var score = _ref.score,
        rowsEliminated = _ref.rowsEliminated,
        level = _ref.level;
    return "\n    Game Over! <br /><br />\n    <table border=\"0\" id=\"tetrjs-gameover-table\">\n        <tbody>\n            <tr>\n                <td><strong>Score:</strong></td>\n                <td>".concat(score, "</td>\n            </tr>\n            <tr>\n                <td><strong>Lines:</strong></td>\n                <td>").concat(rowsEliminated, "</td>\n            </tr>\n            <tr>\n                <td><strong>Level:</strong></td>\n                <td>").concat(level, "</td>\n            </tr>\n        </tbody>\n    </table>\n    <br />\n    <button id=\"tetrjs-gameover-newgame\">New Game</button>\n");
  };

  var intro = function intro() {
    return "\n    <button type=\"button\" id=\"tetrjs-intro-newgame\">\n        <span>\u25B6</span>&nbsp;&nbsp;Play Tetrjs!\n    </button>\n\n    <br /><br />\n    Arrow keys control the pieces.\n";
  };

  var paused = function paused() {
    return "\n    Paused...\n    <br />\n    <br />\n    <button type=\"button\" id=\"tetrjs-pause-play\">\n        <span class=\"\">\u25B6</span>&nbsp;&nbsp;Resume\n    </button>\n    <br />\n    <br />Tip: Press <b>P</b> key to pause/resume.\n";
  };

  var templates = {
    about: about,
    container: container,
    gameover: gameover,
    intro: intro,
    paused: paused
  };

  /**
   * The constructor.
   * Initializes the basic configuration values.
   * @return void
   */

  var Tetrjs =
  /*#__PURE__*/
  function () {
    function Tetrjs() {
      _classCallCheck(this, Tetrjs);

      _defineProperty(this, "board", []);

      _defineProperty(this, "isPaused", false);

      _defineProperty(this, "DOM_IDS", {
        BOARD_WRAPPER: "tetrjs-board-wrapper",
        BOARD: "tetrjs-board",
        PREVIEW_CONTAINER: "tetrjs-next-piece-preview-container",
        SCORE_CONTAINER: "tetrjs-score-container",
        LEVEL_CONTAINER: "tetrjs-level-container",
        MODAL: "tetrjs-modal",
        MODAL_VEIL: "tetrjs-modal-veil"
      });

      _defineProperty(this, "DOM_CLASSES", {
        BOARD_BLOCK: "tetrjs-board-block"
      });

      _defineProperty(this, "currentBlock", {
        type: "",
        blockIds: [],
        blockPositions: [],
        class: "",
        row: SETTINGS.PIECE_START_ROW,
        col: SETTINGS.PIECE_START_COL,
        position: SETTINGS.PIECE_START_POS
      });

      _defineProperty(this, "previewPiece", {
        type: "",
        class: "",
        blocks: []
      });

      _defineProperty(this, "gameIntervalTimer", {
        obj: false,
        ms: SETTINGS.GAME_INTERVAL_MS
      });

      _defineProperty(this, "currentGame", {
        score: 0,
        rowsEliminated: 0,
        level: 1
      });
    }

    _createClass(Tetrjs, [{
      key: "setupBoard",

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
      value: function setupBoard() {
        var elBoard = document.getElementById(this.DOM_IDS.BOARD);
        var elWrapper = document.getElementById(this.DOM_IDS.BOARD_WRAPPER); // Clear the board

        elBoard.innerHTML = "";
        this.board = {}; // Set the board size

        var boardWidth = SETTINGS.BOARD_COLS_WIDE * SETTINGS.CELL_WIDTH_PX;
        var boardHeight = SETTINGS.BOARD_ROWS_HIGH * SETTINGS.CELL_HEIGHT_PX;
        elBoard.style.width = "".concat(boardWidth, "px");
        elBoard.style.height = "".concat(boardHeight, "px");

        for (var i = 0; i < SETTINGS.BOARD_ROWS_HIGH; i++) {
          this.board[i] = [];
          var top_pos = i * SETTINGS.CELL_HEIGHT_PX;

          for (var j = 0; j < SETTINGS.BOARD_COLS_WIDE; j++) {
            // Setup the object for storing block positions
            this.board[i][j] = {}; // Calculate left px position of the cell

            var left_pos = j * SETTINGS.CELL_WIDTH_PX; // Add the block to the board

            var block = document.createElement("div");
            block.style.left = left_pos.toString() + "px";
            block.style.top = top_pos.toString() + "px";
            block.className = this.DOM_CLASSES.BOARD_BLOCK;
            block.setAttribute("id", "tb_".concat(j, "_").concat(i));
            elBoard.appendChild(block);
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

    }, {
      key: "setupPreviewBoard",
      value: function setupPreviewBoard() {
        var elPreviewBoard = document.getElementById(this.DOM_IDS.PREVIEW_CONTAINER);
        var preview_sections_wide = 6;
        var preview_sections_high = 4; // Clear the board

        var boardWidth = preview_sections_wide * SETTINGS.CELL_WIDTH_PX;
        var boardHeight = preview_sections_high * SETTINGS.CELL_HEIGHT_PX;
        elPreviewBoard.innerHTML = "";
        elPreviewBoard.style.width = "".concat(boardWidth, "px");
        elPreviewBoard.style.height = "".concat(boardHeight, "px");

        for (var i = 0; i < preview_sections_high; i++) {
          var topPos = i * SETTINGS.CELL_HEIGHT_PX;

          for (var j = 0; j < preview_sections_wide; j++) {
            var leftPos = j * SETTINGS.CELL_WIDTH_PX;
            var block = document.createElement("div");
            block.style.top = topPos + "px";
            block.style.left = leftPos + "px";
            block.className = this.DOM_CLASSES.BOARD_BLOCK;
            block.setAttribute("id", "tp_".concat(j, "_").concat(i));
            elPreviewBoard.appendChild(block);
          }
        }
      }
      /**
       * Get a random block type.
       *
       * @return string Block type
       */

    }, {
      key: "generateRandomBlockType",
      value: function generateRandomBlockType() {
        return BLOCK_TYPES[Math.floor(Math.random() * BLOCK_TYPES.length)];
      }
      /**
       * Make the preview block in the preview board.
       *
       * @return void
       */

    }, {
      key: "makePreviewPiece",
      value: function makePreviewPiece() {
        if (this.isPaused) {
          return;
        } //Remove the current block from the preview


        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.previewPiece.blocks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var block_id = _step.value;
            var block = document.getElementById(block_id);
            block.classList.remove(this.previewPiece.class);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.previewPiece.blocks = []; //Get a random block

        this.previewPiece.type = this.generateRandomBlockType();
        this.previewPiece.class = BLOCKS[this.previewPiece.type]["class"];
        var startCol = 1;
        var startRow = 1;
        var blockRows = BLOCKS[this.previewPiece.type]["positions"][0]["rows"]; // Rows are stored as a matrix

        for (var rowIndex = 0; rowIndex < blockRows.length; rowIndex++) {
          var row = blockRows[rowIndex];

          for (var colIndex = 0; colIndex < row.length; colIndex++) {
            if (row[colIndex] === 1) {
              var blockCol = startCol + colIndex;
              var blockRow = startRow + rowIndex;
              var id = "tp_" + blockCol + "_" + blockRow;
              var el = document.getElementById(id);
              el.classList.add(this.previewPiece.class);
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

    }, {
      key: "moveBlock",
      value: function moveBlock(desiredDirection) {
        var desiredPosition = this.currentBlock.position;
        var blockPositions = BLOCKS[this.currentBlock.type]["positions"];
        var blockNumPositions = BLOCKS[this.currentBlock.type]["no_positions"];
        var blockPosTransRow = 0;
        var blockPosTransCol = 0; // 'up' rotates the block

        if (desiredDirection == "up") {
          desiredPosition = this.currentBlock.position + 1;

          if (desiredPosition > blockNumPositions - 1) {
            //Reset the transition back to 0
            desiredPosition = 0;
          } // The amount to move the desired row and column
          // during the transformation


          blockPosTransRow = blockPositions[desiredPosition]["trans_row"];
          blockPosTransCol = blockPositions[desiredPosition]["trans_col"];
        }

        var blockRows = blockPositions[desiredPosition]["rows"];
        var nextDesiredPosition = [];
        var lockCurrentBlock = false;
        var lowestCol = SETTINGS.BOARD_COLS_WIDE;
        var lowestRow = SETTINGS.BOARD_ROWS_HIGH;
        var positionIsAvailable = true;

        for (var rowIndex = 0; rowIndex < blockRows.length; rowIndex++) {
          var row = blockRows[rowIndex];

          for (var colIndex = 0; colIndex < row.length; colIndex++) {
            if (row[colIndex] === 1) {
              var tmpPieceColPos = this.currentBlock.col + colIndex;
              var tmpPieceRowPos = this.currentBlock.row + rowIndex;
              var desiredCol = tmpPieceColPos + blockPosTransCol;
              var desiredRow = tmpPieceRowPos + blockPosTransRow;

              if (desiredDirection === "none") {
                if (this.board[desiredRow][desiredCol].hasOwnProperty("class")) {
                  // New piece but a space is already taken
                  this.gameOver();
                }
              }

              if (desiredDirection === "left") {
                desiredCol = tmpPieceColPos - 1;
              }

              if (desiredDirection === "right") {
                desiredCol = tmpPieceColPos + 1;
              }

              if (desiredDirection === "down") {
                desiredRow = tmpPieceRowPos + 1;

                if (desiredRow > SETTINGS.BOARD_ROWS_HIGH || !this.doesBoardPositionExist(desiredRow, desiredCol) || this.board[desiredRow][desiredCol].hasOwnProperty("class")) {
                  // Already a block in the next downward position
                  lockCurrentBlock = true;
                }
              }

              if (!this.doesBoardPositionExist(desiredRow, desiredCol) || this.board[desiredRow][desiredCol].hasOwnProperty("class")) {
                // Can't move
                positionIsAvailable = false;
              }

              if (positionIsAvailable) {
                if (desiredCol < lowestCol) {
                  lowestCol = desiredCol;
                }

                if (desiredRow < lowestRow) {
                  lowestRow = desiredRow;
                }

                nextDesiredPosition.push({
                  col: desiredCol,
                  row: desiredRow
                });
              }
            }
          }
        }

        if (positionIsAvailable) {
          if (!lockCurrentBlock) {
            // remove the current piece
            this.removeCurrentBlockFromBoard(); //Set the new current direction

            if (desiredDirection == "up") {
              this.currentBlock.position = desiredPosition;
            } // Set the new current row and column


            this.currentBlock.col = lowestCol;
            this.currentBlock.row = lowestRow; // Apply the 'movement' by modifying the block's class

            for (var i = 0; i < nextDesiredPosition.length; i++) {
              var pos = nextDesiredPosition[i];
              var tmpId = "tb_".concat(pos["col"], "_").concat(pos["row"]);
              var domBlock = document.getElementById(tmpId);
              domBlock.classList.add(this.currentBlock.class);
              this.currentBlock.blockIds.push(tmpId);
              this.currentBlock.blockPositions.push(pos);
            }
          }
        } // The block has reached its final destination


        if (lockCurrentBlock) {
          for (var _i = 0; _i < this.currentBlock.blockPositions.length; _i++) {
            var _pos = this.currentBlock.blockPositions[_i]; // Lock the current block on the board
            // by setting the permanent board class

            this.board[_pos["row"]][_pos["col"]] = {
              class: this.currentBlock.class
            };
          } // Check if the block has caused rows to be eliminated


          this.checkAndEliminateRows(); // Create the next block

          this.nextBlock();
        }
      }
      /**
       * Check if there are any rows to remove
       *
       * @return void
       */

    }, {
      key: "checkAndEliminateRows",
      value: function checkAndEliminateRows() {
        var noRowsEliminated = 0; //Loop over the board rows

        for (var rowIndex = 0; rowIndex < SETTINGS.BOARD_ROWS_HIGH; rowIndex++) {
          var row = this.board[rowIndex];
          var columnFillCount = 0; //Loop over the columns in this row

          for (var colIndex = 0; colIndex < row.length; colIndex++) {
            // A class indicates the column in this row is full
            if (row[colIndex].hasOwnProperty("class")) {
              columnFillCount++;
            }
          } // The entire row is full


          if (columnFillCount === SETTINGS.BOARD_COLS_WIDE) {
            noRowsEliminated++; //Move the upper rows down, from the bottom up

            for (var i = rowIndex; i >= 0; i--) {
              for (var iColIndex = 0; iColIndex < SETTINGS.BOARD_COLS_WIDE; iColIndex++) {
                var aboveClass = "";

                if (this.doesBoardPositionExist(i - 1, iColIndex) && this.board[i - 1][iColIndex].hasOwnProperty("class")) {
                  // The class from the block directly above
                  aboveClass = this.board[i - 1][iColIndex]["class"];
                }

                var el = document.getElementById("tb_".concat(iColIndex.toString(), "_").concat(i.toString()));
                var block = this.board[i][iColIndex];

                if (block.hasOwnProperty("class")) {
                  el.classList.remove(block["class"]);
                }

                if (aboveClass !== "") {
                  //Copy down the class from above to the block in this row
                  el.classList.add(aboveClass);
                  this.board[i][iColIndex] = {
                    class: aboveClass
                  };
                } else {
                  //Blank block (no block above)
                  this.board[i][iColIndex] = {};
                }
              }
            }
          }
        }

        if (noRowsEliminated > 0) {
          // Update the score
          this.score(noRowsEliminated);
        }
      }
      /**
       * Return boolean whether a row and column exist in the board.
       *
       * @param {number} row
       * @param {number} col
       */

    }, {
      key: "doesBoardPositionExist",
      value: function doesBoardPositionExist(row, col) {
        return this.board[row] && this.board[row][col];
      }
      /**
       * Score a move based on the number of rows eliminated
       *
       * @param int no_rows_eliminated The number of rows eliminated.
       * @return void
       */

    }, {
      key: "score",
      value: function score(no_rows_eliminated) {
        var multiple_row_bonus = 0;
        var current_multiplier = SETTINGS.GAME_SCORE_MULTIPLIER * this.currentGame.level;
        this.currentGame.rowsEliminated = this.currentGame.rowsEliminated + no_rows_eliminated;

        if (no_rows_eliminated > 1) {
          // Give users a bonus for eliminating more than one row
          multiple_row_bonus = no_rows_eliminated * (current_multiplier * 0.5);
        }

        this.currentGame.score = this.currentGame.score + no_rows_eliminated * current_multiplier + multiple_row_bonus;
        this.setScoreText();

        if (this.currentGame.rowsEliminated == SETTINGS.BOARD_ROWS_HIGH) {
          // Level up
          this.currentGame.rowsEliminated = 0;
          this.currentGame.level = this.currentGame.level + 1;
          this.setLevelText(); // Increase the speed of the game interval

          this.gameIntervalTimer.ms = this.gameIntervalTimer.ms - 20;
        }
      }
      /**
       * Set the Score text
       *
       * @return void
       */

    }, {
      key: "setScoreText",
      value: function setScoreText() {
        document.getElementById(this.DOM_IDS.SCORE_CONTAINER).innerText = this.currentGame.score;
      }
      /**
       * Set the Level text.
       *
       * @return void
       */

    }, {
      key: "setLevelText",
      value: function setLevelText() {
        var el = document.getElementById(this.DOM_IDS.LEVEL_CONTAINER);
        el.innerText = "LEVEL " + this.currentGame.level;
      }
      /**
       * Remove the current block from the board
       *
       * @return void
       */

    }, {
      key: "removeCurrentBlockFromBoard",
      value: function removeCurrentBlockFromBoard() {
        //Remove the current class from the visible blocks
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.currentBlock.blockIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var block_id = _step2.value;
            var block = document.getElementById(block_id);
            block.classList.remove(this.currentBlock.class);
          } //Reset the current set of blocks

        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this.currentBlock.blockIds = [];
        this.currentBlock.blockPositions = [];
      }
      /**
       * Add the next block to the board
       *
       * @return void
       */

    }, {
      key: "nextBlock",
      value: function nextBlock() {
        if (this.isPaused) {
          return;
        } // Reset all the variables


        this.currentBlock.blockIds = [];
        this.currentBlock.blockPositions = []; // The preview block becomes the current piece

        this.currentBlock.type = this.previewPiece.type;
        this.currentBlock.class = BLOCKS[this.currentBlock.type]["class"]; // Reset the start location for the block to appear

        this.currentBlock.row = 1;
        this.currentBlock.col = SETTINGS.PIECE_START_COL;
        this.currentBlock.position = 0;
        this.moveBlock("none"); //Reset the game interval

        this.killGameInterval();
        this.startGameInterval(); // Make the next preview block

        this.makePreviewPiece();
      }
      /**
       * Setup the keyboard events.
       *   - Arrow keys control the motion of the blocks.
       *   - 'p' Pauses the game.
       *
       * @return void
       */

    }, {
      key: "setupKeyEvents",
      value: function setupKeyEvents() {
        var _this = this;

        document.addEventListener("keydown", function (e) {
          switch (e.keyCode) {
            case 37:
              // Left arrow key
              _this.moveBlock("left");

              break;

            case 38:
              // Up arrow key
              _this.moveBlock("up");

              break;

            case 39:
              // Right arrow key
              _this.moveBlock("right");

              break;

            case 40:
              // Down arrow key
              _this.moveBlock("down");

              break;

            case 80:
              // 'p' pressed to pause
              _this.pauseGame();

              break;
            // Default - don't do anything

            default:
              return;
          } // Prevent the default action (scroll or char-move)


          e.preventDefault();
        });
      }
      /**
       * Start playing
       *
       * @return void
       */

    }, {
      key: "startPlay",
      value: function startPlay() {
        this.isPaused = false;

        if (this.previewPiece.type == "") {
          //New game is starting
          //Generate the first block type
          this.previewPiece.type = this.generateRandomBlockType(); //Create the new piece

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

    }, {
      key: "startGameInterval",
      value: function startGameInterval() {
        var _this2 = this;

        if (!this.gameIntervalTimer.obj) {
          // Setup the interval object using the std js function
          this.gameIntervalTimer.obj = setInterval(function () {
            //Start the action (just move the current piece down)
            _this2.moveBlock("down");
          }, this.gameIntervalTimer.ms);
        }
      }
      /**
       * Stop the game interval
       *
       * @return void
       */

    }, {
      key: "killGameInterval",
      value: function killGameInterval() {
        // Clear it using the standard js function
        clearInterval(this.gameIntervalTimer.obj);
        this.gameIntervalTimer.obj = false;
      }
      /**
       * Pause or unpause the game
       *
       * @return void
       */

    }, {
      key: "pauseGame",
      value: function pauseGame() {
        var _this3 = this;

        if (this.isPaused) {
          //Already paused, so start the game
          this.startPlay();
          return;
        }

        this.killGameInterval();
        this.isPaused = true; // Show the paused modal message (from template)

        this.showMessage("paused");
        var button = document.getElementById("tetrjs-pause-play");
        button.addEventListener("click", function (ev) {
          _this3.startPlay();
        });
      }
      /**
       * Game over occurred.
       *
       * @return void
       */

    }, {
      key: "gameOver",
      value: function gameOver() {
        var _this4 = this;

        this.isPaused = true; // Stop the game interval

        this.killGameInterval();
        var template_vars = {
          score: this.currentGame["score"],
          rowsEliminated: this.currentGame["rowsEliminated"],
          level: this.currentGame["level"]
        }; // Show the gameover modal message (from template)

        this.showMessage("gameover", template_vars);
        var button = document.getElementById("tetrjs-gameover-newgame");
        button.addEventListener("click", function (e) {
          _this4.newGame();
        });
      }
      /**
       * Setup a new game
       *
       * @return void
       **/

    }, {
      key: "newGame",
      value: function newGame() {
        // Stop the game interval
        this.killGameInterval(); // Reset the the score, level, and interval

        this.currentGame.score = 0;
        this.currentGame.level = 1;
        this.gameIntervalTimer.ms = SETTINGS.GAME_INTERVAL_MS; // Reset the score and level text

        this.setScoreText();
        this.setLevelText(); // Setup the main and preview boards

        this.setupBoard();
        this.setupPreviewBoard(); // Remove the old preview piece type

        this.previewPiece.type = ""; // Start the game

        this.startPlay();
      }
      /**
       * Show the introduction message;
       * should be run when game loads.
       *
       * @return void
       **/

    }, {
      key: "showIntro",
      value: function showIntro() {
        var _this5 = this;

        this.setupBoard();
        this.setupPreviewBoard();
        this.showMessage("intro");
        var button = document.getElementById("tetrjs-intro-newgame");
        button.addEventListener("click", function (e) {
          _this5.newGame();
        });
      }
      /**
       * Show the About Popover
       *
       * @return void
       */

    }, {
      key: "showAbout",
      value: function showAbout() {
        var _this6 = this;

        this.killGameInterval();
        this.isPaused = true;
        this.showMessage("about");
        var button = document.getElementById("tetrjs-about-close");
        button.addEventListener("click", function (e) {
          _this6.startPlay();
        });
      }
      /**
       * Show a message in the modal window.
       *
       * @return void
       */

    }, {
      key: "showMessage",
      value: function showMessage(template_name, vars) {
        var elModal = document.getElementById(this.DOM_IDS.MODAL);
        var elVeil = document.getElementById(this.DOM_IDS.MODAL_VEIL);
        var html = templates[template_name](vars);
        elModal.innerHTML = html;
        util.fadeIn(elVeil, function () {
          elModal.style.opacity = 0;
          elModal.style.display = "block"; //Center the message in the veil

          var leftOffset = Math.floor((elVeil.offsetWidth - elModal.offsetWidth) / 2);
          var topOffset = Math.floor((elVeil.offsetHeight - elModal.offsetHeight) / 2);
          elModal.style.left = leftOffset + "px";
          elModal.style.top = topOffset + "px";
          elModal.style.opacity = 1;
        });
      }
      /**
       * Hide the modal message.
       *
       * @return void
       */

    }, {
      key: "hideMessage",
      value: function hideMessage() {
        var elModal = document.getElementById(this.DOM_IDS.MODAL);
        var elVeil = document.getElementById(this.DOM_IDS.MODAL_VEIL);
        util.fadeOut(elModal, function () {
          //Clear after the fade
          elModal.innerHTML = "";
        });
        util.fadeOut(elVeil, function () {});
      }
      /**
       * Run tetrjs.
       *
       * @param string containerID The container id for tetrjs.
       */

    }, {
      key: "run",
      value: function run(containerID) {
        var _this7 = this;

        var el = document.getElementById(containerID);
        el.innerHTML = templates["container"]();
        var button = document.getElementById("tetrjs-button-pause");
        button.addEventListener("click", function (e) {
          _this7.pauseGame();
        });
        var newButton = document.getElementById("tetrjs-button-new");
        newButton.addEventListener("click", function (e) {
          _this7.newGame();
        });
        var about = document.getElementById("tetrjs-button-about");
        about.addEventListener("click", function (e) {
          _this7.showAbout();
        });
        this.setupKeyEvents();
        this.showIntro();
      }
    }]);

    return Tetrjs;
  }();

  return Tetrjs;

}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbInNyYy91dGlsLmpzIiwic3JjL2Jsb2Nrcy5qcyIsInNyYy9zZXR0aW5ncy5qcyIsInNyYy90ZW1wbGF0ZXMuanMiLCJzcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEZXRlcm1pbmUgaWYgYW4gZWxlbWVudCBoYXMgYSBjbGFzcy5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbHNcbiAqL1xuZnVuY3Rpb24gaGFzQ2xhc3MoZWxlLCBjbHMpIHtcbiAgICByZXR1cm4gISFlbGUuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoXCIoXFxcXHN8XilcIiArIGNscyArIFwiKFxcXFxzfCQpXCIpKTtcbn1cblxuLyoqXG4gKiBBZGQgYSBjbGFzcyB0byBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZVxuICogQHBhcmFtIHtzdHJpbmd9IGNsc1xuICovXG5mdW5jdGlvbiBhZGRDbGFzcyhlbGUsIGNscykge1xuICAgIGlmICghaGFzQ2xhc3MoZWxlLCBjbHMpKSBlbGUuY2xhc3NOYW1lICs9IFwiIFwiICsgY2xzO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNsYXNzIGZyb20gYW4gZWxlbWVudFxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZVxuICogQHBhcmFtIHtzdHJpbmd9IGNsc1xuICovXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbGUsIGNscykge1xuICAgIGlmIChoYXNDbGFzcyhlbGUsIGNscykpIHtcbiAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoXFxcXHN8XilcIiArIGNscyArIFwiKFxcXFxzfCQpXCIpO1xuICAgICAgICBlbGUuY2xhc3NOYW1lID0gZWxlLmNsYXNzTmFtZS5yZXBsYWNlKHJlZywgXCIgXCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNjEyMTI3MFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2JcbiAqL1xuZnVuY3Rpb24gZmFkZUluKGVsZW1lbnQsIGNiKSB7XG4gICAgdmFyIG9wID0gMC4xOyAvLyBpbml0aWFsIG9wYWNpdHlcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgdmFyIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChvcCA+PSAwLjUpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICAgICAgcmV0dXJuIGNiKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gb3A7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZmlsdGVyID0gXCJhbHBoYShvcGFjaXR5PVwiICsgb3AgKiAxMDAgKyBcIilcIjtcbiAgICAgICAgb3AgKz0gb3AgKiAwLjE7XG4gICAgfSwgMTApO1xufVxuXG4vKipcbiAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82MTIxMjcwXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYlxuICovXG5mdW5jdGlvbiBmYWRlT3V0KGVsZW1lbnQsIGNiKSB7XG4gICAgdmFyIG9wID0gMTsgLy8gaW5pdGlhbCBvcGFjaXR5XG4gICAgdmFyIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChvcCA8PSAwLjEpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICByZXR1cm4gY2IoKTtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBvcDtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5maWx0ZXIgPSBcImFscGhhKG9wYWNpdHk9XCIgKyBvcCAqIDEwMCArIFwiKVwiO1xuICAgICAgICBvcCAtPSBvcCAqIDAuMTtcbiAgICB9LCAxMCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBoYXNDbGFzcyxcbiAgICBhZGRDbGFzcyxcbiAgICByZW1vdmVDbGFzcyxcbiAgICBmYWRlSW4sXG4gICAgZmFkZU91dCxcbiAgICBvdXRlckhlaWdodCxcbiAgICBvdXRlcldpZHRoXG59O1xuIiwiLypcbiAqIERlZmluZXMgdGhlIFRldHJqcyBibG9jayB0eXBlcyBhbmQgdGhlaXJcbiAqIHBvc3NpYmxlIHBvc2l0aW9ucy5cbiAqXG4gKiBAYXV0aG9yIERlc3RpbiBNb3VsdG9uXG4gKiBAdmVyc2lvbiAxLjBcbiAqIEBsaWNlbnNlIE1JVFxuICpcbiAqXG4gKiBUaGUgQkxPQ0tTIG9iamVjdCBpcyBrZXllZCB0byB0aGUgYmxvY2sgbmFtZXMgZGVmaW5lZCBpbiBCTE9DS19UWVBFUy5cbiAqXG4gKiBFYWNoIEJMT0NLIGlzIGNvbXBvc2VkIG9mOlxuICogJ2NsYXNzJzogVGhlIGNzcyBjbGFzcyBmb3IgdGhlIGFjdGl2ZSBibG9ja3MuXG4gKiAnbm9fcG9zaXRpb25zJzogVGhlIG51bWJlciBvZiBwb3NzaWJsZSBwb3NpdGlvbnMgZm9yIGEgYmxvY2suXG4gKiAncG9zaXRpb25zJzogT2JqZWN0IHRvIHN0b3JlIHRoZSBkaWZmZXJlbnQgYmxvY2sgcG9zaXRpb25zXG4gKiAgICAndHJhbnNfcm93JzogdGhlIHJvdyB3aGVyZSB0aGUgYmxvY2sgaXMgXCJyb3RhdGVkXCIgZm9yIGEgcG9zaXRpb25cbiAqICAgICd0cmFuc19jb2wnOiB0aGUgY29sIHdoZXJlIHRoZSBibG9jayBpcyBcInJvdGF0ZWRcIiBmb3IgYSBwb3NpdGlvblxuICogICAgJ3Jvd3MnOiB0aGUgcm93cyB0aGF0IGZvcm0gdGhlIGJsb2NrLlxuICogICAgICAgICAgICAtIEVhY2ggcm93IGlzIGFuIG9iamVjdCBpbiB7Y29sdW1uOmJvb2xlYW4sIC4uLn0gZm9ybWF0XG4gKiAgICAgICAgICAgICAgaS5lLiBTdHJhaWdodCBibG9ja3MgaW4gdGhlIDFzdCAoMHRoKSBwb3NpdGlvbiBhcmVcbiAqICAgICAgICAgICAgICAgICAgIGFjdGl2ZSBpbiBhbGwgNCBjb2x1bW5zOiB7MDoxLCAxOjEsIDI6MSwgMzoxfVxuICpcbiAqL1xuXG5jb25zdCBCTE9DS19UWVBFUyA9IFtcIlNUUkFJR0hUXCIsIFwiTF9MRUZUXCIsIFwiTF9SSUdIVFwiLCBcIlNRVUFSRVwiLCBcIlNcIiwgXCJaXCIsIFwiVFwiXTtcblxuY29uc3QgQkxPQ0tTID0ge1xuICAgIFNUUkFJR0hUOiB7XG4gICAgICAgIGNsYXNzOiBcInRldHJqcy1ibG9jay1zdHJhaWdodFwiLFxuICAgICAgICBub19wb3NpdGlvbnM6IDIsXG4gICAgICAgIHBvc2l0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IC0xLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMSwgMSwgMSwgMV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogLTEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAxLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMV0sIFsxXSwgWzFdLCBbMV1dXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuICAgIExfTEVGVDoge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stbC1sZWZ0XCIsXG4gICAgICAgIG5vX3Bvc2l0aW9uczogNCxcbiAgICAgICAgcG9zaXRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAxLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogLTEsXG4gICAgICAgICAgICAgICAgcm93czogW1sxLCAxLCAxXSwgWzAsIDAsIDFdXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IC0xLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzAsIDFdLCBbMCwgMV0sIFsxLCAxXV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAwLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzEsIDAsIDBdLCBbMSwgMSwgMV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMCxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDEsXG4gICAgICAgICAgICAgICAgcm93czogW1sxLCAxXSwgWzEsIDBdLCBbMSwgMF1dXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuXG4gICAgTF9SSUdIVDoge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stbC1yaWdodFwiLFxuICAgICAgICBub19wb3NpdGlvbnM6IDQsXG4gICAgICAgIHBvc2l0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IC0xLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMSwgMSwgMV0sIFsxLCAwLCAwXV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAtMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czogW1sxLCAxXSwgWzAsIDFdLCBbMCwgMV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMCxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czogW1swLCAwLCAxXSwgWzEsIDEsIDFdXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDAsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAxLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMSwgMF0sIFsxLCAwXSwgWzEsIDFdXVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSxcblxuICAgIFNRVUFSRToge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stc3F1YXJlXCIsXG4gICAgICAgIG5vX3Bvc2l0aW9uczogMSxcbiAgICAgICAgcG9zaXRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAwLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzEsIDFdLCBbMSwgMV1dXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuXG4gICAgUzoge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stc1wiLFxuICAgICAgICBub19wb3NpdGlvbnM6IDIsXG4gICAgICAgIHBvc2l0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czogW1swLCAxLCAxXSwgWzEsIDEsIDBdXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IC0xLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzEsIDBdLCBbMSwgMV0sIFswLCAxXV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0sXG5cbiAgICBaOiB7XG4gICAgICAgIGNsYXNzOiBcInRldHJqcy1ibG9jay16XCIsXG4gICAgICAgIG5vX3Bvc2l0aW9uczogMixcbiAgICAgICAgcG9zaXRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAxLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzEsIDEsIDBdLCBbMCwgMSwgMV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogLTEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAwLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMCwgMV0sIFsxLCAxXSwgWzEsIDBdXVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSxcblxuICAgIFQ6IHtcbiAgICAgICAgY2xhc3M6IFwidGV0cmpzLWJsb2NrLXRcIixcbiAgICAgICAgbm9fcG9zaXRpb25zOiA0LFxuICAgICAgICBwb3NpdGlvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAtMSxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzEsIDEsIDFdLCBbMCwgMSwgMF1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogLTEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAwLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMCwgMV0sIFsxLCAxXSwgWzAsIDFdXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDAsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAwLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMCwgMSwgMF0sIFsxLCAxLCAxXV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAwLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMSxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzEsIDBdLCBbMSwgMV0sIFsxLCAwXV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH1cbn07XG5cbmV4cG9ydCB7IEJMT0NLUywgQkxPQ0tfVFlQRVMgfTtcbiIsImNvbnN0IFNFVFRJTkdTID0ge1xuICAgIEJPQVJEX0NPTFNfV0lERTogMTAsXG4gICAgQk9BUkRfUk9XU19ISUdIOiAxOCxcbiAgICBQSUVDRV9TVEFSVF9DT0w6IDQsXG4gICAgUElFQ0VfU1RBUlRfUk9XOiAxLFxuICAgIFBJRUNFX1NUQVJUX1BPUzogMSxcbiAgICBHQU1FX0lOVEVSVkFMX01TOiA0NjAsXG4gICAgR0FNRV9TQ09SRV9NVUxUSVBMSUVSOiAxMDAsXG4gICAgQ0VMTF9XSURUSF9QWDogMjAsXG4gICAgQ0VMTF9IRUlHSFRfUFg6IDIwXG59O1xuXG5leHBvcnQgeyBTRVRUSU5HUyB9O1xuIiwiY29uc3QgYWJvdXQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGBcbiAgICBUZXRyanMgaXMgYSBUZXRyaXMgY2xvbmUgd3JpdHRlbiBpbiBKYXZhU2NyaXB0LlxuICAgIDxiciAvPlxuICAgIDxiciAvPlxuICAgIFRldHJqcyB3YXMgd3JpdHRlbiBieVxuICAgIDxhIGhyZWY9XCJodHRwczovL2Rlc3Rpbm1vdWx0b24uY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RGVzdGluIE1vdWx0b248L2E+LlxuICAgIDxiciAvPlxuICAgIDxiciAvPlxuICAgIEF2YWlsYWJsZSBvblxuICAgIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi90ZXRyanNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5HaXRIdWI8L2E+LlxuICAgIDxiciAvPlxuICAgIE9wZW4gc291cmNlIHVuZGVyIHRoZVxuICAgIDxhIGhyZWY9XCJodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZVwiPk1JVCBMaWNlbnNlPC9hPi5cbiAgICA8YnIgLz5cbiAgICA8YnIgLz5cbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInRldHJqcy1hYm91dC1jbG9zZVwiPlJlc3VtZSBHYW1lPC9idXR0b24+XG5gO1xufTtcblxuY29uc3QgY29udGFpbmVyID0gKCkgPT4ge1xuICAgIHJldHVybiBgXG4gICAgPCEtLSBUaGUgR2FtZSBDb250YWluZXIgLS0+XG4gICAgPGRpdiBpZD1cInRldHJqcy1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBpZD1cInRldHJqcy10aXRsZS1jb250YWluZXJcIj5UZXRyanM8L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cInRldHJqcy1ib2FyZC13cmFwcGVyXCI+PGRpdiBpZD1cInRldHJqcy1ib2FyZFwiPjwvZGl2PjwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwidGV0cmpzLW5leHQtcGllY2UtcHJldmlldy1jb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cInRldHJqcy1zY29yZS1jb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cInRldHJqcy1sZXZlbC1jb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cInRldHJqcy1hY3Rpb25zLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwidGV0cmpzLWJ1dHRvbi1wYXVzZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24tdGV4dFwiPlBhdXNlPC9kaXY+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwidGV0cmpzLWJ1dHRvbi1uZXdcIj5OZXcgR2FtZTwvYnV0dG9uPlxuICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ0ZXRyanMtYnV0dG9uLWFib3V0XCI+XG4gICAgICAgICAgICAgICAgQWJvdXQgVGV0cmpzXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgaWQ9XCJ0ZXRyanMtbW9kYWwtdmVpbFwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwidGV0cmpzLW1vZGFsXCI+PC9kaXY+XG4gICAgPC9kaXY+XG5gO1xufTtcblxuY29uc3QgZ2FtZW92ZXIgPSAoeyBzY29yZSwgcm93c0VsaW1pbmF0ZWQsIGxldmVsIH0pID0+IHtcbiAgICByZXR1cm4gYFxuICAgIEdhbWUgT3ZlciEgPGJyIC8+PGJyIC8+XG4gICAgPHRhYmxlIGJvcmRlcj1cIjBcIiBpZD1cInRldHJqcy1nYW1lb3Zlci10YWJsZVwiPlxuICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRkPjxzdHJvbmc+U2NvcmU6PC9zdHJvbmc+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+JHtzY29yZX08L3RkPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQ+PHN0cm9uZz5MaW5lczo8L3N0cm9uZz48L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD4ke3Jvd3NFbGltaW5hdGVkfTwvdGQ+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0ZD48c3Ryb25nPkxldmVsOjwvc3Ryb25nPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPiR7bGV2ZWx9PC90ZD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGJvZHk+XG4gICAgPC90YWJsZT5cbiAgICA8YnIgLz5cbiAgICA8YnV0dG9uIGlkPVwidGV0cmpzLWdhbWVvdmVyLW5ld2dhbWVcIj5OZXcgR2FtZTwvYnV0dG9uPlxuYDtcbn07XG5cbmNvbnN0IGludHJvID0gKCkgPT4ge1xuICAgIHJldHVybiBgXG4gICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJ0ZXRyanMtaW50cm8tbmV3Z2FtZVwiPlxuICAgICAgICA8c3Bhbj7ilrY8L3NwYW4+Jm5ic3A7Jm5ic3A7UGxheSBUZXRyanMhXG4gICAgPC9idXR0b24+XG5cbiAgICA8YnIgLz48YnIgLz5cbiAgICBBcnJvdyBrZXlzIGNvbnRyb2wgdGhlIHBpZWNlcy5cbmA7XG59O1xuXG5jb25zdCBwYXVzZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGBcbiAgICBQYXVzZWQuLi5cbiAgICA8YnIgLz5cbiAgICA8YnIgLz5cbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInRldHJqcy1wYXVzZS1wbGF5XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiXCI+4pa2PC9zcGFuPiZuYnNwOyZuYnNwO1Jlc3VtZVxuICAgIDwvYnV0dG9uPlxuICAgIDxiciAvPlxuICAgIDxiciAvPlRpcDogUHJlc3MgPGI+UDwvYj4ga2V5IHRvIHBhdXNlL3Jlc3VtZS5cbmA7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgYWJvdXQsXG4gICAgY29udGFpbmVyLFxuICAgIGdhbWVvdmVyLFxuICAgIGludHJvLFxuICAgIHBhdXNlZFxufTtcbiIsIi8qKlxuICogVGV0cmpzIGlzIGEgamF2YXNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiBUZXRyaXMuXG4gKlxuICogQGF1dGhvciBEZXN0aW4gTW91bHRvblxuICogQGxpY2Vuc2UgTUlUXG4gKiBAdmVyc2lvbiAxLjBcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3RldHJqc1xuICovXG5cbmltcG9ydCB1dGlsIGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCB7IEJMT0NLUywgQkxPQ0tfVFlQRVMgfSBmcm9tIFwiLi9ibG9ja3NcIjtcbmltcG9ydCB7IFNFVFRJTkdTIH0gZnJvbSBcIi4vc2V0dGluZ3NcIjtcbmltcG9ydCB0ZW1wbGF0ZXMgZnJvbSBcIi4vdGVtcGxhdGVzXCI7XG4vKipcbiAqIFRoZSBjb25zdHJ1Y3Rvci5cbiAqIEluaXRpYWxpemVzIHRoZSBiYXNpYyBjb25maWd1cmF0aW9uIHZhbHVlcy5cbiAqIEByZXR1cm4gdm9pZFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXRyanMge1xuICAgIGJvYXJkID0gW107XG5cbiAgICBpc1BhdXNlZCA9IGZhbHNlO1xuXG4gICAgRE9NX0lEUyA9IHtcbiAgICAgICAgQk9BUkRfV1JBUFBFUjogXCJ0ZXRyanMtYm9hcmQtd3JhcHBlclwiLFxuICAgICAgICBCT0FSRDogXCJ0ZXRyanMtYm9hcmRcIixcbiAgICAgICAgUFJFVklFV19DT05UQUlORVI6IFwidGV0cmpzLW5leHQtcGllY2UtcHJldmlldy1jb250YWluZXJcIixcbiAgICAgICAgU0NPUkVfQ09OVEFJTkVSOiBcInRldHJqcy1zY29yZS1jb250YWluZXJcIixcbiAgICAgICAgTEVWRUxfQ09OVEFJTkVSOiBcInRldHJqcy1sZXZlbC1jb250YWluZXJcIixcbiAgICAgICAgTU9EQUw6IFwidGV0cmpzLW1vZGFsXCIsXG4gICAgICAgIE1PREFMX1ZFSUw6IFwidGV0cmpzLW1vZGFsLXZlaWxcIlxuICAgIH07XG5cbiAgICBET01fQ0xBU1NFUyA9IHtcbiAgICAgICAgQk9BUkRfQkxPQ0s6IFwidGV0cmpzLWJvYXJkLWJsb2NrXCJcbiAgICB9O1xuXG4gICAgY3VycmVudEJsb2NrID0ge1xuICAgICAgICB0eXBlOiBcIlwiLFxuICAgICAgICBibG9ja0lkczogW10sXG4gICAgICAgIGJsb2NrUG9zaXRpb25zOiBbXSxcbiAgICAgICAgY2xhc3M6IFwiXCIsXG4gICAgICAgIHJvdzogU0VUVElOR1MuUElFQ0VfU1RBUlRfUk9XLFxuICAgICAgICBjb2w6IFNFVFRJTkdTLlBJRUNFX1NUQVJUX0NPTCxcbiAgICAgICAgcG9zaXRpb246IFNFVFRJTkdTLlBJRUNFX1NUQVJUX1BPU1xuICAgIH07XG5cbiAgICBwcmV2aWV3UGllY2UgPSB7XG4gICAgICAgIHR5cGU6IFwiXCIsXG4gICAgICAgIGNsYXNzOiBcIlwiLFxuICAgICAgICBibG9ja3M6IFtdXG4gICAgfTtcblxuICAgIGdhbWVJbnRlcnZhbFRpbWVyID0ge1xuICAgICAgICBvYmo6IGZhbHNlLFxuICAgICAgICBtczogU0VUVElOR1MuR0FNRV9JTlRFUlZBTF9NU1xuICAgIH07XG5cbiAgICBjdXJyZW50R2FtZSA9IHtcbiAgICAgICAgc2NvcmU6IDAsXG4gICAgICAgIHJvd3NFbGltaW5hdGVkOiAwLFxuICAgICAgICBsZXZlbDogMVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCB0aGUgVGV0cmpzIGJvYXJkLlxuICAgICAqICAxLiBDbGVhciB0aGUgYm9hcmRcbiAgICAgKiAgICAgaS4gUmVtb3ZlIGFueSBleGlzdGluZyBIVE1MXG4gICAgICogICAgIGlpLiBDbGVhciB0aGUgbXVsdGlkaW1lbnNpb25hbC9tYXRyaXggYm9hcmQgb2JqZWN0XG4gICAgICogIDIuIFNldCB0aGUgYm9hcmQgd2lkdGggYW5kIGhlaWdodCAoaW4gcHgpXG4gICAgICogIDMuIENyZWF0ZSB0aGUgbmV3LCBjbGVhbiwgYm9hcmRcbiAgICAgKiAgICAgaS4gSW5zdGFudGlhdGUgdGhlIG11bHRpZGltZW5zaW9uYWwvbWF0cml4IGJvYXJkIGNvbnRhaW5lclxuICAgICAqICAgICBpaS4gQ3JlYXRlIGRpdiBib3hlcyBhdCBhYnNvbHV0ZSBwb3NpdGlvbiB0byBob2xkIGJsb2Nrc1xuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2V0dXBCb2FyZCgpIHtcbiAgICAgICAgY29uc3QgZWxCb2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRE9NX0lEUy5CT0FSRCk7XG4gICAgICAgIGNvbnN0IGVsV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRE9NX0lEUy5CT0FSRF9XUkFQUEVSKTtcblxuICAgICAgICAvLyBDbGVhciB0aGUgYm9hcmRcbiAgICAgICAgZWxCb2FyZC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICB0aGlzLmJvYXJkID0ge307XG5cbiAgICAgICAgLy8gU2V0IHRoZSBib2FyZCBzaXplXG4gICAgICAgIGNvbnN0IGJvYXJkV2lkdGggPSBTRVRUSU5HUy5CT0FSRF9DT0xTX1dJREUgKiBTRVRUSU5HUy5DRUxMX1dJRFRIX1BYO1xuICAgICAgICBjb25zdCBib2FyZEhlaWdodCA9IFNFVFRJTkdTLkJPQVJEX1JPV1NfSElHSCAqIFNFVFRJTkdTLkNFTExfSEVJR0hUX1BYO1xuICAgICAgICBlbEJvYXJkLnN0eWxlLndpZHRoID0gYCR7Ym9hcmRXaWR0aH1weGA7XG4gICAgICAgIGVsQm9hcmQuc3R5bGUuaGVpZ2h0ID0gYCR7Ym9hcmRIZWlnaHR9cHhgO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU0VUVElOR1MuQk9BUkRfUk9XU19ISUdIOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmRbaV0gPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHRvcF9wb3MgPSBpICogU0VUVElOR1MuQ0VMTF9IRUlHSFRfUFg7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFNFVFRJTkdTLkJPQVJEX0NPTFNfV0lERTsgaisrKSB7XG4gICAgICAgICAgICAgICAgLy8gU2V0dXAgdGhlIG9iamVjdCBmb3Igc3RvcmluZyBibG9jayBwb3NpdGlvbnNcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2ldW2pdID0ge307XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgbGVmdCBweCBwb3NpdGlvbiBvZiB0aGUgY2VsbFxuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRfcG9zID0gaiAqIFNFVFRJTkdTLkNFTExfV0lEVEhfUFg7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIGJsb2NrIHRvIHRoZSBib2FyZFxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBibG9jay5zdHlsZS5sZWZ0ID0gbGVmdF9wb3MudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBibG9jay5zdHlsZS50b3AgPSB0b3BfcG9zLnRvU3RyaW5nKCkgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgYmxvY2suY2xhc3NOYW1lID0gdGhpcy5ET01fQ0xBU1NFUy5CT0FSRF9CTE9DSztcbiAgICAgICAgICAgICAgICBibG9jay5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgdGJfJHtqfV8ke2l9YCk7XG4gICAgICAgICAgICAgICAgZWxCb2FyZC5hcHBlbmRDaGlsZChibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCB0aGUgc21hbGwgcHJldmlldyBib2FyZCB0byBkaXNwbGF5IHRoZSBuZXh0IHBpZWNlLlxuICAgICAqXG4gICAgICogQWxtb3N0IGlkZW50aWNhbCB0byB0aGUgc2V0dXBCb2FyZCBmdW5jdGlvbiwgZXhjZXB0IHdlXG4gICAgICogZG8gbm90IG5lZWQgYSBtdWx0aWRpbWVuc2lvbmFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBib2FyZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNldHVwUHJldmlld0JvYXJkKCkge1xuICAgICAgICBjb25zdCBlbFByZXZpZXdCb2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgdGhpcy5ET01fSURTLlBSRVZJRVdfQ09OVEFJTkVSXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHByZXZpZXdfc2VjdGlvbnNfd2lkZSA9IDY7XG4gICAgICAgIGNvbnN0IHByZXZpZXdfc2VjdGlvbnNfaGlnaCA9IDQ7XG5cbiAgICAgICAgLy8gQ2xlYXIgdGhlIGJvYXJkXG4gICAgICAgIGNvbnN0IGJvYXJkV2lkdGggPSBwcmV2aWV3X3NlY3Rpb25zX3dpZGUgKiBTRVRUSU5HUy5DRUxMX1dJRFRIX1BYO1xuICAgICAgICBjb25zdCBib2FyZEhlaWdodCA9IHByZXZpZXdfc2VjdGlvbnNfaGlnaCAqIFNFVFRJTkdTLkNFTExfSEVJR0hUX1BYO1xuICAgICAgICBlbFByZXZpZXdCb2FyZC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBlbFByZXZpZXdCb2FyZC5zdHlsZS53aWR0aCA9IGAke2JvYXJkV2lkdGh9cHhgO1xuICAgICAgICBlbFByZXZpZXdCb2FyZC5zdHlsZS5oZWlnaHQgPSBgJHtib2FyZEhlaWdodH1weGA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aWV3X3NlY3Rpb25zX2hpZ2g7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdG9wUG9zID0gaSAqIFNFVFRJTkdTLkNFTExfSEVJR0hUX1BYO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcmV2aWV3X3NlY3Rpb25zX3dpZGU7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRQb3MgPSBqICogU0VUVElOR1MuQ0VMTF9XSURUSF9QWDtcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGJsb2NrLnN0eWxlLnRvcCA9IHRvcFBvcyArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBibG9jay5zdHlsZS5sZWZ0ID0gbGVmdFBvcyArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBibG9jay5jbGFzc05hbWUgPSB0aGlzLkRPTV9DTEFTU0VTLkJPQVJEX0JMT0NLO1xuICAgICAgICAgICAgICAgIGJsb2NrLnNldEF0dHJpYnV0ZShcImlkXCIsIGB0cF8ke2p9XyR7aX1gKTtcbiAgICAgICAgICAgICAgICBlbFByZXZpZXdCb2FyZC5hcHBlbmRDaGlsZChibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSByYW5kb20gYmxvY2sgdHlwZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gc3RyaW5nIEJsb2NrIHR5cGVcbiAgICAgKi9cbiAgICBnZW5lcmF0ZVJhbmRvbUJsb2NrVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIEJMT0NLX1RZUEVTW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIEJMT0NLX1RZUEVTLmxlbmd0aCldO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ha2UgdGhlIHByZXZpZXcgYmxvY2sgaW4gdGhlIHByZXZpZXcgYm9hcmQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBtYWtlUHJldmlld1BpZWNlKCkge1xuICAgICAgICBpZiAodGhpcy5pc1BhdXNlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9SZW1vdmUgdGhlIGN1cnJlbnQgYmxvY2sgZnJvbSB0aGUgcHJldmlld1xuICAgICAgICBmb3IgKGxldCBibG9ja19pZCBvZiB0aGlzLnByZXZpZXdQaWVjZS5ibG9ja3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2tfaWQpO1xuICAgICAgICAgICAgYmxvY2suY2xhc3NMaXN0LnJlbW92ZSh0aGlzLnByZXZpZXdQaWVjZS5jbGFzcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmV2aWV3UGllY2UuYmxvY2tzID0gW107XG5cbiAgICAgICAgLy9HZXQgYSByYW5kb20gYmxvY2tcbiAgICAgICAgdGhpcy5wcmV2aWV3UGllY2UudHlwZSA9IHRoaXMuZ2VuZXJhdGVSYW5kb21CbG9ja1R5cGUoKTtcblxuICAgICAgICB0aGlzLnByZXZpZXdQaWVjZS5jbGFzcyA9IEJMT0NLU1t0aGlzLnByZXZpZXdQaWVjZS50eXBlXVtcImNsYXNzXCJdO1xuICAgICAgICBjb25zdCBzdGFydENvbCA9IDE7XG4gICAgICAgIGNvbnN0IHN0YXJ0Um93ID0gMTtcbiAgICAgICAgY29uc3QgYmxvY2tSb3dzID1cbiAgICAgICAgICAgIEJMT0NLU1t0aGlzLnByZXZpZXdQaWVjZS50eXBlXVtcInBvc2l0aW9uc1wiXVswXVtcInJvd3NcIl07XG5cbiAgICAgICAgLy8gUm93cyBhcmUgc3RvcmVkIGFzIGEgbWF0cml4XG4gICAgICAgIGZvciAobGV0IHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCBibG9ja1Jvd3MubGVuZ3RoOyByb3dJbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBibG9ja1Jvd3Nbcm93SW5kZXhdO1xuICAgICAgICAgICAgZm9yIChsZXQgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IHJvdy5sZW5ndGg7IGNvbEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAocm93W2NvbEluZGV4XSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBibG9ja0NvbCA9IHN0YXJ0Q29sICsgY29sSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrUm93ID0gc3RhcnRSb3cgKyByb3dJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSBcInRwX1wiICsgYmxvY2tDb2wgKyBcIl9cIiArIGJsb2NrUm93O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCh0aGlzLnByZXZpZXdQaWVjZS5jbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJldmlld1BpZWNlLmJsb2Nrcy5wdXNoKGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlIGEgYmxvY2sgb24gdGhlIGJvYXJkLlxuICAgICAqIFRoaXMgaXMgbW9zdGx5IGNhbGxlZCBhcyB0aGUga2V5Ym9hcmQgZXZlbnQgaGFuZGxlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIG1vdmVCbG9jayhkZXNpcmVkRGlyZWN0aW9uKSB7XG4gICAgICAgIGxldCBkZXNpcmVkUG9zaXRpb24gPSB0aGlzLmN1cnJlbnRCbG9jay5wb3NpdGlvbjtcbiAgICAgICAgY29uc3QgYmxvY2tQb3NpdGlvbnMgPSBCTE9DS1NbdGhpcy5jdXJyZW50QmxvY2sudHlwZV1bXCJwb3NpdGlvbnNcIl07XG4gICAgICAgIGNvbnN0IGJsb2NrTnVtUG9zaXRpb25zID1cbiAgICAgICAgICAgIEJMT0NLU1t0aGlzLmN1cnJlbnRCbG9jay50eXBlXVtcIm5vX3Bvc2l0aW9uc1wiXTtcbiAgICAgICAgbGV0IGJsb2NrUG9zVHJhbnNSb3cgPSAwO1xuICAgICAgICBsZXQgYmxvY2tQb3NUcmFuc0NvbCA9IDA7XG5cbiAgICAgICAgLy8gJ3VwJyByb3RhdGVzIHRoZSBibG9ja1xuICAgICAgICBpZiAoZGVzaXJlZERpcmVjdGlvbiA9PSBcInVwXCIpIHtcbiAgICAgICAgICAgIGRlc2lyZWRQb3NpdGlvbiA9IHRoaXMuY3VycmVudEJsb2NrLnBvc2l0aW9uICsgMTtcbiAgICAgICAgICAgIGlmIChkZXNpcmVkUG9zaXRpb24gPiBibG9ja051bVBvc2l0aW9ucyAtIDEpIHtcbiAgICAgICAgICAgICAgICAvL1Jlc2V0IHRoZSB0cmFuc2l0aW9uIGJhY2sgdG8gMFxuICAgICAgICAgICAgICAgIGRlc2lyZWRQb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoZSBhbW91bnQgdG8gbW92ZSB0aGUgZGVzaXJlZCByb3cgYW5kIGNvbHVtblxuICAgICAgICAgICAgLy8gZHVyaW5nIHRoZSB0cmFuc2Zvcm1hdGlvblxuICAgICAgICAgICAgYmxvY2tQb3NUcmFuc1JvdyA9IGJsb2NrUG9zaXRpb25zW2Rlc2lyZWRQb3NpdGlvbl1bXCJ0cmFuc19yb3dcIl07XG4gICAgICAgICAgICBibG9ja1Bvc1RyYW5zQ29sID0gYmxvY2tQb3NpdGlvbnNbZGVzaXJlZFBvc2l0aW9uXVtcInRyYW5zX2NvbFwiXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJsb2NrUm93cyA9IGJsb2NrUG9zaXRpb25zW2Rlc2lyZWRQb3NpdGlvbl1bXCJyb3dzXCJdO1xuXG4gICAgICAgIGxldCBuZXh0RGVzaXJlZFBvc2l0aW9uID0gW107XG4gICAgICAgIGxldCBsb2NrQ3VycmVudEJsb2NrID0gZmFsc2U7XG4gICAgICAgIGxldCBsb3dlc3RDb2wgPSBTRVRUSU5HUy5CT0FSRF9DT0xTX1dJREU7XG4gICAgICAgIGxldCBsb3dlc3RSb3cgPSBTRVRUSU5HUy5CT0FSRF9ST1dTX0hJR0g7XG5cbiAgICAgICAgbGV0IHBvc2l0aW9uSXNBdmFpbGFibGUgPSB0cnVlO1xuICAgICAgICBmb3IgKGxldCByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgYmxvY2tSb3dzLmxlbmd0aDsgcm93SW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gYmxvY2tSb3dzW3Jvd0luZGV4XTtcbiAgICAgICAgICAgIGZvciAobGV0IGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCByb3cubGVuZ3RoOyBjb2xJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJvd1tjb2xJbmRleF0gPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG1wUGllY2VDb2xQb3MgPSB0aGlzLmN1cnJlbnRCbG9jay5jb2wgKyBjb2xJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG1wUGllY2VSb3dQb3MgPSB0aGlzLmN1cnJlbnRCbG9jay5yb3cgKyByb3dJbmRleDtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgZGVzaXJlZENvbCA9IHRtcFBpZWNlQ29sUG9zICsgYmxvY2tQb3NUcmFuc0NvbDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlc2lyZWRSb3cgPSB0bXBQaWVjZVJvd1BvcyArIGJsb2NrUG9zVHJhbnNSb3c7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2lyZWREaXJlY3Rpb24gPT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtkZXNpcmVkUm93XVtkZXNpcmVkQ29sXS5oYXNPd25Qcm9wZXJ0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV3IHBpZWNlIGJ1dCBhIHNwYWNlIGlzIGFscmVhZHkgdGFrZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVPdmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZERpcmVjdGlvbiA9PT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lyZWRDb2wgPSB0bXBQaWVjZUNvbFBvcyAtIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZERpcmVjdGlvbiA9PT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNpcmVkQ29sID0gdG1wUGllY2VDb2xQb3MgKyAxO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2lyZWREaXJlY3Rpb24gPT09IFwiZG93blwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNpcmVkUm93ID0gdG1wUGllY2VSb3dQb3MgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lyZWRSb3cgPiBTRVRUSU5HUy5CT0FSRF9ST1dTX0hJR0ggfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5kb2VzQm9hcmRQb3NpdGlvbkV4aXN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNpcmVkUm93LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNpcmVkQ29sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbZGVzaXJlZFJvd11bZGVzaXJlZENvbF0uaGFzT3duUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFscmVhZHkgYSBibG9jayBpbiB0aGUgbmV4dCBkb3dud2FyZCBwb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2tDdXJyZW50QmxvY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuZG9lc0JvYXJkUG9zaXRpb25FeGlzdChkZXNpcmVkUm93LCBkZXNpcmVkQ29sKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtkZXNpcmVkUm93XVtkZXNpcmVkQ29sXS5oYXNPd25Qcm9wZXJ0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDYW4ndCBtb3ZlXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbklzQXZhaWxhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zaXRpb25Jc0F2YWlsYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2lyZWRDb2wgPCBsb3dlc3RDb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb3dlc3RDb2wgPSBkZXNpcmVkQ29sO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2lyZWRSb3cgPCBsb3dlc3RSb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb3dlc3RSb3cgPSBkZXNpcmVkUm93O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0RGVzaXJlZFBvc2l0aW9uLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbDogZGVzaXJlZENvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3c6IGRlc2lyZWRSb3dcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uSXNBdmFpbGFibGUpIHtcbiAgICAgICAgICAgIGlmICghbG9ja0N1cnJlbnRCbG9jaykge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgY3VycmVudCBwaWVjZVxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ3VycmVudEJsb2NrRnJvbUJvYXJkKCk7XG5cbiAgICAgICAgICAgICAgICAvL1NldCB0aGUgbmV3IGN1cnJlbnQgZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgaWYgKGRlc2lyZWREaXJlY3Rpb24gPT0gXCJ1cFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJsb2NrLnBvc2l0aW9uID0gZGVzaXJlZFBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgbmV3IGN1cnJlbnQgcm93IGFuZCBjb2x1bW5cbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5jb2wgPSBsb3dlc3RDb2w7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmxvY2sucm93ID0gbG93ZXN0Um93O1xuICAgICAgICAgICAgICAgIC8vIEFwcGx5IHRoZSAnbW92ZW1lbnQnIGJ5IG1vZGlmeWluZyB0aGUgYmxvY2sncyBjbGFzc1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV4dERlc2lyZWRQb3NpdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSBuZXh0RGVzaXJlZFBvc2l0aW9uW2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG1wSWQgPSBgdGJfJHtwb3NbXCJjb2xcIl19XyR7cG9zW1wicm93XCJdfWA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkb21CbG9jayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRtcElkKTtcbiAgICAgICAgICAgICAgICAgICAgZG9tQmxvY2suY2xhc3NMaXN0LmFkZCh0aGlzLmN1cnJlbnRCbG9jay5jbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrSWRzLnB1c2godG1wSWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5ibG9ja1Bvc2l0aW9ucy5wdXNoKHBvcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGJsb2NrIGhhcyByZWFjaGVkIGl0cyBmaW5hbCBkZXN0aW5hdGlvblxuICAgICAgICBpZiAobG9ja0N1cnJlbnRCbG9jaykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbnRCbG9jay5ibG9ja1Bvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvcyA9IHRoaXMuY3VycmVudEJsb2NrLmJsb2NrUG9zaXRpb25zW2ldO1xuICAgICAgICAgICAgICAgIC8vIExvY2sgdGhlIGN1cnJlbnQgYmxvY2sgb24gdGhlIGJvYXJkXG4gICAgICAgICAgICAgICAgLy8gYnkgc2V0dGluZyB0aGUgcGVybWFuZW50IGJvYXJkIGNsYXNzXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NbXCJyb3dcIl1dW3Bvc1tcImNvbFwiXV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiB0aGlzLmN1cnJlbnRCbG9jay5jbGFzc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBibG9jayBoYXMgY2F1c2VkIHJvd3MgdG8gYmUgZWxpbWluYXRlZFxuICAgICAgICAgICAgdGhpcy5jaGVja0FuZEVsaW1pbmF0ZVJvd3MoKTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBuZXh0IGJsb2NrXG4gICAgICAgICAgICB0aGlzLm5leHRCbG9jaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlcmUgYXJlIGFueSByb3dzIHRvIHJlbW92ZVxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgY2hlY2tBbmRFbGltaW5hdGVSb3dzKCkge1xuICAgICAgICBsZXQgbm9Sb3dzRWxpbWluYXRlZCA9IDA7XG5cbiAgICAgICAgLy9Mb29wIG92ZXIgdGhlIGJvYXJkIHJvd3NcbiAgICAgICAgZm9yIChcbiAgICAgICAgICAgIGxldCByb3dJbmRleCA9IDA7XG4gICAgICAgICAgICByb3dJbmRleCA8IFNFVFRJTkdTLkJPQVJEX1JPV1NfSElHSDtcbiAgICAgICAgICAgIHJvd0luZGV4KytcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSB0aGlzLmJvYXJkW3Jvd0luZGV4XTtcbiAgICAgICAgICAgIGxldCBjb2x1bW5GaWxsQ291bnQgPSAwO1xuXG4gICAgICAgICAgICAvL0xvb3Agb3ZlciB0aGUgY29sdW1ucyBpbiB0aGlzIHJvd1xuICAgICAgICAgICAgZm9yIChsZXQgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IHJvdy5sZW5ndGg7IGNvbEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAvLyBBIGNsYXNzIGluZGljYXRlcyB0aGUgY29sdW1uIGluIHRoaXMgcm93IGlzIGZ1bGxcbiAgICAgICAgICAgICAgICBpZiAocm93W2NvbEluZGV4XS5oYXNPd25Qcm9wZXJ0eShcImNsYXNzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkZpbGxDb3VudCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIGVudGlyZSByb3cgaXMgZnVsbFxuICAgICAgICAgICAgaWYgKGNvbHVtbkZpbGxDb3VudCA9PT0gU0VUVElOR1MuQk9BUkRfQ09MU19XSURFKSB7XG4gICAgICAgICAgICAgICAgbm9Sb3dzRWxpbWluYXRlZCsrO1xuXG4gICAgICAgICAgICAgICAgLy9Nb3ZlIHRoZSB1cHBlciByb3dzIGRvd24sIGZyb20gdGhlIGJvdHRvbSB1cFxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSByb3dJbmRleDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpQ29sSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaUNvbEluZGV4IDwgU0VUVElOR1MuQk9BUkRfQ09MU19XSURFO1xuICAgICAgICAgICAgICAgICAgICAgICAgaUNvbEluZGV4KytcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYWJvdmVDbGFzcyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kb2VzQm9hcmRQb3NpdGlvbkV4aXN0KGkgLSAxLCBpQ29sSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtpIC0gMV1baUNvbEluZGV4XS5oYXNPd25Qcm9wZXJ0eShcImNsYXNzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgY2xhc3MgZnJvbSB0aGUgYmxvY2sgZGlyZWN0bHkgYWJvdmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYm92ZUNsYXNzID0gdGhpcy5ib2FyZFtpIC0gMV1baUNvbEluZGV4XVtcImNsYXNzXCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB0Yl8ke2lDb2xJbmRleC50b1N0cmluZygpfV8ke2kudG9TdHJpbmcoKX1gXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYm9hcmRbaV1baUNvbEluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibG9jay5oYXNPd25Qcm9wZXJ0eShcImNsYXNzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShibG9ja1tcImNsYXNzXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFib3ZlQ2xhc3MgIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NvcHkgZG93biB0aGUgY2xhc3MgZnJvbSBhYm92ZSB0byB0aGUgYmxvY2sgaW4gdGhpcyByb3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKGFib3ZlQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbaV1baUNvbEluZGV4XSA9IHsgY2xhc3M6IGFib3ZlQ2xhc3MgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9CbGFuayBibG9jayAobm8gYmxvY2sgYWJvdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtpXVtpQ29sSW5kZXhdID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobm9Sb3dzRWxpbWluYXRlZCA+IDApIHtcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgc2NvcmVcbiAgICAgICAgICAgIHRoaXMuc2NvcmUobm9Sb3dzRWxpbWluYXRlZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYm9vbGVhbiB3aGV0aGVyIGEgcm93IGFuZCBjb2x1bW4gZXhpc3QgaW4gdGhlIGJvYXJkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvd1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb2xcbiAgICAgKi9cbiAgICBkb2VzQm9hcmRQb3NpdGlvbkV4aXN0KHJvdywgY29sKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJvYXJkW3Jvd10gJiYgdGhpcy5ib2FyZFtyb3ddW2NvbF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2NvcmUgYSBtb3ZlIGJhc2VkIG9uIHRoZSBudW1iZXIgb2Ygcm93cyBlbGltaW5hdGVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW50IG5vX3Jvd3NfZWxpbWluYXRlZCBUaGUgbnVtYmVyIG9mIHJvd3MgZWxpbWluYXRlZC5cbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzY29yZShub19yb3dzX2VsaW1pbmF0ZWQpIHtcbiAgICAgICAgbGV0IG11bHRpcGxlX3Jvd19ib251cyA9IDA7XG4gICAgICAgIGxldCBjdXJyZW50X211bHRpcGxpZXIgPVxuICAgICAgICAgICAgU0VUVElOR1MuR0FNRV9TQ09SRV9NVUxUSVBMSUVSICogdGhpcy5jdXJyZW50R2FtZS5sZXZlbDtcblxuICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLnJvd3NFbGltaW5hdGVkID1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudEdhbWUucm93c0VsaW1pbmF0ZWQgKyBub19yb3dzX2VsaW1pbmF0ZWQ7XG5cbiAgICAgICAgaWYgKG5vX3Jvd3NfZWxpbWluYXRlZCA+IDEpIHtcbiAgICAgICAgICAgIC8vIEdpdmUgdXNlcnMgYSBib251cyBmb3IgZWxpbWluYXRpbmcgbW9yZSB0aGFuIG9uZSByb3dcbiAgICAgICAgICAgIG11bHRpcGxlX3Jvd19ib251cyA9XG4gICAgICAgICAgICAgICAgbm9fcm93c19lbGltaW5hdGVkICogKGN1cnJlbnRfbXVsdGlwbGllciAqIDAuNSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50R2FtZS5zY29yZSA9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLnNjb3JlICtcbiAgICAgICAgICAgIG5vX3Jvd3NfZWxpbWluYXRlZCAqIGN1cnJlbnRfbXVsdGlwbGllciArXG4gICAgICAgICAgICBtdWx0aXBsZV9yb3dfYm9udXM7XG5cbiAgICAgICAgdGhpcy5zZXRTY29yZVRleHQoKTtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50R2FtZS5yb3dzRWxpbWluYXRlZCA9PSBTRVRUSU5HUy5CT0FSRF9ST1dTX0hJR0gpIHtcbiAgICAgICAgICAgIC8vIExldmVsIHVwXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLnJvd3NFbGltaW5hdGVkID0gMDtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50R2FtZS5sZXZlbCA9IHRoaXMuY3VycmVudEdhbWUubGV2ZWwgKyAxO1xuXG4gICAgICAgICAgICB0aGlzLnNldExldmVsVGV4dCgpO1xuXG4gICAgICAgICAgICAvLyBJbmNyZWFzZSB0aGUgc3BlZWQgb2YgdGhlIGdhbWUgaW50ZXJ2YWxcbiAgICAgICAgICAgIHRoaXMuZ2FtZUludGVydmFsVGltZXIubXMgPSB0aGlzLmdhbWVJbnRlcnZhbFRpbWVyLm1zIC0gMjA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIFNjb3JlIHRleHRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNldFNjb3JlVGV4dCgpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICB0aGlzLkRPTV9JRFMuU0NPUkVfQ09OVEFJTkVSXG4gICAgICAgICkuaW5uZXJUZXh0ID0gdGhpcy5jdXJyZW50R2FtZS5zY29yZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIExldmVsIHRleHQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzZXRMZXZlbFRleHQoKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5ET01fSURTLkxFVkVMX0NPTlRBSU5FUik7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IFwiTEVWRUwgXCIgKyB0aGlzLmN1cnJlbnRHYW1lLmxldmVsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgY3VycmVudCBibG9jayBmcm9tIHRoZSBib2FyZFxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgcmVtb3ZlQ3VycmVudEJsb2NrRnJvbUJvYXJkKCkge1xuICAgICAgICAvL1JlbW92ZSB0aGUgY3VycmVudCBjbGFzcyBmcm9tIHRoZSB2aXNpYmxlIGJsb2Nrc1xuICAgICAgICBmb3IgKGxldCBibG9ja19pZCBvZiB0aGlzLmN1cnJlbnRCbG9jay5ibG9ja0lkcykge1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9ja19pZCk7XG4gICAgICAgICAgICBibG9jay5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY3VycmVudEJsb2NrLmNsYXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vUmVzZXQgdGhlIGN1cnJlbnQgc2V0IG9mIGJsb2Nrc1xuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5ibG9ja0lkcyA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5ibG9ja1Bvc2l0aW9ucyA9IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgbmV4dCBibG9jayB0byB0aGUgYm9hcmRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIG5leHRCbG9jaygpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNQYXVzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc2V0IGFsbCB0aGUgdmFyaWFibGVzXG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrSWRzID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrUG9zaXRpb25zID0gW107XG5cbiAgICAgICAgLy8gVGhlIHByZXZpZXcgYmxvY2sgYmVjb21lcyB0aGUgY3VycmVudCBwaWVjZVxuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay50eXBlID0gdGhpcy5wcmV2aWV3UGllY2UudHlwZTtcbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suY2xhc3MgPSBCTE9DS1NbdGhpcy5jdXJyZW50QmxvY2sudHlwZV1bXCJjbGFzc1wiXTtcblxuICAgICAgICAvLyBSZXNldCB0aGUgc3RhcnQgbG9jYXRpb24gZm9yIHRoZSBibG9jayB0byBhcHBlYXJcbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2sucm93ID0gMTtcbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suY29sID0gU0VUVElOR1MuUElFQ0VfU1RBUlRfQ09MO1xuXG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLnBvc2l0aW9uID0gMDtcblxuICAgICAgICB0aGlzLm1vdmVCbG9jayhcIm5vbmVcIik7XG5cbiAgICAgICAgLy9SZXNldCB0aGUgZ2FtZSBpbnRlcnZhbFxuICAgICAgICB0aGlzLmtpbGxHYW1lSW50ZXJ2YWwoKTtcbiAgICAgICAgdGhpcy5zdGFydEdhbWVJbnRlcnZhbCgpO1xuXG4gICAgICAgIC8vIE1ha2UgdGhlIG5leHQgcHJldmlldyBibG9ja1xuICAgICAgICB0aGlzLm1ha2VQcmV2aWV3UGllY2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCB0aGUga2V5Ym9hcmQgZXZlbnRzLlxuICAgICAqICAgLSBBcnJvdyBrZXlzIGNvbnRyb2wgdGhlIG1vdGlvbiBvZiB0aGUgYmxvY2tzLlxuICAgICAqICAgLSAncCcgUGF1c2VzIHRoZSBnYW1lLlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2V0dXBLZXlFdmVudHMoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGUgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgICAgICAvLyBMZWZ0IGFycm93IGtleVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVCbG9jayhcImxlZnRcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICAgICAgLy8gVXAgYXJyb3cga2V5XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUJsb2NrKFwidXBcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICAgICAgLy8gUmlnaHQgYXJyb3cga2V5XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUJsb2NrKFwicmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgLy8gRG93biBhcnJvdyBrZXlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmxvY2soXCJkb3duXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgODA6XG4gICAgICAgICAgICAgICAgICAgIC8vICdwJyBwcmVzc2VkIHRvIHBhdXNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF1c2VHYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdCAtIGRvbid0IGRvIGFueXRoaW5nXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gKHNjcm9sbCBvciBjaGFyLW1vdmUpXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHBsYXlpbmdcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHN0YXJ0UGxheSgpIHtcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLnByZXZpZXdQaWVjZS50eXBlID09IFwiXCIpIHtcbiAgICAgICAgICAgIC8vTmV3IGdhbWUgaXMgc3RhcnRpbmdcblxuICAgICAgICAgICAgLy9HZW5lcmF0ZSB0aGUgZmlyc3QgYmxvY2sgdHlwZVxuICAgICAgICAgICAgdGhpcy5wcmV2aWV3UGllY2UudHlwZSA9IHRoaXMuZ2VuZXJhdGVSYW5kb21CbG9ja1R5cGUoKTtcblxuICAgICAgICAgICAgLy9DcmVhdGUgdGhlIG5ldyBwaWVjZVxuICAgICAgICAgICAgdGhpcy5uZXh0QmxvY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhcnRHYW1lSW50ZXJ2YWwoKTtcblxuICAgICAgICB0aGlzLmhpZGVNZXNzYWdlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgdGhlIGdhbWUgaW50ZXJ2YWxcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHN0YXJ0R2FtZUludGVydmFsKCkge1xuICAgICAgICBpZiAoIXRoaXMuZ2FtZUludGVydmFsVGltZXIub2JqKSB7XG4gICAgICAgICAgICAvLyBTZXR1cCB0aGUgaW50ZXJ2YWwgb2JqZWN0IHVzaW5nIHRoZSBzdGQganMgZnVuY3Rpb25cbiAgICAgICAgICAgIHRoaXMuZ2FtZUludGVydmFsVGltZXIub2JqID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vU3RhcnQgdGhlIGFjdGlvbiAoanVzdCBtb3ZlIHRoZSBjdXJyZW50IHBpZWNlIGRvd24pXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmxvY2soXCJkb3duXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5tcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdG9wIHRoZSBnYW1lIGludGVydmFsXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBraWxsR2FtZUludGVydmFsKCkge1xuICAgICAgICAvLyBDbGVhciBpdCB1c2luZyB0aGUgc3RhbmRhcmQganMgZnVuY3Rpb25cbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVJbnRlcnZhbFRpbWVyLm9iaik7XG4gICAgICAgIHRoaXMuZ2FtZUludGVydmFsVGltZXIub2JqID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGF1c2Ugb3IgdW5wYXVzZSB0aGUgZ2FtZVxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgcGF1c2VHYW1lKCkge1xuICAgICAgICBpZiAodGhpcy5pc1BhdXNlZCkge1xuICAgICAgICAgICAgLy9BbHJlYWR5IHBhdXNlZCwgc28gc3RhcnQgdGhlIGdhbWVcbiAgICAgICAgICAgIHRoaXMuc3RhcnRQbGF5KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5raWxsR2FtZUludGVydmFsKCk7XG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIFNob3cgdGhlIHBhdXNlZCBtb2RhbCBtZXNzYWdlIChmcm9tIHRlbXBsYXRlKVxuICAgICAgICB0aGlzLnNob3dNZXNzYWdlKFwicGF1c2VkXCIpO1xuICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRldHJqcy1wYXVzZS1wbGF5XCIpO1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRQbGF5KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdhbWUgb3ZlciBvY2N1cnJlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIGdhbWVPdmVyKCkge1xuICAgICAgICB0aGlzLmlzUGF1c2VkID0gdHJ1ZTtcblxuICAgICAgICAvLyBTdG9wIHRoZSBnYW1lIGludGVydmFsXG4gICAgICAgIHRoaXMua2lsbEdhbWVJbnRlcnZhbCgpO1xuXG4gICAgICAgIHZhciB0ZW1wbGF0ZV92YXJzID0ge1xuICAgICAgICAgICAgc2NvcmU6IHRoaXMuY3VycmVudEdhbWVbXCJzY29yZVwiXSxcbiAgICAgICAgICAgIHJvd3NFbGltaW5hdGVkOiB0aGlzLmN1cnJlbnRHYW1lW1wicm93c0VsaW1pbmF0ZWRcIl0sXG4gICAgICAgICAgICBsZXZlbDogdGhpcy5jdXJyZW50R2FtZVtcImxldmVsXCJdXG4gICAgICAgIH07XG4gICAgICAgIC8vIFNob3cgdGhlIGdhbWVvdmVyIG1vZGFsIG1lc3NhZ2UgKGZyb20gdGVtcGxhdGUpXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXCJnYW1lb3ZlclwiLCB0ZW1wbGF0ZV92YXJzKTtcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXRyanMtZ2FtZW92ZXItbmV3Z2FtZVwiKTtcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgICAgICAgIHRoaXMubmV3R2FtZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCBhIG5ldyBnYW1lXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKiovXG4gICAgbmV3R2FtZSgpIHtcbiAgICAgICAgLy8gU3RvcCB0aGUgZ2FtZSBpbnRlcnZhbFxuICAgICAgICB0aGlzLmtpbGxHYW1lSW50ZXJ2YWwoKTtcblxuICAgICAgICAvLyBSZXNldCB0aGUgdGhlIHNjb3JlLCBsZXZlbCwgYW5kIGludGVydmFsXG4gICAgICAgIHRoaXMuY3VycmVudEdhbWUuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLmxldmVsID0gMTtcbiAgICAgICAgdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5tcyA9IFNFVFRJTkdTLkdBTUVfSU5URVJWQUxfTVM7XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIHNjb3JlIGFuZCBsZXZlbCB0ZXh0XG4gICAgICAgIHRoaXMuc2V0U2NvcmVUZXh0KCk7XG4gICAgICAgIHRoaXMuc2V0TGV2ZWxUZXh0KCk7XG5cbiAgICAgICAgLy8gU2V0dXAgdGhlIG1haW4gYW5kIHByZXZpZXcgYm9hcmRzXG4gICAgICAgIHRoaXMuc2V0dXBCb2FyZCgpO1xuICAgICAgICB0aGlzLnNldHVwUHJldmlld0JvYXJkKCk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBvbGQgcHJldmlldyBwaWVjZSB0eXBlXG4gICAgICAgIHRoaXMucHJldmlld1BpZWNlLnR5cGUgPSBcIlwiO1xuXG4gICAgICAgIC8vIFN0YXJ0IHRoZSBnYW1lXG4gICAgICAgIHRoaXMuc3RhcnRQbGF5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgaW50cm9kdWN0aW9uIG1lc3NhZ2U7XG4gICAgICogc2hvdWxkIGJlIHJ1biB3aGVuIGdhbWUgbG9hZHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKiovXG4gICAgc2hvd0ludHJvKCkge1xuICAgICAgICB0aGlzLnNldHVwQm9hcmQoKTtcbiAgICAgICAgdGhpcy5zZXR1cFByZXZpZXdCb2FyZCgpO1xuXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXCJpbnRyb1wiKTtcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXRyanMtaW50cm8tbmV3Z2FtZVwiKTtcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgICAgICAgIHRoaXMubmV3R2FtZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBBYm91dCBQb3BvdmVyXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzaG93QWJvdXQoKSB7XG4gICAgICAgIHRoaXMua2lsbEdhbWVJbnRlcnZhbCgpO1xuICAgICAgICB0aGlzLmlzUGF1c2VkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnNob3dNZXNzYWdlKFwiYWJvdXRcIik7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV0cmpzLWFib3V0LWNsb3NlXCIpO1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGFydFBsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyBhIG1lc3NhZ2UgaW4gdGhlIG1vZGFsIHdpbmRvdy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNob3dNZXNzYWdlKHRlbXBsYXRlX25hbWUsIHZhcnMpIHtcbiAgICAgICAgY29uc3QgZWxNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRE9NX0lEUy5NT0RBTCk7XG4gICAgICAgIGNvbnN0IGVsVmVpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRE9NX0lEUy5NT0RBTF9WRUlMKTtcblxuICAgICAgICBjb25zdCBodG1sID0gdGVtcGxhdGVzW3RlbXBsYXRlX25hbWVdKHZhcnMpO1xuXG4gICAgICAgIGVsTW9kYWwuaW5uZXJIVE1MID0gaHRtbDtcblxuICAgICAgICB1dGlsLmZhZGVJbihlbFZlaWwsICgpID0+IHtcbiAgICAgICAgICAgIGVsTW9kYWwuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICBlbE1vZGFsLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICAvL0NlbnRlciB0aGUgbWVzc2FnZSBpbiB0aGUgdmVpbFxuICAgICAgICAgICAgY29uc3QgbGVmdE9mZnNldCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKGVsVmVpbC5vZmZzZXRXaWR0aCAtIGVsTW9kYWwub2Zmc2V0V2lkdGgpIC8gMlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IHRvcE9mZnNldCA9IE1hdGguZmxvb3IoXG4gICAgICAgICAgICAgICAgKGVsVmVpbC5vZmZzZXRIZWlnaHQgLSBlbE1vZGFsLm9mZnNldEhlaWdodCkgLyAyXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBlbE1vZGFsLnN0eWxlLmxlZnQgPSBsZWZ0T2Zmc2V0ICsgXCJweFwiO1xuICAgICAgICAgICAgZWxNb2RhbC5zdHlsZS50b3AgPSB0b3BPZmZzZXQgKyBcInB4XCI7XG4gICAgICAgICAgICBlbE1vZGFsLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIaWRlIHRoZSBtb2RhbCBtZXNzYWdlLlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgaGlkZU1lc3NhZ2UoKSB7XG4gICAgICAgIHZhciBlbE1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5ET01fSURTLk1PREFMKTtcbiAgICAgICAgdmFyIGVsVmVpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRE9NX0lEUy5NT0RBTF9WRUlMKTtcbiAgICAgICAgdXRpbC5mYWRlT3V0KGVsTW9kYWwsICgpID0+IHtcbiAgICAgICAgICAgIC8vQ2xlYXIgYWZ0ZXIgdGhlIGZhZGVcbiAgICAgICAgICAgIGVsTW9kYWwuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgfSk7XG4gICAgICAgIHV0aWwuZmFkZU91dChlbFZlaWwsICgpID0+IHt9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW4gdGV0cmpzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHN0cmluZyBjb250YWluZXJJRCBUaGUgY29udGFpbmVyIGlkIGZvciB0ZXRyanMuXG4gICAgICovXG4gICAgcnVuKGNvbnRhaW5lcklEKSB7XG4gICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29udGFpbmVySUQpO1xuICAgICAgICBlbC5pbm5lckhUTUwgPSB0ZW1wbGF0ZXNbXCJjb250YWluZXJcIl0oKTtcblxuICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRldHJqcy1idXR0b24tcGF1c2VcIik7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBhdXNlR2FtZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBuZXdCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRldHJqcy1idXR0b24tbmV3XCIpO1xuICAgICAgICBuZXdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5uZXdHYW1lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGFib3V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXRyanMtYnV0dG9uLWFib3V0XCIpO1xuICAgICAgICBhYm91dC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNob3dBYm91dCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNldHVwS2V5RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5zaG93SW50cm8oKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiaGFzQ2xhc3MiLCJlbGUiLCJjbHMiLCJjbGFzc05hbWUiLCJtYXRjaCIsIlJlZ0V4cCIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJyZWciLCJyZXBsYWNlIiwiZmFkZUluIiwiZWxlbWVudCIsImNiIiwib3AiLCJzdHlsZSIsImRpc3BsYXkiLCJ0aW1lciIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsIm9wYWNpdHkiLCJmaWx0ZXIiLCJmYWRlT3V0Iiwib3V0ZXJIZWlnaHQiLCJvdXRlcldpZHRoIiwiQkxPQ0tfVFlQRVMiLCJCTE9DS1MiLCJTVFJBSUdIVCIsImNsYXNzIiwibm9fcG9zaXRpb25zIiwicG9zaXRpb25zIiwidHJhbnNfcm93IiwidHJhbnNfY29sIiwicm93cyIsIkxfTEVGVCIsIkxfUklHSFQiLCJTUVVBUkUiLCJTIiwiWiIsIlQiLCJTRVRUSU5HUyIsIkJPQVJEX0NPTFNfV0lERSIsIkJPQVJEX1JPV1NfSElHSCIsIlBJRUNFX1NUQVJUX0NPTCIsIlBJRUNFX1NUQVJUX1JPVyIsIlBJRUNFX1NUQVJUX1BPUyIsIkdBTUVfSU5URVJWQUxfTVMiLCJHQU1FX1NDT1JFX01VTFRJUExJRVIiLCJDRUxMX1dJRFRIX1BYIiwiQ0VMTF9IRUlHSFRfUFgiLCJhYm91dCIsImNvbnRhaW5lciIsImdhbWVvdmVyIiwic2NvcmUiLCJyb3dzRWxpbWluYXRlZCIsImxldmVsIiwiaW50cm8iLCJwYXVzZWQiLCJUZXRyanMiLCJCT0FSRF9XUkFQUEVSIiwiQk9BUkQiLCJQUkVWSUVXX0NPTlRBSU5FUiIsIlNDT1JFX0NPTlRBSU5FUiIsIkxFVkVMX0NPTlRBSU5FUiIsIk1PREFMIiwiTU9EQUxfVkVJTCIsIkJPQVJEX0JMT0NLIiwidHlwZSIsImJsb2NrSWRzIiwiYmxvY2tQb3NpdGlvbnMiLCJyb3ciLCJjb2wiLCJwb3NpdGlvbiIsImJsb2NrcyIsIm9iaiIsIm1zIiwiZWxCb2FyZCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJET01fSURTIiwiZWxXcmFwcGVyIiwiaW5uZXJIVE1MIiwiYm9hcmQiLCJib2FyZFdpZHRoIiwiYm9hcmRIZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImkiLCJ0b3BfcG9zIiwiaiIsImxlZnRfcG9zIiwiYmxvY2siLCJjcmVhdGVFbGVtZW50IiwibGVmdCIsInRvU3RyaW5nIiwidG9wIiwiRE9NX0NMQVNTRVMiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsImVsUHJldmlld0JvYXJkIiwicHJldmlld19zZWN0aW9uc193aWRlIiwicHJldmlld19zZWN0aW9uc19oaWdoIiwidG9wUG9zIiwibGVmdFBvcyIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImxlbmd0aCIsImlzUGF1c2VkIiwicHJldmlld1BpZWNlIiwiYmxvY2tfaWQiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJnZW5lcmF0ZVJhbmRvbUJsb2NrVHlwZSIsInN0YXJ0Q29sIiwic3RhcnRSb3ciLCJibG9ja1Jvd3MiLCJyb3dJbmRleCIsImNvbEluZGV4IiwiYmxvY2tDb2wiLCJibG9ja1JvdyIsImlkIiwiZWwiLCJhZGQiLCJwdXNoIiwiZGVzaXJlZERpcmVjdGlvbiIsImRlc2lyZWRQb3NpdGlvbiIsImN1cnJlbnRCbG9jayIsImJsb2NrTnVtUG9zaXRpb25zIiwiYmxvY2tQb3NUcmFuc1JvdyIsImJsb2NrUG9zVHJhbnNDb2wiLCJuZXh0RGVzaXJlZFBvc2l0aW9uIiwibG9ja0N1cnJlbnRCbG9jayIsImxvd2VzdENvbCIsImxvd2VzdFJvdyIsInBvc2l0aW9uSXNBdmFpbGFibGUiLCJ0bXBQaWVjZUNvbFBvcyIsInRtcFBpZWNlUm93UG9zIiwiZGVzaXJlZENvbCIsImRlc2lyZWRSb3ciLCJoYXNPd25Qcm9wZXJ0eSIsImdhbWVPdmVyIiwiZG9lc0JvYXJkUG9zaXRpb25FeGlzdCIsInJlbW92ZUN1cnJlbnRCbG9ja0Zyb21Cb2FyZCIsInBvcyIsInRtcElkIiwiZG9tQmxvY2siLCJjaGVja0FuZEVsaW1pbmF0ZVJvd3MiLCJuZXh0QmxvY2siLCJub1Jvd3NFbGltaW5hdGVkIiwiY29sdW1uRmlsbENvdW50IiwiaUNvbEluZGV4IiwiYWJvdmVDbGFzcyIsIm5vX3Jvd3NfZWxpbWluYXRlZCIsIm11bHRpcGxlX3Jvd19ib251cyIsImN1cnJlbnRfbXVsdGlwbGllciIsImN1cnJlbnRHYW1lIiwic2V0U2NvcmVUZXh0Iiwic2V0TGV2ZWxUZXh0IiwiZ2FtZUludGVydmFsVGltZXIiLCJpbm5lclRleHQiLCJtb3ZlQmxvY2siLCJraWxsR2FtZUludGVydmFsIiwic3RhcnRHYW1lSW50ZXJ2YWwiLCJtYWtlUHJldmlld1BpZWNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJrZXlDb2RlIiwicGF1c2VHYW1lIiwicHJldmVudERlZmF1bHQiLCJoaWRlTWVzc2FnZSIsInN0YXJ0UGxheSIsInNob3dNZXNzYWdlIiwiYnV0dG9uIiwiZXYiLCJ0ZW1wbGF0ZV92YXJzIiwibmV3R2FtZSIsInNldHVwQm9hcmQiLCJzZXR1cFByZXZpZXdCb2FyZCIsInRlbXBsYXRlX25hbWUiLCJ2YXJzIiwiZWxNb2RhbCIsImVsVmVpbCIsImh0bWwiLCJ0ZW1wbGF0ZXMiLCJ1dGlsIiwibGVmdE9mZnNldCIsIm9mZnNldFdpZHRoIiwidG9wT2Zmc2V0Iiwib2Zmc2V0SGVpZ2h0IiwiY29udGFpbmVySUQiLCJuZXdCdXR0b24iLCJzaG93QWJvdXQiLCJzZXR1cEtleUV2ZW50cyIsInNob3dJbnRybyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFBOzs7Ozs7RUFNQSxTQUFTQSxRQUFULENBQWtCQyxHQUFsQixFQUF1QkMsR0FBdkIsRUFBNEI7RUFDeEIsU0FBTyxDQUFDLENBQUNELEdBQUcsQ0FBQ0UsU0FBSixDQUFjQyxLQUFkLENBQW9CLElBQUlDLE1BQUosQ0FBVyxZQUFZSCxHQUFaLEdBQWtCLFNBQTdCLENBQXBCLENBQVQ7RUFDSDtFQUVEOzs7Ozs7OztFQU1BLFNBQVNJLFFBQVQsQ0FBa0JMLEdBQWxCLEVBQXVCQyxHQUF2QixFQUE0QjtFQUN4QixNQUFJLENBQUNGLFFBQVEsQ0FBQ0MsR0FBRCxFQUFNQyxH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

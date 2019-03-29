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
    return "\n    <!-- The Game Container -->\n    <div id=\"tetrjs-container\">\n        <div id=\"tetrjs-title-container\">Tetrjs</div>\n        <div id=\"tetrjs-board-wrapper\"><div id=\"tetrjs-board\"></div></div>\n        <div id=\"tetrjs-next-piece-preview-container\"></div>\n        <div id=\"tetrjs-score-container\"></div>\n        <div id=\"tetrjs-level-container\"></div>\n        <div id=\"tetrjs-actions-container\">\n            <br />\n            <button id=\"tetrjs-button-pause\">\n                <div class=\"icon\">&#9613;&#9613;</div>\n                <div class=\"button-text\">Pause</div>\n            </button>\n            <br />\n            <br />\n            <button id=\"tetrjs-button-new\">New Game</button>\n            <br />\n            <br />\n            <button id=\"tetrjs-button-about\">\n                About Tetrjs\n            </button>\n        </div>\n        <div id=\"tetrjs-modal-veil\"></div>\n        <div id=\"tetrjs-modal\"></div>\n    </div>\n";
  };

  var gameover = function gameover(_ref) {
    var score = _ref.score,
        rowsEliminated = _ref.rowsEliminated,
        level = _ref.level;
    return "\n    Game Over! <br /><br />\n    <table border=\"0\" id=\"tetrjs-gameover-table\">\n        <tbody>\n            <tr>\n                <td><strong>Score:</strong></td>\n                <td>".concat(score, "</td>\n            </tr>\n            <tr>\n                <td><strong>Lines:</strong></td>\n                <td>").concat(rowsEliminated, "</td>\n            </tr>\n            <tr>\n                <td><strong>Level:</strong></td>\n                <td>").concat(level, "</td>\n            </tr>\n        </tbody>\n    </table>\n    <br />\n    <button id=\"tetrjs-gameover-newgame\">New Game</button>\n");
  };

  var intro = function intro() {
    return "\n    <button type=\"button\" id=\"tetrjs-intro-newgame\">\n        <span>\u25B6</span>&nbsp;&nbsp;Play Tetrjs!\n    </button>\n\n    <br /><br />\n    Arrow keys control the pieces.\n    <br />\n    &nbsp;\n\n    <div id=\"tetrjs-arrows-container\">\n        <div id=\"up\">\u2B06</div>\n        <br />\n        <div id=\"left\">\u2B05</div>\n        <div id=\"down\">\u2B07</div>\n        <div id=\"right\">\u27A1</div>\n    </div>\n";
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
        this.board = {}; // Set the wrapper size

        var wrapperWidth = SETTINGS.BOARD_COLS_WIDE * SETTINGS.CELL_WIDTH_PX;
        var wrapperHeight = (SETTINGS.BOARD_ROWS_HIGH - 1) * SETTINGS.CELL_HEIGHT_PX;
        elWrapper.style.width = "".concat(wrapperWidth, "px");
        elWrapper.style.height = "".concat(wrapperHeight, "px"); // Set the board size

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbInNyYy91dGlsLmpzIiwic3JjL2Jsb2Nrcy5qcyIsInNyYy9zZXR0aW5ncy5qcyIsInNyYy90ZW1wbGF0ZXMuanMiLCJzcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEZXRlcm1pbmUgaWYgYW4gZWxlbWVudCBoYXMgYSBjbGFzcy5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbHNcbiAqL1xuZnVuY3Rpb24gaGFzQ2xhc3MoZWxlLCBjbHMpIHtcbiAgICByZXR1cm4gISFlbGUuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoXCIoXFxcXHN8XilcIiArIGNscyArIFwiKFxcXFxzfCQpXCIpKTtcbn1cblxuLyoqXG4gKiBBZGQgYSBjbGFzcyB0byBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZVxuICogQHBhcmFtIHtzdHJpbmd9IGNsc1xuICovXG5mdW5jdGlvbiBhZGRDbGFzcyhlbGUsIGNscykge1xuICAgIGlmICghaGFzQ2xhc3MoZWxlLCBjbHMpKSBlbGUuY2xhc3NOYW1lICs9IFwiIFwiICsgY2xzO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNsYXNzIGZyb20gYW4gZWxlbWVudFxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZVxuICogQHBhcmFtIHtzdHJpbmd9IGNsc1xuICovXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbGUsIGNscykge1xuICAgIGlmIChoYXNDbGFzcyhlbGUsIGNscykpIHtcbiAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoXFxcXHN8XilcIiArIGNscyArIFwiKFxcXFxzfCQpXCIpO1xuICAgICAgICBlbGUuY2xhc3NOYW1lID0gZWxlLmNsYXNzTmFtZS5yZXBsYWNlKHJlZywgXCIgXCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNjEyMTI3MFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2JcbiAqL1xuZnVuY3Rpb24gZmFkZUluKGVsZW1lbnQsIGNiKSB7XG4gICAgdmFyIG9wID0gMC4xOyAvLyBpbml0aWFsIG9wYWNpdHlcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgdmFyIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChvcCA+PSAwLjUpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICAgICAgcmV0dXJuIGNiKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gb3A7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZmlsdGVyID0gXCJhbHBoYShvcGFjaXR5PVwiICsgb3AgKiAxMDAgKyBcIilcIjtcbiAgICAgICAgb3AgKz0gb3AgKiAwLjE7XG4gICAgfSwgMTApO1xufVxuXG4vKipcbiAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS82MTIxMjcwXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYlxuICovXG5mdW5jdGlvbiBmYWRlT3V0KGVsZW1lbnQsIGNiKSB7XG4gICAgdmFyIG9wID0gMTsgLy8gaW5pdGlhbCBvcGFjaXR5XG4gICAgdmFyIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChvcCA8PSAwLjEpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICByZXR1cm4gY2IoKTtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBvcDtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5maWx0ZXIgPSBcImFscGhhKG9wYWNpdHk9XCIgKyBvcCAqIDEwMCArIFwiKVwiO1xuICAgICAgICBvcCAtPSBvcCAqIDAuMTtcbiAgICB9LCAxMCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBoYXNDbGFzcyxcbiAgICBhZGRDbGFzcyxcbiAgICByZW1vdmVDbGFzcyxcbiAgICBmYWRlSW4sXG4gICAgZmFkZU91dCxcbiAgICBvdXRlckhlaWdodCxcbiAgICBvdXRlcldpZHRoXG59O1xuIiwiLypcbiAqIERlZmluZXMgdGhlIFRldHJqcyBibG9jayB0eXBlcyBhbmQgdGhlaXJcbiAqIHBvc3NpYmxlIHBvc2l0aW9ucy5cbiAqXG4gKiBAYXV0aG9yIERlc3RpbiBNb3VsdG9uXG4gKiBAdmVyc2lvbiAxLjBcbiAqIEBsaWNlbnNlIE1JVFxuICpcbiAqXG4gKiBUaGUgQkxPQ0tTIG9iamVjdCBpcyBrZXllZCB0byB0aGUgYmxvY2sgbmFtZXMgZGVmaW5lZCBpbiBCTE9DS19UWVBFUy5cbiAqXG4gKiBFYWNoIEJMT0NLIGlzIGNvbXBvc2VkIG9mOlxuICogJ2NsYXNzJzogVGhlIGNzcyBjbGFzcyBmb3IgdGhlIGFjdGl2ZSBibG9ja3MuXG4gKiAnbm9fcG9zaXRpb25zJzogVGhlIG51bWJlciBvZiBwb3NzaWJsZSBwb3NpdGlvbnMgZm9yIGEgYmxvY2suXG4gKiAncG9zaXRpb25zJzogT2JqZWN0IHRvIHN0b3JlIHRoZSBkaWZmZXJlbnQgYmxvY2sgcG9zaXRpb25zXG4gKiAgICAndHJhbnNfcm93JzogdGhlIHJvdyB3aGVyZSB0aGUgYmxvY2sgaXMgXCJyb3RhdGVkXCIgZm9yIGEgcG9zaXRpb25cbiAqICAgICd0cmFuc19jb2wnOiB0aGUgY29sIHdoZXJlIHRoZSBibG9jayBpcyBcInJvdGF0ZWRcIiBmb3IgYSBwb3NpdGlvblxuICogICAgJ3Jvd3MnOiB0aGUgcm93cyB0aGF0IGZvcm0gdGhlIGJsb2NrLlxuICogICAgICAgICAgICAtIEVhY2ggcm93IGlzIGFuIG9iamVjdCBpbiB7Y29sdW1uOmJvb2xlYW4sIC4uLn0gZm9ybWF0XG4gKiAgICAgICAgICAgICAgaS5lLiBTdHJhaWdodCBibG9ja3MgaW4gdGhlIDFzdCAoMHRoKSBwb3NpdGlvbiBhcmVcbiAqICAgICAgICAgICAgICAgICAgIGFjdGl2ZSBpbiBhbGwgNCBjb2x1bW5zOiB7MDoxLCAxOjEsIDI6MSwgMzoxfVxuICpcbiAqL1xuXG5jb25zdCBCTE9DS19UWVBFUyA9IFtcIlNUUkFJR0hUXCIsIFwiTF9MRUZUXCIsIFwiTF9SSUdIVFwiLCBcIlNRVUFSRVwiLCBcIlNcIiwgXCJaXCIsIFwiVFwiXTtcblxuY29uc3QgQkxPQ0tTID0ge1xuICAgIFNUUkFJR0hUOiB7XG4gICAgICAgIGNsYXNzOiBcInRldHJqcy1ibG9jay1zdHJhaWdodFwiLFxuICAgICAgICBub19wb3NpdGlvbnM6IDIsXG4gICAgICAgIHBvc2l0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IC0xLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMSwgMSwgMSwgMV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogLTEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAxLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMV0sIFsxXSwgWzFdLCBbMV1dXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuICAgIExfTEVGVDoge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stbC1sZWZ0XCIsXG4gICAgICAgIG5vX3Bvc2l0aW9uczogNCxcbiAgICAgICAgcG9zaXRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAxLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogLTEsXG4gICAgICAgICAgICAgICAgcm93czogW1sxLCAxLCAxXSwgWzAsIDAsIDFdXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IC0xLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzAsIDFdLCBbMCwgMV0sIFsxLCAxXV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAwLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzEsIDAsIDBdLCBbMSwgMSwgMV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMCxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDEsXG4gICAgICAgICAgICAgICAgcm93czogW1sxLCAxXSwgWzEsIDBdLCBbMSwgMF1dXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuXG4gICAgTF9SSUdIVDoge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stbC1yaWdodFwiLFxuICAgICAgICBub19wb3NpdGlvbnM6IDQsXG4gICAgICAgIHBvc2l0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IC0xLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMSwgMSwgMV0sIFsxLCAwLCAwXV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAtMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czogW1sxLCAxXSwgWzAsIDFdLCBbMCwgMV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMCxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czogW1swLCAwLCAxXSwgWzEsIDEsIDFdXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDAsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAxLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMSwgMF0sIFsxLCAwXSwgWzEsIDFdXVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSxcblxuICAgIFNRVUFSRToge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stc3F1YXJlXCIsXG4gICAgICAgIG5vX3Bvc2l0aW9uczogMSxcbiAgICAgICAgcG9zaXRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAwLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzEsIDFdLCBbMSwgMV1dXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuXG4gICAgUzoge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stc1wiLFxuICAgICAgICBub19wb3NpdGlvbnM6IDIsXG4gICAgICAgIHBvc2l0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czogW1swLCAxLCAxXSwgWzEsIDEsIDBdXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IC0xLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzEsIDBdLCBbMSwgMV0sIFswLCAxXV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0sXG5cbiAgICBaOiB7XG4gICAgICAgIGNsYXNzOiBcInRldHJqcy1ibG9jay16XCIsXG4gICAgICAgIG5vX3Bvc2l0aW9uczogMixcbiAgICAgICAgcG9zaXRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAxLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzEsIDEsIDBdLCBbMCwgMSwgMV1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogLTEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAwLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMCwgMV0sIFsxLCAxXSwgWzEsIDBdXVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSxcblxuICAgIFQ6IHtcbiAgICAgICAgY2xhc3M6IFwidGV0cmpzLWJsb2NrLXRcIixcbiAgICAgICAgbm9fcG9zaXRpb25zOiA0LFxuICAgICAgICBwb3NpdGlvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAtMSxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzEsIDEsIDFdLCBbMCwgMSwgMF1dXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogLTEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAwLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMCwgMV0sIFsxLCAxXSwgWzAsIDFdXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDAsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAwLFxuICAgICAgICAgICAgICAgIHJvd3M6IFtbMCwgMSwgMF0sIFsxLCAxLCAxXV1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAwLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMSxcbiAgICAgICAgICAgICAgICByb3dzOiBbWzEsIDBdLCBbMSwgMV0sIFsxLCAwXV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH1cbn07XG5cbmV4cG9ydCB7IEJMT0NLUywgQkxPQ0tfVFlQRVMgfTtcbiIsImNvbnN0IFNFVFRJTkdTID0ge1xuICAgIEJPQVJEX0NPTFNfV0lERTogMTAsXG4gICAgQk9BUkRfUk9XU19ISUdIOiAxOCxcbiAgICBQSUVDRV9TVEFSVF9DT0w6IDQsXG4gICAgUElFQ0VfU1RBUlRfUk9XOiAxLFxuICAgIFBJRUNFX1NUQVJUX1BPUzogMSxcbiAgICBHQU1FX0lOVEVSVkFMX01TOiA0NjAsXG4gICAgR0FNRV9TQ09SRV9NVUxUSVBMSUVSOiAxMDAsXG4gICAgQ0VMTF9XSURUSF9QWDogMjAsXG4gICAgQ0VMTF9IRUlHSFRfUFg6IDIwXG59O1xuXG5leHBvcnQgeyBTRVRUSU5HUyB9O1xuIiwiY29uc3QgYWJvdXQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGBcbiAgICBUZXRyanMgaXMgYSBUZXRyaXMgY2xvbmUgd3JpdHRlbiBpbiBKYXZhU2NyaXB0LlxuICAgIDxiciAvPlxuICAgIDxiciAvPlxuICAgIFRldHJqcyB3YXMgd3JpdHRlbiBieVxuICAgIDxhIGhyZWY9XCJodHRwczovL2Rlc3Rpbm1vdWx0b24uY29tXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RGVzdGluIE1vdWx0b248L2E+LlxuICAgIDxiciAvPlxuICAgIDxiciAvPlxuICAgIEF2YWlsYWJsZSBvblxuICAgIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi90ZXRyanNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5HaXRIdWI8L2E+LlxuICAgIDxiciAvPlxuICAgIE9wZW4gc291cmNlIHVuZGVyIHRoZVxuICAgIDxhIGhyZWY9XCJodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZVwiPk1JVCBMaWNlbnNlPC9hPi5cbiAgICA8YnIgLz5cbiAgICA8YnIgLz5cbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInRldHJqcy1hYm91dC1jbG9zZVwiPlJlc3VtZSBHYW1lPC9idXR0b24+XG5gO1xufTtcblxuY29uc3QgY29udGFpbmVyID0gKCkgPT4ge1xuICAgIHJldHVybiBgXG4gICAgPCEtLSBUaGUgR2FtZSBDb250YWluZXIgLS0+XG4gICAgPGRpdiBpZD1cInRldHJqcy1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBpZD1cInRldHJqcy10aXRsZS1jb250YWluZXJcIj5UZXRyanM8L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cInRldHJqcy1ib2FyZC13cmFwcGVyXCI+PGRpdiBpZD1cInRldHJqcy1ib2FyZFwiPjwvZGl2PjwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwidGV0cmpzLW5leHQtcGllY2UtcHJldmlldy1jb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cInRldHJqcy1zY29yZS1jb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cInRldHJqcy1sZXZlbC1jb250YWluZXJcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cInRldHJqcy1hY3Rpb25zLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwidGV0cmpzLWJ1dHRvbi1wYXVzZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpY29uXCI+JiM5NjEzOyYjOTYxMzs8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uLXRleHRcIj5QYXVzZTwvZGl2PlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInRldHJqcy1idXR0b24tbmV3XCI+TmV3IEdhbWU8L2J1dHRvbj5cbiAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwidGV0cmpzLWJ1dHRvbi1hYm91dFwiPlxuICAgICAgICAgICAgICAgIEFib3V0IFRldHJqc1xuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwidGV0cmpzLW1vZGFsLXZlaWxcIj48L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cInRldHJqcy1tb2RhbFwiPjwvZGl2PlxuICAgIDwvZGl2PlxuYDtcbn07XG5cbmNvbnN0IGdhbWVvdmVyID0gKHsgc2NvcmUsIHJvd3NFbGltaW5hdGVkLCBsZXZlbCB9KSA9PiB7XG4gICAgcmV0dXJuIGBcbiAgICBHYW1lIE92ZXIhIDxiciAvPjxiciAvPlxuICAgIDx0YWJsZSBib3JkZXI9XCIwXCIgaWQ9XCJ0ZXRyanMtZ2FtZW92ZXItdGFibGVcIj5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0ZD48c3Ryb25nPlNjb3JlOjwvc3Ryb25nPjwvdGQ+XG4gICAgICAgICAgICAgICAgPHRkPiR7c2NvcmV9PC90ZD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRkPjxzdHJvbmc+TGluZXM6PC9zdHJvbmc+PC90ZD5cbiAgICAgICAgICAgICAgICA8dGQ+JHtyb3dzRWxpbWluYXRlZH08L3RkPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGQ+PHN0cm9uZz5MZXZlbDo8L3N0cm9uZz48L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD4ke2xldmVsfTwvdGQ+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3Rib2R5PlxuICAgIDwvdGFibGU+XG4gICAgPGJyIC8+XG4gICAgPGJ1dHRvbiBpZD1cInRldHJqcy1nYW1lb3Zlci1uZXdnYW1lXCI+TmV3IEdhbWU8L2J1dHRvbj5cbmA7XG59O1xuXG5jb25zdCBpbnRybyA9ICgpID0+IHtcbiAgICByZXR1cm4gYFxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGlkPVwidGV0cmpzLWludHJvLW5ld2dhbWVcIj5cbiAgICAgICAgPHNwYW4+4pa2PC9zcGFuPiZuYnNwOyZuYnNwO1BsYXkgVGV0cmpzIVxuICAgIDwvYnV0dG9uPlxuXG4gICAgPGJyIC8+PGJyIC8+XG4gICAgQXJyb3cga2V5cyBjb250cm9sIHRoZSBwaWVjZXMuXG4gICAgPGJyIC8+XG4gICAgJm5ic3A7XG5cbiAgICA8ZGl2IGlkPVwidGV0cmpzLWFycm93cy1jb250YWluZXJcIj5cbiAgICAgICAgPGRpdiBpZD1cInVwXCI+4qyGPC9kaXY+XG4gICAgICAgIDxiciAvPlxuICAgICAgICA8ZGl2IGlkPVwibGVmdFwiPuKshTwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwiZG93blwiPuKshzwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwicmlnaHRcIj7inqE8L2Rpdj5cbiAgICA8L2Rpdj5cbmA7XG59O1xuXG5jb25zdCBwYXVzZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGBcbiAgICBQYXVzZWQuLi5cbiAgICA8YnIgLz5cbiAgICA8YnIgLz5cbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInRldHJqcy1wYXVzZS1wbGF5XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiXCI+4pa2PC9zcGFuPiZuYnNwOyZuYnNwO1Jlc3VtZVxuICAgIDwvYnV0dG9uPlxuICAgIDxiciAvPlxuICAgIDxiciAvPlRpcDogUHJlc3MgPGI+UDwvYj4ga2V5IHRvIHBhdXNlL3Jlc3VtZS5cbmA7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgYWJvdXQsXG4gICAgY29udGFpbmVyLFxuICAgIGdhbWVvdmVyLFxuICAgIGludHJvLFxuICAgIHBhdXNlZFxufTtcbiIsIi8qKlxuICogVGV0cmpzIGlzIGEgamF2YXNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiBUZXRyaXMuXG4gKlxuICogQGF1dGhvciBEZXN0aW4gTW91bHRvblxuICogQGxpY2Vuc2UgTUlUXG4gKiBAdmVyc2lvbiAxLjBcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3RldHJqc1xuICovXG5cbmltcG9ydCB1dGlsIGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCB7IEJMT0NLUywgQkxPQ0tfVFlQRVMgfSBmcm9tIFwiLi9ibG9ja3NcIjtcbmltcG9ydCB7IFNFVFRJTkdTIH0gZnJvbSBcIi4vc2V0dGluZ3NcIjtcbmltcG9ydCB0ZW1wbGF0ZXMgZnJvbSBcIi4vdGVtcGxhdGVzXCI7XG4vKipcbiAqIFRoZSBjb25zdHJ1Y3Rvci5cbiAqIEluaXRpYWxpemVzIHRoZSBiYXNpYyBjb25maWd1cmF0aW9uIHZhbHVlcy5cbiAqIEByZXR1cm4gdm9pZFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXRyanMge1xuICAgIGJvYXJkID0gW107XG5cbiAgICBpc1BhdXNlZCA9IGZhbHNlO1xuXG4gICAgRE9NX0lEUyA9IHtcbiAgICAgICAgQk9BUkRfV1JBUFBFUjogXCJ0ZXRyanMtYm9hcmQtd3JhcHBlclwiLFxuICAgICAgICBCT0FSRDogXCJ0ZXRyanMtYm9hcmRcIixcbiAgICAgICAgUFJFVklFV19DT05UQUlORVI6IFwidGV0cmpzLW5leHQtcGllY2UtcHJldmlldy1jb250YWluZXJcIixcbiAgICAgICAgU0NPUkVfQ09OVEFJTkVSOiBcInRldHJqcy1zY29yZS1jb250YWluZXJcIixcbiAgICAgICAgTEVWRUxfQ09OVEFJTkVSOiBcInRldHJqcy1sZXZlbC1jb250YWluZXJcIixcbiAgICAgICAgTU9EQUw6IFwidGV0cmpzLW1vZGFsXCIsXG4gICAgICAgIE1PREFMX1ZFSUw6IFwidGV0cmpzLW1vZGFsLXZlaWxcIlxuICAgIH07XG5cbiAgICBET01fQ0xBU1NFUyA9IHtcbiAgICAgICAgQk9BUkRfQkxPQ0s6IFwidGV0cmpzLWJvYXJkLWJsb2NrXCJcbiAgICB9O1xuXG4gICAgY3VycmVudEJsb2NrID0ge1xuICAgICAgICB0eXBlOiBcIlwiLFxuICAgICAgICBibG9ja0lkczogW10sXG4gICAgICAgIGJsb2NrUG9zaXRpb25zOiBbXSxcbiAgICAgICAgY2xhc3M6IFwiXCIsXG4gICAgICAgIHJvdzogU0VUVElOR1MuUElFQ0VfU1RBUlRfUk9XLFxuICAgICAgICBjb2w6IFNFVFRJTkdTLlBJRUNFX1NUQVJUX0NPTCxcbiAgICAgICAgcG9zaXRpb246IFNFVFRJTkdTLlBJRUNFX1NUQVJUX1BPU1xuICAgIH07XG5cbiAgICBwcmV2aWV3UGllY2UgPSB7XG4gICAgICAgIHR5cGU6IFwiXCIsXG4gICAgICAgIGNsYXNzOiBcIlwiLFxuICAgICAgICBibG9ja3M6IFtdXG4gICAgfTtcblxuICAgIGdhbWVJbnRlcnZhbFRpbWVyID0ge1xuICAgICAgICBvYmo6IGZhbHNlLFxuICAgICAgICBtczogU0VUVElOR1MuR0FNRV9JTlRFUlZBTF9NU1xuICAgIH07XG5cbiAgICBjdXJyZW50R2FtZSA9IHtcbiAgICAgICAgc2NvcmU6IDAsXG4gICAgICAgIHJvd3NFbGltaW5hdGVkOiAwLFxuICAgICAgICBsZXZlbDogMVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCB0aGUgVGV0cmpzIGJvYXJkLlxuICAgICAqICAxLiBDbGVhciB0aGUgYm9hcmRcbiAgICAgKiAgICAgaS4gUmVtb3ZlIGFueSBleGlzdGluZyBIVE1MXG4gICAgICogICAgIGlpLiBDbGVhciB0aGUgbXVsdGlkaW1lbnNpb25hbC9tYXRyaXggYm9hcmQgb2JqZWN0XG4gICAgICogIDIuIFNldCB0aGUgYm9hcmQgd2lkdGggYW5kIGhlaWdodCAoaW4gcHgpXG4gICAgICogIDMuIENyZWF0ZSB0aGUgbmV3LCBjbGVhbiwgYm9hcmRcbiAgICAgKiAgICAgaS4gSW5zdGFudGlhdGUgdGhlIG11bHRpZGltZW5zaW9uYWwvbWF0cml4IGJvYXJkIGNvbnRhaW5lclxuICAgICAqICAgICBpaS4gQ3JlYXRlIGRpdiBib3hlcyBhdCBhYnNvbHV0ZSBwb3NpdGlvbiB0byBob2xkIGJsb2Nrc1xuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2V0dXBCb2FyZCgpIHtcbiAgICAgICAgY29uc3QgZWxCb2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRE9NX0lEUy5CT0FSRCk7XG4gICAgICAgIGNvbnN0IGVsV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRE9NX0lEUy5CT0FSRF9XUkFQUEVSKTtcblxuICAgICAgICAvLyBDbGVhciB0aGUgYm9hcmRcbiAgICAgICAgZWxCb2FyZC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICB0aGlzLmJvYXJkID0ge307XG5cbiAgICAgICAgLy8gU2V0IHRoZSB3cmFwcGVyIHNpemVcbiAgICAgICAgY29uc3Qgd3JhcHBlcldpZHRoID0gU0VUVElOR1MuQk9BUkRfQ09MU19XSURFICogU0VUVElOR1MuQ0VMTF9XSURUSF9QWDtcbiAgICAgICAgY29uc3Qgd3JhcHBlckhlaWdodCA9XG4gICAgICAgICAgICAoU0VUVElOR1MuQk9BUkRfUk9XU19ISUdIIC0gMSkgKiBTRVRUSU5HUy5DRUxMX0hFSUdIVF9QWDtcbiAgICAgICAgZWxXcmFwcGVyLnN0eWxlLndpZHRoID0gYCR7d3JhcHBlcldpZHRofXB4YDtcbiAgICAgICAgZWxXcmFwcGVyLnN0eWxlLmhlaWdodCA9IGAke3dyYXBwZXJIZWlnaHR9cHhgO1xuICAgICAgICAvLyBTZXQgdGhlIGJvYXJkIHNpemVcbiAgICAgICAgY29uc3QgYm9hcmRXaWR0aCA9IFNFVFRJTkdTLkJPQVJEX0NPTFNfV0lERSAqIFNFVFRJTkdTLkNFTExfV0lEVEhfUFg7XG4gICAgICAgIGNvbnN0IGJvYXJkSGVpZ2h0ID0gU0VUVElOR1MuQk9BUkRfUk9XU19ISUdIICogU0VUVElOR1MuQ0VMTF9IRUlHSFRfUFg7XG4gICAgICAgIGVsQm9hcmQuc3R5bGUud2lkdGggPSBgJHtib2FyZFdpZHRofXB4YDtcbiAgICAgICAgZWxCb2FyZC5zdHlsZS5oZWlnaHQgPSBgJHtib2FyZEhlaWdodH1weGA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBTRVRUSU5HUy5CT0FSRF9ST1dTX0hJR0g7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ib2FyZFtpXSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgdG9wX3BvcyA9IGkgKiBTRVRUSU5HUy5DRUxMX0hFSUdIVF9QWDtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgU0VUVElOR1MuQk9BUkRfQ09MU19XSURFOyBqKyspIHtcbiAgICAgICAgICAgICAgICAvLyBTZXR1cCB0aGUgb2JqZWN0IGZvciBzdG9yaW5nIGJsb2NrIHBvc2l0aW9uc1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbaV1bal0gPSB7fTtcblxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBsZWZ0IHB4IHBvc2l0aW9uIG9mIHRoZSBjZWxsXG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdF9wb3MgPSBqICogU0VUVElOR1MuQ0VMTF9XSURUSF9QWDtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCB0aGUgYmxvY2sgdG8gdGhlIGJvYXJkXG4gICAgICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGJsb2NrLnN0eWxlLmxlZnQgPSBsZWZ0X3Bvcy50b1N0cmluZygpICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGJsb2NrLnN0eWxlLnRvcCA9IHRvcF9wb3MudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBibG9jay5jbGFzc05hbWUgPSB0aGlzLkRPTV9DTEFTU0VTLkJPQVJEX0JMT0NLO1xuICAgICAgICAgICAgICAgIGJsb2NrLnNldEF0dHJpYnV0ZShcImlkXCIsIGB0Yl8ke2p9XyR7aX1gKTtcbiAgICAgICAgICAgICAgICBlbEJvYXJkLmFwcGVuZENoaWxkKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHVwIHRoZSBzbWFsbCBwcmV2aWV3IGJvYXJkIHRvIGRpc3BsYXkgdGhlIG5leHQgcGllY2UuXG4gICAgICpcbiAgICAgKiBBbG1vc3QgaWRlbnRpY2FsIHRvIHRoZSBzZXR1cEJvYXJkIGZ1bmN0aW9uLCBleGNlcHQgd2VcbiAgICAgKiBkbyBub3QgbmVlZCBhIG11bHRpZGltZW5zaW9uYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGJvYXJkLlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2V0dXBQcmV2aWV3Qm9hcmQoKSB7XG4gICAgICAgIGNvbnN0IGVsUHJldmlld0JvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICB0aGlzLkRPTV9JRFMuUFJFVklFV19DT05UQUlORVJcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgcHJldmlld19zZWN0aW9uc193aWRlID0gNjtcbiAgICAgICAgY29uc3QgcHJldmlld19zZWN0aW9uc19oaWdoID0gNDtcblxuICAgICAgICAvLyBDbGVhciB0aGUgYm9hcmRcbiAgICAgICAgY29uc3QgYm9hcmRXaWR0aCA9IHByZXZpZXdfc2VjdGlvbnNfd2lkZSAqIFNFVFRJTkdTLkNFTExfV0lEVEhfUFg7XG4gICAgICAgIGNvbnN0IGJvYXJkSGVpZ2h0ID0gcHJldmlld19zZWN0aW9uc19oaWdoICogU0VUVElOR1MuQ0VMTF9IRUlHSFRfUFg7XG4gICAgICAgIGVsUHJldmlld0JvYXJkLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGVsUHJldmlld0JvYXJkLnN0eWxlLndpZHRoID0gYCR7Ym9hcmRXaWR0aH1weGA7XG4gICAgICAgIGVsUHJldmlld0JvYXJkLnN0eWxlLmhlaWdodCA9IGAke2JvYXJkSGVpZ2h0fXB4YDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpZXdfc2VjdGlvbnNfaGlnaDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0b3BQb3MgPSBpICogU0VUVElOR1MuQ0VMTF9IRUlHSFRfUFg7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHByZXZpZXdfc2VjdGlvbnNfd2lkZTsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdFBvcyA9IGogKiBTRVRUSU5HUy5DRUxMX1dJRFRIX1BYO1xuICAgICAgICAgICAgICAgIGxldCBibG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgYmxvY2suc3R5bGUudG9wID0gdG9wUG9zICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGJsb2NrLnN0eWxlLmxlZnQgPSBsZWZ0UG9zICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGJsb2NrLmNsYXNzTmFtZSA9IHRoaXMuRE9NX0NMQVNTRVMuQk9BUkRfQkxPQ0s7XG4gICAgICAgICAgICAgICAgYmxvY2suc2V0QXR0cmlidXRlKFwiaWRcIiwgYHRwXyR7an1fJHtpfWApO1xuICAgICAgICAgICAgICAgIGVsUHJldmlld0JvYXJkLmFwcGVuZENoaWxkKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBhIHJhbmRvbSBibG9jayB0eXBlLlxuICAgICAqXG4gICAgICogQHJldHVybiBzdHJpbmcgQmxvY2sgdHlwZVxuICAgICAqL1xuICAgIGdlbmVyYXRlUmFuZG9tQmxvY2tUeXBlKCkge1xuICAgICAgICByZXR1cm4gQkxPQ0tfVFlQRVNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogQkxPQ0tfVFlQRVMubGVuZ3RoKV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFrZSB0aGUgcHJldmlldyBibG9jayBpbiB0aGUgcHJldmlldyBib2FyZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIG1ha2VQcmV2aWV3UGllY2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzUGF1c2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvL1JlbW92ZSB0aGUgY3VycmVudCBibG9jayBmcm9tIHRoZSBwcmV2aWV3XG4gICAgICAgIGZvciAobGV0IGJsb2NrX2lkIG9mIHRoaXMucHJldmlld1BpZWNlLmJsb2Nrcykge1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9ja19pZCk7XG4gICAgICAgICAgICBibG9jay5jbGFzc0xpc3QucmVtb3ZlKHRoaXMucHJldmlld1BpZWNlLmNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXZpZXdQaWVjZS5ibG9ja3MgPSBbXTtcblxuICAgICAgICAvL0dldCBhIHJhbmRvbSBibG9ja1xuICAgICAgICB0aGlzLnByZXZpZXdQaWVjZS50eXBlID0gdGhpcy5nZW5lcmF0ZVJhbmRvbUJsb2NrVHlwZSgpO1xuXG4gICAgICAgIHRoaXMucHJldmlld1BpZWNlLmNsYXNzID0gQkxPQ0tTW3RoaXMucHJldmlld1BpZWNlLnR5cGVdW1wiY2xhc3NcIl07XG4gICAgICAgIGNvbnN0IHN0YXJ0Q29sID0gMTtcbiAgICAgICAgY29uc3Qgc3RhcnRSb3cgPSAxO1xuICAgICAgICBjb25zdCBibG9ja1Jvd3MgPVxuICAgICAgICAgICAgQkxPQ0tTW3RoaXMucHJldmlld1BpZWNlLnR5cGVdW1wicG9zaXRpb25zXCJdWzBdW1wicm93c1wiXTtcblxuICAgICAgICAvLyBSb3dzIGFyZSBzdG9yZWQgYXMgYSBtYXRyaXhcbiAgICAgICAgZm9yIChsZXQgcm93SW5kZXggPSAwOyByb3dJbmRleCA8IGJsb2NrUm93cy5sZW5ndGg7IHJvd0luZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IGJsb2NrUm93c1tyb3dJbmRleF07XG4gICAgICAgICAgICBmb3IgKGxldCBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgcm93Lmxlbmd0aDsgY29sSW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlmIChyb3dbY29sSW5kZXhdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrQ29sID0gc3RhcnRDb2wgKyBjb2xJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmxvY2tSb3cgPSBzdGFydFJvdyArIHJvd0luZGV4O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IFwidHBfXCIgKyBibG9ja0NvbCArIFwiX1wiICsgYmxvY2tSb3c7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKHRoaXMucHJldmlld1BpZWNlLmNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmV2aWV3UGllY2UuYmxvY2tzLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1vdmUgYSBibG9jayBvbiB0aGUgYm9hcmQuXG4gICAgICogVGhpcyBpcyBtb3N0bHkgY2FsbGVkIGFzIHRoZSBrZXlib2FyZCBldmVudCBoYW5kbGVyLlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgbW92ZUJsb2NrKGRlc2lyZWREaXJlY3Rpb24pIHtcbiAgICAgICAgbGV0IGRlc2lyZWRQb3NpdGlvbiA9IHRoaXMuY3VycmVudEJsb2NrLnBvc2l0aW9uO1xuICAgICAgICBjb25zdCBibG9ja1Bvc2l0aW9ucyA9IEJMT0NLU1t0aGlzLmN1cnJlbnRCbG9jay50eXBlXVtcInBvc2l0aW9uc1wiXTtcbiAgICAgICAgY29uc3QgYmxvY2tOdW1Qb3NpdGlvbnMgPVxuICAgICAgICAgICAgQkxPQ0tTW3RoaXMuY3VycmVudEJsb2NrLnR5cGVdW1wibm9fcG9zaXRpb25zXCJdO1xuICAgICAgICBsZXQgYmxvY2tQb3NUcmFuc1JvdyA9IDA7XG4gICAgICAgIGxldCBibG9ja1Bvc1RyYW5zQ29sID0gMDtcblxuICAgICAgICAvLyAndXAnIHJvdGF0ZXMgdGhlIGJsb2NrXG4gICAgICAgIGlmIChkZXNpcmVkRGlyZWN0aW9uID09IFwidXBcIikge1xuICAgICAgICAgICAgZGVzaXJlZFBvc2l0aW9uID0gdGhpcy5jdXJyZW50QmxvY2sucG9zaXRpb24gKyAxO1xuICAgICAgICAgICAgaWYgKGRlc2lyZWRQb3NpdGlvbiA+IGJsb2NrTnVtUG9zaXRpb25zIC0gMSkge1xuICAgICAgICAgICAgICAgIC8vUmVzZXQgdGhlIHRyYW5zaXRpb24gYmFjayB0byAwXG4gICAgICAgICAgICAgICAgZGVzaXJlZFBvc2l0aW9uID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIGFtb3VudCB0byBtb3ZlIHRoZSBkZXNpcmVkIHJvdyBhbmQgY29sdW1uXG4gICAgICAgICAgICAvLyBkdXJpbmcgdGhlIHRyYW5zZm9ybWF0aW9uXG4gICAgICAgICAgICBibG9ja1Bvc1RyYW5zUm93ID0gYmxvY2tQb3NpdGlvbnNbZGVzaXJlZFBvc2l0aW9uXVtcInRyYW5zX3Jvd1wiXTtcbiAgICAgICAgICAgIGJsb2NrUG9zVHJhbnNDb2wgPSBibG9ja1Bvc2l0aW9uc1tkZXNpcmVkUG9zaXRpb25dW1widHJhbnNfY29sXCJdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYmxvY2tSb3dzID0gYmxvY2tQb3NpdGlvbnNbZGVzaXJlZFBvc2l0aW9uXVtcInJvd3NcIl07XG5cbiAgICAgICAgbGV0IG5leHREZXNpcmVkUG9zaXRpb24gPSBbXTtcbiAgICAgICAgbGV0IGxvY2tDdXJyZW50QmxvY2sgPSBmYWxzZTtcbiAgICAgICAgbGV0IGxvd2VzdENvbCA9IFNFVFRJTkdTLkJPQVJEX0NPTFNfV0lERTtcbiAgICAgICAgbGV0IGxvd2VzdFJvdyA9IFNFVFRJTkdTLkJPQVJEX1JPV1NfSElHSDtcblxuICAgICAgICBsZXQgcG9zaXRpb25Jc0F2YWlsYWJsZSA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCBibG9ja1Jvd3MubGVuZ3RoOyByb3dJbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBibG9ja1Jvd3Nbcm93SW5kZXhdO1xuICAgICAgICAgICAgZm9yIChsZXQgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IHJvdy5sZW5ndGg7IGNvbEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAocm93W2NvbEluZGV4XSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0bXBQaWVjZUNvbFBvcyA9IHRoaXMuY3VycmVudEJsb2NrLmNvbCArIGNvbEluZGV4O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0bXBQaWVjZVJvd1BvcyA9IHRoaXMuY3VycmVudEJsb2NrLnJvdyArIHJvd0luZGV4O1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBkZXNpcmVkQ29sID0gdG1wUGllY2VDb2xQb3MgKyBibG9ja1Bvc1RyYW5zQ29sO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGVzaXJlZFJvdyA9IHRtcFBpZWNlUm93UG9zICsgYmxvY2tQb3NUcmFuc1JvdztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZERpcmVjdGlvbiA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2Rlc2lyZWRSb3ddW2Rlc2lyZWRDb2xdLmhhc093blByb3BlcnR5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNsYXNzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXcgcGllY2UgYnV0IGEgc3BhY2UgaXMgYWxyZWFkeSB0YWtlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXNpcmVkRGlyZWN0aW9uID09PSBcImxlZnRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzaXJlZENvbCA9IHRtcFBpZWNlQ29sUG9zIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXNpcmVkRGlyZWN0aW9uID09PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lyZWRDb2wgPSB0bXBQaWVjZUNvbFBvcyArIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZERpcmVjdGlvbiA9PT0gXCJkb3duXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lyZWRSb3cgPSB0bXBQaWVjZVJvd1BvcyArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzaXJlZFJvdyA+IFNFVFRJTkdTLkJPQVJEX1JPV1NfSElHSCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLmRvZXNCb2FyZFBvc2l0aW9uRXhpc3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lyZWRSb3csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2lyZWRDb2xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtkZXNpcmVkUm93XVtkZXNpcmVkQ29sXS5oYXNPd25Qcm9wZXJ0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjbGFzc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWxyZWFkeSBhIGJsb2NrIGluIHRoZSBuZXh0IGRvd253YXJkIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9ja0N1cnJlbnRCbG9jayA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAhdGhpcy5kb2VzQm9hcmRQb3NpdGlvbkV4aXN0KGRlc2lyZWRSb3csIGRlc2lyZWRDb2wpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2Rlc2lyZWRSb3ddW2Rlc2lyZWRDb2xdLmhhc093blByb3BlcnR5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xhc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENhbid0IG1vdmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uSXNBdmFpbGFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbklzQXZhaWxhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZENvbCA8IGxvd2VzdENvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VzdENvbCA9IGRlc2lyZWRDb2w7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZFJvdyA8IGxvd2VzdFJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvd2VzdFJvdyA9IGRlc2lyZWRSb3c7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHREZXNpcmVkUG9zaXRpb24ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sOiBkZXNpcmVkQ29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogZGVzaXJlZFJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocG9zaXRpb25Jc0F2YWlsYWJsZSkge1xuICAgICAgICAgICAgaWYgKCFsb2NrQ3VycmVudEJsb2NrKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBjdXJyZW50IHBpZWNlXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDdXJyZW50QmxvY2tGcm9tQm9hcmQoKTtcblxuICAgICAgICAgICAgICAgIC8vU2V0IHRoZSBuZXcgY3VycmVudCBkaXJlY3Rpb25cbiAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZERpcmVjdGlvbiA9PSBcInVwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmxvY2sucG9zaXRpb24gPSBkZXNpcmVkUG9zaXRpb247XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBuZXcgY3VycmVudCByb3cgYW5kIGNvbHVtblxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmNvbCA9IGxvd2VzdENvbDtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5yb3cgPSBsb3dlc3RSb3c7XG4gICAgICAgICAgICAgICAgLy8gQXBwbHkgdGhlICdtb3ZlbWVudCcgYnkgbW9kaWZ5aW5nIHRoZSBibG9jaydzIGNsYXNzXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXh0RGVzaXJlZFBvc2l0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvcyA9IG5leHREZXNpcmVkUG9zaXRpb25baV07XG4gICAgICAgICAgICAgICAgICAgIHZhciB0bXBJZCA9IGB0Yl8ke3Bvc1tcImNvbFwiXX1fJHtwb3NbXCJyb3dcIl19YDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRvbUJsb2NrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG1wSWQpO1xuICAgICAgICAgICAgICAgICAgICBkb21CbG9jay5jbGFzc0xpc3QuYWRkKHRoaXMuY3VycmVudEJsb2NrLmNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suYmxvY2tJZHMucHVzaCh0bXBJZCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrUG9zaXRpb25zLnB1c2gocG9zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgYmxvY2sgaGFzIHJlYWNoZWQgaXRzIGZpbmFsIGRlc3RpbmF0aW9uXG4gICAgICAgIGlmIChsb2NrQ3VycmVudEJsb2NrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY3VycmVudEJsb2NrLmJsb2NrUG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy5jdXJyZW50QmxvY2suYmxvY2tQb3NpdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgLy8gTG9jayB0aGUgY3VycmVudCBibG9jayBvbiB0aGUgYm9hcmRcbiAgICAgICAgICAgICAgICAvLyBieSBzZXR0aW5nIHRoZSBwZXJtYW5lbnQgYm9hcmQgY2xhc3NcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3Bvc1tcInJvd1wiXV1bcG9zW1wiY29sXCJdXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6IHRoaXMuY3VycmVudEJsb2NrLmNsYXNzXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGJsb2NrIGhhcyBjYXVzZWQgcm93cyB0byBiZSBlbGltaW5hdGVkXG4gICAgICAgICAgICB0aGlzLmNoZWNrQW5kRWxpbWluYXRlUm93cygpO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIG5leHQgYmxvY2tcbiAgICAgICAgICAgIHRoaXMubmV4dEJsb2NrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGVyZSBhcmUgYW55IHJvd3MgdG8gcmVtb3ZlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBjaGVja0FuZEVsaW1pbmF0ZVJvd3MoKSB7XG4gICAgICAgIGxldCBub1Jvd3NFbGltaW5hdGVkID0gMDtcblxuICAgICAgICAvL0xvb3Agb3ZlciB0aGUgYm9hcmQgcm93c1xuICAgICAgICBmb3IgKFxuICAgICAgICAgICAgbGV0IHJvd0luZGV4ID0gMDtcbiAgICAgICAgICAgIHJvd0luZGV4IDwgU0VUVElOR1MuQk9BUkRfUk9XU19ISUdIO1xuICAgICAgICAgICAgcm93SW5kZXgrK1xuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuYm9hcmRbcm93SW5kZXhdO1xuICAgICAgICAgICAgbGV0IGNvbHVtbkZpbGxDb3VudCA9IDA7XG5cbiAgICAgICAgICAgIC8vTG9vcCBvdmVyIHRoZSBjb2x1bW5zIGluIHRoaXMgcm93XG4gICAgICAgICAgICBmb3IgKGxldCBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgcm93Lmxlbmd0aDsgY29sSW5kZXgrKykge1xuICAgICAgICAgICAgICAgIC8vIEEgY2xhc3MgaW5kaWNhdGVzIHRoZSBjb2x1bW4gaW4gdGhpcyByb3cgaXMgZnVsbFxuICAgICAgICAgICAgICAgIGlmIChyb3dbY29sSW5kZXhdLmhhc093blByb3BlcnR5KFwiY2xhc3NcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uRmlsbENvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGUgZW50aXJlIHJvdyBpcyBmdWxsXG4gICAgICAgICAgICBpZiAoY29sdW1uRmlsbENvdW50ID09PSBTRVRUSU5HUy5CT0FSRF9DT0xTX1dJREUpIHtcbiAgICAgICAgICAgICAgICBub1Jvd3NFbGltaW5hdGVkKys7XG5cbiAgICAgICAgICAgICAgICAvL01vdmUgdGhlIHVwcGVyIHJvd3MgZG93biwgZnJvbSB0aGUgYm90dG9tIHVwXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHJvd0luZGV4OyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlDb2xJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpQ29sSW5kZXggPCBTRVRUSU5HUy5CT0FSRF9DT0xTX1dJREU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpQ29sSW5kZXgrK1xuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhYm92ZUNsYXNzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRvZXNCb2FyZFBvc2l0aW9uRXhpc3QoaSAtIDEsIGlDb2xJbmRleCkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2kgLSAxXVtpQ29sSW5kZXhdLmhhc093blByb3BlcnR5KFwiY2xhc3NcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBjbGFzcyBmcm9tIHRoZSBibG9jayBkaXJlY3RseSBhYm92ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFib3ZlQ2xhc3MgPSB0aGlzLmJvYXJkW2kgLSAxXVtpQ29sSW5kZXhdW1wiY2xhc3NcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYHRiXyR7aUNvbEluZGV4LnRvU3RyaW5nKCl9XyR7aS50b1N0cmluZygpfWBcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ib2FyZFtpXVtpQ29sSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLmhhc093blByb3BlcnR5KFwiY2xhc3NcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGJsb2NrW1wiY2xhc3NcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWJvdmVDbGFzcyAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQ29weSBkb3duIHRoZSBjbGFzcyBmcm9tIGFib3ZlIHRvIHRoZSBibG9jayBpbiB0aGlzIHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoYWJvdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtpXVtpQ29sSW5kZXhdID0geyBjbGFzczogYWJvdmVDbGFzcyB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0JsYW5rIGJsb2NrIChubyBibG9jayBhYm92ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2ldW2lDb2xJbmRleF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub1Jvd3NFbGltaW5hdGVkID4gMCkge1xuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBzY29yZVxuICAgICAgICAgICAgdGhpcy5zY29yZShub1Jvd3NFbGltaW5hdGVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBib29sZWFuIHdoZXRoZXIgYSByb3cgYW5kIGNvbHVtbiBleGlzdCBpbiB0aGUgYm9hcmQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm93XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbFxuICAgICAqL1xuICAgIGRvZXNCb2FyZFBvc2l0aW9uRXhpc3Qocm93LCBjb2wpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYm9hcmRbcm93XSAmJiB0aGlzLmJvYXJkW3Jvd11bY29sXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTY29yZSBhIG1vdmUgYmFzZWQgb24gdGhlIG51bWJlciBvZiByb3dzIGVsaW1pbmF0ZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnQgbm9fcm93c19lbGltaW5hdGVkIFRoZSBudW1iZXIgb2Ygcm93cyBlbGltaW5hdGVkLlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNjb3JlKG5vX3Jvd3NfZWxpbWluYXRlZCkge1xuICAgICAgICBsZXQgbXVsdGlwbGVfcm93X2JvbnVzID0gMDtcbiAgICAgICAgbGV0IGN1cnJlbnRfbXVsdGlwbGllciA9XG4gICAgICAgICAgICBTRVRUSU5HUy5HQU1FX1NDT1JFX01VTFRJUExJRVIgKiB0aGlzLmN1cnJlbnRHYW1lLmxldmVsO1xuXG4gICAgICAgIHRoaXMuY3VycmVudEdhbWUucm93c0VsaW1pbmF0ZWQgPVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50R2FtZS5yb3dzRWxpbWluYXRlZCArIG5vX3Jvd3NfZWxpbWluYXRlZDtcblxuICAgICAgICBpZiAobm9fcm93c19lbGltaW5hdGVkID4gMSkge1xuICAgICAgICAgICAgLy8gR2l2ZSB1c2VycyBhIGJvbnVzIGZvciBlbGltaW5hdGluZyBtb3JlIHRoYW4gb25lIHJvd1xuICAgICAgICAgICAgbXVsdGlwbGVfcm93X2JvbnVzID1cbiAgICAgICAgICAgICAgICBub19yb3dzX2VsaW1pbmF0ZWQgKiAoY3VycmVudF9tdWx0aXBsaWVyICogMC41KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLnNjb3JlID1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudEdhbWUuc2NvcmUgK1xuICAgICAgICAgICAgbm9fcm93c19lbGltaW5hdGVkICogY3VycmVudF9tdWx0aXBsaWVyICtcbiAgICAgICAgICAgIG11bHRpcGxlX3Jvd19ib251cztcblxuICAgICAgICB0aGlzLnNldFNjb3JlVGV4dCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRHYW1lLnJvd3NFbGltaW5hdGVkID09IFNFVFRJTkdTLkJPQVJEX1JPV1NfSElHSCkge1xuICAgICAgICAgICAgLy8gTGV2ZWwgdXBcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEdhbWUucm93c0VsaW1pbmF0ZWQgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLmxldmVsID0gdGhpcy5jdXJyZW50R2FtZS5sZXZlbCArIDE7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0TGV2ZWxUZXh0KCk7XG5cbiAgICAgICAgICAgIC8vIEluY3JlYXNlIHRoZSBzcGVlZCBvZiB0aGUgZ2FtZSBpbnRlcnZhbFxuICAgICAgICAgICAgdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5tcyA9IHRoaXMuZ2FtZUludGVydmFsVGltZXIubXMgLSAyMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgU2NvcmUgdGV4dFxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2V0U2NvcmVUZXh0KCkge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgIHRoaXMuRE9NX0lEUy5TQ09SRV9DT05UQUlORVJcbiAgICAgICAgKS5pbm5lclRleHQgPSB0aGlzLmN1cnJlbnRHYW1lLnNjb3JlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgTGV2ZWwgdGV4dC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNldExldmVsVGV4dCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLkRPTV9JRFMuTEVWRUxfQ09OVEFJTkVSKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJMRVZFTCBcIiArIHRoaXMuY3VycmVudEdhbWUubGV2ZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBjdXJyZW50IGJsb2NrIGZyb20gdGhlIGJvYXJkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICByZW1vdmVDdXJyZW50QmxvY2tGcm9tQm9hcmQoKSB7XG4gICAgICAgIC8vUmVtb3ZlIHRoZSBjdXJyZW50IGNsYXNzIGZyb20gdGhlIHZpc2libGUgYmxvY2tzXG4gICAgICAgIGZvciAobGV0IGJsb2NrX2lkIG9mIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrSWRzKSB7XG4gICAgICAgICAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrX2lkKTtcbiAgICAgICAgICAgIGJsb2NrLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jdXJyZW50QmxvY2suY2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9SZXNldCB0aGUgY3VycmVudCBzZXQgb2YgYmxvY2tzXG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrSWRzID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrUG9zaXRpb25zID0gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHRoZSBuZXh0IGJsb2NrIHRvIHRoZSBib2FyZFxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgbmV4dEJsb2NrKCkge1xuICAgICAgICBpZiAodGhpcy5pc1BhdXNlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzZXQgYWxsIHRoZSB2YXJpYWJsZXNcbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suYmxvY2tJZHMgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suYmxvY2tQb3NpdGlvbnMgPSBbXTtcblxuICAgICAgICAvLyBUaGUgcHJldmlldyBibG9jayBiZWNvbWVzIHRoZSBjdXJyZW50IHBpZWNlXG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLnR5cGUgPSB0aGlzLnByZXZpZXdQaWVjZS50eXBlO1xuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5jbGFzcyA9IEJMT0NLU1t0aGlzLmN1cnJlbnRCbG9jay50eXBlXVtcImNsYXNzXCJdO1xuXG4gICAgICAgIC8vIFJlc2V0IHRoZSBzdGFydCBsb2NhdGlvbiBmb3IgdGhlIGJsb2NrIHRvIGFwcGVhclxuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5yb3cgPSAxO1xuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5jb2wgPSBTRVRUSU5HUy5QSUVDRV9TVEFSVF9DT0w7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2sucG9zaXRpb24gPSAwO1xuXG4gICAgICAgIHRoaXMubW92ZUJsb2NrKFwibm9uZVwiKTtcblxuICAgICAgICAvL1Jlc2V0IHRoZSBnYW1lIGludGVydmFsXG4gICAgICAgIHRoaXMua2lsbEdhbWVJbnRlcnZhbCgpO1xuICAgICAgICB0aGlzLnN0YXJ0R2FtZUludGVydmFsKCk7XG5cbiAgICAgICAgLy8gTWFrZSB0aGUgbmV4dCBwcmV2aWV3IGJsb2NrXG4gICAgICAgIHRoaXMubWFrZVByZXZpZXdQaWVjZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHVwIHRoZSBrZXlib2FyZCBldmVudHMuXG4gICAgICogICAtIEFycm93IGtleXMgY29udHJvbCB0aGUgbW90aW9uIG9mIHRoZSBibG9ja3MuXG4gICAgICogICAtICdwJyBQYXVzZXMgdGhlIGdhbWUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzZXR1cEtleUV2ZW50cygpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMzc6XG4gICAgICAgICAgICAgICAgICAgIC8vIExlZnQgYXJyb3cga2V5XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUJsb2NrKFwibGVmdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICAvLyBVcCBhcnJvdyBrZXlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmxvY2soXCJ1cFwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgICAgICAgICAvLyBSaWdodCBhcnJvdyBrZXlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmxvY2soXCJyaWdodFwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgICAgICAvLyBEb3duIGFycm93IGtleVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVCbG9jayhcImRvd25cIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA4MDpcbiAgICAgICAgICAgICAgICAgICAgLy8gJ3AnIHByZXNzZWQgdG8gcGF1c2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXVzZUdhbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAvLyBEZWZhdWx0IC0gZG9uJ3QgZG8gYW55dGhpbmdcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiAoc2Nyb2xsIG9yIGNoYXItbW92ZSlcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgcGxheWluZ1xuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc3RhcnRQbGF5KCkge1xuICAgICAgICB0aGlzLmlzUGF1c2VkID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMucHJldmlld1BpZWNlLnR5cGUgPT0gXCJcIikge1xuICAgICAgICAgICAgLy9OZXcgZ2FtZSBpcyBzdGFydGluZ1xuXG4gICAgICAgICAgICAvL0dlbmVyYXRlIHRoZSBmaXJzdCBibG9jayB0eXBlXG4gICAgICAgICAgICB0aGlzLnByZXZpZXdQaWVjZS50eXBlID0gdGhpcy5nZW5lcmF0ZVJhbmRvbUJsb2NrVHlwZSgpO1xuXG4gICAgICAgICAgICAvL0NyZWF0ZSB0aGUgbmV3IHBpZWNlXG4gICAgICAgICAgICB0aGlzLm5leHRCbG9jaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGFydEdhbWVJbnRlcnZhbCgpO1xuXG4gICAgICAgIHRoaXMuaGlkZU1lc3NhZ2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGFydCB0aGUgZ2FtZSBpbnRlcnZhbFxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc3RhcnRHYW1lSW50ZXJ2YWwoKSB7XG4gICAgICAgIGlmICghdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5vYmopIHtcbiAgICAgICAgICAgIC8vIFNldHVwIHRoZSBpbnRlcnZhbCBvYmplY3QgdXNpbmcgdGhlIHN0ZCBqcyBmdW5jdGlvblxuICAgICAgICAgICAgdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5vYmogPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy9TdGFydCB0aGUgYWN0aW9uIChqdXN0IG1vdmUgdGhlIGN1cnJlbnQgcGllY2UgZG93bilcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVCbG9jayhcImRvd25cIik7XG4gICAgICAgICAgICB9LCB0aGlzLmdhbWVJbnRlcnZhbFRpbWVyLm1zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0b3AgdGhlIGdhbWUgaW50ZXJ2YWxcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIGtpbGxHYW1lSW50ZXJ2YWwoKSB7XG4gICAgICAgIC8vIENsZWFyIGl0IHVzaW5nIHRoZSBzdGFuZGFyZCBqcyBmdW5jdGlvblxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuZ2FtZUludGVydmFsVGltZXIub2JqKTtcbiAgICAgICAgdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5vYmogPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXVzZSBvciB1bnBhdXNlIHRoZSBnYW1lXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBwYXVzZUdhbWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzUGF1c2VkKSB7XG4gICAgICAgICAgICAvL0FscmVhZHkgcGF1c2VkLCBzbyBzdGFydCB0aGUgZ2FtZVxuICAgICAgICAgICAgdGhpcy5zdGFydFBsYXkoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtpbGxHYW1lSW50ZXJ2YWwoKTtcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IHRydWU7XG5cbiAgICAgICAgLy8gU2hvdyB0aGUgcGF1c2VkIG1vZGFsIG1lc3NhZ2UgKGZyb20gdGVtcGxhdGUpXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXCJwYXVzZWRcIik7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV0cmpzLXBhdXNlLXBsYXlcIik7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZXYgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGFydFBsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2FtZSBvdmVyIG9jY3VycmVkLlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgZ2FtZU92ZXIoKSB7XG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIFN0b3AgdGhlIGdhbWUgaW50ZXJ2YWxcbiAgICAgICAgdGhpcy5raWxsR2FtZUludGVydmFsKCk7XG5cbiAgICAgICAgdmFyIHRlbXBsYXRlX3ZhcnMgPSB7XG4gICAgICAgICAgICBzY29yZTogdGhpcy5jdXJyZW50R2FtZVtcInNjb3JlXCJdLFxuICAgICAgICAgICAgcm93c0VsaW1pbmF0ZWQ6IHRoaXMuY3VycmVudEdhbWVbXCJyb3dzRWxpbWluYXRlZFwiXSxcbiAgICAgICAgICAgIGxldmVsOiB0aGlzLmN1cnJlbnRHYW1lW1wibGV2ZWxcIl1cbiAgICAgICAgfTtcbiAgICAgICAgLy8gU2hvdyB0aGUgZ2FtZW92ZXIgbW9kYWwgbWVzc2FnZSAoZnJvbSB0ZW1wbGF0ZSlcbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZShcImdhbWVvdmVyXCIsIHRlbXBsYXRlX3ZhcnMpO1xuICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRldHJqcy1nYW1lb3Zlci1uZXdnYW1lXCIpO1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5uZXdHYW1lKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHVwIGEgbmV3IGdhbWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqKi9cbiAgICBuZXdHYW1lKCkge1xuICAgICAgICAvLyBTdG9wIHRoZSBnYW1lIGludGVydmFsXG4gICAgICAgIHRoaXMua2lsbEdhbWVJbnRlcnZhbCgpO1xuXG4gICAgICAgIC8vIFJlc2V0IHRoZSB0aGUgc2NvcmUsIGxldmVsLCBhbmQgaW50ZXJ2YWxcbiAgICAgICAgdGhpcy5jdXJyZW50R2FtZS5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMuY3VycmVudEdhbWUubGV2ZWwgPSAxO1xuICAgICAgICB0aGlzLmdhbWVJbnRlcnZhbFRpbWVyLm1zID0gU0VUVElOR1MuR0FNRV9JTlRFUlZBTF9NUztcblxuICAgICAgICAvLyBSZXNldCB0aGUgc2NvcmUgYW5kIGxldmVsIHRleHRcbiAgICAgICAgdGhpcy5zZXRTY29yZVRleHQoKTtcbiAgICAgICAgdGhpcy5zZXRMZXZlbFRleHQoKTtcblxuICAgICAgICAvLyBTZXR1cCB0aGUgbWFpbiBhbmQgcHJldmlldyBib2FyZHNcbiAgICAgICAgdGhpcy5zZXR1cEJvYXJkKCk7XG4gICAgICAgIHRoaXMuc2V0dXBQcmV2aWV3Qm9hcmQoKTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIG9sZCBwcmV2aWV3IHBpZWNlIHR5cGVcbiAgICAgICAgdGhpcy5wcmV2aWV3UGllY2UudHlwZSA9IFwiXCI7XG5cbiAgICAgICAgLy8gU3RhcnQgdGhlIGdhbWVcbiAgICAgICAgdGhpcy5zdGFydFBsYXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBpbnRyb2R1Y3Rpb24gbWVzc2FnZTtcbiAgICAgKiBzaG91bGQgYmUgcnVuIHdoZW4gZ2FtZSBsb2Fkcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqKi9cbiAgICBzaG93SW50cm8oKSB7XG4gICAgICAgIHRoaXMuc2V0dXBCb2FyZCgpO1xuICAgICAgICB0aGlzLnNldHVwUHJldmlld0JvYXJkKCk7XG5cbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZShcImludHJvXCIpO1xuICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRldHJqcy1pbnRyby1uZXdnYW1lXCIpO1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5uZXdHYW1lKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIEFib3V0IFBvcG92ZXJcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNob3dBYm91dCgpIHtcbiAgICAgICAgdGhpcy5raWxsR2FtZUludGVydmFsKCk7XG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXCJhYm91dFwiKTtcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXRyanMtYWJvdXQtY2xvc2VcIik7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0UGxheSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IGEgbWVzc2FnZSBpbiB0aGUgbW9kYWwgd2luZG93LlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2hvd01lc3NhZ2UodGVtcGxhdGVfbmFtZSwgdmFycykge1xuICAgICAgICBjb25zdCBlbE1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5ET01fSURTLk1PREFMKTtcbiAgICAgICAgY29uc3QgZWxWZWlsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5ET01fSURTLk1PREFMX1ZFSUwpO1xuXG4gICAgICAgIGNvbnN0IGh0bWwgPSB0ZW1wbGF0ZXNbdGVtcGxhdGVfbmFtZV0odmFycyk7XG5cbiAgICAgICAgZWxNb2RhbC5pbm5lckhUTUwgPSBodG1sO1xuXG4gICAgICAgIHV0aWwuZmFkZUluKGVsVmVpbCwgKCkgPT4ge1xuICAgICAgICAgICAgZWxNb2RhbC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIGVsTW9kYWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgIC8vQ2VudGVyIHRoZSBtZXNzYWdlIGluIHRoZSB2ZWlsXG4gICAgICAgICAgICBjb25zdCBsZWZ0T2Zmc2V0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAoZWxWZWlsLm9mZnNldFdpZHRoIC0gZWxNb2RhbC5vZmZzZXRXaWR0aCkgLyAyXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3QgdG9wT2Zmc2V0ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAoZWxWZWlsLm9mZnNldEhlaWdodCAtIGVsTW9kYWwub2Zmc2V0SGVpZ2h0KSAvIDJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGVsTW9kYWwuc3R5bGUubGVmdCA9IGxlZnRPZmZzZXQgKyBcInB4XCI7XG4gICAgICAgICAgICBlbE1vZGFsLnN0eWxlLnRvcCA9IHRvcE9mZnNldCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsTW9kYWwuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhpZGUgdGhlIG1vZGFsIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBoaWRlTWVzc2FnZSgpIHtcbiAgICAgICAgdmFyIGVsTW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLkRPTV9JRFMuTU9EQUwpO1xuICAgICAgICB2YXIgZWxWZWlsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5ET01fSURTLk1PREFMX1ZFSUwpO1xuICAgICAgICB1dGlsLmZhZGVPdXQoZWxNb2RhbCwgKCkgPT4ge1xuICAgICAgICAgICAgLy9DbGVhciBhZnRlciB0aGUgZmFkZVxuICAgICAgICAgICAgZWxNb2RhbC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICB9KTtcbiAgICAgICAgdXRpbC5mYWRlT3V0KGVsVmVpbCwgKCkgPT4ge30pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biB0ZXRyanMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RyaW5nIGNvbnRhaW5lcklEIFRoZSBjb250YWluZXIgaWQgZm9yIHRldHJqcy5cbiAgICAgKi9cbiAgICBydW4oY29udGFpbmVySUQpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJRCk7XG4gICAgICAgIGVsLmlubmVySFRNTCA9IHRlbXBsYXRlc1tcImNvbnRhaW5lclwiXSgpO1xuXG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV0cmpzLWJ1dHRvbi1wYXVzZVwiKTtcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgICAgICAgIHRoaXMucGF1c2VHYW1lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IG5ld0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV0cmpzLWJ1dHRvbi1uZXdcIik7XG4gICAgICAgIG5ld0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5ld0dhbWUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgYWJvdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRldHJqcy1idXR0b24tYWJvdXRcIik7XG4gICAgICAgIGFib3V0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Fib3V0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2V0dXBLZXlFdmVudHMoKTtcblxuICAgICAgICB0aGlzLnNob3dJbnRybygpO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJoYXNDbGFzcyIsImVsZSIsImNscyIsImNsYXNzTmFtZSIsIm1hdGNoIiwiUmVnRXhwIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsInJlZyIsInJlcGxhY2UiLCJmYWRlSW4iLCJlbGVtZW50IiwiY2IiLCJvcCIsInN0eWxlIiwiZGlzcGxheSIsInRpbWVyIiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwib3BhY2l0eSIsImZpbHRlciIsImZhZGVPdXQiLCJvdXRlckhlaWdodCIsIm91dGVyV2lkdGgiLCJCTE9DS19UWVBFUyIsIkJMT0NLUyIsIlNUUkFJR0hUIiwiY2xhc3MiLCJub19wb3NpdGlvbnMiLCJwb3NpdGlvbnMiLCJ0cmFuc19yb3ciLCJ0cmFuc19jb2wiLCJyb3dzIiwiTF9MRUZUIiwiTF9SSUdIVCIsIlNRVUFSRSIsIlMiLCJaIiwiVCIsIlNFVFRJTkdTIiwiQk9BUkRfQ09MU19XSURFIiwiQk9BUkRfUk9XU19ISUdIIiwiUElFQ0VfU1RBUlRfQ09MIiwiUElFQ0VfU1RBUlRfUk9XIiwiUElFQ0VfU1RBUlRfUE9TIiwiR0FNRV9JTlRFUlZBTF9NUyIsIkdBTUVfU0NPUkVfTVVMVElQTElFUiIsIkNFTExfV0lEVEhfUFgiLCJDRUxMX0hFSUdIVF9QWCIsImFib3V0IiwiY29udGFpbmVyIiwiZ2FtZW92ZXIiLCJzY29yZSIsInJvd3NFbGltaW5hdGVkIiwibGV2ZWwiLCJpbnRybyIsInBhdXNlZCIsIlRldHJqcyIsIkJPQVJEX1dSQVBQRVIiLCJCT0FSRCIsIlBSRVZJRVdfQ09OVEFJTkVSIiwiU0NPUkVfQ09OVEFJTkVSIiwiTEVWRUxfQ09OVEFJTkVSIiwiTU9EQUwiLCJNT0RBTF9WRUlMIiwiQk9BUkRfQkxPQ0siLCJ0eXBlIiwiYmxvY2tJZHMiLCJibG9ja1Bvc2l0aW9ucyIsInJvdyIsImNvbCIsInBvc2l0aW9uIiwiYmxvY2tzIiwib2JqIiwibXMiLCJlbEJvYXJkIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsIkRPTV9JRFMiLCJlbFdyYXBwZXIiLCJpbm5lckhUTUwiLCJib2FyZCIsIndyYXBwZXJXaWR0aCIsIndyYXBwZXJIZWlnaHQiLCJ3aWR0aCIsImhlaWdodCIsImJvYXJkV2lkdGgiLCJib2FyZEhlaWdodCIsImkiLCJ0b3BfcG9zIiwiaiIsImxlZnRfcG9zIiwiYmxvY2siLCJjcmVhdGVFbGVtZW50IiwibGVmdCIsInRvU3RyaW5nIiwidG9wIiwiRE9NX0NMQVNTRVMiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsImVsUHJldmlld0JvYXJkIiwicHJldmlld19zZWN0aW9uc193aWRlIiwicHJldmlld19zZWN0aW9uc19oaWdoIiwidG9wUG9zIiwibGVmdFBvcyIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImxlbmd0aCIsImlzUGF1c2VkIiwicHJldmlld1BpZWNlIiwiYmxvY2tfaWQiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJnZW5lcmF0ZVJhbmRvbUJsb2NrVHlwZSIsInN0YXJ0Q29sIiwic3RhcnRSb3ciLCJibG9ja1Jvd3MiLCJyb3dJbmRleCIsImNvbEluZGV4IiwiYmxvY2tDb2wiLCJibG9ja1JvdyIsImlkIiwiZWwiLCJhZGQiLCJwdXNoIiwiZGVzaXJlZERpcmVjdGlvbiIsImRlc2lyZWRQb3NpdGlvbiIsImN1cnJlbnRCbG9jayIsImJsb2NrTnVtUG9zaXRpb25zIiwiYmxvY2tQb3NUcmFuc1JvdyIsImJsb2NrUG9zVHJhbnNDb2wiLCJuZXh0RGVzaXJlZFBvc2l0aW9uIiwibG9ja0N1cnJlbnRCbG9jayIsImxvd2VzdENvbCIsImxvd2VzdFJvdyIsInBvc2l0aW9uSXNBdmFpbGFibGUiLCJ0bXBQaWVjZUNvbFBvcyIsInRtcFBpZWNlUm93UG9zIiwiZGVzaXJlZENvbCIsImRlc2lyZWRSb3ciLCJoYXNPd25Qcm9wZXJ0eSIsImdhbWVPdmVyIiwiZG9lc0JvYXJkUG9zaXRpb25FeGlzdCIsInJlbW92ZUN1cnJlbnRCbG9ja0Zyb21Cb2FyZCIsInBvcyIsInRtcElkIiwiZG9tQmxvY2siLCJjaGVja0FuZEVsaW1pbmF0ZVJvd3MiLCJuZXh0QmxvY2siLCJub1Jvd3NFbGltaW5hdGVkIiwiY29sdW1uRmlsbENvdW50IiwiaUNvbEluZGV4IiwiYWJvdmVDbGFzcyIsIm5vX3Jvd3NfZWxpbWluYXRlZCIsIm11bHRpcGxlX3Jvd19ib251cyIsImN1cnJlbnRfbXVsdGlwbGllciIsImN1cnJlbnRHYW1lIiwic2V0U2NvcmVUZXh0Iiwic2V0TGV2ZWxUZXh0IiwiZ2FtZUludGVydmFsVGltZXIiLCJpbm5lclRleHQiLCJtb3ZlQmxvY2siLCJraWxsR2FtZUludGVydmFsIiwic3RhcnRHYW1lSW50ZXJ2YWwiLCJtYWtlUHJldmlld1BpZWNlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJrZXlDb2RlIiwicGF1c2VHYW1lIiwicHJldmVudERlZmF1bHQiLCJoaWRlTWVzc2FnZSIsInN0YXJ0UGxheSIsInNob3dNZXNzYWdlIiwiYnV0dG9uIiwiZXYiLCJ0ZW1wbGF0ZV92YXJzIiwibmV3R2FtZSIsInNldHVwQm9hcmQiLCJzZXR1cFByZXZpZXdCb2FyZCIsInRlbXBsYXRlX25hbWUiLCJ2YXJzIiwiZWxNb2RhbCIsImVsVmVpbCIsImh0bWwiLCJ0ZW1wbGF0ZXMiLCJ1dGlsIiwibGVmdE9mZnNldCIsIm9mZnNldFdpZHRoIiwidG9wT2Zmc2V0Iiwib2Zmc2V0SGVpZ2h0IiwiY29udGFpbmVySUQiLCJuZXdCdXR0b24iLCJzaG93QWJvdXQiLCJzZXR1cEtleUV2ZW50cyIsInNob3dJbnRybyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFBOzs7Ozs7RUFNQSxTQUFTQSxRQUFULENBQWtCQyxHQUFsQixFQUF1QkMsR0FBdkIsRUFBNEI7RUFDeEIsU0FBTyxDQUFDLENBQUNELEdBQUcsQ0FBQ0UsU0FBSixDQUFjQyxLQUFkLENBQW9CLElBQUlDLE1BQUosQ0FBVyxZQUFZSCxHQUFaLEdBQWtCLFNBQTdCLENBQXBCLENBQVQ7RUFDSDtFQUVEOzs7Ozs7OztFQU1BLFNBQVNJLFFBQVQsQ0FBa0JMLEdBQWxCLEVBQXVCQyxHQUF2QixFQUE0QjtFQUN4QixNQUFJLENBQUNGLFFBQVEsQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLENBQWIsRUFBeUJELEdBQUcsQ0FBQ0UsU0FBSixJQUFpQixNQUFNRCxHQUF2QjtFQUM1QjtFQUVEOzs7Ozs7OztFQU1BLFNBQVNLLFdBQVQsQ0FBcUJOLEdBQXJCLEVBQTBCQyxHQUExQixFQUErQjtFQUMzQixNQUFJRixRQUFRLENBQUNDLEdBQUQsRUFBTUMsR0FBTixDQUFaLEVBQXdCO0VBQ3BCLFFBQUlNLEdBQUcsR0FBRyxJQUFJSCxNQUFKLENBQVcsWUFBWUgsR0FBWixHQUFrQixTQUE3QixDQUFWO0VBQ0FELElBQUFBLEdB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

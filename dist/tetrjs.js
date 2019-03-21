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

  var util = {
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass
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
      positions: {
        0: {
          trans_row: 1,
          trans_col: -1,
          rows: {
            "0": {
              0: 1,
              1: 1,
              2: 1,
              3: 1
            }
          }
        },
        1: {
          trans_row: -1,
          trans_col: 1,
          rows: {
            "0": {
              0: 1
            },
            "1": {
              0: 1
            },
            "2": {
              0: 1
            },
            "3": {
              0: 1
            }
          }
        }
      }
    },
    L_LEFT: {
      class: "tetrjs-block-l-left",
      no_positions: 4,
      positions: {
        0: {
          trans_row: 1,
          trans_col: -1,
          rows: {
            "0": {
              0: 1,
              1: 1,
              2: 1
            },
            "1": {
              0: 0,
              1: 0,
              2: 1
            }
          }
        },
        1: {
          trans_row: -1,
          trans_col: 0,
          rows: {
            "0": {
              0: 0,
              1: 1
            },
            "1": {
              0: 0,
              1: 1
            },
            "2": {
              0: 1,
              1: 1
            }
          }
        },
        2: {
          trans_row: 0,
          trans_col: 0,
          rows: {
            "0": {
              0: 1,
              1: 0,
              2: 0
            },
            "1": {
              0: 1,
              1: 1,
              2: 1
            }
          }
        },
        3: {
          trans_row: 0,
          trans_col: 1,
          rows: {
            "0": {
              0: 1,
              1: 1
            },
            "1": {
              0: 1,
              1: 0
            },
            "2": {
              0: 1,
              1: 0
            }
          }
        }
      }
    },
    L_RIGHT: {
      class: "tetrjs-block-l-right",
      no_positions: 4,
      positions: {
        0: {
          trans_row: 1,
          trans_col: -1,
          rows: {
            "0": {
              0: 1,
              1: 1,
              2: 1
            },
            "1": {
              0: 1,
              1: 0,
              2: 0
            }
          }
        },
        1: {
          trans_row: -1,
          trans_col: 0,
          rows: {
            "0": {
              0: 1,
              1: 1
            },
            "1": {
              0: 0,
              1: 1
            },
            "2": {
              0: 0,
              1: 1
            }
          }
        },
        2: {
          trans_row: 0,
          trans_col: 0,
          rows: {
            "0": {
              0: 0,
              1: 0,
              2: 1
            },
            "1": {
              0: 1,
              1: 1,
              2: 1
            }
          }
        },
        3: {
          trans_row: 0,
          trans_col: 1,
          rows: {
            "0": {
              0: 1,
              1: 0
            },
            "1": {
              0: 1,
              1: 0
            },
            "2": {
              0: 1,
              1: 1
            }
          }
        }
      }
    },
    SQUARE: {
      class: "tetrjs-block-square",
      no_positions: 1,
      positions: {
        0: {
          trans_row: 0,
          trans_col: 0,
          rows: {
            "0": {
              0: 1,
              1: 1
            },
            "1": {
              0: 1,
              1: 1
            }
          }
        }
      }
    },
    S: {
      class: "tetrjs-block-s",
      no_positions: 2,
      positions: {
        0: {
          trans_row: 1,
          trans_col: 0,
          rows: {
            "0": {
              0: 0,
              1: 1,
              2: 1
            },
            "1": {
              0: 1,
              1: 1,
              2: 0
            }
          }
        },
        1: {
          trans_row: -1,
          trans_col: 0,
          rows: {
            "0": {
              0: 1,
              1: 0
            },
            "1": {
              0: 1,
              1: 1
            },
            "2": {
              0: 0,
              1: 1
            }
          }
        }
      }
    },
    Z: {
      class: "tetrjs-block-z",
      no_positions: 2,
      positions: {
        0: {
          trans_row: 1,
          trans_col: 0,
          rows: {
            "0": {
              0: 1,
              1: 1,
              2: 0
            },
            "1": {
              0: 0,
              1: 1,
              2: 1
            }
          }
        },
        1: {
          trans_row: -1,
          trans_col: 0,
          rows: {
            "0": {
              0: 0,
              1: 1
            },
            "1": {
              0: 1,
              1: 1
            },
            "2": {
              0: 1,
              1: 0
            }
          }
        }
      }
    },
    T: {
      class: "tetrjs-block-t",
      no_positions: 4,
      positions: {
        0: {
          trans_row: 1,
          trans_col: -1,
          rows: {
            "0": {
              0: 1,
              1: 1,
              2: 1
            },
            "1": {
              0: 0,
              1: 1,
              2: 0
            }
          }
        },
        1: {
          trans_row: -1,
          trans_col: 0,
          rows: {
            "0": {
              0: 0,
              1: 1
            },
            "1": {
              0: 1,
              1: 1
            },
            "2": {
              0: 0,
              1: 1
            }
          }
        },
        2: {
          trans_row: 0,
          trans_col: 0,
          rows: {
            "0": {
              0: 0,
              1: 1,
              2: 0
            },
            "1": {
              0: 1,
              1: 1,
              2: 1
            }
          }
        },
        3: {
          trans_row: 0,
          trans_col: 1,
          rows: {
            "0": {
              0: 1,
              1: 0
            },
            "1": {
              0: 1,
              1: 1
            },
            "2": {
              0: 1,
              1: 0
            }
          }
        }
      }
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

      _defineProperty(this, "board", {});

      _defineProperty(this, "isPaused", false);

      _defineProperty(this, "DOM_IDS", {
        BOARD: "tetrjs-board",
        PREVIEW_CONTAINER: "tetrjs-next-piece-preview-container",
        SCORE_CONTAINER: "#tetrjs-score-container",
        LEVEL_CONTAINER: "#tetrjs-level-container",
        MODAL: "#tetrjs-modal",
        MODAL_VEIL: "#tetrjs-modal-veil"
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
        var $tetrjsBoard = document.getElementById(this.DOM_IDS.BOARD); // Clear the board

        $tetrjsBoard.innerHTML = "";
        this.board = {}; // Set the board size

        var boardWidth = SETTINGS.BOARD_COLS_WIDE * SETTINGS.CELL_WIDTH_PX;
        var boardHeight = SETTINGS.BOARD_ROWS_HIGH * SETTINGS.CELL_HEIGHT_PX;
        $tetrjsBoard.style.width = "".concat(boardWidth, "px");
        $tetrjsBoard.style.height = "".concat(boardHeight, "px");

        for (var i = 1; i <= SETTINGS.BOARD_ROWS_HIGH; i++) {
          this.board[i] = {};
          var top_pos = (i - 1) * SETTINGS.CELL_HEIGHT_PX;

          for (var j = 1; j <= SETTINGS.BOARD_COLS_WIDE; j++) {
            // Setup the object for storing block positions
            this.board[i][j] = {}; // Calculate left px position of the cell

            var left_pos = (j - 1) * SETTINGS.CELL_WIDTH_PX; // Add the block to the board

            var block = document.createElement("div");
            block.style.left = left_pos.toString() + "px";
            block.style.top = top_pos.toString() + "px";
            block.className = this.DOM_CLASSES.BOARD_BLOCK;
            block.setAttribute("id", "tb_".concat(j, "_").concat(i));
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

    }, {
      key: "setupPreviewBoard",
      value: function setupPreviewBoard() {
        var $previewBoard = document.getElementById(this.DOM_IDS.PREVIEW_CONTAINER);
        var preview_sections_wide = 6;
        var preview_sections_high = 4; // Clear the board

        var boardWidth = preview_sections_wide * SETTINGS.CELL_WIDTH_PX;
        var boardHeight = preview_sections_high * SETTINGS.CELL_HEIGHT_PX;
        $previewBoard.innerHTML = "";
        $previewBoard.style.width = "".concat(boardWidth, "px");
        $previewBoard.style.height = "".concat(boardHeight, "px");

        for (var i = 1; i <= preview_sections_high; i++) {
          var top_pos = (i - 1) * SETTINGS.CELL_HEIGHT_PX;

          for (var j = 1; j <= preview_sections_wide; j++) {
            var left_pos = (j - 1) * SETTINGS.CELL_WIDTH_PX;
            var block = document.createElement("div");
            block.style.top = top_pos + "px";
            block.style.left = left_pos + "px";
            block.className = this.DOM_CLASSES.BOARD_BLOCK;
            block.setAttribute("id", "tp_".concat(j, "_").concat(i));
            $previewBoard.appendChild(block);
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
            util.removeClass(block, this.previewPiece.class);
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
        var start_col = 2;
        var start_row = 2;
        var curr_block_position_rows = BLOCKS[this.previewPiece.type]["positions"][0]["rows"]; // Rows are stored as an object-matrix

        var row_keys = Object.keys(curr_block_position_rows);
        var _arr = row_keys;

        for (var _i = 0; _i < _arr.length; _i++) {
          var row_index = _arr[_i];
          var row = curr_block_position_rows[row_index];
          var col_keys = Object.keys(row);
          var _arr2 = col_keys;

          for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
            var col_index = _arr2[_i2];

            if (row[col_index] === 1) {
              var block_col = start_col + parseInt(col_index);
              var block_row = start_row + parseInt(row_index);
              var id = "tp_" + block_col + "_" + block_row;
              var el = document.getElementById(id);
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

    }, {
      key: "moveBlock",
      value: function moveBlock(desired_direction) {
        var curr_block_no_positions = BLOCKS[this.currentBlock.type]["no_positions"];
        var curr_block_pos_trans_row = 0;
        var curr_block_pos_trans_col = 0;
        var desired_position = this.currentBlock.position; // 'up' rotates the block

        if (desired_direction == "up") {
          desired_position = this.currentBlock.position + 1;

          if (desired_position > curr_block_no_positions - 1) {
            //Reset the transition back to 0
            desired_position = 0;
          } // The amount to move the desired row and column
          // during the transformation


          curr_block_pos_trans_row = BLOCKS[this.currentBlock.type]["positions"][desired_position]["trans_row"];
          curr_block_pos_trans_col = BLOCKS[this.currentBlock.type]["positions"][desired_position]["trans_col"];
        }

        var tmp_desired_positions = [];
        var lock_current_block = false;
        var tmp_lowest_col = SETTINGS.BOARD_COLS_WIDE;
        var tmp_lowest_row = SETTINGS.BOARD_ROWS_HIGH;
        var error = false;
        var curr_block_position_rows = BLOCKS[this.currentBlock.type]["positions"][desired_position]["rows"];
        var rowKeys = Object.keys(curr_block_position_rows);

        for (var row_index = 0; row_index < rowKeys.length; row_index++) {
          var row = curr_block_position_rows[row_index];
          var colKeys = Object.keys(row);

          for (var col_index = 0; col_index < colKeys.length; col_index++) {
            if (row[col_index] === 1) {
              var tmp_piece_col_pos = this.currentBlock.col + parseInt(col_index);
              var tmp_piece_row_pos = this.currentBlock.row + parseInt(row_index);
              var tmp_piece_desired_col = tmp_piece_col_pos + curr_block_pos_trans_col;
              var tmp_piece_desired_row = tmp_piece_row_pos + curr_block_pos_trans_row;

              if (desired_direction == "none") {
                if (this.board[tmp_piece_desired_row][tmp_piece_desired_col].hasOwnProperty("class")) {
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

                if (tmp_piece_desired_row > this.SETTINGS.BOARD_ROWS_HIGH || this.board[tmp_piece_desired_row][tmp_piece_desired_col].hasOwnProperty("class")) {
                  // Already a block in the next downward position
                  lock_current_block = true;
                }
              }

              if (!this.board.hasOwnProperty(tmp_piece_desired_row)) {
                //Can't move down, so error
                error = true;
              } else if (!this.board[tmp_piece_desired_row].hasOwnProperty(tmp_piece_desired_col)) {
                //Off the board error out
                error = true;
              } else if (this.board[tmp_piece_desired_row][tmp_piece_desired_col].hasOwnProperty("class")) {
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
            this.removeCurrentBlockFromBoard(); //Set the new current direction

            if (desired_direction == "up") {
              this.currentBlock.position = desired_position;
            } // Set the new current row and column


            this.currentBlock.col = tmp_lowest_col;
            this.currentBlock.row = tmp_lowest_row; // Apply the 'movement' by modifying the block's class

            var _arr3 = tmp_desired_positions;

            for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
              var pos = _arr3[_i3];
              var tmp_id = "tb_".concat(pos["col"], "_").concat(pos["row"]);
              var jTMP = document.getElementById(tmp_id);
              jTMP.addClass(this.currentBlock.class);
              this.currentBlock.blockIds.push(tmp_id);
              this.currentBlock.blockPositions.push(pos);
            }
          }
        } // The block has reached its final destination


        if (lock_current_block) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this.currentBlock.blockPositions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _pos = _step2.value;
              // Lock the current block on the board
              // by setting the permanent board class
              this.board[_pos["row"]][_pos["col"]] = {
                class: this.currentBlock.class
              };
            } // Check if the block has caused rows to be eliminated

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
        var no_rows_eliminated = 0; //Loop over the board rows

        $.each(this.board, function (r_index, row) {
          var column_full_count = 0; //Loop over the columns in this row

          $.each(row, function (c_index, col) {
            // A class indicates the column in this row is full
            if (col.hasOwnProperty("class")) {
              column_full_count++;
            }
          }); // The entire row is full

          if (column_full_count == this.SETTINGS.BOARD_COLS_WIDE) {
            no_rows_eliminated++; //Move the upper rows down, from the bottom up

            for (var i = r_index; i >= 1; i--) {
              $.each(this.board[i], function (c_index, col) {
                var prev_class = "";

                if (this.board.hasOwnProperty(i - 1) && this.board[i - 1][c_index].hasOwnProperty("class")) {
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
                  this.board[i][c_index] = {
                    class: prev_class
                  };
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
        $(this.DOM_IDS.SCORE_CONTAINER).text(this.currentGame.score);
      }
      /**
       * Set the Level text.
       *
       * @return void
       */

    }, {
      key: "setLevelText",
      value: function setLevelText() {
        $(this.DOM_IDS.LEVEL_CONTAINER).text("LEVEL " + this.currentGame.level);
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
        $.each(this.currentBlock.blockIds, function (index, block_id) {
          $(block_id).removeClass(this.currentBlock.class);
        }); //Reset the current set of blocks

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
        $(document).keydown(function (e) {
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
        if (!this.gameIntervalTimer.obj) {
          // Setup the interval object using the std js function
          this.gameIntervalTimer.obj = setInterval(function () {
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
        if (this.isPaused) {
          //Already paused, so start the game
          this.startPlay();
          return;
        }

        this.killGameInterval();
        this.isPaused = true; // Show the paused modal message (from template)

        this.showMessage("paused");
        $("button#tetrjs-pause-play").click(function () {
          this.startPlay();
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
        this.isPaused = true; // Stop the game interval

        this.killGameInterval();
        var template_vars = {
          score: this.currentGame["score"],
          rowsEliminated: this.currentGame["rowsEliminated"],
          level: this.currentGame["level"]
        }; // Show the gameover modal message (from template)

        this.showMessage("gameover", template_vars);
        $("button#tetrjs-gameover-newgame").click(function () {
          this.newGame();
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
        this.setupBoard();
        this.setupPreviewBoard();
        this.showMessage("intro");
        $("button#tetrjs-intro-newgame").click(function () {
          this.newGame();
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
        this.killGameInterval();
        this.isPaused = true;
        this.showMessage("about");
        $("button#tetrjs-about-close").click(function () {
          this.startPlay();
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
        var $modal = $(this.DOM_IDS.MODAL);
        var $veil = $(this.DOM_IDS.MODAL_VEIL);
        var html = templates[template_name].render(vars);
        $modal.html(html); //Center the message in the veil

        var leftOffset = Math.floor(($veil.width() - $modal.outerWidth()) / 2);
        var topOffset = Math.floor(($veil.height() - $modal.outerHeight()) / 2);
        $modal.css("left", leftOffset);
        $modal.css("top", topOffset);
        $veil.fadeIn(200, function () {
          $modal.fadeIn(200);
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
        var $modal = $(this.DOM_IDS.MODAL);
        var $veil = $(this.DOM_IDS.MODAL_VEIL);
        $modal.fadeOut(100, function () {
          $veil.hide(); //Clear after the fade

          $modal.html("");
        });
      }
      /**
       * Run tetrjs.
       *
       * @param string containerID The container id for tetrjs.
       */

    }, {
      key: "run",
      value: function run(containerID) {
        $("#" + containerID).html(templates["container"].render());
        $("button#tetrjs-button-pause").click(function () {
          this.pauseGame();
        });
        $("button#tetrjs-button-new").click(function () {
          this.newGame();
        });
        $("button#tetrjs-button-about").click(function () {
          this.showAbout();
        });
        this.setupKeyEvents();
        this.showIntro();
      }
    }]);

    return Tetrjs;
  }();

  return Tetrjs;

}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV0cmpzLmpzIiwic291cmNlcyI6WyJzcmMvdXRpbC5qcyIsInNyYy9ibG9ja3MuanMiLCJzcmMvc2V0dGluZ3MuanMiLCJzcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEZXRlcm1pbmUgaWYgYW4gZWxlbWVudCBoYXMgYSBjbGFzcy5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbHNcbiAqL1xuZnVuY3Rpb24gaGFzQ2xhc3MoZWxlLCBjbHMpIHtcbiAgICByZXR1cm4gISFlbGUuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoXCIoXFxcXHN8XilcIiArIGNscyArIFwiKFxcXFxzfCQpXCIpKTtcbn1cblxuLyoqXG4gKiBBZGQgYSBjbGFzcyB0byBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZVxuICogQHBhcmFtIHtzdHJpbmd9IGNsc1xuICovXG5mdW5jdGlvbiBhZGRDbGFzcyhlbGUsIGNscykge1xuICAgIGlmICghaGFzQ2xhc3MoZWxlLCBjbHMpKSBlbGUuY2xhc3NOYW1lICs9IFwiIFwiICsgY2xzO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNsYXNzIGZyb20gYW4gZWxlbWVudFxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZVxuICogQHBhcmFtIHtzdHJpbmd9IGNsc1xuICovXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbGUsIGNscykge1xuICAgIGlmIChoYXNDbGFzcyhlbGUsIGNscykpIHtcbiAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoXFxcXHN8XilcIiArIGNscyArIFwiKFxcXFxzfCQpXCIpO1xuICAgICAgICBlbGUuY2xhc3NOYW1lID0gZWxlLmNsYXNzTmFtZS5yZXBsYWNlKHJlZywgXCIgXCIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGhhc0NsYXNzLFxuICAgIGFkZENsYXNzLFxuICAgIHJlbW92ZUNsYXNzXG59O1xuIiwiLypcbiAqIERlZmluZXMgdGhlIFRldHJqcyBibG9jayB0eXBlcyBhbmQgdGhlaXJcbiAqIHBvc3NpYmxlIHBvc2l0aW9ucy5cbiAqXG4gKiBAYXV0aG9yIERlc3RpbiBNb3VsdG9uXG4gKiBAdmVyc2lvbiAxLjBcbiAqIEBsaWNlbnNlIE1JVFxuICpcbiAqXG4gKiBUaGUgQkxPQ0tTIG9iamVjdCBpcyBrZXllZCB0byB0aGUgYmxvY2sgbmFtZXMgZGVmaW5lZCBpbiBCTE9DS19UWVBFUy5cbiAqXG4gKiBFYWNoIEJMT0NLIGlzIGNvbXBvc2VkIG9mOlxuICogJ2NsYXNzJzogVGhlIGNzcyBjbGFzcyBmb3IgdGhlIGFjdGl2ZSBibG9ja3MuXG4gKiAnbm9fcG9zaXRpb25zJzogVGhlIG51bWJlciBvZiBwb3NzaWJsZSBwb3NpdGlvbnMgZm9yIGEgYmxvY2suXG4gKiAncG9zaXRpb25zJzogT2JqZWN0IHRvIHN0b3JlIHRoZSBkaWZmZXJlbnQgYmxvY2sgcG9zaXRpb25zXG4gKiAgICAndHJhbnNfcm93JzogdGhlIHJvdyB3aGVyZSB0aGUgYmxvY2sgaXMgXCJyb3RhdGVkXCIgZm9yIGEgcG9zaXRpb25cbiAqICAgICd0cmFuc19jb2wnOiB0aGUgY29sIHdoZXJlIHRoZSBibG9jayBpcyBcInJvdGF0ZWRcIiBmb3IgYSBwb3NpdGlvblxuICogICAgJ3Jvd3MnOiB0aGUgcm93cyB0aGF0IGZvcm0gdGhlIGJsb2NrLlxuICogICAgICAgICAgICAtIEVhY2ggcm93IGlzIGFuIG9iamVjdCBpbiB7Y29sdW1uOmJvb2xlYW4sIC4uLn0gZm9ybWF0XG4gKiAgICAgICAgICAgICAgaS5lLiBTdHJhaWdodCBibG9ja3MgaW4gdGhlIDFzdCAoMHRoKSBwb3NpdGlvbiBhcmVcbiAqICAgICAgICAgICAgICAgICAgIGFjdGl2ZSBpbiBhbGwgNCBjb2x1bW5zOiB7MDoxLCAxOjEsIDI6MSwgMzoxfVxuICpcbiAqL1xuXG5jb25zdCBCTE9DS19UWVBFUyA9IFtcIlNUUkFJR0hUXCIsIFwiTF9MRUZUXCIsIFwiTF9SSUdIVFwiLCBcIlNRVUFSRVwiLCBcIlNcIiwgXCJaXCIsIFwiVFwiXTtcblxuY29uc3QgQkxPQ0tTID0ge1xuICAgIFNUUkFJR0hUOiB7XG4gICAgICAgIGNsYXNzOiBcInRldHJqcy1ibG9jay1zdHJhaWdodFwiLFxuICAgICAgICBub19wb3NpdGlvbnM6IDIsXG4gICAgICAgIHBvc2l0aW9uczoge1xuICAgICAgICAgICAgMDoge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IC0xLFxuICAgICAgICAgICAgICAgIHJvd3M6IHtcbiAgICAgICAgICAgICAgICAgICAgXCIwXCI6IHsgMDogMSwgMTogMSwgMjogMSwgMzogMSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIDE6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IC0xLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMSxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMSB9LFxuICAgICAgICAgICAgICAgICAgICBcIjJcIjogeyAwOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiM1wiOiB7IDA6IDEgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgTF9MRUZUOiB7XG4gICAgICAgIGNsYXNzOiBcInRldHJqcy1ibG9jay1sLWxlZnRcIixcbiAgICAgICAgbm9fcG9zaXRpb25zOiA0LFxuICAgICAgICBwb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIDA6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAtMSxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDEsIDE6IDEsIDI6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMCwgMTogMCwgMjogMSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIDE6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IC0xLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDAsIDE6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMCwgMTogMSB9LFxuICAgICAgICAgICAgICAgICAgICBcIjJcIjogeyAwOiAxLCAxOiAxIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgMjoge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMCxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAxLCAxOiAwLCAyOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDEsIDE6IDEsIDI6IDEgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAzOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAwLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMSxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDEsIDE6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMSwgMTogMCB9LFxuICAgICAgICAgICAgICAgICAgICBcIjJcIjogeyAwOiAxLCAxOiAwIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgTF9SSUdIVDoge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stbC1yaWdodFwiLFxuICAgICAgICBub19wb3NpdGlvbnM6IDQsXG4gICAgICAgIHBvc2l0aW9uczoge1xuICAgICAgICAgICAgMDoge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IC0xLFxuICAgICAgICAgICAgICAgIHJvd3M6IHtcbiAgICAgICAgICAgICAgICAgICAgXCIwXCI6IHsgMDogMSwgMTogMSwgMjogMSB9LFxuICAgICAgICAgICAgICAgICAgICBcIjFcIjogeyAwOiAxLCAxOiAwLCAyOiAwIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgMToge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogLTEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAwLFxuICAgICAgICAgICAgICAgIHJvd3M6IHtcbiAgICAgICAgICAgICAgICAgICAgXCIwXCI6IHsgMDogMSwgMTogMSB9LFxuICAgICAgICAgICAgICAgICAgICBcIjFcIjogeyAwOiAwLCAxOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMlwiOiB7IDA6IDAsIDE6IDEgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAyOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAwLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDAsIDE6IDAsIDI6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMSwgMTogMSwgMjogMSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIDM6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDAsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAxLFxuICAgICAgICAgICAgICAgIHJvd3M6IHtcbiAgICAgICAgICAgICAgICAgICAgXCIwXCI6IHsgMDogMSwgMTogMCB9LFxuICAgICAgICAgICAgICAgICAgICBcIjFcIjogeyAwOiAxLCAxOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMlwiOiB7IDA6IDEsIDE6IDEgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBTUVVBUkU6IHtcbiAgICAgICAgY2xhc3M6IFwidGV0cmpzLWJsb2NrLXNxdWFyZVwiLFxuICAgICAgICBub19wb3NpdGlvbnM6IDEsXG4gICAgICAgIHBvc2l0aW9uczoge1xuICAgICAgICAgICAgMDoge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMCxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAxLCAxOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDEsIDE6IDEgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBTOiB7XG4gICAgICAgIGNsYXNzOiBcInRldHJqcy1ibG9jay1zXCIsXG4gICAgICAgIG5vX3Bvc2l0aW9uczogMixcbiAgICAgICAgcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAwOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAxLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDAsIDE6IDEsIDI6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMSwgMTogMSwgMjogMCB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIDE6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IC0xLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDEsIDE6IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMSwgMTogMSB9LFxuICAgICAgICAgICAgICAgICAgICBcIjJcIjogeyAwOiAwLCAxOiAxIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgWjoge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stelwiLFxuICAgICAgICBub19wb3NpdGlvbnM6IDIsXG4gICAgICAgIHBvc2l0aW9uczoge1xuICAgICAgICAgICAgMDoge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAxLCAxOiAxLCAyOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDAsIDE6IDEsIDI6IDEgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAxOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAtMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAwLCAxOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDEsIDE6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIyXCI6IHsgMDogMSwgMTogMCB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIFQ6IHtcbiAgICAgICAgY2xhc3M6IFwidGV0cmpzLWJsb2NrLXRcIixcbiAgICAgICAgbm9fcG9zaXRpb25zOiA0LFxuICAgICAgICBwb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIDA6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAtMSxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDEsIDE6IDEsIDI6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMCwgMTogMSwgMjogMCB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIDE6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IC0xLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDAsIDE6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMSwgMTogMSB9LFxuICAgICAgICAgICAgICAgICAgICBcIjJcIjogeyAwOiAwLCAxOiAxIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgMjoge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMCxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAwLCAxOiAxLCAyOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDEsIDE6IDEsIDI6IDEgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAzOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAwLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMSxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDEsIDE6IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMSwgMTogMSB9LFxuICAgICAgICAgICAgICAgICAgICBcIjJcIjogeyAwOiAxLCAxOiAwIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5leHBvcnQgeyBCTE9DS1MsIEJMT0NLX1RZUEVTIH07XG4iLCJjb25zdCBTRVRUSU5HUyA9IHtcbiAgICBCT0FSRF9DT0xTX1dJREU6IDEwLFxuICAgIEJPQVJEX1JPV1NfSElHSDogMTgsXG4gICAgUElFQ0VfU1RBUlRfQ09MOiA0LFxuICAgIFBJRUNFX1NUQVJUX1JPVzogMSxcbiAgICBQSUVDRV9TVEFSVF9QT1M6IDEsXG4gICAgR0FNRV9JTlRFUlZBTF9NUzogNDYwLFxuICAgIEdBTUVfU0NPUkVfTVVMVElQTElFUjogMTAwLFxuICAgIENFTExfV0lEVEhfUFg6IDIwLFxuICAgIENFTExfSEVJR0hUX1BYOiAyMFxufTtcblxuZXhwb3J0IHsgU0VUVElOR1MgfTtcbiIsIi8qKlxuICogVGV0cmpzIGlzIGEgamF2YXNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiBUZXRyaXMuXG4gKlxuICogQGF1dGhvciBEZXN0aW4gTW91bHRvblxuICogQGxpY2Vuc2UgTUlUXG4gKiBAdmVyc2lvbiAxLjBcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9kZXN0aW5tb3VsdG9uL3RldHJqc1xuICovXG5cbmltcG9ydCB1dGlsIGZyb20gXCIuL3V0aWxcIjtcbmltcG9ydCB7IEJMT0NLUywgQkxPQ0tfVFlQRVMgfSBmcm9tIFwiLi9ibG9ja3NcIjtcbmltcG9ydCB7IFNFVFRJTkdTIH0gZnJvbSBcIi4vc2V0dGluZ3NcIjtcblxuLyoqXG4gKiBUaGUgY29uc3RydWN0b3IuXG4gKiBJbml0aWFsaXplcyB0aGUgYmFzaWMgY29uZmlndXJhdGlvbiB2YWx1ZXMuXG4gKiBAcmV0dXJuIHZvaWRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV0cmpzIHtcbiAgICBib2FyZCA9IHt9O1xuXG4gICAgaXNQYXVzZWQgPSBmYWxzZTtcblxuICAgIERPTV9JRFMgPSB7XG4gICAgICAgIEJPQVJEOiBcInRldHJqcy1ib2FyZFwiLFxuICAgICAgICBQUkVWSUVXX0NPTlRBSU5FUjogXCJ0ZXRyanMtbmV4dC1waWVjZS1wcmV2aWV3LWNvbnRhaW5lclwiLFxuICAgICAgICBTQ09SRV9DT05UQUlORVI6IFwiI3RldHJqcy1zY29yZS1jb250YWluZXJcIixcbiAgICAgICAgTEVWRUxfQ09OVEFJTkVSOiBcIiN0ZXRyanMtbGV2ZWwtY29udGFpbmVyXCIsXG4gICAgICAgIE1PREFMOiBcIiN0ZXRyanMtbW9kYWxcIixcbiAgICAgICAgTU9EQUxfVkVJTDogXCIjdGV0cmpzLW1vZGFsLXZlaWxcIlxuICAgIH07XG5cbiAgICBET01fQ0xBU1NFUyA9IHtcbiAgICAgICAgQk9BUkRfQkxPQ0s6IFwidGV0cmpzLWJvYXJkLWJsb2NrXCJcbiAgICB9O1xuXG4gICAgY3VycmVudEJsb2NrID0ge1xuICAgICAgICB0eXBlOiBcIlwiLFxuICAgICAgICBibG9ja0lkczogW10sXG4gICAgICAgIGJsb2NrUG9zaXRpb25zOiBbXSxcbiAgICAgICAgY2xhc3M6IFwiXCIsXG4gICAgICAgIHJvdzogU0VUVElOR1MuUElFQ0VfU1RBUlRfUk9XLFxuICAgICAgICBjb2w6IFNFVFRJTkdTLlBJRUNFX1NUQVJUX0NPTCxcbiAgICAgICAgcG9zaXRpb246IFNFVFRJTkdTLlBJRUNFX1NUQVJUX1BPU1xuICAgIH07XG5cbiAgICBwcmV2aWV3UGllY2UgPSB7XG4gICAgICAgIHR5cGU6IFwiXCIsXG4gICAgICAgIGNsYXNzOiBcIlwiLFxuICAgICAgICBibG9ja3M6IFtdXG4gICAgfTtcblxuICAgIGdhbWVJbnRlcnZhbFRpbWVyID0ge1xuICAgICAgICBvYmo6IGZhbHNlLFxuICAgICAgICBtczogU0VUVElOR1MuR0FNRV9JTlRFUlZBTF9NU1xuICAgIH07XG5cbiAgICBjdXJyZW50R2FtZSA9IHtcbiAgICAgICAgc2NvcmU6IDAsXG4gICAgICAgIHJvd3NFbGltaW5hdGVkOiAwLFxuICAgICAgICBsZXZlbDogMVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCB0aGUgVGV0cmpzIGJvYXJkLlxuICAgICAqICAxLiBDbGVhciB0aGUgYm9hcmRcbiAgICAgKiAgICAgaS4gUmVtb3ZlIGFueSBleGlzdGluZyBIVE1MXG4gICAgICogICAgIGlpLiBDbGVhciB0aGUgbXVsdGlkaW1lbnNpb25hbC9tYXRyaXggYm9hcmQgb2JqZWN0XG4gICAgICogIDIuIFNldCB0aGUgYm9hcmQgd2lkdGggYW5kIGhlaWdodCAoaW4gcHgpXG4gICAgICogIDMuIENyZWF0ZSB0aGUgbmV3LCBjbGVhbiwgYm9hcmRcbiAgICAgKiAgICAgaS4gSW5zdGFudGlhdGUgdGhlIG11bHRpZGltZW5zaW9uYWwvbWF0cml4IGJvYXJkIGNvbnRhaW5lclxuICAgICAqICAgICBpaS4gQ3JlYXRlIGRpdiBib3hlcyBhdCBhYnNvbHV0ZSBwb3NpdGlvbiB0byBob2xkIGJsb2Nrc1xuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2V0dXBCb2FyZCgpIHtcbiAgICAgICAgY29uc3QgJHRldHJqc0JvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5ET01fSURTLkJPQVJEKTtcblxuICAgICAgICAvLyBDbGVhciB0aGUgYm9hcmRcbiAgICAgICAgJHRldHJqc0JvYXJkLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIHRoaXMuYm9hcmQgPSB7fTtcblxuICAgICAgICAvLyBTZXQgdGhlIGJvYXJkIHNpemVcbiAgICAgICAgY29uc3QgYm9hcmRXaWR0aCA9IFNFVFRJTkdTLkJPQVJEX0NPTFNfV0lERSAqIFNFVFRJTkdTLkNFTExfV0lEVEhfUFg7XG4gICAgICAgIGNvbnN0IGJvYXJkSGVpZ2h0ID0gU0VUVElOR1MuQk9BUkRfUk9XU19ISUdIICogU0VUVElOR1MuQ0VMTF9IRUlHSFRfUFg7XG4gICAgICAgICR0ZXRyanNCb2FyZC5zdHlsZS53aWR0aCA9IGAke2JvYXJkV2lkdGh9cHhgO1xuICAgICAgICAkdGV0cmpzQm9hcmQuc3R5bGUuaGVpZ2h0ID0gYCR7Ym9hcmRIZWlnaHR9cHhgO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IFNFVFRJTkdTLkJPQVJEX1JPV1NfSElHSDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJvYXJkW2ldID0ge307XG4gICAgICAgICAgICBjb25zdCB0b3BfcG9zID0gKGkgLSAxKSAqIFNFVFRJTkdTLkNFTExfSEVJR0hUX1BYO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPD0gU0VUVElOR1MuQk9BUkRfQ09MU19XSURFOyBqKyspIHtcbiAgICAgICAgICAgICAgICAvLyBTZXR1cCB0aGUgb2JqZWN0IGZvciBzdG9yaW5nIGJsb2NrIHBvc2l0aW9uc1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbaV1bal0gPSB7fTtcblxuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBsZWZ0IHB4IHBvc2l0aW9uIG9mIHRoZSBjZWxsXG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdF9wb3MgPSAoaiAtIDEpICogU0VUVElOR1MuQ0VMTF9XSURUSF9QWDtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCB0aGUgYmxvY2sgdG8gdGhlIGJvYXJkXG4gICAgICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGJsb2NrLnN0eWxlLmxlZnQgPSBsZWZ0X3Bvcy50b1N0cmluZygpICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGJsb2NrLnN0eWxlLnRvcCA9IHRvcF9wb3MudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBibG9jay5jbGFzc05hbWUgPSB0aGlzLkRPTV9DTEFTU0VTLkJPQVJEX0JMT0NLO1xuICAgICAgICAgICAgICAgIGJsb2NrLnNldEF0dHJpYnV0ZShcImlkXCIsIGB0Yl8ke2p9XyR7aX1gKTtcbiAgICAgICAgICAgICAgICAkdGV0cmpzQm9hcmQuYXBwZW5kQ2hpbGQoYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0dXAgdGhlIHNtYWxsIHByZXZpZXcgYm9hcmQgdG8gZGlzcGxheSB0aGUgbmV4dCBwaWVjZS5cbiAgICAgKlxuICAgICAqIEFsbW9zdCBpZGVudGljYWwgdG8gdGhlIHNldHVwQm9hcmQgZnVuY3Rpb24sIGV4Y2VwdCB3ZVxuICAgICAqIGRvIG5vdCBuZWVkIGEgbXVsdGlkaW1lbnNpb25hbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYm9hcmQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzZXR1cFByZXZpZXdCb2FyZCgpIHtcbiAgICAgICAgdmFyICRwcmV2aWV3Qm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgIHRoaXMuRE9NX0lEUy5QUkVWSUVXX0NPTlRBSU5FUlxuICAgICAgICApO1xuICAgICAgICB2YXIgcHJldmlld19zZWN0aW9uc193aWRlID0gNjtcbiAgICAgICAgdmFyIHByZXZpZXdfc2VjdGlvbnNfaGlnaCA9IDQ7XG5cbiAgICAgICAgLy8gQ2xlYXIgdGhlIGJvYXJkXG4gICAgICAgIGNvbnN0IGJvYXJkV2lkdGggPSBwcmV2aWV3X3NlY3Rpb25zX3dpZGUgKiBTRVRUSU5HUy5DRUxMX1dJRFRIX1BYO1xuICAgICAgICBjb25zdCBib2FyZEhlaWdodCA9IHByZXZpZXdfc2VjdGlvbnNfaGlnaCAqIFNFVFRJTkdTLkNFTExfSEVJR0hUX1BYO1xuICAgICAgICAkcHJldmlld0JvYXJkLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICRwcmV2aWV3Qm9hcmQuc3R5bGUud2lkdGggPSBgJHtib2FyZFdpZHRofXB4YDtcbiAgICAgICAgJHByZXZpZXdCb2FyZC5zdHlsZS5oZWlnaHQgPSBgJHtib2FyZEhlaWdodH1weGA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcHJldmlld19zZWN0aW9uc19oaWdoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0b3BfcG9zID0gKGkgLSAxKSAqIFNFVFRJTkdTLkNFTExfSEVJR0hUX1BYO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPD0gcHJldmlld19zZWN0aW9uc193aWRlOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbGVmdF9wb3MgPSAoaiAtIDEpICogU0VUVElOR1MuQ0VMTF9XSURUSF9QWDtcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGJsb2NrLnN0eWxlLnRvcCA9IHRvcF9wb3MgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgYmxvY2suc3R5bGUubGVmdCA9IGxlZnRfcG9zICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGJsb2NrLmNsYXNzTmFtZSA9IHRoaXMuRE9NX0NMQVNTRVMuQk9BUkRfQkxPQ0s7XG4gICAgICAgICAgICAgICAgYmxvY2suc2V0QXR0cmlidXRlKFwiaWRcIiwgYHRwXyR7an1fJHtpfWApO1xuICAgICAgICAgICAgICAgICRwcmV2aWV3Qm9hcmQuYXBwZW5kQ2hpbGQoYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IGEgcmFuZG9tIGJsb2NrIHR5cGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHN0cmluZyBCbG9jayB0eXBlXG4gICAgICovXG4gICAgZ2VuZXJhdGVSYW5kb21CbG9ja1R5cGUoKSB7XG4gICAgICAgIHJldHVybiBCTE9DS19UWVBFU1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBCTE9DS19UWVBFUy5sZW5ndGgpXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNYWtlIHRoZSBwcmV2aWV3IGJsb2NrIGluIHRoZSBwcmV2aWV3IGJvYXJkLlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgbWFrZVByZXZpZXdQaWVjZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNQYXVzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vUmVtb3ZlIHRoZSBjdXJyZW50IGJsb2NrIGZyb20gdGhlIHByZXZpZXdcbiAgICAgICAgZm9yIChsZXQgYmxvY2tfaWQgb2YgdGhpcy5wcmV2aWV3UGllY2UuYmxvY2tzKSB7XG4gICAgICAgICAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrX2lkKTtcbiAgICAgICAgICAgIHV0aWwucmVtb3ZlQ2xhc3MoYmxvY2ssIHRoaXMucHJldmlld1BpZWNlLmNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXZpZXdQaWVjZS5ibG9ja3MgPSBbXTtcblxuICAgICAgICAvL0dldCBhIHJhbmRvbSBibG9ja1xuICAgICAgICB0aGlzLnByZXZpZXdQaWVjZS50eXBlID0gdGhpcy5nZW5lcmF0ZVJhbmRvbUJsb2NrVHlwZSgpO1xuXG4gICAgICAgIHRoaXMucHJldmlld1BpZWNlLmNsYXNzID0gQkxPQ0tTW3RoaXMucHJldmlld1BpZWNlLnR5cGVdW1wiY2xhc3NcIl07XG4gICAgICAgIGNvbnN0IHN0YXJ0X2NvbCA9IDI7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3JvdyA9IDI7XG4gICAgICAgIGNvbnN0IGN1cnJfYmxvY2tfcG9zaXRpb25fcm93cyA9XG4gICAgICAgICAgICBCTE9DS1NbdGhpcy5wcmV2aWV3UGllY2UudHlwZV1bXCJwb3NpdGlvbnNcIl1bMF1bXCJyb3dzXCJdO1xuXG4gICAgICAgIC8vIFJvd3MgYXJlIHN0b3JlZCBhcyBhbiBvYmplY3QtbWF0cml4XG4gICAgICAgIGNvbnN0IHJvd19rZXlzID0gT2JqZWN0LmtleXMoY3Vycl9ibG9ja19wb3NpdGlvbl9yb3dzKTtcbiAgICAgICAgZm9yIChsZXQgcm93X2luZGV4IG9mIHJvd19rZXlzKSB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBjdXJyX2Jsb2NrX3Bvc2l0aW9uX3Jvd3Nbcm93X2luZGV4XTtcbiAgICAgICAgICAgIGNvbnN0IGNvbF9rZXlzID0gT2JqZWN0LmtleXMocm93KTtcbiAgICAgICAgICAgIGZvciAobGV0IGNvbF9pbmRleCBvZiBjb2xfa2V5cykge1xuICAgICAgICAgICAgICAgIGlmIChyb3dbY29sX2luZGV4XSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBibG9ja19jb2wgPSBzdGFydF9jb2wgKyBwYXJzZUludChjb2xfaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBibG9ja19yb3cgPSBzdGFydF9yb3cgKyBwYXJzZUludChyb3dfaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IFwidHBfXCIgKyBibG9ja19jb2wgKyBcIl9cIiArIGJsb2NrX3JvdztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgICAgICAgICAgICAgIHV0aWwuYWRkQ2xhc3MoZWwsIHRoaXMucHJldmlld1BpZWNlLmNsYXNzKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZpZXdQaWVjZS5ibG9ja3MucHVzaChpZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW92ZSBhIGJsb2NrIG9uIHRoZSBib2FyZC5cbiAgICAgKiBUaGlzIGlzIG1vc3RseSBjYWxsZWQgYXMgdGhlIGtleWJvYXJkIGV2ZW50IGhhbmRsZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBtb3ZlQmxvY2soZGVzaXJlZF9kaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIGN1cnJfYmxvY2tfbm9fcG9zaXRpb25zID1cbiAgICAgICAgICAgIEJMT0NLU1t0aGlzLmN1cnJlbnRCbG9jay50eXBlXVtcIm5vX3Bvc2l0aW9uc1wiXTtcbiAgICAgICAgdmFyIGN1cnJfYmxvY2tfcG9zX3RyYW5zX3JvdyA9IDA7XG4gICAgICAgIHZhciBjdXJyX2Jsb2NrX3Bvc190cmFuc19jb2wgPSAwO1xuICAgICAgICB2YXIgZGVzaXJlZF9wb3NpdGlvbiA9IHRoaXMuY3VycmVudEJsb2NrLnBvc2l0aW9uO1xuXG4gICAgICAgIC8vICd1cCcgcm90YXRlcyB0aGUgYmxvY2tcbiAgICAgICAgaWYgKGRlc2lyZWRfZGlyZWN0aW9uID09IFwidXBcIikge1xuICAgICAgICAgICAgZGVzaXJlZF9wb3NpdGlvbiA9IHRoaXMuY3VycmVudEJsb2NrLnBvc2l0aW9uICsgMTtcbiAgICAgICAgICAgIGlmIChkZXNpcmVkX3Bvc2l0aW9uID4gY3Vycl9ibG9ja19ub19wb3NpdGlvbnMgLSAxKSB7XG4gICAgICAgICAgICAgICAgLy9SZXNldCB0aGUgdHJhbnNpdGlvbiBiYWNrIHRvIDBcbiAgICAgICAgICAgICAgICBkZXNpcmVkX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIGFtb3VudCB0byBtb3ZlIHRoZSBkZXNpcmVkIHJvdyBhbmQgY29sdW1uXG4gICAgICAgICAgICAvLyBkdXJpbmcgdGhlIHRyYW5zZm9ybWF0aW9uXG4gICAgICAgICAgICBjdXJyX2Jsb2NrX3Bvc190cmFuc19yb3cgPVxuICAgICAgICAgICAgICAgIEJMT0NLU1t0aGlzLmN1cnJlbnRCbG9jay50eXBlXVtcInBvc2l0aW9uc1wiXVtkZXNpcmVkX3Bvc2l0aW9uXVtcbiAgICAgICAgICAgICAgICAgICAgXCJ0cmFuc19yb3dcIlxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICBjdXJyX2Jsb2NrX3Bvc190cmFuc19jb2wgPVxuICAgICAgICAgICAgICAgIEJMT0NLU1t0aGlzLmN1cnJlbnRCbG9jay50eXBlXVtcInBvc2l0aW9uc1wiXVtkZXNpcmVkX3Bvc2l0aW9uXVtcbiAgICAgICAgICAgICAgICAgICAgXCJ0cmFuc19jb2xcIlxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdG1wX2Rlc2lyZWRfcG9zaXRpb25zID0gW107XG4gICAgICAgIHZhciBsb2NrX2N1cnJlbnRfYmxvY2sgPSBmYWxzZTtcbiAgICAgICAgdmFyIHRtcF9sb3dlc3RfY29sID0gU0VUVElOR1MuQk9BUkRfQ09MU19XSURFO1xuICAgICAgICB2YXIgdG1wX2xvd2VzdF9yb3cgPSBTRVRUSU5HUy5CT0FSRF9ST1dTX0hJR0g7XG5cbiAgICAgICAgdmFyIGVycm9yID0gZmFsc2U7XG4gICAgICAgIHZhciBjdXJyX2Jsb2NrX3Bvc2l0aW9uX3Jvd3MgPVxuICAgICAgICAgICAgQkxPQ0tTW3RoaXMuY3VycmVudEJsb2NrLnR5cGVdW1wicG9zaXRpb25zXCJdW2Rlc2lyZWRfcG9zaXRpb25dW1xuICAgICAgICAgICAgICAgIFwicm93c1wiXG4gICAgICAgICAgICBdO1xuICAgICAgICBjb25zdCByb3dLZXlzID0gT2JqZWN0LmtleXMoY3Vycl9ibG9ja19wb3NpdGlvbl9yb3dzKTtcbiAgICAgICAgZm9yIChsZXQgcm93X2luZGV4ID0gMDsgcm93X2luZGV4IDwgcm93S2V5cy5sZW5ndGg7IHJvd19pbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBjdXJyX2Jsb2NrX3Bvc2l0aW9uX3Jvd3Nbcm93X2luZGV4XTtcbiAgICAgICAgICAgIGNvbnN0IGNvbEtleXMgPSBPYmplY3Qua2V5cyhyb3cpO1xuICAgICAgICAgICAgZm9yIChsZXQgY29sX2luZGV4ID0gMDsgY29sX2luZGV4IDwgY29sS2V5cy5sZW5ndGg7IGNvbF9pbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJvd1tjb2xfaW5kZXhdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0bXBfcGllY2VfY29sX3BvcyA9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5jb2wgKyBwYXJzZUludChjb2xfaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG1wX3BpZWNlX3Jvd19wb3MgPVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmxvY2sucm93ICsgcGFyc2VJbnQocm93X2luZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdG1wX3BpZWNlX2Rlc2lyZWRfY29sID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcF9waWVjZV9jb2xfcG9zICsgY3Vycl9ibG9ja19wb3NfdHJhbnNfY29sO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG1wX3BpZWNlX2Rlc2lyZWRfcm93ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcF9waWVjZV9yb3dfcG9zICsgY3Vycl9ibG9ja19wb3NfdHJhbnNfcm93O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXNpcmVkX2RpcmVjdGlvbiA9PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbdG1wX3BpZWNlX2Rlc2lyZWRfcm93XVtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wX3BpZWNlX2Rlc2lyZWRfY29sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5oYXNPd25Qcm9wZXJ0eShcImNsYXNzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZXcgcGllY2UgYnV0IGEgc3BhY2UgaXMgYWxyZWFkeSB0YWtlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXNpcmVkX2RpcmVjdGlvbiA9PSBcImxlZnRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG1wX3BpZWNlX2Rlc2lyZWRfY29sID0gdG1wX3BpZWNlX2NvbF9wb3MgLSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2lyZWRfZGlyZWN0aW9uID09IFwicmlnaHRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG1wX3BpZWNlX2Rlc2lyZWRfY29sID0gdG1wX3BpZWNlX2NvbF9wb3MgKyAxO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlc2lyZWRfZGlyZWN0aW9uID09IFwiZG93blwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0bXBfcGllY2VfZGVzaXJlZF9yb3cgPSB0bXBfcGllY2Vfcm93X3BvcyArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wX3BpZWNlX2Rlc2lyZWRfcm93ID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5TRVRUSU5HUy5CT0FSRF9ST1dTX0hJR0ggfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3RtcF9waWVjZV9kZXNpcmVkX3Jvd11bXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcF9waWVjZV9kZXNpcmVkX2NvbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0uaGFzT3duUHJvcGVydHkoXCJjbGFzc1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWxyZWFkeSBhIGJsb2NrIGluIHRoZSBuZXh0IGRvd253YXJkIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9ja19jdXJyZW50X2Jsb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5ib2FyZC5oYXNPd25Qcm9wZXJ0eSh0bXBfcGllY2VfZGVzaXJlZF9yb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL0Nhbid0IG1vdmUgZG93biwgc28gZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICF0aGlzLmJvYXJkW3RtcF9waWVjZV9kZXNpcmVkX3Jvd10uaGFzT3duUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wX3BpZWNlX2Rlc2lyZWRfY29sXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9PZmYgdGhlIGJvYXJkIGVycm9yIG91dFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFt0bXBfcGllY2VfZGVzaXJlZF9yb3ddW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcF9waWVjZV9kZXNpcmVkX2NvbFxuICAgICAgICAgICAgICAgICAgICAgICAgXS5oYXNPd25Qcm9wZXJ0eShcImNsYXNzXCIpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9Cb2FyZCBzcG90IGFscmVhZHkgdGFrZW5cbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0bXBfcGllY2VfZGVzaXJlZF9jb2wgPCB0bXBfbG93ZXN0X2NvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcF9sb3dlc3RfY29sID0gdG1wX3BpZWNlX2Rlc2lyZWRfY29sO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRtcF9waWVjZV9kZXNpcmVkX3JvdyA8IHRtcF9sb3dlc3Rfcm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wX2xvd2VzdF9yb3cgPSB0bXBfcGllY2VfZGVzaXJlZF9yb3c7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcF9kZXNpcmVkX3Bvc2l0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2w6IHRtcF9waWVjZV9kZXNpcmVkX2NvbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3c6IHRtcF9waWVjZV9kZXNpcmVkX3Jvd1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgICAgICBpZiAoIWxvY2tfY3VycmVudF9ibG9jaykge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgY3VycmVudCBwaWVjZVxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ3VycmVudEJsb2NrRnJvbUJvYXJkKCk7XG5cbiAgICAgICAgICAgICAgICAvL1NldCB0aGUgbmV3IGN1cnJlbnQgZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgaWYgKGRlc2lyZWRfZGlyZWN0aW9uID09IFwidXBcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5wb3NpdGlvbiA9IGRlc2lyZWRfcG9zaXRpb247XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBuZXcgY3VycmVudCByb3cgYW5kIGNvbHVtblxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmNvbCA9IHRtcF9sb3dlc3RfY29sO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJsb2NrLnJvdyA9IHRtcF9sb3dlc3Rfcm93O1xuICAgICAgICAgICAgICAgIC8vIEFwcGx5IHRoZSAnbW92ZW1lbnQnIGJ5IG1vZGlmeWluZyB0aGUgYmxvY2sncyBjbGFzc1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHBvcyBvZiB0bXBfZGVzaXJlZF9wb3NpdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRtcF9pZCA9IGB0Yl8ke3Bvc1tcImNvbFwiXX1fJHtwb3NbXCJyb3dcIl19YDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGpUTVAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0bXBfaWQpO1xuICAgICAgICAgICAgICAgICAgICBqVE1QLmFkZENsYXNzKHRoaXMuY3VycmVudEJsb2NrLmNsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suYmxvY2tJZHMucHVzaCh0bXBfaWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5ibG9ja1Bvc2l0aW9ucy5wdXNoKHBvcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGJsb2NrIGhhcyByZWFjaGVkIGl0cyBmaW5hbCBkZXN0aW5hdGlvblxuICAgICAgICBpZiAobG9ja19jdXJyZW50X2Jsb2NrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBwb3Mgb2YgdGhpcy5jdXJyZW50QmxvY2suYmxvY2tQb3NpdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAvLyBMb2NrIHRoZSBjdXJyZW50IGJsb2NrIG9uIHRoZSBib2FyZFxuICAgICAgICAgICAgICAgIC8vIGJ5IHNldHRpbmcgdGhlIHBlcm1hbmVudCBib2FyZCBjbGFzc1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbcG9zW1wicm93XCJdXVtwb3NbXCJjb2xcIl1dID0ge1xuICAgICAgICAgICAgICAgICAgICBjbGFzczogdGhpcy5jdXJyZW50QmxvY2suY2xhc3NcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgYmxvY2sgaGFzIGNhdXNlZCByb3dzIHRvIGJlIGVsaW1pbmF0ZWRcbiAgICAgICAgICAgIHRoaXMuY2hlY2tBbmRFbGltaW5hdGVSb3dzKCk7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aGUgbmV4dCBibG9ja1xuICAgICAgICAgICAgdGhpcy5uZXh0QmxvY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZXJlIGFyZSBhbnkgcm93cyB0byByZW1vdmVcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIGNoZWNrQW5kRWxpbWluYXRlUm93cygpIHtcbiAgICAgICAgdmFyIG5vX3Jvd3NfZWxpbWluYXRlZCA9IDA7XG5cbiAgICAgICAgLy9Mb29wIG92ZXIgdGhlIGJvYXJkIHJvd3NcbiAgICAgICAgJC5lYWNoKHRoaXMuYm9hcmQsIGZ1bmN0aW9uKHJfaW5kZXgsIHJvdykge1xuICAgICAgICAgICAgdmFyIGNvbHVtbl9mdWxsX2NvdW50ID0gMDtcblxuICAgICAgICAgICAgLy9Mb29wIG92ZXIgdGhlIGNvbHVtbnMgaW4gdGhpcyByb3dcbiAgICAgICAgICAgICQuZWFjaChyb3csIGZ1bmN0aW9uKGNfaW5kZXgsIGNvbCkge1xuICAgICAgICAgICAgICAgIC8vIEEgY2xhc3MgaW5kaWNhdGVzIHRoZSBjb2x1bW4gaW4gdGhpcyByb3cgaXMgZnVsbFxuICAgICAgICAgICAgICAgIGlmIChjb2wuaGFzT3duUHJvcGVydHkoXCJjbGFzc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBjb2x1bW5fZnVsbF9jb3VudCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBUaGUgZW50aXJlIHJvdyBpcyBmdWxsXG4gICAgICAgICAgICBpZiAoY29sdW1uX2Z1bGxfY291bnQgPT0gdGhpcy5TRVRUSU5HUy5CT0FSRF9DT0xTX1dJREUpIHtcbiAgICAgICAgICAgICAgICBub19yb3dzX2VsaW1pbmF0ZWQrKztcblxuICAgICAgICAgICAgICAgIC8vTW92ZSB0aGUgdXBwZXIgcm93cyBkb3duLCBmcm9tIHRoZSBib3R0b20gdXBcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gcl9pbmRleDsgaSA+PSAxOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHRoaXMuYm9hcmRbaV0sIGZ1bmN0aW9uKGNfaW5kZXgsIGNvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZfY2xhc3MgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuaGFzT3duUHJvcGVydHkoaSAtIDEpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtpIC0gMV1bY19pbmRleF0uaGFzT3duUHJvcGVydHkoXCJjbGFzc1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGNsYXNzIGZyb20gdGhlIGJsb2NrIGRpcmVjdGx5IGFib3ZlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldl9jbGFzcyA9IHRoaXMuYm9hcmRbaSAtIDFdW2NfaW5kZXhdW1wiY2xhc3NcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJfaWQgPSBcIiN0Yl9cIiArIGNfaW5kZXggKyBcIl9cIiArIGk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgakN1ciA9ICQoY3VyX2lkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbC5oYXNPd25Qcm9wZXJ0eShcImNsYXNzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgakN1ci5yZW1vdmVDbGFzcyhjb2xbXCJjbGFzc1wiXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2X2NsYXNzICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NvcHkgZG93biB0aGUgY2xhc3MgZnJvbSBhYm92ZSB0byB0aGUgYmxvY2sgaW4gdGhpcyByb3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqQ3VyLmFkZENsYXNzKHByZXZfY2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbaV1bY19pbmRleF0gPSB7IGNsYXNzOiBwcmV2X2NsYXNzIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQmxhbmsgYmxvY2sgKG5vIGJsb2NrIGFib3ZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbaV1bY19pbmRleF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobm9fcm93c19lbGltaW5hdGVkID4gMCkge1xuICAgICAgICAgICAgLy8gR2l2ZSB0aGUgdXNlciB0aGVpciBzY29yZVxuICAgICAgICAgICAgdGhpcy5zY29yZShub19yb3dzX2VsaW1pbmF0ZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2NvcmUgYSBtb3ZlIGJhc2VkIG9uIHRoZSBudW1iZXIgb2Ygcm93cyBlbGltaW5hdGVkXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW50IG5vX3Jvd3NfZWxpbWluYXRlZCBUaGUgbnVtYmVyIG9mIHJvd3MgZWxpbWluYXRlZC5cbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzY29yZShub19yb3dzX2VsaW1pbmF0ZWQpIHtcbiAgICAgICAgdmFyIG11bHRpcGxlX3Jvd19ib251cyA9IDA7XG4gICAgICAgIHZhciBjdXJyZW50X211bHRpcGxpZXIgPVxuICAgICAgICAgICAgU0VUVElOR1MuR0FNRV9TQ09SRV9NVUxUSVBMSUVSICogdGhpcy5jdXJyZW50R2FtZS5sZXZlbDtcblxuICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLnJvd3NFbGltaW5hdGVkID1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudEdhbWUucm93c0VsaW1pbmF0ZWQgKyBub19yb3dzX2VsaW1pbmF0ZWQ7XG5cbiAgICAgICAgaWYgKG5vX3Jvd3NfZWxpbWluYXRlZCA+IDEpIHtcbiAgICAgICAgICAgIC8vIEdpdmUgdXNlcnMgYSBib251cyBmb3IgZWxpbWluYXRpbmcgbW9yZSB0aGFuIG9uZSByb3dcbiAgICAgICAgICAgIG11bHRpcGxlX3Jvd19ib251cyA9XG4gICAgICAgICAgICAgICAgbm9fcm93c19lbGltaW5hdGVkICogKGN1cnJlbnRfbXVsdGlwbGllciAqIDAuNSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50R2FtZS5zY29yZSA9XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLnNjb3JlICtcbiAgICAgICAgICAgIG5vX3Jvd3NfZWxpbWluYXRlZCAqIGN1cnJlbnRfbXVsdGlwbGllciArXG4gICAgICAgICAgICBtdWx0aXBsZV9yb3dfYm9udXM7XG5cbiAgICAgICAgdGhpcy5zZXRTY29yZVRleHQoKTtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50R2FtZS5yb3dzRWxpbWluYXRlZCA9PSBTRVRUSU5HUy5CT0FSRF9ST1dTX0hJR0gpIHtcbiAgICAgICAgICAgIC8vIExldmVsIHVwXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLnJvd3NFbGltaW5hdGVkID0gMDtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50R2FtZS5sZXZlbCA9IHRoaXMuY3VycmVudEdhbWUubGV2ZWwgKyAxO1xuXG4gICAgICAgICAgICB0aGlzLnNldExldmVsVGV4dCgpO1xuXG4gICAgICAgICAgICAvLyBJbmNyZWFzZSB0aGUgc3BlZWQgb2YgdGhlIGdhbWUgaW50ZXJ2YWxcbiAgICAgICAgICAgIHRoaXMuZ2FtZUludGVydmFsVGltZXIubXMgPSB0aGlzLmdhbWVJbnRlcnZhbFRpbWVyLm1zIC0gMjA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIFNjb3JlIHRleHRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNldFNjb3JlVGV4dCgpIHtcbiAgICAgICAgJCh0aGlzLkRPTV9JRFMuU0NPUkVfQ09OVEFJTkVSKS50ZXh0KHRoaXMuY3VycmVudEdhbWUuc2NvcmUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgTGV2ZWwgdGV4dC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNldExldmVsVGV4dCgpIHtcbiAgICAgICAgJCh0aGlzLkRPTV9JRFMuTEVWRUxfQ09OVEFJTkVSKS50ZXh0KFwiTEVWRUwgXCIgKyB0aGlzLmN1cnJlbnRHYW1lLmxldmVsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhlIGN1cnJlbnQgYmxvY2sgZnJvbSB0aGUgYm9hcmRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHJlbW92ZUN1cnJlbnRCbG9ja0Zyb21Cb2FyZCgpIHtcbiAgICAgICAgLy9SZW1vdmUgdGhlIGN1cnJlbnQgY2xhc3MgZnJvbSB0aGUgdmlzaWJsZSBibG9ja3NcbiAgICAgICAgJC5lYWNoKHRoaXMuY3VycmVudEJsb2NrLmJsb2NrSWRzLCBmdW5jdGlvbihpbmRleCwgYmxvY2tfaWQpIHtcbiAgICAgICAgICAgICQoYmxvY2tfaWQpLnJlbW92ZUNsYXNzKHRoaXMuY3VycmVudEJsb2NrLmNsYXNzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9SZXNldCB0aGUgY3VycmVudCBzZXQgb2YgYmxvY2tzXG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrSWRzID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrUG9zaXRpb25zID0gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHRoZSBuZXh0IGJsb2NrIHRvIHRoZSBib2FyZFxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgbmV4dEJsb2NrKCkge1xuICAgICAgICBpZiAodGhpcy5pc1BhdXNlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzZXQgYWxsIHRoZSB2YXJpYWJsZXNcbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suYmxvY2tJZHMgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suYmxvY2tQb3NpdGlvbnMgPSBbXTtcblxuICAgICAgICAvLyBUaGUgcHJldmlldyBibG9jayBiZWNvbWVzIHRoZSBjdXJyZW50IHBpZWNlXG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLnR5cGUgPSB0aGlzLnByZXZpZXdQaWVjZS50eXBlO1xuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5jbGFzcyA9IEJMT0NLU1t0aGlzLmN1cnJlbnRCbG9jay50eXBlXVtcImNsYXNzXCJdO1xuXG4gICAgICAgIC8vIFJlc2V0IHRoZSBzdGFydCBsb2NhdGlvbiBmb3IgdGhlIGJsb2NrIHRvIGFwcGVhclxuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5yb3cgPSAxO1xuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5jb2wgPSBTRVRUSU5HUy5QSUVDRV9TVEFSVF9DT0w7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2sucG9zaXRpb24gPSAwO1xuXG4gICAgICAgIHRoaXMubW92ZUJsb2NrKFwibm9uZVwiKTtcblxuICAgICAgICAvL1Jlc2V0IHRoZSBnYW1lIGludGVydmFsXG4gICAgICAgIHRoaXMua2lsbEdhbWVJbnRlcnZhbCgpO1xuICAgICAgICB0aGlzLnN0YXJ0R2FtZUludGVydmFsKCk7XG5cbiAgICAgICAgLy8gTWFrZSB0aGUgbmV4dCBwcmV2aWV3IGJsb2NrXG4gICAgICAgIHRoaXMubWFrZVByZXZpZXdQaWVjZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHVwIHRoZSBrZXlib2FyZCBldmVudHMuXG4gICAgICogICAtIEFycm93IGtleXMgY29udHJvbCB0aGUgbW90aW9uIG9mIHRoZSBibG9ja3MuXG4gICAgICogICAtICdwJyBQYXVzZXMgdGhlIGdhbWUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzZXR1cEtleUV2ZW50cygpIHtcbiAgICAgICAgJChkb2N1bWVudCkua2V5ZG93bihmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGUud2hpY2gpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgICAgICAvLyBMZWZ0IGFycm93IGtleVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVCbG9jayhcImxlZnRcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICAgICAgLy8gVXAgYXJyb3cga2V5XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUJsb2NrKFwidXBcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICAgICAgLy8gUmlnaHQgYXJyb3cga2V5XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUJsb2NrKFwicmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgLy8gRG93biBhcnJvdyBrZXlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmxvY2soXCJkb3duXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgODA6XG4gICAgICAgICAgICAgICAgICAgIC8vICdwJyBwcmVzc2VkIHRvIHBhdXNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF1c2VHYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdCAtIGRvbid0IGRvIGFueXRoaW5nXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gKHNjcm9sbCBvciBjaGFyLW1vdmUpXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHBsYXlpbmdcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHN0YXJ0UGxheSgpIHtcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLnByZXZpZXdQaWVjZS50eXBlID09IFwiXCIpIHtcbiAgICAgICAgICAgIC8vTmV3IGdhbWUgaXMgc3RhcnRpbmdcblxuICAgICAgICAgICAgLy9HZW5lcmF0ZSB0aGUgZmlyc3QgYmxvY2sgdHlwZVxuICAgICAgICAgICAgdGhpcy5wcmV2aWV3UGllY2UudHlwZSA9IHRoaXMuZ2VuZXJhdGVSYW5kb21CbG9ja1R5cGUoKTtcblxuICAgICAgICAgICAgLy9DcmVhdGUgdGhlIG5ldyBwaWVjZVxuICAgICAgICAgICAgdGhpcy5uZXh0QmxvY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhcnRHYW1lSW50ZXJ2YWwoKTtcblxuICAgICAgICB0aGlzLmhpZGVNZXNzYWdlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgdGhlIGdhbWUgaW50ZXJ2YWxcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHN0YXJ0R2FtZUludGVydmFsKCkge1xuICAgICAgICBpZiAoIXRoaXMuZ2FtZUludGVydmFsVGltZXIub2JqKSB7XG4gICAgICAgICAgICAvLyBTZXR1cCB0aGUgaW50ZXJ2YWwgb2JqZWN0IHVzaW5nIHRoZSBzdGQganMgZnVuY3Rpb25cbiAgICAgICAgICAgIHRoaXMuZ2FtZUludGVydmFsVGltZXIub2JqID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy9TdGFydCB0aGUgYWN0aW9uIChqdXN0IG1vdmUgdGhlIGN1cnJlbnQgcGllY2UgZG93bilcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVCbG9jayhcImRvd25cIik7XG4gICAgICAgICAgICB9LCB0aGlzLmdhbWVJbnRlcnZhbFRpbWVyLm1zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0b3AgdGhlIGdhbWUgaW50ZXJ2YWxcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIGtpbGxHYW1lSW50ZXJ2YWwoKSB7XG4gICAgICAgIC8vIENsZWFyIGl0IHVzaW5nIHRoZSBzdGFuZGFyZCBqcyBmdW5jdGlvblxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuZ2FtZUludGVydmFsVGltZXIub2JqKTtcbiAgICAgICAgdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5vYmogPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXVzZSBvciB1bnBhdXNlIHRoZSBnYW1lXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBwYXVzZUdhbWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzUGF1c2VkKSB7XG4gICAgICAgICAgICAvL0FscmVhZHkgcGF1c2VkLCBzbyBzdGFydCB0aGUgZ2FtZVxuICAgICAgICAgICAgdGhpcy5zdGFydFBsYXkoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtpbGxHYW1lSW50ZXJ2YWwoKTtcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IHRydWU7XG5cbiAgICAgICAgLy8gU2hvdyB0aGUgcGF1c2VkIG1vZGFsIG1lc3NhZ2UgKGZyb20gdGVtcGxhdGUpXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXCJwYXVzZWRcIik7XG5cbiAgICAgICAgJChcImJ1dHRvbiN0ZXRyanMtcGF1c2UtcGxheVwiKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRQbGF5KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdhbWUgb3ZlciBvY2N1cnJlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIGdhbWVPdmVyKCkge1xuICAgICAgICB0aGlzLmlzUGF1c2VkID0gdHJ1ZTtcblxuICAgICAgICAvLyBTdG9wIHRoZSBnYW1lIGludGVydmFsXG4gICAgICAgIHRoaXMua2lsbEdhbWVJbnRlcnZhbCgpO1xuXG4gICAgICAgIHZhciB0ZW1wbGF0ZV92YXJzID0ge1xuICAgICAgICAgICAgc2NvcmU6IHRoaXMuY3VycmVudEdhbWVbXCJzY29yZVwiXSxcbiAgICAgICAgICAgIHJvd3NFbGltaW5hdGVkOiB0aGlzLmN1cnJlbnRHYW1lW1wicm93c0VsaW1pbmF0ZWRcIl0sXG4gICAgICAgICAgICBsZXZlbDogdGhpcy5jdXJyZW50R2FtZVtcImxldmVsXCJdXG4gICAgICAgIH07XG4gICAgICAgIC8vIFNob3cgdGhlIGdhbWVvdmVyIG1vZGFsIG1lc3NhZ2UgKGZyb20gdGVtcGxhdGUpXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXCJnYW1lb3ZlclwiLCB0ZW1wbGF0ZV92YXJzKTtcblxuICAgICAgICAkKFwiYnV0dG9uI3RldHJqcy1nYW1lb3Zlci1uZXdnYW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5uZXdHYW1lKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHVwIGEgbmV3IGdhbWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqKi9cbiAgICBuZXdHYW1lKCkge1xuICAgICAgICAvLyBTdG9wIHRoZSBnYW1lIGludGVydmFsXG4gICAgICAgIHRoaXMua2lsbEdhbWVJbnRlcnZhbCgpO1xuXG4gICAgICAgIC8vIFJlc2V0IHRoZSB0aGUgc2NvcmUsIGxldmVsLCBhbmQgaW50ZXJ2YWxcbiAgICAgICAgdGhpcy5jdXJyZW50R2FtZS5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMuY3VycmVudEdhbWUubGV2ZWwgPSAxO1xuICAgICAgICB0aGlzLmdhbWVJbnRlcnZhbFRpbWVyLm1zID0gU0VUVElOR1MuR0FNRV9JTlRFUlZBTF9NUztcblxuICAgICAgICAvLyBSZXNldCB0aGUgc2NvcmUgYW5kIGxldmVsIHRleHRcbiAgICAgICAgdGhpcy5zZXRTY29yZVRleHQoKTtcbiAgICAgICAgdGhpcy5zZXRMZXZlbFRleHQoKTtcblxuICAgICAgICAvLyBTZXR1cCB0aGUgbWFpbiBhbmQgcHJldmlldyBib2FyZHNcbiAgICAgICAgdGhpcy5zZXR1cEJvYXJkKCk7XG4gICAgICAgIHRoaXMuc2V0dXBQcmV2aWV3Qm9hcmQoKTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIG9sZCBwcmV2aWV3IHBpZWNlIHR5cGVcbiAgICAgICAgdGhpcy5wcmV2aWV3UGllY2UudHlwZSA9IFwiXCI7XG5cbiAgICAgICAgLy8gU3RhcnQgdGhlIGdhbWVcbiAgICAgICAgdGhpcy5zdGFydFBsYXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBpbnRyb2R1Y3Rpb24gbWVzc2FnZTtcbiAgICAgKiBzaG91bGQgYmUgcnVuIHdoZW4gZ2FtZSBsb2Fkcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqKi9cbiAgICBzaG93SW50cm8oKSB7XG4gICAgICAgIHRoaXMuc2V0dXBCb2FyZCgpO1xuICAgICAgICB0aGlzLnNldHVwUHJldmlld0JvYXJkKCk7XG5cbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZShcImludHJvXCIpO1xuICAgICAgICAkKFwiYnV0dG9uI3RldHJqcy1pbnRyby1uZXdnYW1lXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5uZXdHYW1lKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNob3cgdGhlIEFib3V0IFBvcG92ZXJcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNob3dBYm91dCgpIHtcbiAgICAgICAgdGhpcy5raWxsR2FtZUludGVydmFsKCk7XG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXCJhYm91dFwiKTtcbiAgICAgICAgJChcImJ1dHRvbiN0ZXRyanMtYWJvdXQtY2xvc2VcIikuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0UGxheSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IGEgbWVzc2FnZSBpbiB0aGUgbW9kYWwgd2luZG93LlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2hvd01lc3NhZ2UodGVtcGxhdGVfbmFtZSwgdmFycykge1xuICAgICAgICB2YXIgJG1vZGFsID0gJCh0aGlzLkRPTV9JRFMuTU9EQUwpO1xuICAgICAgICB2YXIgJHZlaWwgPSAkKHRoaXMuRE9NX0lEUy5NT0RBTF9WRUlMKTtcblxuICAgICAgICB2YXIgaHRtbCA9IHRlbXBsYXRlc1t0ZW1wbGF0ZV9uYW1lXS5yZW5kZXIodmFycyk7XG5cbiAgICAgICAgJG1vZGFsLmh0bWwoaHRtbCk7XG5cbiAgICAgICAgLy9DZW50ZXIgdGhlIG1lc3NhZ2UgaW4gdGhlIHZlaWxcbiAgICAgICAgdmFyIGxlZnRPZmZzZXQgPSBNYXRoLmZsb29yKCgkdmVpbC53aWR0aCgpIC0gJG1vZGFsLm91dGVyV2lkdGgoKSkgLyAyKTtcbiAgICAgICAgdmFyIHRvcE9mZnNldCA9IE1hdGguZmxvb3IoKCR2ZWlsLmhlaWdodCgpIC0gJG1vZGFsLm91dGVySGVpZ2h0KCkpIC8gMik7XG5cbiAgICAgICAgJG1vZGFsLmNzcyhcImxlZnRcIiwgbGVmdE9mZnNldCk7XG4gICAgICAgICRtb2RhbC5jc3MoXCJ0b3BcIiwgdG9wT2Zmc2V0KTtcblxuICAgICAgICAkdmVpbC5mYWRlSW4oMjAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRtb2RhbC5mYWRlSW4oMjAwKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGlkZSB0aGUgbW9kYWwgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIGhpZGVNZXNzYWdlKCkge1xuICAgICAgICB2YXIgJG1vZGFsID0gJCh0aGlzLkRPTV9JRFMuTU9EQUwpO1xuICAgICAgICB2YXIgJHZlaWwgPSAkKHRoaXMuRE9NX0lEUy5NT0RBTF9WRUlMKTtcbiAgICAgICAgJG1vZGFsLmZhZGVPdXQoMTAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICR2ZWlsLmhpZGUoKTtcblxuICAgICAgICAgICAgLy9DbGVhciBhZnRlciB0aGUgZmFkZVxuICAgICAgICAgICAgJG1vZGFsLmh0bWwoXCJcIik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1biB0ZXRyanMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RyaW5nIGNvbnRhaW5lcklEIFRoZSBjb250YWluZXIgaWQgZm9yIHRldHJqcy5cbiAgICAgKi9cbiAgICBydW4oY29udGFpbmVySUQpIHtcbiAgICAgICAgJChcIiNcIiArIGNvbnRhaW5lcklEKS5odG1sKHRlbXBsYXRlc1tcImNvbnRhaW5lclwiXS5yZW5kZXIoKSk7XG5cbiAgICAgICAgJChcImJ1dHRvbiN0ZXRyanMtYnV0dG9uLXBhdXNlXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5wYXVzZUdhbWUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChcImJ1dHRvbiN0ZXRyanMtYnV0dG9uLW5ld1wiKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMubmV3R2FtZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKFwiYnV0dG9uI3RldHJqcy1idXR0b24tYWJvdXRcIikuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dBYm91dCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNldHVwS2V5RXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5zaG93SW50cm8oKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiaGFzQ2xhc3MiLCJlbGUiLCJjbHMiLCJjbGFzc05hbWUiLCJtYXRjaCIsIlJlZ0V4cCIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJyZWciLCJyZXBsYWNlIiwiQkxPQ0tfVFlQRVMiLCJCTE9DS1MiLCJTVFJBSUdIVCIsImNsYXNzIiwibm9fcG9zaXRpb25zIiwicG9zaXRpb25zIiwidHJhbnNfcm93IiwidHJhbnNfY29sIiwicm93cyIsIkxfTEVGVCIsIkxfUklHSFQiLCJTUVVBUkUiLCJTIiwiWiIsIlQiLCJTRVRUSU5HUyIsIkJPQVJEX0NPTFNfV0lERSIsIkJPQVJEX1JPV1NfSElHSCIsIlBJRUNFX1NUQVJUX0NPTCIsIlBJRUNFX1NUQVJUX1JPVyIsIlBJRUNFX1NUQVJUX1BPUyIsIkdBTUVfSU5URVJWQUxfTVMiLCJHQU1FX1NDT1JFX01VTFRJUExJRVIiLCJDRUxMX1dJRFRIX1BYIiwiQ0VMTF9IRUlHSFRfUFgiLCJUZXRyanMiLCJCT0FSRCIsIlBSRVZJRVdfQ09OVEFJTkVSIiwiU0NPUkVfQ09OVEFJTkVSIiwiTEVWRUxfQ09OVEFJTkVSIiwiTU9EQUwiLCJNT0RBTF9WRUlMIiwiQk9BUkRfQkxPQ0siLCJ0eXBlIiwiYmxvY2tJZHMiLCJibG9ja1Bvc2l0aW9ucyIsInJvdyIsImNvbCIsInBvc2l0aW9uIiwiYmxvY2tzIiwib2JqIiwibXMiLCJzY29yZSIsInJvd3NFbGltaW5hdGVkIiwibGV2ZWwiLCIkdGV0cmpzQm9hcmQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiRE9NX0lEUyIsImlubmVySFRNTCIsImJvYXJkIiwiYm9hcmRXaWR0aCIsImJvYXJkSGVpZ2h0Iiwic3R5bGUiLCJ3aWR0aCIsImhlaWdodCIsImkiLCJ0b3BfcG9zIiwiaiIsImxlZnRfcG9zIiwiYmxvY2siLCJjcmVhdGVFbGVtZW50IiwibGVmdCIsInRvU3RyaW5nIiwidG9wIiwiRE9NX0NMQVNTRVMiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsIiRwcmV2aWV3Qm9hcmQiLCJwcmV2aWV3X3NlY3Rpb25zX3dpZGUiLCJwcmV2aWV3X3NlY3Rpb25zX2hpZ2giLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJpc1BhdXNlZCIsInByZXZpZXdQaWVjZSIsImJsb2NrX2lkIiwidXRpbCIsImdlbmVyYXRlUmFuZG9tQmxvY2tUeXBlIiwic3RhcnRfY29sIiwic3RhcnRfcm93IiwiY3Vycl9ibG9ja19wb3NpdGlvbl9yb3dzIiwicm93X2tleXMiLCJPYmplY3QiLCJrZXlzIiwicm93X2luZGV4IiwiY29sX2tleXMiLCJjb2xfaW5kZXgiLCJibG9ja19jb2wiLCJwYXJzZUludCIsImJsb2NrX3JvdyIsImlkIiwiZWwiLCJwdXNoIiwiZGVzaXJlZF9kaXJlY3Rpb24iLCJjdXJyX2Jsb2NrX25vX3Bvc2l0aW9ucyIsImN1cnJlbnRCbG9jayIsImN1cnJfYmxvY2tfcG9zX3RyYW5zX3JvdyIsImN1cnJfYmxvY2tfcG9zX3RyYW5zX2NvbCIsImRlc2lyZWRfcG9zaXRpb24iLCJ0bXBfZGVzaXJlZF9wb3NpdGlvbnMiLCJsb2NrX2N1cnJlbnRfYmxvY2siLCJ0bXBfbG93ZXN0X2NvbCIsInRtcF9sb3dlc3Rfcm93IiwiZXJyb3IiLCJyb3dLZXlzIiwiY29sS2V5cyIsInRtcF9waWVjZV9jb2xfcG9zIiwidG1wX3BpZWNlX3Jvd19wb3MiLCJ0bXBfcGllY2VfZGVzaXJlZF9jb2wiLCJ0bXBfcGllY2VfZGVzaXJlZF9yb3ciLCJoYXNPd25Qcm9wZXJ0eSIsImdhbWVPdmVyIiwicmVtb3ZlQ3VycmVudEJsb2NrRnJvbUJvYXJkIiwicG9zIiwidG1wX2lkIiwialRNUCIsImNoZWNrQW5kRWxpbWluYXRlUm93cyIsIm5leHRCbG9jayIsIm5vX3Jvd3NfZWxpbWluYXRlZCIsIiQiLCJlYWNoIiwicl9pbmRleCIsImNvbHVtbl9mdWxsX2NvdW50IiwiY19pbmRleCIsInByZXZfY2xhc3MiLCJjdXJfaWQiLCJqQ3VyIiwibXVsdGlwbGVfcm93X2JvbnVzIiwiY3VycmVudF9tdWx0aXBsaWVyIiwiY3VycmVudEdhbWUiLCJzZXRTY29yZVRleHQiLCJzZXRMZXZlbFRleHQiLCJnYW1lSW50ZXJ2YWxUaW1lciIsInRleHQiLCJpbmRleCIsIm1vdmVCbG9jayIsImtpbGxHYW1lSW50ZXJ2YWwiLCJzdGFydEdhbWVJbnRlcnZhbCIsIm1ha2VQcmV2aWV3UGllY2UiLCJrZXlkb3duIiwiZSIsIndoaWNoIiwicGF1c2VHYW1lIiwicHJldmVudERlZmF1bHQiLCJoaWRlTWVzc2FnZSIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsInN0YXJ0UGxheSIsInNob3dNZXNzYWdlIiwiY2xpY2siLCJ0ZW1wbGF0ZV92YXJzIiwibmV3R2FtZSIsInNldHVwQm9hcmQiLCJzZXR1cFByZXZpZXdCb2FyZCIsInRlbXBsYXRlX25hbWUiLCJ2YXJzIiwiJG1vZGFsIiwiJHZlaWwiLCJodG1sIiwidGVtcGxhdGVzIiwicmVuZGVyIiwibGVmdE9mZnNldCIsIm91dGVyV2lkdGgiLCJ0b3BPZmZzZXQiLCJvdXRlckhlaWdodCIsImNzcyIsImZhZGVJbiIsImZhZGVPdXQiLCJoaWRlIiwiY29udGFpbmVySUQiLCJzaG93QWJvdXQiLCJzZXR1cEtleUV2ZW50cyIsInNob3dJbnRybyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFBOzs7Ozs7RUFNQSxTQUFTQSxRQUFULENBQWtCQyxHQUFsQixFQUF1QkMsR0FBdkIsRUFBNEI7RUFDeEIsU0FBTyxDQUFDLENBQUNELEdBQUcsQ0FBQ0UsU0FBSixDQUFjQyxLQUFkLENBQW9CLElBQUlDLE1BQUosQ0FBVyxZQUFZSCxHQUFaLEdBQWtCLFNBQTdCLENBQXBCLENBQVQ7RUFDSDtFQUVEOzs7Ozs7OztFQU1BLFNB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

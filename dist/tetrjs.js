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
      if (op >= 1) {
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
        var elBoard = document.getElementById(this.DOM_IDS.BOARD); // Clear the board

        elBoard.innerHTML = "";
        this.board = {}; // Set the board size

        var boardWidth = SETTINGS.BOARD_COLS_WIDE * SETTINGS.CELL_WIDTH_PX;
        var boardHeight = SETTINGS.BOARD_ROWS_HIGH * SETTINGS.CELL_HEIGHT_PX;
        elBoard.style.width = "".concat(boardWidth, "px");
        elBoard.style.height = "".concat(boardHeight, "px");

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

        for (var i = 1; i <= preview_sections_high; i++) {
          var top_pos = (i - 1) * SETTINGS.CELL_HEIGHT_PX;

          for (var j = 1; j <= preview_sections_wide; j++) {
            var left_pos = (j - 1) * SETTINGS.CELL_WIDTH_PX;
            var block = document.createElement("div");
            block.style.top = top_pos + "px";
            block.style.left = left_pos + "px";
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

                if (tmp_piece_desired_row > SETTINGS.BOARD_ROWS_HIGH || this.board[tmp_piece_desired_row][tmp_piece_desired_col].hasOwnProperty("class")) {
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
              util.addClass(jTMP, this.currentBlock.class);
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

        var rowKeys = Object.keys(this.board);
        var _arr4 = rowKeys;

        for (var _i4 = 0; _i4 < _arr4.length; _i4++) {
          var r_index = _arr4[_i4];
          var row = this.board[r_index];
          var column_full_count = 0; //Loop over the columns in this row

          var colKeys = Object.keys(row);
          var _arr5 = colKeys;

          for (var _i5 = 0; _i5 < _arr5.length; _i5++) {
            var col_index = _arr5[_i5];
            var _col = row[col_index]; // A class indicates the column in this row is full

            if (_col.hasOwnProperty("class")) {
              column_full_count++;
            }
          } // The entire row is full


          if (column_full_count === SETTINGS.BOARD_COLS_WIDE) {
            no_rows_eliminated++; //Move the upper rows down, from the bottom up

            for (var i = r_index; i >= 1; i--) {
              var _colKeys = Object.keys(this.board[i]);

              var _arr6 = _colKeys;

              for (var _i6 = 0; _i6 < _arr6.length; _i6++) {
                var c_index = _arr6[_i6];
                var col = row[c_index];
                var prev_class = "";

                if (this.board.hasOwnProperty(i - 1) && this.board[i - 1][c_index].hasOwnProperty("class")) {
                  // The class from the block directly above
                  prev_class = this.board[i - 1][c_index]["class"];
                }

                var jCur = document.getElementById("tb_".concat(c_index, "_").concat(i));

                if (col.hasOwnProperty("class")) {
                  util.removeClass(jCur, col["class"]);
                }

                if (prev_class != "") {
                  //Copy down the class from above to the block in this row
                  util.addClass(jCur, prev_class);
                  this.board[i][c_index] = {
                    class: prev_class
                  };
                } else {
                  //Blank block (no block above)
                  this.board[i][c_index] = {};
                }
              }
            }
          }
        }

        if (no_rows_eliminated > 0) {
          // Update the score
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
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.currentBlock.blockIds[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var block_id = _step3.value;
            var block = document.getElementById(block_id);
            util.removeClass(block, this.currentBlock.class);
          } //Reset the current set of blocks

        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
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
        var html = templates[template_name].render(vars);
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
        el.innerHTML = templates["container"].render();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV0cmpzLmpzIiwic291cmNlcyI6WyJzcmMvdXRpbC5qcyIsInNyYy9ibG9ja3MuanMiLCJzcmMvc2V0dGluZ3MuanMiLCJzcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBEZXRlcm1pbmUgaWYgYW4gZWxlbWVudCBoYXMgYSBjbGFzcy5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbHNcbiAqL1xuZnVuY3Rpb24gaGFzQ2xhc3MoZWxlLCBjbHMpIHtcbiAgICByZXR1cm4gISFlbGUuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoXCIoXFxcXHN8XilcIiArIGNscyArIFwiKFxcXFxzfCQpXCIpKTtcbn1cblxuLyoqXG4gKiBBZGQgYSBjbGFzcyB0byBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZVxuICogQHBhcmFtIHtzdHJpbmd9IGNsc1xuICovXG5mdW5jdGlvbiBhZGRDbGFzcyhlbGUsIGNscykge1xuICAgIGlmICghaGFzQ2xhc3MoZWxlLCBjbHMpKSBlbGUuY2xhc3NOYW1lICs9IFwiIFwiICsgY2xzO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNsYXNzIGZyb20gYW4gZWxlbWVudFxuICpcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZVxuICogQHBhcmFtIHtzdHJpbmd9IGNsc1xuICovXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbGUsIGNscykge1xuICAgIGlmIChoYXNDbGFzcyhlbGUsIGNscykpIHtcbiAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoXFxcXHN8XilcIiArIGNscyArIFwiKFxcXFxzfCQpXCIpO1xuICAgICAgICBlbGUuY2xhc3NOYW1lID0gZWxlLmNsYXNzTmFtZS5yZXBsYWNlKHJlZywgXCIgXCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNjEyMTI3MFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2JcbiAqL1xuZnVuY3Rpb24gZmFkZUluKGVsZW1lbnQsIGNiKSB7XG4gICAgdmFyIG9wID0gMC4xOyAvLyBpbml0aWFsIG9wYWNpdHlcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgdmFyIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChvcCA+PSAxKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICAgIHJldHVybiBjYigpO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IG9wO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmZpbHRlciA9IFwiYWxwaGEob3BhY2l0eT1cIiArIG9wICogMTAwICsgXCIpXCI7XG4gICAgICAgIG9wICs9IG9wICogMC4xO1xuICAgIH0sIDEwKTtcbn1cblxuLyoqXG4gKiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNjEyMTI3MFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2JcbiAqL1xuZnVuY3Rpb24gZmFkZU91dChlbGVtZW50LCBjYikge1xuICAgIHZhciBvcCA9IDE7IC8vIGluaXRpYWwgb3BhY2l0eVxuICAgIHZhciB0aW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAob3AgPD0gMC4xKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgcmV0dXJuIGNiKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gb3A7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZmlsdGVyID0gXCJhbHBoYShvcGFjaXR5PVwiICsgb3AgKiAxMDAgKyBcIilcIjtcbiAgICAgICAgb3AgLT0gb3AgKiAwLjE7XG4gICAgfSwgMTApO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaGFzQ2xhc3MsXG4gICAgYWRkQ2xhc3MsXG4gICAgcmVtb3ZlQ2xhc3MsXG4gICAgZmFkZUluLFxuICAgIGZhZGVPdXQsXG4gICAgb3V0ZXJIZWlnaHQsXG4gICAgb3V0ZXJXaWR0aFxufTtcbiIsIi8qXG4gKiBEZWZpbmVzIHRoZSBUZXRyanMgYmxvY2sgdHlwZXMgYW5kIHRoZWlyXG4gKiBwb3NzaWJsZSBwb3NpdGlvbnMuXG4gKlxuICogQGF1dGhvciBEZXN0aW4gTW91bHRvblxuICogQHZlcnNpb24gMS4wXG4gKiBAbGljZW5zZSBNSVRcbiAqXG4gKlxuICogVGhlIEJMT0NLUyBvYmplY3QgaXMga2V5ZWQgdG8gdGhlIGJsb2NrIG5hbWVzIGRlZmluZWQgaW4gQkxPQ0tfVFlQRVMuXG4gKlxuICogRWFjaCBCTE9DSyBpcyBjb21wb3NlZCBvZjpcbiAqICdjbGFzcyc6IFRoZSBjc3MgY2xhc3MgZm9yIHRoZSBhY3RpdmUgYmxvY2tzLlxuICogJ25vX3Bvc2l0aW9ucyc6IFRoZSBudW1iZXIgb2YgcG9zc2libGUgcG9zaXRpb25zIGZvciBhIGJsb2NrLlxuICogJ3Bvc2l0aW9ucyc6IE9iamVjdCB0byBzdG9yZSB0aGUgZGlmZmVyZW50IGJsb2NrIHBvc2l0aW9uc1xuICogICAgJ3RyYW5zX3Jvdyc6IHRoZSByb3cgd2hlcmUgdGhlIGJsb2NrIGlzIFwicm90YXRlZFwiIGZvciBhIHBvc2l0aW9uXG4gKiAgICAndHJhbnNfY29sJzogdGhlIGNvbCB3aGVyZSB0aGUgYmxvY2sgaXMgXCJyb3RhdGVkXCIgZm9yIGEgcG9zaXRpb25cbiAqICAgICdyb3dzJzogdGhlIHJvd3MgdGhhdCBmb3JtIHRoZSBibG9jay5cbiAqICAgICAgICAgICAgLSBFYWNoIHJvdyBpcyBhbiBvYmplY3QgaW4ge2NvbHVtbjpib29sZWFuLCAuLi59IGZvcm1hdFxuICogICAgICAgICAgICAgIGkuZS4gU3RyYWlnaHQgYmxvY2tzIGluIHRoZSAxc3QgKDB0aCkgcG9zaXRpb24gYXJlXG4gKiAgICAgICAgICAgICAgICAgICBhY3RpdmUgaW4gYWxsIDQgY29sdW1uczogezA6MSwgMToxLCAyOjEsIDM6MX1cbiAqXG4gKi9cblxuY29uc3QgQkxPQ0tfVFlQRVMgPSBbXCJTVFJBSUdIVFwiLCBcIkxfTEVGVFwiLCBcIkxfUklHSFRcIiwgXCJTUVVBUkVcIiwgXCJTXCIsIFwiWlwiLCBcIlRcIl07XG5cbmNvbnN0IEJMT0NLUyA9IHtcbiAgICBTVFJBSUdIVDoge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stc3RyYWlnaHRcIixcbiAgICAgICAgbm9fcG9zaXRpb25zOiAyLFxuICAgICAgICBwb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIDA6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAtMSxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDEsIDE6IDEsIDI6IDEsIDM6IDEgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAxOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAtMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDEsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIyXCI6IHsgMDogMSB9LFxuICAgICAgICAgICAgICAgICAgICBcIjNcIjogeyAwOiAxIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIExfTEVGVDoge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stbC1sZWZ0XCIsXG4gICAgICAgIG5vX3Bvc2l0aW9uczogNCxcbiAgICAgICAgcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAwOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAxLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogLTEsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAxLCAxOiAxLCAyOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDAsIDE6IDAsIDI6IDEgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAxOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAtMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAwLCAxOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDAsIDE6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIyXCI6IHsgMDogMSwgMTogMSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIDI6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDAsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAwLFxuICAgICAgICAgICAgICAgIHJvd3M6IHtcbiAgICAgICAgICAgICAgICAgICAgXCIwXCI6IHsgMDogMSwgMTogMCwgMjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBcIjFcIjogeyAwOiAxLCAxOiAxLCAyOiAxIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgMzoge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMCxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDEsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAxLCAxOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDEsIDE6IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIyXCI6IHsgMDogMSwgMTogMCB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIExfUklHSFQ6IHtcbiAgICAgICAgY2xhc3M6IFwidGV0cmpzLWJsb2NrLWwtcmlnaHRcIixcbiAgICAgICAgbm9fcG9zaXRpb25zOiA0LFxuICAgICAgICBwb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIDA6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAtMSxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDEsIDE6IDEsIDI6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMSwgMTogMCwgMjogMCB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIDE6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IC0xLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMCxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDEsIDE6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMCwgMTogMSB9LFxuICAgICAgICAgICAgICAgICAgICBcIjJcIjogeyAwOiAwLCAxOiAxIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgMjoge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMCxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAwLCAxOiAwLCAyOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDEsIDE6IDEsIDI6IDEgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAzOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAwLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogMSxcbiAgICAgICAgICAgICAgICByb3dzOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiMFwiOiB7IDA6IDEsIDE6IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIxXCI6IHsgMDogMSwgMTogMCB9LFxuICAgICAgICAgICAgICAgICAgICBcIjJcIjogeyAwOiAxLCAxOiAxIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgU1FVQVJFOiB7XG4gICAgICAgIGNsYXNzOiBcInRldHJqcy1ibG9jay1zcXVhcmVcIixcbiAgICAgICAgbm9fcG9zaXRpb25zOiAxLFxuICAgICAgICBwb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIDA6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDAsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAwLFxuICAgICAgICAgICAgICAgIHJvd3M6IHtcbiAgICAgICAgICAgICAgICAgICAgXCIwXCI6IHsgMDogMSwgMTogMSB9LFxuICAgICAgICAgICAgICAgICAgICBcIjFcIjogeyAwOiAxLCAxOiAxIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgUzoge1xuICAgICAgICBjbGFzczogXCJ0ZXRyanMtYmxvY2stc1wiLFxuICAgICAgICBub19wb3NpdGlvbnM6IDIsXG4gICAgICAgIHBvc2l0aW9uczoge1xuICAgICAgICAgICAgMDoge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAwLCAxOiAxLCAyOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDEsIDE6IDEsIDI6IDAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAxOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAtMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAxLCAxOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDEsIDE6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIyXCI6IHsgMDogMCwgMTogMSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIFo6IHtcbiAgICAgICAgY2xhc3M6IFwidGV0cmpzLWJsb2NrLXpcIixcbiAgICAgICAgbm9fcG9zaXRpb25zOiAyLFxuICAgICAgICBwb3NpdGlvbnM6IHtcbiAgICAgICAgICAgIDA6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAwLFxuICAgICAgICAgICAgICAgIHJvd3M6IHtcbiAgICAgICAgICAgICAgICAgICAgXCIwXCI6IHsgMDogMSwgMTogMSwgMjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBcIjFcIjogeyAwOiAwLCAxOiAxLCAyOiAxIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgMToge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogLTEsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAwLFxuICAgICAgICAgICAgICAgIHJvd3M6IHtcbiAgICAgICAgICAgICAgICAgICAgXCIwXCI6IHsgMDogMCwgMTogMSB9LFxuICAgICAgICAgICAgICAgICAgICBcIjFcIjogeyAwOiAxLCAxOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMlwiOiB7IDA6IDEsIDE6IDAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBUOiB7XG4gICAgICAgIGNsYXNzOiBcInRldHJqcy1ibG9jay10XCIsXG4gICAgICAgIG5vX3Bvc2l0aW9uczogNCxcbiAgICAgICAgcG9zaXRpb25zOiB7XG4gICAgICAgICAgICAwOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAxLFxuICAgICAgICAgICAgICAgIHRyYW5zX2NvbDogLTEsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAxLCAxOiAxLCAyOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDAsIDE6IDEsIDI6IDAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAxOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNfcm93OiAtMSxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDAsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAwLCAxOiAxIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDEsIDE6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIyXCI6IHsgMDogMCwgMTogMSB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIDI6IHtcbiAgICAgICAgICAgICAgICB0cmFuc19yb3c6IDAsXG4gICAgICAgICAgICAgICAgdHJhbnNfY29sOiAwLFxuICAgICAgICAgICAgICAgIHJvd3M6IHtcbiAgICAgICAgICAgICAgICAgICAgXCIwXCI6IHsgMDogMCwgMTogMSwgMjogMCB9LFxuICAgICAgICAgICAgICAgICAgICBcIjFcIjogeyAwOiAxLCAxOiAxLCAyOiAxIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgMzoge1xuICAgICAgICAgICAgICAgIHRyYW5zX3JvdzogMCxcbiAgICAgICAgICAgICAgICB0cmFuc19jb2w6IDEsXG4gICAgICAgICAgICAgICAgcm93czoge1xuICAgICAgICAgICAgICAgICAgICBcIjBcIjogeyAwOiAxLCAxOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgIFwiMVwiOiB7IDA6IDEsIDE6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgXCIyXCI6IHsgMDogMSwgMTogMCB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IHsgQkxPQ0tTLCBCTE9DS19UWVBFUyB9O1xuIiwiY29uc3QgU0VUVElOR1MgPSB7XG4gICAgQk9BUkRfQ09MU19XSURFOiAxMCxcbiAgICBCT0FSRF9ST1dTX0hJR0g6IDE4LFxuICAgIFBJRUNFX1NUQVJUX0NPTDogNCxcbiAgICBQSUVDRV9TVEFSVF9ST1c6IDEsXG4gICAgUElFQ0VfU1RBUlRfUE9TOiAxLFxuICAgIEdBTUVfSU5URVJWQUxfTVM6IDQ2MCxcbiAgICBHQU1FX1NDT1JFX01VTFRJUExJRVI6IDEwMCxcbiAgICBDRUxMX1dJRFRIX1BYOiAyMCxcbiAgICBDRUxMX0hFSUdIVF9QWDogMjBcbn07XG5cbmV4cG9ydCB7IFNFVFRJTkdTIH07XG4iLCIvKipcbiAqIFRldHJqcyBpcyBhIGphdmFzY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgVGV0cmlzLlxuICpcbiAqIEBhdXRob3IgRGVzdGluIE1vdWx0b25cbiAqIEBsaWNlbnNlIE1JVFxuICogQHZlcnNpb24gMS4wXG4gKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vZGVzdGlubW91bHRvbi90ZXRyanNcbiAqL1xuXG5pbXBvcnQgdXRpbCBmcm9tIFwiLi91dGlsXCI7XG5pbXBvcnQgeyBCTE9DS1MsIEJMT0NLX1RZUEVTIH0gZnJvbSBcIi4vYmxvY2tzXCI7XG5pbXBvcnQgeyBTRVRUSU5HUyB9IGZyb20gXCIuL3NldHRpbmdzXCI7XG5cbi8qKlxuICogVGhlIGNvbnN0cnVjdG9yLlxuICogSW5pdGlhbGl6ZXMgdGhlIGJhc2ljIGNvbmZpZ3VyYXRpb24gdmFsdWVzLlxuICogQHJldHVybiB2b2lkXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRldHJqcyB7XG4gICAgYm9hcmQgPSB7fTtcblxuICAgIGlzUGF1c2VkID0gZmFsc2U7XG5cbiAgICBET01fSURTID0ge1xuICAgICAgICBCT0FSRDogXCJ0ZXRyanMtYm9hcmRcIixcbiAgICAgICAgUFJFVklFV19DT05UQUlORVI6IFwidGV0cmpzLW5leHQtcGllY2UtcHJldmlldy1jb250YWluZXJcIixcbiAgICAgICAgU0NPUkVfQ09OVEFJTkVSOiBcInRldHJqcy1zY29yZS1jb250YWluZXJcIixcbiAgICAgICAgTEVWRUxfQ09OVEFJTkVSOiBcInRldHJqcy1sZXZlbC1jb250YWluZXJcIixcbiAgICAgICAgTU9EQUw6IFwidGV0cmpzLW1vZGFsXCIsXG4gICAgICAgIE1PREFMX1ZFSUw6IFwidGV0cmpzLW1vZGFsLXZlaWxcIlxuICAgIH07XG5cbiAgICBET01fQ0xBU1NFUyA9IHtcbiAgICAgICAgQk9BUkRfQkxPQ0s6IFwidGV0cmpzLWJvYXJkLWJsb2NrXCJcbiAgICB9O1xuXG4gICAgY3VycmVudEJsb2NrID0ge1xuICAgICAgICB0eXBlOiBcIlwiLFxuICAgICAgICBibG9ja0lkczogW10sXG4gICAgICAgIGJsb2NrUG9zaXRpb25zOiBbXSxcbiAgICAgICAgY2xhc3M6IFwiXCIsXG4gICAgICAgIHJvdzogU0VUVElOR1MuUElFQ0VfU1RBUlRfUk9XLFxuICAgICAgICBjb2w6IFNFVFRJTkdTLlBJRUNFX1NUQVJUX0NPTCxcbiAgICAgICAgcG9zaXRpb246IFNFVFRJTkdTLlBJRUNFX1NUQVJUX1BPU1xuICAgIH07XG5cbiAgICBwcmV2aWV3UGllY2UgPSB7XG4gICAgICAgIHR5cGU6IFwiXCIsXG4gICAgICAgIGNsYXNzOiBcIlwiLFxuICAgICAgICBibG9ja3M6IFtdXG4gICAgfTtcblxuICAgIGdhbWVJbnRlcnZhbFRpbWVyID0ge1xuICAgICAgICBvYmo6IGZhbHNlLFxuICAgICAgICBtczogU0VUVElOR1MuR0FNRV9JTlRFUlZBTF9NU1xuICAgIH07XG5cbiAgICBjdXJyZW50R2FtZSA9IHtcbiAgICAgICAgc2NvcmU6IDAsXG4gICAgICAgIHJvd3NFbGltaW5hdGVkOiAwLFxuICAgICAgICBsZXZlbDogMVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCB0aGUgVGV0cmpzIGJvYXJkLlxuICAgICAqICAxLiBDbGVhciB0aGUgYm9hcmRcbiAgICAgKiAgICAgaS4gUmVtb3ZlIGFueSBleGlzdGluZyBIVE1MXG4gICAgICogICAgIGlpLiBDbGVhciB0aGUgbXVsdGlkaW1lbnNpb25hbC9tYXRyaXggYm9hcmQgb2JqZWN0XG4gICAgICogIDIuIFNldCB0aGUgYm9hcmQgd2lkdGggYW5kIGhlaWdodCAoaW4gcHgpXG4gICAgICogIDMuIENyZWF0ZSB0aGUgbmV3LCBjbGVhbiwgYm9hcmRcbiAgICAgKiAgICAgaS4gSW5zdGFudGlhdGUgdGhlIG11bHRpZGltZW5zaW9uYWwvbWF0cml4IGJvYXJkIGNvbnRhaW5lclxuICAgICAqICAgICBpaS4gQ3JlYXRlIGRpdiBib3hlcyBhdCBhYnNvbHV0ZSBwb3NpdGlvbiB0byBob2xkIGJsb2Nrc1xuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2V0dXBCb2FyZCgpIHtcbiAgICAgICAgY29uc3QgZWxCb2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRE9NX0lEUy5CT0FSRCk7XG5cbiAgICAgICAgLy8gQ2xlYXIgdGhlIGJvYXJkXG4gICAgICAgIGVsQm9hcmQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgdGhpcy5ib2FyZCA9IHt9O1xuXG4gICAgICAgIC8vIFNldCB0aGUgYm9hcmQgc2l6ZVxuICAgICAgICBjb25zdCBib2FyZFdpZHRoID0gU0VUVElOR1MuQk9BUkRfQ09MU19XSURFICogU0VUVElOR1MuQ0VMTF9XSURUSF9QWDtcbiAgICAgICAgY29uc3QgYm9hcmRIZWlnaHQgPSBTRVRUSU5HUy5CT0FSRF9ST1dTX0hJR0ggKiBTRVRUSU5HUy5DRUxMX0hFSUdIVF9QWDtcbiAgICAgICAgZWxCb2FyZC5zdHlsZS53aWR0aCA9IGAke2JvYXJkV2lkdGh9cHhgO1xuICAgICAgICBlbEJvYXJkLnN0eWxlLmhlaWdodCA9IGAke2JvYXJkSGVpZ2h0fXB4YDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBTRVRUSU5HUy5CT0FSRF9ST1dTX0hJR0g7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ib2FyZFtpXSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgdG9wX3BvcyA9IChpIC0gMSkgKiBTRVRUSU5HUy5DRUxMX0hFSUdIVF9QWDtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IFNFVFRJTkdTLkJPQVJEX0NPTFNfV0lERTsgaisrKSB7XG4gICAgICAgICAgICAgICAgLy8gU2V0dXAgdGhlIG9iamVjdCBmb3Igc3RvcmluZyBibG9jayBwb3NpdGlvbnNcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2ldW2pdID0ge307XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgbGVmdCBweCBwb3NpdGlvbiBvZiB0aGUgY2VsbFxuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRfcG9zID0gKGogLSAxKSAqIFNFVFRJTkdTLkNFTExfV0lEVEhfUFg7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIGJsb2NrIHRvIHRoZSBib2FyZFxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBibG9jay5zdHlsZS5sZWZ0ID0gbGVmdF9wb3MudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBibG9jay5zdHlsZS50b3AgPSB0b3BfcG9zLnRvU3RyaW5nKCkgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgYmxvY2suY2xhc3NOYW1lID0gdGhpcy5ET01fQ0xBU1NFUy5CT0FSRF9CTE9DSztcbiAgICAgICAgICAgICAgICBibG9jay5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgdGJfJHtqfV8ke2l9YCk7XG4gICAgICAgICAgICAgICAgZWxCb2FyZC5hcHBlbmRDaGlsZChibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCB0aGUgc21hbGwgcHJldmlldyBib2FyZCB0byBkaXNwbGF5IHRoZSBuZXh0IHBpZWNlLlxuICAgICAqXG4gICAgICogQWxtb3N0IGlkZW50aWNhbCB0byB0aGUgc2V0dXBCb2FyZCBmdW5jdGlvbiwgZXhjZXB0IHdlXG4gICAgICogZG8gbm90IG5lZWQgYSBtdWx0aWRpbWVuc2lvbmFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBib2FyZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNldHVwUHJldmlld0JvYXJkKCkge1xuICAgICAgICBjb25zdCBlbFByZXZpZXdCb2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgdGhpcy5ET01fSURTLlBSRVZJRVdfQ09OVEFJTkVSXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHByZXZpZXdfc2VjdGlvbnNfd2lkZSA9IDY7XG4gICAgICAgIGNvbnN0IHByZXZpZXdfc2VjdGlvbnNfaGlnaCA9IDQ7XG5cbiAgICAgICAgLy8gQ2xlYXIgdGhlIGJvYXJkXG4gICAgICAgIGNvbnN0IGJvYXJkV2lkdGggPSBwcmV2aWV3X3NlY3Rpb25zX3dpZGUgKiBTRVRUSU5HUy5DRUxMX1dJRFRIX1BYO1xuICAgICAgICBjb25zdCBib2FyZEhlaWdodCA9IHByZXZpZXdfc2VjdGlvbnNfaGlnaCAqIFNFVFRJTkdTLkNFTExfSEVJR0hUX1BYO1xuICAgICAgICBlbFByZXZpZXdCb2FyZC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBlbFByZXZpZXdCb2FyZC5zdHlsZS53aWR0aCA9IGAke2JvYXJkV2lkdGh9cHhgO1xuICAgICAgICBlbFByZXZpZXdCb2FyZC5zdHlsZS5oZWlnaHQgPSBgJHtib2FyZEhlaWdodH1weGA7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gcHJldmlld19zZWN0aW9uc19oaWdoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRvcF9wb3MgPSAoaSAtIDEpICogU0VUVElOR1MuQ0VMTF9IRUlHSFRfUFg7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8PSBwcmV2aWV3X3NlY3Rpb25zX3dpZGU7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRfcG9zID0gKGogLSAxKSAqIFNFVFRJTkdTLkNFTExfV0lEVEhfUFg7XG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBibG9jay5zdHlsZS50b3AgPSB0b3BfcG9zICsgXCJweFwiO1xuICAgICAgICAgICAgICAgIGJsb2NrLnN0eWxlLmxlZnQgPSBsZWZ0X3BvcyArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBibG9jay5jbGFzc05hbWUgPSB0aGlzLkRPTV9DTEFTU0VTLkJPQVJEX0JMT0NLO1xuICAgICAgICAgICAgICAgIGJsb2NrLnNldEF0dHJpYnV0ZShcImlkXCIsIGB0cF8ke2p9XyR7aX1gKTtcbiAgICAgICAgICAgICAgICBlbFByZXZpZXdCb2FyZC5hcHBlbmRDaGlsZChibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSByYW5kb20gYmxvY2sgdHlwZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gc3RyaW5nIEJsb2NrIHR5cGVcbiAgICAgKi9cbiAgICBnZW5lcmF0ZVJhbmRvbUJsb2NrVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIEJMT0NLX1RZUEVTW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIEJMT0NLX1RZUEVTLmxlbmd0aCldO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ha2UgdGhlIHByZXZpZXcgYmxvY2sgaW4gdGhlIHByZXZpZXcgYm9hcmQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBtYWtlUHJldmlld1BpZWNlKCkge1xuICAgICAgICBpZiAodGhpcy5pc1BhdXNlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9SZW1vdmUgdGhlIGN1cnJlbnQgYmxvY2sgZnJvbSB0aGUgcHJldmlld1xuICAgICAgICBmb3IgKGxldCBibG9ja19pZCBvZiB0aGlzLnByZXZpZXdQaWVjZS5ibG9ja3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2tfaWQpO1xuICAgICAgICAgICAgdXRpbC5yZW1vdmVDbGFzcyhibG9jaywgdGhpcy5wcmV2aWV3UGllY2UuY2xhc3MpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJldmlld1BpZWNlLmJsb2NrcyA9IFtdO1xuXG4gICAgICAgIC8vR2V0IGEgcmFuZG9tIGJsb2NrXG4gICAgICAgIHRoaXMucHJldmlld1BpZWNlLnR5cGUgPSB0aGlzLmdlbmVyYXRlUmFuZG9tQmxvY2tUeXBlKCk7XG5cbiAgICAgICAgdGhpcy5wcmV2aWV3UGllY2UuY2xhc3MgPSBCTE9DS1NbdGhpcy5wcmV2aWV3UGllY2UudHlwZV1bXCJjbGFzc1wiXTtcbiAgICAgICAgY29uc3Qgc3RhcnRfY29sID0gMjtcbiAgICAgICAgY29uc3Qgc3RhcnRfcm93ID0gMjtcbiAgICAgICAgY29uc3QgY3Vycl9ibG9ja19wb3NpdGlvbl9yb3dzID1cbiAgICAgICAgICAgIEJMT0NLU1t0aGlzLnByZXZpZXdQaWVjZS50eXBlXVtcInBvc2l0aW9uc1wiXVswXVtcInJvd3NcIl07XG5cbiAgICAgICAgLy8gUm93cyBhcmUgc3RvcmVkIGFzIGFuIG9iamVjdC1tYXRyaXhcbiAgICAgICAgY29uc3Qgcm93X2tleXMgPSBPYmplY3Qua2V5cyhjdXJyX2Jsb2NrX3Bvc2l0aW9uX3Jvd3MpO1xuICAgICAgICBmb3IgKGxldCByb3dfaW5kZXggb2Ygcm93X2tleXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IGN1cnJfYmxvY2tfcG9zaXRpb25fcm93c1tyb3dfaW5kZXhdO1xuICAgICAgICAgICAgY29uc3QgY29sX2tleXMgPSBPYmplY3Qua2V5cyhyb3cpO1xuICAgICAgICAgICAgZm9yIChsZXQgY29sX2luZGV4IG9mIGNvbF9rZXlzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJvd1tjb2xfaW5kZXhdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrX2NvbCA9IHN0YXJ0X2NvbCArIHBhcnNlSW50KGNvbF9pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2NrX3JvdyA9IHN0YXJ0X3JvdyArIHBhcnNlSW50KHJvd19pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gXCJ0cF9cIiArIGJsb2NrX2NvbCArIFwiX1wiICsgYmxvY2tfcm93O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5hZGRDbGFzcyhlbCwgdGhpcy5wcmV2aWV3UGllY2UuY2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJldmlld1BpZWNlLmJsb2Nrcy5wdXNoKGlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlIGEgYmxvY2sgb24gdGhlIGJvYXJkLlxuICAgICAqIFRoaXMgaXMgbW9zdGx5IGNhbGxlZCBhcyB0aGUga2V5Ym9hcmQgZXZlbnQgaGFuZGxlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIG1vdmVCbG9jayhkZXNpcmVkX2RpcmVjdGlvbikge1xuICAgICAgICBjb25zdCBjdXJyX2Jsb2NrX25vX3Bvc2l0aW9ucyA9XG4gICAgICAgICAgICBCTE9DS1NbdGhpcy5jdXJyZW50QmxvY2sudHlwZV1bXCJub19wb3NpdGlvbnNcIl07XG4gICAgICAgIGxldCBjdXJyX2Jsb2NrX3Bvc190cmFuc19yb3cgPSAwO1xuICAgICAgICBsZXQgY3Vycl9ibG9ja19wb3NfdHJhbnNfY29sID0gMDtcbiAgICAgICAgbGV0IGRlc2lyZWRfcG9zaXRpb24gPSB0aGlzLmN1cnJlbnRCbG9jay5wb3NpdGlvbjtcblxuICAgICAgICAvLyAndXAnIHJvdGF0ZXMgdGhlIGJsb2NrXG4gICAgICAgIGlmIChkZXNpcmVkX2RpcmVjdGlvbiA9PSBcInVwXCIpIHtcbiAgICAgICAgICAgIGRlc2lyZWRfcG9zaXRpb24gPSB0aGlzLmN1cnJlbnRCbG9jay5wb3NpdGlvbiArIDE7XG4gICAgICAgICAgICBpZiAoZGVzaXJlZF9wb3NpdGlvbiA+IGN1cnJfYmxvY2tfbm9fcG9zaXRpb25zIC0gMSkge1xuICAgICAgICAgICAgICAgIC8vUmVzZXQgdGhlIHRyYW5zaXRpb24gYmFjayB0byAwXG4gICAgICAgICAgICAgICAgZGVzaXJlZF9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoZSBhbW91bnQgdG8gbW92ZSB0aGUgZGVzaXJlZCByb3cgYW5kIGNvbHVtblxuICAgICAgICAgICAgLy8gZHVyaW5nIHRoZSB0cmFuc2Zvcm1hdGlvblxuICAgICAgICAgICAgY3Vycl9ibG9ja19wb3NfdHJhbnNfcm93ID1cbiAgICAgICAgICAgICAgICBCTE9DS1NbdGhpcy5jdXJyZW50QmxvY2sudHlwZV1bXCJwb3NpdGlvbnNcIl1bZGVzaXJlZF9wb3NpdGlvbl1bXG4gICAgICAgICAgICAgICAgICAgIFwidHJhbnNfcm93XCJcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgY3Vycl9ibG9ja19wb3NfdHJhbnNfY29sID1cbiAgICAgICAgICAgICAgICBCTE9DS1NbdGhpcy5jdXJyZW50QmxvY2sudHlwZV1bXCJwb3NpdGlvbnNcIl1bZGVzaXJlZF9wb3NpdGlvbl1bXG4gICAgICAgICAgICAgICAgICAgIFwidHJhbnNfY29sXCJcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRtcF9kZXNpcmVkX3Bvc2l0aW9ucyA9IFtdO1xuICAgICAgICBsZXQgbG9ja19jdXJyZW50X2Jsb2NrID0gZmFsc2U7XG4gICAgICAgIGxldCB0bXBfbG93ZXN0X2NvbCA9IFNFVFRJTkdTLkJPQVJEX0NPTFNfV0lERTtcbiAgICAgICAgbGV0IHRtcF9sb3dlc3Rfcm93ID0gU0VUVElOR1MuQk9BUkRfUk9XU19ISUdIO1xuXG4gICAgICAgIGxldCBlcnJvciA9IGZhbHNlO1xuICAgICAgICBjb25zdCBjdXJyX2Jsb2NrX3Bvc2l0aW9uX3Jvd3MgPVxuICAgICAgICAgICAgQkxPQ0tTW3RoaXMuY3VycmVudEJsb2NrLnR5cGVdW1wicG9zaXRpb25zXCJdW2Rlc2lyZWRfcG9zaXRpb25dW1xuICAgICAgICAgICAgICAgIFwicm93c1wiXG4gICAgICAgICAgICBdO1xuICAgICAgICBjb25zdCByb3dLZXlzID0gT2JqZWN0LmtleXMoY3Vycl9ibG9ja19wb3NpdGlvbl9yb3dzKTtcbiAgICAgICAgZm9yIChsZXQgcm93X2luZGV4ID0gMDsgcm93X2luZGV4IDwgcm93S2V5cy5sZW5ndGg7IHJvd19pbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBjdXJyX2Jsb2NrX3Bvc2l0aW9uX3Jvd3Nbcm93X2luZGV4XTtcbiAgICAgICAgICAgIGNvbnN0IGNvbEtleXMgPSBPYmplY3Qua2V5cyhyb3cpO1xuICAgICAgICAgICAgZm9yIChsZXQgY29sX2luZGV4ID0gMDsgY29sX2luZGV4IDwgY29sS2V5cy5sZW5ndGg7IGNvbF9pbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJvd1tjb2xfaW5kZXhdID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRtcF9waWVjZV9jb2xfcG9zID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmNvbCArIHBhcnNlSW50KGNvbF9pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRtcF9waWVjZV9yb3dfcG9zID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJsb2NrLnJvdyArIHBhcnNlSW50KHJvd19pbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHRtcF9waWVjZV9kZXNpcmVkX2NvbCA9XG4gICAgICAgICAgICAgICAgICAgICAgICB0bXBfcGllY2VfY29sX3BvcyArIGN1cnJfYmxvY2tfcG9zX3RyYW5zX2NvbDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRtcF9waWVjZV9kZXNpcmVkX3JvdyA9XG4gICAgICAgICAgICAgICAgICAgICAgICB0bXBfcGllY2Vfcm93X3BvcyArIGN1cnJfYmxvY2tfcG9zX3RyYW5zX3JvdztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZF9kaXJlY3Rpb24gPT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3RtcF9waWVjZV9kZXNpcmVkX3Jvd11bXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcF9waWVjZV9kZXNpcmVkX2NvbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0uaGFzT3duUHJvcGVydHkoXCJjbGFzc1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTmV3IHBpZWNlIGJ1dCBhIHNwYWNlIGlzIGFscmVhZHkgdGFrZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWVPdmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZF9kaXJlY3Rpb24gPT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcF9waWVjZV9kZXNpcmVkX2NvbCA9IHRtcF9waWVjZV9jb2xfcG9zIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXNpcmVkX2RpcmVjdGlvbiA9PSBcInJpZ2h0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRtcF9waWVjZV9kZXNpcmVkX2NvbCA9IHRtcF9waWVjZV9jb2xfcG9zICsgMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXNpcmVkX2RpcmVjdGlvbiA9PSBcImRvd25cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG1wX3BpZWNlX2Rlc2lyZWRfcm93ID0gdG1wX3BpZWNlX3Jvd19wb3MgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRtcF9waWVjZV9kZXNpcmVkX3JvdyA+IFNFVFRJTkdTLkJPQVJEX1JPV1NfSElHSCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbdG1wX3BpZWNlX2Rlc2lyZWRfcm93XVtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wX3BpZWNlX2Rlc2lyZWRfY29sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5oYXNPd25Qcm9wZXJ0eShcImNsYXNzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBbHJlYWR5IGEgYmxvY2sgaW4gdGhlIG5leHQgZG93bndhcmQgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NrX2N1cnJlbnRfYmxvY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJvYXJkLmhhc093blByb3BlcnR5KHRtcF9waWVjZV9kZXNpcmVkX3JvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQ2FuJ3QgbW92ZSBkb3duLCBzbyBlcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgIXRoaXMuYm9hcmRbdG1wX3BpZWNlX2Rlc2lyZWRfcm93XS5oYXNPd25Qcm9wZXJ0eShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXBfcGllY2VfZGVzaXJlZF9jb2xcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL09mZiB0aGUgYm9hcmQgZXJyb3Igb3V0XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3RtcF9waWVjZV9kZXNpcmVkX3Jvd11bXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wX3BpZWNlX2Rlc2lyZWRfY29sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmhhc093blByb3BlcnR5KFwiY2xhc3NcIilcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL0JvYXJkIHNwb3QgYWxyZWFkeSB0YWtlblxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRtcF9waWVjZV9kZXNpcmVkX2NvbCA8IHRtcF9sb3dlc3RfY29sKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG1wX2xvd2VzdF9jb2wgPSB0bXBfcGllY2VfZGVzaXJlZF9jb2w7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodG1wX3BpZWNlX2Rlc2lyZWRfcm93IDwgdG1wX2xvd2VzdF9yb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXBfbG93ZXN0X3JvdyA9IHRtcF9waWVjZV9kZXNpcmVkX3JvdztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdG1wX2Rlc2lyZWRfcG9zaXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbDogdG1wX3BpZWNlX2Rlc2lyZWRfY29sLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogdG1wX3BpZWNlX2Rlc2lyZWRfcm93XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICghbG9ja19jdXJyZW50X2Jsb2NrKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBjdXJyZW50IHBpZWNlXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDdXJyZW50QmxvY2tGcm9tQm9hcmQoKTtcblxuICAgICAgICAgICAgICAgIC8vU2V0IHRoZSBuZXcgY3VycmVudCBkaXJlY3Rpb25cbiAgICAgICAgICAgICAgICBpZiAoZGVzaXJlZF9kaXJlY3Rpb24gPT0gXCJ1cFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJsb2NrLnBvc2l0aW9uID0gZGVzaXJlZF9wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIG5ldyBjdXJyZW50IHJvdyBhbmQgY29sdW1uXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suY29sID0gdG1wX2xvd2VzdF9jb2w7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QmxvY2sucm93ID0gdG1wX2xvd2VzdF9yb3c7XG4gICAgICAgICAgICAgICAgLy8gQXBwbHkgdGhlICdtb3ZlbWVudCcgYnkgbW9kaWZ5aW5nIHRoZSBibG9jaydzIGNsYXNzXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcG9zIG9mIHRtcF9kZXNpcmVkX3Bvc2l0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG1wX2lkID0gYHRiXyR7cG9zW1wiY29sXCJdfV8ke3Bvc1tcInJvd1wiXX1gO1xuICAgICAgICAgICAgICAgICAgICB2YXIgalRNUCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRtcF9pZCk7XG4gICAgICAgICAgICAgICAgICAgIHV0aWwuYWRkQ2xhc3MoalRNUCwgdGhpcy5jdXJyZW50QmxvY2suY2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5ibG9ja0lkcy5wdXNoKHRtcF9pZCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrUG9zaXRpb25zLnB1c2gocG9zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgYmxvY2sgaGFzIHJlYWNoZWQgaXRzIGZpbmFsIGRlc3RpbmF0aW9uXG4gICAgICAgIGlmIChsb2NrX2N1cnJlbnRfYmxvY2spIHtcbiAgICAgICAgICAgIGZvciAobGV0IHBvcyBvZiB0aGlzLmN1cnJlbnRCbG9jay5ibG9ja1Bvc2l0aW9ucykge1xuICAgICAgICAgICAgICAgIC8vIExvY2sgdGhlIGN1cnJlbnQgYmxvY2sgb24gdGhlIGJvYXJkXG4gICAgICAgICAgICAgICAgLy8gYnkgc2V0dGluZyB0aGUgcGVybWFuZW50IGJvYXJkIGNsYXNzXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtwb3NbXCJyb3dcIl1dW3Bvc1tcImNvbFwiXV0gPSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiB0aGlzLmN1cnJlbnRCbG9jay5jbGFzc1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBibG9jayBoYXMgY2F1c2VkIHJvd3MgdG8gYmUgZWxpbWluYXRlZFxuICAgICAgICAgICAgdGhpcy5jaGVja0FuZEVsaW1pbmF0ZVJvd3MoKTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBuZXh0IGJsb2NrXG4gICAgICAgICAgICB0aGlzLm5leHRCbG9jaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlcmUgYXJlIGFueSByb3dzIHRvIHJlbW92ZVxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgY2hlY2tBbmRFbGltaW5hdGVSb3dzKCkge1xuICAgICAgICBsZXQgbm9fcm93c19lbGltaW5hdGVkID0gMDtcblxuICAgICAgICAvL0xvb3Agb3ZlciB0aGUgYm9hcmQgcm93c1xuICAgICAgICBjb25zdCByb3dLZXlzID0gT2JqZWN0LmtleXModGhpcy5ib2FyZCk7XG4gICAgICAgIGZvciAobGV0IHJfaW5kZXggb2Ygcm93S2V5cykge1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5ib2FyZFtyX2luZGV4XTtcbiAgICAgICAgICAgIGxldCBjb2x1bW5fZnVsbF9jb3VudCA9IDA7XG5cbiAgICAgICAgICAgIC8vTG9vcCBvdmVyIHRoZSBjb2x1bW5zIGluIHRoaXMgcm93XG4gICAgICAgICAgICBjb25zdCBjb2xLZXlzID0gT2JqZWN0LmtleXMocm93KTtcbiAgICAgICAgICAgIGZvciAobGV0IGNvbF9pbmRleCBvZiBjb2xLZXlzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sID0gcm93W2NvbF9pbmRleF07XG4gICAgICAgICAgICAgICAgLy8gQSBjbGFzcyBpbmRpY2F0ZXMgdGhlIGNvbHVtbiBpbiB0aGlzIHJvdyBpcyBmdWxsXG4gICAgICAgICAgICAgICAgaWYgKGNvbC5oYXNPd25Qcm9wZXJ0eShcImNsYXNzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbl9mdWxsX2NvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGUgZW50aXJlIHJvdyBpcyBmdWxsXG4gICAgICAgICAgICBpZiAoY29sdW1uX2Z1bGxfY291bnQgPT09IFNFVFRJTkdTLkJPQVJEX0NPTFNfV0lERSkge1xuICAgICAgICAgICAgICAgIG5vX3Jvd3NfZWxpbWluYXRlZCsrO1xuXG4gICAgICAgICAgICAgICAgLy9Nb3ZlIHRoZSB1cHBlciByb3dzIGRvd24sIGZyb20gdGhlIGJvdHRvbSB1cFxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSByX2luZGV4OyBpID49IDE7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2xLZXlzID0gT2JqZWN0LmtleXModGhpcy5ib2FyZFtpXSk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGNfaW5kZXggb2YgY29sS2V5cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sID0gcm93W2NfaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByZXZfY2xhc3MgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuaGFzT3duUHJvcGVydHkoaSAtIDEpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFtpIC0gMV1bY19pbmRleF0uaGFzT3duUHJvcGVydHkoXCJjbGFzc1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGNsYXNzIGZyb20gdGhlIGJsb2NrIGRpcmVjdGx5IGFib3ZlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldl9jbGFzcyA9IHRoaXMuYm9hcmRbaSAtIDFdW2NfaW5kZXhdW1wiY2xhc3NcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGpDdXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdGJfJHtjX2luZGV4fV8ke2l9YFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbC5oYXNPd25Qcm9wZXJ0eShcImNsYXNzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbC5yZW1vdmVDbGFzcyhqQ3VyLCBjb2xbXCJjbGFzc1wiXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2X2NsYXNzICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NvcHkgZG93biB0aGUgY2xhc3MgZnJvbSBhYm92ZSB0byB0aGUgYmxvY2sgaW4gdGhpcyByb3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dGlsLmFkZENsYXNzKGpDdXIsIHByZXZfY2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbaV1bY19pbmRleF0gPSB7IGNsYXNzOiBwcmV2X2NsYXNzIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQmxhbmsgYmxvY2sgKG5vIGJsb2NrIGFib3ZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbaV1bY19pbmRleF0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub19yb3dzX2VsaW1pbmF0ZWQgPiAwKSB7XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHNjb3JlXG4gICAgICAgICAgICB0aGlzLnNjb3JlKG5vX3Jvd3NfZWxpbWluYXRlZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTY29yZSBhIG1vdmUgYmFzZWQgb24gdGhlIG51bWJlciBvZiByb3dzIGVsaW1pbmF0ZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnQgbm9fcm93c19lbGltaW5hdGVkIFRoZSBudW1iZXIgb2Ygcm93cyBlbGltaW5hdGVkLlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNjb3JlKG5vX3Jvd3NfZWxpbWluYXRlZCkge1xuICAgICAgICBsZXQgbXVsdGlwbGVfcm93X2JvbnVzID0gMDtcbiAgICAgICAgbGV0IGN1cnJlbnRfbXVsdGlwbGllciA9XG4gICAgICAgICAgICBTRVRUSU5HUy5HQU1FX1NDT1JFX01VTFRJUExJRVIgKiB0aGlzLmN1cnJlbnRHYW1lLmxldmVsO1xuXG4gICAgICAgIHRoaXMuY3VycmVudEdhbWUucm93c0VsaW1pbmF0ZWQgPVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50R2FtZS5yb3dzRWxpbWluYXRlZCArIG5vX3Jvd3NfZWxpbWluYXRlZDtcblxuICAgICAgICBpZiAobm9fcm93c19lbGltaW5hdGVkID4gMSkge1xuICAgICAgICAgICAgLy8gR2l2ZSB1c2VycyBhIGJvbnVzIGZvciBlbGltaW5hdGluZyBtb3JlIHRoYW4gb25lIHJvd1xuICAgICAgICAgICAgbXVsdGlwbGVfcm93X2JvbnVzID1cbiAgICAgICAgICAgICAgICBub19yb3dzX2VsaW1pbmF0ZWQgKiAoY3VycmVudF9tdWx0aXBsaWVyICogMC41KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLnNjb3JlID1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudEdhbWUuc2NvcmUgK1xuICAgICAgICAgICAgbm9fcm93c19lbGltaW5hdGVkICogY3VycmVudF9tdWx0aXBsaWVyICtcbiAgICAgICAgICAgIG11bHRpcGxlX3Jvd19ib251cztcblxuICAgICAgICB0aGlzLnNldFNjb3JlVGV4dCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRHYW1lLnJvd3NFbGltaW5hdGVkID09IFNFVFRJTkdTLkJPQVJEX1JPV1NfSElHSCkge1xuICAgICAgICAgICAgLy8gTGV2ZWwgdXBcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEdhbWUucm93c0VsaW1pbmF0ZWQgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLmxldmVsID0gdGhpcy5jdXJyZW50R2FtZS5sZXZlbCArIDE7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0TGV2ZWxUZXh0KCk7XG5cbiAgICAgICAgICAgIC8vIEluY3JlYXNlIHRoZSBzcGVlZCBvZiB0aGUgZ2FtZSBpbnRlcnZhbFxuICAgICAgICAgICAgdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5tcyA9IHRoaXMuZ2FtZUludGVydmFsVGltZXIubXMgLSAyMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgU2NvcmUgdGV4dFxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2V0U2NvcmVUZXh0KCkge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgIHRoaXMuRE9NX0lEUy5TQ09SRV9DT05UQUlORVJcbiAgICAgICAgKS5pbm5lclRleHQgPSB0aGlzLmN1cnJlbnRHYW1lLnNjb3JlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgTGV2ZWwgdGV4dC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNldExldmVsVGV4dCgpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLkRPTV9JRFMuTEVWRUxfQ09OVEFJTkVSKTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gXCJMRVZFTCBcIiArIHRoaXMuY3VycmVudEdhbWUubGV2ZWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBjdXJyZW50IGJsb2NrIGZyb20gdGhlIGJvYXJkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICByZW1vdmVDdXJyZW50QmxvY2tGcm9tQm9hcmQoKSB7XG4gICAgICAgIC8vUmVtb3ZlIHRoZSBjdXJyZW50IGNsYXNzIGZyb20gdGhlIHZpc2libGUgYmxvY2tzXG4gICAgICAgIGZvciAobGV0IGJsb2NrX2lkIG9mIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrSWRzKSB7XG4gICAgICAgICAgICBjb25zdCBibG9jayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrX2lkKTtcbiAgICAgICAgICAgIHV0aWwucmVtb3ZlQ2xhc3MoYmxvY2ssIHRoaXMuY3VycmVudEJsb2NrLmNsYXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vUmVzZXQgdGhlIGN1cnJlbnQgc2V0IG9mIGJsb2Nrc1xuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5ibG9ja0lkcyA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay5ibG9ja1Bvc2l0aW9ucyA9IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCB0aGUgbmV4dCBibG9jayB0byB0aGUgYm9hcmRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIG5leHRCbG9jaygpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNQYXVzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc2V0IGFsbCB0aGUgdmFyaWFibGVzXG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrSWRzID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLmJsb2NrUG9zaXRpb25zID0gW107XG5cbiAgICAgICAgLy8gVGhlIHByZXZpZXcgYmxvY2sgYmVjb21lcyB0aGUgY3VycmVudCBwaWVjZVxuICAgICAgICB0aGlzLmN1cnJlbnRCbG9jay50eXBlID0gdGhpcy5wcmV2aWV3UGllY2UudHlwZTtcbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suY2xhc3MgPSBCTE9DS1NbdGhpcy5jdXJyZW50QmxvY2sudHlwZV1bXCJjbGFzc1wiXTtcblxuICAgICAgICAvLyBSZXNldCB0aGUgc3RhcnQgbG9jYXRpb24gZm9yIHRoZSBibG9jayB0byBhcHBlYXJcbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2sucm93ID0gMTtcbiAgICAgICAgdGhpcy5jdXJyZW50QmxvY2suY29sID0gU0VUVElOR1MuUElFQ0VfU1RBUlRfQ09MO1xuXG4gICAgICAgIHRoaXMuY3VycmVudEJsb2NrLnBvc2l0aW9uID0gMDtcblxuICAgICAgICB0aGlzLm1vdmVCbG9jayhcIm5vbmVcIik7XG5cbiAgICAgICAgLy9SZXNldCB0aGUgZ2FtZSBpbnRlcnZhbFxuICAgICAgICB0aGlzLmtpbGxHYW1lSW50ZXJ2YWwoKTtcbiAgICAgICAgdGhpcy5zdGFydEdhbWVJbnRlcnZhbCgpO1xuXG4gICAgICAgIC8vIE1ha2UgdGhlIG5leHQgcHJldmlldyBibG9ja1xuICAgICAgICB0aGlzLm1ha2VQcmV2aWV3UGllY2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCB0aGUga2V5Ym9hcmQgZXZlbnRzLlxuICAgICAqICAgLSBBcnJvdyBrZXlzIGNvbnRyb2wgdGhlIG1vdGlvbiBvZiB0aGUgYmxvY2tzLlxuICAgICAqICAgLSAncCcgUGF1c2VzIHRoZSBnYW1lLlxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgc2V0dXBLZXlFdmVudHMoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGUgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgICAgICAvLyBMZWZ0IGFycm93IGtleVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVCbG9jayhcImxlZnRcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgICAgICAgLy8gVXAgYXJyb3cga2V5XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUJsb2NrKFwidXBcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICAgICAgLy8gUmlnaHQgYXJyb3cga2V5XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUJsb2NrKFwicmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgLy8gRG93biBhcnJvdyBrZXlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmxvY2soXCJkb3duXCIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgODA6XG4gICAgICAgICAgICAgICAgICAgIC8vICdwJyBwcmVzc2VkIHRvIHBhdXNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGF1c2VHYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdCAtIGRvbid0IGRvIGFueXRoaW5nXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gKHNjcm9sbCBvciBjaGFyLW1vdmUpXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHBsYXlpbmdcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHN0YXJ0UGxheSgpIHtcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLnByZXZpZXdQaWVjZS50eXBlID09IFwiXCIpIHtcbiAgICAgICAgICAgIC8vTmV3IGdhbWUgaXMgc3RhcnRpbmdcblxuICAgICAgICAgICAgLy9HZW5lcmF0ZSB0aGUgZmlyc3QgYmxvY2sgdHlwZVxuICAgICAgICAgICAgdGhpcy5wcmV2aWV3UGllY2UudHlwZSA9IHRoaXMuZ2VuZXJhdGVSYW5kb21CbG9ja1R5cGUoKTtcblxuICAgICAgICAgICAgLy9DcmVhdGUgdGhlIG5ldyBwaWVjZVxuICAgICAgICAgICAgdGhpcy5uZXh0QmxvY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RhcnRHYW1lSW50ZXJ2YWwoKTtcblxuICAgICAgICB0aGlzLmhpZGVNZXNzYWdlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgdGhlIGdhbWUgaW50ZXJ2YWxcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHN0YXJ0R2FtZUludGVydmFsKCkge1xuICAgICAgICBpZiAoIXRoaXMuZ2FtZUludGVydmFsVGltZXIub2JqKSB7XG4gICAgICAgICAgICAvLyBTZXR1cCB0aGUgaW50ZXJ2YWwgb2JqZWN0IHVzaW5nIHRoZSBzdGQganMgZnVuY3Rpb25cbiAgICAgICAgICAgIHRoaXMuZ2FtZUludGVydmFsVGltZXIub2JqID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vU3RhcnQgdGhlIGFjdGlvbiAoanVzdCBtb3ZlIHRoZSBjdXJyZW50IHBpZWNlIGRvd24pXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlQmxvY2soXCJkb3duXCIpO1xuICAgICAgICAgICAgfSwgdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5tcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdG9wIHRoZSBnYW1lIGludGVydmFsXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBraWxsR2FtZUludGVydmFsKCkge1xuICAgICAgICAvLyBDbGVhciBpdCB1c2luZyB0aGUgc3RhbmRhcmQganMgZnVuY3Rpb25cbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmdhbWVJbnRlcnZhbFRpbWVyLm9iaik7XG4gICAgICAgIHRoaXMuZ2FtZUludGVydmFsVGltZXIub2JqID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGF1c2Ugb3IgdW5wYXVzZSB0aGUgZ2FtZVxuICAgICAqXG4gICAgICogQHJldHVybiB2b2lkXG4gICAgICovXG4gICAgcGF1c2VHYW1lKCkge1xuICAgICAgICBpZiAodGhpcy5pc1BhdXNlZCkge1xuICAgICAgICAgICAgLy9BbHJlYWR5IHBhdXNlZCwgc28gc3RhcnQgdGhlIGdhbWVcbiAgICAgICAgICAgIHRoaXMuc3RhcnRQbGF5KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5raWxsR2FtZUludGVydmFsKCk7XG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIFNob3cgdGhlIHBhdXNlZCBtb2RhbCBtZXNzYWdlIChmcm9tIHRlbXBsYXRlKVxuICAgICAgICB0aGlzLnNob3dNZXNzYWdlKFwicGF1c2VkXCIpO1xuICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRldHJqcy1wYXVzZS1wbGF5XCIpO1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRQbGF5KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdhbWUgb3ZlciBvY2N1cnJlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIGdhbWVPdmVyKCkge1xuICAgICAgICB0aGlzLmlzUGF1c2VkID0gdHJ1ZTtcblxuICAgICAgICAvLyBTdG9wIHRoZSBnYW1lIGludGVydmFsXG4gICAgICAgIHRoaXMua2lsbEdhbWVJbnRlcnZhbCgpO1xuXG4gICAgICAgIHZhciB0ZW1wbGF0ZV92YXJzID0ge1xuICAgICAgICAgICAgc2NvcmU6IHRoaXMuY3VycmVudEdhbWVbXCJzY29yZVwiXSxcbiAgICAgICAgICAgIHJvd3NFbGltaW5hdGVkOiB0aGlzLmN1cnJlbnRHYW1lW1wicm93c0VsaW1pbmF0ZWRcIl0sXG4gICAgICAgICAgICBsZXZlbDogdGhpcy5jdXJyZW50R2FtZVtcImxldmVsXCJdXG4gICAgICAgIH07XG4gICAgICAgIC8vIFNob3cgdGhlIGdhbWVvdmVyIG1vZGFsIG1lc3NhZ2UgKGZyb20gdGVtcGxhdGUpXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXCJnYW1lb3ZlclwiLCB0ZW1wbGF0ZV92YXJzKTtcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXRyanMtZ2FtZW92ZXItbmV3Z2FtZVwiKTtcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgICAgICAgIHRoaXMubmV3R2FtZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCBhIG5ldyBnYW1lXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKiovXG4gICAgbmV3R2FtZSgpIHtcbiAgICAgICAgLy8gU3RvcCB0aGUgZ2FtZSBpbnRlcnZhbFxuICAgICAgICB0aGlzLmtpbGxHYW1lSW50ZXJ2YWwoKTtcblxuICAgICAgICAvLyBSZXNldCB0aGUgdGhlIHNjb3JlLCBsZXZlbCwgYW5kIGludGVydmFsXG4gICAgICAgIHRoaXMuY3VycmVudEdhbWUuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRHYW1lLmxldmVsID0gMTtcbiAgICAgICAgdGhpcy5nYW1lSW50ZXJ2YWxUaW1lci5tcyA9IFNFVFRJTkdTLkdBTUVfSU5URVJWQUxfTVM7XG5cbiAgICAgICAgLy8gUmVzZXQgdGhlIHNjb3JlIGFuZCBsZXZlbCB0ZXh0XG4gICAgICAgIHRoaXMuc2V0U2NvcmVUZXh0KCk7XG4gICAgICAgIHRoaXMuc2V0TGV2ZWxUZXh0KCk7XG5cbiAgICAgICAgLy8gU2V0dXAgdGhlIG1haW4gYW5kIHByZXZpZXcgYm9hcmRzXG4gICAgICAgIHRoaXMuc2V0dXBCb2FyZCgpO1xuICAgICAgICB0aGlzLnNldHVwUHJldmlld0JvYXJkKCk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBvbGQgcHJldmlldyBwaWVjZSB0eXBlXG4gICAgICAgIHRoaXMucHJldmlld1BpZWNlLnR5cGUgPSBcIlwiO1xuXG4gICAgICAgIC8vIFN0YXJ0IHRoZSBnYW1lXG4gICAgICAgIHRoaXMuc3RhcnRQbGF5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyB0aGUgaW50cm9kdWN0aW9uIG1lc3NhZ2U7XG4gICAgICogc2hvdWxkIGJlIHJ1biB3aGVuIGdhbWUgbG9hZHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKiovXG4gICAgc2hvd0ludHJvKCkge1xuICAgICAgICB0aGlzLnNldHVwQm9hcmQoKTtcbiAgICAgICAgdGhpcy5zZXR1cFByZXZpZXdCb2FyZCgpO1xuXG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXCJpbnRyb1wiKTtcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXRyanMtaW50cm8tbmV3Z2FtZVwiKTtcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgICAgICAgIHRoaXMubmV3R2FtZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG93IHRoZSBBYm91dCBQb3BvdmVyXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHZvaWRcbiAgICAgKi9cbiAgICBzaG93QWJvdXQoKSB7XG4gICAgICAgIHRoaXMua2lsbEdhbWVJbnRlcnZhbCgpO1xuICAgICAgICB0aGlzLmlzUGF1c2VkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnNob3dNZXNzYWdlKFwiYWJvdXRcIik7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV0cmpzLWFib3V0LWNsb3NlXCIpO1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdGFydFBsYXkoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdyBhIG1lc3NhZ2UgaW4gdGhlIG1vZGFsIHdpbmRvdy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIHNob3dNZXNzYWdlKHRlbXBsYXRlX25hbWUsIHZhcnMpIHtcbiAgICAgICAgY29uc3QgZWxNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRE9NX0lEUy5NT0RBTCk7XG4gICAgICAgIGNvbnN0IGVsVmVpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRE9NX0lEUy5NT0RBTF9WRUlMKTtcblxuICAgICAgICBjb25zdCBodG1sID0gdGVtcGxhdGVzW3RlbXBsYXRlX25hbWVdLnJlbmRlcih2YXJzKTtcblxuICAgICAgICBlbE1vZGFsLmlubmVySFRNTCA9IGh0bWw7XG5cbiAgICAgICAgdXRpbC5mYWRlSW4oZWxWZWlsLCAoKSA9PiB7XG4gICAgICAgICAgICBlbE1vZGFsLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgZWxNb2RhbC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgLy9DZW50ZXIgdGhlIG1lc3NhZ2UgaW4gdGhlIHZlaWxcbiAgICAgICAgICAgIGNvbnN0IGxlZnRPZmZzZXQgPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChlbFZlaWwub2Zmc2V0V2lkdGggLSBlbE1vZGFsLm9mZnNldFdpZHRoKSAvIDJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCB0b3BPZmZzZXQgPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgIChlbFZlaWwub2Zmc2V0SGVpZ2h0IC0gZWxNb2RhbC5vZmZzZXRIZWlnaHQpIC8gMlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZWxNb2RhbC5zdHlsZS5sZWZ0ID0gbGVmdE9mZnNldCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsTW9kYWwuc3R5bGUudG9wID0gdG9wT2Zmc2V0ICsgXCJweFwiO1xuICAgICAgICAgICAgZWxNb2RhbC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGlkZSB0aGUgbW9kYWwgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdm9pZFxuICAgICAqL1xuICAgIGhpZGVNZXNzYWdlKCkge1xuICAgICAgICB2YXIgZWxNb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuRE9NX0lEUy5NT0RBTCk7XG4gICAgICAgIHZhciBlbFZlaWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLkRPTV9JRFMuTU9EQUxfVkVJTCk7XG4gICAgICAgIHV0aWwuZmFkZU91dChlbE1vZGFsLCAoKSA9PiB7XG4gICAgICAgICAgICAvL0NsZWFyIGFmdGVyIHRoZSBmYWRlXG4gICAgICAgICAgICBlbE1vZGFsLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIH0pO1xuICAgICAgICB1dGlsLmZhZGVPdXQoZWxWZWlsLCAoKSA9PiB7fSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIHRldHJqcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdHJpbmcgY29udGFpbmVySUQgVGhlIGNvbnRhaW5lciBpZCBmb3IgdGV0cmpzLlxuICAgICAqL1xuICAgIHJ1bihjb250YWluZXJJRCkge1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcklEKTtcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gdGVtcGxhdGVzW1wiY29udGFpbmVyXCJdLnJlbmRlcigpO1xuXG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV0cmpzLWJ1dHRvbi1wYXVzZVwiKTtcbiAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgICAgICAgIHRoaXMucGF1c2VHYW1lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IG5ld0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV0cmpzLWJ1dHRvbi1uZXdcIik7XG4gICAgICAgIG5ld0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5ld0dhbWUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgYWJvdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRldHJqcy1idXR0b24tYWJvdXRcIik7XG4gICAgICAgIGFib3V0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0Fib3V0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2V0dXBLZXlFdmVudHMoKTtcblxuICAgICAgICB0aGlzLnNob3dJbnRybygpO1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJoYXNDbGFzcyIsImVsZSIsImNscyIsImNsYXNzTmFtZSIsIm1hdGNoIiwiUmVnRXhwIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsInJlZyIsInJlcGxhY2UiLCJmYWRlSW4iLCJlbGVtZW50IiwiY2IiLCJvcCIsInN0eWxlIiwiZGlzcGxheSIsInRpbWVyIiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwib3BhY2l0eSIsImZpbHRlciIsImZhZGVPdXQiLCJvdXRlckhlaWdodCIsIm91dGVyV2lkdGgiLCJCTE9DS19UWVBFUyIsIkJMT0NLUyIsIlNUUkFJR0hUIiwiY2xhc3MiLCJub19wb3NpdGlvbnMiLCJwb3NpdGlvbnMiLCJ0cmFuc19yb3ciLCJ0cmFuc19jb2wiLCJyb3dzIiwiTF9MRUZUIiwiTF9SSUdIVCIsIlNRVUFSRSIsIlMiLCJaIiwiVCIsIlNFVFRJTkdTIiwiQk9BUkRfQ09MU19XSURFIiwiQk9BUkRfUk9XU19ISUdIIiwiUElFQ0VfU1RBUlRfQ09MIiwiUElFQ0VfU1RBUlRfUk9XIiwiUElFQ0VfU1RBUlRfUE9TIiwiR0FNRV9JTlRFUlZBTF9NUyIsIkdBTUVfU0NPUkVfTVVMVElQTElFUiIsIkNFTExfV0lEVEhfUFgiLCJDRUxMX0hFSUdIVF9QWCIsIlRldHJqcyIsIkJPQVJEIiwiUFJFVklFV19DT05UQUlORVIiLCJTQ09SRV9DT05UQUlORVIiLCJMRVZFTF9DT05UQUlORVIiLCJNT0RBTCIsIk1PREFMX1ZFSUwiLCJCT0FSRF9CTE9DSyIsInR5cGUiLCJibG9ja0lkcyIsImJsb2NrUG9zaXRpb25zIiwicm93IiwiY29sIiwicG9zaXRpb24iLCJibG9ja3MiLCJvYmoiLCJtcyIsInNjb3JlIiwicm93c0VsaW1pbmF0ZWQiLCJsZXZlbCIsImVsQm9hcmQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiRE9NX0lEUyIsImlubmVySFRNTCIsImJvYXJkIiwiYm9hcmRXaWR0aCIsImJvYXJkSGVpZ2h0Iiwid2lkdGgiLCJoZWlnaHQiLCJpIiwidG9wX3BvcyIsImoiLCJsZWZ0X3BvcyIsImJsb2NrIiwiY3JlYXRlRWxlbWVudCIsImxlZnQiLCJ0b1N0cmluZyIsInRvcCIsIkRPTV9DTEFTU0VTIiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiLCJlbFByZXZpZXdCb2FyZCIsInByZXZpZXdfc2VjdGlvbnNfd2lkZSIsInByZXZpZXdfc2VjdGlvbnNfaGlnaCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImxlbmd0aCIsImlzUGF1c2VkIiwicHJldmlld1BpZWNlIiwiYmxvY2tfaWQiLCJ1dGlsIiwiZ2VuZXJhdGVSYW5kb21CbG9ja1R5cGUiLCJzdGFydF9jb2wiLCJzdGFydF9yb3ciLCJjdXJyX2Jsb2NrX3Bvc2l0aW9uX3Jvd3MiLCJyb3dfa2V5cyIsIk9iamVjdCIsImtleXMiLCJyb3dfaW5kZXgiLCJjb2xfa2V5cyIsImNvbF9pbmRleCIsImJsb2NrX2NvbCIsInBhcnNlSW50IiwiYmxvY2tfcm93IiwiaWQiLCJlbCIsInB1c2giLCJkZXNpcmVkX2RpcmVjdGlvbiIsImN1cnJfYmxvY2tfbm9fcG9zaXRpb25zIiwiY3VycmVudEJsb2NrIiwiY3Vycl9ibG9ja19wb3NfdHJhbnNfcm93IiwiY3Vycl9ibG9ja19wb3NfdHJhbnNfY29sIiwiZGVzaXJlZF9wb3NpdGlvbiIsInRtcF9kZXNpcmVkX3Bvc2l0aW9ucyIsImxvY2tfY3VycmVudF9ibG9jayIsInRtcF9sb3dlc3RfY29sIiwidG1wX2xvd2VzdF9yb3ciLCJlcnJvciIsInJvd0tleXMiLCJjb2xLZXlzIiwidG1wX3BpZWNlX2NvbF9wb3MiLCJ0bXBfcGllY2Vfcm93X3BvcyIsInRtcF9waWVjZV9kZXNpcmVkX2NvbCIsInRtcF9waWVjZV9kZXNpcmVkX3JvdyIsImhhc093blByb3BlcnR5IiwiZ2FtZU92ZXIiLCJyZW1vdmVDdXJyZW50QmxvY2tGcm9tQm9hcmQiLCJwb3MiLCJ0bXBfaWQiLCJqVE1QIiwiY2hlY2tBbmRFbGltaW5hdGVSb3dzIiwibmV4dEJsb2NrIiwibm9fcm93c19lbGltaW5hdGVkIiwicl9pbmRleCIsImNvbHVtbl9mdWxsX2NvdW50IiwiY19pbmRleCIsInByZXZfY2xhc3MiLCJqQ3VyIiwibXVsdGlwbGVfcm93X2JvbnVzIiwiY3VycmVudF9tdWx0aXBsaWVyIiwiY3VycmVudEdhbWUiLCJzZXRTY29yZVRleHQiLCJzZXRMZXZlbFRleHQiLCJnYW1lSW50ZXJ2YWxUaW1lciIsImlubmVyVGV4dCIsIm1vdmVCbG9jayIsImtpbGxHYW1lSW50ZXJ2YWwiLCJzdGFydEdhbWVJbnRlcnZhbCIsIm1ha2VQcmV2aWV3UGllY2UiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImtleUNvZGUiLCJwYXVzZUdhbWUiLCJwcmV2ZW50RGVmYXVsdCIsImhpZGVNZXNzYWdlIiwic3RhcnRQbGF5Iiwic2hvd01lc3NhZ2UiLCJidXR0b24iLCJldiIsInRlbXBsYXRlX3ZhcnMiLCJuZXdHYW1lIiwic2V0dXBCb2FyZCIsInNldHVwUHJldmlld0JvYXJkIiwidGVtcGxhdGVfbmFtZSIsInZhcnMiLCJlbE1vZGFsIiwiZWxWZWlsIiwiaHRtbCIsInRlbXBsYXRlcyIsInJlbmRlciIsImxlZnRPZmZzZXQiLCJvZmZzZXRXaWR0aCIsInRvcE9mZnNldCIsIm9mZnNldEhlaWdodCIsImNvbnRhaW5lcklEIiwibmV3QnV0dG9uIiwiYWJvdXQiLCJzaG93QWJvdXQiLCJzZXR1cEtleUV2ZW50cyIsInNob3dJbnRybyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFBOzs7Ozs7RUFNQSxTQUFTQSxRQUFULENBQWtCQyxHQUFsQixFQUF1QkMsR0FBdkIsRUFBNEI7RUFDeEIsU0FBTyxDQUFDLENBQUNELEdBQUcsQ0FBQ0UsU0FBSixDQUFjQyxLQUFkLENBQW9CLElBQUlDLE1BQUosQ0FBVyxZQUFZSCxHQUFaLEdBQWtCLFNBQTdCLENBQXBCLENBQVQ7RUFDSDtFQUVEOzs7Ozs7OztFQU1BLFNBQVNJLFFBQVQsQ0FBa0JMLEdBQWxCLEVBQXVCQyxHQUF2QixFQUE0QjtFQUN4QixNQUFJLENBQUNGLFFBQVEsQ0FBQ0MsR0FBRCxFQUFNQyxHQUFOLENBQWIsRUFBeUJELEdBQUcsQ0FBQ0UsU0FBSixJQUFpQixNQUFNRCxHQUF2QjtFQUM1QjtFQUVEOzs7Ozs7OztFQU1BLFNBQVNLLFdBQVQsQ0FBcUJOLEdBQXJCLEVBQTBCQyxHQUExQixFQUErQjtFQUMzQixNQUFJRixRQUFRLENBQUNDLEdBQUQsRUFBTUMsR0FBTixDQUFaLEVBQXdCO0VBQ3BCLFFBQUlNLEdBQUcsR0FBRyxJQUFJSCxNQUFKLENBQVcsWUFBWUgsR0FBWixHQUFrQixTQUE3QixD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

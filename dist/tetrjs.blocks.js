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


var BLOCK_TYPES = [
	'STRAIGHT',
	'L_LEFT',
	'L_RIGHT',
	'SQUARE',
	'S',
	'Z',
	'T'
];

var BLOCKS = {};
BLOCKS['STRAIGHT'] = {
	'class':'tetrjs-block-straight',
	'no_positions':2,
	'positions':{
		0: {
			'trans_row':1,
			'trans_col':-1,
			'rows':{
					'0':{0:1, 1:1, 2:1, 3:1}
				   }
		   },
		1: {
			'trans_row':-1,
			'trans_col':1,
			'rows':{
					'0':{0:1},
					'1':{0:1},
					'2':{0:1},
					'3':{0:1}
				   }
		   }
	}
}

BLOCKS['L_LEFT'] = {
	'class':'tetrjs-block-l-left',
	'no_positions':4,
	'positions':{
		0: {
			'trans_row':1,
			'trans_col':-1,
			'rows':{
					'0':{0:1, 1:1, 2:1},
					'1':{0:0, 1:0, 2:1}
				   }
		   },
		1: {
			'trans_row':-1,
			'trans_col':0,
			'rows':{
					'0':{0:0, 1:1},
					'1':{0:0, 1:1},
					'2':{0:1, 1:1}
				   }
		   },
		2: {
			'trans_row':0,
			'trans_col':0,
			'rows':{
					'0':{0:1, 1:0, 2:0},
					'1':{0:1, 1:1, 2:1}
				   }
		   },
		3: {
			'trans_row':0,
			'trans_col':1,
			'rows':{
					'0':{0:1, 1:1},
					'1':{0:1, 1:0},
					'2':{0:1, 1:0}
				   }
		   }
	}
}

BLOCKS['L_RIGHT'] = {
	'class':'tetrjs-block-l-right',	
	'no_positions':4,
	'positions':{
		0: {
			'trans_row':1,
			'trans_col':-1,
			'rows':{
					'0':{0:1, 1:1, 2:1},
					'1':{0:1, 1:0, 2:0}
				   }
		   },
		1: {
			'trans_row':-1,
			'trans_col':0,
			'rows':{
					'0':{0:1, 1:1},
					'1':{0:0, 1:1},
					'2':{0:0, 1:1}
				   }
		   },
		2: {
			'trans_row':0,
			'trans_col':0,
			'rows':{
					'0':{0:0, 1:0, 2:1},
					'1':{0:1, 1:1, 2:1}
				   }
		   },
		3: {
			'trans_row':0,
			'trans_col':1,
			'rows':{
					'0':{0:1, 1:0},
					'1':{0:1, 1:0},
					'2':{0:1, 1:1}
				   }
		   }
	}
}

BLOCKS['SQUARE'] = {
	'class':'tetrjs-block-square',
	'no_positions':1,
	'positions':{
		0: {
			'trans_row':0,
			'trans_col':0,
			'rows':{			
					'0':{0:1, 1:1},
					'1':{0:1, 1:1}
				   }
		   }
	}
	 
}

BLOCKS['S'] = {
	'class':'tetrjs-block-s',
	'no_positions':2,
	'positions':{
		0: {
			'trans_row':1,
			'trans_col':0,
			'rows':{
					'0':{0:0, 1:1, 2:1},
					'1':{0:1, 1:1, 2:0}
				   }
		   },
		1: {
			'trans_row':-1,
			'trans_col':0,
			'rows':{
					'0':{0:1, 1:0},
					'1':{0:1, 1:1},
					'2':{0:0, 1:1}
				   }
		   }
	}
}

BLOCKS['Z'] = {
	'class':'tetrjs-block-z',
	'no_positions':2,
	'positions':{
		0: {
			'trans_row':1,
			'trans_col':0,
			'rows':{
					'0':{0:1, 1:1, 2:0},
					'1':{0:0, 1:1, 2:1}
				   }
		   },
		1: {
			'trans_row':-1,
			'trans_col':0,
			'rows':{
					'0':{0:0, 1:1},
					'1':{0:1, 1:1},
					'2':{0:1, 1:0}
				   }
		   }
	}
	
}

BLOCKS['T'] = {
	'class':'tetrjs-block-t',
	'no_positions':4,
	'positions':{
		0: {
			'trans_row':1,
			'trans_col':-1,
			'rows':{
					'0':{0:1, 1:1, 2:1},				
					'1':{0:0, 1:1, 2:0}
				   }
		   },
		1: {
			'trans_row':-1,
			'trans_col':0,
			'rows':{
					'0':{0:0, 1:1},
					'1':{0:1, 1:1},
					'2':{0:0, 1:1}
				   }
		   },
		2: {
			'trans_row':0,
			'trans_col':0,
			'rows':{
					'0':{0:0, 1:1, 2:0},
					'1':{0:1, 1:1, 2:1}
				   }
		   },
		3: {
			'trans_row':0,
			'trans_col':1,
			'rows':{
					'0':{0:1, 1:0},
					'1':{0:1, 1:1},
					'2':{0:1, 1:0}
				    }
		   }
	}
}

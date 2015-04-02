/*
 * tetris.blocks.js
 *
 * Defines the various block types and their
 * possible positions.
 *
 * 'trans_row' property is the 
 *
 */

var BLOCKS = {};
var BLOCK_TYPES = [
	'STRAIGHT',
	'L_LEFT',
	'L_RIGHT',
	'SQUARE',
	'S',
	'Z',
	'T'
];
BLOCKS['STRAIGHT'] = {
	'class':'tetris-block-straight',
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
	'class':'tetris-block-l-left',
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
	'class':'tetris-block-l-right',	
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
	'class':'tetris-block-square',
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
	'class':'tetris-block-s',
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
	'class':'tetris-block-z',
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
	'class':'tetris-block-t',
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

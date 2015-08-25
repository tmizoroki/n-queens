// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        // this.hasRowConflictAt(rowIndex) ||
        // this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var boardRow = this.rows()[rowIndex];
      var piecesInRow =  _.reduce(boardRow, function(memo, cell) {
        return memo + cell;
      }, 0);
      return piecesInRow > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var boundRowConflict = this.hasRowConflictAt.bind(this);
      return _.some(this.rows(), function(_,index){
        return boundRowConflict(index);
      });
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var column = _.pluck(this.rows(),colIndex);
      var piecesInCol = _.reduce(column, function(memo, cell) {
        return memo + cell;
      }, 0);
      return piecesInCol > 1;   
      //return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var context = this;
      var columns = _.map(this.rows(),function(row,rowIndex){
        return _.pluck(context.rows(),rowIndex);
      });
      return _.some(this.rows(), function(_,index){
        return context.hasColConflictAt(index);
      });
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var diagArray = [];
      var n = this.get('n');
      var currentRow = 0;
      var boardRows = this.rows();
      for (var i = majorDiagonalColumnIndexAtFirstRow; i < majorDiagonalColumnIndexAtFirstRow + n; i++){
        if (this._isInBounds(currentRow, i)) {
          diagArray.push(boardRows[currentRow][i]);
        }
        currentRow++;
      }
      var piecesInDiag = _.reduce(diagArray, function(memo, cell) {
        return memo + cell;
      }, 0);
      return piecesInDiag > 1;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var n = this.get('n');
      var hasConflicts = [];
      for (var i = -(n - 1); i < n; i++) {
        hasConflicts.push(this.hasMajorDiagonalConflictAt(i));
      };
      return _.some(hasConflicts,function(item){
        return item;
      }); // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var diagArray = [];
      var n = this.get('n');
      var currentRow = 0;
      var boardRows = this.rows();
      for (var i = minorDiagonalColumnIndexAtFirstRow; i > minorDiagonalColumnIndexAtFirstRow - n; i--){
        if (this._isInBounds(currentRow, i)) {
          diagArray.push(boardRows[currentRow][i]);
        }
        currentRow++;
      }
      var piecesInDiag = _.reduce(diagArray, function(memo, cell) {
        return memo + cell;
      }, 0);
      return piecesInDiag > 1;
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var n = this.get('n');
      var hasConflicts = [];
      for (var i = 2 * (n - 1); i >= 0; i--) {
        hasConflicts.push(this.hasMinorDiagonalConflictAt(i));
      }
      return _.some(hasConflicts,function(item){
        return item;
      });
      //return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {

  var board = new Board({n: n});
  var badCols = [];
  for (var row = 0; row < n; row++) {
    //if (board.rows()[i])
    do {
      var rookColIndex = Math.floor(Math.random() * n);
    } while (_.indexOf(badCols, rookColIndex) !== -1);
    board.togglePiece(row, rookColIndex);
    badCols.push(rookColIndex);
  }
  var solution = board.rows(); //fixme


  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
  return "farts";
};

window.bitwiseSolution = function(n){

}

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var board = new Board({n: n});
  var n = board.get('n');
  var piecesPlaced = 0;
  var solutionCount = 0;
  var badCols = [];
  var rookPlacer = function(rowIndex){
    //var rows = board.rows();
    for (var i = 0; i < n; i++){
      if (_.indexOf(badCols,i)===-1){
        board.togglePiece(rowIndex,i);
        piecesPlaced++;
        badCols.push(i);
        //if (!board.hasAnyRooksConflicts()){
          if (piecesPlaced === n){
            solutionCount++;
          } else {
            rookPlacer(rowIndex+1);
          }
        //}
        board.togglePiece(rowIndex,i);
        piecesPlaced--;
        badCols.pop();
      }
    }
  };
  var start = new Date().getTime();
  rookPlacer(0);
  var end = new Date().getTime();
  var time = end - start;
  console.log(n + " rook solutions time: " + time);
  //var solution = undefined; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
  // return "shut up";
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  //debugger;
  var board = new Board({n: n});
  var piecesPlaced = 0;
  //var solutionCount = 0;
  //var solutionBoard;
  var emptyBoard = new Board({n: n})
  var queenPlacer = function(rowIndex){
    if (n === 0){
      return board.rows();
    }
    for (var i = 0; i < n; i++){ 
      board.togglePiece(rowIndex,i);
      piecesPlaced++;
      if (!board.hasAnyQueensConflicts()){
        if (piecesPlaced === n){
          return board.rows();
        } else {
          result = queenPlacer(rowIndex+1);
          if (result) {
            return result;
          }
        }
      }
      board.togglePiece(rowIndex,i);
      piecesPlaced--;
    }
  };
  var solution = queenPlacer(0)|| emptyBoard.rows();
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  if (n===0){return 1;};
  var numSolutions = 0;
  var all = '';
  for (var i = 0; i < n; i++) {
    all += '1';
  }
  all = parseInt(all, 2);
  var attempt = function(ld, cols, rd) {
    if(cols === all) {
      numSolutions++;
      return;
    }
    var poss = ~(ld|cols|rd) & all;
    while (poss){
      var bit = poss & -poss;
      poss = poss-bit;
      attempt((ld|bit)<<1, cols|bit, (rd|bit)>>1);
    };
  };
  var start = new Date().getTime();
  attempt(0, 0, 0);
  var end = new Date().getTime();
  var time = end - start;
  console.log(n + " queens solutions time: " + time);
  console.log('Number of solutions for ' + n + ' queens:', numSolutions);
  return numSolutions;

//Solution above uses bitwise operations. Vastly quicker bc operations are all done on a single array of 1s and 0s of length n.

//Solution below is original recursive solution. Could be greatly cleaned up to more closely resemble Fred's solution.
//Basic algorithm is similar to Fred's.

  // var board = new Board({n: n});
  // var n = board.get('n');
  // var piecesPlaced = 0;
  // var solutionCount = 0;
  // var badCols = [];
  // var midCol = (n-1)/2;
  // var queenPlacer = function(rowIndex){
  //   if (n === 0 || n === 1) {
  //     solutionCount++;
  //     return solutionCount;
  //   }
  //   var stop;
  //   //var solValue=2;
  //   if (rowIndex === 0 ){
  //     stop = (n/2);
  //     //solValue = 2;
  //   } else {
  //     stop = n;
  //     //solValue = 1;
  //   }
  //   for (var i = 0; i < stop; i++){
  //     if (rowIndex === 0 && i === midCol) {
  //       solValue = 1;
  //     }
  //     if (_.indexOf(badCols,i) === -1 && i!==badCols[badCols.length]-1 && i!==badCols[badCols.length]+1) {
  //       board.togglePiece(rowIndex,i);
  //       piecesPlaced++;
  //       badCols.push(i);
  //       if (!board.hasAnyQueensConflicts()){
  //         if (piecesPlaced === n){
  //           var currentBoard = board.rows();
  //           if (currentBoard[0][midCol]){
  //             solutionCount++;
  //           } else{
  //             solutionCount+=2;
  //           }
  //         } else {
  //           queenPlacer(rowIndex+1);
  //         }
  //       }
  //       board.togglePiece(rowIndex,i);
  //       piecesPlaced--;
  //       badCols.pop();
  //     }
  //   }
  // };

  // var start = new Date().getTime();
  // queenPlacer(0);
  // var time = end - start;
  // console.log(n + " queens solutions time: " + time);
  // //var solution = undefined; //fixme

  // console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  // return solutionCount;
};
window.N = function(Q,u,ee,n,s,H,R){s=0;Q=u?Q:(1<<Q)-1;H=~(u|ee|n)&Q;while(H)H^=R=-H&H,s+=N(Q,(u|R)<<1,ee|R,(n|R)>>1);return s+=ee==Q};//

window.timedRuan = function(n){
  var startRuan = new Date().getTime();
  var result = N(n);
  var endRuan = new Date().getTime();
  var timeRuan = endRuan-startRuan;
  console.log('time: '+timeRuan);
  console.log(result);
};

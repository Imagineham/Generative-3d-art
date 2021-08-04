/* NOTE: Don't edit this file. Only swatches.js. */

function makePatternCanvas(swatchFunction, patternName) {

  const func = function(p5) {

    p5.setup = function() {
      p5.createCanvas(canvasWidth, canvasHeight);
      p5.noLoop();
    }

    p5.draw = function() {
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          p5.push();
          p5.translate(col * cellSize, row * cellSize);
          swatchFunction(p5);
          p5.pop();
        }
      }
    }
  }

  new p5(func, patternName);
}

// The function calls below draw grids of swatches into the book.
// The book layout is defined in index.html and style.css.
// Swatch functions are defined in swatches.js.

makePatternCanvas(stripes, "stripes");
makePatternCanvas(plaid, "plaid");
makePatternCanvas(chevron, "chevron");
makePatternCanvas(checks, "checks");
makePatternCanvas(polkaDots, "polka-dots");
makePatternCanvas(harlequin, "harlequin");
makePatternCanvas(argyle, "argyle");
makePatternCanvas(honeycomb, "honeycomb");
makePatternCanvas(paisley, "paisley");
makePatternCanvas(floral, "floral");
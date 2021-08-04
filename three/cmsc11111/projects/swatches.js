// You may change numRows/Cols
const numRows = 8;
const numCols = 8;

// Do not change these three constants
const cellSize = 100;
const canvasWidth = numCols * cellSize;
const canvasHeight = numRows * cellSize;

//declaring objects!
let polkaDotArr = [];
let myChecks = [];
let lines = [];
let quads = [];
let hexagons = [];
let i;
let j;
let k;
let l;
let n = 6;

//////////////////////////////////////////////////
// Example swatch. You may edit if you'd like.

function stripes(p5) {

  // Define constants below.
  // Use const, rather than let, when the values don't change.

  const numLines = 5;
  const gap = cellSize / numLines;

  // Draw pattern below.
  // Use however many for loops you need.

  for (let i = 0; i < numLines; i++) {
    p5.stroke("DeepPink");
    p5.strokeWeight(10);
    const x = (i + 0.5) * gap;
    p5.line(x, 0, x, cellSize);
  }
}


//////////////////////////////////////////////////
// TODO: Implement your swatch functions below!
// Each function below draws an empty square,
// just to get something on the book pages.

function polkaDots(p5) {
  //uncomment this and it just looks so fun, makes unseamless though
  //p5.rotate(p5.radians(5));

  //provided background
  p5.fill('black');
  p5.noStroke();
  p5.square(0, 0, cellSize);

  //randomizes rgb color! uses for line and polkadot colors
  const c = p5.color(p5.random(255), p5.random(255), p5.random(255));

  //initialize an array of Circle into polkaDotArr[]. 
  //each Circle in the array starts at center, size of 25
  //and random color
  for (i = 0; i < 5; i++) {
    polkaDotArr[i] = new Circle(p5, cellSize / 2, cellSize / 2, 25, c);
  }

  //draw Circles in polkaDotArr
  for (j = 0; j < polkaDotArr.length; j++) {

    //line color and weight. 
    p5.stroke(c);
    p5.strokeWeight(2);

    //draw center right bottom left top in that order (clockwise)
    //draws a line for 4 out of 5 circles, each one pointing to a different corner of the square
    if (j === 0) {
      polkaDotArr[0].display(p5);
    } else if (j === 1) {
      //line point from center to top left
      p5.line(
        0,
        0,
        cellSize / 2,
        cellSize / 2
      )

      //draws right circle
      polkaDotArr[1].position.x = cellSize;
      polkaDotArr[1].display(p5);
    } else if (j === 2) {
      //line point from center to top right
      p5.line(
        cellSize,
        0,
        cellSize / 2,
        cellSize / 2
      )

      polkaDotArr[2].position.y = cellSize;
      polkaDotArr[2].display(p5);

    } else if (j === 3) {
      //line point from center to bottom right
      p5.line(
        cellSize,
        cellSize,
        cellSize / 2,
        cellSize / 2
      )
      polkaDotArr[3].position.x = 0;
      polkaDotArr[3].display(p5);
    } else if (j === 4) {
      //line point from center to bottom left
      p5.line(
        0,
        cellSize,
        cellSize / 2,
        cellSize / 2
      )
      polkaDotArr[4].position.y = 0;
      polkaDotArr[4].display(p5);
    }

  }

}

function checks(p5) {
  //provided background
  p5.fill('white');
  p5.noStroke();
  p5.square(0, 0, cellSize);
  for (i = 0; i < 25; i++) {
    myChecks[i] = new Square(p5, 0, cellSize / 2 - 15 / 2, 10, 255);
  }

  //this creates the alternating black and white squares HORIZONTAL line
  for (j = 0; j < myChecks.length; j++) {

    if (j % 2) {
      myChecks[j].color = 'black';
    } else {
      myChecks[j].color = 'white';
    }

    if (j < myChecks.length - 1) {
      myChecks[j].position.x = j * 10;
      //myChecks[j + 1].position.y = j * 5;
      myChecks[j].display(p5);
    }
  }

  for (let m = 0; m < myChecks.length; m++) {
    myChecks[m].position.y = cellSize/2 - 15/2 - 10;

    if (m % 2) {
      myChecks[m].color = 'white';
    } else {
      myChecks[m].color = 'black';
    }

    if (m < myChecks.length - 1) {
      myChecks[m].position.x = m * 10;
      myChecks[m].display(p5);
    }
  }




  //this creates the alternating black and white squares VERTICAL line
  //this just me having fun
  for (k = 0; k < myChecks.length; k++) {
    myChecks[k].position.x = cellSize - 40;

    if (k % 2) {
      myChecks[k].color = 'black';
    } else {
      myChecks[k].color = 'white';
    }

    myChecks[k].position.y = k * 10;
    myChecks[k].display(p5);
  }

  for (l = 0; l < myChecks.length; l++) {
    myChecks[l].position.x = cellSize - 30;

    if (l % 2) {
      myChecks[l].color = 'white';
    } else {
      myChecks[l].color = 'black';
    }

    myChecks[l].position.y = l * 10;
    myChecks[l].display(p5);
  }





  //the next 4 squares creates a square of size 10 in the 4 corners of the canvas
  //these squares create the unified solid squares
  let square1 = new Square(p5, 0, 0, 10, 'black');
  let square2 = new Square(p5, cellSize - 10, 0, 10, 'black');
  let square3 = new Square(p5, cellSize - 10, cellSize - 10, 10, 'black');
  let square4 = new Square(p5, 0, cellSize - 10, 10, 'black');

  square1.display(p5);
  square2.display(p5);
  square3.display(p5);
  square4.display(p5);

}

function plaid(p5) {
  p5.square(0, 0, cellSize);

  //randomizes rgb color! uses for line and polkadot colors
  const c = '#fed92a'; 

  //creates an array of lines we can loop through 
  for (i = 0; i < 20; i++) {
    lines[i] = new Line(p5, 0, 0, 0, 0, 2, p5.random(255));
  }

  //creates the black and white barcode-y lines in the background
  //this or loop changes thickness and position so we get a makeshift
  //ombre 
  for (j = 0; j < lines.length; j++) {
    lines[j].start.x += j * 5;
    lines[j].start.y = 2.2;
    lines[j].end.x += j * 5;
    lines[j].end.y = cellSize;
    lines[j].thickness += j * 0.2;
    lines[j].display(p5);
  }

  //draws rainbow plaid lines on top of background
  //i commented out 4 of the lines because it gets visually much
  //much more than desired that is...

  let lineThick1 = new Line(p5, 25, 0, 25, cellSize, 4, c);
  let lineThick2 = new Line(p5, 35, 0, 35, cellSize, 4, c);
  let lineThick3 = new Line(p5, 0, 25, cellSize, 25, 6, c);
  let lineThick4 = new Line(p5, 0, 35, cellSize, 35, 6, c);

  let lineThick5 = new Line(p5, 75, 0, 75, cellSize, 4, c);
  let lineThick6 = new Line(p5, 60, 0, 60, cellSize, 4, c);
  let lineThick7 = new Line(p5, 0, 75, cellSize, 75, 6, c);
  let lineThick8 = new Line(p5, 0, 60, cellSize, 60, 6, c);

  lineThick1.display(p5);
  lineThick2.display(p5);
  //lineThick3.display(p5);
  //lineThick4.display(p5);

  //lineThick5.display(p5);
  //lineThick6.display(p5);
  lineThick7.display(p5);
  lineThick8.display(p5);


}

function chevron(p5) {

  //if I'm being honest, I made this one accidentally but I think
  //it looks so cool

  p5.noStroke();
  p5.square(0, 0, cellSize);

  //randomizes rgb color! uses for line and polkadot colors
  const c = p5.color(p5.random(255), p5.random(255), p5.random(255));

  let quad1 = new Quad(p5, 0, 0, 50, 60, 50, 75, 0, 15, c);
  let quad2 = new Quad(p5, 50, 60, cellSize, 0, cellSize, 15, 50, 75, c);

  let quad3 = new Quad(p5, 0, cellSize, 50, cellSize - 60, 50, cellSize - 75, 0, cellSize - 15, c);
  let quad4 = new Quad(p5, 50, cellSize - 60, cellSize, cellSize, cellSize, cellSize - 15, 50, cellSize - 75, c);

  quad3.display(p5);
  quad4.display(p5);

  let scale = 10;

  for(i = 0; i < 75; i++) {

    if (i % 2) {
      quad1.color = 'white';
      quad2.color = 'white';
    } else {
      quad1.color = c;
      quad2.color = c;
    }


    quad1.position1.y += i * scale;
    quad1.position2.y += i * scale;
    quad1.position3.y += i * scale;
    quad1.position4.y += i * scale;

    quad2.position1.y += i * scale;
    quad2.position2.y += i * scale;
    quad2.position3.y += i * scale;
    quad2.position4.y += i * scale;


    quad3.position1.y -= i * scale;
    quad3.position2.y -= i * scale;
    quad3.position3.y -= i * scale;
    quad3.position4.y -= i * scale;

    quad4.position1.y -= i * scale;
    quad4.position2.y -= i * scale;
    quad4.position3.y -= i * scale;
    quad4.position4.y -= i * scale;


    //switched the display order so they interlock!
    quad1.display(p5);
    quad3.display(p5);
    quad2.display(p5);
    quad4.display(p5);
  }


}

function harlequin(p5) {
  //p5.noStroke();
  p5.square(0, 0, cellSize);

  //randomizes rgb color! uses for line and polkadot colors
  const c1 = p5.color(p5.random(255), p5.random(255), p5.random(255));
  const c2 = p5.color(p5.random(255), p5.random(255), p5.random(255));
  const c3 = p5.color(p5.random(255), p5.random(255), p5.random(255));
  const c4 = p5.color(p5.random(255), p5.random(255), p5.random(255));
  const c5 = p5.color(p5.random(255), p5.random(255), p5.random(255));
  const c6 = p5.color(p5.random(255), p5.random(255), p5.random(255));

  let quad1 = new Quad(p5, cellSize / 2, 0, cellSize, cellSize/2, cellSize/2, cellSize, 0, cellSize/2, c1);

  p5.strokeWeight(0);
  let tri1 = new Triangle(p5, cellSize, cellSize/2, cellSize, cellSize, cellSize/2, cellSize, c2)
  let tri2 = new Triangle(p5, cellSize - cellSize, cellSize/2, cellSize - cellSize, cellSize, cellSize - cellSize/2, cellSize, c3)
  let tri3 = new Triangle(p5, cellSize, cellSize - cellSize/2, cellSize, cellSize - cellSize, cellSize/2, cellSize - cellSize, c4)
  let tri4 = new Triangle(p5, cellSize - cellSize, cellSize - cellSize/2, cellSize - cellSize, cellSize - cellSize, cellSize - cellSize/2, cellSize - cellSize, c5)

  let tri5 = new Triangle(p5, cellSize/2, cellSize/2, cellSize, cellSize, 0, cellSize, c6);
  let tri6 = new Triangle(p5, cellSize/2, cellSize - cellSize/2, cellSize, cellSize - cellSize, 0, cellSize - cellSize, c6)


  quad1.display(p5);
  tri1.display(p5);
  tri2.display(p5);
  tri3.display(p5);
  tri4.display(p5);
  tri5.display(p5);
  tri6.display(p5);
}

function argyle(p5) {
  p5.fill(0);
  p5.square(0, 0, cellSize);

  //p5.noStroke();
  p5.square(0, 0, cellSize);

  //randomizes rgb color! uses for line and polkadot colors
  const c1 = p5.color(p5.random(255), p5.random(255), p5.random(255));
  const c2 = p5.color(p5.random(255), p5.random(255), p5.random(255));
  const c3 = p5.color(p5.random(255), p5.random(255), p5.random(255));
  const c4 = p5.color(p5.random(255), p5.random(255), p5.random(255));
  const c5 = p5.color(p5.random(255), p5.random(255), p5.random(255));
  const c6 = p5.color(p5.random(255), p5.random(255), p5.random(255));

  let quad1 = new Quad(p5, cellSize / 2, 0, cellSize, cellSize/2, cellSize/2, cellSize, 0, cellSize/2, c1);

  p5.strokeWeight(0);

  let tri5 = new Triangle(p5, cellSize/2, cellSize/2, cellSize, cellSize, 0, cellSize, c6);
  let tri6 = new Triangle(p5, cellSize/2, cellSize - cellSize/2, cellSize, cellSize - cellSize, 0, cellSize - cellSize, c6)

  let line1 = new Line(p5, 0, 0, cellSize, cellSize, 3, 255);
  let line2 = new Line(p5, cellSize, 0, 0, cellSize, 3, 255);
  let line3 = new Line(p5, cellSize, 0, cellSize, cellSize, 3, 255);
  let line4 = new Line(p5, 0, 0, 0, cellSize, 3, 255);

  let line5 = new Line(p5, cellSize, cellSize/2, cellSize/2, cellSize, 1, 255);
  let line6 = new Line(p5, 0, cellSize/2, cellSize/2, cellSize, 1, 255);

  let line7 = new Line(p5, cellSize, cellSize/2, cellSize/2, 0, 1, 255);
  let line8 = new Line(p5, 0, cellSize/2, cellSize/2, 0, 1, 255);


  quad1.display(p5);
  tri5.display(p5);
  tri6.display(p5);
  line1.display(p5);
  line2.display(p5);
  line3.display(p5);
  line4.display(p5);
  line5.display(p5);
  line6.display(p5);
  line7.display(p5);
  line8.display(p5);
}


function honeycomb(p5) {
  p5.fill('black');
  p5.square(0, 0, cellSize);


  for(i = 0; i < 10; i++) {
    hexagons[i] = new Hexagon(p5, cellSize/2, cellSize/2, 25, 0);
  }


  for(let k = 0; k < hexagons.length; k++) {
    hexagons[k].position.x = cellSize-50;
    hexagons[k].position.y = cellSize-50;

    hexagons[k].position.x += k * 1;
    hexagons[k].position.y += k * 2;
    hexagons[k].size *= k * 0.2;
    hexagons[k].color = 'yellow';
    hexagons[k].display(p5);
  }




  for(let j = 0; j < hexagons.length; j++) {
    hexagons[j].position.x = cellSize/2;
    hexagons[j].position.y = cellSize/2;

    hexagons[j].position.x += j * 1;
    hexagons[j].position.y += j * 2;
    hexagons[j].size += j * 2;
    hexagons[j].color = 'blue';
    hexagons[j].display(p5);
  }


  for(let m = 0; m < hexagons.length; m++) {
    hexagons[m].position.x = 0;
    hexagons[m].position.y = 0;

    hexagons[m].position.x += m * 1;
    hexagons[m].position.y += m * 2;
    hexagons[m].size += j * 2;
    hexagons[m].color = 'red';
    hexagons[m].display(p5);
  }

}


//////////////////////////////////////////////////
// These two swatches are optional.

function floral(p5) {
  p5.square(0, 0, cellSize);
}

function paisley(p5) {
  p5.square(0, 0, cellSize);
}

//Circle class allows us to draw a circle at any x, y 
//with any size and color. Contains display() for drawing
//circle() is set to noStroke(); 
class Circle {
  constructor(p5, x, y, size, color) {
    this.position = new p5.createVector(x, y);
    this.size = size;
    this.color = color;
  }

  display(p5) {
    p5.noStroke();
    p5.fill(this.color);
    p5.circle(this.position.x, this.position.y, this.size);
  }
}

class Square {
  constructor(p5, x, y, size, color) {
    this.position = new p5.createVector(x, y);
    this.size = size;
    this.color = color;
  }

  display(p5) {
    p5.noStroke();
    p5.fill(this.color);
    p5.square(this.position.x, this.position.y, this.size);
  }
}

class Quad {
  constructor(p5, x1, y1, x2, y2, x3, y3, x4, y4, color) {
    this.position1 = new p5.createVector(x1, y1);
    this.position2 = new p5.createVector(x2, y2);
    this.position3 = new p5.createVector(x3, y3);
    this.position4 = new p5.createVector(x4, y4);
    this.color = color;
  }

  display(p5) {
    p5.stroke(0);
    p5.fill(this.color);
    p5.quad(
      this.position1.x, this.position1.y, 
      this.position2.x, this.position2.y,
      this.position3.x, this.position3.y,
      this.position4.x, this.position4.y
    );
  }
}

class Triangle {
  constructor(p5, x1, y1, x2, y2, x3, y3, color) {
    this.position1 = new p5.createVector(x1, y1);
    this.position2 = new p5.createVector(x2, y2);
    this.position3 = new p5.createVector(x3, y3);
    this.color = color;
  }

  display(p5) {
    p5.stroke(0);
    p5.fill(this.color);
    p5.triangle(
      this.position1.x, this.position1.y, 
      this.position2.x, this.position2.y,
      this.position3.x, this.position3.y
    );
  }
}

class Line {
  constructor(p5, x1, y1, x2, y2, strokeWeight, color) {
    this.start = new p5.createVector(x1, y1);
    this.end = new p5.createVector(x2, y2);
    this.thickness = strokeWeight;
    this.color = color;
  }

  display(p5) {
    p5.stroke(this.color);
    p5.strokeWeight(this.thickness);
    p5.line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}

//makeHex makes a hexagon out of lines
function makeHex (p5, r, i) {
  let angle = 360 / n;
  //draws i-th line 
  if (i > 0 && i <= n) {
    p5.line(
      r * p5.cos(p5.radians(i * angle)),
      r * p5.sin(p5.radians(i * angle)),
      r * p5.cos(p5.radians((i + 1) * angle)),
      r * p5.sin(p5.radians((i + 1) * angle))
    );

    i++;

    makeHex(p5, r, i);
  }

  //resets color values 
  p5.noStroke();
}




class Hexagon {
  constructor(p5, x, y, size, color) {
    this.position = new p5.createVector(x,y);
    this.size = size;
    this.color = color;
  }

  display(p5) {
    p5.stroke(this.color);
    p5.push();
    p5.translate(this.position.x, this.position.y);
    makeHex(p5, this.size, 1);
    p5.pop();
  }
} 
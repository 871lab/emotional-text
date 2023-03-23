let letter = []
let font
let fontSize = 200
let fontPath
let gpath
let res = 10
let lineCount = 10
let density = 5

let sliderValence
let sliderArousal
let test
let textTyped = ' '

function preload() {
  opentype.load('fonts/rotesk.otf', function (err, f) {
    if (err) {
      console.log(err);
    } else {
      font = f;
    }
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  stroke(240)
  strokeWeight(3)
  noFill()
  angleMode(DEGREES)


  sliderValence = createSlider(-1, 1, 0, 0.01)
  sliderValence.addClass('slider')
  sliderValence.position(20, 20)
  sliderValence.style('width', '300px')

  sliderArousal = createSlider(-1, 1, 0, 0.01)
  sliderArousal.addClass('slider')
  sliderArousal.position(20, 60)
  sliderArousal.style('width', '300px')

}

function draw() {
  background(0)

  let valence = sliderValence.value()
  let arousal = sliderArousal.value()

  let layer = map(arousal, -1, 1, 1, 6)
  let shiftRange = map(arousal, -1, 1, 0, 15)
  let shearAngle = map(valence, -1, 1, 10, -10)
  let sampleRate = map(arousal, -1, 1, 30, 5)



  if (textTyped.length > 0 && font != undefined) {
    fontPath = font.getPath(textTyped, 0, 0, fontSize);
    gpath = new g.Path(fontPath.commands);
    gpath = g.resampleByLength(gpath, sampleRate);
  }



  /* 
  showSample()
  
  showShift(shiftRange)
  
  drawLines(layer)

  shearY(shearAngle)

  rect(-100, 100, 750, -350)

  */
  
  translate(300,height/2)
  shearY(shearAngle)
  multiPath(layer, shiftRange)





}

function drawLines(layer){
  push()
  for(let i =0; i< layer;i++){
    translate(4,0)
    ellipse(0,0,100+8*i)
    
  }
  pop()
}
function showPoints() {
  for (let i = 0; i < gpath.commands.length - 1; i++) {
    let pnt = gpath.commands[i]
    if (pnt.type != 'Z')
      point(pnt.x, pnt.y)
  }
}

function showSample() {
  for (let i = 0; i < gpath.commands.length; i++) {
    let pnt = gpath.commands[i]

    switch (pnt.type) {
      case 'M':
        beginShape()
        push()
        strokeWeight(12)
        stroke('red')
        //point(pnt.x, pnt.y)
        curveVertex(pnt.x, pnt.y)
        curveVertex(pnt.x, pnt.y)
        pop()
        break
      case 'L':
        curveVertex(pnt.x, pnt.y)
        break
      case 'Z':
        endShape(CLOSE)
        break
      default:
        break;
    }

  }
}
function showShift(shiftrange) {
  for (let i = 0; i < gpath.commands.length; i++) {
    let pnt = gpath.commands[i]
    let nextPnt = gpath.commands[i + 1];

    switch (pnt.type) {
      case 'M':
        beginShape()
        push()
        strokeWeight(12)
        stroke('red')
        //oint(pnt.x, pnt.y)
        curveVertex(pnt.x, pnt.y)
        curveVertex(pnt.x, pnt.y)
        pop()
        break
      case 'L':
        if (nextPnt.type == 'L') {
          let p0 = createVector(pnt.x, pnt.y);
          let p1 = createVector(nextPnt.x, nextPnt.y);
          let pm = p0.add(p1)
          pm.div(2)
          let poff = (noise(i) * 2 - 1) * shiftrange

          let v = p5.Vector.sub(p1, p0);
          v.normalize();
          v.rotate(90);
          v.mult(poff);
          let pneu = p5.Vector.add(p0, v);
          //ellipse(p0.x,p0.y,10)

          curveVertex(pneu.x, pneu.y);
        }
        break
      case 'Z':
        endShape(CLOSE)
        break
      default:
        break;
    }

  }
}


function multiPath(layer, shiftrange) {
  for (let j = 0; j < layer; j += 1) {
    let d = j * density

    for (let i = 0; i < gpath.commands.length; i++) {

      let pnt = gpath.commands[i];
      let nextPnt = gpath.commands[i + 1];
      switch (pnt.type) {
        case 'M':
          beginShape()
          push()
          strokeWeight(12)
          stroke('red')
          //point(pnt.x, pnt.y)
          pop()
          curveVertex(pnt.x, pnt.y)
          curveVertex(pnt.x, pnt.y)
          break
        case 'L':
          if (nextPnt.type == 'L') {
            let p0 = createVector(pnt.x, pnt.y);
            let p1 = createVector(nextPnt.x, nextPnt.y);
            let pm = p0.add(p1)
            pm.div(2)
            let poff = (noise(i) * 2 - 1) * shiftrange

            let v = p5.Vector.sub(p1, p0);
            v.normalize();
            v.rotate(90);
            v.mult(d + poff);
            let pneu = p5.Vector.add(p0, v);
            //ellipse(p0.x,p0.y,10)

            curveVertex(pneu.x, pneu.y);
          }
          break
        case 'Z':
          endShape(CLOSE)
          break
        default:
          break;
      }

    }

    endShape(CLOSE);
  }
}

function keyTyped() {
  if (keyCode >= 32) {
    textTyped += key;
  }
}

function keyPressed() {
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    if (textTyped.length > 0) {
      textTyped = textTyped.substring(0, textTyped.length - 1);
    }
  }
}
// P_2_2_3_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * form mophing process by connected random agents
 *
 * MOUSE
 * click               : start a new circe
 * position x/y        : direction of floating
 *
 * KEYS
 * 1-2                 : fill styles
 * f                   : freeze. loop on/off
 * Delete/Backspace    : clear display
 * s                   : save png
 */
'use strict';

var formResolution = 5;
var stepSize = 7;
var distortionFactor = 1;
var initRadius = 100;
var centerX;
var centerY;
var x = [];
var y = [];
var speed = 1;


var sizer = 10;
var sizerDirection = -1;

var filled = false;
var freeze = false;
var indicate = false;

var strokeS;
var strokeE;
var lerp = 0.33;

let count = 1, countScale = 1, topLimit = 100, bottomLimit = 0;

// var ssss;

function setup() {
  createCanvas(windowWidth, windowHeight);


  strokeS = color(255, 0, 0);
  strokeE = color(0, 0, 139);

  // init shape
  centerX = width / 2;
  centerY = height / 2;
  var angle = radians(360 / formResolution);
  for (var i = 0; i < formResolution; i++) {
    x.push(cos(angle * i) * initRadius);
    y.push(sin(angle * i) * initRadius);
  }

  stroke(0, 50);
  strokeWeight(0.75);
  background(255);
}

function draw() {

  stroke( lerpColor(strokeS, strokeE, pingpong()/topLimit) );
  warnick_colorIndicator();
  warnick_calculate();

  if (filled) {
    fill(random(255));
  } else {
    noFill();
  }

  warnick_shape();
}

function mousePressed() {
  // init shape on mouse position
  centerX = mouseX;
  centerY = mouseY;
  var angle = radians(360 / formResolution);
  var radius = initRadius * random(0.5, 1);
  for (var i = 0; i < formResolution; i++) {
    x[i] = cos(angle * i) * initRadius;
    y[i] = sin(angle * i) * initRadius;
  }
}

function keyReleased() {
  // if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (keyCode == DELETE || keyCode == BACKSPACE) background(255);
  if (key == '1') filled = false;
  if (key == '2') filled = true;
  if (key == 'i' || key == 'I') indicate = !indicate;

  if (key == 'a' || key == 'A') (speed > 0) ? speed += -1 : speed = 1;

  if (key == 's' || key == 'S') (speed < 10) ? speed += 1 : speed = 10;
 
  // if (key == '3') strokeC = 

  // pauze/play draw loop
  if (key == 'f' || key == 'F') freeze = !freeze;
  if (freeze) {
    noLoop();
  } else {
    loop();
  }
}


function pingpong(){
  if (count >= topLimit || count <= bottomLimit){
    countScale = countScale * -1;
  }
  count = count + countScale;
  return count;
} 

function warnick_distance(){

}

function warnick_colorIndicator(){
  strokeWeight(10);
  rect(0, 0, 1, 1);

  strokeWeight(1);
}

function warnick_calculate(){
  // floating towards mouse position
  centerX += (mouseX - centerX) * (speed/10);
  centerY += (mouseY - centerY) * (speed/10);
  // uncomment the following line to show position of center point
  ellipse(centerX, centerY, 5, 5);

  // calculate new points
  for (var i = 0; i < formResolution; i++) {
    x[i] += random(-stepSize, stepSize);
    y[i] += random(-stepSize, stepSize);
    // uncomment the following line to show position of the agents
    // ellipse(x[i] + centerX, y[i] + centerY, 5, 5);
  }
}


function warnick_shape(){
  beginShape();
  // first controlpoint
  curveVertex(x[formResolution - 1] + centerX, y[formResolution - 1] + centerY);

  // only these points are drawn
  for (var i = 0; i < formResolution; i++) {
    curveVertex(x[i] + centerX, y[i] + centerY);
  }
  curveVertex(x[0] + centerX, y[0] + centerY);

  // end controlpoint
  curveVertex(x[1] + centerX, y[1] + centerY);
  endShape();
}
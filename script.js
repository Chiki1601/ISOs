var sketchProc = function(processingInstance) {
  with (processingInstance) {
    size(600, 600); 
    frameRate(60);

    var Iso = function(args) {
      this.x = args.x;
      this.y = args.y;
      this.w = args.w;
      this.h = args.h;
      this.d = args.d || this.w;
      this.color = args.color || color(107, 191, 227);
      this.timer = args.timer || 0;
      this.delay = args.delay || 0;
      this.speed = args.speed || 3;
      this.amplitude = args.amplitude || 5;
      this.sin = 0;
      this.perspective = 0.3;
      this.offset = this.w * this.perspective;
    };
    Iso.prototype = {
        draw: function() {
            pushMatrix();
                translate(this.x , this.y);

                noStroke();

                //front
                fill(this.color);
                quad(   0, 0,
                        this.w, -this.offset,
                        this.w, -this.h - this.offset,
                        0, -this.h);

                //side
                fill(this.color);
                quad(   0, 0,
                        -this.d, -this.offset,
                        -this.d, -this.h - this.offset,
                        0, -this.h);
                fill(0, 30);
                quad(   0, 0,
                        -this.d, -this.offset,
                        -this.d, -this.h - this.offset,
                        0, -this.h);

                //top
                fill(this.color);
                quad(   0, -this.h,
                        this.w, -this.h -this.offset,
                        0, -this.h -this.offset  * 2,
                        -this.d, -this.h -this.offset);
                fill(255, 50);
                quad(   0, -this.h,
                        this.w, -this.h -this.offset,
                        0, -this.h -this.offset * 2,
                        -this.d, -this.h -this.offset);

                //eyes
                if(this.sin > -0.8) {
                    fill(40);
                    ellipse(this.w * 0.2, -this.h + this.offset / 2, this.w * 0.15, this.w * 0.15);
                    ellipse(this.w * 0.8, -this.h, this.w * 0.15, this.w * 0.15);
                }
                else {
                    strokeWeight(1);
                    stroke(40);
                    noFill();
                    arc(this.w * 0.2, -this.h + this.offset / 2, this.w * 0.15, this.w * 0.1, radians(180 - this.offset), radians(360 - this.offset * 2));
                    arc(this.w * 0.8, -this.h, this.w * 0.15, this.w * 0.1, radians(180 - this.offset), radians(360 - this.offset * 2));
                }

                //mouth
                if(this.sin > 0) {
                    noStroke();
                    fill(40);
                    arc(this.w * 0.55, -this.h + this.w * 0.2, this.w * 0.2, this.w * 0.25, radians(-this.offset / 2), radians(180 - this.offset));
                }
                else {
                    noStroke();
                    fill(40);
                    ellipse(this.w * 0.55, -this.h + this.w * 0.22, this.w * 0.15, this.w * 0.15);
                }
            popMatrix();
        },
        update: function() {
            if(this.delay-- <= 0) {
                this.timer+= 0.02;
                this.sin = sin(this.timer * this.speed) * this.amplitude;
                this.h+= this.sin;
            }
        },
        go: function() {
            this.draw();
            this.update();
        }
    };

    var Scene = function() {
        this.isos = [];
        this.bg = undefined;

        this.init = function() {
            for(var i = 0; i < 5; i++) {
                this.isos.push(new Iso({
                    x: 205 + 70 * i, 
                    y: 545 - 20 * i, 
                    w: 50,
                    h: 100, 
                    delay: 10 * i,
                    color: color(random(100, 220), random(100, 220), random(100, 220))
                }));
            }
            for(var i = 0; i < 5; i++) {
                this.isos.push(new Iso({
                    x: 110 + 85 * i, 
                    y: 510 - 20 * i, 
                    w: 70,
                    h: 150, 
                    delay: 25 + 10 * i,
                    color: color(random(100, 220), random(100, 220), random(100, 220))
                }));
            }

            noStroke();
            for(var i = 0; i <= 600; i++) { 
                fill(lerpColor(color(69, 181, 181), color(19, 87, 87), i/600));
                rect(0, i, 600, 1);
            }
            this.bg = get();
        };
        this.init();

        this.changeColors = function() {
            for(var i = this.isos.length - 1; i >= 0; i--) {
                this.isos[i].color = color(random(100, 220), random(100, 220), random(100, 220));
            }
        };
        this.go = function() {
            background(69, 181, 181);

            image(this.bg, 0, 0);

            for(var i = this.isos.length - 1; i >= 0; i--) {
                this.isos[i].go();
            }
        };
    };

    var scene = new Scene();

    draw = function() {
        scene.go();
    };

    mouseClicked = function() {
        scene.changeColors();  
    };
  }
}

var canvas = document.getElementById("canvas"); 
var processingInstance = new Processing(canvas, sketchProc);
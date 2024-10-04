class QuizMenu{
    constructor(qz=null){
        this.qz = qz;
        this.selected = 0;
        this.qTmr;
    }

    async getQuiz(){
        if(timer.isOver("newQ") && !this.qz){
            qThis = await getAPI("/quiz");
            this.qz = qThis;
            this.qTmr = timer.setTimer("newQ", 2000);
            this.selected = 0;
        }
    }
    show(){
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
        stroke(0, 255, 255);

        push();
        strokeWeight(ps(0.5));
        noFill();
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 5;
        drawingContext.shadowColor = color(0, 255, 255);
        drawingContext.setLineDash([ps(5), ps(20)]);
        rect(px(50), py(50), ps(94), ps(94), ps(7));
        pop();

        noStroke();
        fill(50, 170, 170, 200);
        rect(px(50), py(50), ps(90), ps(90), ps(5));

        textSize(ps(5));
        fill(255, 255, 255);
        text(this.qz.question, px(50), py(20), ps(80), ps(30));

        for(let i=0; i<this.qz.options.length; i++){
            let opt = this.qz.options[i];
            if(i == this.selected){
                fill(0, 255, 100);
                noStroke();
            }else{
                noFill();
                stroke(0, 255, 100);
                strokeWeight(ps(0.5));
            }
            rect(px(50), py(46 + i*12), ps(75), ps(10), ps(2));
            noStroke();
            fill(255, 255, 255);
            textSize(ps(3));
            text(opt, px(50), py(46 + i*12), ps(80), ps(10));
        }
    }

    async update(inp, sel){
        if(timer.isOver("qInp")){
            if(inp > 0.5){
                this.selected += 1;
                timer.setTimer("qInp", 500);
            }else if(inp < -0.5){
                this.selected -= 1;
                timer.setTimer("qInp", 500);
            }
            if(this.selected > this.qz.options.length-1) this.selected = 0;
            if(this.selected < 0) this.selected = this.qz.options.length-1;
        }
        if(sel){
            let corr = await getAPI(`quiz/${this.qz.id}/${this.selected}`);
            this.qz = null;
            player.unFreeze();
        }
    }
}

function px(x){
    let bgn = width/2 - Math.min(width, height)/2;
    let end = width/2 + Math.min(width, height)/2;
    let W = end - bgn;
    let sclr = W/100;
    return bgn + x*sclr; 
}

function py(y){
    let bgn = height/2 - Math.min(width, height)/2;
    let end = height/2 + Math.min(width, height)/2;
    let H = end - bgn;
    let sclr = H/100;
    return bgn + y*sclr;
}

function ps(s){
    let sz = Math.min(width, height);
    let sclr = sz/100;
    return s*sclr;
}
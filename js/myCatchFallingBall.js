//全局变量
var isGameStarted=true;
var basketColor='#85CE61';
var basketW=200;
var basketH=30;
var ballColor1='#85CE61';
var ballColor2='#F78989';
var ballColor3='#66B1FF';
var bombColor='black'
var ballR1=30;
var ballR2=20;
var ballR3=10;
var bombR=15;
var speed1=150;
var speed2=200;
var speed3=250;
var bombSpeed=150;
var disappearLine=770;
var ballMakerTimer=null;
var bombMakerTimer=null;
var rangeL=0;
var rangeR=200;
var score=0
var totalScore=0
//获取canvas
var cvs=document.getElementById('myChart');
var ctx=cvs.getContext('2d')

//初始化接篮
ctx.clearRect(0,770,700,30)
ctx.fillStyle=basketColor
ctx.fillRect(0,770, basketW, basketH);


var ballCvs=document.getElementById('ballChart');
var bCtx=ballCvs.getContext('2d')

var bombCvs=document.getElementById('bombChart')
var bombCtx=bombCvs.getContext('2d')

//点击myChart画布事件监听
cvs.addEventListener('click',function (e) {
    var pos=getEventPosition(e);
    //根据位置绘制底部接篮
    if(pos.y>=600){
        drawBasket(pos)
    }

})


//开始游戏函数
function startGame() {
    if(isGameStarted){
    ballMaker()
    //循环调用产生球
    clearInterval(ballMakerTimer)
    ballMakerTimer = null;
    ballMakerTimer = setInterval(function () {
        ballMaker()
    }, 1500)
    //循环生成炸弹
    clearInterval(bombMakerTimer)
    bombMakerTimer = null;
    bombMakerTimer = setInterval(function () {
        bombMaker()
    }, 7500)
}
isGameStarted=false;
}
//重置游戏函数
function resetGame() {
    //清除timer
    clearInterval(ballMakerTimer)
    ballMakerTimer=null;

    clearInterval(bombMakerTimer)
    bombMakerTimer=null;
    //初始化接篮
    ctx.clearRect(0,770,700,30)
    ctx.fillStyle=basketColor
    ctx.fillRect(0,770, basketW, basketH);
    ctx.clearRect(0,0,700,500)
    //还原数据
    score=0
    totalScore=0
    $('.score').html('得分:0000')
    //如果有关闭gameover
    if($('.gameOver').show){
        $('.gameOver').removeClass('show');
    }

    isGameStarted=true;

}


//嵌套使用函数  下
//获取画布上位置的函数
function getEventPosition(ev){
    var x, y;
    if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        x = ev.offsetX;
        y = ev.offsetY;
    }
    return {x: x, y: y};
}
//绘制底部接篮的函数
function drawBasket(pos) {
    ctx.clearRect(0,770,700,30)
    ctx.fillStyle=basketColor
    var x=pos.x;
    var y=770
    if(x>550){
        x=550
    }
    //记录接篮范围
    rangeL=x;
    rangeR=x+200
    //绘制接篮
    ctx.fillRect(x,y, basketW, basketH);
}
//产生球并下降的函数
function ballMaker() {
    //获取6个球的随机圆心位置
    var ballPosArray=[];
    for(var i=0;i<6;i++){
        var obj={};
        var x=Math.round(Math.random()*(670-30)+30);
        var y=Math.round(Math.random()*(270-30)+30);
        obj.x=x;
        obj.y=y;
        ballPosArray.push(obj)
    }
    //初始化六个球
    drawBall(ballPosArray)
    //随着时间推移球向下掉落
    var count=0
    var drawBallTimer=setInterval(function () {
        if(count>5){
            clearInterval(drawBallTimer)
            drawBallTimer=null
            return
        }
        ballPosArray[0].y+=speed1;
        ballPosArray[1].y+=speed1;
        ballPosArray[2].y+=speed1;
        ballPosArray[3].y+=speed2;
        ballPosArray[4].y+=speed2;
        ballPosArray[5].y+=speed3;
        if(ballPosArray[0].y-disappearLine>=10&&ballPosArray[0].y-disappearLine<=100){
            ballPosArray[0].y=disappearLine
            //检验其是否在接篮范围类
            isInsideBasket(ballPosArray[0].x,2,ballR1)
        }
        if(ballPosArray[1].y-disappearLine>=10&&ballPosArray[1].y-disappearLine<=100){
            ballPosArray[1].y=disappearLine
            //检验其是否在接篮范围类
            isInsideBasket(ballPosArray[1].x,2,ballR1)
        }
        if(ballPosArray[2].y-disappearLine>=10&&ballPosArray[2].y-disappearLine<=100){
            ballPosArray[2].y=disappearLine
            //检验其是否在接篮范围类
            isInsideBasket(ballPosArray[2].x,2,ballR1)
        }
        if(ballPosArray[3].y-disappearLine>=0&&ballPosArray[3].y-disappearLine<=60){
            ballPosArray[3].y=disappearLine
            //检验其是否在接篮范围类
            isInsideBasket(ballPosArray[3].x,5,ballR2)
        }
        if(ballPosArray[4].y-disappearLine>=0&&ballPosArray[4].y-disappearLine<=60){
            ballPosArray[4].y=disappearLine
            //检验其是否在接篮范围类
            isInsideBasket(ballPosArray[4].x,5,ballR2)
        }
        if(ballPosArray[5].y-disappearLine>=0&&ballPosArray[5].y-disappearLine<=180){
            ballPosArray[5].y=disappearLine
            //检验其是否在接篮范围类
            isInsideBasket(ballPosArray[5].x,8,ballR3)
        }
        drawBall(ballPosArray)
        //在展示得分情况
        if(score>0){

             if(score<6){
                 var color=ballColor1
             }else if(score<12){
                 var color=ballColor2
             }else{
                 var color=ballColor3
            }


            totalScore+=score;
            var html='得分:'+totalScore
            $('.score').html(html)
            score=0;
        }

        count++
    },280)

}
//每次绘制球的函数
function drawBall(ballPosArray) {
    //清空一次画布
    bCtx.clearRect(0,0,700,800)
    bCtx.beginPath();
    if(ballPosArray[0].y<=disappearLine) {
        bCtx.arc(ballPosArray[0].x, ballPosArray[0].y, ballR1, 0, 360, false);
    }
    if(ballPosArray[1].y<=disappearLine) {
        bCtx.arc(ballPosArray[1].x, ballPosArray[1].y, ballR1, 0, 360, false);
    }
    bCtx.fillStyle=ballColor1;
    bCtx.fill();
    bCtx.closePath()

    bCtx.beginPath();
    if(ballPosArray[2].y<=disappearLine) {
        bCtx.arc(ballPosArray[2].x, ballPosArray[2].y, ballR1, 0, 360, false);
    }
    bCtx.fillStyle=ballColor1;
    bCtx.fill();
    bCtx.closePath()

    bCtx.beginPath();
    if(ballPosArray[3].y<=disappearLine){
        bCtx.arc(ballPosArray[3].x,ballPosArray[3].y,ballR2,0,360,false);
    }
   if(ballPosArray[4].y<=disappearLine){
        bCtx.arc(ballPosArray[4].x,ballPosArray[4].y,ballR2,0,360,false);
    }
    bCtx.fillStyle=ballColor2;
    bCtx.fill();
    bCtx.closePath()

    bCtx.beginPath();
    if(ballPosArray[5].y<=disappearLine){
        bCtx.arc(ballPosArray[5].x,ballPosArray[5].y,ballR3,0,360,false);
    }
    bCtx.fillStyle=ballColor3;
    bCtx.fill();
    bCtx.closePath()
}
//判断是否在接篮内的函数
function isInsideBasket(x,parScore,r) {
    if(x>=(rangeL-r)&&x<=(rangeR+r)){
        if(parScore!=null){
            score+=parScore
        }else{
            //接着炸弹了
             //清除timer
            clearInterval(ballMakerTimer)
            ballMakerTimer=null;

            clearInterval(bombMakerTimer)
            bombMakerTimer=null;
            //弹出得分情况
            $('.finalScore').html('得分:'+totalScore);
            $('.gameOver').addClass('show');
        }

    }
}
//生成炸弹的函数
function bombMaker() {
    //随机获取炸弹x坐标
    var obj={};
    var x=Math.round(Math.random()*(670-30)+30);
    obj.x=x;
    obj.y=170;
    drawBomb(obj)

    var count=0
    var drawBombTimer=setInterval(function () {
        if(count>4){
            clearInterval(drawBombTimer)
            drawBombTimer=null
            return
        }
        obj.y+=150;
        drawBomb(obj);
        if(obj.y==disappearLine){
            isInsideBasket(obj.x,null,bombR)
        }
        count++;
},280)
}
function drawBomb(obj) {
    //清空一次画布
    bombCtx.clearRect(0,0,700,800)
    bombCtx.beginPath();
    if(obj.y<=disappearLine) {
        bombCtx.arc(obj.x, obj.y, bombR, 0, 360, false);
    }
    bombCtx.fillStyle=bombColor;
    bombCtx.fill();
    bombCtx.closePath()
}
//嵌套使用函数  上


var px=py=10;
var gs=mt=20; //scale the game to 400x400
var ft=gs-1; //possibility where fruit could appear on. On a 400x400 space it is 19 (20-1)
var ax=ay=15;
var xv=yv=0;
var trail=[];
var tail = 5;
var timeRef;
var defaultDiff = 145;
var canv;
var ctx;
var up = 1;
var down = -1;
var left = -1;
var right = 1;
var consumed = 0;

//var counter;


function loadgame() {
    //initialise canvas and event listener
    canv=document.getElementById("gcanvas");
    ctx=canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    timeRef = setInterval(game, defaultDiff);    

}


function game() {
    //paint the canvas
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);
    
	px+=xv;
    py+=yv;
    
    //allows the snake to pass through edges of the map
	if(px<0) {
		px= mt-1;
	}
	if(px>mt-1) {
		px= 0;
	}
	if(py<0) {
		py= mt-1;
	}
	if(py>mt-1) {
		py= 0;
	}

    //draws the snake
    ctx.fillStyle = "lime"
    for(var i=0;i<trail.length;i++) {
        ctx.fillStyle = "lime";
        //additional code just to see the consumed fruit
        // if (i < 5) {
        //     ctx.fillStyle="lime";
        // } else
        // {
        //     ctx.fillStyle="red";
        // }
        ctx.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
        if(trail[i].x==px && trail[i].y==py) {
            tail = 5;
            //reset consumption counter
            consumed = 0;
            clearInterval(timeRef)
            timeRef = setInterval(game, defaultDiff);
        }
    }
    
    
    //snake takes location
    trail.push({x:px,y:py});
    //remove tail as we move forward
	while(trail.length>tail) {
        trail.shift();
	}

	if(ax==px && ay==py) {
        consumed++;
        tail++;
        randomPlacement(ax, ay)
        if (consumed % 5 == 0) {
            //every 5 "fruits" consumed, increase difficulty.
            //future enhancement - different starting difficulties?
            clearInterval(timeRef)
            timeRef = setInterval(game, defaultDiff-10)
        }
	}
	ctx.fillStyle="red";
	ctx.fillRect(ax*gs,ay*gs,gs-2,gs-2);
}

//handle for randomness of fruit generation
//we want to randomise the fruit placement after each consumption
//and ensure it does not overlap with snake
function randomPlacement() {
    var cnt = 0;
    var strTmp ="";
    var arrTmp = [];
    ax=Math.floor(Math.random()*mt);
    tmp=trail.filter(find => find.x==ax)
    //if this ax has a trail, check to see if whole of ax is filled up
    if (tmp.length != 0) {
        //while the ax we land on is filled up with the snake's body
        while (tmp.length == mt ) {
            if (ax < ft) {
                ax++; //move right
                cnt++; //increment counter - if hits 
            } else {
                ax=0; //start from 0 once hit 20 - there is no more ax which has space
                cnt++
            }
            if (cnt <= ft) {
                tmp=trail.filter(find => find.x==ax);
            } else {
                throw new Error("You sir, won the internetz.")
            }
        }
        
        //1, get all figures concat into string, initialise array with split
        //2, append array individually as we move along
        //benchmark each method - My intuition tells me #2 is much slower.
        for(i=0;i<=ft;i++) {
            if (tmp.findIndex(find => find.y==i) == -1) {
                strTmp = strTmp +i+ "|"
            }
        }
        strTmp = strTmp.substring(0, strTmp.length-1)
        arrTmp = strTmp.split("|")
        ay = arrTmp[Math.floor(Math.random()*arrTmp.length)]
    } else {
        ay=Math.floor(Math.random()*mt);
    }
}

//handler for keyboard events
function keyPush(evt) {
	switch(evt.keyCode) {
        case 37:
            if (xv != right) {
                xv=left;yv=0;
            }
            break;
        case 38:
            if (yv != up) {
                xv=0;yv=down;
            }
            break;
        case 39:
            if (xv != left) {
                xv=right;yv=0;
            }
            break;
        case 40:
            if (yv != down) {
                xv=0;yv=up;
            }
            break;
	}
}

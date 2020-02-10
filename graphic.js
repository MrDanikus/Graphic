if (!Array.prototype.back){
    Array.prototype.back = function(){
        return this[this.length - 1];
    };
};

let canvas = document.createElement("canvas");
document.getElementById("canvas-holder").appendChild(canvas);
canvas.setAttribute("width", window.getComputedStyle(document.getElementById("canvas-holder")).width);
canvas.setAttribute("height", window.getComputedStyle(document.getElementById("canvas-holder")).height);
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;
let minp = 50;
let maxp = 100 + minp;
const lineColor = document.getElementById("canvas-holder").getAttribute("color");
const grad = ctx.createLinearGradient(0,0,0,height);
let delTime = 0;
grad.addColorStop(0,lineColor + "AA");
grad.addColorStop(1.0,lineColor+"44");

let drawer = {
	x:width - 50,
	y:0,
	draw: function(c = ctx){
		c.beginPath();
		c.strokeStyle = "#AAAAAAAA";
		c.lineWidth = 10;
		c.arc(Math.floor(this.x),Math.floor(this.y),7 + Math.abs(7*Math.sin(delTime*Math.PI/200)),0,Math.PI*2);
		c.stroke();
		c.beginPath();
		c.lineWidth = 6;
		c.fillStyle = lineColor;
		c.strokeStyle = "#FFFFFF";
		c.arc(Math.floor(this.x),Math.floor(this.y),7,0,Math.PI*2);
		c.fill();
		c.stroke();
		c.closePath();
	}
};
let pointArr = [];

const rand = (min,max) => Math.random()*(max-min) + min;

let dx = 100;
let delt = 0;
pointArr.push({x:0,y:minp});
for(let i = 1; i < width/dx+2; i++){
	pointArr.push({x:pointArr[i-1].x + dx,y:rand(Math.max(pointArr[i-1].y-(maxp-minp)/2,minp),Math.min(pointArr[i-1].y + (maxp-minp)/2,maxp))});
}



let interval = setInterval(function() {
	delTime++;
	delt++;
	if(delt == dx){
		//pointArr.push({x:pointArr.back().x + dx,y:rand(minp,maxp)});
		if(pointArr.back().x < width + dx)
		pointArr.push({x:pointArr.back().x + dx,y:rand(Math.max(pointArr.back().y-(maxp-minp)/2,minp),Math.min(pointArr.back().y + (maxp-minp)/2,maxp))});
		delt = 0;
		pointArr.shift();
	}
	pointArr.map((el) => el.x--);
	let pre = pointArr[0];
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.beginPath();// Beziers drawing start!
	ctx.fillStyle = grad;
	ctx.moveTo(pre.x,pre.y);
	ctx.strokeStyle = lineColor;
	ctx.lineWidth = 3;
	pointArr.map(function(el){
		ctx.bezierCurveTo(pre.x + dx/2,pre.y,el.x - dx/2,el.y,el.x,el.y);
		pre = el;
	});
	ctx.lineTo(pre.x,height+6);
	ctx.lineTo(0,height+6);
	ctx.stroke();
	ctx.fill(); // Beziers drawing end!
	ctx.closePath();

	

	


	ctx.clearRect(width-50, 0, 100 , canvas.height);
	
	

	let imgData = ctx.getImageData(width-51,0,1,height).data;
	//console.log(imgData);
	for(let i = 3; i < imgData.length; i+=4){
		if(imgData[i] != 0){
			drawer.y = Math.floor(i/4);
			break;
		}
	}
	
	drawer.draw.call(drawer);
	


},1000/40);



window.onresize = function(e){
	//canvas.width = window.innerWidth;
	//canvas.height = window.innerHeight;
	canvas.setAttribute("width", window.getComputedStyle(document.getElementById("canvas-holder")).width);
	canvas.setAttribute("height", window.getComputedStyle(document.getElementById("canvas-holder")).height);
	width = canvas.width;
	height = canvas.height;
	drawer.x = width - 50;
	while(width > pointArr.back().x)
	{
		pointArr.push({x:pointArr.back().x + dx,y:rand(Math.max(pointArr.back().y-(maxp-minp)/2,minp),Math.min(pointArr.back().y + (maxp-minp)/2,maxp))});
	}
};









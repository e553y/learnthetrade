/*OLD THERMOMETER CODE*/
/*

class Thermometer{//Thermometer class
	constructor(canvas){
		this._canvas = canvas;
		this.level = 0; //setting the initial level for the thermometer
	}

	resizeThermometer(){

		//set thermometerCanvas height/width to the parent DIV 
		this._canvas.width = thermometerDiv.clientWidth;
		this._canvas.height = thermometerDiv.clientHeight;
	}
	drawThermometer(level){

		let ctx = this._canvas.getContext('2d');
		let h = this._canvas.height;
		let w = this._canvas.width;
		let r = this._canvas.height/22;//set the radius of the thrmometer bulb;
		let t = 1/2 * r ;//set the thickness of thermometer stalk relative to the bulb thickness;
		this.level =  +level || this.level;
		ctx.clearRect(0,0,h,w);
		ctx.fillStyle = '#ccffff';

		//draw the semi circle top of thermometer stalk
		ctx.beginPath();
		ctx.arc(w/2,t/2,t/2,0,Math.PI,true);
		ctx.fill();

		//draw the bottom bulb of thermometer
		ctx.beginPath();
		ctx.arc(w/2,h-r,r,0, 2 *Math.PI);
		ctx.fill();

		//draw thermometer stalk
		ctx.fillRect(w/2 - t/2,t/2,t,h-r);/*t/2 to account line cap
		ctx.beginPath();
		ctx.fillStyle = '#ff3300';
		ctx.arc(w/2,h-r, r/2,0, 2 * Math.PI);
		ctx.fill();
		ctx.fillRect(w/2 - t/8, h - (2 * r + this.level) , t/4, r + this.level);

		//ctx.fillRect(w/2 - t/8, h - (2 * r + this.level) , t/4, r + this.level);


	}
	updateLevel(level, duration = 0.9){

		duration *= 1000;//convert duration in to milliseconds
		let increment = (level - this.level);
		let context = this;
		let initLevel = this.level;
		let startAngle = Date.now();

		//calling animate function with arguments
		animate({
			duration: duration,
			timing(timeFraction) {//linear timing function
				return timeFraction ;
			},
			draw(progress) {
				context.drawThermometer(initLevel + progress * increment);
			}
		})

	}

}



function animate({timing, draw, duration}) {//general animation algorithm from javascript.info

	let start = performance.now();

	requestAnimationFrame(function animate(time) {
		// timeFraction goes from 0 to 1
		let timeFraction = (time - start) / duration;
		if (timeFraction > 1) timeFraction = 1;

		// calculate the current animation state
		let progress = timing(timeFraction)

		draw(progress); // draw it

		if (timeFraction < 1) {
			requestAnimationFrame(animate);
		}

	});
}
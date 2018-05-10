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
END OF OLD THERMOMETER CLASS
*/

/*thermometer guage*/
class ThermoGuage{
	/*takes two parameters canvas: canvas element and options object
	options{
	level: //the initial level,
	min: //minimum displayable temperature in celcius
	max: //maximum displayable temperature in celcius
	arc: //arc angle in radians 
	radius: //arc radius
	}.*/
	constructor(canvas, options = {}){
		/*canvas where guage is drawn*/
		this.canvas = canvas;
		/*drawing context*/
		this.ctx = canvas.getContext('2d');
		
		/*minimum guage value representable in celcius*/
		this.minC = options.min !== undefined ? options.min : -40;
		/*maximum gaage value representavle in celcius*/
		this.maxC = options.max !== undefined ? options.max : 100;

		/*minimum guage value representable in Fahrenheit*/
		this.minF = convert(this.minC,"F");//convert min celcius to fahrenheit
		/*maximum guage value representable in Fahrenheit*/
		this.maxF = convert(this.maxC,"F");//convert max to fahrenheit

		/*initial guage level*/
		this.level = options.level  || this.minC;
		/*guage arc in rads*/
		this.guageArc = options.arc || 3/2 * Math.PI ;		

		/*center of the canvas*/
		this.centerX = this.canvas.width/2;
		this.centerY = this.canvas.height/2;

		/*guage arc radius*/
		this.guageArcRadius = options.radius || 0.75 * Math.min(this.centerX,this.centerY); /*radius of the arc set to 80% of half of the smallest side*/

		/*guage startAngle angle*/
		this.startAngle = Math.PI + (Math.PI - this.guageArc)/2;

		/*guage endAngle angle*/
		this.endAngle = this.startAngle + this.guageArc;

		/*arc width*/
		this.guageArcThickness = options.thickness || 20;


	}
	/*clears canvas for redraw and animation*/
	clearCanvas(){
		this.ctx.save();
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.ctx.restore();
	}

	/*draws the main arc of the guage

	level // guage level in celcius
	arcStyles{
	color: // arc color;
	fillColor:// guage fill color
	}*/
	drawGuageArc(level = this.level , arcStyles = {}){
		this.ctx.save();//save the deafault context
		
		/*convert guage level to angle*/
		let angle = this.guageArc/(this.maxC - this.minC) * (level  - this.minC) ;
		
		/*confine angle beteen the arc of guage*/
		if (angle > this.guageArc){
			angle = this.guageArc;
		}
		
		if (angle < 0){
			angle = 0;
		}
		
		let ctx = this.ctx;
		ctx.beginPath();
		ctx.strokeStyle = "red"
		ctx.lineWidth = this.guageArcThickness;
		ctx.arc(this.centerX,this.centerY,this.guageArcRadius,this.startAngle,this.startAngle + angle);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.strokeStyle = arcStyles.color || "aqua";
		ctx.arc(this.centerX,this.centerY,this.guageArcRadius,this.startAngle + angle,this.endAngle);
		ctx.stroke();
		
		
		this.ctx.restore();//restore defaults


	}
	/*draws the needle
	level: // guage level in celcius
	needleStyles{
	color://color of the needle
	
	length://length of needle
	
	}*/
	drawGuageNeedle( level = this.level , needleStyles = {}){
		this.ctx.save();
		
		/*convert guage level to angle*/
		let angle = this.guageArc/(this.maxC - this.minC) * (level  - this.minC) ;
		
		/*confine angle beteen the arc of guage*/
		if (angle > this.guageArc){
			angle = this.guageArc;
		}
		
		if (angle < 0){
			angle = 0;
		}
		
		let ctx = this.ctx;
		ctx.beginPath();
		ctx.strokeStyle = needleStyles.color || "red";
		ctx.lineWidth = 5;

		/*coordnates of needle endAngle point*/
		/*needle length*/
		let length = needleStyles.length || 0.6 * this.guageArcRadius;

		/*ctx.moveTo(this.centerX,this.centerY);
		ctx.lineTo(this.centerX-length,this.centerY);
		ctx.stroke();*/
		ctx.translate(this.centerX,this.centerY);
		ctx.rotate(this.startAngle + angle);
		ctx.moveTo(0,0);
		ctx.lineTo(length,0)
		ctx.stroke();
		ctx.restore()


	}
	/*draws scale
	accepts a options object with:
	divisions: //number of divisions(labels) required on scale

	*/
	drawScale(options = {}){
		/*save the default context setttings*/
		this.ctx.save()
		/*put context in a local variable for a shorter variable name*/
		let ctx = this.ctx;
		/*number of divisons required on scale*/
		let divisions = options.divisions || 7; //set to 7 by default


		/*value of one division for celcius*/
		let incrementC = (this.maxC - this.minC) / divisions;

		/*value of one divsion for fahernheit*/
		let incrementF = (this.maxF - this.minF) / divisions;

		/*ordered scale labels for celcius*/
		let labelsC = [];

		/*ordered scale labels for fahrenheit*/
		let labelsF = [];

		for (let i = 0; i <= divisions; i++){
			labelsC.push( floatFix( this.minC + i * incrementC ,1) + '\xB0' +"C" );//not alot of precision is required
			labelsF.push( floatFix( this.minF + i * incrementF ,1) +  '\xB0' + "F");
		}
		/*angle value of one increment*/
		let incrementAng = this.guageArc / divisions;

		/*set the font of the labels */
		ctx.font =  "15px Helvetica, sans-serif";          
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";

		/*clearance from the arc to the labels*/
		let clearance = Number.parseFloat( ctx.font);

		/*the radial distance between celcius and fahrenheit labels*/
		let diff = this.guageArcThickness + 2 * clearance; 

		/*translate origin to center of canvas*/
		ctx.translate(this.centerX,this.centerY);

		/*layout labels on arc*/
		for(let i = 0; i <= divisions ; i++ ){
			ctx.save();
			ctx.rotate(this.startAngle + i * incrementAng);
			ctx.translate(this.guageArcRadius - this.guageArcThickness/2 - clearance , 0);
			ctx.rotate( -(this.startAngle + i * incrementAng) );
			ctx.fillText(labelsC[i],0,0);

			ctx.rotate(this.startAngle + i * incrementAng);
			ctx.translate(diff, 0);
			ctx.rotate( -(this.startAngle + i * incrementAng) );
			ctx.fillText(labelsF[i],0,0);
			ctx.restore();
		};
		ctx.restore();


	}
	/*updates level of guage and needle
	take 1 argument
	level: //the level in celcius required
	duration: //how long the animation should take
	*/
	
	updateLevel(level, duration = 0.8){
		
		duration *= 1000;//convert duration in to milliseconds
		let increment = (+level - +this.level);
		let context = this;
		let initLevel = this.level;
		this.level = level;
		//let start = Date.now();

		//calling animate function with arguments
		animate({
			duration: duration,
			timing: function(timeFraction) {//linear timing function
				return timeFraction ;
			},
			draw: function(progress) {
				context.clearCanvas();
				context.drawGuageArc(initLevel + progress * increment);
				context.drawScale();
				context.drawGuageNeedle(initLevel + progress * increment);
			}
		})
		
		

	}


}



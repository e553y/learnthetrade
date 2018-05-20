/*returns a function to handle zooming in and out*/
function zoomInOut(){
	let isZoomedIn = false;
	/*previous graph range array */
	let prevRange;

	/*graphCanvas object referece */
	let o = canvasGraphObject;

	/*zooms in and out to specific quadrant*/
	let zoomer = function(event){
		/*if already zoomed restore previous canvas range and redraw */
		if(isZoomedIn){
			o.updateRange(prevRange);
			/*update isZoomedIn*/
			isZoomedIn = false;
			return; 

		}
		/*save the previous range values*/
		[...prevRange] = [o.minX,o.maxX,o.minY,o.maxY];

		/*get the coordinates of the click*/
		/*x coordinate of the click relative to element*/
		let xCoord;

		/*y coordinate of the click relative to element*/
		let yCoord;

		/*convert coordinates to graph values */
		[xCoord, yCoord ] = o.getCoordVal( event.offsetX, event.offsetY );// subtract from canvas height to account for translated origin 

		/*get which coordinate the click happened*/
		/*didn't handle when clicked to left of first grid pos*/

		let minX = o.firstXAxisTick + o.gridWidth * Math.floor((xCoord - o.firstXAxisTick) / o.gridWidth);
		let maxX = minX + o.gridWidth;

		let minY =  o.firstYAxisTick + o.gridHeight * Math.floor((yCoord - o.firstYAxisTick) / o.gridHeight); 
		let maxY = minY + o.gridHeight;


		/*update graph*/
		o.updateRange([minX,maxX,minY,maxY]);
		/*update isZoomed state*/
		isZoomedIn = true;
	}
	return zoomer;

}


class GraphCanvas{
	/*takes a canvas element and an array with [minx, maxx, miny, maxy]*/
	constructor(canvas, range = [] ){

		/*prepare canvas properties*/
		this.canvas = canvas;
		this.canvasWidth = canvas.width;
		this.canvasHeight = canvas.height;
		this.ctx = canvas.getContext('2d');

		
		/*if range array is not provided
		 set range of x and y from -5 to 5 by default
		 */
		/*the smallest x value on the graph*/
		this.minX = range[0] || -10;
		/*the largest x value on the graph*/
		this.maxX = range[1] || 10;
		/*the smallest y value on the graph*/
		this.minY = range[2] || -10;
		/*the largest y value on the graph*/
		this.maxY = range[3] || 10;



		/*calculate x and y axis scales
		( units per pixel)*/
		this.scaleX = (this.maxX - this.minX)/this.canvasWidth;
		this.scaleY = (this.maxY - this.minY)/this.canvasHeight;
		
		/*minimum and maximum space between grid lines*/
		/*minimum grid separation in pixels*/
		this.gridMin = 40;
		/*maximum grid separation in pixels*/
		this.gridMax = 80;

		/*x axis left-most tick position(grid positon)*/
		this.firstXAxisTick;

		/*y axis bottom tick position(grid postion)*/
		this.firstYAxisTick;

		/*grid width in values*/
		this.gridWidth;

		/*grid height in values*/
		this.gridHeight;

		/*pixel distance between consecutive x axis ticks*/
		this.vGridDiff;

		/*pixel distance between consecutive y axis ticks*/
		this.hGridDiff;

		/*prepare an array for equations to go in to*/
		this.equations = [];
		
		/*color collection array*/
		this.colorArray = ["blue","red","yellow","orange","green","aqua"]
	}



	/*coordinates to pixel values*/
	getPixelPos( coordArr ){
		return [ this.getXPixelPos(coordArr[0]),this.getYPixelPos(coordArr[1]) ];
	}
	getXPixelPos(xVal){
		/*returns the pixel position  of an X value */
		return (xVal - this.minX)/this.scaleX;

	}
	getYPixelPos(yVal){
		/*return the pixel position  of a Y value*/
		return this.canvasHeight - ( yVal - this.minY )/this.scaleY;
	}


	/*pixel values to coordinates*/
	getCoordVal(xPixel,yPixel){
		return [ this.getXCoordVal(xPixel), this.getYCoordVal(yPixel)];
	}
	getXCoordVal(xPixel){
		/*returns corresponding pixel position for an x value*/
		return this.minX + (xPixel * this.scaleX);
	}
	getYCoordVal(yPixel){
		return this.minY + ( this.canvasHeight - yPixel ) * this.scaleY; 
	}
	/*check if x value is within range*/
	/*takes an x value and returns a boolean if x value is within range*/
	isInXRange(x){

		return ( x < this.maxX && x > this.minX );
	}

	/*check if x value is within range*/
	/*takes a y value and returns a boolean if the y value is within range*/
	isInYRange(y){

		return ( y < this.maxY && y > this.minY);
	}	
	/*this clears entire graph*/
	clearGraph(){
		this.ctx.clearRect( 0, 0, this.canvasWidth, this.canvasHeight );
	}
	updateRange(range){

		if(!range || range.length != 4 ) return;

		[this.minX,this.maxX,this.minY,this.maxY] = range;

		/*recalculate the scales*/

		this.scaleX = (this.maxX - this.minX)/this.canvasWidth;
		this.scaleY = (this.maxY - this.minY)/this.canvasHeight;


		/*redraw graph*/
		this.clearGraph();
		this.drawGrid();
		this.drawAxes();
		this.drawEquations();


	}

	drawEquations(){

		/*this draws equations on the canvas*/
		this.ctx.save();
		
		
		this.equations.forEach( (e,index)=> strokeEquation.call(this,e,this.colorArray[index]) );
		


		function strokeEquation(func,color){

			this.ctx.beginPath();
			this.ctx.strokeStyle = color;

			for( let i = 0; i <= this.canvasWidth ; i += 1 ){

				let yValue = func(this.getXCoordVal(i)) ;

				/*
				if 'asymptote' is returned then
				stroke the current path and then begin a new one
				*/
				if(yValue =="asymptote") {
					this.ctx.stroke();
					this.ctx.beginPath();
				}else{
					/*
					multiply by -1 since y axis is inverted and divide by scale
					*/
					this.ctx.lineTo(i, this.getYPixelPos(yValue)); 
				}
				this.ctx.stroke();
				
			}
		}
		this.ctx.restore();

	}
	drawAxes(){
		/*
		draws the x and y axes on the canvas
		*/
		this.ctx.save()//saving the default
		this.ctx.lineWidth = 2;
		/*X AXIS */
		if( this.isInYRange(0) ){//check if x axis is within the range of the canvas graph
			this.ctx.beginPath();
			this.ctx.moveTo( this.getXPixelPos( this.minX ), this.getYPixelPos(0) );//refactor
			this.ctx.lineTo( this.getXPixelPos( this.maxX ), this.getYPixelPos(0) );
			this.ctx.stroke();
		}
		/*Y AXIS*/
		if( this.isInXRange(0) ){//check if y axis is within the range of the canvas graph
			this.ctx.beginPath();
			this.ctx.moveTo( this.getXPixelPos(0), this.getYPixelPos( this.minY ) );
			this.ctx.lineTo( this.getXPixelPos(0), this.getYPixelPos( this.maxY ) );
			this.ctx.stroke();
		}

		this.ctx.restore()//retstore default 

	}
	drawGrid(){

		/*
		draws a grid on the canvas
		*/
		this.ctx.save()//saving the defaults
		this.ctx.lineWidth = 1;//make the line width 1 px
		this.ctx.strokeStyle = "lightgray"//make the grid light gray
		this.ctx.fillStyle = "gray"//make the labels light gray

		/*VERTICAL GRID*/
		/*if y axis exist use it*/
		//y axis or the largest integer displayable in the graph
		let x = this.isInXRange(0)? 0 : Math.floor(this.maxX);
		/*the x axis grid increment*/
		let i = 1;
		/*the x coordinate of the first vertical grid line*/
		let firstXGrid;
		/*the vertical grid separation destance in pixels*/
		let vGridDiff;
		while(true){
			if( (this.getXPixelPos( x + i) - this.getXPixelPos( x ) ) <= this.gridMin ){
				i *= 2;
				continue;
			}
			if( (this.getXPixelPos( x + i) - this.getXPixelPos( x ) ) > this.gridMax ){
				i /= 2;
				continue;
			}
			firstXGrid = x - i * Math.floor((x - this.minX)/i);
			vGridDiff = (this.getXPixelPos( x + i) - this.getXPixelPos( x ) );
			break;

		}
		//update object properties
		this.gridWidth = i;
		this.firstXAxisTick = firstXGrid;
		this.vGridDiff = vGridDiff;

		/*draw the vertical grid lines */
		this.ctx.beginPath();
		for(let j = this.getXPixelPos(firstXGrid); j <= this.canvasWidth; j+=vGridDiff){
			this.ctx.moveTo( Math.floor(j) + 0.5 ,0);
			this.ctx.lineTo( Math.floor(j) + 0.5 , this.canvasHeight);
			this.ctx.stroke();


		}
		/*draw label text on vertical grid lines*/
		/*baseline for x axis labels */
		let xBaseline = this.canvasHeight ;//set to the bottom of the canvas
		/*check if x axis exists*/
		if( this.minY < 0 && this.maxY > 0 ) xBaseline = this.getYPixelPos(0)

		for(let j = firstXGrid; j <= this.maxX; j+= i ){

			this.ctx.fillText(j,this.getXPixelPos(j),xBaseline - 3 );
			this.ctx.stroke();

		}


		/*HORIZONTAL GRID*/
		//debugger;
		/*if X axis exist use it*/
		//x axis or the largest integer displayable in the graph
		let y = this.isInYRange(0)? 0 : Math.floor(this.maxY);
		/*the y axis grid increment*/
		let j = 1;
		/*the x coordinate of the first vertical grid line*/
		let firstYGrid;
		/*the horizontal grid separation destance in pixels*/
		let hGridDiff;
		while(true){
			if( -1 * (this.getYPixelPos( y + j) - this.getYPixelPos( y ) ) <= this.gridMin ){
				j *= 2;
				continue;
			}
			if( -1 * (this.getYPixelPos( y + j) - this.getYPixelPos( y ) ) > this.gridMax ){
				j /= 2;
				continue;
			}
			firstYGrid = y - j * Math.floor((y - this.minY)/j);
			hGridDiff =  -1 * (this.getYPixelPos( y + j) - this.getYPixelPos( y ) );
			break;
		}
		//update object properties
		this.gridHeight = j; 
		this.firstYAxisTick = firstYGrid;
		this.hGridDiff = hGridDiff;

		/*draw the horizontal grid lines */
		for(let j = this.getYPixelPos(firstYGrid); j >= -this.canvasHeight; j-=hGridDiff){
			this.ctx.moveTo( 0,Math.floor(j) + 0.5 );
			this.ctx.lineTo( this.canvasWidth, Math.floor(j) + 0.5 );
			this.ctx.stroke();


		}
		/*draw label text on horizontal grid lines*/
		/*baseline for y axis labels */
		let yBaseline = 0 ;//set to the left of the canvas
		/*check if y axis exists*/
		if( this.minX < 0 && this.maxX > 0 ) yBaseline = this.getXPixelPos(0)//set baseline on the y axis

		for(let ylabel = firstYGrid; ylabel <= this.maxY; ylabel+= j ){

			this.ctx.fillText(ylabel,yBaseline + 3,this.getYPixelPos(ylabel) );
			this.ctx.stroke();

		}


		this.ctx.restore();
	}

	retrieveEquations(){
		/*empty equations array*/
		this.equations = [];
		/*get the equation from the document */

		let checked =  Array.from( document.forms.graphType.eqType ).filter( (e)=> e.checked );



		let parameters = document.forms.graphType.elements;
		let eqFunctions = {
			'linear': (x) => parameters.linear_a.value*x + +parameters.linear_b.value,
			'quadratic': (x)=> +parameters.quadratic_a.value * (x * x) + +parameters.quadratic_b.value * x + +parameters.quadratic_c.value,

			'absolute': (x) => Math.abs( - parameters.absolute_a.value * x),
			'sine': (x)=> ( parameters.sine_a.value * Math.abs(Math.sin(x))),
			'circle': (x, lHalf = 1) => { //
				return lHalf * Math.sqrt(parameters.circle_a.value ** 2 - x ** 2)
			},
			'inverse': (x)=> { //acounting for asymptote
				if(x){
					return +parameters.inverse_a.value / x
				}else{	
					return "asymptote"
				}
			},

		};

		//get all the equation types selected
		checked.forEach((e)=>{ 
			this.equations.push(eqFunctions[e.value])
		});


	}



}
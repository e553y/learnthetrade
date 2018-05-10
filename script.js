//adding event listenenrs after DOM is fully constructed
// create required objects
let thermoGuageObject;
let canvasGraphObject;
let response;
function onLoad(){	
	//initialize the canvas graph object
	canvasGraphObject = new GraphCanvas(graph);

	//initialize the thermometer
	thermoGuageObject = new ThermoGuage(tempCanvas);
	thermoGuageObject.drawGuageArc();
	thermoGuageObject.drawGuageNeedle();
	thermoGuageObject.drawScale();

	//adding listner to calculator buttons
	btnGrp.onclick = clicked();

	//adding listner to calculator screen
	document.getElementById('outPut').addEventListener('dblclick',paneHandler);

	//adding listener to graphType form  button to make switch the panes
	document.getElementById('graphType').addEventListener('click',paneHandler);



	//adding listener to parameters pane on Enter key press
	document.getElementById('graphType').addEventListener('keypress',paneHandler);

	//adding listener to canvasGraph pane
	document.getElementById('graphDraw').addEventListener('dblclick',paneHandler);

	//adding listener to graph canvas on single click
	document.getElementById('graph').addEventListener('click',zoomInOut());


	
	//adding listner to temperature converter
	tempFrm.oninput = function(event){converter(event,thermoGuageObject)};

	//make adjust panes width and height to the viewport
	makeFullScreen();






}




//redraw thermometer canvason resize
timeOut = null;
function onResize(){
	makeFullScreen();
	centerThermometer();


}
function paneHandler(event){
	//alert(event);
	//switching to parameters pane on doubleclick
	if(outPut.contains(event.target)){
		calcHome.classList.remove('active');
		graphParam.classList.add('active');
		return;
	}
	//switching to graphing pane on button click and Enter key press
	if(event.target.name == "drawGraph" || event.key == "Enter"){

		graphParam.classList.remove('active');
		graphDraw.classList.add('active');

		//taking the parameters from the equation selector pane
		canvasGraphObject.retrieveEquations();

		//clear the canvas
		canvasGraphObject.clearGraph();
		//draw grid
		canvasGraphObject.drawGrid();
		//draw axes 
		canvasGraphObject.drawAxes();
		//drawing the equations on the graph
		canvasGraphObject.drawEquations();

		return;
	}
	if(event.target.name=="eqType"){//making the parameters of equations visible for input on click
		let parent = event.target.parentElement;

		parent.querySelector('.subForm').classList.toggle('active');
		return;

	}


	//switching back to parameters pane on doubleclick
	if(document.getElementById('graphDraw').contains(event.target) || event.target.value =="Graph"){
		event.preventDefault();//preventing the default zoom on double clicked
		graphDraw.classList.remove('active');
		graphParam.classList.add('active');
		return;
	}

	//switching back to calculator on return button click
	if(event.target.id == "reenterParam"){
		graphParam.classList.remove("active");
		calcHome.classList.add("active");
		return;
	}
	//switching to zip input pane on button click
	if(event.target.id=="weatherNowBtn"){
		home.classList.remove("active");
		zipRequest.classList.add("active");
		return;
	}
	//switchin to weather display pane on button click
	if(event.target.id=="getWeatherBtn"){
		zipRequest.classList.remove("active");
		weatherDisplay.classList.add("active");
		tempToggle.checked = false;
		return;
	}

	//going back to zip input pane on button click
	if(event.target.id == "reenterZip"){
		weatherDisplay.classList.remove("active");
		zipRequest.classList.add("active");
	}

	//going back to home pane on button click
	if(event.target.id == "backToHome"){
		zipRequest.classList.remove("active");
		home.classList.add("active");

	}

}



// global helper functions

/*accepts one string argument and evaluates it as a javascript code*/
function evalStr(str){
	return Function("return (" + str +")")();
}

/*accepts two arguments. a number and a decimal places to round to(2 by default) */
function floatFix(number,decPlaces = 2){
	let precision = Math.pow(10,decPlaces);
	return Math.round(number*precision)/precision;
}

/*
general animation algorithm from javascript.info*/
function animate({timing, draw, duration}) {

	let startTime = performance.now();

	requestAnimationFrame(function animate(time) {
		// timeFraction goes from 0 to 1
		let timeFraction = (time - startTime) / duration;
		if (timeFraction > 1) timeFraction = 1;

		// calculate the current animation state
		let progress = timing(timeFraction)

		draw(progress); // draw it

		if (timeFraction < 1) {
			requestAnimationFrame(animate);
		}

	});
}

//converts a number to one of the temperature scales (F or C)
function convert(number,to){
	number = Number.parseFloat(number);
	
	switch(to){
		case "C":
			return ((number - 32) * 5/9);
		case "F": 
			return ((number * 9/5) + 32);
			
	}
}
/*makes subPanes full screen*/
function makeFullScreen(){
	document.querySelectorAll('.subPane').forEach( (e)=>{
		e.style.width = 0.96 * window.innerWidth + "px";
		e.style.height = 0.96 *  window.innerHeight + "px";
		e.style.margin = (0.02 * window.innerHeight) + "px, " + (0.02 * window.innerWidth) + "px";

	})
};

/*makes the thermometer height and width equal to the parent div and centers it*/
function centerThermometer(){
	if (timeOut != null)clearTimeout(timeOut);

	timeOut = setTimeout(function(){
		thermometerObject.resizeThermometer();
		thermometerObject.drawThermometer();
	}, 0);
}
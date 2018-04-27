//adding event listenenrs after DOM is fully constructed
// create a thermometer object
let thermometerObject;
let canvasGraphObject;
let response;
function onLoad(){	
	//initialize the canvas graph object
	canvasGraphObject = new GraphCanvas(graph);

	//initialize the thermometer
	thermometerObject = new Thermometer(tempCanvas);

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


	//make thermometer canvas width and height fit screen
	thermometerObject.resizeThermometer();

	//draw the object
	thermometerObject.drawThermometer();

	//adding listner to temperature converter
	tempFrm.oninput = function(event){converter(event,thermometerObject)};

	//make htmlrequest for JSON data





}




//redraw thermometer canvason resize
timeOut = null;
function onResize(){
	if (timeOut != null)clearTimeout(timeOut);

	timeOut = setTimeout(function(){
		thermometerObject.resizeThermometer();thermometerObject.drawThermometer();
	}, 500);//wait .5 sec to make sure resizing is done


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



//helper function to evaluate strings in to executable js code (instead of eval())
function evalStr(str){
	return Function("return (" + str +")")();
}
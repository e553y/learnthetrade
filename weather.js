function getWeather(){
	let zip = zipInput.value;
	
	let url = `http://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=aecc6cda13e8fb7a4193c1eb26ae18e0`;
	
	requestData(url);
}

function requestData(url){
	let xmlhttp = new XMLHttpRequest()
	
	function reviver (key,value){ 
		if(/sun/.test(key)) {
			return new Date(value * 1000) 
		}; 
		return value
	}

	xmlhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status== 200){
			response = JSON.parse(xmlhttp.responseText, reviver());
			writeData(response);
		}
	}
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
}



//write all weather data to page
function writeData(obj){
	let nodes = document.querySelectorAll('*[data-source]');
	nodes.forEach( (node)=>{
		node.textContent = evalStr("response"+node.dataset.source);
		if(node.dataset.actionTemp){
			node.textContent += "\xB0F";
		}
	});
}
function tempToggleHandler(event){//handles when the temp toggle is pressed
	let source = event.target;
	let desiredScale = source.checked ? "C":"F";
	convertTempData(desiredScale);
	
}

//convert all temperture value to a desired result scale 
function convertTempData(desiredScale){
	let nodes = document.querySelectorAll('*[data-action-temp]');
	nodes.forEach( (node)=>{
		let converted =  convert(node.textContent,desiredScale);
		converted = floatFix(converted);//rounding off
		node.innerHTML = converted + "<sup>o</sup>" + desiredScale;
	});
}

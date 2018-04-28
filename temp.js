
function converter(event,thermometer){
	let source = event.target || event.srcElement;

	if(source.id == "celcius" ){
		console.log(this);
		this.temperature = source.value;
		document.getElementById('fahrenheit').value= this.temperature != "" ?  (this.temperature * 9/5) + 32 : "";
		thermometer.updateLevel(this.temperature);
	}
	if(source.id == 'fahrenheit'){
		this.temperature = source.value != "" ? (source.value -32)* 5/9: "" ;
		document.getElementById('celcius').value=this.temperature;
		thermometer.updateLevel(this.temperature);
	}
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
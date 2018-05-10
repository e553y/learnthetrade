/*retrieve temperatures and update corresponding elements
takes 
event: form imput event,
thermometer: object to update
*/
function converter(event, thermometer) {
	
	
	let temperature = event.target.value;
	
	let fahrenheit = document.getElementById('fahrenheit');
	let celcius = document.getElementById('celcius');
	
	if(event.target.id == "celcius"){
		
		let converted = convert(temperature,"F");
		
		if(temperature == ""){
			fahrenheit.value = "";
			thermometer.updateLevel(thermometer.minC);//set to minimum
		}else{
			fahrenheit.value = floatFix(converted,4);
			thermometer.updateLevel(+temperature);
		}
		return;
	}
	if(event.target.id == 'fahrenheit'){
		
		let converted = convert(temperature,"C");
		if(temperature == ""){
			celcius.value = "";
			thermometer.updateLevel(thermometer.minC);//set to minimum
		}else{
			celcius.value = floatFix(converted,4);
			thermometer.updateLevel(converted);
		}
		return;
	}
}



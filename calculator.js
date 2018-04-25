function clicked(e) {
	let expression =  [];
	let answer =  "";

	function pressed(e){
		let id = event.target.value;

		if ((expression.length != 0) && //function to operate on answer by adding parenthesis 
			(answer.toString.length > 0) && (id == "+" || id == "-" || id == "x" || id == "/")) {
			expression.unshift('(');
			expression.push(')');
			answer = "";
		}
		;
		if (isFinite(id) && (answer.toString.length > 0)) {
			//clearing when a number button pressed
			expression = [];
			answer = "";
		}
		;
		if (answer instanceof Error) {
			//clearing everything in-case of an error
			expression = [];
			answer = "";
		}

		switch (id) {

			case "x":
				//added separately as "*" operator different from id ("x")
				expression.push("*");
				break;

			case "C":
				//added separately; function unrelated to id
				expression.length = 0;
				answer = "";
				break;

			case "=":
				if (expression.length > 0) {
					try {
						answer = evalStr(expression.join(""));
					} catch (e) {
						answer = e;
					}
				}
				break;

			default:
				expression.push(id);
		}

		let exp = document.querySelector("#exp");
		exp.value = expression.join("");
		document.querySelector("#ans").value = (answer != undefined) ? answer : 0;

		if (exp.value.length > 33) {
			//reverse-ellipsis overflow in expression window
			exp.value = "..." + exp.value.substr(-31);
		}
		event.preventDefault();
	};
	return pressed;

}

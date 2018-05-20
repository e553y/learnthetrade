//SCRIPT.JS
describe("global functions", function () {
	'use strict';
	describe("evalStr( string )", function () {
		describe("evaluates string as a mathmatical expression", function () {

			it("evaluates addition", function(){

				assert.equal( evalStr("1 + 1"), 2 );	
			});

			it("evaluates subtraction", function(){
				assert.equal( evalStr("10 - 1"), 9 ); 	
			});

			it("evaluates multiplication", function(){
				assert.equal(  evalStr("10 * 3") , 30 )
			});

			it("evaluates division", function(){
				assert.equal(  evalStr("10 / 2") , 5 )
			});





		})

	})
	describe("floatFix( number, n)", function(){
		it("rounds floating numbers to n decimal digits", function(){
			assert.equal( floatFix(Math.PI, 4 ), 3.1416)
		})
		it("rounds to two decimal digits by default", function(){
			assert.equal( floatFix(Math.PI), 3.14)
		})
	})
	describe( "convert( number, to )", function(){
		it(" to = 'C' converts from fahrenheit to celcius", function(){
			assert.equal( convert( 212 , "C"), 100); 
		})
		it(" to = 'F' converts from celcius to fahrenheit", function(){
			assert.equal( convert( 0 , "F"), 32); 
		})
	})

})

/* --NEED TO REFACTOR-- L
THEN DO TESTS */
//CALCULATOR.JS
describe("calulator", function(){

	describe("clicked( event )", function(){

		describe("perform arithmetics", function(){

			//create dummy event
			let dummyEvent = {};
			dummyEvent.target.value = 1 ; 

		//create dummy elements for expression and answer
		//dummy expression output text box
		let dummyExpression = document.createElement("output");
		//dummy answer output text box
		let dummyAnswer = document.createElement("output"); 
		//create dummy button
		let dummyButton = document.createElement("button")
		//add SUT listner to dummy button
		dummyButton.onclick = clicked();

		//dummy document.querySelector to return dummy elements
		let stubQuerySelctor = sinon.stub(document , "querySelector");
		stubQuerySelctor.withArgs("#exp").returns(dummyExpression);
		stubQuerySelctor.withArgs("#ans").returns(dummyAnswer); 

		it("should add the pressed value to expression", function(){


			//successive buttons to click
			let buttonPresses = ["1","2","3","4","5","6","7","8","9","0","+","-","/","*"];
			for( let i of buttonPresses){
				//assign the value to dummy button
				dummyButton.value = i; 

				//simulate the click
				dummyButton.click();


			}
			//all should be inserted to dummy expression output
			assert.equal(dummyExpression.value, buttonPresses.join(""));
			//"C" press should clear expresion value
			dummyButton.value = "C";
			dummyButton.click();
			//everything should be cleared now
			assert.equal( dummyExpression.value, "");

		} )
		it("should evaluate the expression on '=' press", ()=>{


			//insert expression by clicking loop
			for( let i of ["1","+","2","="]){
				dummyButton.value = i; 
				//simulate the click
				dummyButton.click();
			}

			//check dummy answer output box for evaluation
			assert.equal(dummyAnswer.value, "3");

		})
		it("after calculation, should clear output when a number pressed ", function(){
			//successive buttons to click
			let buttonPresses = ["1","*","3","-","5","/","+","8","9","="];
			for( let i of buttonPresses){
				dummyButton.value = i; 

				//simulate the click
				dummyButton.click();
			}
			//then press any number
			dummyButton.value = "1";
			dummyButton.click();
			//expression should be equal to the last button 
			assert.equal(dummyExpression.value,"1")

			} )

		})

	})

})*/
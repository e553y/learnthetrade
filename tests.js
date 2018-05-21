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


		})

	})
})

//GRAPH.JS
describe( "graph.js", function () {
	//create a canvas for tests
	let canvas = document.createElement('canvas'); 
	//create array with minimum and maximum values set
	let canvasGraphObj = new GraphCanvas(canvas,[-20,20,-15,15]);
	//test constructor
	describe( "GraphCanvas( canvas, range )", function (){
		it( "should create a graph with the given parameters ", function(){

			//test if the parameters are set correctly
			assert.equal( canvasGraphObj.canvas, canvas );
			assert.equal( canvasGraphObj.minX, -20 ); 
			assert.equal( canvasGraphObj.maxX, 20 ); 
			assert.equal( canvasGraphObj.minY, -15 ); 
			assert.equal( canvasGraphObj.maxY, 15 );

		})
	})

	//test coordinate to pixel position converter
	describe("getPixelPos( coordArr )", function () {
		it("should return pixel coordinates of x-y value", function () {
			//coordinates and thier expected corresponding pixel pos
			let testCoordinates = new Map([ //can be added to in the future
				[[-20, -15], [0, canvasGraphObj.canvasHeight]],
				[[-20, 15], [0, 0]],
				[[20, 15], [canvasGraphObj.canvasWidth, 0]],
				[[20, -15], [canvasGraphObj.canvasWidth, canvasGraphObj.canvasHeight]],

			])

			for (let entry of testCoordinates) {

				let arguments = entry[0];
				let expected = entry[1];
				assert.deepEqual(canvasGraphObj.getPixelPos(arguments), expected);
			}

		})

	})
	//test pixel to coordinate converter
	describe("getCoordVal( pixelCoordArr )", function () {
		it("should return x - y coordinates of pixel position array", function () {
			let testCoordinates = new Map([ //can be added to in the future
				[[-20, -15], [0, canvasGraphObj.canvasHeight]],
				[[-20, 15], [0, 0]],
				[[20, 15], [canvasGraphObj.canvasWidth, 0]],
				[[20, -15], [canvasGraphObj.canvasWidth, canvasGraphObj.canvasHeight]],

			])
			for (let entry of testCoordinates) {

				let arguments = entry[1];
				let expected = entry[0];

				assert.deepEqual(canvasGraphObj.getCoordVal(arguments[0], arguments[1]), expected);
			}

		})
	})
	
	describe("isInXRange( x )", function () {
		it("should return if x is withing the range of graph", function () {
			let testXPositions = new Map([
				[-20, false ],//the edge should not be considered in range
				[-19.999, true],
				[0, true],
				[19.999, true],
				[20,false],
			])
			for (let entry of testXPositions) {

				let arguments = entry[0];
				let expected = entry[1];

				assert.strictEqual(canvasGraphObj.isInXRange(arguments), expected);
			}
		})
	})
	describe("isInYRange( y )", function () {
		it("should return if y is within the range of graph", function () {
			let testXPositions = new Map([
				[-15, false ],//the edge should not be considered in range
				[-14.999, true],
				[0, true],
				[14.999, true],
				[15,false],
			])
			for (let entry of testXPositions) {

				let arguments = entry[0];
				let expected = entry[1];

				assert.strictEqual(canvasGraphObj.isInYRange(arguments), expected);
			}
		})
	})
	

})
//THERMOMETER.JS
describe("thermometer Guage", function(){
	describe("constructor( canvas, optionsObj )", function(){

	})
})
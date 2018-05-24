describe("All tests for LearnTheTrade site", function () {
	//SCRIPT.JS
	describe("global functions", function () {
		'use strict';
		describe("evalStr( string )", function () {
			describe("evaluates string as a mathmatical expression", function () {

				it("evaluates addition", function () {

					assert.equal(evalStr("1 + 1"), 2);
				});

				it("evaluates subtraction", function () {
					assert.equal(evalStr("10 - 1"), 9);
				});

				it("evaluates multiplication", function () {
					assert.equal(evalStr("10 * 3"), 30)
				});

				it("evaluates division", function () {
					assert.equal(evalStr("10 / 2"), 5)
				});





			})

		})
		describe("floatFix( number, n)", function () {
			it("rounds floating numbers to n decimal digits", function () {
				assert.equal(floatFix(Math.PI, 4), 3.1416)
			})
			it("rounds to two decimal digits by default", function () {
				assert.equal(floatFix(Math.PI), 3.14)
			})
		})
		describe("convert( number, to )", function () {
			it(" to = 'C' converts from fahrenheit to celcius", function () {
				assert.equal(convert(212, "C"), 100);
			})
			it(" to = 'F' converts from celcius to fahrenheit", function () {
				assert.equal(convert(0, "F"), 32);
			})
		})

	})

	/* --NEED TO REFACTOR-- L
THEN DO TESTS */
	//CALCULATOR.JS
	describe("calulator", function () {

		describe("clicked( event )", function () {



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
			let stubQuerySelctor = sinon.stub(document, "querySelector");
			stubQuerySelctor.withArgs("#exp").returns(dummyExpression);
			stubQuerySelctor.withArgs("#ans").returns(dummyAnswer);

			it("should add the pressed value to expression", function () {


				//successive buttons to click
				let buttonPresses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "/", "*"];
				for (let i of buttonPresses) {
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
				assert.equal(dummyExpression.value, "");

			})
			it("should evaluate the expression on '=' press", () => {


				//insert expression by clicking loop
				for (let i of ["1", "+", "2", "="]) {
					dummyButton.value = i;
					//simulate the click
					dummyButton.click();
				}

				//check dummy answer output box for evaluation
				assert.equal(dummyAnswer.value, "3");

			})
			it("after calculation, should clear output when a number pressed ", function () {
				//successive buttons to click
				let buttonPresses = ["1", "*", "3", "-", "5", "/", "+", "8", "9", "="];
				for (let i of buttonPresses) {
					dummyButton.value = i;

					//simulate the click
					dummyButton.click();
				}
				//then press any number
				dummyButton.value = "1";
				dummyButton.click();
				//expression should be equal to the last button 
				assert.equal(dummyExpression.value, "1")


			})

		})
	})

	//GRAPH.JS
	describe("graph.js", function () {



		//test constructor
		describe("GraphCanvas( canvas, range )", function () {

			it("should create a graph with the given parameters ", function () {
				//create a canvas for tests
				let canvas = document.createElement('canvas');
				//create array with minimum and maximum values set
				let canvasGraphObj = new GraphCanvas(canvas, [-20, 20, -15, 15]);


				//test if the parameters are set correctly
				assert.equal(canvasGraphObj.canvas, canvas);
				assert.equal(canvasGraphObj.minX, -20);
				assert.equal(canvasGraphObj.maxX, 20);
				assert.equal(canvasGraphObj.minY, -15);
				assert.equal(canvasGraphObj.maxY, 15);

			})
		})

		//test coordinate to pixel position converter
		describe("getPixelPos( coordArr )", function () {
			//create a canvas for tests
			let canvas = document.createElement('canvas');
			//create array with minimum and maximum values set
			let canvasGraphObj = new GraphCanvas(canvas, [-20, 20, -15, 15]);



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
			//create a canvas for tests
			let canvas = document.createElement('canvas');
			//create array with minimum and maximum values set
			let canvasGraphObj = new GraphCanvas(canvas, [-20, 20, -15, 15]);

			let testCoordinates = [ //can be added to in the future
				{
					expected: [-20, -15],
					input: [0, canvasGraphObj.canvasHeight],
					desc: "top left corner",
				},
				{
					expected: [-20, 15],
					input: [0, 0],
					desc: "bottom left corner",
				},
				{
					expected: [20, 15],
					input: [canvasGraphObj.canvasWidth, 0],
					desc: "top right corner",
				},
				{
					expected: [20, -15],
					input: [canvasGraphObj.canvasWidth, canvasGraphObj.canvasHeight],
					desc: "bottom right corner",
				},

			];
			for (let entry of testCoordinates) {

				it(`should return correct values for coordinates of ${entry.desc}`, function () {
					assert.deepEqual(canvasGraphObj.getCoordVal(entry.input), entry.expected);
				})

			}

		});

		//test range inclusion evaluator
		describe("isInXRange( x )", function () {
			//create a canvas for tests
			let canvas = document.createElement('canvas');
			//create array with minimum and maximum values set
			let canvasGraphObj = new GraphCanvas(canvas, [-20, 20, -15, 15]);
			//test cases
			let testXPositions = [
				{
					input: -20,
					expected: false,
					desc: "x axis minimum "
				},
				{
					input: -19.99,
					expected: true,
					desc: "inside x-axis range "
				},
				{
					input: -21,
					expected: false,
					desc: "outside x-axis range "
				},
				{
					input: 20,
					expected: false,
					desc: "x axis maximum "
				},

			];
			//dynamically generate test cases
			for (let entry of testXPositions) {

				it(`should return ${entry.expected} if input is ${entry.desc}`, function () {
					assert.strictEqual(canvasGraphObj.isInXRange(entry.input), entry.expected);
				})
			}

		})


		describe("isInYRange( y )", function () {
			//create a canvas for tests
			let canvas = document.createElement('canvas');
			//create array with minimum and maximum values set
			let canvasGraphObj = new GraphCanvas(canvas, [-20, 20, -15, 15]);
			//test cases
			let testYPositions = [
				{
					input: -15,
					expected: false,
					desc: "y axis minimum "
				},
				{
					input: -14.99,
					expected: true,
					desc: "inside y-axis range "
				},
				{
					input: -16,
					expected: false,
					desc: "outside y-axis range "
				},
				{
					input: 15,
					expected: false,
					desc: "y axis maximum "
				},

			];
			//dynamically generate test cases
			for (let entry of testYPositions) {

				it(`should return ${entry.expected} if input is ${entry.desc}`, function () {
					assert.strictEqual(canvasGraphObj.isInYRange(entry.input), entry.expected);
				});
			}

		})



		describe("clearGraph()", function () {
			//create a canvas for tests
			let canvas = document.createElement('canvas');
			//create array with minimum and maximum values set
			let canvasGraphObj = new GraphCanvas(canvas, [-20, 20, -15, 15]);

			it("should clear the entire canvas", function () {

				let graphSpy = sinon.spy(canvasGraphObj.ctx, "clearRect");

				canvasGraphObj.clearGraph();
				//check if ctx.clearRect is called with correct arguments
				assert(graphSpy.calledWith(0, 0, canvasGraphObj.canvasWidth, canvasGraphObj.canvasHeight));
				//remove spy wrapper
				graphSpy.restore();
			})
		})


		describe("updateRange( range )", function () {

			//create a canvas for tests
			let canvas = document.createElement('canvas');
			//create array with minimum and maximum values set
			let canvasGraphObj = new GraphCanvas(canvas, [-20, 20, -15, 15]);

			let spies;

			beforeEach(function () {
				//prepare spies
				spies = [
					sinon.spy(canvasGraphObj, "clearGraph"),
					sinon.spy(canvasGraphObj, "drawGrid"),
					sinon.spy(canvasGraphObj, "drawAxes"),
					sinon.spy(canvasGraphObj, "drawEquations")
				];

			});
			//destroy elements and objects after each function test
			afterEach(function () {

				for (spy of spies) {
					spy.restore()
				}

			});


			it("should update range of graph with range array", function () {

				let testRange = [-10, 10, -5, 5];
				canvasGraphObj.updateRange(testRange);

				assert.equal(canvasGraphObj.minX, -10, "minimum X  not set correctly");
				assert.equal(canvasGraphObj.maxX, 10, "maximum X not set correctly");
				assert.equal(canvasGraphObj.minY, -5, "minimum Y not set correctly");
				assert.equal(canvasGraphObj.maxY, 5, "maximum Y not set correctly");
			});

			it("should redraw graph", function () {
				//call updateRange
				canvasGraphObj.updateRange([-2, 2, -10, 10]);
				//check if it calls all spies
				for (let spy of spies) {
					assert(spy.called);
				}
			});


		})

		describe("drawEquation()", function () {

			//create a canvas for tests
			let canvas = document.createElement('canvas');
			//create array with minimum and maximum values set
			let canvasGraphObj = new GraphCanvas(canvas, [-20, 20, -15, 15]);

			let spies;

			beforeEach(function () {
				//prepare spies
				spies = new Map();
				for (property in canvasGraphObj.ctx) {

					//check if property is a function
					if (typeof canvasGraphObj.ctx[property] == "function") {
						//add spy to collection map
						spies.set(property, sinon.spy(canvasGraphObj.ctx, property));
					}
				}
			});
			//destroy spies each function test
			afterEach(function () {

				for (spy of spies.values()) {
					spy.restore()
				}

			});

			//it should save ctx first
			it("should save context before anything else", function () {
				console.log(spies.get("save").called);
				//call SUT
				canvasGraphObj.drawEquations();
				console.log(spies.get("save").called);
				assert(spies.get("save").called);

			})
		})



	})
	//THERMOMETER.JS
	describe("thermometer Guage", function () {
		describe("constructor( canvas, optionsObj )", function () {

		})
	})
})

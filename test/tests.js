describe("LearnTheTrade Unit Tests", function () {

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

		describe("getCoordVal( pixelCoordArr )", function () {
			//create a canvas for tests
			let canvas = document.createElement('canvas');
			//create array with minimum and maximum values set
			let canvasGraphObj = new GraphCanvas(canvas, [-20, 20, -15, 15]);

			let testCoordinates = [ //can be added to in the future
				{
					expected: [-20, -15],
					input: [0, canvasGraphObj.canvasHeight],
					desc: "bottom left corner",
				},
				{
					expected: [-20, 15],
					input: [0, 0],
					desc: "top left corner",
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
			canvas.width = canvas.height = 200;

			//create array with minimum and maximum values set
			let canvasGraphObj = new GraphCanvas(canvas, [-20, 20, -15, 15]);

			let spies;

			beforeEach(function () {
				//prepare spies for all CanvasRenderingContext2D methods
				spies = new Map();
				for (property in canvasGraphObj.ctx) {

					//check if property is a function
					if (typeof canvasGraphObj.ctx[property] == "function") {
						//add spy to collection map
						spies.set(property, sinon.spy(canvasGraphObj.ctx, property));
					}
				}
			});
			//destroy spies after each function test
			afterEach(function () {

				for (spy of spies.values()) {
					spy.restore()
				}

			});

			//it should save ctx first
			it("should save canvas-drawing-context", function () {
				//call SUT
				canvasGraphObj.drawEquations();

				assert(spies.get("save").calledBefore(spies.get("restore")), "context not saved before restore");

			})
			it("should draw a canvas that matches expected graph", function (done) {

				//prepare a canvas to draw on
				let canvas = document.createElement('canvas');
				canvas.width = 200;
				canvas.height = 200;

				//create an instance of CanvasGraph
				let canvasGraphObj = new GraphCanvas(canvas, [-10, 10, -10, 10]);
				//add equations 
				canvasGraphObj.equations = [
					//add test equations (order matters)
					(x) => x,
					(x) => x * x,
					(x) => {
						if (x) {
							return 1 / x
						} else {
							return "asymptote"
						}
					},

					(x) => Math.sqrt(1 - x ** 2),
					(x) => Math.abs(1 * x),
					(x) => (1 * Math.abs(Math.sin(x)))
				];

				//draw on canvas	
				//SUBJECT UNDER TEST
				canvasGraphObj.drawEquations()

				//test output against a predrawn image 
				pixelDiffTester(
					"sample_equations.png", //expected image source url
					canvasGraphObj.canvas, //cavas to be tested
					0, //number pixels tolerated if diferent 
					done //called at the end. called with error instance if test not passed

				)
			})
		})

		describe("drawAxes()", function () {

			//create a canvas for tests
			let canvas = document.createElement('canvas');
			//create array with minimum and maximum values set
			let canvasGraphObj = new GraphCanvas(canvas, [-20, 20, -15, 15]);

			let spies;

			beforeEach(function () {
				//prepare spies for all CanvasRenderingContext2D methods
				spies = new Map();
				for (property in canvasGraphObj.ctx) {

					//check if property is a function
					if (typeof canvasGraphObj.ctx[property] == "function") {
						//add spy to collection map
						spies.set(property, sinon.spy(canvasGraphObj.ctx, property));
					}
				}
			});
			//destroy spies after each function test
			afterEach(function () {

				for (spy of spies.values()) {
					spy.restore()
				}

			});

			it("should save canvas-drawing-context", function () {
				//call SUT
				canvasGraphObj.drawEquations();

				assert(spies.get("save").calledBefore(spies.get("restore")), "context not saved before restore");

			});

			it("should draw a canvas that matches expected graph", function (done) {

				//prepare a canvas to draw on
				let canvas = document.createElement('canvas');
				canvas.width = 200;
				canvas.height = 200;

				//create an instance of CanvasGraph
				let canvasGraphObj = new GraphCanvas(canvas, [-10, 10, -10, 10]);

				//draw on canvas
				//SUBJECT UNDER TEST
				canvasGraphObj.drawAxes()

				//test output against a predrawn image 
				pixelDiffTester(
					"sample_axes.png", //expected image source url
					canvasGraphObj.canvas, //cavas to be tested
					0, //number pixels tolerated if diferent 
					done //called at the end. called with error instance if test not passed

				)

			})



		})

		describe("drawGrid()", function () {
			//create a canvas for tests
			let canvas = document.createElement('canvas');
			//create array with minimum and maximum values set
			let canvasGraphObj = new GraphCanvas(canvas, [-20, 20, -15, 15]);

			let spies;

			beforeEach(function () {
				//prepare spies for all CanvasRenderingContext2D methods
				spies = new Map();
				for (property in canvasGraphObj.ctx) {

					//check if property is a function
					if (typeof canvasGraphObj.ctx[property] == "function") {
						//add spy to collection map
						spies.set(property, sinon.spy(canvasGraphObj.ctx, property));
					}
				}
			});
			//destroy spies after each function test
			afterEach(function () {

				for (spy of spies.values()) {
					spy.restore()
				}

			});

			it("should save canvas-drawing-context", function () {
				//call SUT
				canvasGraphObj.drawEquations();

				assert(spies.get("save").calledBefore(spies.get("restore")), "context not saved before restore");

			});

			it("should draw a canvas that matches expected graph", function (done) {

				//prepare a canvas to draw on
				let canvas = document.createElement('canvas');
				canvas.width = 200;
				canvas.height = 200;

				//create an instance of CanvasGraph
				let canvasGraphObj = new GraphCanvas(canvas, [-10, 10, -10, 10]);

				//draw on canvas
				//SUBJECT UNDER TEST
				canvasGraphObj.drawGrid()

				//test output against a predrawn image 
				pixelDiffTester(
					"sample_grid.png", //expected image source url
					canvasGraphObj.canvas, //cavas to be tested
					0, //number pixels tolerated if diferent 
					done //called at the end. called with error instance if test not passed

				)
			})
		})


	})

	//THERMOMETER.JS
	describe("Thermometer Guage", function () {

		describe("constructor( canvas, options )", function () {
			it("should create a guage with the given parameters ", function () {
				//create a canvas for tests
				let canvas = document.createElement('canvas');
				//a thermoGuageObject with options Object parameters set
				let thermoGuageObject = new ThermoGuage(canvas, {
					min: 0,
					max: 100
				});


				//test if the parameters are set correctly
				assert.equal(thermoGuageObject.canvas, canvas);
				assert.equal(thermoGuageObject.minC, 0);
				assert.equal(thermoGuageObject.maxC, 100);
			})

		})
		describe("clearGraph()", function () {
			//create a canvas for tests
			let canvas = document.createElement('canvas');
			//create array with minimum and maximum values set
			let thermoGuageObj = new ThermoGuage(canvas);

			it("should clear the entire canvas", function () {

				let ctxSpy = sinon.spy(thermoGuageObj.ctx, "clearRect");

				thermoGuageObj.clearCanvas();
				//check if ctx.clearRect is called with correct arguments
				assert(ctxSpy.calledWith(0, 0, thermoGuageObj.canvas.width, thermoGuageObj.canvas.height));
				//remove spy wrapper
				ctxSpy.restore();
			})
		})

		describe("drawGuageArc()", function () {

			it("its output should match expected image", function (done) {
				let canvas = document.createElement('canvas');
				canvas.width = 200;
				canvas.height = 200;
				//a thermoGuageObject with options Object parameters set
				let thermoGuageObject = new ThermoGuage(canvas)

				//SUBJECT UNDER TEST	
				thermoGuageObject.drawGuageArc()

				pixelDiffTester(
					"sample_guageArc.png", //expected output image
					thermoGuageObject.canvas, //actual output canvas
					0, //tolerance
					done //callback called with error if pixels are different than expected fails
				)

			})


		})
		describe("drawGuageNeedle()", function () {

			it("its output should match expected image", function (done) {
				let canvas = document.createElement('canvas');
				canvas.width = 200;
				canvas.height = 200;
				//a thermoGuageObject with options Object parameters set
				let thermoGuageObject = new ThermoGuage(canvas)

				//SUBJECT UDER TEST	
				thermoGuageObject.drawGuageNeedle()

				pixelDiffTester(
					"sample_guageNeedle.png", //expected output image
					thermoGuageObject.canvas, //actual output canvas
					0, //tolerance
					done //callback called with error instance if test fails
				)

			})


		})

	})
})

/*global helper functions*/

/*
 *pixelDiffTester
 *compares expected graph with one drawn by the function under test
 *and returns the number of pixels that are different 
 *@param {String} expectedImageUrl: url of the image of the expected graph
 *@param {CanvasElement} canvasUnderTest: canvas to be compared to the expected image
 *@param {number} tolerance: maximum number of different aceptable
 *@param {Function} done: callback function called with truthy value if test passed
 *						  and with a falsy value if test failed
 *MAKE SURE EXPECTED IMAGE AND CANVAS ARE BOTH 200px X 200px
 */
function pixelDiffTester(expectedImageUrl, canvasUnderTest, tolerance, done) {


	//test canvas to draw on 
	let testCanvas = document.createElement('canvas');
	testCanvas.width = 200;
	testCanvas.height = 200;

	//asycronously prepare predrawn canvas
	let promise = new Promise(function (resolve, reject) {

		//prepare canvas to hold image
		let expCanvas = document.createElement('canvas');
		expCanvas.id = "expCanvas";
		expCanvas.width = 200;
		expCanvas.height = 200;

		//retrieve expected image
		let img = new Image(200, 200);
		img.src = expectedImageUrl;
		//draw on canvas when loaded;
		img.onload = () => {
			expCanvas.getContext('2d').drawImage(img, 0, 0);
			resolve(expCanvas);
		};
	})


	//called asyncronously when expected graph is drawn
	promise.then((expCanvas) => {
		//get image data of canvases
		let expImgData = expCanvas.getContext('2d').getImageData(0, 0, 200, 200)

		let testImgData = canvasUnderTest.getContext('2d').getImageData(0, 0, 200, 200)

		//prepare canvas to hold differnce
		let diffCanvas = document.createElement('canvas');
		diffCanvas.width = 200;
		diffCanvas.height = 200;
		//expose image data for the differnce canvas 
		let diffCanvasData = diffCanvas.getContext('2d').getImageData(0, 0, 200, 200)

		//image data comparing API from "github.com/mapbox/pixelmatch"
		let diff = pixelmatch(

			expImgData.data, //expected output
			testImgData.data, //actual output
			diffCanvasData.data,
			200, //width of image data arrays
			200 //height of image data arrays
		)

		//put image data back in difCanvas for display
		diffCanvas.getContext('2d').putImageData(diffCanvasData, 0, 0)

		if (diff <= tolerance) {
			done();
		} else {
			done(new Error(`${diff} pixels drawn on canvas are different than expected`))
		}
	})
}

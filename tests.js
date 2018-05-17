describe("global functions", function(){
	describe("evalStr(string)", function(){
		describe("evaluates string as a mathmatical expression", function(){

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
	describe("floatFix(number, n)", function(){
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

/* NEED TO REFACTOR LATER THEN DO TESTS
desctibe("calulator", function(){

	desctibe("clicked( event )", function(){

		describe("perform arithmetics", function(){

			//create dummy event
			let dummyEvent = {};
			dummyEvent.target.value = 1 ; 

			it("should add the pressed value to expression", function(){


				assert.equal()

			} )

		})

	})

})*/
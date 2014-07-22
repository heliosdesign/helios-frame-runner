describe('frameRunner',function(){

	var frameRunner

	function check( done, f ) {
	  try {
	    f()
	    done()
	  } catch( e ) {
	    done( e )
	  }
	}

	describe('constructor',function(){

		it('can be constructed', function(){
			frameRunner = new heliosFrameRunner()
			expect( typeof frameRunner ).to.equal( 'object' )
		})

	})

	describe('fail gracefully', function(){

		it('shouldn’t allow missing arguments', function(){
			expect( frameRunner.add.bind() ).to.throw( Error )
		})

		it('shouldn’t allow invalid arguments', function(){
			expect( frameRunner.add.bind('name','array','NOT A FUNCTION') ).to.throw( Error )
		})

		it('shouldn’t allow functions to be overwritten',function(){
			frameRunner.add('test','everySecond',function(){})
			expect( frameRunner.add.bind( 'test','everySecond',function(){} ) ).to.throw( Error )
		})

	})

	describe('management',function(){

		it('should add a function to everySecond',function(){
			expect( frameRunner.add.bind('test','everySecond',function(){}) ).to.be.a('function')
			frameRunner.remove('test','everySecond')
		})

		it('should add a function to everyFrame',function(){
			expect( frameRunner.add('test','everyFrame',function(){}) ).to.be.a('function')
			frameRunner.remove('test','everyFrame')
		})

		it('destroyer function',function(){

			var destroyer = frameRunner.add('test','everyFrame',function(){})
			expect( frameRunner.add.bind( 'test','everyFrame', function(){} ) ).to.throw(Error)

			destroyer()
			expect( frameRunner.add.bind( 'test','everyFrame',function(){} ) ).to.be.a( 'function' )
		})
	})


	describe('operation',function(){

		it('starts and stops',function( done ){

			var testVal = 0

			var destroy = frameRunner.add('test', 'everyFrame', function(){
				testVal += 1

				expect( testVal ).to.be.at.least(1)

				frameRunner.stop()
				destroy()

				expect( testVal ).to.be.below(2)
				done()
			})

			frameRunner.start()
		})

		it('counts frames',function( done ){

			var destroy = frameRunner.add('test','everyFrame',function(){
				
				var frameCount = frameRunner.frameCount()

				if( frameCount >= 10 ){
					expect( frameCount ).to.be.at.least( 10 )
					done()

					destroy()
					frameRunner.stop()
				}
			})

			frameRunner.start()

		})

	})

})
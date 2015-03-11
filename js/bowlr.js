!(function($) {
	"use strict";
	$.extend({

		bowlr: new function() {

			var bl = this;

			bl.version = "1.0.0";

			bl.defaults = {

			}
			
			/* debuging utils */
			function log() {
				var a = arguments[0],
					s = arguments.length > 1 ? Array.prototype.slice.call(arguments) : a;
				if (typeof console !== "undefined" && typeof console.log !== "undefined") {
					console[ /error/i.test(a) ? 'error' : /warn/i.test(a) ? 'warn' : 'log' ](s);
				} else {
					alert(s);
				}
			}

			function benchmark(s, d) {
				log(s + " (" + (new Date().getTime() - d.getTime()) + "ms)");
			}

			bl.log = log;
			bl.benchmark = benchmark;


			/* private functions */





			/* public methods */

			// Set up the initial screen, some other values
			bl.init = function() {

			};

			// Start the new game with the parameters given
			bl.newgame = function(settings) {

			};
			
			// Round completed, move to the next round
			// EXCEPTION: Frame 10, which is also the last one gets an extra turn
			bl.nextround = function() {


			};

			
			// End the game
			bl.endgame = function() {


			};

			
			// End application
			bl.destroy = function() {


			};

		}()
	});

		
	// make shortcut
	var bl = $.bowlr;

	// extend plugin scope
	//$.fn.extend({
	//	bowlr: bl.newgame
	//});


})(jQuery);
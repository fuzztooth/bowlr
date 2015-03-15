!(function($) {
	"use strict";
	$.extend({

		enterFullscreen: function() {
			var ele = document.documentElement;

			bl.log("Warning: Entering fullscreen mode");

			if (ele.requestFullscreen) {
				ele.requestFullscreen();
			} else if (ele.webkitRequestFullscreen) {
				ele.webkitRequestFullscreen();
			} else if (ele.mozRequestFullScreen) {
				ele.mozRequestFullScreen();
			} else if (ele.msRequestFullscreen) {
				ele.msRequestFullscreen();
			} else {
				// Fallback
				bl.log('Fullscreen API is not supported.');
				return false;
			}

			return true;
		}

		,exitFullscreen: function() {

			bl.log("Warning: Leaving fullscreen mode");

			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else {
				// Fallback
				console.log('Fullscreen API is not supported.');
			}
		}
	});

	$.extend({
		bowlr: new function() {

			var bl = this;
			var currentScreen = null;
			var screensInDom = [];

			bl.version = "1.0.0";
			bl.inGame = false;
			bl.debug = false;
			bl.prefix = 'app-';

			bl.config = {
				 debug: false
				,prefix: 'bowlr'
			};

			bl.screens = {
				titlescreen: {
					 id: 'titlescreen'
					,css: 'titlescreen.css'
					,classes: 'title-screen'
					,content: ''
						+'<div class="title-content">'
						+'	<h1>Bowlr - A Bowling Scorekeeper</h1>'
							+'	<button class="btn btn-lg btn-primary" id="btn-new">New Game</button>'
						+'</div>'
					,binds: [
						['btn-new','click','prepareNewGame']
					]
					
					,animateIn: function() {
						$('#'+(bl.prefix)+'header').delay(1000).fadeIn(500);
						$('#'+(bl.prefix)+this.id).delay(500).fadeIn(500);
						$('#'+(bl.prefix)+'footer').delay(800).fadeIn(500);	
					}

					,animateOut: function() {
						console.log(this);
						$('#'+(bl.prefix)+this.id).delay(100).fadeOut(500);

					}
				}
			};

			bl.modals = {
				numberOfPlayers: {

				}
			}

			/* private functions */

			function addMenuItem(menuItem) {

			};

			function disableMenuItem(menuItem) {

			};

			function menuFunc(e) {
				e.preventDefault();
				var menuItem = this;
				var func = menuItem.dataset['execute'];

				if (typeof window.bowlr[func] == 'function')
				{
					bl.log("Executing "+func);
					var exec = window.bowlr[func];
					exec();

				} else {
					bl.log("Error: unable to find function "+func+" to execute");
				}

				$('#bowlr-menu').offcanvas('hide');
			}

			function buildMenu(menu) {

				bl.log("Creating menu...");

				var menuItemHTML = '';

				$.each(menu.items,function(i, item) {
					if (item[0] == '-'){
						menuItemHTML += '<li class="divider"></li>';
					} else {
						menuItemHTML += '<li><a href="#" data-execute="'+(item[2])+'"><i class="pull-right glyphicon glyphicon-'+(item[1])+'"></i>'+(item[0])+'</a></li>';
					}
				});

				// Build the menu itself
				$(document.body).prepend(''
					+ '<div id="'+(bl.prefix)+'menu" class="navmenu navmenu-default navmenu-fixed-'+(menu.config.openFrom)+' offcanvas">'
					+ '	<a class="navmenu-brand" href="#"><img src="assets/icons/'+(menu.config.icon)+'" />Bowlr</a>'
					+ '	<ul class="nav navmenu-nav">'
					+ menuItemHTML
					+ '	</ul>'
					+ '</div>'
				);
				
				// Build the menu toggle button
				$('#'+(bl.prefix)+'header').prepend(''
					+'<div id="'+(bl.prefix)+'navbar" class="navbar navbar-default navbar-fixed-top">'
					+'	<button type="button" class="navbar-toggle" data-toggle="offcanvas" data-target=".navmenu">'
					+'		<span class="icon-bar"></span>'
					+'		<span class="icon-bar"></span>'
					+'		<span class="icon-bar"></span>'
					+'	</button>'
					+'</div>'
				);
				
				// Bind the menu function delegator to every menu item
				$('#'+(bl.prefix)+'menu .navmenu-nav a').on('click',menuFunc);
			};

			function buildScreen(scrn) {

				var screen = bl.screens[scrn];

				if ($.inArray(scrn,screensInDom) == -1) {
					bl.log("Creating screen "+(screen.id)+"...");
					var containerElement = $(document.createElement('div'));
					
					containerElement[0].id = (bl.prefix)+screen.id;
					containerElement.addClass('container');
					containerElement.addClass('screen');
					containerElement.addClass(screen.classes);
					
					containerElement.html(screen.content);

					$('#'+(bl.prefix)+'footer').before(containerElement);
					
					if (screen.binds) {
						$.each(screen.binds,function(i, b) {
							if (window.bowlr[b[2]]){
								$('#'+b[0]).on(b[1],bl[b[2]]);
							}
						});
					}
				
					screensInDom.push(scrn);
				}

				currentScreen = scrn;

				screen.animateIn();
			};

			function hideScreen(scrn) {

				var screen = bl.screens[scrn];
				screen.animateOut();
			}

			function destroyScreen(scrn) {

				var screen = bl.screens[scrn];

				screen.animateOut();


			}

			function newGame(settings) {
				
				// Do any additional screen preparations

				// Show base scoreboard and bowl button
				
				bl.inGame = true;
			};

			function calcFrame(frameset) {


			};


			/* public methods */

			// Set up the initial screen, some other values
			bl.init = function(opts) {
				// Override the defaults
				$.extend( bl.config, opts.config );
				bl.debug = bl.config.debug;
				bl.prefix = bl.config.prefix + '-';

				window.bowlr = this;

				// Build the structure
				
				bl.log("Building structure...");

				$(document.body).prepend(''
					+'<header id="'+(bl.prefix)+'header"></header>'
					+'<footer id="'+(bl.prefix)+'footer"><div class="container text-center"><p class="text-muted">'+(opts.footerText)+'</p></div></footer>'
				);

				// Build the menu (including the menu button widget)
				buildMenu(opts.menu);

				// Build the title screen
				buildScreen('titlescreen');
				
				// Final initializations
				$('a').on("click",function(e){this.blur();});
				$('button').on("click",function(e){this.blur();});

				// We are loaded at this point
				$(document.body).removeClass('loading');				
			};

			// Start the new game with the parameters given
			bl.prepareNewGame = function() {
				//$.enterFullscreen();

				// Dump the title screen
				hideScreen(currentScreen);

				// Ask how many players

			}
			
			// Round completed, move to the next round
			// EXCEPTION: Frame 10, which is also the last one gets an extra turn
			bl.nextRound = function() {


			};
			
			// End the game
			bl.endGame = function() {


			};

			bl.quitApp = function() {
				//$.exitFullscreen();

				// Loop back to the start
				buildScreen('titlescreen');

				//bl.destroy();
				//window.close();
			}
			
			// End application
			bl.destroy = function() {


			};


			/************************************************/
			/* debugging utils */
			function log() {
				if (this.debug == true) {
					var a = arguments[0],
						s = arguments.length > 1 ? Array.prototype.slice.call(arguments) : a;
					if (typeof console !== "undefined" && typeof console.log !== "undefined") {
						console[ /error/i.test(a) ? 'error' : /warn/i.test(a) ? 'warn' : 'log' ](s);
					} else {
						alert(s);
					}
				}
			}

			function benchmark(s, d) {
				log(s + " (" + (new Date().getTime() - d.getTime()) + "ms)");
			}

			bl.log = log;
			bl.benchmark = benchmark;
		}()
	});

	$.fn.extend({
		

	});

	// make shortcut
	var bl = $.bowlr;

	// extend plugin scope
	//$.fn.extend({
	//	bowlr: bl.newgame
	//});


})(jQuery);
!(function($) {
	"use strict";

	// Main Application
	$.extend({
		bowlr: new function() {

			var bl = this;
			var currentScreen = null;
			var screensInDom = [];
			var modalsInDom = [];

			bl.version = "1.0.0";
			bl.inGame = false;
			bl.debug = false;
			bl.prefix = 'app-';

			bl.config = {
				 debug: false
				,prefix: 'bowlr-'
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
						$('#'+(bl.prefix)+this.id).delay(100).fadeOut(500);

					}
				}
			};

			bl.modals = {
				numberOfPlayers: {
					 id: 'modal-numplayers'
					,title: 'How Many Players?'
					,content: ''
						+'			<select class="form-control modal-select">'
						+'				<option value="">Players...</option>'
						+'				<option value="1">One</option>'
						+'				<option value="2">Two</option>'
						+'				<option value="3">Three</option>'
						+'				<option value="4">Four</option>'
						+'				<option value="5">Five</option>'
						+'				<option value="6">Six</option>'
						+'				<option value="7">Seven</option>'
						+'				<option value="8">Eight</option>'
						+'				<option value="9">Nine</option>'
						+'				<option value="10">Ten</option>'
						+'			</select>'

					,binds: [
						
					]
				}
			}

			/* private functions */

			function insertMenuItem(menuItem) {

			};

			function disableMenuItem(menuItem) {

			};

			function menuFunc(e) {
				e.preventDefault();
				var menuItem = this;
				var func = menuItem.dataset['execute'];

				if (typeof window.bowlr[func] == 'function' ||
					typeof window.jQuery[func] == 'function' ||
					typeof window[func] == 'function')
				{
					var exec = window.bowlr[func] || window.jQuery[func] || window[func];
					bl.log("Executing "+func);
					exec();

				} else {
					bl.log("Error: unable to find function "+func+" to execute");
				}

				$('#'+(bl.prefix)+'menu').offcanvas('hide');
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

				$('#'+(bl.prefix)+'menu').on('show.bs.offcanvas',function(e){
					$(document.body).addClass('menu-open');
				});
				$('#'+(bl.prefix)+'menu').on('hide.bs.offcanvas',function(e){
					$(document.body).removeClass('menu-open');
				});
								
				// Bind the menu function delegator to every menu item
				$('#'+(bl.prefix)+'menu .navmenu-nav a').on('click',menuFunc);
			};

			function buildScreen(scrn) {

				var screen = bl.screens[scrn];

				if ($.inArray(scrn,screensInDom) == -1) {
					bl.log("Creating screen "+(screen.id)+"...");

					var sid = (bl.prefix)+screen.id;
					var containerElement = $(document.createElement('section'))
						.addClass('container')
						.addClass('screen')
						.addClass(screen.classes)
						.html(screen.content);

					containerElement[0].id = sid;

					$('#'+(bl.prefix)+'footer').before(containerElement);

					bl.screens[scrn].element = $('#'+sid);

					$('#'+sid+' a').on("click",function(e){this.blur();});
					$('#'+sid+' button').on("click",function(e){this.blur();});					

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
				bl.log("Hiding screen "+scrn+"...");

				var screen = bl.screens[scrn];

				screen.animateOut();
			}

			function destroyScreen(scrn) {
				bl.log("Destroying screen "+scrn+"...");
				var screen = bl.screens[scrn];

				// Safely remove the screen from the DOM
				// (Is this safe memory-wise?)

				// Need to get animate functions to return a promise so I can animate before destroying
				screen.animateOut();
				window.setTimeout(function(){
					screen.element.remove();
					screen.element = null;
					screensInDom.remove(scrn);
				},2000);
			}

			function destroyAllScreens() {
				bl.log("Destroying all screens...");

			}

			function buildModal(mdl) {

				var m = bl.modals[mdl];

				if ($.inArray(mdl,modalsInDom) == -1) {
					bl.log("Creating modal "+(m.id)+"...");
					
					var mBody = '';
					var sid = (bl.prefix)+m.id;
					var containerElement = $(document.createElement('div'))
						.addClass('modal')
						.addClass('fade');

					mBody += ''
						+'<div class="modal-dialog">'
						+'	<div class="modal-content">'
						+'		<div class="modal-header">'
						+'			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
						+'			<h4 class="modal-title" id="myModalLabel"></h4>'
						+'		</div>'
						+'		<div class="modal-body">'
						+			m.content
						+'		</div>'
						+'		<div class="modal-footer">'
						+'			<button type="button" class="btn btn-primary">NEXT: Enter Names</button>'
						+'		</div>'
						+'	</div>'
						+'</div>';
					
					containerElement.html(mBody);
					
					containerElement[0].id = sid;

					$('#'+(bl.prefix)+'header').before(containerElement);

					$('#'+sid+' .modal-title').html(m.title);

					bl.modals[mdl].element = $('#'+sid).modal();

					$('#'+sid+' a').on("click",function(e){this.blur();});
					$('#'+sid+' button').on("click",function(e){this.blur();});					

					if (m.binds) {
						$.each(m.binds,function(i, b) {
							if (window.bowlr[b[2]]){
								$('#'+b[0]).on(b[1],bl[b[2]]);
							}
						});
					}
				
					modalsInDom.push(m);
				}
			}

			// This may not be necessary, but for completeness sake...
			function hideModal(mdl) {
				bl.log("Hiding modal "+mdl+"...");

				var m = bl.modals[mdl];

				m.element.modal('hide');
			}

			function destroyModal(mdl) {
				bl.log("Destroying modal "+mdl+"...");
				var m = bl.modals[mdl];

				m.element.modal('hide');
				// Safely remove the screen from the DOM
				// (Is this safe memory-wise?)

				// Can modal return a promise so I can do this after it's done hiding?
				window.setTimeout(function(){
					m.element.remove();
					m.element = null;
					modalsInDom.remove(mdl);
				},2000);
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
				bl.prefix = bl.config.prefix;
				
				// Add the game session object to the window
				window.bowlr = this;

				// Build the structure
				
				bl.log("Building structure...");

				var docBody = $(document.createDocumentFragment());
				var docHeader = document.createElement('header');
				var docFooter = document.createElement('footer');
					docHeader.id = (bl.prefix)+'header';
					docFooter.id = (bl.prefix)+'footer';
				
				$(docFooter).append($(document.createElement('div'))
							.addClass('container')
							.addClass('text-center')
							.append($(document.createElement('p'))
								.addClass('text-muted')
								.html(opts.footerText)
							)
				);

				docBody.append(docHeader)
					   .append(docFooter);

				$(document.body).append(docBody);

				// Build the menu (including the menu button widget)
				buildMenu(opts.menu);

				// Final global initializations
				$('a').on("click",function(e){this.blur();});
				$('button').on("click",function(e){this.blur();});

				// Build the title screen
				buildScreen('titlescreen');

				$(document.body).removeClass('loading');

				// We are loaded at this point
				window.setTimeout(function(){
					$(document.body).addClass('loaded');
				},1500);
			};

			// Start the new game with the parameters given
			bl.prepareNewGame = function() {
				//$.enterFullscreen();

				// Ask how many players
				buildModal('numberOfPlayers');
			}
			
			// Round completed, move to the next round
			// EXCEPTION: Frame 10, which is also the last one gets an extra turn
			bl.nextRound = function() {


			};
			
			// End the game
			bl.endGame = function() {


			};

			bl.restartApp = function() {
				//$.exitFullscreen();

				bl.inGame = false;

				// Loop back to the start
				buildScreen('titlescreen');
			}

			bl.quitApp = function() {
				//$.exitFullscreen();

				bl.inGame = false;

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
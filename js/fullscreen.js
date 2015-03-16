!(function($) {
	"use strict";

	// Fullscreen Extension
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

		,toggleFullscreen: function() {
			var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;

			if (!fullscreenEnabled){
				window.alert('Your browser cannot go into full screen mode.');
			} else {

				if (!$.isFullscreen()) {
					$.enterFullscreen();
				} else {
					$.exitFullscreen();
				}
			}
		}

		,isFullscreen: function() {
			return ((document.fullscreenElement && document.fullscreenElement !== null) ||
				document.mozFullScreen || document.webkitIsFullScreen);

		}
	});

})(jQuery);
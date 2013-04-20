$(document).ready( function() {

	var fingers = false;
	var granularity = 100000;
	
	var cursorState = { x: 0, y: 0 };
	var cursorDelta = { x: 0, y: 0 };


	var overviewContainer = $('#container'),
		overviewContainerWidth = overviewContainer.width(),
		overviewContainerLocation = 0,
		overviewContainerOffset = 0;

	var overviewHandle = $('#handle'),
		overviewHandleWidth = $('#handle').width();
		overviewHandleOffset = 0,
		overviewHandle.moving = false;

	
	var range_begin = 1,
		range_ends  = 1800;


	var overviewRatio = Math.round( ((range_ends - range_begin) / (overviewContainerWidth - overviewHandleWidth)) * granularity) / granularity;
	var overviewFrame = 0;
	
	var debugOutput = $('#position');


	/* And in the Darkness; Bind them! */
	$(overviewHandle).on('mousedown', grabHandle);
	$(document).on('mousemove', dragHandle );
	$(document).on('mouseup', function() {
		releaseHandle();
	});


	/* Moving the Overview Handle */
	function grabHandle(e) {

		e.preventDefault();

		if (!overviewHandle.moving) {

			overviewHandle.moving = true;

			cursorState.x = (fingers) ? e.originalEvent.pageX : e.pageX;

			overviewContainerOffset = overviewContainer.offset();
		}
	}

	function dragHandle(e) {

		if (overviewHandle.moving) {
			cursorDelta.x = (fingers) ? e.originalEvent.pageX - cursorState.x : e.pageX - cursorState.x;
	
			// Where is Handle?
			overviewHandleOffset = overviewHandle.offset();
	
			// Bound to Left and Right Extents of Overview Selection
			leftBounds  = (overviewContainerOffset.left);
			rightBounds = (overviewContainerOffset.left + overviewContainerWidth - overviewHandleWidth);
	
			// Constrain to Left & Right Bounds of Overview Container
			proposedLeft = ((overviewHandleOffset.left + cursorDelta.x) <= leftBounds)  ? leftBounds  : overviewHandleOffset.left + cursorDelta.x;
			proposedLeft = ((overviewHandleOffset.left + cursorDelta.x) >= rightBounds) ? rightBounds : proposedLeft;
	
	
			// Position the Overview Handle on Screen
			overviewHandle.offset({ left: proposedLeft });
	
			// How Far from Left is the Handle?
			overviewContainerLocation = parseFloat(overviewHandleOffset.left - overviewContainerOffset.left);
	
			// Each Pixel Represents X frames...
			overviewFrame = Math.round( overviewRatio * overviewContainerLocation ) + range_begin;
	
			debugOutput.html(overviewFrame);
	
			cursorState.x = (fingers) ? e.originalEvent.pageX : e.pageX;
		}
	}
	
	function releaseHandle() {
		overviewHandle.moving = false;
	}

})
(jQuery)(function () {

	var fingers = false;
	var granularity = 100000;
	
	var cursorState = { x: 0, y: 0 };
	var cursorDelta = { x: 0, y: 0 };

	var position = $('#position');

	var overviewContainer = $('#container'),
		overviewContainerWidth = overviewContainer.width(),
		overviewContainerLocation = 0,
		overviewContainerOffset = 0;

	var overviewHandle = $('#handle'),
		overviewHandleWidth = $('#handle').width();
		overviewHandleOffset = 0,
		overviewHandle.moving = false;

	var overviewRatio = 0;
	var overviewFrame = 0;
	
	
	var startFrame = 1,
		numFrames = 1800;


	$(overviewHandle).on('mousedown', grabOverviewHandle);
	$(document).on('mousemove', function(e) {
		if (overviewHandle.moving) { dragOverviewHandle(e); }
	});
	$(document).on('mouseup', function() {
		releaseOverviewHandle();
	});


	/* Moving the Overview Handle */
	function grabOverviewHandle(e) {

		e.preventDefault();

		if (!overviewHandle.moving) {

			overviewHandle.moving = true;

			cursorState.x = (fingers) ? e.originalEvent.pageX : e.pageX;

			overviewContainerOffset = overviewContainer.offset();
		}
	}

	function dragOverviewHandle(e) {

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
		overviewContainerLocation = (overviewHandleOffset.left - overviewContainerOffset.left);

		// Each Pixel Represents X frames...
		overviewRatio = Math.round( (numFrames / (overviewContainerWidth - overviewHandleWidth)) * granularity) / granularity;

		overviewFrame = Math.round( overviewRatio * overviewContainerLocation );

		position.html(overviewContainerLocation);

		cursorState.x = (fingers) ? e.originalEvent.pageX : e.pageX;
	}

	function releaseOverviewHandle() {
		overviewHandle.moving = false;
	}

})
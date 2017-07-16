interface Point {
	x:number,
	y:number
}
function equalPoints(p:Point, q:Point):boolean {
        return p.x === q.x && p.y === q.y;
	}
	
function sign(n:number):number {
    if (n > 0) {
        return 1;
    } else if (n === 0) {
        return 0;
    } else {
        return -1;
    }
}

// from: https://davidwalsh.name/javascript-debounce-function
//
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate?) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

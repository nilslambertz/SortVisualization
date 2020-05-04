// variables
var array; // main array
var hilfsArray; // array used to first sort and save the changes/swaps made
var divs; // array with all the divs which represent the elements of 'array'
var sorting = false; // is the animation currently playing
var stop = false; // is the stop button currently pressed
var swapCreated = false; // has the sort been done by the chosen algorithm
var changed = []; // array e.g. for bubblesort, which shows all swaps in current iteration
var swap = []; // all swaps that have been done for the sorting are in here, saved as arrays
var save = []; // if you need two steps for an animation, the needed information is stored here
var test = 0; // saves last looked at index
var width = 10; // width of the divs
var margin = 7; // margin between the divs
var round = 3; // amout of rounding the corners
var algoNumber = 0; // which algorithm is chosen, 0 = bubbleSort, 1 = mergeSort, 2 = insertionSort, 3 = quickSort
var maxNumber = 600; // highest number that can appear in the array (is also the max height of the divs)
var schritt = 0; // for two-step-animations, it saves if we are in the first or second step
var time = 0; // used to save the time it took to sort
var fail = false; // if something went wrong, the animation stops

// Initialize Sliders
range = $('#anzahlSlider');
value = $('#sliderValue');
speed = $('#speedSlider');

// setting defaults

rangeSlider();
var interval = 0;
createArray(parseInt(document.getElementById("anzahlSlider").value));
var interval = parseInt(document.getElementById("speedSlider").value);

// 

function rangeSlider() {
    range.each(function () {
       var value = $(this).prev().attr('value');
       $(this).html(value);
    });

    range.on('input', function () {
        $(this).next(value).html(this.value);
    });
};

document.getElementById('titel').onclick = function () {
    window.location.href = "https://nilslambertz.github.io";
}

document.getElementById('explosionSort').onclick = function () {
    if (sorting && !stop) {
        return;
    }
	
	// Rickroll :-)
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
}

document.getElementById('sortDiv').onclick = function (e) {
	// copy 'array' to 'hilfsArray'
    hilfsArray = array.slice(0);
	
	// update interval
    interval = parseInt(document.getElementById("speedSlider").max) - parseInt(document.getElementById("speedSlider").value);
	
	// if array is already sorted, do nothing
    if (checkSorted() == 0) {
        stop = false;
        sorting = false;
        return;
    }
	
	// if currently sorting, stop sorting and make buttons visible
    if (sorting && !stop) {
        stop = true;
        changeStyle(true);
        return;
    } else {
		// currently not sorting
	
		// if sort hasn't been done, sort 'hilfsArray' and save the steps to 'swap' 
        if (!swapCreated) {
            swap = [];
            time = 0;
            var startTime = 0;
            var endTime = 0;
            switch (algoNumber) {
				// BubbleSort
                case 0: {
                    startTime = performance.now();
                    bubbleSort();
                    endTime = performance.now();
                    break;
                }
				// MergeSort
                case 1: {
                    startTime = performance.now();
                    mergeSort(0, array.length - 1);
                    endTime = performance.now();
                    swap = swap.reverse();
                    break;
                }
				// InsertionSort
                case 2: {
                    startTime = performance.now();
                    insertionSort();
                    endTime = performance.now();
                    break;
                }
				// wrong algoNumber, return
                default: {
                    alert("Not implemented (yet)");
					return;
                }
            }
            swapCreated = true;
            time = endTime - startTime;
          //  document.getElementById("sortingTimeSpan").innerHTML = time.toFixed(2) + "ms";
        }
		
		// make buttons invisible
        changeStyle(false);
        stop = false;
        sorting = true;

		// start animation for current algorithm
        switch (algoNumber) {
            case 0: {
                bubbleSortAnimation();
                break;
            }
            case 1: {
                interval += 60;
                mergeSortAnimation();
                break;
            }
            case 2: {
                insertionSortAnimation();
                break;
            }
            default: {
                alert("Not implemented (yet)");
				return;
            }
        }
    }
};
 
document.getElementById('stepDiv').onclick = function (e) {
	// copy 'array' to 'hilfsArray'
    hilfsArray = array.slice(0);
	
	// if currently sorting or already sorted, return
    if ((sorting && !stop) || checkSorted() == 0) {
        return;
    }

	// do one step with current algorithm
    switch (algoNumber) { 
        case 0: bubbleSortStepByStep(); break;
        case 1: mergeSortStepByStep(); break;
		case 2: insertionSortStepByStep(); break;
        default: {
            alert("Not implemented (yet)");
        }
    }
};


{
/*
document.getElementById('instantSortDiv').onclick = function () {
	// if currently sorting
    if (sorting && !stop) {
        return;
    }

    hilfsArray = array.slice(0);
    var startTime = 0;
    var endTime = 0;
    time = 0;
	
	// sort 'hilfsArray' and copy it into 'array'
    switch (algoNumber) {
        case 0: {
            startTime = performance.now();
            bubbleSort();
            endTime = performance.now();
            array = hilfsArray.slice(0);
            break;
        }
        case 1: {
            startTime = performance.now();
            mergeSort(0, array.length - 1);
            endTime = performance.now();
            array = hilfsArray.slice(0);
            break;
        }
        case 2: {
            startTime = performance.now();
            insertionSort();
            endTime = performance.now();
            array = hilfsArray.slice(0);
            break;
        }
		case 3: {
			startTime = performance.now();
            quickSort(0, array.length - 1);
            endTime = performance.now();
            array = hilfsArray.slice(0);
            break;
		}
        default: {
            alert("Not implemented (yet)");
        }
    }
	
	// draw 'array'
    drawArray();
    time = endTime - startTime;
    document.getElementById("sortingTimeSpan").innerHTML = time.toFixed(2) + "ms";
}
*/
}

document.getElementById('bubbleSortDiv').onclick = function () {
	// if currently sorting, return
    if (sorting && !stop) {
        return;
    }
	
    changed = [];
    swapCreated = false;
	schritt = 0;
    swap = [];
	
	// underline bubbleSort, change 'algoNumber' and draw the 'array'
    for (var i of document.getElementsByClassName("leftNavElem")) {
        i.style.textDecoration = "none";
    }
    document.getElementById("bubbleSortDiv").style.textDecoration = "underline";
    algoNumber = 0;
    drawArray();
}

document.getElementById('mergeSortDiv').onclick = function () {
	// if currently sorting, return
    if (sorting && !stop) {
        return;
    }
	
    changed = [];
    swapCreated = false;
	schritt = 0;
    swap = [];
	
	// underline mergeSort, change 'algoNumber' and draw the 'array'
    for (var i of document.getElementsByClassName("leftNavElem")) {
        i.style.textDecoration = "none";
    }
    document.getElementById("mergeSortDiv").style.textDecoration = "underline";
    algoNumber = 1;
    drawArray();
}

document.getElementById('insertionSortDiv').onclick = function () {
	// if currently sorting, return
    if (sorting && !stop) {
        return;
    }
	
    changed = [];
    swapCreated = false;
	schritt = 0;
    swap = [];
	
	// underline insertionSort, change 'algoNumber' and draw the 'array'
    for (var i of document.getElementsByClassName("leftNavElem")) {
        i.style.textDecoration = "none";
    }
    document.getElementById("insertionSortDiv").style.textDecoration = "underline";
    algoNumber = 2;
    drawArray();
}

document.getElementById("quickSortDiv").onclick = function() {
	// if currently sorting, return
	if (sorting && !stop) {
        return;
    }
	
    changed = [];
    swapCreated = false;
	schritt = 0;
    swap = [];
	
	// underline quickSort, change 'algoNumber' and draw the 'array'
    for (var i of document.getElementsByClassName("leftNavElem")) {
        i.style.textDecoration = "none";
    }
    document.getElementById("quickSortDiv").style.textDecoration = "underline";
    algoNumber = 3;
    drawArray();
}

// returns the lowest index of an array, where all following elements are sorted
function checkSorted(a = array) {
    var firstSorted = 0;
    for (var i = 1; i < a.length; i++) {
        if (Math.max(...a.slice(0, i)) > a[i]) {
            firstSorted = i + 1;
        } 
    }
    return firstSorted;
};

document.getElementById('createArrayDiv').onclick = function (e) {
	// if currently sorting
    if (sorting && !stop) {
        return;
    }
	
	// create new array
    var wert = document.getElementById("anzahlSlider").value;
    createArray(parseInt(wert));
	
	changeStyle(true);
};


// Bubblesort

function bubbleSort() {
    for (var n = hilfsArray.length; n > 1; n--) {
        for (var i = 0; i < n - 1; i++) {			
			// schema: [firstIndex, secondIndex, tauschen]
			// irgendwann mal ändern zu [ersterIndex, tauschen], da 'zweiterIndex' immer 'ersterIndex + 1'
            var a = [i, false];
            if (hilfsArray[i] > hilfsArray[i + 1]) {
                var temp = hilfsArray[i];
                hilfsArray[i] = hilfsArray[i + 1];
                hilfsArray[i + 1] = temp;
                a = [i, true];
            }
            swap.push(a);
        }
    }
	
	// reverse 'swap', so the order is correct again
    swap = swap.reverse();
    swapCreated = true;
}

function bubbleSortAnimation() {
    var sortingInterval = setInterval(function () {
		// if array is sorted or stop is pressed, make buttons visible and return
        if (checkSorted() == 0 || stop || fail) {
            changeStyle(true);
            clearInterval(sortingInterval);
			fail = false;
            return;
        }
		
		// do one step 
		bubbleSortStepByStep();
    }, interval);
    return; 
}

function bubbleSortStepByStep() {
    if (!swapCreated) {
        bubbleSort(); 
        swapCreated = true;
    }

	// if elements must not be swapped
    if (schritt % 2 == 0) {
		// get the next element
        var a = swap.pop();
		
		// if swap is empty, but the array still isn't sorted
		if(a == null) {
			alert("Something went wrong!");
			fail = true;
			return;
		}
		
        var firstIndex = a[0];
        save[0] = firstIndex;
		
		// if next iteration
        if (firstIndex < test) {
            changed = [];
        }
		
        drawArray(a);
		
		// if elements must be swapped, swap them and increase 'schritt'
        if (a[1]) {
            var temp = array[firstIndex];
            array[firstIndex] = array[firstIndex+1];
            array[firstIndex+1] = temp;
            test = firstIndex;
            schritt++;
        }
    } else {
		// draw array with swapped elements and add the swapped element to 'changed'
        drawArray([save[0], save[0]+1]);
        changed.push(save[0]);
        schritt++;
    }

	// if the array is sorted
    if (checkSorted() == 0 || stop) {
        changeStyle(true);
    }
}

function drawArrayBubbleSort(a) {
    var sorted = checkSorted();
	
	// every element before the sorted part of the array
    for (var i = 0; i < sorted; i++) {
        farbe = "";
        div = divs[i];
        wert = array[i];
        document.getElementById('content').appendChild(divs[i]);

        if (a[0] == i) {
			// highlight first index
            farbe = "#4169E1";
        } else {
            if (a[0]+1 == i) {
				// highlight second index
                farbe = "#00B2EE";
            } else {
				// every other element is grey
                farbe = "#7D7D7D";
            }
        }
	
		// if element has been swapped, highlight it with orange color
		if (changed.includes(i)) {
            farbe = "#FF8C00";
        }
        setDiv(div, wert, farbe, false);
    }
	
	// every already sorted element is green
    for (var i = sorted; i < array.length; i++) {
        document.getElementById('content').appendChild(divs[i]);
        setDiv(divs[i], array[i], "#3CB371");
    }
}


// Mergesort

function mergeSort(l, r) {
    if (r - l == 0) {
        // nothing to do
    } else {
        if (r - l == 1) {
			// schema: [firstIndex, secondIndex, needToBeSwapped, null, null, null, false]
            var a = [l, r, false, null, null, null, false];
            if (hilfsArray[l] > hilfsArray[r]) {
                var temp = hilfsArray[l];
                hilfsArray[l] = hilfsArray[r];
                hilfsArray[r] = temp;
                a = [l, r, true, null, null, null, false];
            }
            swap.push(a);
        } else {
            var i = Math.floor((r + l) / 2);
			// schema: [null, null, false, leftBorder, rightBorder, mid, false]
			var a = [null, null, false, l, r, i, false];
			swap.push(a);
            mergeSort(l, i-1);
            mergeSort(i, r);
            merge(l, r, i);
        }
    }
}

function merge(l, r, mid) {
    var j = mid;
    while (j <= r) {
		// schema: [firstIndex, SecondIndex, false, leftBorder, rightBorder, middle, moved];
        var a = [j, j-1, false, l, r, j+1, false];
		// if smallest element of the second half is smaller than the biggest element of the first half
        if (hilfsArray[j] < hilfsArray[j - 1]) {
            var firstBigger = l;
			// find first bigger element in the second half
            for (var x = l; x < j; x++) {
                if (hilfsArray[x] > hilfsArray[j]) {
                    firstBigger = x;
                    break;
                } 
            }
			// move every element one place "to the right" and put the current element in the empty space
            for (var x = j; x > firstBigger; x--) {
                var temp = hilfsArray[x];
                hilfsArray[x] = hilfsArray[x - 1];
                hilfsArray[x - 1] = temp;
            }
			// now we moved the elements
            var a = [firstBigger, j, false, l, r, j+1, true];
        }
        swap.push(a);
        j++;
    }

}

function mergeSortAnimation() {
    var sortingInterval = setInterval(function () {
		// if array is sorted or stop is pressed, make buttons visible and return
        if (checkSorted() == 0 || stop || swap.length == 0) {
            clearInterval(sortingInterval);
            changeStyle(true);
            return;
        }

		// do one step 
        mergeSortStepByStep();
    }, interval);
    return;
}

function mergeSortStepByStep() {	
	if (!swapCreated) {
        mergeSort(0, array.length - 1);
        swap = swap.reverse();
        swapCreated = true;
    }
	
	if (schritt % 2 == 0) {
        var a = swap.pop();
        var firstIndex = a[0];
        var secondIndex = a[1];
		var left = a[3];
		var mid = a[4];
		var right = a[5];
        save[0] = firstIndex;
        save[1] = secondIndex;
		save[2] = left;
		save[3] = mid;
		save[4] = right;
		
		
        if (a[6]) {
            var firstBigger = firstIndex;
            var j = secondIndex;
            for (var x = j; x > firstBigger; x--) {
                var temp = array[x];
                array[x] = array[x - 1];
                array[x - 1] = temp;
            }
            drawArray([null, null, a[3], a[5], a[4]]);
        } else {
            drawArray([a[0], a[1], a[3], a[5], a[4]]);
            if (a[2]) {
                schritt++;
            }
		}
    } else {
        var temp = array[save[0]];
        array[save[0]] = array[save[1]];
        array[save[1]] = temp;
        drawArray([save[1], save[0], save[2], save[4], save[3]]);
		schritt++;
    }
	
		
	if (checkSorted() == 0 || stop) {
        changeStyle(true);
    }
}

function drawArrayMergeSort(a) {
    var sorted = checkSorted();
    if(sorted == 0) {
        for (var i = 0; i < array.length; i++) {
            document.getElementById('content').appendChild(divs[i]);
            setDiv(divs[i], array[i], "#3CB371");
        }
        return;
    }

    for (var i = 0; i < array.length; i++) {
        farbe = "";
        div = divs[i];
        wert = array[i];
        document.getElementById('content').appendChild(divs[i]);
		
		if (a[2] != null) {
            if (a[2] <= i && i < a[3]) {
				farbe = "#FFA54F";
            } else {
                if (a[3] <= i && i <= a[4]) {
                    farbe = "#EE7621";
                } else {
                    farbe = "#7D7D7D";
                }
            }
        } else {
			if (a[0] == i) {
				farbe = "#4169E1";
			} else {
				if (a[1] == i) {
					farbe = "#00B2EE";
				} else {
					farbe = "#7D7D7D";
				}
			}
        }
		
		setDiv(div, wert, farbe, false);
    }
}


// InsertionSort

function insertionSort() {
    for(var i = 0; i < hilfsArray.length; i++) {
		swap.push([i]);
        var temp = hilfsArray[i];
        var j = i;
		// find correct position in the part of the array that is left from the current element and put it there
        while(j > 0 && hilfsArray[j-1] > temp) {
            hilfsArray[j] = hilfsArray[j-1];
            j--;
        }
		swap.push([i, j]);
        hilfsArray[j] = temp;
    }
    swap = swap.reverse();
    swapCreated = true;
}

function insertionSortAnimation() {
	var sortingInterval = setInterval(function () {
		// if array is sorted or stop is pressed, make buttons visible and return
        if (checkSorted() == 0 || stop) {
            changeStyle(true);
            clearInterval(sortingInterval);
            return;
        }

        // do one step 
        insertionSortStepByStep();
    }, interval);
    return; 
}

function insertionSortStepByStep() {
	if (!swapCreated) {
        insertionSort();
        swapCreated = true;
    }

    var a = swap.pop();
    var index = a[0];
	var pos = a[1]; 
	if(pos != null) {
		var temp = array[index];
		var j = index;
		while(array[j-1] > temp) {
			array[j] = array[j-1];
			j--;
		}
		array[j] = temp;
	}
    drawArray(a);

    if (checkSorted() == 0 || stop) {
        changeStyle(true);
    }
}

function drawArrayInsertionSort(a) {
    for (var i = 0; i < array.length; i++) {
        farbe = "";
        div = divs[i];
        wert = array[i];
        document.getElementById('content').appendChild(divs[i]);

        if (a[0] == i && a[1] != i && a[1] == null) {
			farbe = "#4169E1";
        } else {
			if(a[1] == i) {
				farbe = "red";
			} else {
				farbe = "#7D7D7D";
			}
        }
        setDiv(div, wert, farbe, false);
    }
}	


// QuickSort 

function quickSort(l, r) {
	if(l >= r) {
		return;
	}
	var j = partition(l, r);
	var a = [true, l, j, r];
	swap.push(a);
	quickSort(l, j-1);
	quickSort(j+1, r);
}

function partition(l, r) {
	var x = hilfsArray[l];
	var i = l+1;
	var j = r;
	do {
		while(i <= r && hilfsArray[i] <= x) {
			var a = [false, i, r, l, false]; 
			i++;
		}
		while(j >= l-1 && hilfsArray[j] > x) {
			j--
		}
		if(i < j) {
			var temp = hilfsArray[i];
			hilfsArray[i] = hilfsArray[j];
			hilfsArray[j] = temp;
			i++;
			j--;
		}
 	} while(i <= j)
	var temp = hilfsArray[j];
	hilfsArray[j] = hilfsArray[l];
	hilfsArray[l] = temp;
	return j;
}

function quickSortStepByStep() {
    if (!swapCreated) {
        quickSort(0, array.length - 1);
        swapCreated = true;
    }

    var a = swap.pop();
    var index = a[0];
	var pos = a[1]; 
	if(pos != null) {
		var temp = array[index];
		var j = index;
		while(array[j-1] > temp) {
			array[j] = array[j-1];
			j--;
		}
		array[j] = temp;
	}
    drawArray(a);

    if (checkSorted() == 0 || stop) {
        changeStyle(true);
    }
}

// :D

function changeStyle(visible) {
	// if buttons should be visible
    if (visible) {
        sorting = false;
		
		// set the properties of the sortButton
        document.getElementById('sortDiv').innerHTML = 'sort';
        document.getElementById('sortDiv').classList.remove("sorting");
        document.getElementById('sortDiv').classList.remove("sorted");
        document.getElementById('sortDiv').classList.add("notSorting");
		
		// change the opacity of the buttons on the top and set a pointer-cursor for the buttons
        for (var i of document.getElementsByClassName("navElem")) {
            i.style.opacity = "1";
            if (i !== document.getElementById("speedSliderDiv") && i !== document.getElementById("elemSliderDiv")) {
                i.style.cursor = "pointer";
            }
        }
		
		// enable the sliders
        document.getElementById("speedSlider").disabled = false;
        document.getElementById("anzahlSlider").disabled = false;
		
		// change the opacity of the buttons on the left
        for (var i of document.getElementsByClassName("leftNavElem")) {
            if (i !== document.getElementById("sortDiv")) {
                i.style.opacity = "1";
                i.style.cursor = "pointer";
            }
        }
		
		// if array ist sorted, make the sortButton grey
        if (checkSorted() == 0) {
            drawArray();
			document.getElementById('sortDiv').classList.remove("notSorting");
			document.getElementById('sortDiv').classList.add("sorted");	
			document.getElementById('sortDiv').style.cursor = "default";
			document.getElementById('sortDiv').innerHTML = "sorted";
        }
        return;	
    } else {
        sorting = true;
        document.getElementById('sortDiv').innerHTML = 'stop';
        document.getElementById('sortDiv').classList.remove("notSorting");
        document.getElementById('sortDiv').classList.add("sorting");
        for (var i of document.getElementsByClassName("navElem")) {
            i.style.opacity = "0.2";
            i.style.cursor = "default";
        }
        document.getElementById("speedSlider").disabled = true;
        document.getElementById("anzahlSlider").disabled = true;
        for (var i of document.getElementsByClassName("leftNavElem")) {
            if (i !== document.getElementById("sortDiv")) {
                i.style.opacity = "0.2";
                i.style.cursor = "default";
            }
        }
    }
}

function createArray(anzahl) {
    time = 0;
    //document.getElementById("sortingTimeSpan").innerHTML = time.toFixed(2) + "ms";
    stop = false;
    sorting = false;
    schritt = 0;
    swapCreated = false;
    changed = [];
    swap = [];
    save = [];

    if (anzahl > maxNumber) {
        anzahl = maxNumber;
        console.log("Too many elements. Elements set to " + anzahl);
    }
	    
    n = anzahl;
    i = 0;
    changed = [];
    if (anzahl < 20) {
        margin = 5;
        width = 40;
        round = 4;
		//document.getElementById("content").style.minWidth = "1000px";
    } else {
        if (anzahl < 50) {
            margin = 4;
            width = 9;
            round = 2;
        } else {
            if (anzahl < 100) {
                margin = 3;
                width = 7;
                round = 2;
            } else {
                if (anzahl < 150) {
                    margin = 2;
                    width = 5;
                    round = 1;
                } else {
                    if (anzahl < 200) {
                        margin = 1;
                        width = 4;
                        round = 1;
                    } else {
                        if (anzahl < 250) {
                            margin = 1;
                            width = 3;
                            round = 0;
                        } else {
							if(anzahl < 400) {
								margin = 1;
								width = 2;
								round = 0;
							} else {
								margin = 0;
								width = 2;
								round = 0;
							}
                        }
                    }
                }
            }
        }

    }

    var a = Array(anzahl);
    var d = Array(anzahl);
	
	var tempArray = Array(maxNumber);
	var elems = maxNumber;
	for(var i = 0; i < maxNumber; i++) {
		tempArray[i] = i+10;
	}
	
	for(var i = 0; i < anzahl; i++) {
		var index = Math.round(Math.random() * (elems-1));
		elems--;
		a[i] = tempArray[index];
		tempArray.splice(index, 1);
	}
	
	for(var i = 0; i < anzahl; i++) {
		var temp = document.createElement('div');
        temp.setAttribute('id', i);
        d[i] = temp;
	}
	
    array = a;
    divs = d;
    drawArray();
    hilfsArray = array.slice(0);
};

function setDiv(div, height, farbe, visible) {
    div.style.color = (visible ? "white" : farbe);
    div.style.fontSize = (visible ? 20 : 0) + "px";
    div.style.fontFamily = "Arial";
    div.style.height = height + "px";
    div.style.width = width + "px";
    div.style.backgroundColor = farbe;
    div.style.marginRight = margin + "px";
    div.style.display = "inline-block";
    div.style.verticalAlign = "top";
    div.style.borderRadius = "0px 0px " + round + "px " + round + "px";
};

function drawArray(a) {
    document.getElementById('content').innerHTML = '';
    if(a == null) {
        drawArrayDefault();
        return;
    }
    switch(algoNumber) {
        case 0: {
            drawArrayBubbleSort(a);
            break;
        }
        case 1: {
            drawArrayMergeSort(a);
            break;
        }
        case 2: {
            drawArrayInsertionSort(a);
            break;
        }
        default: {
            console.log("Error");
            drawArrayDefault();
            break;
        }
    }
}

function drawArrayDefault() {
    var farbe = (checkSorted() == 0 ? "#3CB371" : "#7D7D7D");
    for (var i = 0; i < array.length; i++) {
        div = divs[i];
        wert = array[i];
        document.getElementById('content').appendChild(divs[i]);
        setDiv(div, wert, farbe, false);
    }
}

function testSort(v = 100, l = 100) {
    if(l > 600) {
        console.log("Maximal 600 Elemente m" + unescape("%F6") + "glich!");
        l = 600;
    }
    if(l < 2) {
        console.log("Mindestens zwei Elemente erforderlich!");
        l = 2;
    }

    var versuche = v;
    var laenge = l;
    var startTime = 0;
    var endTime = 0;
    var zeit = 0;
    var korrekt = 0;
    console.log("Teste Algorithmen mit " + versuche + " Versuchen und Array der Gr" + unescape("%F6") + unescape("%DF") + "e " + laenge);

    console.log("\t1. BubbleSort");
    korrekt = 0;
    startTime = performance.now();
    for (var i = 0; i < versuche; i++) {
        createArray(laenge);
        bubbleSort();
        korrekt += (checkSorted(hilfsArray) == 0) ? 1 : 0;
    }
    endTime = performance.now();
    zeit = endTime - startTime;
    console.log("\t\t" + korrekt + " von " + versuche + " Tests korrekt!");
    console.log("\t\tBen" + unescape("%F6") + "tigte Zeit: " + zeit.toFixed(2) + "ms");

    console.log("\t2. MergeSort");
    korrekt = 0;
    startTime = performance.now();
    for (var i = 0; i < versuche; i++) {
        createArray(laenge);
        mergeSort(0, array.length - 1);
        korrekt += (checkSorted(hilfsArray) == 0) ? 1 : 0;
    }
    endTime = performance.now();
    zeit = endTime - startTime;
    console.log("\t\t" + korrekt + " von " + versuche + " Tests korrekt!");
    console.log("\t\tBen" + unescape("%F6") + "tigte Zeit: " + zeit.toFixed(2) + "ms");

    console.log("\t3. InsertionSort");
    korrekt = 0;
    startTime = performance.now();
    for (var i = 0; i < versuche; i++) {
        createArray(laenge);
        insertionSort();
        korrekt += (checkSorted(hilfsArray) == 0) ? 1 : 0;
    }
    endTime = performance.now();
    zeit = endTime - startTime;
    console.log("\t\t" + korrekt + " von " + versuche + " Tests korrekt!");
    console.log("\t\tBen" + unescape("%F6") + "tigte Zeit: " + zeit.toFixed(2) + "ms");
	
    return "Test beendet!";
}

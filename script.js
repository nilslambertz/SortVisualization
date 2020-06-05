// arrays of the animation
let array = []; // main array
let secondArray = []; // array used to first sort and save the changes/swaps made
let divs = []; // array with all the divs which represent the elements of 'array'

// variables which define the current state
let sorting = false; // is the animation currently playing
let stop = false; // is the stop button currently pressed
let swapCreated = false; // has the sort been done by the chosen algorithm
let algorithmNumber = 0; /* which algorithm is chosen, 0 = bubbleSort, 1 = mergeSort, 2 = insertionSort, 3 = quickSort,
                                                        4 = bogoSort
                            */
let currentStep = 0; // for two-step-animations, it saves if we are in the first or second step
let time = 0; // used to save the time it took to sort

// arrays for storing temporal data
let changed = []; // array e.g. for bubblesort, which shows all swaps in current iteration
let swap = []; // all swaps that have been done for the sorting are in here, saved as arrays
let save = []; // if you need two steps for an animation, the needed information is stored here

// style of the divs representing the elements
let width = 10; // width of the divs
let margin = 7; // margin between the divs
let round = 3; // amout of rounding the corners

// variables concerning the array-range
const minNumber = 5; // smallest possible element in the array (min height of the divs)
const maxNumber = 600; // biggest possible element in the array (max height of the divs)

// colors
let sortedColor;
let normalColor;
let firstHighlightColor;
let secondHighlightColor;
let firstCompareColor;
let secondCompareColor;
let thirdHighlightColor;
changeTheme(0);

// Initialize Sliders
range = $('#elemSlider');
value = $('#sliderValue');
speed = $('#speedSlider');

// initializing site
let interval = 0;
$('document').ready(function() {
    document.body.classList.add('default');
    rangeSlider();
    createArray(parseInt(document.getElementById("elemSlider").value));
    interval = parseInt(document.getElementById("speedSlider").value);
})

// 

function rangeSlider() {
    range.each(function () {
       let value = $(this).prev().attr('value');
       $(this).html(value);
    });

    range.on('input', function () {
        $(this).next(value).html(this.value);
    });
}

document.getElementById('title').onclick = function () {
    // redirect to main page
    window.location.href = "https://nilslambertz.github.io";
}

document.getElementById('explosionSort').onclick = function () {
    if (currentlySorting()) {
        return;
    }
	
	// Rickroll :-)
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
}

document.getElementById('sortDiv').onclick = function () {
    secondArray = array.slice(0);
	
	// update interval
    interval = parseInt(document.getElementById("speedSlider").max) - parseInt(document.getElementById("speedSlider").value);
	
	// if array is already sorted, do nothing
    if (checkSorted() === 0) {
        stop = false;
        sorting = false;
        return;
    }
	
	// if currently sorting, stop sorting and make buttons visible
    if (currentlySorting()) {
        stop = true;
        changeStyle(true);
    } else {
		// currently not sorting
	
		// if sort hasn't been done, sort 'secondArray' and save the steps to 'swap'
        if (!swapCreated) {
            swap = [];
            time = 0;
            let startTime = 0;
            let endTime = 0;
            switch (algorithmNumber) {
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
                    break;
                }
				// InsertionSort
                case 2: {
                    startTime = performance.now();
                    insertionSort();
                    endTime = performance.now();
                    break;
                }
                // QuickSort
                case 3: {
                    startTime = performance.now();
                    quickSort(0, array.length - 1);
                    endTime = performance.now();
                    break;
                }
                // BogoSort
                case 4: {
                    break;
                }
				// wrong algorithmNumber, return
                default: {
                    alert("Not implemented (yet)");
					return;
                }
            }
            swapCreated = true;
            time = endTime - startTime;
        }
		
		// make buttons invisible
        changeStyle(false);
        stop = false;
        sorting = true;

		// start animation for current algorithm
        switch (algorithmNumber) {
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
            case 3: {
                quickSortAnimation();
                break;
            }
            case 4: {
                bogoSortAnimation(10000);
                break;
            }
            default: {
                alert("Not implemented (yet)");
				return;
            }
        }
    }
};
 
document.getElementById('stepDiv').onclick = function () {
    secondArray = array.slice(0);
	
	// if currently sorting or already sorted, return
    if ((currentlySorting()) || checkSorted() === 0) {
        return;
    }

	// do one step with current algorithm
    switch (algorithmNumber) {
        case 0: bubbleSortStepByStep(); break;
        case 1: mergeSortStepByStep(); break;
		case 2: insertionSortStepByStep(); break;
        case 3: quickSortStepByStep(); break;
        case 4: bogoSortStepByStep(); break;
        default: {
            alert("Not implemented (yet)");
        }
    }
};

document.getElementById('defaultThemeDiv').onclick = function() {
    if(currentlySorting()) return;
    document.body.classList.remove('dark');
    document.body.classList.add('default');
    changeTheme(0);
    drawArray(save);
}

document.getElementById('darkThemeDiv').onclick = function() {
    if(currentlySorting()) return;
    document.body.classList.remove('default');
    document.body.classList.add('dark');
    changeTheme(1);
    drawArray(save);
}

{
/*
document.getElementById('instantSortDiv').onclick = function () {
	// if currently sorting
    if (currentlySorting()) {
        return;
    }

    secondArray = array.slice(0);
    var startTime = 0;
    var endTime = 0;
    time = 0;
	
	// sort 'secondArray' and copy it into 'array'
    switch (algorithmNumber) {
        case 0: {
            startTime = performance.now();
            bubbleSort();
            endTime = performance.now();
            array = secondArray.slice(0);
            break;
        }
        case 1: {
            startTime = performance.now();
            mergeSort(0, array.length - 1);
            endTime = performance.now();
            array = secondArray.slice(0);
            break;
        }
        case 2: {
            startTime = performance.now();
            insertionSort();
            endTime = performance.now();
            array = secondArray.slice(0);
            break;
        }
		case 3: {
			startTime = performance.now();
            quickSort(0, array.length - 1);
            endTime = performance.now();
            array = secondArray.slice(0);
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
    if (currentlySorting()) {
        return;
    }
	
    changed = [];
    swapCreated = false;
    currentStep = 0;
    swap = [];
	
	// underline bubbleSort, change 'algorithmNumber' and draw the 'array'
    for (let i of document.getElementsByClassName("leftNavElem")) {
        i.style.textDecoration = "none";
    }
    document.getElementById("bubbleSortDiv").style.textDecoration = "underline";
    algorithmNumber = 0;
    drawArray();
}

document.getElementById('mergeSortDiv').onclick = function () {
	// if currently sorting, return
    if (currentlySorting()) {
        return;
    }
	
    changed = [];
    swapCreated = false;
    currentStep = 0;
    swap = [];
	
	// underline mergeSort, change 'algorithmNumber' and draw the 'array'
    for (let i of document.getElementsByClassName("leftNavElem")) {
        i.style.textDecoration = "none";
    }
    document.getElementById("mergeSortDiv").style.textDecoration = "underline";
    algorithmNumber = 1;
    drawArray();
}

document.getElementById('insertionSortDiv').onclick = function () {
	// if currently sorting, return
    if (currentlySorting()) {
        return;
    }
	
    changed = [];
    swapCreated = false;
    currentStep = 0;
    swap = [];
	
	// underline insertionSort, change 'algorithmNumber' and draw the 'array'
    for (let i of document.getElementsByClassName("leftNavElem")) {
        i.style.textDecoration = "none";
    }
    document.getElementById("insertionSortDiv").style.textDecoration = "underline";
    algorithmNumber = 2;
    drawArray();
}

document.getElementById("quickSortDiv").onclick = function() {
	// if currently sorting, return
	if (currentlySorting()) {
        return;
    }
	
    changed = [];
    swapCreated = false;
    currentStep = 0;
    swap = [];
	
	// underline quickSort, change 'algorithmNumber' and draw the 'array'
    for (let i of document.getElementsByClassName("leftNavElem")) {
        i.style.textDecoration = "none";
    }
    document.getElementById("quickSortDiv").style.textDecoration = "underline";
    algorithmNumber = 3;
    drawArray();
}

document.getElementById('bogoSortDiv').onclick = function () {
    // if currently sorting, return
    if (currentlySorting()) {
        return;
    }

    changed = [];
    swapCreated = false;
    currentStep = 0;
    swap = [];

    // underline bubbleSort, change 'algorithmNumber' and draw the 'array'
    for (let i of document.getElementsByClassName("leftNavElem")) {
        i.style.textDecoration = "none";
    }
    document.getElementById("bogoSortDiv").style.textDecoration = "underline";
    algorithmNumber = 4;
    drawArray();
}

// returns the lowest index of an array, where all following elements are sorted
function checkSorted(a = array) {
    let firstSorted = 0;
    for (let i = 1; i < a.length; i++) {
        if (Math.max(...a.slice(0, i)) > a[i]) {
            firstSorted = i + 1;
        } 
    }
    return firstSorted;
}

function currentlySorting() {
    return sorting && !stop;
}

document.getElementById('createArrayDiv').onclick = function () {
	// if currently sorting
    if (currentlySorting()) {
        return;
    }
	
	// create new array
    let value = document.getElementById("elemSlider").value;
    createArray(parseInt(value));
	changeStyle(true);
};


// Bubblesort

function bubbleSort() {
    for (let n = secondArray.length; n > 1; n--) {
        for (let i = 0; i < n - 1; i++) {
			// schema: [firstIndex, swapNeeded]
            let a = [i, false];
            if (secondArray[i] > secondArray[i + 1]) {
                let temp = secondArray[i];
                secondArray[i] = secondArray[i + 1];
                secondArray[i + 1] = temp;
                a = [i, true];
            }
            swap.push(a);
        }
    }

    swapCreated = true;
}

function bubbleSortAnimation() {
    let sortingInterval = setInterval(function () {
		// if array is sorted or stop is pressed, make buttons visible and return
        if (checkSorted() === 0 || stop) {
            changeStyle(true);
            clearInterval(sortingInterval);
            return;
        }
		
		// do one step 
		bubbleSortStepByStep();
    }, interval);
}

function bubbleSortStepByStep() {
    if (!swapCreated) {
        swap = [];
        bubbleSort(); 
        swapCreated = true;
    }

	// if elements must not be swapped
    if (currentStep % 2 === 0) {
		// get the next element
        let a = swap.shift();
		
		// if swap is empty, but the array still isn't sorted
		if(a == null) {
			alert("Something went wrong!");
			return;
		}
        let firstIndex = a[0];

        // if next iteration
        if (firstIndex < save[0]) {
            changed = [];
        }

        save[0] = firstIndex;
        save[1] = firstIndex+1;

        drawArray([firstIndex, firstIndex+1]);
		
		// if elements must be swapped, swap them and increase 'currentStep'
        if (a[1]) {
            let temp = array[firstIndex];
            array[firstIndex] = array[firstIndex+1];
            array[firstIndex+1] = temp;
            currentStep++;
        }
    } else {
		// draw array with swapped elements and add the swapped element to 'changed'
        drawArray([save[1], save[0]]);
        changed.push(save[0]);
        currentStep++;
    }

	// if the array is sorted
    if (checkSorted() === 0 || stop) {
        changeStyle(true);
    }
}

function drawArrayBubbleSort(a) {
    let sorted = checkSorted();
	
	// every element before the sorted part of the array
    for (let i = 0; i < sorted; i++) {
        let color = normalColor;
        let div = divs[i];
        let value = array[i];
        document.getElementById('content').appendChild(divs[i]);

        if (a[0] === i) {
			// highlight first index
            color = firstCompareColor;
        } else {
            if (a[1] === i) {
				// highlight second index
                color = secondCompareColor;
            } else {
                // if element has been swapped, highlight it with orange color
                if(changed.includes(i)) {
                    color = secondHighlightColor;
                }
            }
        }

        setDiv(div, value, color, false);
    }
	
	// every already sorted element is green
    for (let i = sorted; i < array.length; i++) {
        document.getElementById('content').appendChild(divs[i]);
        setDiv(divs[i], array[i], sortedColor);
    }
}


// Mergesort

function mergeSort(l, r) {
    if (r - l === 0) {
        // nothing to do
    } else {
        if (r - l === 1) {
			// schema: [firstIndex, secondIndex, needToBeSwapped, null, null, null, false]
            let a = [l, r, false, null, null, null, false];
            if (secondArray[l] > secondArray[r]) {
                let temp = secondArray[l];
                secondArray[l] = secondArray[r];
                secondArray[r] = temp;
                a = [l, r, true, null, null, null, false];
            }
            swap.push(a);
        } else {
            let i = Math.floor((r + l) / 2);
			// schema: [null, null, false, leftBorder, rightBorder, mid, false]
			let a = [null, null, false, l, r, i, false];
			swap.push(a);
            mergeSort(l, i-1);
            mergeSort(i, r);
            merge(l, r, i);
        }
    }
}

function merge(l, r, mid) {
    let j = mid;
    while (j <= r) {
		// schema: [firstIndex, SecondIndex, false, leftBorder, rightBorder, middle, moved];
        let a = [j, j-1, false, l, r, j+1, false];
		// if smallest element of the second half is smaller than the biggest element of the first half
        if (secondArray[j] < secondArray[j - 1]) {
            let firstBigger = l;
			// find first bigger element in the second half
            for (let x = l; x < j; x++) {
                if (secondArray[x] > secondArray[j]) {
                    firstBigger = x;
                    break;
                } 
            }
			// move every element one place "to the right" and put the current element in the empty space
            for (let x = j; x > firstBigger; x--) {
                let temp = secondArray[x];
                secondArray[x] = secondArray[x - 1];
                secondArray[x - 1] = temp;
            }
			// now we moved the elements
            a = [firstBigger, j, false, l, r, j+1, true];
        }
        swap.push(a);
        j++;
    }

}

function mergeSortAnimation() {
    let sortingInterval = setInterval(function () {
		// if array is sorted or stop is pressed, make buttons visible and return
        if (checkSorted() === 0 || stop) {
            clearInterval(sortingInterval);
            changeStyle(true);
            return;
        }

		// do one step 
        mergeSortStepByStep();
    }, interval);
}

function mergeSortStepByStep() {	
	if (!swapCreated) {
        swap = [];
        mergeSort(0, array.length - 1);
        swapCreated = true;
    }
	
	if (currentStep % 2 === 0) {
        let a = swap.shift();
        let firstIndex = a[0];
        let secondIndex = a[1];
        let left = a[3];
        let mid = a[4];
        let right = a[5];
        save[0] = firstIndex;
        save[1] = secondIndex;
		save[2] = left;
		save[3] = mid;
		save[4] = right;
		
		
        if (a[6]) {
            for (let x = secondIndex; x > firstIndex; x--) {
                let temp = array[x];
                array[x] = array[x - 1];
                array[x - 1] = temp;
            }
            drawArray([null, null, a[3], a[5], a[4]]);
        } else {
            drawArray([a[0], a[1], a[3], a[5], a[4]]);
            if (a[2]) {
                currentStep++;
            }
		}
    } else {
        let temp = array[save[0]];
        array[save[0]] = array[save[1]];
        array[save[1]] = temp;
        drawArray([save[1], save[0], save[2], save[4], save[3]]);
        currentStep++;
    }
	
		
	if (checkSorted() === 0 || stop) {
        changeStyle(true);
    }
}

function drawArrayMergeSort(a) {
    let sorted = checkSorted();
    if(sorted === 0) {
        drawArrayDefault();
        return;
    }

    for (let i = 0; i < array.length; i++) {
        let color = normalColor;
        let div = divs[i];
        let value = array[i];
        document.getElementById('content').appendChild(divs[i]);
		
		if (a[2] != null) {
            if (a[2] <= i && i < a[3]) {
                color = firstHighlightColor;
            } else {
                if (a[3] <= i && i <= a[4]) {
                    color = secondHighlightColor;
                }
            }
        } else {
			if (a[0] === i) {
                color = firstCompareColor;
			} else {
				if (a[1] === i) {
                    color = secondCompareColor;
				}
			}
        }
		
		setDiv(div, value, color, false);
    }
}


// InsertionSort

function insertionSort() {
    for(let i = 0; i < secondArray.length; i++) {
		swap.push([i]);
        let temp = secondArray[i];
        let j = i;
		// find correct position in the part of the array that is left from the current element and put it there
        while(j > 0 && secondArray[j-1] > temp) {
            secondArray[j] = secondArray[j-1];
            j--;
        }
		swap.push([i, j]);
        secondArray[j] = temp;
    }
    swapCreated = true;
}

function insertionSortAnimation() {
    let sortingInterval = setInterval(function () {
		// if array is sorted or stop is pressed, make buttons visible and return
        if (checkSorted() === 0 || stop) {
            changeStyle(true);
            clearInterval(sortingInterval);
            return;
        }

        // do one step 
        insertionSortStepByStep();
    }, interval);
}

function insertionSortStepByStep() {
	if (!swapCreated) {
        swap = [];
        insertionSort();
        swapCreated = true;
    }

    let a = swap.shift();
    let index = a[0];
    let pos = a[1];
	if(pos != null) {
        let temp = array[index];
        let j = index;
		while(array[j-1] > temp) {
			array[j] = array[j-1];
			j--;
		}
		array[j] = temp;
	}
    drawArray(a);

    if (checkSorted() === 0 || stop) {
        changeStyle(true);
    }
}

function drawArrayInsertionSort(a) {
    for (let i = 0; i < array.length; i++) {
        let color = normalColor;
        let div = divs[i];
        let value = array[i];
        document.getElementById('content').appendChild(divs[i]);

        if (a[0] === i && a[1] !== i && a[1] == null) {
            color = firstCompareColor;
        } else {
			if(a[1] === i) {
                color = thirdHighlightColor;
			}
        }
        setDiv(div, value, color, false);
    }
}	


// QuickSort 

function quickSort(l, r) {
	if(l >= r) {
		return;
	}
    let j = partition(l, r);
	quickSort(l, j-1);
	quickSort(j+1, r);
}

function partition(l, r) {
    let x = secondArray[r];
    let i = l;
    let j = r-1;
	while(i < j) {
		while(i < r && secondArray[i] < x) {
		    // schema: [index1, index2, swap, left, middle, right]
            let a = [i, 0, false, l, (l+r)/2, r];
            swap.push(a);
			i++;
		}
		while(j > l && secondArray[j] >= x) {
            let a = [j, 0, false, l, (l+r)/2, r];
            swap.push(a);
			j--
		}
		if(i < j) {
            let temp = secondArray[i];
            secondArray[i] = secondArray[j];
            secondArray[j] = temp;
            let a = [i, j, true, l, (l+r)/2, r];
            swap.push(a);
			//i++;
			//j--;
		}
 	}
 	if(secondArray[i] > x) {
        let temp = secondArray[i];
        secondArray[i] = secondArray[r];
        secondArray[r] = temp;
        let a = [i, r, true, l, (l+r)/2, r];
        swap.push(a);
    }
	return i;
}

function quickSortAnimation() {
    let sortingInterval = setInterval(function () {
        // if array is sorted or stop is pressed, make buttons visible and return
        if (checkSorted() === 0 || stop) {
            changeStyle(true);
            clearInterval(sortingInterval);
            return;
        }

        // do one step
        quickSortStepByStep();
    }, interval);
}

function quickSortStepByStep() {
    if (!swapCreated) {
        swap = [];
        quickSort(0, array.length - 1);
        swapCreated = true;
    }

    if (currentStep % 2 === 0) {
        let a = swap.shift();
        let switchElems = a[2];
        save = a;

        drawArray(a);
        if (switchElems) {
            currentStep++;
        }
    } else {
        let temp = array[save[0]];
        array[save[0]] = array[save[1]];
        array[save[1]] = temp;
        drawArray([save[1], save[0], save[2], save[3], save[4], save[5]]);
        currentStep++;
    }


    if (checkSorted() === 0 || stop) {
        changeStyle(true);
    }
}

function drawArrayQuickSort(a) {
    for (let i = 0; i < array.length; i++) {
        let color = normalColor;
        let div = divs[i];
        let value = array[i];
        document.getElementById('content').appendChild(divs[i]);
        // schema: [index1, index2, swap, left, middle, right]

        if(a[3] <= i && i <= a[4]) {
            color = secondHighlightColor;
        } else {
            if(a[4] <= i && i <= a[5]) {
                color = firstHighlightColor;
            }
        }

        if(i === a[0]) {
            color = firstCompareColor;
        } else {
            if(i === a[1] && a[2]) {
                color = secondCompareColor;
            }
        }

        setDiv(div, value, color, false);
    }
}

function bogoSortAnimation(numberOfShuffles) {
    let i = 0;
    let sortingInterval = setInterval(function () {
        // if array is sorted or stop is pressed, make buttons visible and return
        if (checkSorted() === 0 || stop || i >= numberOfShuffles) {
            changeStyle(true);
            clearInterval(sortingInterval);
            return;
        }

        bogoSortStepByStep();
        i++;
    }, interval);
}

function bogoSortStepByStep() {
    array = shuffleArray(array);
    drawArray();

    if (checkSorted() === 0 || stop) {
        changeStyle(true);
    }
}

// other functions

function changeTheme(nr) {
    switch(nr) {
        case 0: {
            sortedColor = "#228B22";
            normalColor = "#7D7D7D";
            firstHighlightColor = "#FFA54F";
            secondHighlightColor = "#EE7621";
            firstCompareColor = "#4169E1";
            secondCompareColor = "#00B2EE";
            thirdHighlightColor = "#EE4000";
            break;
        }
        case 1: {
            sortedColor = "#228B22";
            normalColor = "#B5B5B5";
            firstHighlightColor = "#FFA54F";
            secondHighlightColor = "#EE7621";
            firstCompareColor = "#4169E1";
            secondCompareColor = "#00B2EE";
            thirdHighlightColor = "#EE4000";
            break;
        }
    }
}

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
        for (let i of document.getElementsByClassName("navElem")) {
            i.style.opacity = "1";
            if (i !== document.getElementById("speedSliderDiv") && i !== document.getElementById("elemSliderDiv")) {
                i.style.cursor = "pointer";
            }
        }
		
		// enable the sliders
        document.getElementById("speedSlider").disabled = false;
        document.getElementById("elemSlider").disabled = false;
		
		// change the opacity of the buttons on the left
        for (let i of document.getElementsByClassName("leftNavElem")) {
            if (i !== document.getElementById("sortDiv")) {
                i.style.opacity = "1";
                i.style.cursor = "pointer";
            }
        }
		
		// if array ist sorted, make the sortButton grey
        if (checkSorted() === 0) {
            drawArray();
			document.getElementById('sortDiv').classList.remove("notSorting");
			document.getElementById('sortDiv').classList.add("sorted");	
			document.getElementById('sortDiv').style.cursor = "default";
			document.getElementById('sortDiv').innerHTML = "sorted";
        }
    } else {
        sorting = true;
        document.getElementById('sortDiv').innerHTML = 'stop';
        document.getElementById('sortDiv').classList.remove("notSorting");
        document.getElementById('sortDiv').classList.add("sorting");
        for (let i of document.getElementsByClassName("navElem")) {
            i.style.opacity = "0.2";
            i.style.cursor = "default";
        }
        document.getElementById("speedSlider").disabled = true;
        document.getElementById("elemSlider").disabled = true;
        for (let i of document.getElementsByClassName("leftNavElem")) {
            if (i !== document.getElementById("sortDiv")) {
                i.style.opacity = "0.2";
                i.style.cursor = "default";
            }
        }
    }
}

function createArray(elems) {
    time = 0;
    stop = false;
    sorting = false;
    currentStep = 0;
    swapCreated = false;
    changed = [];
    swap = [];
    save = [];

    if (elems > maxNumber) {
        elems = maxNumber;
        console.log("Too many elements. Elements set to " + elems);
    }
    if(elems < minNumber) {
        elems = minNumber;
        console.log("Not enough elements. Elements set to " + elems);
    }

    changed = [];
    if (elems < 20) {
        margin = 5;
        width = 40;
        round = 4;
    } else {
        if (elems < 50) {
            margin = 4;
            width = 9;
            round = 2;
        } else {
            if (elems < 100) {
                margin = 3;
                width = 7;
                round = 2;
            } else {
                if (elems < 150) {
                    margin = 2;
                    width = 5;
                    round = 1;
                } else {
                    if (elems < 200) {
                        margin = 1;
                        width = 4;
                        round = 1;
                    } else {
                        if (elems < 250) {
                            margin = 1;
                            width = 3;
                            round = 0;
                        } else {
							if(elems < 400) {
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

    let a = Array(elems);
    let d = Array(elems);

    let tempArray = Array(maxNumber);
	for(let i = 0; i < maxNumber; i++) {
		tempArray[i] = i+minNumber;
	}
	
	for(let i = 0; i < elems; i++) {
        let index = Math.round(Math.random() * (tempArray.length-1));
		a[i] = tempArray[index];
		tempArray.splice(index, 1);
	}

	for(let i = 0; i < elems; i++) {
        let temp = document.createElement('div');
        temp.setAttribute('id', i + "");
        d[i] = temp;
	}
	
    array = a;
    divs = d;
    drawArray();
    secondArray = array.slice(0);
}

function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

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
}

function drawArray(a = null) {
    document.getElementById('content').innerHTML = '';
    if(a == null || checkSorted() == 0) {
        drawArrayDefault();
        return;
    }
    switch(algorithmNumber) {
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
        case 3: {
            drawArrayQuickSort(a);
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
    let color = (checkSorted() === 0 ? sortedColor : normalColor);
    for (let i = 0; i < array.length; i++) {
        let div = divs[i];
        let value = array[i];
        document.getElementById('content').appendChild(divs[i]);
        setDiv(div, value, color, false);
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

    let startTime;
    let endTime;
    let time;
    let correct;
    console.log("Teste Algorithmen mit " + v + " Versuchen und Array der Gr" + unescape("%F6") + unescape("%DF") + "e " + l);

    console.log("\t1. BubbleSort");
    correct = 0;
    startTime = performance.now();
    for (let i = 0; i < v; i++) {
        createArray(l);
        bubbleSort();
        correct += (checkSorted(secondArray) === 0) ? 1 : 0;
    }
    endTime = performance.now();
    time = endTime - startTime;
    console.log("\t\t" + correct + " von " + v + " Tests korrekt!");
    console.log("\t\tBen" + unescape("%F6") + "tigte Zeit: " + time.toFixed(2) + "ms");

    console.log("\t2. MergeSort");
    correct = 0;
    startTime = performance.now();
    for (let i = 0; i < v; i++) {
        createArray(l);
        mergeSort(0, array.length - 1);
        correct += (checkSorted(secondArray) === 0) ? 1 : 0;
    }
    endTime = performance.now();
    time = endTime - startTime;
    console.log("\t\t" + correct + " von " + v + " Tests korrekt!");
    console.log("\t\tBen" + unescape("%F6") + "tigte Zeit: " + time.toFixed(2) + "ms");

    console.log("\t3. InsertionSort");
    correct = 0;
    startTime = performance.now();
    for (let i = 0; i < v; i++) {
        createArray(l);
        insertionSort();
        correct += (checkSorted(secondArray) === 0) ? 1 : 0;
    }
    endTime = performance.now();
    time = endTime - startTime;
    console.log("\t\t" + correct + " von " + v + " Tests korrekt!");
    console.log("\t\tBen" + unescape("%F6") + "tigte Zeit: " + time.toFixed(2) + "ms");
	
    return "Test beendet!";
}

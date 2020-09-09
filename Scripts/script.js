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
let minNumber = 5; // smallest possible element in the array (min height of the divs)
let maxNumber = 600; // biggest possible element in the array (max height of the divs)

// highlighted divs
let currentFirstHighlight = undefined;
let currentSecondHighlight = undefined;

// trys for bogosort
let bogoTrys = 10000;

// colors
let sortedColor;
let normalColor;
let firstHighlightColor;
let secondHighlightColor;
let firstCompareColor;
let secondCompareColor;
let thirdHighlightColor;
changeTheme(0); // initializing with default-theme

// Initialize Sliders
let elemSlider = document.getElementById('elemSlider');
let elemSliderSpan = document.getElementById('sliderValue');
let speedSlider = document.getElementById('speedSlider');

// initializing site
let interval = 0;
let sortInterval;
minNumber = parseInt(elemSlider.min);
maxNumber = parseInt(elemSlider.max);
document.body.classList.add('default');
createArray(parseInt(elemSlider.value));
interval = parseInt(speedSlider.value);

document.getElementById("elemSlider").addEventListener("input", () => {
    elemSliderSpan.innerText = elemSlider.value;
})

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
    interval = parseInt(speedSlider.max)
        - parseInt(speedSlider.value);
	
	// if animation is finished, do nothing
    if (animationFinished() || isSorted(getCurrentArray())) {
        stop = false;
        sorting = false;
        return;
    }

	// if currently sorting, stop sorting and make buttons visible
    if (currentlySorting()) {
        stop = true;
        clearInterval(sortInterval);
        endAnimation();
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
                    swap[0] = bogoTrys;
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
               // interval += 30;
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
                bogoSortAnimation();
                break;
            }
            default: {
                alert("Not implemented (yet)");
				return;
            }
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

function getCurrentArray() {
    let arr = [];

    for(let i = 0; i < divs.length; i++) {
        arr[i] = parseInt(divs[i].style.height);
    }

    return arr;
}

function initialiseSort(buttonId, algoNumber) {
    // if currently sorting, return
    if (currentlySorting()) {
        return;
    }

    array = getCurrentArray();
    if(swap.length !== 0 && algorithmNumber !== algoNumber) {
        removeAllElemStyles();
        drawArray();
    }

    changed = [];
    swapCreated = false;
    currentStep = 0;
    swap = [];

    // underline bubbleSort, change 'algorithmNumber' and draw the 'array'
    for (let i of document.getElementsByClassName("leftNavElem")) {
        i.style.textDecoration = "none";
    }
    document.getElementById(buttonId).style.textDecoration = "underline";
    algorithmNumber = algoNumber;
}

document.getElementById('bubbleSortDiv').onclick = function () {
    initialiseSort("bubbleSortDiv", 0);
}

document.getElementById('mergeSortDiv').onclick = function () {
	initialiseSort("mergeSortDiv", 1);
}

document.getElementById('insertionSortDiv').onclick = function () {
    initialiseSort("insertionSortDiv", 2);
}


document.getElementById("quickSortDiv").onclick = function() {
    initialiseSort("quickSortDiv", 3);
}

document.getElementById('bogoSortDiv').onclick = function () {
    initialiseSort("bogoSortDiv", 4);
}

function animationFinished() {
    return swapCreated && swap.length === 0;
}

// returns the lowest index of an array, where all following elements are sorted
function checkSorted(a = array) {
    let firstSorted = 0;
    for (let i = 0; i < a.length-1; i++) {
        if(a[i+1] < a[i]) {
            firstSorted = i+1;
        }
    }
    return firstSorted;
}

function isSorted(a = array) {
    for (let i = 0; i < a.length-1; i++) {
        if(a[i+1] < a[i]) {
            return false;
        }
    }
    return true;
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
    createArray(parseInt(elemSlider.value));
	changeStyle(true);
};

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
        speedSlider.disabled = false;
        elemSlider.disabled = false;
		
		// change the opacity of the buttons on the left
        for (let i of document.getElementsByClassName("leftNavElem")) {
            if (i !== document.getElementById("sortDiv")) {
                i.style.opacity = "1";
                i.style.cursor = "pointer";
            }
        }
		
		// if array ist sorted, make the sortButton grey
        if (animationFinished()) {
            drawArray();
			document.getElementById('sortDiv').classList.remove("notSorting");
			document.getElementById('sortDiv').classList.add("sorted");
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
        speedSlider.disabled = true;
        elemSlider.disabled = true;
        for (let i of document.getElementsByClassName("leftNavElem")) {
            if (i !== document.getElementById("sortDiv")) {
                i.style.opacity = "0.2";
                i.style.cursor = "default";
            }
        }
    }
}

function removeAllElemStyles() {
    currentFirstHighlight = undefined;
    currentSecondHighlight = undefined;

    for(let x of divs) {
        x.setAttribute("class", "arrayElem");
    }
}

function endAnimation() {
    if(checkSorted() === 0 && animationFinished()) {
        removeAllElemStyles();
        for(let x of divs) {
            x.classList.add("sortedElem");
        }
    }
    changeStyle(true);
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
        temp.classList.add("arrayElem");
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
    div.style.height = height + "px";
    div.style.width = width + "px";
    div.style.marginRight = margin + "px";
    div.style.borderRadius = "0px 0px " + round + "px " + round + "px";
}

function drawArray(a = null) {
    let content = document.getElementById('content');
    content.innerHTML = '';
    let color = (animationFinished() ? sortedColor : normalColor);
    for (let i = 0; i < array.length; i++) {
        let div = divs[i];
        let value = array[i];
        content.appendChild(divs[i]);
        setDiv(div, value, color, false);
    }
}
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
range = $('#elemSlider');
value = $('#sliderValue');
speed = $('#speedSlider');

// initializing site
let interval = 0;
$('document').ready(function() {
    minNumber = parseInt(document.getElementById('elemSlider').min);
    maxNumber = parseInt(document.getElementById('elemSlider').max);
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
    interval = parseInt(document.getElementById("speedSlider").max)
        - parseInt(document.getElementById("speedSlider").value);
	
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
                interval += 30;
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
    if(a == null || checkSorted() === 0) {
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

function testSort(l = 100, v = 100) {
    if(l > 600) {
        console.log("Maximum array-length is 600!");
        l = 600;
    }
    if(l < 2) {
        console.log("Minimum array-length is 2!");
        l = 2;
    }

    let startTime;
    let endTime;
    let time;
    let correct;
    console.log("Starting test with " + v + " arrays per algorithm and array-length " + l);

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
    console.log("\t\t" + correct + " out of " + v + " tests correct!");
    console.log("\t\tComputation time: " + time.toFixed(2) + "ms");

    console.log("\t2. InsertionSort");
    correct = 0;
    startTime = performance.now();
    for (let i = 0; i < v; i++) {
        createArray(l);
        insertionSort();
        correct += (checkSorted(secondArray) === 0) ? 1 : 0;
    }
    endTime = performance.now();
    time = endTime - startTime;
    console.log("\t\t" + correct + " out of " + v + " tests correct!");
    console.log("\t\tComputation time: " + time.toFixed(2) + "ms");

    console.log("\t3. MergeSort");
    correct = 0;
    startTime = performance.now();
    for (let i = 0; i < v; i++) {
        createArray(l);
        mergeSort(0, array.length - 1);
        correct += (checkSorted(secondArray) === 0) ? 1 : 0;
    }
    endTime = performance.now();
    time = endTime - startTime;
    console.log("\t\t" + correct + " out of " + v + " tests correct!");
    console.log("\t\tComputation time: " + time.toFixed(2) + "ms");

    console.log("\t4. QuickSort");
    correct = 0;
    startTime = performance.now();
    for (let i = 0; i < v; i++) {
        createArray(l);
        quickSort(0, l-1);
        correct += (checkSorted(secondArray) === 0) ? 1 : 0;
    }
    endTime = performance.now();
    time = endTime - startTime;
    console.log("\t\t" + correct + " out of " + v + " tests correct!");
    console.log("\t\tComputation time: " + time.toFixed(2) + "ms");
	
    return "Test finished!";
}

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
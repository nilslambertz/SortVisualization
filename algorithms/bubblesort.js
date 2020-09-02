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

        let firstIndex = a[0];

        // if next iteration
        if (firstIndex < save[0]) {
            changed = [];
        }

        save[0] = firstIndex;
        save[1] = firstIndex+1;

        drawArray(save);

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
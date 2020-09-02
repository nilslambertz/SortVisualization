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
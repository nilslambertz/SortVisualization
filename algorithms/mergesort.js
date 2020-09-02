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
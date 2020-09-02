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
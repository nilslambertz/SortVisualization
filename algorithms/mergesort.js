function mergeSort(l, r) {
    if (r - l === 0) {
        // nothing to do
    } else {
        if (r - l === 1) {
            let a = {
                inMergeSort: true,
                leftBorder: l,
                rightBorder: r,
                swapNeeded: false
            }
            if (array[l] > array[r]) {
                let temp = array[l];
                array[l] = array[r];
                array[r] = temp;
                a.swapNeeded = true;
            }
            swap.push(a);
        } else {
            let i = Math.floor((r + l) / 2);
            let a = {
                inMergeSort: true,
                leftBorder: l,
                rightBorder: r,
                mid: i
            }
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
        let a = {
            inMergeSort: false,
            firstIndex: j,
            secondIndex: j-1,
            leftBorder: l,
            rightBorder: r,
            mid: j+1,
            moved: false
        }
        // if smallest element of the second half is smaller than the biggest element of the first half
        if (array[j] < array[j - 1]) {
            let firstBigger = l;
            // find first bigger element in the second half
            for (let x = l; x < j; x++) {
                if (array[x] > array[j]) {
                    firstBigger = x;
                    break;
                }
            }
            // move every element one place "to the right" and put the current element in the empty space
            for (let x = j; x > firstBigger; x--) {
                let temp = array[x];
                array[x] = array[x - 1];
                array[x - 1] = temp;
            }
            // now we moved the elements
            a.firstIndex = firstBigger;
            a.secondIndex = j;
            a.moved = true;
        }
        swap.push(a);
        j++;
    }

}

function mergeSortAnimation() {
    let sortingInterval = setInterval(function () {
        if (swap.length === 0 || stop) {
            clearInterval(sortingInterval);
            endAnimation();
            return;
        }

        // do one step
        mergeSortStepByStep();
    }, interval);
}

function mergeSortStepByStep() {
    if (currentStep % 2 === 0) {
        let a = swap.shift();
        let firstIndex = a.firstIndex;
        let secondIndex = a.secondIndex;
        save = a;

        if(a.moved) {
            drawMergeSort(a);
        } else {
            if(a.swapNeeded) {
                currentStep++;
                a.firstStep = true;
            }
            drawMergeSort(a);
        }
    } else {
        save.firstStep = false;
        drawMergeSort(save);

        currentStep++;
    }
}

function drawMergeSort(a) {
    removeAllElemStyles();

    let first = a.firstIndex;
    let second = a.secondIndex;
    let left = a.leftBorder;
    let mid = a.mid;
    let right = a.rightBorder;


    if(a.inMergeSort && a.swapNeeded === undefined) {
        for(let i = left; i < mid; i++) {
            divs[i].classList.add("leftHalf");
        }
        for(let i = mid; i <= right; i++) {
            divs[i].classList.add("rightHalf");
        }
    } else if(a.inMergeSort && a.swapNeeded === true) {
        if(a.firstStep) {
            divs[right].classList.add("firstHighlight");
            divs[left].classList.add("secondHighlight");
        } else {
            document.getElementById("content").insertBefore(divs[right], divs[left]);
            let tempDiv = divs[right];
            divs[right] = divs[left];
            divs[left] = tempDiv;
            divs[right].classList.add("firstHighlight");
            divs[left].classList.add("secondHighlight");
        }
    } else {
        for(let i = left; i < mid; i++) {
            divs[i].classList.add("leftHalf");
        }
        for(let i = mid; i <= right; i++) {
            divs[i].classList.add("rightHalf");
        }
        if(a.moved) {
            document.getElementById("content").insertBefore(divs[second], divs[first]);
            for (let x = second; x > first; x--) {
                let tempDiv = divs[x];
                divs[x] = divs[x - 1];
                divs[x - 1] = tempDiv;
            }
        }
    }
}
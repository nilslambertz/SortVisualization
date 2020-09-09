function quickSort(l, r) {
    if(l >= r) {
        return;
    }
    let j = partition(l, r);
    quickSort(l, j-1);
    quickSort(j+1, r);
}

function partition(l, r) {
    let x = array[r];
    let i = l;
    let j = r-1;
    while(i < j) {
        while(i < r && array[i] < x) {
            let mid = Math.floor((r + l) / 2);
            let a = {
                firstIndex: i,
                secondIndex: j,
                swapNeeded: false,
                leftBorder: l,
                mid: mid,
                rightBorder: r
            }
            swap.push(a);
            i++;
        }
        while(j > l && array[j] >= x) {
            let mid = Math.floor((r + l) / 2);
            let a = {
                firstIndex: i,
                secondIndex: j,
                swapNeeded: false,
                leftBorder: l,
                mid: mid,
                rightBorder: r
            }
            swap.push(a);
            j--;
        }
        if(i < j) {
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            let mid = Math.floor((r + l) / 2);
            let a = {
                firstIndex: i,
                secondIndex: j,
                swapNeeded: true,
                leftBorder: l,
                mid: mid,
                rightBorder: r
            }
            swap.push(a);
        }
    }
    if(array[i] > x) {
        let temp = array[i];
        array[i] = array[r];
        array[r] = temp;
        let mid = Math.floor((r + l) / 2);
        let a = {
            firstIndex: i,
            secondIndex: r,
            swapNeeded: true,
            leftBorder: l,
            mid: mid,
            rightBorder: r
        }
        swap.push(a);
    }
    return i;
}

function quickSortAnimation() {
    sortInterval = setInterval(function () {
        if (swap.length === 0) {
            clearInterval(sortInterval);
            endAnimation();
            return;
        }

        // do one step
        quickSortStepByStep();
    }, interval);
}

function quickSortStepByStep() {
    if (currentStep % 2 === 0) {
        let a = swap.shift();
        a.firstStep = true;
        save = a;

        if (a.swapNeeded) {
            currentStep++;
        }
        drawQuickSort(a);
    } else {
        save.firstStep = false;
        drawQuickSort(save);
        currentStep++;
    }
}

function drawQuickSort(a) {
    removeAllElemStyles();

    let first = a.firstIndex;
    let second = a.secondIndex;
    let left = a.leftBorder;
    let mid = a.mid;
    let right = a.rightBorder;

    for(let i = left; i < mid; i++) {
        if(i === first || i === second) {
            if(i === first) {
                divs[first].classList.add("firstHighlight");
            } else {
                divs[second].classList.add("secondHighlight");
            }
            continue;
        }
        divs[i].classList.add("leftHalf");
    }
    for(let i = mid; i <= right; i++) {
        if(i === first || i === second) {
            if(i === first) {
                divs[first].classList.add("firstHighlight");
            } else {
                divs[second].classList.add("secondHighlight");
            }
            continue;
        }
        divs[i].classList.add("rightHalf");
    }

    if(!a.firstStep) {
        let content = document.getElementById("content");
        let temp = document.createElement("div");
        content.insertBefore(temp, divs[first]);
        content.insertBefore(divs[first], divs[second]);
        content.insertBefore(divs[second], temp);
        content.removeChild(temp);

        let tempDiv = divs[first];
        divs[first] = divs[second];
        divs[second] = tempDiv;
    }
}

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
            let mid = Math.floor((r + l) / 2);
            let a = {
                firstIndex: i,
                secondIndex: 0,
                swapNeeded: false,
                leftBorder: l,
                mid: mid,
                rightBorder: r
            }
            swap.push(a);
            i++;
        }
        while(j > l && secondArray[j] >= x) {
            let mid = Math.floor((r + l) / 2);
            let a = {
                firstIndex: j,
                secondIndex: 0,
                swapNeeded: false,
                leftBorder: l,
                mid: mid,
                rightBorder: r
            }
            swap.push(a);
            j--
        }
        if(i < j) {
            let temp = secondArray[i];
            secondArray[i] = secondArray[j];
            secondArray[j] = temp;
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
    if(secondArray[i] > x) {
        let temp = secondArray[i];
        secondArray[i] = secondArray[r];
        secondArray[r] = temp;
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
    let sortingInterval = setInterval(function () {
        if ((swap.length === 0 && !save.firstStep) || stop) {
            clearInterval(sortingInterval);
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
        let first = save.firstIndex;
        let second = save.secondIndex;

        let temp = array[first];
        array[first] = array[second];
        array[second] = temp;

        save.firstStep = false;
        drawQuickSort(save);
        currentStep++;
    }
}

function drawQuickSort(a) {
    for(let x of divs) {
        let c = x.classList;
        c.remove("leftHalf");
        c.remove("rightHalf");
        c.remove("firstHighlight");
        c.remove("secondHighlight");
    }

    let first = a.firstIndex;
    let second = a.secondIndex;
    let left = a.leftBorder;
    let mid = a.mid;
    let right = a.rightBorder;

    if(a.firstStep) {
        for(let i = left; i < mid; i++) {
            divs[i].classList.add("leftHalf");
        }
        for(let i = mid; i <= right; i++) {
            divs[i].classList.add("rightHalf");
        }
    } else {
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

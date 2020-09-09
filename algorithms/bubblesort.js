function bubbleSort() {
    for (let n = array.length; n > 1; n--) {
        for (let i = 0; i < n - 1; i++) {
            let a = {
                firstIndex: i,
                swapElements: false
            }
            if (array[i] > array[i + 1]) {
                let temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
                a.swapElements = true;
            }
            swap.push(a);
        }
    }

    swapCreated = true;
}

function bubbleSortAnimation() {
    sortInterval = setInterval(function () {
        if (swap.length === 0) {
            clearInterval(sortInterval);
            endAnimation();
            return;
        }

        // do one step
        bubbleSortStepByStep();
    }, interval);
}

function bubbleSortStepByStep() {
    // if elements must not be swapped
    if (currentStep % 2 === 0) {
        // get the next element
        let a = swap.shift();
        let firstIndex = a.firstIndex;

        save = a;

        drawBubbleSort({
            firstIndex: firstIndex,
            swapped: false
        });

        // if elements must be swapped, swap them and increase 'currentStep'
        if (a.swapElements) {
            currentStep++;
        }
    } else {
        // draw array with swapped elements
        let x = divs[save.firstIndex + 1];
        divs[save.firstIndex + 1] = divs[save.firstIndex];
        divs[save.firstIndex] = x;
        drawBubbleSort({
            firstIndex: save.firstIndex,
            swapped: true
        });
        currentStep++;
    }
}

function drawBubbleSort(o) {
    let i = o.firstIndex;
    if(currentFirstHighlight) currentFirstHighlight.classList.remove("firstHighlight");
    if(currentSecondHighlight) currentSecondHighlight.classList.remove("secondHighlight");

    if(o.swapped) {
        divs[i].classList.add("firstHighlight");
        currentFirstHighlight = divs[i];
        divs[i+1].classList.add("secondHighlight");
        currentSecondHighlight = divs[i+1];
    } else {
        divs[i+1].classList.add("firstHighlight");
        currentFirstHighlight = divs[i+1];
        divs[i].classList.add("secondHighlight");
        currentSecondHighlight = divs[i];
    }
    let content = document.getElementById("content");
    content.insertBefore(divs[i], divs[i+1]);
}
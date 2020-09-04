function bubbleSort() {
    for (let n = secondArray.length; n > 1; n--) {
        for (let i = 0; i < n - 1; i++) {
            let a = {
                firstIndex: i,
                swapElements: false
            }
            if (secondArray[i] > secondArray[i + 1]) {
                let temp = secondArray[i];
                secondArray[i] = secondArray[i + 1];
                secondArray[i + 1] = temp;
                a.swapElements = true;
            }
            swap.push(a);
        }
    }

    swapCreated = true;
}

function bubbleSortAnimation() {
    let sortingInterval = setInterval(function () {
        if (swap.length === 0 || stop) {
            endAnimation();
            clearInterval(sortingInterval);
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

        // if next iteration
        if (firstIndex < save[0]) {
            divs[save[1]].classList.add("sortedElem");
        }

        save[0] = firstIndex;
        save[1] = firstIndex+1;

      //  drawArray(save);
        drawBubbleSort({
            firstIndex: firstIndex,
            swapped: false
        });

        // if elements must be swapped, swap them and increase 'currentStep'
        if (a.swapElements) {
            let temp = array[firstIndex];
            array[firstIndex] = array[firstIndex+1];
            array[firstIndex+1] = temp;
            currentStep++;
        }
    } else {
        // draw array with swapped elements
        let x = divs[save[1]];
        divs[save[1]] = divs[save[0]];
        divs[save[0]] = x;
        drawBubbleSort({
            firstIndex: save[0],
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
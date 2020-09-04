function insertionSort() {
    for(let i = 0; i < secondArray.length; i++) {
        swap.push({
            firstIndex: i
        });
        let temp = secondArray[i];
        let j = i;
        // find correct position in the part of the array that is left from the current element and put it there
        while(j > 0 && secondArray[j-1] > temp) {
            secondArray[j] = secondArray[j-1];
            j--;
        }
        swap.push({
            firstIndex: i,
            correctPosition: j
        });
        secondArray[j] = temp;
    }
    swapCreated = true;
}

function insertionSortAnimation() {
    let sortingInterval = setInterval(function () {
        if (swap.length === 0 || stop) {
            endAnimation();
            clearInterval(sortingInterval);
            return;
        }

        // do one step
        insertionSortStepByStep();
    }, interval);
}

function insertionSortStepByStep() {
    let a = swap.shift();
    drawInsertionSort(a);
}

function drawInsertionSort(o) {
    let firstIndex = o.firstIndex;
    let correctPosition = o.correctPosition;

    if(currentFirstHighlight) currentFirstHighlight.classList.remove("firstHighlight");
    if(currentSecondHighlight) currentSecondHighlight.classList.remove("secondHighlight");

    if(correctPosition !== undefined) {
        if(correctPosition !== firstIndex) {
            document.getElementById("content").insertBefore(divs[firstIndex], divs[correctPosition]);
            currentSecondHighlight = divs[firstIndex];
            currentSecondHighlight.classList.add("secondHighlight");
            let tempDiv = divs[firstIndex];
            let temp = array[firstIndex];
            let j = firstIndex;
            while(j > correctPosition) {
                divs[j] = divs[j-1];
                array[j] = array[j-1];
                j--;
            }
            divs[j] = tempDiv;
            array[j] = temp;
        } else {
            currentSecondHighlight = divs[firstIndex];
            currentSecondHighlight.classList.add("secondHighlight");
        }
    } else {
        currentFirstHighlight = divs[firstIndex];
        currentFirstHighlight.classList.add("firstHighlight");
    }

}
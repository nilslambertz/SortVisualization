function insertionSort() {
    for(let i = 0; i < array.length; i++) {
        swap.push({
            firstIndex: i
        });
        let temp = array[i];
        let j = i;
        // find correct position in the part of the array that is left from the current element and put it there
        while(j > 0 && array[j-1] > temp) {
            array[j] = array[j-1];
            j--;
        }
        swap.push({
            firstIndex: i,
            correctPosition: j
        });
        array[j] = temp;
    }
    swapCreated = true;
}

function insertionSortAnimation() {
    sortInterval = setInterval(function () {
        if (swap.length === 0) {
            clearInterval(sortInterval);
            endAnimation();
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
            let j = firstIndex;
            while(j > correctPosition) {
                divs[j] = divs[j-1];
                j--;
            }
            divs[j] = tempDiv;
        } else {
            currentSecondHighlight = divs[firstIndex];
            currentSecondHighlight.classList.add("secondHighlight");
        }
    } else {
        currentFirstHighlight = divs[firstIndex];
        currentFirstHighlight.classList.add("firstHighlight");
    }

}
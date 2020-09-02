function bogoSortAnimation() {
    let sortingInterval = setInterval(function () {
        // if array is sorted or stop is pressed, make buttons visible and return
        if (checkSorted() === 0 || stop || swap[0] <= 0) {
            if(swap[0] === 0) {
                swap[0] = bogoTrys;
            }
            changeStyle(true);
            clearInterval(sortingInterval);
            return;
        }

        bogoSortStepByStep();
        swap[0]--;
    }, interval);
}

function bogoSortStepByStep() {
    array = shuffleArray(array);
    drawArray();

    if (checkSorted() === 0 || stop) {
        changeStyle(true);
    }
}
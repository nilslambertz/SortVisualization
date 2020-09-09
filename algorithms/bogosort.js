function bogoSortAnimation() {
    sortInterval= setInterval(function () {
        // if array is sorted or stop is pressed, make buttons visible and return
        if (isSorted() || swap[0] <= 0) {
            if(isSorted()) {
                swap = [];
            }
            endAnimation();
            clearInterval(sortInterval);
            return;
        }

        bogoSortStepByStep();
        swap[0]--;
    }, interval);
}

function bogoSortStepByStep() {
    shuffleArrayBogoSort(array);
    drawBogoSort();
}

function shuffleArrayBogoSort(a) {
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let x = a[i];
        a[i] = a[j];
        a[j] = x;
        let temp = divs[i];
        divs[i] = divs[j];
        divs[j] = temp;
    }
}

function drawBogoSort() {
    let content = document.getElementById("content");
    content.innerHTML = "";
    for(let i = 0; i < divs.length; i++) {
        content.appendChild(divs[i]);
    }
}
function testSort(l = 100, v = 100) {
    if(l > 600) {
        console.log("Maximum array-length is 600!");
        l = 600;
    }
    if(l < 2) {
        console.log("Minimum array-length is 2!");
        l = 2;
    }

    let startTime;
    let endTime;
    let time;
    let correct;
    console.log("Starting test with " + v + " arrays per algorithm and array-length " + l);

    console.log("\t1. BubbleSort");
    correct = 0;
    startTime = performance.now();
    for (let i = 0; i < v; i++) {
        createArray(l);
        bubbleSort();
        correct += (checkSorted() === 0) ? 1 : 0;
    }
    endTime = performance.now();
    time = endTime - startTime;
    console.log("\t\t" + correct + " out of " + v + " tests correct!");
    console.log("\t\tComputation time: " + time.toFixed(2) + "ms");

    console.log("\t2. InsertionSort");
    correct = 0;
    startTime = performance.now();
    for (let i = 0; i < v; i++) {
        createArray(l);
        insertionSort();
        correct += (checkSorted() === 0) ? 1 : 0;
    }
    endTime = performance.now();
    time = endTime - startTime;
    console.log("\t\t" + correct + " out of " + v + " tests correct!");
    console.log("\t\tComputation time: " + time.toFixed(2) + "ms");

    console.log("\t3. MergeSort");
    correct = 0;
    startTime = performance.now();
    for (let i = 0; i < v; i++) {
        createArray(l);
        mergeSort(0, array.length - 1);
        correct += (checkSorted() === 0) ? 1 : 0;
    }
    endTime = performance.now();
    time = endTime - startTime;
    console.log("\t\t" + correct + " out of " + v + " tests correct!");
    console.log("\t\tComputation time: " + time.toFixed(2) + "ms");

    console.log("\t4. QuickSort");
    correct = 0;
    startTime = performance.now();
    for (let i = 0; i < v; i++) {
        createArray(l);
        quickSort(0, l-1);
        correct += (checkSorted() === 0) ? 1 : 0;
    }
    endTime = performance.now();
    time = endTime - startTime;
    console.log("\t\t" + correct + " out of " + v + " tests correct!");
    console.log("\t\tComputation time: " + time.toFixed(2) + "ms");

    return "Test finished!";
}
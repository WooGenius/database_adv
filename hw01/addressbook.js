//load modules
var fs = require('fs'),
    hashmap = require('hashmap').HashMap,
    map = new hashmap(),
    exec = require('child_process').exec;

//env setting
var dataStorePATH = './jsonStore.json',
    testJsonData = undefined,
    rawJsonData = undefined;

// time measurement
var hrstart, hrend;

//example json data
//[
//    {
//        "personalNum": 001122,
//        "name": "young",
//        "phoneNum": 010010010
//    },
//    {
//        "personalNum": 002233,
//        "name": "kim",
//        "phoneNum": 010010011
//    }
//]

//load file
var loadStorage = function () {
    //check hashmap size (init once at first execute)
    if (map.count() <= 0) {
        console.log('\n//////////////\nstart load');
        //read file and convert data to hashmap
        var data = fs.readFileSync(dataStorePATH, 'utf8');
        rawJsonData = JSON.parse(data);
        rawJsonData.forEach(function (obj) {
            convertData(obj, null);
        });

        console.log('finish load\n//////////////\n');
    };
};

//convert data to hashmap structure
var convertData = function (obj, callback) {
    //resolve obj
    var key = obj.personalNum,
        value = {
            'name': obj.name,
            'phoneNum': obj.phoneNum
        };

    //set value to hashmap
    map.set(key, value);

    if (callback) callback();
};

//select specific value
var select = function (key) {
    return map.get(key);
};

//insert value to storage
var insert = function (obj) {
    //check duplication
    if (map.has(obj.personalNum)) {
        console.log('duplicated key. insert another personalNum');
        return;
    }
    convertData(obj, function () {
        rawJsonData.push(obj);
        fs.writeFileSync('jsonStore.json', JSON.stringify(rawJsonData));
    });
};

//test function
var test = function (testName, testFunction) {
    hrstart = process.hrtime();
    if (testFunction) {
        testFunction();
    };
    hrend = process.hrtime(hrstart);

    console.info(testName + " Execution time : %ds %dms\n", hrend[0], hrend[1]/1000000);
};

//////////////////////////////////////////

// test load 100000 data
test("Load 100000 Data", loadStorage);

// test select 1 row
test("Select 1 Row", function () {
    console.log(select(1122));
});

// test insert 1 data
test("Insert 1 Data", function () {
    insert({"personalNum": 100003, "name": "Alice Patterson", "phoneNum": "4-(881)988-3412"});
});

// test select 1 row
test("Select 1 Row", function () {
    console.log(select(100003));
});

// clear hash map
map.clear();
testJsonData = rawJsonData;
rawJsonData = [];

// test insert 100000 data
test("Insert 100000 Data", function () {
    testJsonData.forEach(function (obj) {
        insert(obj);
    });
});
const version = require('./package.json').version;

console.log(version);

var fs = require('fs');
fs.writeFile("./dist/test.txt", `Hey there! Version: ${version}`, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
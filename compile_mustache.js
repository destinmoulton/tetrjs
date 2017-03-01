var Hoganizer = require('hoganizer');
var hoganizer = new Hoganizer({
    templateDir: './templates',
    extension: '.mustache',
    writeLocation: './tetrjs.templates.js'
});

// Compile all mustache templates in `./templates` and write
// them into frontend js file to `./templates.js`.
hoganizer.write();
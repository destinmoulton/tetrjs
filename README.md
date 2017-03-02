#### What is Tetrjs?
***
Tetrjs is a javascript implementation of the classic Russian tile matching game.

Tetrjs should work in most modern browsers. I have not tested Internet Explorer, but IE8+ should work fine (guessing).

#### Requirements
***
Tetrjs has a few requirements:

* Twitter Bootstrap > 3.3.5 
* jQuery
* hogan.js

#### HTML and Templates
***
The HTML hogan/mustache templates are stored in the templates directory.

The templates are compiled using [gulp-hogan-precompile](https://github.com/eneko89/gulp-hogan-precompile).

The gulpfile contains a gulp 'compile-templates' and 'watch'.

Running `$ npm run compile:mustache` will start the compiler in watch mode.

#### License
***
Tetrjs is released under the MIT license.



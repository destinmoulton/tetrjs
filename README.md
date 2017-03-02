#### What is Tetrjs?
***
Tetrjs is a JavaScript implementation of the classic Russian tile matching game. Tetrjs utitilizes jQuery to manipulate the HTML and CSS to render the board and blocks.

Tetrjs should work in most modern browsers. I have not tested Internet Explorer, but IE8+ should work fine (guessing).

#### Requirements
***
Tetrjs has a few requirements:

* Twitter Bootstrap > 3.3.5 (just the css)
* jQuery
* hogan.js

Note: Tetrjs works fine without Bootstrap. The icons and buttons are a little drab without it.

### Embedding Tetrjs in Your Website
***
First, clone the repository into a directory.

`$ git clone https://github.com/destinmoulton/tetrjs`

CSS Includes
```html
<!-- Bootstrap for Better Buttons and Icons -->
<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

<!-- Tetrjs CSS -->
<link rel="stylesheet" type="text/css" href="tetrjs.css">
```

JS Includes
```html
<!-- Required Javascript Libraries -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="https://twitter.github.com/hogan.js/builds/3.0.1/hogan-3.0.1.js"></script>

<!-- The Tetrjs Block Definitions -->
<script src="tetrjs.blocks.js"></script>

<!-- The Tetrjs Pre-compiled Mustache Templates -->
<script src="tetrjs.templates.js"></script>

<!-- The Tetrjs Game Logic -->
<script src="tetrjs.js"></script>

<script>
    $(function(){
        // Create an instance of Tetrjs
        var tetrjs = new Tetrjs();
        // Run Tetrjs
        tetrjs.run('tetrjs-wrapper');
    });
</script>
```

HTML Container
```html
<!-- Put this container where you want Tetrjs to appear -->
<div id="tetrjs-wrapper"></div>
```

Note: You can change the name 'tetrjs-wrapper' to whatever you prefer. Just remember to change it in both locations (HTML and JS).

#### HTML Templates
***
The HTML for Tetrjs is loaded via mustache templates. The templates are stored in the 'templates' directory.

The templates are pre-compiled into the file tetrjs.templates.js.

The templates are compiled using [gulp-hogan-precompile](https://github.com/eneko89/gulp-hogan-precompile).

The gulpfile contains a gulp 'compile-templates' and 'watch'.

Running `$ npm run compile:mustache` will start the compiler in watch mode.

#### License
***
Tetrjs is released under the MIT license.



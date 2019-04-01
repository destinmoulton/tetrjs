#### What is Tetrjs?

---

Tetrjs is a JavaScript implementation of the classic Russian tile matching game. Tetrjs utitilizes jQuery to manipulate the HTML and CSS to render the board and blocks.

Tetrjs should work in most modern browsers. I have not tested Internet Explorer, but IE8+ should work fine (guessing).

### Embedding Tetrjs in Your Website

---

First, clone the repository into a directory.

`$ git clone https://github.com/destinmoulton/tetrjs`

Add the CSS to your html file:

```html
<!-- Tetrjs CSS -->
<link rel="stylesheet" type="text/css" href="tetrjs.css" />
```

Add the JavaScript:

```html
<!-- The Tetrjs Game Logic -->
<script src="tetrjs.min.js"></script>

<script>
    $(function() {
        // Create an instance of Tetrjs
        var tetrjs = new Tetrjs();
        // Run Tetrjs
        tetrjs.run("tetrjs-wrapper");
    });
</script>
```

HTML Container

```html
<!-- Put this container where you want Tetrjs to appear -->
<div id="tetrjs-wrapper"></div>
```

Note: You can change the name 'tetrjs-wrapper' to whatever you prefer. Just remember to change it in both locations (HTML and JS).

#### Dev Notes

To compile the css and tetrjs.dev.js while developing:

```sh
$ gulp watch
```

To build the minified distribution:

```sh
$ gulp build
```

#### License

MIT

## Version 2.0.0

-   Removed all jquery calls. Replaced with native js calls.
-   Removed all reliance on Bootstrap css.
-   Rebuilt style in scss
-   Added a gulpfile with:
    -   Watchers for js and scss
    -   Build script for dist
    -   Added babel & rollup to combine libs and compile es6+ to es5
-   Rebuilt board and blocks with arrays instead of numerically keyed objects.
-   Migrated all hogan/mustache templates into template literals (templates.js)
-   Added a util.js file with some basic dom utilities
-   Rewrote core as an es6 class

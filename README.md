# CSS Stylesheet

A minimal custom CSS file based on slight modifications of [OpenProps UI](https://open-props-ui.netlify.app/) built with the best custom css variables from [OpenProps](https://open-props.style/).

## Overview

This project is a flat-file CSS implementation that adapts and slightly changes styles from two open-source CSS libraries. It is intended for lightweight, simple use cases without the overhead of a full framework.

## Usage

Download or link the `styles.css` file into your project; but be aware this is not minified or optimized for production use.
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Deufel/css/styles.css">
```

## Tips

Surreal JS works very nicely with a class based style system; as all the button in this design system require the class of ```button``` you can bulk add them to a div...

```html
<div>
<script>me().any("button").classAdd('button')</script>
...
</div>
```

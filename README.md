responsive-image-zoom.js
=====================

jQuery plugin for ResponsiveImageZoom

## Development

### Requires

* [jQuery](http://jquery.com/)
* [jquery.hammer.js](https://github.com/EightMedia/jquery.hammer.js)

### Installation

Include script *after* **jQuery** and **jquery.hammer.js**

```html
<script src="/path/to/responsive-image-zoom.js"></script>
```

## Usage

### Basic

```html
<div class="element">
    <img src="/path/to/image.jpg" alt="Image">
</div>
```

### LazyLoading

```html
<div class="element">
    <img data-url="/path/to/image.jpg" src="/path/to/image.jpg" alt="Image">
</div>
```

### Javascript

```js
var config = {};
$('.element').responsiveImageZoom(config);
```

### CSS

```css
.element{
    max-width: 500px;
    width: 100%;
}
.element img{
    max-width: 100%;
    display: block;
}
.element *{
    -webkit-user-drag: none;
    -webkit-user-select: none;
}
```

## Configuration

Configuration options can be passed to the function as shown above

#### event

Controls the event on which we enlarge the image and begin the zoom functionality. Can be any event (including hammerjs events)

default: **doubletap**
    
    event: 'mouseover mouseout'

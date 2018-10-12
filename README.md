# Simple-nv-slider
Course project slider.

## Usage
HTML
```html
<head>
    <link rel="stylesheet" href="/dist/css/nv-slider.bundle.css">
    <script src="/dist/js/nv-slider.bundle.js"></script>
</head>
<body>
  <div class="nv-slider">
    <div data-bi-slider="main"></div>
    <div data-bi-slider="next"></div>
    <div data-bi-slider="prev"></div>
  </div>
</body>  
```
```javascript
 let slider = new NvSlider({height:'500px'});
      slider.loadImages([
          '/image/path',
          '/image/path',
          '/image/path'
      ])
      slider.ini();
```

### Options - added in initialization
```javascript
{
  "container": "main", // data-bi-slider="main" -> selecting the container HTML Node
  "nextBtn": "next", // data-bi-slider="next" -> selecting the next button HTML Node
  "prevBtn": "prev",// data-bi-slider="prev" -> selecting the previous button HTML Node
  "width": "100%", // the width of the parent container used for further calculations and styling
  "height": "300px", //  the heigh of the parent container used for further calculations and styling
  "slices":10, // How many slices is going to have for a single slide 
  "offset": 500, // ms between every slice triggering effect
  "speed": 60, // Depricated - animation speed
  "auto":5000 // ms between automatic slide change
}

```

### Public API:
*******
Slide change can be activated outside of the Slider private context
```javascript
      slider.next();
      slider.prev(); 
```

#### Future Releases : 
1. Adding automatic sliding. - Implemented in release 0.0.2;







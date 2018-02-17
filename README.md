# angular-zoom [![npm version](https://badge.fury.io/js/angular-zoom.svg)](https://badge.fury.io/js/angular-zoom)
A angular zoom library for images based on zoom.js

### Features

* Smooth transition of image to the original size
* After clicking the image to zoom in, ESC key | scroll away | Mouse click - to zoom out

[Demo](https://nishantmc.github.io/angular-zoom.github.io/)

![Screenshot](zoomDemo.gif)
### Installation

```bash
yarn add angular-zoom --save

# OR

npm install angular-zoom --save
```

### Setup

Import ZoomModule

```js
import { ZoomModule } from 'angular-zoom';

@NgModule({ imports: [ ZoomModule ] })
```

Then add zoom directive to img elements

``` HTML
<img src="../assets/images/palm.jpg" zoom>
```

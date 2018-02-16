# angular-zoom [![npm version](https://badge.fury.io/js/angular-zoom.svg)](https://badge.fury.io/js/angular-zoom)
A angular zoom library for images based on zoom.js

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

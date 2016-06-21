# Illustation of an Interpolation Function

Demo: http://mgrf.de/dev/spreadPlot/

Drag graph to adjust y.
Mouse over blue circle to test.

Similar to [Ease-In-Out Interpolation](https://www.w3.org/TR/css3-transitions/#transition-timing-function-property), but with better properties:

```javascript
const spreadFn = (y) => y === 0 ? (x) => x : (y > 0
	? (x) => Math.atan( (x-0.5)*y*2 )/Math.atan(y)/2+0.5
	: (x) => Math.tan( (x-0.5)*Math.atan(-y)*2 )/-y/2+0.5) /*inverse*/
```
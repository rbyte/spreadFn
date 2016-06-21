/*
 Matthias Graf
 matthias.graf@mgrf.de
 2016
 GNU AGPL v3
 */

(function() {
	
var spreadY = 2
const spreadFn = (y) => y === 0 ? (x) => x
	: (y > 0
		? (x) => Math.atan( (x-0.5)*y*2 )/Math.atan(y)/2+0.5
		: (x) => Math.tan( (x-0.5)*Math.atan(-y)*2 )/-y/2+0.5 /*inverse*/
)
	
const svg = d3.select("#spreadPlot")
	.append("svg")
	.attr("viewBox", "-0.5 -1.2 1.8 1.4")

const graph = svg.append("path").classed("graph", true)

function markPoint(x, y) {
	svg.append("line").attr({x1: x, y1: +0, x2: x, y2: -y}).classed("markPoint", true)
	svg.append("line").attr({x1: 0, y1: -y, x2: x, y2: -y}).classed("markPoint", true)
	svg.append("circle").attr({cx: x, cy: -y, r: 0.02})
}

svg.append("line").attr({x1: -0.1, y1: 0.0, x2: 1.1, y2: +0.0}).classed("axis", true)
svg.append("line").attr({x1: +0.0, y1: 0.1, x2: 0.0, y2: -1.1}).classed("axis", true)

markPoint(0, 0)
markPoint(.5, .5)
markPoint(1, 1)

svg.append("text").attr({x: -0.03, y: +0.12, "text-anchor": "end"}).text("(0;0)")
svg.append("text").attr({x: +1.03, y: -1.0, "text-anchor": "start"}).text("(1;1)")
	
const playballX = -0.35
const playBallLineY = svg.append("line").classed("playBallLine", true)
	.attr({x1: playballX, y1: 0, x2: 0, y2: 0})
const playBallLineX = svg.append("line").classed("playBallLine", true)
	.attr({x1: 0, y1: 0, x2: 0, y2: 0})
const playball = svg.append("circle")
	.attr({cx: playballX, cy: 0, r: 0.05, fill: "rgb(88, 178, 255)"})
const transitionDuration = 5000
var transitionUp = true
var transitionStart

function setPlayball(x) {
	var y = -spreadFn(spreadY)(x)
	playball.attr("cy", y)
	playBallLineY.attr({y1: y, x2: x, y2: y})
	playBallLineX.attr({x1: x, x2: x, y2: y})
}

function playBallTransition() {
	if (transitionStart === undefined)
		return
	var delta = Date.now() - transitionStart
	console.assert(delta >= 0)
	if (delta > transitionDuration) {
		// make sure we reach the end
		setPlayball(transitionUp ? 1 : 0)
		// switch
		transitionUp = !transitionUp
		transitionStart = undefined
		return
	}
	var x = delta/transitionDuration
	setPlayball(transitionUp ? x : 1-x)
	requestAnimationFrame(playBallTransition)
}
	
playball.on("mousemove", function (d, i) {
	if (!transitionStart) {
		transitionStart = Date.now()
		requestAnimationFrame(playBallTransition)
	}
})

	
const yText = svg.append("text")
	.attr({x: 0.55, y: -0.15, fill: "red"})

function updateGraph() {
	let data = []
	for (let x=0; x<=1.0001; x+=0.005)
		data.push([x, spreadFn(spreadY)(x)])
	let d = ["M0,0"]
	for (let [x,y] of data)
		d.push("L"+x.toFixed(3)+","+((-y).toFixed(4)))
	graph.attr("d", d.join(" "))
	yText.text("y="+spreadY.toFixed(1))
}

const xor = (a,b) => a ? !b : b
var mousePos
	
svg.on("mousemove", function (d, i) {
	mousePos = d3.mouse(this)
}).call(d3.behavior.drag()
	.on("drag", function (d) {
		dragInProgress = true
		let [x,y] = mousePos
		y = -y
		x = Math.max(0, Math.min(x, 1))
		y = Math.max(0, Math.min(y, 1))
		
		// this is an approximation to find a spreadFn, that is close to the mouse pointer
		spreadY = xor(x+y > 1, y <= x)
			? +Math.pow( (y-0.5)/(x-0.5) , 2)-1
			: -Math.pow( (x-0.5)/(y-0.5) , 2)+1
		spreadY = isNaN(spreadY) ? 0 : spreadY
		updateGraph()
	})
)

updateGraph(2)
console.log("main")
})()
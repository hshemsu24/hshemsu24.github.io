const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

// An object that represents a 2-d point, consisting of an
// x-coordinate and a y-coordinate. The `compareTo` function
// implements a comparison for sorting with respect to x-coordinates,
// breaking ties by y-coordinate.
function Point (x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;

    // Compare this Point to another Point p for the purposes of
    // sorting a collection of points. The comparison is according to
    // lexicographical ordering. That is, (x, y) < (x', y') if (1) x <
    // x' or (2) x == x' and y < y'.
    this.compareTo = function (p) {
	if (this.x > p.x) {
	    return 1;
	}

	if (this.x < p.x) {
	    return -1;
	}

	if (this.y > p.y) {
	    return 1;
	}

	if (this.y < p.y) {
	    return -1;
	}

	return 0;
    }

    // return a string representation of this Point
    this.toString = function () {
	return "(" + x + ", " + y + ")";
    }
}

// An object that represents a set of Points in the plane. The `sort`
// function sorts the points according to the `Point.compareTo`
// function. The `reverse` function reverses the order of the
// points. The functions getXCoords and getYCoords return arrays
// containing x-coordinates and y-coordinates (respectively) of the
// points in the PointSet.
function PointSet () {
    this.points = [];
    this.curPointID = 0;

    // create a new Point with coordintes (x, y) and add it to this
    // PointSet
    this.addNewPoint = function (x, y) {
	this.points.push(new Point(x, y, this.curPointID));
	this.curPointID++;
    }

    // add an existing point to this PointSet
    this.addPoint = function (pt) {
	this.points.push(pt);
    }

    // sort the points in this.points 
    this.sort = function () {
	this.points.sort((a,b) => {return a.compareTo(b)});
    }

    // reverse the order of the points in this.points
    this.reverse = function () {
	this.points.reverse();
    }

    // return an array of the x-coordinates of points in this.points
    this.getXCoords = function () {
	let coords = [];
	for (let pt of this.points) {
	    coords.push(pt.x);
	}

	return coords;
    }

    // return an array of the y-coordinates of points in this.points
    this.getYCoords = function () {
	let coords = [];
	for (pt of this.points) {
	    coords.push(pt.y);
	}

	return coords;
    }

    // get the number of points 
    this.size = function () {
	return this.points.length;
    }

    // return a string representation of this PointSet
    this.toString = function () {
	let str = '[';
	for (let pt of this.points) {
	    str += pt + ', ';
	}
	str = str.slice(0,-2); 	// remove the trailing ', '
	str += ']';

	return str;
    }
}

function ConvexHullViewer (svg, ps) {
    this.svg = svg;  // an svg object where the visualization is drawn
    this.ps = ps;    // the pointset we are adding points to 
    
    // function to add and draw point; takes in event (user click), adds point with relevant coordinates to ps and DOM element to svg
    this.drawPoint = function (e) {
        
        const rect = this.svg.getBoundingClientRect();
        let x = e.clientX - rect.left;              // get x value of click
        let y = e.clientY - rect.top;               // get y value of click

        // creating DOM element and assinging the attributed 
        let addPoint = document.createElementNS(SVG_NS, "circle");
        addPoint.setAttributeNS(null, "cx", x);
        addPoint.setAttributeNS(null, "cy", y);
        addPoint.setAttributeNS(null, "r", 6);
        addPoint.setAttributeNS(null, "stroke", "black");
        addPoint.setAttributeNS(null, "cursor", "pointer"); //?

        //add event listener so points highlight when mouseover 
        addPoint.addEventListener("mouseover", function () {
            addPoint.setAttributeNS(null, "fill", "lightgreen");
        })
        addPoint.addEventListener("mouseleave", function () {
            addPoint.setAttributeNS(null, "fill", "black");
        })

        this.svg.appendChild(addPoint);             
        this.ps.addNewPoint(x,y);               // Adds point to pointset
    }

    // adding event listener to this.svg to call drawPoint upon user click
    this.svg.addEventListener("click", (event) => {
        this.drawPoint(event);
        console.log(this.ps.points);
    });
   
    // function to draw a line between two points 
    this.connectPoints = function (p1, p2) {
        // line should connect from p1 to p2; 
        let line = document.createElementNS(SVG_NS, "line");
        line.setAttributeNS(null, "x1", p1.x);
        line.setAttributeNS(null, "y1", p1.y);
        line.setAttributeNS(null, "x2", p2.x);
        line.setAttributeNS(null, "y2", p2.y);
        line.setAttributeNS(null, "stroke", "black");
        line.setAttributeNS(null, "stroke-width", "2");
        this.svg.appendChild(line);
    }

}
	
/*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the 
 */
function ConvexHull (ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization
    this.stepCount = 1;    // Counts how many steps are taken 
    this.started = false;  // Boolean to check if animation has started 
    this.liveAnimate = null;

    // start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {
         this.started = true;	
    }

    // perform a single step of the Graham scan algorithm performed on ps
    this.step = function () {

        // If statement to perform step animation as long as boolean is true AND number of steps is less than total length of points
        if(this.started == true && this.stepCount <= this.ps.points.length){
            this.drawCH(this.stepCount);    // calls draw function to visualize step
            this.stepCount++;               // increment step count
        }

    }

    // animate begins the animation
    this.animate = function (){
        console.log("animate pressed");
       
        if (this.liveAnimate == null) {
            this.start();               // call function to begin animation
            this.stepCount = 1;
            // Animates the complete convex hull by stepping through one at a time until the step count is > # of points
            this.liveAnimate = setInterval(() => {
            this.step();                // calls step function 

            // stops animation if statement is true 
            if(this.stepCount > this.ps.points.length){
                this.stopAnimation();
            } 
            }, 700);
        }
    }

    // stopAnimation function stops animation once end of convex hull is reached 
    this.stopAnimation = function () {
        clearInterval(this.liveAnimate);   // method to end the looping of the interval function 
        this.liveAnimate = null;           // resets value
        console.log("animation completed");
    }

    // finalCH produces the complete Convex Hull when button is clicked 
    this.finalCH = function (){
        console.log("Here is the complete convex hull");
        
        if (this.liveAnimate == null) {
            this.start();
            this.liveAnimate = setInterval(() => {
            //this.drawCH();      // Calls on function to draw complete animation 
            this.step();
            // stops animation if statement is true 
            if(this.stepCount > this.ps.points.length){
                this.stopAnimation();
            }
        }, 0);
        }
    }


    this.drawCH = function (loops) {
       
        //Delete all old lines before redrawing with new # of iters
        let svg = document.querySelector("#convex-hull-box");
        for(let i= 0; i < svg.children.length; i ++) {
            console.log("length = " + svg.children.length);
            if (svg.children[i].tagName === "line") {
                if ( ! svg.children[i].classList.contains("curCheck")) {
                    svg.children[i].remove();
                    i -= 1; 
                }
            }
        }
            
        //top half 
        this.ps.sort(); 
        allPoints = this.ps.points;
        convexSetTop = [];
        // sort the points and push first two onto stack
        // for every other point (after first two) in set:
        for (let i = 0; i < loops; i ++) {

            c = allPoints[i]; //current point
                
            while (convexSetTop.length >= 2 &&  orientation(convexSetTop[convexSetTop.length-2],convexSetTop[convexSetTop.length-1],c) == 1) {
                convexSetTop.pop();
            }
            //if proper turn, puch current point 
            convexSetTop.push(c);
        }

        // bottom half
        this.ps.reverse();
        allPoints = this.ps.points;
        convexSetBot = [];
        for (let i = 0; i < loops; i ++) {
            
            c = allPoints[i]; //current point

            while (convexSetBot.length >= 2 && orientation(convexSetBot[convexSetBot.length-2],convexSetBot[convexSetBot.length-1],c) == 1) { //while not right turn
                convexSetBot.pop();     
            }
            
            convexSetBot.push(c); //if proper turn, push current point
        }

        // join top half with bottom half
        for (const pt of convexSetBot) {
            if (convexSetTop.includes(pt)) {
                convexSetBot.splice(convexSetBot.indexOf(pt), 1);
            }
        }

        this.chSet = convexSetTop.concat(convexSetBot);
        
        if (loops < this.ps.points.length) {
            for (let i =0; i < convexSetTop.length-1; i ++) {
                //connects the current sets of points from top array
                    viewer.connectPoints(convexSetTop[i], convexSetTop[i+1]);
            }
                
            for (let i =0; i < convexSetBot.length-1; i ++) {
                //connects the current sets of points from bottom array
                    viewer.connectPoints(convexSetBot[i], convexSetBot[i+1]);
            }
        } else {

            //once you get to last iteration, connect all points in the final set
            for (let i = 0; i < this.chSet.length-1; i ++) {
                viewer.connectPoints(this.chSet[i], this.chSet[i+1]);
            }
            //connects first to last point
            viewer.connectPoints(this.chSet[this.chSet.length-1], this.chSet[0]);
        }

        return this.chSet;
    }


    // Return a new PointSet consisting of the points along the convex
    // hull of ps. This method should **not** perform any
    // visualization. It should **only** return the convex hull of ps
    // represented as a (new) PointSet. Specifically, the elements in
    // the returned PointSet should be the vertices of the convex hull
    // in clockwise order, starting from the left-most point, breaking
    // ties by minimum y-value.
    this.getConvexHull = function () {
        len = this.ps.size();           // len = total # of points in pointset 
        
        convexSetTop = [];              // Array to hold bottom of convex hull values
        this.ps.sort();                 

        // Finds the top of the convex hull of the pointset 
        for(i = 0; i< len; i++){
            // As Long as more than 2 points exist in the array AND a-b-c is a left turn 
            while(convexSetTop.length >= 2 && 
                orientation(convexSetTop[convexSetTop.length-2], convexSetTop[convexSetTop.length-1], this.ps.points[i]) == 1){

                convexSetTop.pop();                     // Remove the highest index from the array 
            }

            convexSetTop.push(this.ps.points[i]);       // Add the point to the array 
        }

        this.ps.reverse();              // Reverse array to repeat the same process but now to find the bottom of the convex hull 

        convexSetBot = [];              // Array to hold bottom of convex hull values

        // Finds the bottom of the convex hull of the pointset 
        for(i = 0; i< len; i++){
            // As Long as more than 1 point exists in the array AND a-b-c is a left turn
            while(convexSetBot.length >= 2 && 
                orientation(convexSetBot[convexSetBot.length-2], convexSetBot[convexSetBot.length-1], this.ps.points[i]) == 1){
                convexSetBot.pop();                     // Remove the highest index from the array
            }
                convexSetBot.push(this.ps.points[i]);   // Add the point to the array 
        }
       
        chSet = new PointSet();        // Creating a now pointset which will be the return value of this function

        // Iterating through array containing top convex hull points and adding them to chSet
        for(i = 0; i< convexSetTop.length; i++){
            chSet.addNewPoint(convexSetTop[i].x, convexSetTop[i].y);
        }
       
        // Iterating through array containing bottom convex hull points and adding them to chSet
        for(i = 1; i< convexSetBot.length; i++){
            chSet.addNewPoint(convexSetBot[i].x, convexSetBot[i].y);
        }
        
        return chSet;
    }

    // Determines whether it is a left turn or a right turn 
    function orientation(a, b, c){
        if ((c.y - b.y)*(b.x-a.x)-(b.y-a.y)*(c.x-b.x) >= 0){
            return 1;                   // is a left turn 
        } else {
            return 0;                   // is a right turn 
        }
    }
}

//Created to run the tester and use convex hull at the same time without having to comment lines out
function runCH(){
    document.addEventListener("DOMContentLoaded", function(){
        const svg = document.querySelector("#convex-hull-box");
        const ps = new PointSet();
        const chv = new ConvexHullViewer(svg, ps);
        const ch = new ConvexHull(ps, chv);

        let startButton = document.querySelector("#start");
        startButton.addEventListener("click", function () {
            ch.start();
        })

        let stepButton = document.querySelector("#step");
        stepButton.addEventListener("click", function () {
            ch.step();
        })

        let animateButton = document.querySelector("#animate");
        animateButton.addEventListener("click", function () {
            ch.animate();
        })

        let finalizeButton = document.querySelector("#final");
        finalizeButton.addEventListener("click", function () {
            ch.finalCH();
        })
    })
    
}

try {
    exports.PointSet = PointSet;
    exports.ConvexHull = ConvexHull;
  } catch (e) {
    console.log("not running in Node");
  }
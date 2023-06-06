const SVG_NS = "http://www.w3.org/2000/svg";

//instance of a clustering problem
function agCluster(c) {
  // the number of clusters to be found; for hierarchical cluster default is 1.
  this.c = c;

  // the x- and y-coordinates of the data points
  this.xPoints = [];
  this.yPoints = [];
  // number of the cluster
  this.clusters = [];

  // true if the means have already been initialized
  this.initalized = false;

  // Initializing method if not intialized already
  this.initialize = function () {
    if (!this.initialized) {
      this.initialized = true; // initializing algorithm
      this.currentClusters = this.xPoints.length; // Max number of clusters
      this.distances = new Array(this.xPoints.length) // Creating a 2-D matrix filled with 0's
        .fill(0)
        .map(() => Array(this.xPoints.length).fill(0));
      this.calculateDists();
    }
  };

  // Calculates distances between a set of two points and stores it in the 2-D array
  this.calculateDists = function () {
    //initially starting with an empty 2d array

    // for i=1 to N:
    for (let i = 0; i < this.xPoints.length; i++) {
      //for j=1 to i:
      for (let j = 0; j < i; j++) {
        //dis_mat[i][j] = distance[di, dj]
        this.distances[i][j] = this.distance(i, j); // Calls on distance calculating function to retrieve value
      }
    }
    return this.distances;
  };

  // function to calculator distance between two points using the Pythagorean theorem
  this.distance = function (i, j) {
    let dist = 0;

    let x1 = this.xPoints[i];
    let x2 = this.xPoints[j];
    let y1 = this.yPoints[i];
    let y2 = this.yPoints[j];

    dist = Math.hypot(x2 - x1, y2 - y1);

    return parseFloat(dist.toFixed(2)); // Converting value to a float with two decimal points
  };

  // function used to display the matrix of distances, for testing purposes
  this.printMatrix = function (arr) {
    var arrText = "";

    // iterating through nested for loops to get distances
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr[i].length; j++) {
        arrText += arr[i][j] + " ";
      }
      arrText = "";
    }
  };

  // function used to find the minimum distance between two points in the array
  this.findMin = function (arr) {
    let minI = -1; // pt1
    let minJ = -1; // pt2
    let currMin = Number.POSITIVE_INFINITY;

    // Iterating through arr to find the minimum distance
    for (let i = 0; i < arr.length; i++) {
      //for j=1 to i:
      for (let j = 0; j < i; j++) {
        // if the current distance is less than the currMin then replace it
        if (this.distances[i][j] < currMin) {
          currMin = this.distances[i][j];
          minI = i; // updating points
          minJ = j;
        }
      }
    }
    //"cross off" out the place that was found as min to a maximum so it doesn't get found again
    this.distances[minI][minJ] = Number.POSITIVE_INFINITY;
    return [minI, minJ];
  };

  // function used to determine if 2 points belong to the same cluster
  this.checkClusters = function (i, j) {
    if (this.clusters[i] == this.clusters[j]) {
      return true;
    }
    return false;
  };

  // function used to merge points to the same cluster
  this.mergeClusters = function (i, j) {
    let stay = this.clusters[i];
    let gone = this.clusters[j];

    this.clusters[j] = stay;
    this.currentClusters--; // decrementing cluster count since there is now one less cluster

    // Iterating through the points and their clusters to replace any which reference the eliminated cluster
    for (a = 0; a < this.clusters.length; a++) {
      if (this.clusters[a] == gone) {
        this.clusters[a] = stay;
      }
    }
  };

  // add a point with coordinates (x, y) to the instance and return
  // the index at which the new point is stored
  this.addPoint = function (x, y) {
    this.xPoints.push(x);
    this.yPoints.push(y);
    this.clusters.push(this.xPoints.length);
  };
}

// AgVisualizer is used to visualize the Algorithm on the webpage
function AgVisualizer(svg, agCluster) {
  // Declaring all variables
  this.svg = svg; // SVG element displaying everything
  this.agCluster = agCluster; // Heirarchical cluster instance
  this.c = this.agCluster.currentClusters; // number of clusters
  this.pointElts = []; // Array containing all point SVG elements
  this.colors = []; // Array to hold the Colors for each cluster
  this.totalClusters = 0; // Variable to keep track of the total # of cluster
  this.curAnimation = null; // current animation id
  this.unassignedGroup = document.createElementNS(SVG_NS, "g");
  this.unassignedGroup.setAttributeNS(null, "fill", "rgb(100, 100, 100)");
  svg.appendChild(this.unassignedGroup);

  // Creating a counter SVG element to display cluster count for user
  this.counter = document.createElementNS(SVG_NS, "text");
  this.counter.setAttributeNS(null, "x", "10");
  this.counter.setAttributeNS(null, "y", "388");
  this.counter.textContent = this.totalClusters + " Clusters";
  this.counter.classList.add("counter");
  svg.appendChild(this.counter);

  // If user clicks on canvas, add point to the canvas
  this.svg.addEventListener("click", (event) => {
    // only do this as long as the algorithm has not been initialzied
    if (!this.agCluster.initialized) {
      this.addPoint(event);
    }
  });

  // Add point visualizes the point at the clicked position & adds it to algorithm portion
  this.addPoint = function (e) {
    const rect = this.svg.getBoundingClientRect();
    let x = e.clientX - rect.left; // get x value of click
    let y = e.clientY - rect.top; // get y value of click

    //BACKEND ELEMENT
    this.agCluster.addPoint(x, y);

    //VISUAL ELEMENT
    // creating DOM element and assigning the attributes
    let addPoint = document.createElementNS(SVG_NS, "circle");
    addPoint.setAttributeNS(null, "cx", x);
    addPoint.setAttributeNS(null, "cy", y);
    addPoint.setAttributeNS(null, "r", 6);
    addPoint.setAttributeNS(null, "fill", "black");

    addPoint.setAttributeNS(null, "stroke", "black");
    addPoint.setAttributeNS(null, "cursor", "pointer"); //?

    this.svg.appendChild(addPoint);
    // Adding animation to the point
    addPoint.classList.add("fall");
    addPoint.setAttributeNS(null, "r", 13);
    addPoint.setAttributeNS(null, "fill-opacity", 0);
    setTimeout(() => {
      addPoint.setAttributeNS(null, "r", 6);
      addPoint.setAttributeNS(null, "fill-opacity", 1);

      setTimeout(() => {
        addPoint.setAttributeNS(null, "r", 10);
        setTimeout(() => {
          addPoint.setAttributeNS(null, "r", 6);
        }, 200);
      }, 200);
    }, 100);

    this.pointElts.push(addPoint);
    this.totalClusters++; // Incrementing cluster count
  };

  // Generates unique colors for each point
  this.getColor = function (depth, maxDepth) {
    let color = `hsl(${(depth * (360 / maxDepth)) % 360},100%,50%)`;
    return color;
  };

  // Initializes the visualization and variables that are required
  this.initialize = function () {
    //initialize in agCluster instance
    this.agCluster.initialize();
    //get all colors we'll use
    for (i = 0; i < this.agCluster.xPoints.length; i++) {
      this.colors[i] = this.getColor(i, this.agCluster.xPoints.length);
      this.pointElts[i].setAttributeNS(null, "fill", this.colors[i]);
    }
    this.counter.textContent = this.totalClusters + " Clusters";
  };

  // Draws points for the randomly generated points
  this.drawPoints = function (x, y) {
    // creating DOM element and assigning the attributes
    let addPoint = document.createElementNS(SVG_NS, "circle");
    addPoint.setAttributeNS(null, "cx", x);
    addPoint.setAttributeNS(null, "cy", y);
    addPoint.setAttributeNS(null, "r", 6);
    addPoint.setAttributeNS(null, "stroke", "black");
    addPoint.setAttributeNS(null, "cursor", "pointer"); //?

    this.svg.appendChild(addPoint);
    addPoint.classList.add("fall");
    addPoint.setAttributeNS(null, "r", 13);
    addPoint.setAttributeNS(null, "fill-opacity", 0);

    // Animation for initially drawing a point, point enlarges in size then reduces back to norm
    setTimeout(() => {
      addPoint.setAttributeNS(null, "r", 6);
      addPoint.setAttributeNS(null, "fill-opacity", 1);

      setTimeout(() => {
        addPoint.setAttributeNS(null, "r", 10);
        setTimeout(() => {
          addPoint.setAttributeNS(null, "r", 6);
        }, 200);
      }, 200);
    }, 100);

    //ADDING BACKEND ELEMENT
    this.agCluster.addPoint(x, y);
    this.pointElts.push(addPoint);

    this.totalClusters++; // Updating cluster number
  };

  // Animating a step of the algorithm
  this.animateStep = function () {
    if (this.totalClusters > 1) {
      while (true) {
        // Get the two points that are closest to eachother
        const [i, j] = this.agCluster.findMin(this.agCluster.distances);

        // If the two points are already not in the cluster then marge their clusters
        if (!this.agCluster.checkClusters(i, j)) {
          this.agCluster.mergeClusters(i, j); // merge clusters within algorithm
          let line = document.createElementNS(SVG_NS, "line"); // draw a line connecting them
          // styling of line
          line.setAttributeNS(null, "x1", this.agCluster.xPoints[i]);
          line.setAttributeNS(null, "y1", this.agCluster.yPoints[i]);
          line.setAttributeNS(null, "x2", this.agCluster.xPoints[j]);
          line.setAttributeNS(null, "y2", this.agCluster.yPoints[j]);
          line.setAttributeNS(null, "stroke", "gray");
          line.setAttributeNS(null, "stroke-width", "1");
          this.svg.appendChild(line);

          // Updating the clustering visual
          for (let x = 0; x < this.agCluster.xPoints.length; x++) {
            if (this.agCluster.checkClusters(x, i)) {
              this.pointElts[x].setAttributeNS(null, "fill", this.colors[i]);
              this.colors[x] = this.colors[i];
              this.pointElts[x].classList.add("clustered");
              this.pointElts[x].setAttributeNS(null, "r", 13);
              this.pointElts[x].setAttributeNS(null, "stroke", "yellow");

              setTimeout(() => {
                if (this.pointElts.length != 0) {
                  this.pointElts[x].setAttributeNS(null, "r", 6);
                  this.pointElts[x].setAttributeNS(null, "stroke", "black");
                }
              }, 500);
            }
          }
          this.totalClusters--; // Reducing cluster count
          if (this.totalClusters == 1) {
            this.counter.setAttributeNS(null, "fill", this.colors[i]);
            this.counter.classList.remove("counter");
            this.counter.classList.add("counter1");
            this.counter.textContent = this.totalClusters + " Cluster 🥳🎊 ";
          } else {
            this.counter.textContent = this.totalClusters + " Clusters";
          }
          break;
        }
      }
    } else {
      this.stopAnimation();
    }
  };

  // Function used to animate entire algorithm
  this.animate = function () {
    let speed = document.querySelector("#spd");
    spd = speed.value;

    this.curAnimation = setTimeout(() => {
      this.animateStep();
      this.animate();
    }, 1000 / spd);
  };

  // Function to stop Animation
  this.stopAnimation = function () {
    clearInterval(this.curAnimation);
    this.curAnimation = null;
  };

  // Function to reset the canvas at any point
  this.reset = function () {
    if (this.curAnimation != null) {
      this.stopAnimation();
    }
    this.stopAnimation();
    let svg = document.querySelector("svg");
    // Removing all SVG elements on the canvas except for the counter element
    for (i = 0; i < svg.children.length; i++) {
      if (
        !(
          svg.children[i].classList.contains("counter") ||
          svg.children[i].classList.contains("counter1")
        )
      ) {
        svg.children[i].remove();
        i -= 1;
      }
    }

    // resetting parameters
    this.pointElts = [];
    this.colors = [];
    this.totalClusters = 0;
    this.counter.textContent = this.totalClusters + " Clusters";
    this.curAnimation = null; // current animation id
    this.agCluster.xPoints = [];
    this.agCluster.yPoints = [];
    this.agCluster.clusters = [];
    this.agCluster.initialized = false;
    this.counter.classList.remove("counter1");
    this.counter.classList.add("counter");
  };
}

// INITIALIZING DOM ELEMENTS
const ag = new agCluster(1);
const svg = document.querySelector("#cluster");
const vis = new AgVisualizer(svg, ag);

//BUTTONS
//button for inserting random points
let randPts = document.querySelector("#btn-add-cluster");
randPts.addEventListener("click", () => {
  if (!ag.initialized) {
    genRandPts(vis, svg, 5);
  }
});

//button to initialize the visualization
let initializeBtn = document.querySelector("#btn-initialize");
initializeBtn.addEventListener("click", () => {
  if (ag.xPoints.length < 2) {
    alert("Please draw multiple points before clicking on this button!");
  } else {
    vis.initialize();
  }
});

//button for stepping through the algorithm and updating clusters
let stepBtn = document.querySelector("#btn-update-clusters");
stepBtn.addEventListener("click", () => {
  if (ag.initialized) {
    vis.animateStep();
  }
});

//button for animating the entire algorithm
let animateBtn = document.querySelector("#btn-animate");
animateBtn.addEventListener("click", () => {
  if (ag.initialized) {
    vis.animate();
  }
});

//button for resetting the canvas
let resetBtn = document.querySelector("#btn-restart");
resetBtn.addEventListener("click", () => {
  vis.reset();
});

// Function to generate n random points onto the svg element
genRandPts = function (vis, svg, n) {
  // Iterating n number of times to create n elements
  for (let i = 0; i < n; i++) {
    const bound = svg.getBoundingClientRect();
    const width = bound.width;
    const height = bound.height;

    let x = Math.floor(Math.random() * width); // Using math.random to generate a random x location
    let y = Math.floor(Math.random() * height); // Using math.random to generate a random y location

    setTimeout(() => {
      if (x < 10) {
        x = 10;
      }
      if (x > 990) {
        x = 990;
      }
      if (y < 10) {
        y = 10;
      }
      if (y > 390) {
        y = 390;
      }
      vis.drawPoints(x, y); // calling on drawPoints method to draw the points
    }, 100);
  }
};

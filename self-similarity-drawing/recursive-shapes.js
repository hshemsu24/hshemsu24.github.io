const SVG_NS = "http://www.w3.org/2000/svg";

const MAX_DEPTH = 4;

 const svg = document.querySelector("#recursive-shapes");
 const shapeGroup = document.querySelector("#shape-group");
 const defs = document.querySelector("#shape-defs");

 let getColor = function(depth) {
    let color = "white";
    return color;
 }

 let drawIteration = function(depth, group){
    let child = document.createElementNS(SVG_NS, "use");
    child.setAttributeNS(null, "href", "#circle-basic");
    child.setAttributeNS(null, "stroke", getColor(depth));

    group.appendChild(child);

    if(depth < MAX_DEPTH){
        
        let groupE5 = document.createElementNS(SVG_NS, "g");
        groupE5.innerHTML = '<animateTransform attributeName="transform" type="rotate" values="0; -1; -0;" keyTimes="0; 0.5; 1" keySplines="0.3 0.1 0.7 0.9; 0.3 0.1 0.7 0.9;" calcMode="spline" additive="sum" dur="2s" repeatCount="indefinite"/>';
        group.appendChild(groupE5);
        drawIteration(depth+1, groupE5);
       
       
        let groupEl = document.createElementNS(SVG_NS, "g");
        groupEl.setAttributeNS(null, "transform", 'matrix(0.5, 0, 0, 0.5, 20, 17)')
        groupEl.innerHTML = '<animateTransform attributeName="transform" type="rotate" values="0; -1; 0;" keyTimes="0; 0.5; 1" keySplines="0.3 0.1 0.7 0.9; 0.3 0.1 0.7 0.9;" calcMode="spline" additive="sum" dur="2s" repeatCount="indefinite"/>';
        group.appendChild(groupEl);
        drawIteration(depth+1, groupEl);

        let groupE2 = document.createElementNS(SVG_NS, "g");
        groupE2.setAttributeNS(null, "transform", 'matrix(.484, 0, 0, .484, 53.3, -20.6)');
        groupE2.innerHTML = '<animateTransform attributeName="transform" type="rotate" values="0; -1; -0;" keyTimes="0; 0.5; 1" keySplines="0.3 0.1 0.7 0.9; 0.3 0.1 0.7 0.9;" calcMode="spline" additive="sum" dur="2s" repeatCount="indefinite"/>';
        group.appendChild(groupE2);
        drawIteration(depth+1, groupE2);

        let groupE3 = document.createElementNS(SVG_NS, "g");
        groupE3.setAttributeNS(null, "transform", 'matrix(.31, 0, 0, .31, 26.5, -23)');
        groupE3.innerHTML = '<animateTransform attributeName="transform" type="rotate" values="0; -1; 0;" keyTimes="0; 0.5; 1" keySplines="0.3 0.1 0.7 0.9; 0.3 0.1 0.7 0.9;" calcMode="spline" additive="sum" dur="2s" repeatCount="indefinite"/>';
        group.appendChild(groupE3);
        drawIteration(depth+1, groupE3);

        let groupE4 = document.createElementNS(SVG_NS, "g");
        groupE4.setAttributeNS(null, "transform", 'matrix(.35, 0, 0, .35, 74, 20)');
        groupE4.innerHTML = '<animateTransform attributeName="transform" type="rotate" values="0; -1; 0;" keyTimes="0; 0.5; 1" keySplines="0.3 0.1 0.7 0.9; 0.3 0.1 0.7 0.9;" calcMode="spline" additive="sum" dur="2s" repeatCount="indefinite"/>';
        group.appendChild(groupE4);
        drawIteration(depth+1, groupE4);
    }
 }

 drawIteration(0, shapeGroup);
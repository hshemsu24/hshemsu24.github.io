
function drawCell(rule, width, height){
    const root = document.querySelector("#root");
    const header = document.createElement("h1");
    header.textContent = "Rule " + rule;
    root.appendChild(header);

    //initialize initialize array first with one box in the middle
    let curRow  = new Array(width).fill(0);
    curRow[Math.floor(width/2)] = 1;

    //or initialize with a random first row setting random values of 0 and 1
        //by uncommenting lines below

            // for(let i=0; i < width ; i++){
            //    curRow[i] = Math.floor(Math.random() * 2);

            // }

    root.appendChild(getNextRow(curRow));

    for(let i = 1; i< height; i++){
        curRow = applyRule(curRow, rule);
        root.appendChild(getNextRow(curRow));
    }

}

function applyRule(config, rule){
    const width = config.length;
    let ruleArr = getRuleArray(rule);
    let arr = new Array(width).fill(0);

    //depending on parent row, assign proper value of 1 or leave as 0 depending on ruleArr
    //use binary to calculate total value of parent neihbors and use that to classify which of the 8 possible combinations it corresponds to
    for(let i = 0; i < width; i++){
        
        let total = 0;
        
        if(i==0){
            total = 4*config[width-1] + 2*config[i] + config[i+1];
            if(ruleArr[total] == 1){
                arr[i] = 1;
            }
        }else if (i == width-1){
            total = 4*config[i-1] + 2*config[i] + config[0];
            if(ruleArr[total] == 1){
                arr[i] = 1;
            }
        } else {
            total = 4*config[i-1] + 2*config[i] + config[i+1];
            if(ruleArr[total] == 1){
                arr[i] = 1;
            }
            
        }
    }

    return arr;
}

function getRuleArray(rule){
    //create a rule array with 0 or 1 depending on its binary number
    ruleArr = [];
    
    for(let i = 0; i<8; i++){
        ruleArr.push(rule%2);
        rule = Math.floor(rule/2);
    }

    return ruleArr;
}

function getNextRow(a){
    
    const curRow = document.createElement("div");
    curRow.classList.add("row");
    //classify each cell with their values and return full row of properly classified cells as "one" or "zero"
        for(let i = 0; i< a.length ; i++){
            let box = document.createElement("div");
            box.classList.add("cell");
            if(a[i] == 1){
                box.classList.add("one");
                    //if next line is uncommented, will cause colors to be randomized
                box.style.backgroundColor = makeColor();
            } else {
                box.classList.add("zero");
            }
            curRow.appendChild(box);
        }

    return curRow;

}

//fuction that creates a random color
function makeColor() {
    const r = Math.floor(Math. random() * 255);
    const g = Math.floor(Math. random() * 255);
    const b = Math.floor(Math. random() * 255);

    const color = "rgb(" + r + "," + g + "," + b + ")";
    return color;
  }


  module.exports = { applyRule };
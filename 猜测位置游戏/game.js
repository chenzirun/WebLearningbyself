var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    //逗号很重要，别忘了自己是在写对象

    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
}; //分号也很重要整体来看这只是在创建一个对象


var model = {
    boardsize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{locations: ["0", "0", "0"], hits: [ "", "", ""] },
    {locations: ["0", "0", "0"], hits: [ "", "", ""] },
    {locations: ["0", "0", "0"], hits: [ "", "", ""] }],

    fire: function(guess){
        for (var i = 0; i < this.numShips; i++) {
            var ship = ships[i];
            var index = ship.locations.indexOf(guess);
            if(index >= 0){
                ship.hits[index] = "hit";
                //一层层的往上加，不要太过于全面的考虑问题，这会使你的逻辑混乱
                view.displayHit(guess);
                view.displayMessage("HIT!");
                //
                if(this.isSunk(ship)){
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                //
                return true;
            }
        }
        //与view对象链接起来
        view.displayMiss(guess);
        view.displayMessage("You missed.")
        return false;
    },

    isSunk: function(ship){
        for (var i = 0; i < this.shipLength; i++) {
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    }，

    generateShipLocations: function{
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip()
            } while (this.collision(locations));
            this.ships[i].locations = locations;//这个locations是这个方法中设置的locations;
        }
    },

    generateShip: function{
        var direction = Math.floor(Math.random() * 2);
        var row, col;
        
        if (direction === 1) {
            //生成水平方向的战舰
            row = Math.floor(Math.random() * this.boardsize);
            col = Math.floor(Math.random() * (this.boardsize - this.shipLength + 1));
        }
        else {
            //生成垂直方向的战舰
            row = Math.floor(Math.random() * (this.boardsize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardsize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + col);
                col ++;
            }
            else {
                newShipLocations.push(row + "" + col);
                row ++;
            }
        }
        return newShipLocations;
    },

    collision: function (locations) {
        for (var i = 0; i <this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; i < this.shipLength; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};



var controller = {
    guesses = 0,
    processGuess: function(guess){
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + "guesses");
            }
        }
    }
}


function parseGuess(guess){
var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
if (guess.length !== 2 || guess === null) {
    alert("Opps, please enter a lesser and a number on the board.")
}
else {
    var firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
        alert("Oops, that isn't on the board.")
    }
    else if (row < 0 || row >= model.boardsize || column < 0 || column >= model.boardsize) {
        alert("Oops, that's off the board!")
    }
    else {
        return row + column;
    }
}
return null;
}



// 获取玩家猜测 并且 对猜测进行处理
window.onload = init;
function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onketpress = handleKeyPress;

    model.generateShipLocations()；
}
function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}
function handleKeyPress(e){
    var fireButton = document.getElementById("fireButton");
    if (e.keycode === 13) {
        fireButton.click();
        return false; //返回false，让表单不做其他事情
    }
}

let degree = false;
/// /Model
const model = {
    displayCurrent: [],
    error: false,
    // input trigger function
    addInput: function(input) {
        try {
            this.error = false;
            $("#answerParagraph").css("background-color", "white");
            // split operations, numbers from input string.
            this.displayCurrent = input.match(/(?<=^|[-+*/()]|resin|sin|cos|pi)\d+\.\d+|\d+|[-+*/()]|resin|sin|cos|pi/g);
            this.calc();
            $("#answerParagraph").text(this.displayCurrent[0]);
        } catch(e) {
            // alert error
            $("#answerParagraph").css("background-color", "red");
        }
    },
    // calculation function
    calc: function() {
        while(this.displayCurrent.length > 1) {
            this.calcInsideParenthesis();
        }
        if(this.error) {
            $("#answerParagraph").css("background-color", "red");
        }
    },
    findParenthesis: function() {
        let start = 0;
        let end = model.displayCurrent.length;
        let foundRightParen = false;
        let foundLeftParen = false;
        for(let e = model.displayCurrent.length; e >= 0; e--) {
            if(model.displayCurrent[e] === "(") {
                start = e;
                foundLeftParen = true;
                break;
            }
        }
        for(let i = start; i <= model.displayCurrent.length; i++) {
            if(model.displayCurrent[i] === ")") {
                end = i;
                foundRightParen = true;
                break;
            }
        }
        return [start, end, foundLeftParen, foundRightParen];
    },
    calcInsideParenthesis: function() {
        let i;
        //translates constants and factorial
        for(i = this.findParenthesis()[0]; i <= this.findParenthesis()[1]; i++) {
            switch(this.displayCurrent[i]) {
                case "pi":
                    if(!isNaN(this.displayCurrent[i - 1])) {
                        this.displayCurrent.splice(i, 1, "*", Math.PI);
                        break;
                    } else {
                        this.displayCurrent.splice(i, 1, Math.PI);
                        break;
                    }
            }
        }
        //computes powers
        for(i = this.findParenthesis()[0]; i <= this.findParenthesis()[1]; i++) {
            switch(this.displayCurrent[i]) {
                //task 3 resin function implement
                case "resin":
                    if(!isNaN(parseFloat(this.displayCurrent[i + 2]))) {
                        if(!isNaN(this.displayCurrent[i - 1])) {
                            this.displayCurrent.splice(i, 3, "*", this.roundFloatingPoint(parseFloat(this.displayCurrent[i + 2]) * 392.9));
                            i--;
                            break;
                        } else {
                            this.displayCurrent.splice(i, 3, this.roundFloatingPoint(parseFloat(this.displayCurrent[i + 2]) * 392.9));
                            i--;
                            break;
                        }
                    } else {
                        this.setError("resin needs be a number");
                        break;
                    }
                //    sin, cos function implement with Radian, Degree mode.
                case "sin":
                    if(!isNaN(parseFloat(this.displayCurrent[i + 2]))) {
                        if(!isNaN(this.displayCurrent[i - 1])) {
                            this.displayCurrent.splice(i, 3, "*", this.roundFloatingPoint(degree === false ? Math.sin(parseFloat(this.displayCurrent[i + 2])) : Math.sin(parseFloat(this.displayCurrent[i + 2]) * (Math.PI / 180))));
                            i--;
                            break;
                        } else {
                            this.displayCurrent.splice(i, 3, this.roundFloatingPoint(degree === false ? Math.sin(parseFloat(this.displayCurrent[i + 2])) : Math.sin(parseFloat(this.displayCurrent[i + 2]) * (Math.PI / 180))));
                            i--;
                            break;
                        }
                    } else {
                        this.setError("sine needs be a number");
                        break;
                    }
                case "cos":
                    if(!isNaN(parseFloat(this.displayCurrent[i + 2]))) {
                        if(!isNaN(this.displayCurrent[i - 1])) {
                            this.displayCurrent.splice(i, 3, "*", this.roundFloatingPoint((degree === false ? Math.cos(parseFloat(this.displayCurrent[i + 2])) : Math.cos(parseFloat(this.displayCurrent[i + 2]) * (Math.PI / 180)))));
                            i--;
                            break;
                        } else {
                            this.displayCurrent.splice(i, 3, this.roundFloatingPoint(degree === false ? Math.cos(parseFloat(this.displayCurrent[i + 2])) : Math.cos(parseFloat(this.displayCurrent[i + 2]) * (Math.PI / 180))));
                            i--;
                            break;
                        }
                    } else {
                        this.setError("cosine needs be a number");
                        break;
                    }
            }
        }
        //computes multiplication and division
        for(i = this.findParenthesis()[0]; i <= this.findParenthesis()[1]; i++) {
            switch(this.displayCurrent[i]) {
                case "/":
                    if(!isNaN(parseFloat(this.displayCurrent[i + 1])) && !isNaN(parseFloat(this.displayCurrent[i - 1]))) {
                        this.displayCurrent.splice(i - 1, 3, this.roundFloatingPoint(parseFloat(this.displayCurrent[i - 1]) / parseFloat(this.displayCurrent[i + 1])));
                        i--;
                        break;
                    } else if(parseFloat(this.displayCurrent[i + 1]) !== 0) {
                        this.setError("cannot divide by zero");
                        break;
                    } else {
                        this.setError("cannot divide non-numbers");
                        break;
                    }
                case "*":
                    if(!isNaN(parseFloat(this.displayCurrent[i + 1])) && !isNaN(parseFloat(this.displayCurrent[i - 1]))) {
                        this.displayCurrent.splice(i - 1, 3, this.roundFloatingPoint(parseFloat(this.displayCurrent[i - 1]) * parseFloat(this.displayCurrent[i + 1])));
                        i--;
                        break;
                    } else {
                        this.setError("cannot multiply non-numbers");
                        break;
                    }
            }
        }
        //computes addition and subtraction
        for(i = this.findParenthesis()[0]; i <= this.findParenthesis()[1]; i++) {
            switch(this.displayCurrent[i]) {
                case "+":
                    if(!isNaN(parseFloat(this.displayCurrent[i + 1])) && !isNaN(parseFloat(this.displayCurrent[i - 1]))) {
                        this.displayCurrent.splice(i - 1, 3, this.roundFloatingPoint(parseFloat(this.displayCurrent[i - 1]) + parseFloat(this.displayCurrent[i + 1])));
                        i--;
                        break;
                    } else {
                        this.setError("cannot add non-numbers");
                        break;
                    }
                case "-":
                    if(!isNaN(parseFloat(this.displayCurrent[i + 1])) && !isNaN(parseFloat(this.displayCurrent[i - 1]))) {
                        this.displayCurrent.splice(i - 1, 3, this.roundFloatingPoint(parseFloat(this.displayCurrent[i - 1]) - parseFloat(this.displayCurrent[i + 1])));
                        i--;
                        break;
                    } else {
                        this.setError("cannot subtract non-numbers");
                        break;
                    }
            }
        }
        this.removesParenthesis();
    },
    roundFloatingPoint: function(floatingPointNumber) {
        return(floatingPointNumber * 10000000).toFixed(0) / 10000000;
    },
    removesParenthesis: function() {
        let leftParenLocation = this.findParenthesis()[0];
        let rightParenLocation = this.findParenthesis()[1];
        let foundleftParenLocation = this.findParenthesis()[2];
        let foundrightParenLocation = this.findParenthesis()[3];
        if(foundleftParenLocation === true) {
            let previousCharacter = this.displayCurrent[leftParenLocation - 1];
            if(previousCharacter === "-" || previousCharacter === "+" || previousCharacter === "/" || previousCharacter === "*" || previousCharacter === "(" || previousCharacter === undefined || previousCharacter === null) {
                this.displayCurrent.splice(leftParenLocation, 1);
                rightParenLocation = rightParenLocation - 1;
            } else {
                this.displayCurrent.splice(leftParenLocation, 1, "*");
            }
        }
        if(foundrightParenLocation === true) {
            let nextCharacter = this.displayCurrent[rightParenLocation + 1];
            if(nextCharacter === "-" || nextCharacter === "+" || nextCharacter === "/" || nextCharacter === "*" || nextCharacter === ")" || nextCharacter === undefined || nextCharacter === null) {
                this.displayCurrent.splice(rightParenLocation, 1);
            } else {
                this.displayCurrent.splice(rightParenLocation, 1, "*");
            }
        }
    },
    // set error function
    setError: function(errorMessage) {
        this.displayCurrent = [];
        this.error = true;
        this.displayCurrent.push(errorMessage);
    },
};
$(document).ready(function() {
    $("#answerParagraph").text("");
    $("#degree_check").change(function() {
        degree = this.checked;
        model.addInput($("#inputBox").val());
    });
    $("#inputBox").on("input", function() {
        model.addInput($(this).val());
    });
});
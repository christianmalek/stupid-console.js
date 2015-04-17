function CommandRegistry() {
    this.commands = [];
}

CommandRegistry.prototype.register = function (name, callbackFn) {
    this.commands[name] = callbackFn;
};

CommandRegistry.prototype.deregister = function (name) {
    this.commands[name] = undefined;
};

CommandRegistry.prototype.trigger = function (args) {

    if (Object.prototype.toString.call(args) === '[object Array]') {

        //first element is name
        var name = args[0];

        //remove name (first element) from args
        args.splice(0, 1);
    }

    //otherwise args is only name
    else {
        name = args;
        args = [];
    }

    if (this.commands[name] !== undefined) {
        this.commands[name](args);
        return true;
    }
    return false;
};

function StupidConsole(id) {
    this.id = id;
    this.defaultText = "";
    this.errorCallback = undefined;
    this.commandRegistry = new CommandRegistry();
}

StupidConsole.prototype.init = function () {
    this.registerKeyEvents();
    this.addNewLine();
};

StupidConsole.prototype.setDefaultText = function (text) {
    this.defaultText = (text === undefined ? "" : text);
};

StupidConsole.prototype.appendCurrentLine = function (text) {
    text = (text === undefined ? this.defaultText : text);
    $(".console-edit-left").append(text);
};

StupidConsole.prototype.addNewLine = function (text) {
    text = (text === undefined ? this.defaultText : text);
    $(".console-content").append('<div class="console-line"><span>' + text + "</span></div>");

    this.setLastLineActive();
};

StupidConsole.prototype.moveCursorRight = function () {
    var ceRight = $(".console-edit-right");
    var right = ceRight.text();

    //if there's nothing to move, stahp it!
    if (right.length === 0)
        return;

    $(".console-edit-left").append(right[0]);
    ceRight.text(right.substring(1, right.length));
};

StupidConsole.prototype.moveCursorLeft = function () {
    var ceLeft = $(".console-edit-left");
    var left = ceLeft.text();

    //if there's nothing to move, stahp it!
    if (left.length === 0)
        return;

    $(".console-edit-right").prepend(left[left.length - 1]);
    ceLeft.text(left.substring(0, left.length - 1));
};

StupidConsole.prototype.setLastLineActive = function () {
    $(".cursor").remove();
    $(".console-active").removeClass("console-active");
    $(".console-edit-left").removeClass("console-edit-left");
    $(".console-edit-right").removeClass("console-edit-right");
    var last = $(".console-line").last().addClass("console-active");
    last.append('<span class="console-edit-left"></span>');
    last.append(this.getCursorSpan("|"));
    last.append('<span class="console-edit-right"></span>');
};

StupidConsole.prototype.writeToActiveLine = function (text) {
    $(".console-edit-left").append(text);
};

StupidConsole.prototype.getCursorSpan = function (text) {
    text = text === undefined ? "" : text;
    return '<span class="cursor">' + text + "</span>";
};

StupidConsole.prototype.removeOneCharFromActiveLine = function () {
    var ceLeft = $(".console-edit-left");
    var text = ceLeft.text();
    text = text.length > 0 ? text.substr(0, text.length - 1) : text;
    ceLeft.text(text);
};

StupidConsole.prototype.parseInput = function () {
    var text = $(".console-edit-left").text() + $(".console-edit-right").text();
    return text.split(" ");
};

StupidConsole.prototype.register = function (name, callbackFn) {
    this.commandRegistry.register(name, callbackFn);
};

StupidConsole.prototype.deregister = function (name) {
    this.commandRegistry.deregister(name);
};

StupidConsole.prototype.trigger = function (name) {
    if (!this.commandRegistry.trigger(name)) {
        if (this.errorCallback)
            this.errorCallback();
    }
};

StupidConsole.prototype.registerKeyEvents = function () {
    var self = this;

    $(document).keypress(function (e) {
        switch (e.which) {

            //enter
            case 13:
                self.trigger(self.parseInput());
                self.addNewLine();
                break;
            default:
                var char = String.fromCharCode(e.which);
                self.writeToActiveLine(char);
        }
    });

    $(document).keydown(function (e) {
        switch (e.which) {

            //backspace
            case 8:
                self.removeOneCharFromActiveLine();
                e.preventDefault();
                break;

            //left
            case 37:
                self.moveCursorLeft();
                break;

            //right
            case 39:
                self.moveCursorRight();
                break;
        }
    });
};

$(document).ready(function () {
    var sc = new StupidConsole("#test");
    sc.setDefaultText("foo@bar: $ ");
    sc.init();
    sc.register("help", function () {
        console.log("fdsfds");
        sc.addNewLine("Hier wird dir nicht geholfen.");
    });
    sc.register("yolo", function () {
        sc.addNewLine("You only live once!");
    });
    sc.register("args", function (args) {
        sc.addNewLine("Übergebene Argumente: ");
        console.log(args);
        for (var i = 0; i < args.length; i++) {
            sc.appendCurrentLine((i + 1) + ". " + args[i] + " ");
        }
    })
});












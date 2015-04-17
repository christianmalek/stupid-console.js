function StupidConsole(id) {
    this.id = id;
}

StupidConsole.prototype.addNewLine = function (text) {
    text = text === undefined ? "" : text;
    $(".console-content").append('<div class="console-line"><span>' + text + "</span></div>");
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

StupidConsole.prototype.parseArgs = function () {
    var text = $(".console-edit-left").text() + $(".console-edit-right").text();
    var args = text.split(" ");
    return args;
}

StupidConsole.prototype.processCommands = function () {
    var args = this.parseArgs();

    switch (args[0]) {
        case "help":
            this.addNewLine("Hier wird dir nicht geholfen.");
            this.setLastLineActive();
            break;
        default:
            this.addNewLine("Unbekannter Befehl.");
            this.setLastLineActive();
    }
};

StupidConsole.prototype.registerKeyEvents = function () {
    var self = this;

    $(document).keypress(function (e) {
        switch (e.which) {

            //enter
            case 13:
                self.processCommands();
                self.addNewLine("phis@about: $ ");
                self.setLastLineActive();
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

    var sc = new StupidConsole("dummy");
    sc.registerKeyEvents();
    sc.addNewLine("phis@about: $ ");
    sc.setLastLineActive();
});












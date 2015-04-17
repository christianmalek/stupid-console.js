$(document).ready(function () {

    addNewLine("phis@about: $ ");
    setLastLineActive();

    $(document).keypress(function (e) {
        switch (e.which) {

            //enter
            case 13:
                processCommands();
                addNewLine("phis@about: $ ");
                setLastLineActive();
                break;
            default:
                var char = String.fromCharCode(e.which);
                writeToActiveLine(char);
        }
    });

    $(document).keydown(function (e) {
        switch (e.which) {

            //backspace
            case 8:
                removeOneCharFromActiveLine();
                e.preventDefault();
                break;

            //left
            case 37:
                moveCursorLeft();
                break;

            //right
            case 39:
                moveCursorRight();
                break;
        }
    });

    $(".console").click(function () {
        $(".console").addClass("active");
    });
});

function moveCursorRight() {
    var ceRight = $(".console-edit-right");
    var right = ceRight.text();

    //if there's nothing to move, stahp it!
    if (right.length === 0)
        return;

    $(".console-edit-left").append(right[0]);
    ceRight.text(right.substring(1, right.length));
}

function moveCursorLeft() {
    var ceLeft = $(".console-edit-left");
    var left = ceLeft.text();

    //if there's nothing to move, stahp it!
    if (left.length === 0)
        return;

    $(".console-edit-right").prepend(left[left.length - 1]);
    ceLeft.text(left.substring(0, left.length - 1));
}

function setLastLineActive() {
    $(".cursor").remove();
    $(".console-active").removeClass("console-active");
    $(".console-edit-left").removeClass("console-edit-left");
    $(".console-edit-right").removeClass("console-edit-right");
    var last = $(".console-line").last().addClass("console-active");
    last.append('<span class="console-edit-left"></span>');
    last.append(getCursorSpan("|"));
    last.append('<span class="console-edit-right"></span>');
}

function writeToActiveLine(text) {
    $(".console-edit-left").append(text);
}

function getCursorSpan(text) {
    text = text === undefined ? "" : text;
    return '<span class="cursor">' + text + "</span>";
}

function removeOneCharFromActiveLine() {
    var ceLeft = $(".console-edit-left");
    var text = ceLeft.text();
    text = text.length > 0 ? text.substr(0, text.length - 1) : text;
    ceLeft.text(text);
}

function addNewLine(text) {
    text = text === undefined ? "" : text;
    $(".console-content").append('<div class="console-line">' +
    '<span>' +
    text +
    "</span>" +
    "</div>");
}

function parseArgs() {
    var text = $(".console-edit-left").text() + $(".console-edit-right").text();
    return text.split(" ");
}

function processCommands() {
    var args = parseArgs();

    switch (args[0]) {
        case "help":
            addNewLine("Hier wird dir nicht geholfen.");
            setLastLineActive();
            break;
    }
}













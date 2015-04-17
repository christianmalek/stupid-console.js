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
});

function moveCursorRight() {
    var right = $(".ce-right").text();

    //if there's nothing to move, stahp it!
    if (right.length === 0)
        return;

    $(".ce-left").append(right[0]);
    $(".ce-right").text(right.substring(1, right.length));
}

function moveCursorLeft() {
    var left = $(".ce-left").text();

    //if there's nothing to move, stahp it!
    if (left.length === 0)
        return;

    $(".ce-right").prepend(left[left.length - 1]);
    $(".ce-left").text(left.substring(0, left.length - 1));


}

function setLastLineActive() {
    $(".cursor").remove();
    $(".ca").removeClass("ca");
    $(".ce-left").removeClass("ce-left");
    $(".ce-right").removeClass("ce-right");
    var last = $(".cl").last().addClass("ca");
    last.append('<span class="ce-left"></span>');
    last.append(getCursorSpan("&nbsp;"));
    last.append('<span class="ce-right"></span>');
}

function writeToActiveLine(text) {
    $(".ce-left").append(text);
    cursorPos++;
}

function getCursorSpan(text) {
    text = text === undefined ? "" : text;
    return '<span class="cursor">' + text + "</span>";
}

function removeOneCharFromActiveLine() {
    var text = $(".ce-left").text();
    text = text.length > 0 ? text.substr(0, text.length - 1) : text;
    $(".ce-left").text(text);
}

function addNewLine(text) {
    cursorPos = 0;
    text = text === undefined ? "" : text;
    $(".console").append('<div class="cl">' +
    '<span class="ct">' +
    text +
    "</span>" +
    "</div>");
}

function parseArgs() {
    var text = $(".ce-left").text() + $(".ce-right").text();
    var args = text.split(" ");
    return args;
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













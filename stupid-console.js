var StupidConsole = (function () {
    'use strict';

    function CommandRegistry() {
        this.commands = [];
    }

    CommandRegistry.prototype.register = function (name, callbackFn, description) {
        this.commands[name] = {
            description: description === undefined ? "" : description,
            callbackFn: callbackFn
        };
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
            this.commands[name].callbackFn(args);
            return true;
        }
        return false;
    };

    function History() {
        this.history = [];
        this.offset = undefined;
    }

    History.prototype.navigateUp = function () {
        var history = this.history;

        if (this.offset === undefined) {
            this.offset = 0;
        }
        else if (this.offset > 0) {
            this.offset--;
        }

        if (history && history.length > 0) {
            return (history[history.length - this.offset - 1]);
        }
        else
            return false;
    };

    History.prototype.navigateDown = function () {
        var history = this.history;

        if (this.offset === undefined) {
            this.offset = 0;
        }
        else if (this.offset + 1 < history.length) {
            this.offset++;
        }

        if (history && history.length > 0) {
            return (history[history.length - this.offset - 1]);
        }
        else
            return false;
    };

    History.prototype.clear = function () {
        this.history = [];
        this.offset = undefined;
    };

    History.prototype.add = function (obj) {
        this.history.push(obj);
        this.offset = undefined;
    };

    History.prototype.get = function () {
        if (this.offset === undefined ||
            this.history === undefined ||
            this.history.length === 0)
            return false;
        return this.history[this.offset];
    };

    function StupidConsole(id) {
        if (!id)
            throw "ID value \"" + id + "\" is invalid or undefined.";
        this.id = id;
        this.headerText = "stupid-console.js";
        this.defaultText = "";
        this.history = new History();
        this.saveToHistory = true;
        this.commandRegistry = new CommandRegistry();
        this.registerEvents();
    }

    StupidConsole.prototype.init = function () {
        this.createConsole();
        this.addNewLine();
    };

    StupidConsole.prototype.setHeaderText = function (text) {
        this.headerText = (text === undefined ? "" : text);
        $(this.id + " .console-header").text(this.headerText);
    };

    StupidConsole.prototype.createConsole = function () {
        var console = $(this.id);
        console.addClass("console");
        console.append('<div class="console-header">' +
            this.headerText + '</div><div class="console-content"></div>');
    };

    StupidConsole.prototype.setDefaultText = function (text) {
        this.defaultText = (text === undefined ? "" : text);
    };

    StupidConsole.prototype.setErrorCallback = function (callbackFn) {
        this.commandRegistry.register("error", callbackFn);
    };

    StupidConsole.prototype.appendCurrentLine = function (text) {
        text = (text === undefined ? this.defaultText : text);
        $(this.id + " .console-edit-left").append(text);
    };

    StupidConsole.prototype.addNewLine = function (text, saveToHistory) {
        this.offset = undefined;
        this.saveToHistory = !!saveToHistory;
        text = (text === undefined ? this.defaultText : text);
        $(this.id + " .console-content").append('<div class="console-line"><span>' + text + "</span></div>");

        this.scrollToLastLine();
        this.setLastLineActive();
    };

    StupidConsole.prototype.scrollToLastLine = function () {
        $(this.id + " .console-content").scrollTop(1E10);
    };

    StupidConsole.prototype.clear = function () {
        $(this.id + " .console-content").empty();
    };

    StupidConsole.prototype.clearLine = function () {
        $(this.id + " .console-edit-left").text("");
        $(this.id + " .console-edit-right").text("");
    };

    StupidConsole.prototype.moveCursorRight = function () {
        var ceRight = $(this.id + " .console-edit-right");
        var right = ceRight.text();

        //if there's nothing to move, stahp it!
        if (right.length === 0)
            return;

        $(this.id + " .console-edit-left").append(right[0]);
        ceRight.text(right.substring(1, right.length));
    };

    StupidConsole.prototype.moveCursorLeft = function () {
        var ceLeft = $(this.id + " .console-edit-left");
        var left = ceLeft.text();

        //if there's nothing to move, stahp it!
        if (left.length === 0)
            return;

        $(this.id + " .console-edit-right").prepend(left[left.length - 1]);
        ceLeft.text(left.substring(0, left.length - 1));
    };

    StupidConsole.prototype.navigateHistoryUp = function () {
        var text = this.history.navigateUp();

        if (text !== false) {
            this.clearLine();
            this.appendCurrentLine(text);
        }
    };

    StupidConsole.prototype.navigateHistoryDown = function () {
        var text = this.history.navigateDown();

        if (text !== false) {
            this.clearLine();
            this.appendCurrentLine(text);
        }
    };

    StupidConsole.prototype.setLastLineActive = function () {
        $(this.id + " .cursor").remove();
        $(this.id + " .console-active").removeClass("console-active");
        $(this.id + " .console-edit-left").removeClass("console-edit-left");
        $(this.id + " .console-edit-right").removeClass("console-edit-right");
        var last = $(this.id + " .console-line").last().addClass("console-active");
        last.append('<span class="console-edit-left"></span>');
        last.append(this.getCursorSpan("|"));
        last.append('<span class="console-edit-right"></span>');
    };

    StupidConsole.prototype.writeToActiveLine = function (text) {
        $(this.id + " .console-edit-left").append(text);
    };

    StupidConsole.prototype.getCursorSpan = function (text) {
        text = text === undefined ? "" : text;
        return '<span class="cursor">' + text + "</span>";
    };

    StupidConsole.prototype.removeOneCharFromActiveLine = function () {
        var ceLeft = $(this.id + " .console-edit-left");
        var text = ceLeft.text();
        text = text.length > 0 ? text.substr(0, text.length - 1) : text;
        ceLeft.text(text);
    };

//TODO improve parsing
    StupidConsole.prototype.parseInput = function () {
        var text = this.getInput();
        if (this.saveToHistory)
            this.history.add(text);
        return text.split(" ");
    };

    StupidConsole.prototype.getInput = function () {
        return $(this.id + " .console-edit-left").text() + $(this.id + " .console-edit-right").text();
    };

    StupidConsole.prototype.register = function (name, callbackFn, description) {
        this.commandRegistry.register(name, callbackFn, description);
    };

    StupidConsole.prototype.deregister = function (name) {
        this.commandRegistry.deregister(name);
    };

    StupidConsole.prototype.trigger = function (name) {
        if (!this.commandRegistry.trigger(name)) {
            this.commandRegistry.trigger("error");
        }
    };

    StupidConsole.prototype.hasFocus = function () {
        return $(this.id).hasClass("active");
    };

    StupidConsole.prototype.registerKeyEvents = function () {
        var self = this;

        $(document).keypress(function (e) {
            if (self.hasFocus() === false)
                return;

            switch (e.which) {

                //enter
                case 13:
                    if (self.getInput() !== "") {
                        self.trigger(self.parseInput());
                    }
                    self.addNewLine();
                    break;
                default:
                    var char = String.fromCharCode(e.which);
                    self.writeToActiveLine(char);
                    self.scrollToLastLine();
            }
        });

        $(document).keydown(function (e) {
            if (self.hasFocus() === false)
                return;

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

                case 38:
                    self.navigateHistoryDown();
                    e.preventDefault();
                    break;

                //right
                case 39:
                    self.moveCursorRight();
                    break;

                case 40:
                    self.navigateHistoryUp();
                    e.preventDefault();
                    break;
                default:
                    return;
            }
            self.scrollToLastLine();
        });
    };

    StupidConsole.prototype.registerClickEvent = function () {
        var self = this;

        $(self.id).click(function () {
            $(".console.active").removeClass("active");
            $(self.id + ".console").addClass("active");
        });
    };

    StupidConsole.prototype.registerEvents = function () {
        this.registerClickEvent();
        this.registerKeyEvents();
    };

    return StupidConsole;
}());
var StupidConsole = (function () {
    'use strict';

    /**
     * @description the CommandRegistry provides methods to register, deregister and trigger commands
     * @constructor
     */
    function CommandRegistry() {
        this.commands = [];
    }

    /**
     * @description registers an command
     * @param {string} name command name
     * @param {function} callbackFn the function to be called
     * @param {string} description optional short description for the command
     */
    CommandRegistry.prototype.register = function (name, callbackFn, description) {
        this.commands[name] = {
            description: description === undefined ? "" : description,
            callbackFn: callbackFn
        };
    };

    /**
     * @description deregisters an command
     * @param {string} name the name of the command which should be deregistered
     */
    CommandRegistry.prototype.deregister = function (name) {
        this.commands[name] = undefined;
    };

    /**
     * @description
     * @param {string|Array} args if string it's the name of the command which should be triggered; if array, the first index is the command and the rest are passed arguments
     * @returns {boolean}
     */
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

    /**
     * @description The History class provides methods to save and navigate to an history of items
     * @constructor
     */
    function History() {
        this.history = [];
        this.offset = undefined;
    }

    /**
     * @description Navigates in the history one item up
     * @returns {boolean|*} returns the navigated item or false if there is no history
     */
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

    /**
     * @description Navigates in the history one item down
     * @returns {boolean|*} returns the navigated item or false if there is no history
     */
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

    /**
     * @description Clears the history
     */
    History.prototype.clear = function () {
        this.history = [];
        this.offset = undefined;
    };

    /**
     * @description Adds an item to the history
     * @param obj The passed object, can be everything
     */
    History.prototype.add = function (obj) {
        this.history.push(obj);
        this.offset = undefined;
    };


    /**
     * @description Returns the current navigated history item
     * @returns {boolean|*} returns the navigated item or false if there is no history
     */
    History.prototype.get = function () {
        if (this.offset === undefined ||
            this.history === undefined ||
            this.history.length === 0)
            return false;
        return this.history[this.offset];
    };

    /**
     * creates a new console
     * @param id The id of the div the console should be embedded in
     * @constructor
     */
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

    /**
     * @description Embeds the console into the DOM
     */
    StupidConsole.prototype.init = function () {
        this.createConsole();
        this.addNewLine();
    };

    /**
     * @description Changes the header text of the console
     * @param text
     */
    StupidConsole.prototype.setHeaderText = function (text) {
        this.headerText = (text === undefined ? "" : text);
        $(this.id + " .console-header").text(this.headerText);
    };


    /**
     * @description Creates the necessary HTML Elements for the console
     */
    StupidConsole.prototype.createConsole = function () {
        var console = $(this.id);
        console.addClass("console");
        console.append('<div class="console-header">' +
            this.headerText + '</div><div class="console-content"></div>');
    };

    /**
     * @description Sets the beginning text of new lines
     * @param text
     */
    StupidConsole.prototype.setDefaultText = function (text) {
        this.defaultText = (text === undefined ? "" : text);
    };

    /**
     * @description Sets the function which gets called if the passed command name isn't registered.
     * @param callbackFn The function to be called when the error occurs
     */
    StupidConsole.prototype.setErrorCallback = function (callbackFn) {
        this.commandRegistry.register("error", callbackFn);
    };

    /**
     * @description Appends the current line
     * @param text
     */
    StupidConsole.prototype.appendCurrentLine = function (text) {
        text = (text === undefined ? this.defaultText : text);
        $(this.id + " .console-edit-left").append(text);
    };

    /**
     * @description Adds a new line
     * @param text optional beginning text - if its undefined, the default text will be used
     * @param saveToHistory - optional flag - if set, the line won't be saved in the history
     */
    StupidConsole.prototype.addNewLine = function (text, saveToHistory) {
        this.offset = undefined;
        this.saveToHistory = (saveToHistory === undefined ? true : saveToHistory);
        text = (text === undefined ? this.defaultText : text);
        $(this.id + " .console-content").append('<div class="console-line"><span>' + text + "</span></div>");

        this.scrollToLastLine();
        this.setLastLineActive();
    };

    /**
     * @description Scrolls the console to the last line
     */
    StupidConsole.prototype.scrollToLastLine = function () {
        $(this.id + " .console-content").scrollTop(1E10);
    };

    /**
     * @description Clears the console's content
     */
    StupidConsole.prototype.clear = function () {
        $(this.id + " .console-content").empty();
    };

    /**
     * @description Clears the current line
     */
    StupidConsole.prototype.clearLine = function () {
        $(this.id + " .console-edit-left").text("");
        $(this.id + " .console-edit-right").text("");
    };

    /**
     * @description Moves the cursor right
     */
    StupidConsole.prototype.moveCursorRight = function () {
        var ceRight = $(this.id + " .console-edit-right");
        var right = ceRight.text();

        //if there's nothing to move, stahp it!
        if (right.length === 0)
            return;

        $(this.id + " .console-edit-left").append(right[0]);
        ceRight.text(right.substring(1, right.length));
    };

    /**
     * @description Moves the cursor left
     */
    StupidConsole.prototype.moveCursorLeft = function () {
        var ceLeft = $(this.id + " .console-edit-left");
        var left = ceLeft.text();

        //if there's nothing to move, stahp it!
        if (left.length === 0)
            return;

        $(this.id + " .console-edit-right").prepend(left[left.length - 1]);
        ceLeft.text(left.substring(0, left.length - 1));
    };

    /**
     * @description Navigates the history up and overwrites the current line with the history item
     */
    StupidConsole.prototype.navigateHistoryUp = function () {
        var text = this.history.navigateUp();

        if (text !== false) {
            this.clearLine();
            this.appendCurrentLine(text);
        }
    };

    /**
     * @description Navigates the history down and overwrites the current line with the history item
     */
    StupidConsole.prototype.navigateHistoryDown = function () {
        var text = this.history.navigateDown();

        if (text !== false) {
            this.clearLine();
            this.appendCurrentLine(text);
        }
    };

    /**
     * @description Sets the last line active
     */
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

    /**
     * @description Writes to active line left from cursor
     * @param text
     */
    StupidConsole.prototype.writeToActiveLine = function (text) {
        $(this.id + " .console-edit-left").append(text);
    };

    /**
     * @description Returns a cursor with the passed text as "cursor text"
     * @param text
     * @returns {string} HTML element with the cursor text
     */
    StupidConsole.prototype.getCursorSpan = function (text) {
        text = text === undefined ? "" : text;
        return '<span class="cursor">' + text + "</span>";
    };

    /**
     * @description Removes one char left from the cursor's position
     */
    StupidConsole.prototype.removeOneCharFromCursorLeft = function () {
        var ceLeft = $(this.id + " .console-edit-left");
        var text = ceLeft.text();
        text = text.length > 0 ? text.substr(0, text.length - 1) : text;
        ceLeft.text(text);
    };

    //TODO improve separating arguments
    /**
     * @description Parses the input of the current line and returns the separated arguments;
     * @returns {Array} The separated arguments
     */
    StupidConsole.prototype.parseInput = function () {
        var text = this.getInput();
        return text.split(" ");
    };

    /**
     * @description Gets the input of the current line
     * @returns {String} the current line's input
     */
    StupidConsole.prototype.getInput = function () {
        return $(this.id + " .console-edit-left").text() + $(this.id + " .console-edit-right").text();
    };

    /**
     * @description registers a new command in the console
     * @param name The name of the command
     * @param callbackFn The function to be called when the command will be triggered
     * @param description An optional short description for the command; if you called "registerBasicCommands()" the "help" command will show the commands with the description
     */
    StupidConsole.prototype.register = function (name, callbackFn, description) {
        this.commandRegistry.register(name, callbackFn, description);
    };

    /**
     * @description deregisters a command
     * @param name the name of the command which should be deregistered
     */
    StupidConsole.prototype.deregister = function (name) {
        this.commandRegistry.deregister(name);
    };

    /**
     * @description triggers the callback function of the command with the parameter's name. If there is none, the "error" command will be triggered if it is registered.
     * @param name The name of the command which should be triggered
     */
    StupidConsole.prototype.trigger = function (name) {
        if (!this.commandRegistry.trigger(name)) {
            this.commandRegistry.trigger("error");
        }
    };

    /**
     * @description Returns if this console is currently the active one.
     * @returns {boolean}
     */
    StupidConsole.prototype.hasFocus = function () {
        return $(this.id).hasClass("active");
    };

    /**
     * @description Sets this console to the active one.
     */
    StupidConsole.prototype.setActive = function () {
        $(".console.active").removeClass("active");
        $(this.id + ".console").addClass("active");
    };

    /**
     * @description Registers all necessary key handlers
     */
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
                        if (this.saveToHistory)
                            this.history.add(text);
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
                    self.removeOneCharFromCursorLeft();
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

    /**
     * @description Registers all necessary click handlers
     */
    StupidConsole.prototype.registerClickEvent = function () {
        var self = this;

        $(self.id).click(function () {
            self.setActive();
        });
    };

    /**
     * @description Registers all necessary key and click handlers
     */
    StupidConsole.prototype.registerEvents = function () {
        this.registerClickEvent();
        this.registerKeyEvents();
    };

    /**
     * @description Registers a few commands to extend the functionality of the console
     */
    StupidConsole.prototype.registerBasicCommands = function () {
        var self = this;

        self.register("help", function () {
            var commands = self.commandRegistry.commands;

            for (var cmd in commands) {
                if (commands.hasOwnProperty(cmd)) {
                    var description = commands[cmd].description;
                    description = (description === "" ? "no description defined" : description);
                    self.addNewLine(cmd + ": " + description, false);
                }
            }
        }, "Shows all registered commands");

        self.register("history", function (args) {
            switch (args[0]) {
                case "-show":
                    var history = self.history.history;

                    for (var i = 0; i < history.length; i++) {
                        self.addNewLine(history[i], false);
                    }
                    break;
                case "-clear":
                    self.history.clear();
                    break;
            }
        }, "-show: shows history, -clear: deletes history");

        self.register("clear", function () {
            self.clear();
        }, "clears the console");
    };

    return StupidConsole;
}());
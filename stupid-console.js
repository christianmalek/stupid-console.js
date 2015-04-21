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
     * @description The History class provides methods to save and navigate to an _history of items
     * @constructor
     */
    function History() {
        this._history = [];
        this._offset = undefined;
    }

    /**
     * @description Navigates in the _history one item up
     * @returns {boolean|*} returns the navigated item or false if there is no _history
     */
    History.prototype.navigateUp = function () {
        var history = this._history;

        if (this._offset === undefined) {
            this._offset = 0;
        }
        else if (this._offset > 0) {
            this._offset--;
        }

        if (history && history.length > 0) {
            return (history[history.length - this._offset - 1]);
        }
        else
            return false;
    };

    /**
     * @description Navigates in the _history one item down
     * @returns {boolean|*} returns the navigated item or false if there is no _history
     */
    History.prototype.navigateDown = function () {
        var history = this._history;

        if (this._offset === undefined) {
            this._offset = 0;
        }
        else if (this._offset + 1 < history.length) {
            this._offset++;
        }

        if (history && history.length > 0) {
            return (history[history.length - this._offset - 1]);
        }
        else
            return false;
    };

    /**
     * @description Clears the _history
     */
    History.prototype.clear = function () {
        this._history = [];
        this._offset = undefined;
    };

    /**
     * @description Adds an item to the _history
     * @param obj The passed object, can be everything
     */
    History.prototype.add = function (obj) {
        this._history.push(obj);
        this._offset = undefined;
    };

    /**
     * @description Returns the current navigated _history item
     * @returns {boolean|*} returns the navigated item or false if there is no _history
     */
    History.prototype.get = function () {
        if (this._offset === undefined ||
            this._history === undefined ||
            this._history.length === 0)
            return false;
        return this._history[this._offset];
    };

    /**
     * creates a new console
     * @param id The id of the div the console should be embedded in
     * @constructor
     */
    function StupidConsole(id) {
        if (!id)
            throw "ID value \"" + id + "\" is invalid or undefined.";
        this._id = id;
        this._headerText = "stupid-console.js";
        this._defaultText = "";
        this._history = new History();
        this._saveToHistory = true;
        this._commandRegistry = new CommandRegistry();
        this.registerEvents();
    }

    /**
     * @description Embeds the console into the DOM
     */
    StupidConsole.prototype.init = function () {
        this._createConsole();
        this.addLine();
    };

    /**
     * @description Changes the header text of the console
     * @param text
     */
    StupidConsole.prototype.setHeaderText = function (text) {
        this._headerText = (text === undefined ? "" : text);
        $(this._id + " .console-header").text(this._headerText);
    };


    /**
     * @description Creates the necessary HTML Elements for the console
     */
    StupidConsole.prototype._createConsole = function () {
        var console = $(this._id);
        console.addClass("console");
        console.append('<div class="console-header">' +
            this._headerText + '</div><div class="console-content"></div>');
    };

    /**
     * @description Sets the beginning text of new lines
     * @param text
     */
    StupidConsole.prototype.setDefaultText = function (text) {
        this._defaultText = (text === undefined ? "" : text);
    };

    /**
     * @description Sets the function which gets called if the passed command name isn't registered.
     * @param callbackFn The function to be called when the error occurs
     */
    StupidConsole.prototype.setErrorCallback = function (callbackFn) {
        this._commandRegistry.register("error", callbackFn);
    };

    /**
     * @description Appends the current line
     * @param text
     */
    StupidConsole.prototype.append = function (text) {
        text = (text === undefined ? this._defaultText : text);
        $(this._id + " .console-edit-left").append(text);
    };

    /**
     * @description Adds a new line
     * @param text optional beginning text - if its undefined, the default text will be used
     * @param saveToHistory - optional flag - if set, the line won't be saved in the _history
     */
    StupidConsole.prototype.addLine = function (text, saveToHistory) {
        this._offset = undefined;
        this._saveToHistory = (saveToHistory === undefined ? true : saveToHistory);
        text = (text === undefined ? this._defaultText : text);
        $(this._id + " .console-content").append('<div class="console-line"><span>' + text + "</span></div>");

        this.scrollToLastLine();
        this._setLastLineActive();
    };

    /**
     * @description Scrolls the console to the last line
     */
    StupidConsole.prototype.scrollToLastLine = function () {
        $(this._id + " .console-content").scrollTop(1E10);
    };

    /**
     * @description Clears the console's content
     */
    StupidConsole.prototype.clear = function () {
        $(this._id + " .console-content").empty();
    };

    /**
     * @description Clears the current line
     */
    StupidConsole.prototype.clearLine = function () {
        $(this._id + " .console-edit-left").text("");
        $(this._id + " .console-edit-right").text("");
    };

    /**
     * @description Moves the cursor right
     */
    StupidConsole.prototype._moveCursorRight = function () {
        var ceRight = $(this._id + " .console-edit-right");
        var right = ceRight.text();

        //if there's nothing to move, stahp it!
        if (right.length === 0)
            return;

        $(this._id + " .console-edit-left").append(right[0]);
        ceRight.text(right.substring(1, right.length));
    };

    /**
     * @description Moves the cursor left
     */
    StupidConsole.prototype._moveCursorLeft = function () {
        var ceLeft = $(this._id + " .console-edit-left");
        var left = ceLeft.text();

        //if there's nothing to move, stahp it!
        if (left.length === 0)
            return;

        $(this._id + " .console-edit-right").prepend(left[left.length - 1]);
        ceLeft.text(left.substring(0, left.length - 1));
    };

    /**
     * @description Navigates the _history up and overwrites the current line with the _history item
     */
    StupidConsole.prototype._navigateHistoryUp = function () {
        var text = this._history.navigateUp();

        if (text !== false) {
            this.clearLine();
            this.append(text);
        }
    };

    /**
     * @description Navigates the _history down and overwrites the current line with the _history item
     */
    StupidConsole.prototype._navigateHistoryDown = function () {
        var text = this._history.navigateDown();

        if (text !== false) {
            this.clearLine();
            this.append(text);
        }
    };

    /**
     * @description Sets the last line active
     */
    StupidConsole.prototype._setLastLineActive = function () {
        $(this._id + " .cursor").remove();
        $(this._id + " .console-active").removeClass("console-active");
        $(this._id + " .console-edit-left").removeClass("console-edit-left");
        $(this._id + " .console-edit-right").removeClass("console-edit-right");
        var last = $(this._id + " .console-line").last().addClass("console-active");
        last.append('<span class="console-edit-left"></span>');
        last.append(this._getCursorSpan("|"));
        last.append('<span class="console-edit-right"></span>');
    };

    /**
     * @description Writes to active line left from cursor
     * @param text
     */
    StupidConsole.prototype._writeToActiveLine = function (text) {
        $(this._id + " .console-edit-left").append(text);
    };

    /**
     * @description Returns a cursor with the passed text as "cursor text"
     * @param text
     * @returns {string} HTML element with the cursor text
     */
    StupidConsole.prototype._getCursorSpan = function (text) {
        text = text === undefined ? "" : text;
        return '<span class="cursor">' + text + "</span>";
    };

    /**
     * @description Removes one char left from the cursor's position
     */
    StupidConsole.prototype._removeOneCharFromCursorLeft = function () {
        var ceLeft = $(this._id + " .console-edit-left");
        var text = ceLeft.text();
        text = text.length > 0 ? text.substr(0, text.length - 1) : text;
        ceLeft.text(text);
    };

    /**
     * @description Removes one char right from the cursor's position
     */
    StupidConsole.prototype._removeOneCharFromCursorRight = function () {
        var ceRight = $(this._id + " .console-edit-right");
        var text = ceRight.text();
        text = text.length > 0 ? text.substr(1, text.length) : text;
        ceRight.text(text);
    };

    //TODO improve separating arguments
    /**
     * @description Parses the input of the current line and returns the separated arguments;
     * @returns {Array} The separated arguments
     */
    StupidConsole.prototype._parseInput = function () {
        var text = this._getInput();
        if (this._saveToHistory)
            this._history.add(text);
        return text.split(" ");
    };

    /**
     * @description Gets the input of the current line
     * @returns {String} the current line's input
     */
    StupidConsole.prototype._getInput = function () {
        return $(this._id + " .console-edit-left").text() + $(this._id + " .console-edit-right").text();
    };

    /**
     * @description registers a new command in the console
     * @param name The name of the command
     * @param callbackFn The function to be called when the command will be triggered
     * @param description An optional short description for the command; if you called "registerBasicCommands()" the "help" command will show the commands with the description
     */
    StupidConsole.prototype.register = function (name, callbackFn, description) {
        this._commandRegistry.register(name, callbackFn, description);
    };

    /**
     * @description deregisters a command
     * @param name the name of the command which should be deregistered
     */
    StupidConsole.prototype.deregister = function (name) {
        this._commandRegistry.deregister(name);
    };

    /**
     * @description triggers the callback function of the command with the parameter's name. If there is none, the "error" command will be triggered if it is registered.
     * @param name The name of the command which should be triggered
     */
    StupidConsole.prototype.trigger = function (name) {
        if (!this._commandRegistry.trigger(name)) {
            this._commandRegistry.trigger("error");
        }
    };

    /**
     * @description Returns if this console is currently the active one.
     * @returns {boolean}
     */
    StupidConsole.prototype._hasFocus = function () {
        return $(this._id).hasClass("active");
    };

    /**
     * @description Sets this console to the active one.
     */
    StupidConsole.prototype.setActive = function () {
        $(".console.active").removeClass("active");
        $(this._id + ".console").addClass("active");
    };

    /**
     * @description Registers all necessary key handlers
     */
    StupidConsole.prototype._registerKeyEvents = function () {
        var self = this;

        $(document).keypress(function (e) {
            if (self._hasFocus() === false)
                return;

            switch (e.which) {

                //enter
                case 13:
                    if (self._getInput() !== "") {
                        self.trigger(self._parseInput());
                    }
                    self.addLine();
                    break;
                default:
                    var char = String.fromCharCode(e.which);
                    self._writeToActiveLine(char);
                    self.scrollToLastLine();
            }
        });

        $(document).keydown(function (e) {
            if (self._hasFocus() === false)
                return;

            switch (e.which) {

                //backspace
                case 8:
                    self._removeOneCharFromCursorLeft();
                    e.preventDefault();
                    break;

                //delete
                case 46:
                    self._removeOneCharFromCursorRight();
                    e.preventDefault();
                    break;

                //left
                case 37:
                    self._moveCursorLeft();
                    break;

                //down
                case 38:
                    self._navigateHistoryDown();
                    e.preventDefault();
                    break;

                //right
                case 39:
                    self._moveCursorRight();
                    break;

                //up
                case 40:
                    self._navigateHistoryUp();
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
    StupidConsole.prototype._registerClickEvent = function () {
        var self = this;

        $(self._id).click(function () {
            self.setActive();
        });
    };

    /**
     * @description Registers all necessary key and click handlers
     */
    StupidConsole.prototype.registerEvents = function () {
        this._registerClickEvent();
        this._registerKeyEvents();
    };

    /**
     * @description Registers a few commands to extend the functionality of the console
     */
    StupidConsole.prototype.registerBasicCommands = function () {
        var self = this;

        self.register("help", function () {
            var commands = self._commandRegistry.commands;

            for (var cmd in commands) {
                if (commands.hasOwnProperty(cmd)) {
                    var description = commands[cmd].description;
                    description = (description === "" ? "no description defined" : description);
                    self.addLine(cmd + ": " + description, false);
                }
            }
        }, "Shows all registered commands");

        self.register("history", function (args) {
            switch (args[0]) {
                case "-show":
                    var history = self._history._history;

                    for (var i = 0; i < history.length; i++) {
                        self.addLine(history[i], false);
                    }
                    break;
                case "-clear":
                    self._history.clear();
                    break;
            }
        }, "-show: shows history, -clear: deletes history");

        self.register("clear", function () {
            self.clear();
        }, "clears the console");
    };

    return StupidConsole;
}());
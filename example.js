$(document).ready(function () {
    'use strict';

    var sc = new StupidConsole("#exampleConsole");
    sc.setDefaultText("foo@bar: $ ");
    sc.setErrorCallback(function (args) {
        sc.addNewLine('Invalid command. Type in "help" to see all commands.');
    });
    sc.setHeaderText("My pretty stupid console");
    sc.init();

    sc.register("help", function () {
        var commands = sc.commandRegistry.commands;

        for (var cmd in commands) {
            if (commands.hasOwnProperty(cmd)) {
                var description = commands[cmd].description;
                description = (description === "" ? "no description defined" : description);
                sc.addNewLine(cmd + ": " + description, false);
            }
        }
    }, "Shows all registered commands");

    sc.register("history", function (args) {
        switch (args[0]) {
            case "-show":
                var history = sc.history.history;
                for (var i = 0; i < history.length; i++) {
                    sc.addNewLine(history[i], false);
                }
                break;
            case "-clear":
                sc.history.clear();
                break;
        }
    }, "-show: shows history, -clear: deletes history");
});

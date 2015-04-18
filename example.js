$(document).ready(function () {
    'use strict';

    var sc = new StupidConsole("#test");
    sc.setDefaultText("foo@bar: $ ");
    sc.setErrorCallback(function (args) {
        sc.addNewLine("Ungültiger Befehl");
    });
    sc.setHeaderText("My pretty stupid console");
    sc.init();

    var sc2 = new StupidConsole("#test2");
    sc2.setDefaultText("C:\\ ");
    sc2.setHeaderText("Console 2");
    sc2.init();

    sc.register("help", function () {
        var commands = sc.commandRegistry.commands;

        for (var cmd in commands) {
            if (commands.hasOwnProperty(cmd)) {
                var description = commands[cmd].description;
                description = (description === "" ? "n/a" : description);
                sc.addNewLine(cmd + ": " + description, false);
            }
        }
    }, "Hilft dir!");

    sc.register("args", function (args) {
        sc.addNewLine("Übergebene Argumente: ");
        console.log(args);
        for (var i = 0; i < args.length; i++) {
            sc.appendCurrentLine((i + 1) + ". " + args[i] + " ");
        }
    }, "");
    sc.register("cls", function () {
        sc.clear();
    });

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
    }, "-show: zeigt History, -clear: löscht History");
});

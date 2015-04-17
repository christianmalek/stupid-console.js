$(document).ready(function () {
    'use strict';

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
    });
    sc.register("cls", function () {
        sc.clear();
    });
});

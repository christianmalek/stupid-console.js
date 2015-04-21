$(document).ready(function () {
    'use strict';

    var sc = new StupidConsole("#exampleConsole");
    sc.setDefaultText("foo@bar: $ ");
    sc.setErrorCallback(function (args) {
        sc.addNewLine('Invalid command. Type in "help" to see all commands.');
    });
    sc.setHeaderText("My pretty stupid console");
    sc.registerBasicCommands();
    sc.init();


});

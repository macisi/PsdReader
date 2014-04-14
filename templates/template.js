/*
 * template lists
 */
define(function(require){

    "use strict";

    var Handlebars = require("handlebars");

    var tpl = {
        layerList: Handlebars.compile(require("text!templates/layerList.tpl"))
    };

    return tpl;

});
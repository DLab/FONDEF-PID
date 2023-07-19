"use strict";
exports.__esModule = true;
exports.getWorkspace = exports.getWorkspacePath = void 0;
var core_1 = require("@angular-devkit/core");
var schematics_1 = require("@angular-devkit/schematics");
function getWorkspacePath(host) {
    var possibleFiles = ['/angular.json', '/.angular.json'];
    var path = possibleFiles.filter(function (file) { return host.exists(file); })[0];
    return path;
}
exports.getWorkspacePath = getWorkspacePath;
function getWorkspace(host) {
    var path = getWorkspacePath(host);
    var configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new schematics_1.SchematicsException("Could not find (" + path + ")");
    }
    var content = configBuffer.toString();
    return core_1.parseJson(content, core_1.JsonParseMode.Loose);
}
exports.getWorkspace = getWorkspace;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const saveMaps_1 = __importDefault(require("./saveMaps"));
const sClass = new saveMaps_1.default('../public/images/maps/');
sClass.saveGMaps();

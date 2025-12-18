"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateKey = void 0;
const authenticateKey_middleware_1 = __importDefault(require("./middleware/authenticateKey.middleware"));
exports.authenticateKey = authenticateKey_middleware_1.default;

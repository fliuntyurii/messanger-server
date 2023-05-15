"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const dialogueController_1 = require("../controllers/dialogueController");
const authentication_1 = require("../middleware/authentication");
router.get('/:id', authentication_1.authenticateUser, dialogueController_1.getDialogue);
router.get('/', authentication_1.authenticateUser, dialogueController_1.getAllDialogues);
router.post('/', authentication_1.authenticateUser, dialogueController_1.createDialogue);
router.delete('/:id', authentication_1.authenticateUser, dialogueController_1.deleteDialogue);
exports.default = router;

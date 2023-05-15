"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenUser = void 0;
const createTokenUser = (user) => {
    return {
        name: user.name,
        userId: user._id,
        role: user.role,
        verificationToken: user.verificationToken,
        isVerified: user.isVerified,
        bio: user.bio,
        image: user.image,
        dialogues: user.dialogues,
        language: user.language,
        username: user.username,
        email: user.email
    };
};
exports.createTokenUser = createTokenUser;

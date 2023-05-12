import { TUser, TUserToken } from "../types/user.type";

const createTokenUser = (user: TUser): TUserToken => {
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

module.exports = createTokenUser;
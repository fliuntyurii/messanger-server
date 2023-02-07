const createTokenUser = (user) => {
  return { name: user.name, userId: user._id, role: user.role, verificationToken: user.verificationToken, isVerified: user.isVerified };
};

module.exports = createTokenUser;

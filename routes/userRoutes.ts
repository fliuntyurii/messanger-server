import express from 'express';
const router = express.Router();
const {
  authenticateUser,
} = require('../middleware/authentication');

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');

router.route('/').get(authenticateUser, getAllUsers);
router.route('/find-user').get(authenticateUser, getSingleUser);

router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);

module.exports = router;
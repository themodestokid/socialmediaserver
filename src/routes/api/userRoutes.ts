import { Router } from 'express';
const router = Router();
import { createUser, updateUser, deleteUser, getUsers, getSingleUser,
        addUserFriend, removeUserFriend
 } from '../../controllers/usersController.js';

router.route('/')
.get(getUsers)
.post(createUser);

router.route('/:userId')
.get(getSingleUser)
.put(updateUser)
.delete(deleteUser);

router.route('/:userId/friends/:friendId')
.post(addUserFriend)
.delete(removeUserFriend)

export default router;

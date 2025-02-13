import { Request, Response } from "express";
import User from "../models/user.js";
import Thought from "../models/thought.js";
import { Types } from 'mongoose'
import removeItem from "../utils/removeItem.js";

// create a new user from the params in the request body
export async  function createUser (req: Request, rsp: Response) {
    try {
        const userData = await User.create(req.body);
        rsp.json(userData);
    } catch (err) {
      rsp.status(500).json(err);
    }
}

// update the user with the given id 
export async function updateUser(req: Request, rsp: Response) {
    try {
        const userData = await User.findByIdAndUpdate(
                                    req.params.userId,
                                    req.body,
                                    {new:true})
        rsp.status(200).json(userData);
    } catch (err) {
        rsp.status(500).json(err)
    }
}

// delete the user with the given id
export async function deleteUser(req: Request, rsp: Response) {
    try {
        const userId = new Types.ObjectId(req.params.userId)
        const user = await User.findById(userId);

        if (!user) {
            throw `user ${userId} not found`
        }

            // delete thoughts belonging to this user
        for (const thoughtId of user.thoughts) {
            await Thought.findByIdAndDelete(thoughtId);
        }

            // remove this user from friends lists of other users
        const friends = await User.find({friends: userId})
        for (const friend of friends) {
            removeItem(friend.friends, userId);
            friend.save();
        }
    
        await User.findByIdAndDelete(userId);

        rsp.status(200).json({message:`user ${req.params.userId} deleted`})
    } catch (err) {
        rsp.status(500).json(err);
    }
}

    // get all users
export async function getUsers(_req: Request, rsp: Response) {
    try {
        const userData = await User.find()
        rsp.status(200).json(userData);
    } catch (err) {
        rsp.status(500).json(err)
    }
}

    // get one user by id
export async function getSingleUser(req: Request, rsp: Response) {
    try {
        const userData = await User.findById(req.params.userId)
        rsp.status(200).json(userData);
    } catch (err) {
        rsp.status(500).json(err)
    }

}

    // add a friend -- friendship is reciprocal so also add this user to 
    // the friend's friend list
export async function addUserFriend(req: Request, rsp: Response) {
    try {
        const userId = new Types.ObjectId(req.params.userId)
        const userData = await User.findById(userId)
        if (!userData) {
            throw `user not found: ${req.params.userId}`
        }
        const friendId = new Types.ObjectId(req.params.friendId)
        if (friendId == userId) {
            throw `user cannot friend self`
        }
        if (userData.friends.includes(friendId)) {
            rsp.status(304).json({message:'No changes made, friend already present'})
        } else {
            const friendData = await User.findById(friendId)
            if (!friendData) {
                throw `user not found: ${req.params.friendId}`
            }
            userData.friends.push(friendId)
            userData.save();
            friendData.friends.push(userId)
            friendData.save();
            rsp.status(200).json(userData);
        }
    } catch (err) {
        rsp.status(500).json(err)
    }
}

    // remove a friend -- also remove this user from the friend's
    // friend list
export async function removeUserFriend(req: Request, rsp: Response) {
    try {
        const userId = new Types.ObjectId(req.params.userId)
        const friendId = new Types.ObjectId(req.params.friendId)
        const userData = await User.findById(userId)
        if (!userData) {
            throw `user not found: ${req.params.userId}`
        }
        if (!userData.friends.includes(friendId)) {
            rsp.status(304).json({message:'No changes made, friend does not exist'})
        } else {
            removeItem(userData.friends, friendId);
            userData.save();

            const friendData = await User.findById(friendId)
            if (!friendData) { // should never reach this code
                console.log(`Unexpected: user not found: ${req.params.friendId}`)
            }
            else {
                removeItem(friendData.friends, userId);
                friendData.save();
            }
            rsp.status(200).json(userData);
        }
    } catch (err) {
        rsp.status(500).json(err)
    }
}

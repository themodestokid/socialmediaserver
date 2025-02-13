import { Request, Response } from "express";
import Thought from "../models/thought.js";
// import { reactionSchema } from "../models/thought.js";
import User from "../models/user.js";
import { Types } from 'mongoose'
import removeItem from "../utils/removeItem.js";
import { removeItemById } from "../utils/removeItem.js";

    // create a new thought from params in the request body
export async  function createThought (req: Request, rsp: Response) {
    try {
        const userData = await User.findOne({username:req.body.username})
        if (!userData) { // cannot create a thought for a nonexistent user
            throw({message:`user ${req.body.username} not found`})
        }
        const thoughtData = await Thought.create(req.body);
            // add the new thought to user thoughts
        userData.thoughts.push(new Types.ObjectId(thoughtData._id as string))
        userData.save()
        rsp.status(200).json(thoughtData);
    } catch (err) {
      rsp.status(500).json(err);
    }
}

// get all thoughts
export async  function getThoughts (_req: Request, rsp: Response) {
    try {
        const thoughtsData = await Thought.find();
        rsp.json(thoughtsData);
    } catch (err) {
      rsp.status(500).json(err);
    }
}

// get one thought by id
export async  function getSingleThought (req: Request, rsp: Response) {
    try {
        const thoughtData = await Thought.findById(req.params.thoughtId);
        if (!thoughtData) {
            throw({message:`thought ${req.params.thoughtId} not found`})
        }
        rsp.json(thoughtData);
    } catch (err) {
      rsp.status(500).json(err);
    }
}

// update one thought by id
export async  function updateThought (req: Request, rsp: Response) {
    try {
        if (req.body.username) {
            throw "cannot update thought username"
        }
        const thoughtData = await Thought.findByIdAndUpdate(req.params.thoughtId,
                                                                req.body, {new:true}
        );
        if (!thoughtData) {
            throw({message:`thought ${req.params.thoughtId} not found`})
        }
        rsp.json(thoughtData);
    } catch (err) {
      rsp.status(500).json(err);
    }
}

// delete a thought
export async  function deleteThought (req: Request, rsp: Response) {
    try {
       const user = await User.findOne({thoughts: req.params.thoughtId})
       if (user) {
            // remove thought from user's list
         removeItem(user.thoughts, new Types.ObjectId(req.params.thoughtId));
         user.save();
       }

       await Thought.findByIdAndDelete(req.params.thoughtId);
       rsp.status(200).send();
    } catch (err) {
      rsp.status(500).json(err);
    }
}

// add a reaction to a thought
export async  function addThoughtReaction (req: Request, rsp: Response) {
    try {
        const thoughtData = await Thought.findById(req.params.thoughtId);
        if (!thoughtData) {
            throw({message:`thought ${req.params.thoughtId} not found`})
        }
        thoughtData.reactions.push({ 
            reactionBody:req.body.reactionBody,
            username:req.body.username,
            createdAt: new Date()
        })
        thoughtData.save();
        rsp.json(thoughtData);
    } catch (err) {
      rsp.status(500).json(err);
    }
}

// delete a reaction from a thought
export async  function removeThoughtReaction (req: Request, rsp: Response) {
    try {
        const thoughtData = await Thought.findById(req.params.thoughtId);
        if (!thoughtData) {
            throw({message:`thought ${req.params.thoughtId} not found`})
        }
        if (!removeItemById(thoughtData.reactions, req.params.reactionId)) {
            rsp.status(304).send();
        }
        else {
            thoughtData.save();
            rsp.json(thoughtData);
        }
    } catch (err) {
      rsp.status(500).json(err);
    }
}

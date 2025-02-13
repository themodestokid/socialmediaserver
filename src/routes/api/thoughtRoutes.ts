import { Router } from 'express';
const router = Router();
import { getThoughts, createThought, getSingleThought, updateThought, deleteThought,
         addThoughtReaction, removeThoughtReaction
 } from '../../controllers/thoughtsController.js';

router.route('/')
.get(getThoughts)
.post(createThought)


router.route('/:thoughtId')
.get(getSingleThought)
.put(updateThought)
.delete(deleteThought);

 router.route('/:thoughtId/reactions')
 .post(addThoughtReaction)

 router.route('/:thoughtId/reactions/:reactionId')
.delete(removeThoughtReaction)

export default router;

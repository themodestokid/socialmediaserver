import { Schema, model, Document } from 'mongoose';


interface IReaction {//extends Document {
    reactionBody: String;
    username: String;
    createdAt: Date;
}

// export const reactionSchema = new Schema<IReaction> (
//     {
//         reactionBody: String,
//         username: String,
//         createdAt: {
//             type: Date,
//             default: Date.now()
//         }
//     }
// )
interface IThought extends Document {
    thoughtText: string;
    createdAt: Date;
    username: string;
    reactions: IReaction[];
}

const thoughtSchema = new Schema<IThought>(
  {
    thoughtText: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    username: String,
    reactions: {
        type: [{
                reactionBody: String,
                username: String,
                createdAt: Date
            }],
        default: []
    }
  }
);

// Initialize our User model
const Thought = model('thought', thoughtSchema);

export default Thought;

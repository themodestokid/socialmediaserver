import { Schema, model, Document, Types} from 'mongoose';


export interface IUser extends Document {
    username: string;
    email: string;
    thoughts: Types.ObjectId[];
    friends: Types.ObjectId[];
    friendsCount: number;
};


const userSchema = new Schema<IUser>(
  {
    username: String,
    email: String,
    thoughts: [{
      type: Schema.Types.ObjectId,
      ref: 'thought'
    }],
    friends: [{
      type: Schema.Types.ObjectId,
      ref: 'user'
    }]
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false,
  }
);

userSchema.virtual('friendsCount')
.get(function() { this.friends.length})

// Initialize our User model
const User = model('user', userSchema);

export default User;

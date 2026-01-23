import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    email: string;    
    password: string;
    username: string;
    profilePicture: string;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },    
    password: { type: String, required: true },
    username: { type: String, required: true },
    profilePicture: {type: String, default: null}

});

const UserModel: mongoose.Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export { UserModel as User, IUser };

//const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", UserSchema); 
//export { User, IUser };


//export default mongoose.model<IUser>("User", UserSchema);

import mongoose from "../index";
import { Document, Schema, SchemaTypes } from "mongoose";

type Context = Document & {
	key: string;
	context: string[];
};

const ContextSchema = new Schema(
	{
		key: {
			type: SchemaTypes.String,
			require: true,
		},
		context: {
			type: SchemaTypes.Array,
			require: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model<Context>("Context", ContextSchema);

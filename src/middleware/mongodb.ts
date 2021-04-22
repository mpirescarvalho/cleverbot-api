import { NextApiHandler } from "next";
import mongoose from "mongoose";

const withMongoDB: (handler: NextApiHandler) => NextApiHandler = (
	handler
) => async (req, res) => {
	if (mongoose.connections[0].readyState) {
		return handler(req, res);
	}
	await mongoose.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyjy2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	);
	return handler(req, res);
};

export default withMongoDB;

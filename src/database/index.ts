import mongoose from "mongoose";

mongoose.connect(
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyjy2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

export default mongoose;

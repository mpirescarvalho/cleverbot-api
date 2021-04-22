import { NextApiHandler } from "next";
import cleverbot from "cleverbot-free";
import Context from "../../models/Context";
import withMongoDB from "../../middleware/mongodb";

type QueryParams = {
	message: string;
	key?: string;
	language?: string;
};

const handler: NextApiHandler = async (req, res) => {
	const { key, message, language = "pt" } = req.query as QueryParams;

	if (!message) {
		return res.status(400).json({ error: "query param `message` is required" });
	}

	try {
		let context: string[];

		if (key) {
			const query = await Context.findOne({ key }).exec();
			context = query?.context || [];
		}

		const response = await cleverbot(message, context, language);

		if (key) {
			context = [...context, message, response];

			await Context.findOneAndUpdate(
				{ key },
				{
					key,
					context,
				},
				{ upsert: true }
			);
		}

		return res.json({
			response,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err.message });
	}
};

export default withMongoDB(handler);

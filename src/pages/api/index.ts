import { NextApiRequest, NextApiResponse } from "next";
import cleverbot from "cleverbot-free";
import Context from "../../database/schemas/Context";

type QueryParams = {
	message: string;
	key?: string;
	language?: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
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

		console.log(context);
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
		return res.status(500).json({ error: err.message });
	}
};

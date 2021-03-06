import { NextApiHandler } from "next";
import cleverbot from "cleverbot-free";
import Context from "../../models/Context";
import withMongoDB from "../../middleware/mongodb";
import withErrorHandler from "../../middleware/error-handler";
import { getLanguageDetector } from '../../utils/language-detector'

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

		let responseLanguage: string | null = null

		try {
			const languageDetector = getLanguageDetector()
			responseLanguage = await languageDetector.detect(response)
		} catch (err) {
			console.error('failed to detect response language', err)
		}

		return res.json({
			response,
			language: responseLanguage
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err.message });
	}
};

export default withErrorHandler(withMongoDB(handler));

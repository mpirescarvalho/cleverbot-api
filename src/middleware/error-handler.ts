import { NextApiHandler } from "next";

const withErrorHandler: (handler: NextApiHandler) => NextApiHandler = (
	handler
) => async (req, res) => {
	try {
		return handler(req, res);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

export default withErrorHandler;

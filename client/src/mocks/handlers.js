// eslint-disable-next-line import/no-extraneous-dependencies
import { rest } from "msw";

export const handlers = [
  rest.get("http://127.0.0.1:8001/api/v1/", (req, res, ctx) => {
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json({}));
  }),
];

export default handlers;

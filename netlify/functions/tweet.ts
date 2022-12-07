import { schedule } from "@netlify/functions";
import MainService from "../../services/MainService";

const handler = schedule("0,30 * * * *", async () => {
    const result = await MainService.tweetBatch();
    return result;
})

export { handler }
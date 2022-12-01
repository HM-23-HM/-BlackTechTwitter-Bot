import MainService from "../services/MainService"

export default async function handler(req, res) {
    const result = await MainService.tweetBatch();
    res.json(result)
}
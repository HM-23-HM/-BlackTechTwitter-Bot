import MainService from "../services/MainService"

export default function handler(req, res) {
    MainService.tweet();
    res.json({
        success: true
    })
}
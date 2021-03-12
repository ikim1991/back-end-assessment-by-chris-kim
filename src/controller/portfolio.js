import getStockPrices from '../api/getStockPrices.js';

export const getPortfolio = async (req, res, next) => {

    const { userId } = req.session

    res.send("PORTFOLIO")
}
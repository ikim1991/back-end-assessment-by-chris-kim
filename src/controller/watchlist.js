import getStockPrices from '../api/getStockPrices.js';
import Ticker from '../model/ticker.js';
import Watchlist from '../model/watchlist.js';
import ApiError from '../error/ApiError.js'

export const getWatchlist = async (req, res, next) => {
    try{

        const { userId } = req.session
        const watchlistId = await Watchlist.findWatchlistById(userId)
        const watchlist = await Ticker.getWatchlist(watchlistId)

        if(watchlistId instanceof ApiError || watchlist instanceof ApiError){
            return next(ApiError.internal("Something went Wrong... getWatchlist"))
        }

        res.send(watchlist)

    }catch(err){
        next(ApiError.internal('Something went Wrong... getWatchlist'))        
    }
}

export const addToWatchlist = async (req, res, next) => {

    try{
        const { userId } = req.session
        const { ticker, market } = req.body
        let watchlist = await Watchlist.findWatchlistById(userId)
        const duplicate = await Ticker.findOne({ ticker: ticker, user: userId })

        if(!duplicate){
            const stock = await getStockPrices([{ticker, market}])

            const stockData = {
                ticker: stock[0].ticker,
                company: stock[0].company,
                price: +stock[0].price.replace(",", ""),
                change: stock[0].change,
                market: stock[0].market
            }
        
            const stockTicker = await Ticker.addToWatchlist(userId, watchlist._id, stockData)
    
            return res.sendStatus(200)
        }

        next(ApiError.badRequest("Ticker Already in Watchlist..."))

    } catch(err){
        next(ApiError.internal('Something went Wrong... addToWatchlist'))
    }
}

export const removeFromWatchlist = async (req, res, next) => {
    try{

        const { userId } = req.session
        const { ticker } = req.body

        let watchlist = await Ticker.removeTickerFromWatchlist(userId, ticker)

        if(watchlist instanceof ApiError){
            return next(watchlist)
        }

        const watchlistId = await Watchlist.findWatchlistById(userId)
        watchlist = await Ticker.getWatchlist(watchlistId)

        res.send(watchlist)

    }catch(err){
        next(ApiError.internal("Something went Wrong... removeFromWatchlist"))
    }
}

export const updateWatchlistPrices = async (req, res, next) => {
    try{

        const { userId } = req.session
        let watchlist = await Watchlist.findWatchlistById(userId)

        watchlist = await Ticker.getListOfTickersToUpdate(userId, watchlist)

        const stockPrices = await getStockPrices(watchlist)

        res.send(stockPrices)

    } catch(err){
        next(ApiError.internal('Something went Wrong... updateWatchlistPrices'))
    }
}
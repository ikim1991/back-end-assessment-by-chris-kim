import mongoose from 'mongoose';
import ApiError from '../error/ApiError.js';

export const tickerSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    change: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    market: {
        type: String,
        required: true,
        trim: true
    },
    shares: {Number},
    purchasePrice: {Number},
    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Portfolio"
    },
    watchlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Watchlist"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
})

tickerSchema.statics.getWatchlist = async (watchlistId) => {
    try{
        
        const watchlist = await Ticker.find({ watchlist: watchlistId })
    
        return watchlist

    }catch(err){
        return ApiError.internal("Something went Wrong... addToWatchlist")
    }
}

tickerSchema.statics.addToWatchlist = async (userId, watchlist, stock) => {
    
    try{
        const { ticker, change, price, company, market } = stock

        const stockTicker = await Ticker.create({ ticker, change, price, company, market, watchlist, user: userId })
    
        return stockTicker
    }catch(err){
        return ApiError.internal("Something went Wrong... addToWatchlist")
    }
}

tickerSchema.statics.removeFromWatchlist = async (userId, symbol) => {
    try{
        const { ticker, change, price, company } = stock

        const stockTicker = await Ticker.create({ ticker, change, price, company, watchlist, user: userId })
    
        return stockTicker
    }catch(err){
        return ApiError.internal("Something went Wrong... removeFromWatchlist")
    }
}

tickerSchema.statics.getListOfTickersToUpdate = async (userId, watchlist) => {
    try{
        
        const watchlistItems = await Ticker.find({ user: userId, watchlist}).select('ticker market')
        
        return watchlistItems
    }catch(err){
        return ApiError.internal("Something went Wrong... removeFromWatchlist")
    }
}

tickerSchema.statics.removeTickerFromWatchlist = async (userId, ticker) => {
    try{

        let stock = await Ticker.findOne({ ticker, user: userId })
        
        if(!stock){
            return ApiError.notFound('Ticker Not in Watchlist... removeTickerFromWatchlist')
        }

        if(stock.watchlist && !stock.portfolio){
            stock = await Ticker.deleteOne({ ticker, user: userId })

            return stock
        }

        stock.watchlist = undefined
        await stock.save()

        return stock

        

    }catch(err){
        return ApiError.internal("Something went Wrong... removeFromWatchlist")
    }
}

tickerSchema.methods.buyStock = async function(shares, purchasePrice){
    try{

    }catch(err){
        return ApiError.internal("Something went Wrong... buyStock")
    }
}

tickerSchema.methods.sellStock = async function(shares, sellPrice){
    try{
        
    }catch(err){
        return ApiError.internal("Something went Wrong... sellStock")
    }
}


const Ticker = mongoose.model("Ticker", tickerSchema)
export default Ticker
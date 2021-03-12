import mongoose from 'mongoose';
import ApiError from '../error/ApiError.js';
import Wallet from './wallet.js';

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
    bookValue: {Number},
    marketValue: {Number},
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

tickerSchema.statics.updateSharePrice = async (stock) => {
    try{
        await Ticker.updateOne({ ticker: stock.ticker }, { price: stock.price, change: stock.change })

        return
    }catch(err){
        return ApiError.internal("Something went Wrong... updateSharePrice")
    }
}

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

tickerSchema.statics.getPortfolio = async (portfolioId) => {
    try{
        const portfolio = await Ticker.find({ portfolio: portfolioId })

        return portfolio
    }catch(err){
        return ApiError.internal("Something went Wrong... getPortfolio")
    }
}

tickerSchema.statics.updateMarketValue = async (ticker, portfolioId) => {
    try{
        const stock = await Ticker.findOne({ ticker, portfolio: portfolioId })
        const value = stock.price * stock.shares

        await Ticker.findOneAndUpdate({ ticker, portfolio: portfolioId}, {marketValue: value})

        return
    }catch(err){
        return ApiError.internal("Something went Wrong... getPortfolioHoldingsValue")
    }
}

tickerSchema.statics.buyStock = async function(ticker, shares, userId, portfolioId){
    try{

        const stock = await Ticker.findOne({ ticker, user: userId })
        const wallet = await Wallet.findWalletById(userId)
        const purchasePrice = +stock.price
        const bookValue = +purchasePrice * +shares

        const sale = await wallet.sufficientFunds(bookValue)

        if(!stock.portfolio && sale){
            await Ticker.findOneAndUpdate({ ticker, user: userId }, { shares, purchasePrice, bookValue, portfolio: portfolioId })
            await wallet.decrementBalance(bookValue)

            return true
        }

        if(sale){
            const totalBookValue = +stock.bookValue + +bookValue
            const totalShares = +stock.shares + +shares
            const averagePurchasePrice = (totalBookValue / totalShares)
            await Ticker.findOneAndUpdate({ ticker, user: userId }, { bookValue: totalBookValue, portfolio: portfolioId, purchasePrice: averagePurchasePrice, shares: totalShares })
            await wallet.decrementBalance(bookValue)

            return true
        }

        return ApiError.badRequest("Insufficient Funds to Buy Stock...")

    }catch(err){
        return ApiError.internal("Something went Wrong... buyStock")
    }
}

tickerSchema.statics.sellStock = async function(ticker, shares, userId, portfolioId){
    try{
        const stock = await Ticker.findOne({ ticker, user: userId })
        const wallet = await Wallet.findWalletById(userId)
        const sellValue = +stock.price * +shares

        if(!portfolioId){
            return ApiError.badRequest("You do Not Own the Stock...")
        }

        if(+shares > +stock.shares){
            return ApiError.badRequest("Unable to sell Shares... Exceeding Number of Shares")
        } else if(+shares === +stock.shares){
            await Ticker.deleteOne({ ticker, user: userId })
        } else{

            const newBook = +stock.bookValue - +sellValue
            const sharesAfterSale = +stock.shares - +shares
            const averagePurchasePrice = (+newBook / +sharesAfterSale)
            await Ticker.findOneAndUpdate({ ticker, user: userId }, { shares: sharesAfterSale, purchasePrice: averagePurchasePrice, bookValue: newBook })
        }

        await wallet.incrementBalance(sellValue)
        return true

    }catch(err){
        return ApiError.internal("Something went Wrong... sellStock")
    }
}

const Ticker = mongoose.model("Ticker", tickerSchema)
export default Ticker
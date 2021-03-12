import mongoose from 'mongoose';
import { tickerSchema } from './ticker.js';

const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    cashBalance: {
        type: Number,
        default: 10000
    },
    bookValue: {
        type: Number,
        default: 0
    },
    marketValue: {
        type: Number,
        default: 0
    }
})

portfolioSchema.statics.initializePortfolio = async (userId) => {
    try{
        const portfolio = await Portfolio.create({user: userId})

        return portfolio
    }catch(err){
        return ApiError.internal("Something went Wrong... initializePortfolio")
    }
}

const Portfolio = mongoose.model("Portfolio", portfolioSchema)
export default Portfolio
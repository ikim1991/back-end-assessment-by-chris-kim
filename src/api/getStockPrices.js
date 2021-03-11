import axios from 'axios';
import cheerio from 'cheerio';
import ApiError from '../error/ApiError.js';

// Takes in an Array of Stock Tickers. Will return error if the argument passed is not in an array
// Using Axios and Cheerio to Web Scrape Stock Data from Yahoo Finance
const getStockPrices = async (tickers = []) => {

	try {
        const stockPrices = []
        for(let ticker of tickers){
            let url = ""
            if(ticker.market.toUpperCase() === 'V' || ticker.market.toUpperCase() === 'TO'){
                url = `https://ca.finance.yahoo.com/quote/${ticker.symbol}.${ticker.market}`
            }else {
                url = `https://ca.finance.yahoo.com/quote/${ticker.symbol}`
            }

            const { data } = await axios.get(url)
            const $ = cheerio.load(data);

            if(ticker.market.toUpperCase() === 'V' || ticker.market.toUpperCase() === 'TO'){
                stockPrices.push({
                    ticker: `${ticker.symbol}.${ticker.market}`,
                    company: $('h1[class="D(ib) Fz(18px)"]').text().trim(),
                    price: $('span[class="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)"]').text().trim(),
                    change: $('div[class="D(ib) Mend(20px)"] span[data-reactid="33"]').text().trim(),
                })
            }else{
                stockPrices.push({
                    ticker: `${ticker.symbol}`,
                    company: $('h1[class="D(ib) Fz(18px)"]').text().trim(),
                    price: $('span[class="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)"]').text().trim(),
                    change: $('div[class="D(ib) Mend(20px)"] span[data-reactid="33"]').text().trim(),
                })
            }
        }

        return stockPrices
  } catch (err) {
        return ApiError.internal("Unable to Fetch Data from API...")
  }
}

export default getStockPrices;
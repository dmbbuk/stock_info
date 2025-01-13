import yahooFinance from 'yahoo-finance2';

const getYFdatas = async () => {
    const results = await yahooFinance.quote('AAPL');
    console.log('results', results);
    const { regularMarketPrice: price, currency } = results;
    console.log(results);
    return {regularMarketPrice: price, currency};
}

export default getYFdatas;
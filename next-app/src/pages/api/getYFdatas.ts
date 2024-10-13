import yahooFinance from 'yahoo-finance2';

const getYFdatas = async () => {
    const results = await yahooFinance.search('AAPL');
    console.log(results);
    return results;
}

export default getYFdatas;
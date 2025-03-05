export class ApiService {
    static async fetchCryptoData() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&sparkline=true&price_change_percentage=1h,24h,7d');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            throw error;
        }
    }

    static async fetchMemeCoins() {
        try {
            // List of popular memecoin IDs
            const memeCoins = [
                'dogecoin',
                'shiba-inu',
                'pepe',
                'floki',
                'bonk',
                'wojak',
                'dogwifhat',
                'book-of-meme',
                'meme',
                'catcoin'
            ];
            
            const queryString = memeCoins.join(',');
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${queryString}&order=market_cap_desc&sparkline=true&price_change_percentage=1h,24h,7d`);
            
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching memecoins:', error);
            throw error;
        }
    }

    static async fetchNews() {
        try {
            const [cryptoCompareNews, newsApiNews] = await Promise.all([
                this.fetchCryptoCompareNews(),
                this.fetchNewsApiNews()
            ]);
            return this.mergeAndSortNews(cryptoCompareNews, newsApiNews);
        } catch (error) {
            console.error('Error fetching news:', error);
            throw error;
        }
    }

    static async fetchCryptoCompareNews() {
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    }

    static async fetchNewsApiNews() {
        const response = await fetch('https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=81b40930fc234c3c8dd6c1e39669a656');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    }

    static mergeAndSortNews(cryptoCompareNews, newsApiNews) {
        const formattedCryptoCompareNews = cryptoCompareNews.Data.map(news => ({
            title: news.title,
            description: news.body.substring(0, 150) + '...',
            url: news.url,
            publishedAt: new Date(news.published_on * 1000),
            source: 'CryptoCompare'
        }));

        const formattedNewsApiNews = newsApiNews.articles.map(news => ({
            title: news.title,
            description: news.description ? news.description.substring(0, 150) + '...' : '',
            url: news.url,
            publishedAt: new Date(news.publishedAt),
            source: news.source.name
        }));

        return [...formattedCryptoCompareNews, ...formattedNewsApiNews]
            .sort((a, b) => b.publishedAt - a.publishedAt)
            .slice(0, 12); // Show only the 12 most recent news items
    }
}




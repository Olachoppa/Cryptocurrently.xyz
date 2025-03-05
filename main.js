import { ApiService } from './js/apiService.js';

// Add this at the top of main.js with your other DOM references
const navbarCollapse = document.querySelector('.navbar-collapse');
const navbar = document.querySelector('.navbar');

// Add this function to handle clicking outside
document.addEventListener('click', (event) => {
    const isClickInsideNavbar = navbar.contains(event.target);
    
    // If the navbar is expanded and the click is outside the navbar
    if (navbarCollapse.classList.contains('show') && !isClickInsideNavbar) {
        // Find the navbar toggler and click it to close the menu
        const navbarToggler = document.querySelector('.navbar-toggler');
        navbarToggler.click();
    }
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
}

// Fetch cryptocurrency data
async function fetchCryptoData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&sparkline=false');
    const data = await response.json();
    displayCryptoData(data);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    document.getElementById('crypto-data').innerHTML = '<div class="col-12"><div class="alert alert-danger">Error loading cryptocurrency data</div></div>';
  }
}

// Display cryptocurrency data
function displayCryptoData(data) {
  const cryptoContainer = document.getElementById('crypto-data');
  cryptoContainer.innerHTML = '';

  data.forEach(coin => {
    const priceChange = coin.price_change_percentage_24h;
    const priceChangeClass = priceChange >= 0 ? 'price-up' : 'price-down';
    
    const card = document.createElement('div');
    card.className = 'col-md-3 mb-4';
    card.innerHTML = `
      <div class="card crypto-card h-100">
        <div class="card-body">
          <div class="d-flex align-items-center mb-2">
            <img src="${coin.image}" alt="${coin.name}" style="width: 24px; height: 24px; margin-right: 8px;">
            <h5 class="card-title mb-0">${coin.name}</h5>
          </div>
          <p class="card-text">
            Price: $${coin.current_price.toLocaleString()}<br>
            24h Change: <span class="${priceChangeClass}">${priceChange.toFixed(2)}%</span><br>
            Market Cap: $${coin.market_cap.toLocaleString()}
          </p>
        </div>
      </div>
    `;
    cryptoContainer.appendChild(card);
  });
}

// Add function to display memecoins
function displayMemeCoins(data) {
    const memeContainer = document.getElementById('memecoin-data');
    memeContainer.innerHTML = '';

    data.forEach(coin => {
        const priceChange24h = coin.price_change_percentage_24h;
        const priceChange7d = coin.price_change_percentage_7d;
        const priceChange1h = coin.price_change_percentage_1h;
        
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card crypto-card meme-card h-100">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-2">
                        <img src="${coin.image}" alt="${coin.name}" style="width: 32px; height: 32px; margin-right: 8px;">
                        <div>
                            <h5 class="card-title mb-0">${coin.name}</h5>
                            <small class="text-muted">${coin.symbol.toUpperCase()}</small>
                        </div>
                    </div>
                    <div class="crypto-price mb-2">
                        <h6 class="mb-0">$${coin.current_price.toLocaleString(undefined, {
                            minimumFractionDigits: 8,
                            maximumFractionDigits: 8
                        })}</h6>
                    </div>
                    <div class="price-changes">
                        <div class="d-flex justify-content-between mb-1">
                            <span>1h:</span>
                            <span class="${priceChange1h >= 0 ? 'price-up' : 'price-down'}">
                                ${priceChange1h ? priceChange1h.toFixed(2) + '%' : 'N/A'}
                            </span>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                            <span>24h:</span>
                            <span class="${priceChange24h >= 0 ? 'price-up' : 'price-down'}">
                                ${priceChange24h ? priceChange24h.toFixed(2) + '%' : 'N/A'}
                            </span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>7d:</span>
                            <span class="${priceChange7d >= 0 ? 'price-up' : 'price-down'}">
                                ${priceChange7d ? priceChange7d.toFixed(2) + '%' : 'N/A'}
                            </span>
                        </div>
                    </div>
                    <div class="market-info">
                        <div class="d-flex justify-content-between mb-1">
                            <span>Market Cap:</span>
                            <span>$${(coin.market_cap / 1e6).toFixed(2)}M</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Vol 24h:</span>
                            <span>$${(coin.total_volume / 1e6).toFixed(2)}M</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        memeContainer.appendChild(card);
    });
}

// Add function to fetch memecoins
async function fetchMemeCoins() {
    try {
        const data = await ApiService.fetchMemeCoins();
        displayMemeCoins(data);
    } catch (error) {
        console.error('Error fetching memecoins:', error);
        document.getElementById('memecoin-data').innerHTML = 
            '<div class="col-12"><div class="alert alert-danger">Error loading memecoin data</div></div>';
    }
}

// Initialize data
fetchCryptoData();
fetchAndDisplayNews();

// Add this function to display news
async function displayNews(newsItems) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    newsItems.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = 'col-md-4 mb-4';
        newsCard.innerHTML = `
            <div class="card news-item h-100">
                <div class="card-body">
                    <h5 class="card-title">${news.title}</h5>
                    <p class="card-text">${news.description}</p>
                    <a href="${news.url}" target="_blank" class="btn btn-primary">Read More</a>
                </div>
            </div>
        `;
        newsContainer.appendChild(newsCard);
    });
}

// Add this function to fetch and display news
async function fetchAndDisplayNews() {
    try {
        const newsItems = await ApiService.fetchNews();
        displayNews(newsItems);
    } catch (error) {
        console.error('Error displaying news:', error);
        document.getElementById('news-container').innerHTML = 
            '<div class="col-12"><div class="alert alert-danger">Error loading news</div></div>';
    }
}

// Initialize news
fetchAndDisplayNews();

// Refresh news every 5 minutes
setInterval(fetchAndDisplayNews, 300000);

// Refresh crypto data every 60 seconds
setInterval(fetchCryptoData, 60000);

// cryptoData.js

// ... existing code ...

async function fetchCryptoData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch cryptocurrency data:", error);
        // Update UI to show a friendly error message
    }
}

// ... existing code ...
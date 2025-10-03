// A service to fetch Core Web Vitals and other performance metrics from Google PageSpeed Insights API.
// It uses the PAGESPEED_API_KEY from the environment variables.
// If the key is not available, it falls back to mock data.

const MOCK_PAGESPEED_DATA = {
    "loadingExperience": {
        "metrics": {
            "CUMULATIVE_LAYOUT_SHIFT_SCORE": { "percentile": 90, "category": "GOOD" },
            "FIRST_INPUT_DELAY_MS": { "percentile": 95, "category": "GOOD" },
            "LARGEST_CONTENTFUL_PAINT_MS": { "percentile": 85, "category": "GOOD" }
        }
    },
    "lighthouseResult": {
        "categories": {
            "performance": { "score": 0.92 },
            "accessibility": { "score": 0.98 },
            "best-practices": { "score": 1.0 },
            "seo": { "score": 0.95 },
            "pwa": { "score": 0.7 }
        }
    }
};

export const fetchPageSpeedData = async (url: string): Promise<any> => {
    const apiKey = process.env.PAGESPEED_API_KEY;

    if (!apiKey) {
        console.warn("PAGESPEED_API_KEY environment variable is not set. Falling back to mock data. For real-time PageSpeed analysis, please configure the key.");
        return Promise.resolve(MOCK_PAGESPEED_DATA);
    }
    
    // The PageSpeed Insights API endpoint.
    const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&category=PWA`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: { message: 'Could not parse error response.' } }));
            console.error('PageSpeed API Error:', errorData);
            throw new Error(`PageSpeed API request failed with status ${response.status}: ${errorData.error.message || 'Unknown error'}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch data from PageSpeed API:", error);
        throw new Error("An error occurred while fetching performance data from Google PageSpeed Insights.");
    }
};
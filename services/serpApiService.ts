// A service to fetch Search Engine Results Page (SERP) data.
// It uses the SERPAPI_KEY from the environment variables.
// If the key is not available, it falls back to mock data.

const MOCK_SERP_DATA = {
    "search_information": {
      "query_displayed": "top enterprise IT consulting transformation companies in New York"
    },
    "organic_results": [
      {
        "position": 1,
        "title": "Top IT Consulting Companies in New York - Jan 2024 | The Manifest",
        "link": "https://themanifest.com/ny/it-services/consulting/companies",
        "snippet": "List of the top New York City IT consulting companies. Read reviews, compare services, and view portfolios."
      },
      {
          "position": 2,
          "title": "Accenture | Let there be change",
          "link": "https://www.accenture.com/us-en",
          "snippet": "Accenture is a global professional services company with leading capabilities in digital, cloud and security. Combining unmatched experience..."
      },
      {
          "position": 3,
          "title": "IT Consulting Services & Solutions | CGI",
          "link": "https://www.cgi.com/en/us/it-consulting",
          "snippet": "CGI's IT consulting services help you build and implement a winning IT strategy. Partner with us to identify and implement the right solutions for your business goals."
      },
      {
          "position": 4,
          "title": "Deloitte | Audit, Consulting, Financial Advisory, Risk Management",
          "link": "https://www2.deloitte.com/us/en.html",
          "snippet": "Deloitte provides industry-leading audit, consulting, tax, and advisory services to many of the world's most admired brands, including nearly 90% of the Fortune 500."
      },
      {
          "position": 5,
          "title": "IT Consulting Firm & Managed Services Provider (MSP) | BCG",
          "link": "https://www.bcg.com/capabilities/technology-digital/it-consulting-services",
          "snippet": "BCG's IT consulting services help organizations build the IT infrastructure and capabilities to support their business strategy."
      }
    ]
  };
  
  export const fetchSerpData = async (query: string, location: string): Promise<any> => {
      const apiKey = process.env.SERPAPI_KEY;
  
      if (!apiKey) {
          console.warn("SERPAPI_KEY environment variable is not set. Falling back to mock data. For real-time competitor analysis, please configure a key from SerpApi.com.");
          return Promise.resolve(MOCK_SERP_DATA);
      }
      
      const endpoint = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&api_key=${apiKey}&engine=google`;
  
      try {
          const response = await fetch(endpoint);
          if (!response.ok) {
              const errorData = await response.json().catch(() => ({ error: 'Could not parse error response.' }));
              console.error('SERP API Error:', errorData);
              throw new Error(`SERP API request failed with status ${response.status}: ${errorData.error || 'Unknown error'}`);
          }
          return await response.json();
      } catch (error) {
          console.error("Failed to fetch data from SERP API:", error);
          throw new Error("An error occurred while fetching competitor data from the SERP API.");
      }
  };
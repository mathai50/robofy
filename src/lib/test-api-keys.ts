// Test utility to verify API keys are loaded correctly
export function testAPIKeys() {
  const results = {
    gemini: {
      available: !!process.env.GEMINI_API_KEY || !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      source: process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'NEXT_PUBLIC_GEMINI_API_KEY' : 'none'
    },
    openai: {
      available: !!process.env.OPENAI_API_KEY,
      source: process.env.OPENAI_API_KEY ? 'OPENAI_API_KEY' : 'none'
    }
  };

  console.log('API Key Test Results:', results);

  return {
    allKeysAvailable: results.gemini.available && results.openai.available,
    geminiAvailable: results.gemini.available,
    openaiAvailable: results.openai.available,
    details: results
  };
}

// Call this in development to verify setup
if (typeof window === 'undefined') {
  // Server-side only
  console.log('🔑 API Key Configuration Test');
  testAPIKeys();
}
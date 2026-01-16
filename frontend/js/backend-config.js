// Arex Platform Production Configuration
// CORRECTED VERSION - Verified URLs
// Updated: $(date)

const BACKEND_CONFIG = {
  // VERIFIED WORKING CLOUD FUNCTIONS
  UNIFIED_API_URL: 'https://us-central1-arex-ltd-42154393-a701b-fce9f.cloudfunctions.net/unifiedApi',
  PAYMENT_API_URL: 'https://us-central1-arex-ltd-42154393-a701b-fce9f.cloudfunctions.net/arexPaymentApi',
  FINANCIAL_API_URL: 'https://us-central1-arex-ltd-42154393-a701b-fce9f.cloudfunctions.net/financialApi',
  LOGIN_API_URL: 'https://us-central1-arex-ltd-42154393-a701b-fce9f.cloudfunctions.net/login',
  
  // API Endpoints structure
  ENDPOINTS: {
    // Dashboard endpoints
    dashboard: {
      marketControl: '/dashboard/market-control',
      subscription: '/dashboard/subscription',
      strategicGrowth: '/dashboard/strategic-growth',
      health: '/health'
    },
    
    // Payment endpoints
    payment: {
      stkPush: '/stkpush',
      status: '/status',
      callback: '/callback',
      health: '/health'
    },
    
    // Authentication endpoints
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      validate: '/auth/validate',
      health: '/health'
    },
    
    // Financial endpoints
    financial: {
      commissions: '/commissions',
      withdrawals: '/withdrawals',
      health: '/health'
    }
  },
  
  // Simple URL builder - less complex, more reliable
  getUrl: function(apiName, endpoint) {
    const baseUrl = this[apiName];
    if (!baseUrl) {
      console.warn(`API ${apiName} not configured`);
      return null;
    }
    
    // Remove leading slash if endpoint has it
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    return baseUrl + cleanEndpoint;
  },
  
  // Quick test function
  testApi: async function(apiName) {
    const url = this.getUrl(apiName, '/health');
    if (!url) return 'NOT CONFIGURED';
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        return 'HEALTHY';
      } else {
        return `ERROR: HTTP ${response.status}`;
      }
    } catch (error) {
      return `ERROR: ${error.message}`;
    }
  }
};

// Export for use - Keep original structure
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BACKEND_CONFIG;
} else {
  window.AREX_CONFIG = BACKEND_CONFIG;
}

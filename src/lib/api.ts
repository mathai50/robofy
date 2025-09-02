export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  industry?: string;
}

export const createLead = async (leadData: LeadData): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Lead created successfully',
      data: data,
    };
  } catch (error) {
    console.error('Error creating lead:', error);
    return {
      success: false,
      message: 'Failed to create lead',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Additional API functions can be added here as needed
export const api = {
  createLead,
};
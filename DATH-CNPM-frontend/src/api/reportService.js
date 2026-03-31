import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const createReport = async (reportData) => {
    try {
        const token = localStorage.getItem('token');
        
        const response = await axios.post(
            `${API_URL}/api/reports`, 
            reportData,
            {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
};
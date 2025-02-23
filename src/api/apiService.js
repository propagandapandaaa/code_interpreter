// src/api/apiService.js
import axios from 'axios';

/**
 * Generic function to make a POST request to any API endpoint.
 * @param {string} url - The API endpoint to call.
 * @param {object} data - The data to send in the request body.
 * @returns {Promise<object>} - The response data.
 */
export const postRequest = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return { output: response.data.output, error: null };
    } catch (err) {
        return { output: null, error: err.response?.data?.detail || 'An error occurred' };
    }
};
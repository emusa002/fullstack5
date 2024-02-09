
import axiosInstance from "./api/axios";


export async function getContacts(query) {
  try {
    // Construct the query parameters string based on the provided query
    const queryParams = query ? `?search=${encodeURIComponent(query)}` : '';
    const response = await axiosInstance.get(`contacts${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    // Handle the error appropriately
    throw error;
  }
}


export async function createContact() {
  try {
    // Construct the query parameters string based on the provided query
    const response = await axiosInstance.post('contacts');
    return response.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    // Handle the error appropriately
    throw error;
  }
}

export async function getContact(id) {
  try {
    // Construct the query parameters string based on the provided query
    const response = await axiosInstance.get(`contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    // Handle the error appropriately
    throw error;
  }
}

export async function updateContact(id, updates) {
  try {
    // Construct the query parameters string based on the provided query
    const response = await axiosInstance.patch(`contacts/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    // Handle the error appropriately
    throw error;
  }
}

export async function deleteContact(id) {
  try {
    // Construct the query parameters string based on the provided query
    const response = await axiosInstance.delete(`contacts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    // Handle the error appropriately
    throw error;
  }
}
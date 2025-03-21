import axios from 'axios';

// Get user-specific products
export const getUserProducts = async (token) => {
  try {
    const response = await axios.get('API_URL/products/user-products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user products:', error);
    throw error;
  }
};

// Add a new product
export const addProduct = async (productData, token) => {
  try {
    const response = await axios.post('API_URL/products', productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Edit a product by ID
export const editProduct = async (productId, updatedData, token) => {
  try {
    const response = await axios.put(`API_URL/products/${productId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error editing product:', error);
    throw error;
  }
};

// Delete a product by ID
export const deleteProduct = async (productId, token) => {
  try {
    const response = await axios.delete(`API_URL/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

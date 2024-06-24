using Product_Catalog_Frontend.Shared.Models;
using System.Net.Http.Json;
using System.Text.Json;

namespace Product_Catalog_Frontend.Services
{
    public class ProductAPIService
    {
        private readonly HttpClient _httpClient;
        public ProductAPIService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<(List<ProductDTO>, string)> GetAllProducts()
        {
            try
            {
                var response = await _httpClient.GetAsync("/product");

                if (response.IsSuccessStatusCode)
                {
                    var products = await response.Content.ReadFromJsonAsync<List<ProductDTO>>();
                    return (products ?? new List<ProductDTO>(), null);
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return (new List<ProductDTO>(), errorContent);
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., log them)
                Console.WriteLine($"Error fetching products: {ex.Message}");
                return (new List<ProductDTO>(), $"Exception: {ex.Message}");
            }
        }

        public async Task<(ProductDTO, string)> AddProduct(ProductDTO product)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/product/addProduct", product);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    using (JsonDocument doc = JsonDocument.Parse(jsonResponse))
                    {
                        //extracting the productDTO and message
                        JsonElement root = doc.RootElement;
                        string message = root.GetProperty("message").GetString();
                        ProductDTO newProduct = JsonSerializer.Deserialize<ProductDTO>(root.GetProperty("product").GetRawText());
                        return (newProduct, message);
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return (null, errorContent);
                }
            }
            catch (Exception ex)
            {
                return (null, $"Exception: {ex.Message}");
            }
        }

        public async Task<(List<ProductDTO>, string)> GetProductsByName(string name)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/product/getProductByName/{name}");

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var products = JsonSerializer.Deserialize<List<ProductDTO>>(jsonResponse);
                    return (products, null);
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return (null, errorContent);
                }
            }
            catch (Exception ex)
            {
                return (null, $"Exception: {ex.Message}");
            }
        }

        public async Task<(bool, string)> DeleteProduct(string productId)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"/product/deleteProduct/{productId}");
                if (response.IsSuccessStatusCode)
                {
                    return (true, null);
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return (false, errorContent);
                }
            }
            catch (Exception ex)
            {
                return (false, $"Exception: {ex.Message}");
            }
        }

        public async Task<(ProductDTO, string)> GetProductById(string productId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/product/{productId}");

                if (response.IsSuccessStatusCode)
                {
                    var product = await response.Content.ReadFromJsonAsync<ProductDTO>();
                    return (product, null);
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return (null, errorContent);
                }
            }
            catch (Exception ex)
            {
                return (null, $"Exception: {ex.Message}");
            }
        }

        public async Task<(ProductDTO, string)> UpdateProduct(ProductDTO product)
        {
            try
            {
                var response = await _httpClient.PutAsJsonAsync("/product/updateProduct", product);

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    using (JsonDocument doc = JsonDocument.Parse(jsonResponse))
                    {
                        JsonElement root = doc.RootElement;
                        string message = root.GetProperty("message").GetString();
                        ProductDTO updatedProduct = JsonSerializer.Deserialize<ProductDTO>(root.GetProperty("product").GetRawText());
                        return (updatedProduct, message);
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return (null, errorContent);
                }
            }
            catch (Exception ex)
            {
                return (null, $"Exception: {ex.Message}");
            }
        }

    }
}

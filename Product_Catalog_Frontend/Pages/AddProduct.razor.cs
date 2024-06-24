using Microsoft.AspNetCore.Components;
using Product_Catalog_Frontend.Services;
using Product_Catalog_Frontend.Shared.Models;
using System.Threading.Tasks;

namespace Product_Catalog_Frontend.Pages
{
    public partial class AddProduct
    {
        [Parameter]
        public string? productId { get; set; }

        [Inject]
        private ProductAPIService _productApiService { get; set; }

        [Inject]
        private NavigationManager _navigationManager { get; set; }
        [Inject]
        private ProductDataHolderService _productDataHolderService { get; set; }

        public ProductDTO product { get; set; } = new ProductDTO();

        public string errorMessage { get; set; }
        public string Title { get; set; } = "Add Product";

        protected override async Task OnInitializedAsync()
        {
            if (!string.IsNullOrEmpty(productId))//f the id is passed via routing parameter then load the prododuct from db
            {
                Title = "Edit Product";
                var result = await _productApiService.GetProductById(productId);
                if (result.Item1 != null)
                {
                    product = result.Item1;
                }
                else
                {
                    errorMessage = result.Item2;
                }
            }
            else
            {
                // Set the default category to the first enum value
                product.Category = Enum.GetValues(typeof(Category)).Cast<Category>().First().ToString();
            }
        }

        private async Task HandleValidSubmit()
        {
            try
            {
                if (String.IsNullOrEmpty(product.Description))
                {
                    //This needs to be set to "None" becasue empty description causes a bug
                    //Eventhough this is optional at the backend
                    product.Description = "None";
                }
                if (!string.IsNullOrEmpty(productId))
                {
                    // In case when product is Updated/Edited
                    var (updatedProduct, message) = await _productApiService.UpdateProduct(product);
                    if (updatedProduct == null)
                    {
                        errorMessage = message;
                    }
                    else
                    {
                        // Replace the updated product in the list
                        var index = (_productDataHolderService.Products).FindIndex(p => p.Id == updatedProduct.Id);
                        if (index != -1)
                        {
                            _productDataHolderService.Products[index] = updatedProduct;
                        }
                        else
                        {
                            _productDataHolderService.Products.Add(updatedProduct); // Add if not found (unlikely in edit mode)
                        }
                        _navigationManager.NavigateTo("/");
                    }
                }
                else
                {
                    // In case when product is Added
                    var (newProduct, message) = await _productApiService.AddProduct(product);
                    if (newProduct == null)
                    {
                        errorMessage = message;
                    }
                    else
                    {
                        _productDataHolderService.Products.Add(newProduct);
                        _navigationManager.NavigateTo("/");
                    }
                }
            }
            catch (Exception ex)
            {
                errorMessage = $"An error occurred: {ex.Message}";
            }
        }
        private void Cancel()
        {
            _navigationManager.NavigateTo("/");
        }
    }
}

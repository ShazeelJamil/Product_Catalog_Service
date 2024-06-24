using Microsoft.AspNetCore.Components;
using Product_Catalog_Frontend.Services;
using Product_Catalog_Frontend.Shared.Models;

namespace Product_Catalog_Frontend.Pages
{
    public partial class Home
    {
        [Inject]
        private ProductAPIService _productApiService { get; set; }
        [Inject]
        private NavigationManager _navigationManager { get; set; }
        [Inject]
        private ProductDataHolderService _productDataHolderService { get; set; }
        public bool isSearchStarted { get; set; } = false;
        public string errorMessage { get; set; }
        public string queryString { get; set; }

        public List<ProductDTO> searchResults = new List<ProductDTO>();

        protected override async Task<Task> OnInitializedAsync()
        {
            //Load All The products from db on render
            var result = await _productApiService.GetAllProducts();
            _productDataHolderService.Products = result.Item1;
            errorMessage = result.Item2;
            return base.OnInitializedAsync();
        }

        private async Task deleteProduct(string productId)
        {
            var result = await _productApiService.DeleteProduct(productId);
            if (result.Item1)
            {
                if (isSearchStarted && searchResults.Count > 0)//If the Delete Operation is on the Search List
                {
                    searchResults.RemoveAll(p => p.Id == productId);
                }
                //remove from visible list
                _productDataHolderService.Products.RemoveAll(p => p.Id == productId);
                StateHasChanged();

            }
            else
            {
                errorMessage = result.Item2;
            }
        }
        public void editProduct(string id)
        {
            //redirects to edit mode and product loaded by id from by
            _navigationManager.NavigateTo($"/addProduct/{id}");
        }

        private async Task SearchProducts()
        {
            isSearchStarted = true;
            var (result, error) = await _productApiService.GetProductsByName(queryString);
            if (error != null)
            {
                errorMessage = error;
            }
            else
            {
                searchResults = result;
                errorMessage = null;
            }
        }

        private void ClearSearch()
        {
            searchResults.Clear();
            isSearchStarted = false;
        }
    }
}
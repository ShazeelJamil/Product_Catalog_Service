using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Product_Catalog_Frontend.Shared.Models
{

    public enum Category
    {
        Electronics,
        Clothes,
        Furniture,
        Toys,
        Books,
        Other
    }


    public class ProductDTO
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = "";

        [JsonPropertyName("name")]
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; } = "None";

        [JsonPropertyName("category")]
        [Required(ErrorMessage = "Category is required")]
        public string Category { get; set; }

        [JsonPropertyName("inStocks")]
        [Required(ErrorMessage = "In Stocks is required")]
        [Range(1, int.MaxValue, ErrorMessage = "In Stocks must be atleast 1")]
        public int InStocks { get; set; }

        [JsonPropertyName("price")]
        [Required(ErrorMessage = "Price is required")]
        [Range(1, double.MaxValue, ErrorMessage = "Price must be atleast 1")]
        public int Price { get; set; }
    }

}

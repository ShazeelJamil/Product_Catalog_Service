using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Product_Catalog_Frontend;
using Product_Catalog_Frontend.Services;
using Product_Catalog_Frontend.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("http://localhost:3001") });

builder.Services.AddScoped<ProductAPIService>();

builder.Services.AddSingleton<ProductDataHolderService>();

await builder.Build().RunAsync();

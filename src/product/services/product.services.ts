import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductDTO } from '../DTOs';

const products: ProductDTO[] = [
    new ProductDTO({ name: 'Product1', description: 'Description1', category: 'Category1', inStocks: 10, price: 100 }),
    new ProductDTO({ name: 'Product2 Special', description: 'Description2', category: 'Category2', inStocks: 20, price: 200 }),
    new ProductDTO({ name: 'Special Product3', description: 'Description3', category: 'Category3', inStocks: 30, price: 300 }),
    new ProductDTO({ name: 'Another Special Product4', description: 'Description4', category: 'Category4', inStocks: 40, price: 400 }),
    new ProductDTO({ name: 'Product5', description: 'Description5', category: 'Category5', inStocks: 50, price: 500 }),
];


@Injectable()
export class ProductService {

    addProduct(productData: Partial<ProductDTO>): ProductDTO {
        const newProduct = new ProductDTO(productData);
        products.push(newProduct);
        return newProduct;
    }

    getAllProducts(): ProductDTO[] {
        return products;
    }

    getProductById(id: string): ProductDTO {
        const product = products.find(product => product.id === id);
        if (!product) {
            throw new NotFoundException(`Product not found`);
        }
        return product;
    }

    getProductByName(name: string): ProductDTO[] {
        const regex = new RegExp(`\\b${name}\\b`, 'i'); // Regex to match whole words, case-insensitive
        const filteredProducts = products.filter(product => regex.test(product.name));
        if (filteredProducts.length === 0) {
            throw new NotFoundException(`No products found containing the name "${name}"`);
        }
        return filteredProducts;
    }

    deleteProduct(id: string): boolean {
        const index = products.findIndex(product => product.id === id);
        if (index === -1) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        products.splice(index, 1);
        return true;
    }

    updateProduct(updatedProduct: ProductDTO): ProductDTO {
        const existingProduct = this.getProductById(updatedProduct.id);
        Object.assign(existingProduct, updatedProduct);
        return existingProduct;
    }
}

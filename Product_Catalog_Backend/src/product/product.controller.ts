import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, BadRequestException, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ProductDTO } from "./DTOs";
import { ProductService } from "./services/product.services";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

@ApiTags('product')
@Controller('/product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved all products.' })
    @ApiResponse({ status: 500, description: 'Failed to fetch products.' })
    @Get('/')
    async getAllProducts() {
        try {
            const products = await this.productService.getAllProducts();
            return products;
        } catch (error) {
            throw new HttpException('Failed to fetch products', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Add a new product' })
    @ApiResponse({ status: 201, description: 'Product successfully added.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    @ApiResponse({ status: 500, description: 'Failed to add product.' })
    @ApiBody({ type: ProductDTO })
    @Post('/addProduct')
    @UsePipes(ValidationPipe)
    async addProduct(@Body() productData: ProductDTO) {
        try {
            const newProduct = await this.productService.addProduct(productData);
            return { message: "Product Added", product: newProduct };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Get products by name' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved products.' })
    @ApiResponse({ status: 404, description: 'No products found.' })
    @ApiResponse({ status: 500, description: 'Failed to fetch products.' })
    @ApiParam({ name: 'name', required: true, description: 'Product name' })
    @Get('/getProductByName/:name')
    getProductByName(@Param('name') name: string) {
        try {
            const product = this.productService.getProductByName(name);
            return product;
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved product.' })
    @ApiResponse({ status: 400, description: 'Invalid Product ID.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    @ApiResponse({ status: 500, description: 'Failed to fetch product.' })
    @ApiParam({ name: 'id', required: true, description: 'Product ID' })
    @Get('/:id')
    getProductById(@Param('id') id: string) {
        if (!uuidValidate(id) || uuidVersion(id) !== 4) {
            throw new BadRequestException('Invalid UUID');
        }
        try {
            const product = this.productService.getProductById(id);
            return product;
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Update a product' })
    @ApiResponse({ status: 200, description: 'Product successfully updated.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    @ApiResponse({ status: 500, description: 'Failed to update product.' })
    @ApiBody({ type: ProductDTO })
    @Put('/updateProduct')
    @UsePipes(ValidationPipe)
    async updateProduct(@Body() product: ProductDTO) {
        if (!product || !product.id) {
            throw new BadRequestException('Product ID is required');
        }
        if (!uuidValidate(product.id) || uuidVersion(product.id) !== 4) {
            throw new BadRequestException('Invalid UUID');
        }
        
        try {
            const updatedProduct = await this.productService.updateProduct(product);
            return { message: 'Product Updated', product: updatedProduct };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Delete a product' })
    @ApiResponse({ status: 200, description: 'Product successfully deleted.' })
    @ApiResponse({ status: 400, description: 'Invalid Product ID.' })
    @ApiResponse({ status: 404, description: 'Product not found.' })
    @ApiResponse({ status: 500, description: 'Failed to delete product.' })
    @ApiParam({ name: 'id', required: true, description: 'Product ID' })
    @Delete('/deleteProduct/:id')
    async deleteProductById(@Param('id') id: string) {
        if (!uuidValidate(id) || uuidVersion(id) !== 4) {
            throw new BadRequestException('Invalid UUID');
        }

        try {
            await this.productService.deleteProduct(id);
            return { message: 'Product Deleted' };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

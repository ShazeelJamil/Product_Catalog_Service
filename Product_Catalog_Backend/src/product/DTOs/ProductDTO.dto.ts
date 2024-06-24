import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, isNotEmpty } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { ProductCategory } from './product-catagories';

export enum Category {
    Electronics = 'Electronics',
    Clothes = 'Clothes',
    Furniture = 'Furniture',
    Toys = 'Toys',
    Books = 'Books',
    Other = 'Other'
}

export class ProductDTO {
    @IsString()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsIn(Object.keys(ProductCategory))
    @IsNotEmpty()
    category: string;

    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    inStocks: number;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    price: number;

    constructor(partial: Partial<ProductDTO> = {}) {
        this.id = uuidv4();
        this.name = partial.name || '';
        this.description = partial.description || 'None';
        this.category = partial.category || Category.Other;
        this.inStocks = partial.inStocks || 0;
        this.price = partial.price || 0;
    }
}

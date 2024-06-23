import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ProductCategory } from "../DTOs/product-catagories";
import { Document } from "mongoose";

@Schema()
export class ProductSchema {
    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({
        required: true,
        enum: Object.keys(ProductCategory),
        default: ProductCategory.Other,
    })
    category: string;

    @Prop({ required: true })
    inStocks: number;

    @Prop({ required: true })
    price: number;

}

export const PRODUCT_SCHEMA = SchemaFactory.createForClass(ProductSchema)

export const SCHEMA_NAME = ProductSchema.name;

export type PRODUCT_DOCUMENT = ProductSchema & Document;

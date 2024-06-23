import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './services/product.services';
import { JoiSchemaProvider } from './schema-validation/joi-providers';
import { MongooseModule } from '@nestjs/mongoose';
import { SCHEMA_NAME, PRODUCT_SCHEMA } from './product-schema/product.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: SCHEMA_NAME, schema: PRODUCT_SCHEMA }])],
    controllers: [ProductController],
    providers: [ProductService, JoiSchemaProvider],
    exports: [ProductService]
})
export class ProductModule { }

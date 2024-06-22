import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './services/product.services';
// import { ParseAddProductPipe } from './pipes/joi-add-product.pipe';
import { JoiSchemaProvider } from './schema-validation/joi-providers';

@Module({
    controllers: [ProductController],
    providers: [ProductService, JoiSchemaProvider],
    exports: [ProductService]
})
export class ProductModule {}

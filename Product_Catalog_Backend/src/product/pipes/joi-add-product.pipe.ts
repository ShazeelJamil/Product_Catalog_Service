// import { BadRequestException, Injectable, PipeTransform, Inject } from '@nestjs/common';
// import { ObjectSchema } from 'joi';

// @Injectable()
// export class ParseAddProductPipe implements PipeTransform {

//     constructor(@Inject('AddProductSchema') private schema: ObjectSchema) {}

//     transform(value: Record<string, any>) {
//         const { error } = this.schema.validate(value);
//         if (error) {
//             throw new BadRequestException(error.message);
//         }
//         return value;
//     }
// }

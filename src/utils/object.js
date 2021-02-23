import { classToClass, plainToClass } from 'class-transformer';

export class ClassTransformer {
    static map(ctor, data) {
        return plainToClass(ctor, data);
    }

    static clone(data) {
        return classToClass(data);
    }
}

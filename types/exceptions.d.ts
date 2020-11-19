export declare class BadRequestException {
    message: string | string[];
    original?: any;
    constructor(message: string | string[], original?: any);
}
export declare class ForbiddenException {
    message?: string;
    original?: any;
    constructor(message?: string, original?: any);
}
export declare class UnauthorizedException {
    message?: string;
    original?: any;
    constructor(message?: string, original?: any);
}
export declare class NotFoundException {
    original?: any;
    constructor(original?: any);
}

export class BadRequestException {
    constructor(message, original) {
        this.message = message;
        this.original = original;
    }
}

export class ForbiddenException {
    constructor(original) {
        this.original = original;
    }
}

export class UnauthorizedException {
    constructor(original) {
        this.original = original;
    }
}

export class NotFoundException {
    constructor(original) {
        this.original = original;
    }
}


import swal from "sweetalert";

export class Logger {
    /* @ngInject */
    constructor(translate, notify) {
        this.notify = notify;
        this.translate = translate;
    }

    alert(item) {
        swal(item);
    }

    close() {
        swal.close();
    }

    success(message) {
        this.notify.show(message || this.translate('Done'), { success: true });
    }

    info(message) {
        swal({
            title: this.translate('Info'),
            text: message,
            html: true,
            type: 'info',
            timer: 2000,
            confirmButtonText: this.translate('OK')
        });
    }

    warning(message) {
        swal({
            title: this.translate('Warning'),
            text: this.translate(message),
            html: true,
            type: 'warning',
            timer: 2000,
            confirmButtonText: this.translate('OK')
        });
    }

    error(message) {
        swal({
            title: this.translate('Error'),
            text: this.translate(message),
            html: true,
            type: 'error',
            timer: 4000,
            confirmButtonText: this.translate('OK')
        });
    }
}




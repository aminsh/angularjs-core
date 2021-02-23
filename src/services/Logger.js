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
        this.notify.show(message || this.translate('done'), { success: true });
    }

    info(message) {
        swal({
            title: this.translate('info'),
            text: message,
            html: true,
            type: 'info',
            timer: 2000,
            confirmButtonText: this.translate('ok')
        });
    }

    warning(message) {
        swal({
            title: this.translate('warning'),
            text: this.translate(message),
            html: true,
            type: 'warning',
            timer: 2000,
            confirmButtonText: this.translate('ok')
        });
    }

    error(message) {
        swal({
            title: this.translate('error'),
            text: this.translate(message),
            html: true,
            type: 'error',
            timer: 4000,
            confirmButtonText: this.translate('ok')
        });
    }
}




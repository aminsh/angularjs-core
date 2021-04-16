import swal from "sweetalert";

export class DsLogger {
    /* @ngInject */
    constructor(dsTranslate, dsNotify) {
        this.dsNotify = dsNotify;
        this.dsTranslate = dsTranslate;
    }

    alert(item) {
        swal(item);
    }

    close() {
        swal.close();
    }

    success(message) {
        this.dsNotify.show(message || this.dsTranslate('done'), { success: true });
    }

    info(message) {
        swal({
            title: this.dsTranslate('info'),
            text: message,
            html: true,
            type: 'info',
            timer: 2000,
            confirmButtonText: this.dsTranslate('ok')
        });
    }

    warning(message) {
        swal({
            title: this.dsTranslate('warning'),
            text: this.dsTranslate(message),
            html: true,
            type: 'warning',
            timer: 2000,
            confirmButtonText: this.dsTranslate('ok')
        });
    }

    error(message) {
        swal({
            title: this.dsTranslate('error'),
            text: this.dsTranslate(message),
            html: true,
            type: 'error',
            timer: 4000,
            confirmButtonText: this.dsTranslate('ok')
        });
    }
}




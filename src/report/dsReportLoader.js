import { dateToWord, digitToWord } from "../utils";

export class DsReportLoader {
    /* @ngInject */
    constructor($window, $document, dsPromise, dsEnvironment, $timeout) {
        this.$window = $window;
        this.$document = $document;
        this.dsPromise = dsPromise;
        this.dsEnvironment = dsEnvironment;
        this.$timeout = $timeout;
    }

    load() {
        return this.dsPromise.create(resolve => {
            if (this.$window.hasOwnProperty('Stimulsoft'))
                return resolve();

            const scriptTag = this.$document[0].createElement("script");
            scriptTag.type = "text/javascript";
            $("head").append(scriptTag);
            const self = this;
            scriptTag.onload = function () {
                self.afterLoaded();
                self.$timeout(() => resolve(), 500);
            };
            scriptTag.src = "./stimulsoft.min.js";
        });
    }

    loadDesigner() {
        return this.dsPromise.create(resolve => {
            if (this.$window.Stimulsoft.Designer)
                return resolve();

            const scriptTag = document.createElement("script");
            scriptTag.type = "text/javascript";
            $("head").append(scriptTag);
            const self = this;
            scriptTag.onload = function () {
                resolve();
            };
            scriptTag.src = "stimulsoft.designer.min.js";
        })
    }

    afterLoaded() {
        const Stimulsoft = this.$window.Stimulsoft;
        Stimulsoft.Base.StiLicense.key =
            "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHl2AD0gPVknKsaW0un+3PuM6TTcPMUAWEURKXNso0e5OA2zP41Y3mMHx00/5mMCRJdbgrmN60rx+EZ64n0ea1iGJQOeCab+sYU1au6J4eCpysTOPGNR+cYTmchZMGT/2VlNK0vjRPnRb47g7XyNZjYYJKiumO7zkYizIM/tNE9ET3LnPqxUp/+syHv+mbcjlEr7detqNI3Fl+CF1H9DWK1jrk/hxztXOQBo9k8LJrYkZnBWGM/9VoALCS5aA8fyYLf5WECohlg7Qzhy+ZvVLpsYR9y/Kn4x9X/3h8iS+UnWpb1Qobfp/jpm+YWwRXDeHuF4NKdz2/HVg85q0cxqg05SdGbrWpZMzeJTHC/IEnnEVpLbBSAJTJENvpx73KbTHlYT1mmLt3S6XtFCs4J3idwUEiHbu/R7vwzJuzan01KlV+wD6XoIxgkdXrmnFBdgEsJtlDQHJ0qKmzTn4cQU9kfW+gAYuz6JawvaDvmT+uG8ijvcTBCj4Xx734Cjkik/v5k="
        if (this.dsEnvironment.ENV !== 'development')
            Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile('fa.xml', true);

        const fonts = [
            { "fileName": "BBadr.ttf", "name": "BBadr" },
            { "fileName": "BBaran.ttf", "name": "BBaran" },
            { "fileName": "BBardiya.ttf", "name": "BBardiya" },
            { "fileName": "BCompset.ttf", "name": "BCompset" },
            { "fileName": "BElham.ttf", "name": "BElham" },
            { "fileName": "BKoodakBold.ttf", "name": "BKoodakBold" },
            { "fileName": "BLotus.ttf", "name": "BLotus" },
            { "fileName": "BTraffic.ttf", "name": "BTraffic" },
            { "fileName": "BZar.ttf", "name": "BZar" },
            { "fileName": "Yekan-2.ttf", "name": "Yekan-2" },
            { "fileName": "IRANSansMonoSpacedNumfix.ttf", "name": "iransans_mono" },
        ];


        fonts.forEach(f => Stimulsoft
            .Base
            .StiFontCollection
            .addOpentypeFontFile(f.fileName, f.name));

        Stimulsoft.Report.Dictionary.StiFunctions.addFunction(
            "devFunction",
            "digitToWord",
            "digitToWord", "", "",
            String, "", [ Number ], [ "Amount" ], [ "" ],
            digitToWord);
        Stimulsoft.Report.Dictionary.StiFunctions.addFunction(
            "devFunction",
            "dateToWord",
            "dateToWord", "", "",
            String, "", [ String ], [ "Date" ], [ "" ],
            dateToWord);

        Stimulsoft.Report.Dictionary.StiFunctions.addFunction(
            "devFunction",
            "stringToNumber",
            "stringToNumber", "", "",
            String, "", [ String ], [ "Value" ], [ "" ],
            date => {
                return date.split('').map(n => isNumeric(n) ? n : undefined).filter(n => n).join('');
            });

        Stimulsoft.Report.Dictionary.StiFunctions.addFunction(
            "devFunction",
            "toFloat",
            "toFloat", "", "",
            Number, "", [ String ], [ "Amount" ], [ "" ],
            num => parseFloat(num));
        Stimulsoft.Report.Export.StiPdfExportService.embeddedFonts = true;
    }
}

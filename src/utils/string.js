String.prototype.replaceAll = function (token, newToken, ignoreCase) {
    var _token;
    var str = this + "";
    var i = -1;

    if (typeof token === "string") {

        if (ignoreCase) {

            _token = token.toLowerCase();

            while ((
                i = str.toLowerCase().indexOf(
                    token, i >= 0 ? i + newToken.length : 0
                )) !== -1
                ) {
                str = str.substring(0, i) +
                    newToken +
                    str.substring(i + token.length);
            }

        } else {
            return this.split(token).join(newToken);
        }

    }
    return str;
};

export class Guid {
    static new() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static create(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static isEmpty(guid) {
        if (!guid)
            return true;
        if (guid == '')
            return true;

        if(guid == '00000000-0000-0000-0000-000000000000')
            return true;

        return false;
    }
}
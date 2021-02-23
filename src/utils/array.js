import Enumerable from 'linq';

Array.prototype.asEnumerable = function () {
    let enumerable = Enumerable.from(this);
    enumerable.remove = remove.bind(this);
    enumerable.removeAll = removeAll.bind(this);
    return enumerable;
};

Array.prototype.remove = function (item) {
    let i = this.indexOf(item);
    this.splice(i, 1);
}

Array.prototype.toArray = function () {
    return this;
}

function remove(item) {
    var i = this.indexOf(item);
    this.splice(i, 1);
}

function removeAll() {
    var self = this;

    while (self.length != 0) {
        self.shift();
    }

    return this;
}

(function () {

    function Column(model, id, name, data, valueFn, formatFn) {
        this.id = id;
        this.name = name;
        this.data = data;
        this.model = model;
        this.valueFn = valueFn || Column.DEFAULT_VALUE_FN;
        this.formatFn = formatFn || Column.DEFAULT_FORMAT_FN;
    }

    Column.prototype.id = null;
    Column.prototype.name = null;
    Column.prototype.data = null;
    Column.prototype.valueFn = null;
    Column.prototype.formatFn = null;

    Column.prototype.getAllData = function () {
        return this.model.allData.map(this.valueFn.bind(this));
    };

    Column.prototype.getMax = function () {
        return Math.max.apply(null, this.getAllData());
    };

    Column.prototype.isSorted = function () {
        return this.model.sortField == this.id;
    };

    Column.DEFAULT_VALUE_FN = function (row) {
        return row[this.id];
    };

    Column.DEFAULT_FORMAT_FN = function (value) {
        return value;
    };

    js.Column = Column;

})();
(function () {

    function TableModel(options) {
        this.setAllData(options || {});
    }

    TableModel.prototype = Object.create(Subscribable.prototype);

    TableModel.prototype.columns = null;
    TableModel.prototype.allData = null;
    TableModel.prototype.pageSize = null;
    TableModel.prototype.pageNumber = null;

    TableModel.prototype.setAllData = function (options) {
        this.columns = options.columns || [];
        this.allData = options.data || [];
        this.pageSize = options.pageSize || 10;
        this.pageNumber = options.pageNumber || 0;
        this.fire("allDataChanged");
    };

    TableModel.prototype.setPage = function (num) {
        this.pageNumber = num || 0;
        this.fire("allDataChanged");
    };

    TableModel.prototype.setFormatter = function (columnId, formatterFn) {
        var column = this.getColumn(columnId);
        column && (column.formatter = formatterFn);
        return this;
    };

    TableModel.prototype.getColumn = function (columnId) {
        return this.columns.filter(function (column) {
            return column.id == columnId;
        })[0];
    };

    TableModel.prototype.getColumns = function () {
        return this.columns;
    };

    TableModel.prototype.getVisibleRows = function () {
        return this.allData
            .filter(this.inPage.bind(this))
            .map(this.formatRow.bind(this));
    };

    TableModel.prototype.formatRow = function (row, index, array) {

        this.columns.forEach(function (column, index) {
            var formatter = column.formatter || TableModel.NO_FORMAT;
            row[index] = formatter(row[index], row);
        });

        return row;

    };

    TableModel.prototype.inPage = function (value, index, array) {
        var min = this.pageNumber * this.pageSize;
        return index >= min && index < min + this.pageSize;
    };

    TableModel.NO_FORMAT = function (val) {
        return val;
    };

    js.TableModel = TableModel;

})();
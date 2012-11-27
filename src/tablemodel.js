(function () {

    function TableModel(options) {
        this.sortDirection = TableModel.ASCENDING;
        this.setAllData(options || {});
    }

    TableModel.prototype = Object.create(Subscribable.prototype);

    TableModel.prototype.columns = null;
    TableModel.prototype.allData = null;
    TableModel.prototype.pageSize = null;
    TableModel.prototype.pageNumber = null;
    TableModel.prototype.sortField = null;
    TableModel.prototype.sortDirection = null;

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

    TableModel.prototype.setSorting = function (field, direction) {
        console.log("setSorting", arguments);
        this.sortDirection =
        direction || field == this.sortField ? this.sortDirection.opposite()
            : TableModel.ASCENDING;
        this.sortField = field;
        this.fire("allDataChanged");
        return this;
    };

    TableModel.prototype.setFormatter = function (columnId, formatterFn) {
        var column = this.getColumn(columnId);
        column && (column.formatter = formatterFn);
        return this;
    };

    TableModel.prototype.getColumn = function (columnId) {
        return this.columns.filter(function (column, index, columns) {
            column._index = index;
            return column.id == columnId;
        })[0];
    };

    TableModel.prototype.getColumns = function () {
        return this.columns;
    };

    TableModel.prototype.getVisibleRows = function () {

        var mappedData = this.allData.map(this.transformRow.bind(this));

        this.columns.forEach(function (column, index) {
            if (column.id == this.sortField) {
                mappedData = mappedData.sort(this.sortDirection.sorter(index));
                column.sort = {
                    direction: this.sortDirection.id
                }
            } else {
                column.sort = null;
            }
        }.bind(this));

        return mappedData.filter(this.inPage.bind(this))

    };

    TableModel.prototype.transformRow = function (row) {

        var formatted = this.columns.map(function (column) {
            var formatter = column.formatter || TableModel.NO_FORMAT;
            return formatter(row[column.id], row);
        });

        formatted.id = row.id;

        return formatted;

    };

    TableModel.prototype.inPage = function (value, index, array) {
        var min = this.pageNumber * this.pageSize;
        return index >= min && index < min + this.pageSize;
    };

    TableModel.NO_FORMAT = function (val) {
        return val;
    };

    TableModel.ASCENDING = {
        id: "ascending",
        sorter:function (fieldId) {
            return function (a, b) {
                return compare(a, b, fieldId);
            }
        },
        opposite:function () {
            return TableModel.DESCENDING;
        }
    };

    TableModel.DESCENDING = {
        id: "descending",
        sorter:function (index) {
            return function (a, b) {
                return -1 * compare(a, b, index);
            }
        },
        opposite:function () {
            return TableModel.ASCENDING;
        }
    };

    function compare(a, b, index) {
        if (a[index] < b[index]) {
            return -1;
        }
        if (a[index] > b[index]) {
            return 1;
        }
        return 0;
    }

    js.TableModel = TableModel;

})();
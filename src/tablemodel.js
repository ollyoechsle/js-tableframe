(function () {

    function TableModel(options) {
        this.setAllData(options || {});
    }

    TableModel.prototype = Object.create(Subscribable.prototype);

    TableModel.prototype.columns = null;
    TableModel.prototype.allData = null;
    TableModel.prototype.pageSize = null;
    TableModel.prototype.pageNumber = null;
    TableModel.prototype.sortField = null;
    TableModel.prototype.sortDirection = null;

    TableModel.prototype.createColumnInstance = function(columnJson) {
        return new js.Column(
            this,
            columnJson.id,
            columnJson.name,
            columnJson.data,
            columnJson.valueFn,
            columnJson.formatFn)
    };

    TableModel.prototype.setAllData = function (options) {
        this.columns = (options.columns || []).map(this.createColumnInstance.bind(this));
        this.allData = options.data || [];
        this.pageSize = options.pageSize || 10;
        this.pageNumber = options.pageNumber || 0;
        this.sortDirection = options.sortDirection || TableModel.ASCENDING;
        this.sortField = options.sortField || null;
        this.fire("allDataChanged");
    };

    TableModel.prototype.setPage = function (num) {
        this.pageNumber = num || 0;
        this.fire("allDataChanged");
    };

    TableModel.prototype.getPageCount = function() {
      return this.allData.length / this.pageSize;
    };

    TableModel.prototype.setSorting = function (field, direction) {
        this.sortDirection =
        direction || field == this.sortField ? this.sortDirection.toggle()
            : TableModel.ASCENDING;
        this.sortField = field;
        this.fire("allDataChanged");
        return this;
    };

    TableModel.prototype.setFormatter = function (columnId, formatFn) {
        var column = this.getColumn(columnId);
        column && (column.formatFn = formatFn);
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

        var values = this.allData.map(this.transformToValues.bind(this));
        var sorted = this.sort(values);
        var paged = sorted.filter(this.inPage.bind(this));
        var formatted = paged.map(this.transformToFormatted.bind(this));

        return formatted;

    };

    TableModel.prototype.sort = function(mappedData) {
        for (var i = 0, l = this.columns.length; i < l; i++) {
            var column = this.columns[i];
            if (column.isSorted()) {
                return mappedData.sort(this.sortDirection.sorter(i));
            }
        }
        return mappedData;
    };

    TableModel.prototype.transformToValues = function (row) {

        var values = this.columns.map(function (column) {
            return column.valueFn(row);
        });

        // TODO: I don't like this
        values.id = row.id;

        return values;

    };

    TableModel.prototype.transformToFormatted = function (row) {
        var formatted = this.columns.map(function (column, index) {
            return column.formatFn(row[index], row, column);
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
        id:"ascending",
        sorter:function (fieldId) {
            return function (a, b) {
                return compare(a, b, fieldId);
            }
        },
        toggle:function () {
            return TableModel.DESCENDING;
        }
    };

    TableModel.DESCENDING = {
        id:"descending",
        sorter:function (index) {
            return function (a, b) {
                return -1 * compare(a, b, index);
            }
        },
        toggle:function () {
            return TableModel.ASCENDING;
        }
    };

    function compare(a, b, index) {
        var av = a[index], bv = b[index];
        if (!isNaN(av) && !isNaN(bv)) {
            av = +av;
            bv = +bv;
        }
        if (typeof av === "string") {
            av = av.toLowerCase();
        }
        if (typeof bv === "string") {
            bv = bv.toLowerCase();
        }
        if (av < bv) {
            return -1;
        }
        if (av > bv) {
            return 1;
        }

        return 0;
    }

    js.TableModel = TableModel;

})();
/* JS Table Frame 1.0 */

/**@namespace*/
window.js = window.js || {};

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

    Column.prototype.getMin = function () {
        return Math.min.apply(null, this.getAllData());
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
(function () {

    function Table(container, model) {
        this.jContainer = jQuery(container);
        this.model = model;
        this.cellRenderers = [Table.ADD_COLUMN_CLASS];
        this.rowRenderers = [];
        this.initialise();
    }

    Table.prototype = Object.create(Subscribable.prototype);

    Table.prototype.jContainer = null;
    Table.prototype.cellRenderers = null;
    Table.prototype.rowRenderers = null;

    Table.prototype.withCellRenderer = function (rendererFn) {
        this.cellRenderers.push(rendererFn);
        return this;
    };

    Table.prototype.withRowRenderer = function (rendererFn) {
        this.rowRenderers.push(rendererFn);
        return this;
    };

    Table.prototype.initialise = function () {
        this.model.on("allDataChanged", this.draw, this);
        this.jContainer.delegate("tbody tr", "click.table", this.handleRowClick.bind(this));
        this.jContainer.delegate("thead th", "click.table", this.handleColumnClick.bind(this));
    };

    Table.prototype.draw = function () {
        var jTable = jQuery(Table.TABLE),
            rows = this.model.getVisibleRows(),
            columns = this.model.getColumns(),
            jHeaderRow = jTable.find("thead tr"),
            jTbody = jTable.find("tbody"),
            column, jTh,
            i, l;

        for (i = 0, l = columns.length; i < l; i++) {
            column = columns[i];

            jTh = jQuery("<th></th>")
                .attr("data-column", column.id)
                .html(column.name)
                .appendTo(jHeaderRow);

            if (column.isSorted()) {
                jTh.attr("data-sort", this.model.sortDirection.id);
            }

            this.renderCell(
                jTh,
                column,
                i,
                this.model
            )
        }

        for (i = 0, l = rows.length; i < l; i++) {
            jTbody.append(this.renderDataRow(rows[i], columns))
        }

        this.jContainer
            .empty()
            .append(jTable);

    };

    Table.prototype.handleRowClick = function (jEvent) {
        var jRow = jQuery(jEvent.currentTarget),
            id = jRow.data("id");
        this.fire("rowClicked", id);
    };

    Table.prototype.handleColumnClick = function (jEvent) {
        var jRow = jQuery(jEvent.currentTarget),
            columnId = jRow.data("column");
        this.model.setSorting(columnId);
        this.fire("columnClicked", columnId);
    };

    Table.prototype.destroy = function () {
        this.model.un(null, this);
        this.jContainer.undelegate(".table");
    };

    Table.prototype.renderDataRow = function (row, columns) {

        var jRow = jQuery("<tr></tr>").attr("data-id", row.id),
            rowLength = row.length,
            i;

        for (i = 0; i < rowLength; i++) {

            this.renderCell(
                jQuery("<td></td>")
                    .html(row[i])
                    .appendTo(jRow),
                columns[i],
                i,
                this.model,
                row
            );

        }

        this.rowRenderers.forEach(function (fn) {
            fn(jRow, row);
        });

        return jRow;

    };

    Table.prototype.renderCell = function (jCell, column, index, model, row) {
        this.cellRenderers.forEach(function (fn) {
            fn(jCell, column, index, model, row);
        })
    };

    Table.ADD_COLUMN_CLASS = function (jCell, column, index, model, row) {
        if (column.data && column.data.className) {
            jCell.addClass(column.data.className);
        }
    };

    Table.TABLE = '<table class="tf"><thead><tr></tr></tr></thead><tbody></tbody></table>';

    js.Table = Table;

})();
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
(function () {

    function TablePageControls(container, model) {
        this.jContainer = jQuery(container);
        this.model = model;
        this.initialise();
    }

    TablePageControls.prototype = Object.create(Subscribable.prototype);

    TablePageControls.prototype.jContainer = null;

    TablePageControls.prototype.initialise = function () {
        this.model.on("allDataChanged", this.draw, this);
        this.jContainer.delegate("[data-page-number].active", "click.TablePageControls", this.handlePageClicked.bind(this));
    };

    TablePageControls.prototype.draw = function () {

        var jPageList = jQuery("<ul class='tf page-controls'></ul>"),
            currentPageNumber = this.model.pageNumber,
            pageNumber,
            pageCount = this.model.getPageCount();

        if (pageCount > 1) {
            for (pageNumber = 0; pageNumber < pageCount; pageNumber++) {

                jQuery("<li></li>")
                    .text(pageNumber + 1)
                    .toggleClass("active", currentPageNumber != pageNumber)
                    .attr("data-page-number", pageNumber)
                    .appendTo(jPageList)

            }
        }

        this.jContainer.empty().append(jPageList);

    };

    TablePageControls.prototype.handlePageClicked = function (jEvent) {
        var jRow = jQuery(jEvent.currentTarget),
            pageNumber = jRow.data("pageNumber");
        this.model.setPage(pageNumber);
    };

    TablePageControls.prototype.destroy = function () {
        this.model.un(null, this);
        this.jContainer.undelegate(".TablePageControls");
    };

    js.TablePageControls = TablePageControls;

})();
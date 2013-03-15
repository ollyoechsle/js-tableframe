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
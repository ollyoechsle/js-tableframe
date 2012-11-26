(function () {

    function Table(container, model) {
        this.jContainer = jQuery(container);
        this.model = model;
        this.initialise();
    }

    Table.prototype = Object.create(Subscribable.prototype);

    Table.prototype.jContainer = null;

    Table.prototype.initialise = function () {
        this.model.on("allDataChanged", this.draw, this);
        this.jContainer.delegate("tbody tr", "click.table", this.handleRowClick.bind(this));
    };

    Table.prototype.draw = function () {
        var jTable = jQuery(Table.TABLE),
            rows = this.model.getVisibleRows(),
            columns = this.model.getColumns(),
            jHeaderRow = jTable.find("thead tr"),
            jTbody = jTable.find("tbody"),
            column,
            i, l;

        for (i = 0, l = columns.length; i < l; i++) {
            column = columns[i];
            this.renderCell(
                jQuery("<th></th>")
                    .attr("data-column", column.id)
                    .html(column.name)
                    .appendTo(jHeaderRow),
                column,
                i
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
                row
            );

        }

        return jRow;

    };

    Table.prototype.renderCell = function (jCell, column, index, row) {
        jCell.addClass(column.className);
    };

    Table.TABLE = '<table><thead><tr></tr></tr></thead><tbody></tbody></table>';

    js.Table = Table;

})();
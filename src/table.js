(function () {

    function Table(container, model) {
        this.jContainer = jQuery(container);
        this.model = model;
    }

    Table.prototype = Object.create(Subscribable.prototype);

    Table.prototype.jContainer = null;

    Table.prototype.draw = function () {
        var jTable = jQuery(Mustache.to_html(Table.TABLE)),
            jTr = jTable.find("thead tr"),
            columns = this.model.getColumns();

        jTr.html(
            columns
                .map(Mustache.to_html.bind(this, Table.TH))
                .join("")
        );

        this.jContainer
            .empty()
            .append(jTable);
    };

    Table.TH = '<th data-id="{{{id}}}">{{{name}}}</th>';
    Table.TABLE = '<table><thead><tr></tr></tr></thead><tbody></tbody></table>';

    OO.Table = Table;

})();
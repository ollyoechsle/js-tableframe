/* JS Table Frame 1.0 */

/**@namespace*/
window.OO = window.OO || {};
(function () {

    function Table(container, model) {
        this.jContainer = jQuery(container);
        this.model = model;
    }

    Table.prototype = Object.create(Subscribable.prototype);

    Table.prototype.jContainer = null;

    Table.prototype.draw = function () {
        var jTable = jQuery("<table></table>"),
            jThead = jQuery("<thead></thead>").appendTo(jTable),
            columns = this.model.getColumns();

        columns
            .map(Mustache.to_html.bind(this, Table.TH))
            .forEach(function (th) {
                         jThead.append(th)
                     });

        this.jContainer
            .empty()
            .append(jTable);
    };

    Table.TH = '<th data-id="{{{id}}}">{{{name}}}</th>';

    OO.Table = Table;

})();
(function () {

    function TableModel(options) {
        this.columns = options.columns || [];
    }

    TableModel.prototype = Object.create(Subscribable.prototype);

    TableModel.prototype.columns = null;

    TableModel.prototype.getColumns = function() {
        return this.columns;
    };

    OO.TableModel = TableModel;

})();
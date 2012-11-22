(function () {

    module("JS Table Frame", {
        setup:function () {
            jQuery("body").append("<div class='tableContainer'></div>");
        },
        teardown:function () {
            jQuery(".tableContainer").remove();
        }
    });

    test("Create Table", function () {
        var model = new OO.TableModel(
            {
                columns:[
                    {
                        id:"id",
                        name:"Identifier"
                    },
                    {
                        id:"name",
                        name:function () {
                            return "Name";
                        }
                    },
                    {
                        id:"age",
                        name: 123
                    },
                    {
                        id:"colour",
                        name: function() {
                            return "Red";
                        }
                    }
                ]}
        );

        var table = new OO.Table(".tableContainer", model);

        table.draw();

        thenThe(jQuery(".tableContainer table")).should(beThere);
        thenThe(jQuery(".tableContainer table tr th"))
            .should(haveSize(4))
            .should(haveText("Identifier", "Name", "123", "Red"));

        thenThe(jQuery(".tableContainer table tbody")).should(beThere);
        thenThe(jQuery(".tableContainer table tbody tr")).should(haveSize(0));

    })

})();
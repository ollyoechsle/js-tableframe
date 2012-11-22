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
                        id:"id"
                    },
                    {
                        id:"name"
                    },
                    {
                        id:"age"
                    },
                    {
                        id:"colour"
                    }
                ]}
        );

        var table = new OO.Table(".tableContainer", model);

        table.draw();

        thenThe(jQuery(".tableContainer table")).should(beThere);
        thenThe(jQuery(".tableContainer table th")).should(haveSize(4));

    })

})();
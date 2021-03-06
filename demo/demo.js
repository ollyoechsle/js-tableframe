jQuery(function () {
    var model = new js.TableModel(),
        view = new js.Table(".tableContainer", model);

    model.setAllData(
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
                    name:"Age",
                    valueFn:function (person) {
                        return person.died - person.born;
                    }
                }
            ],
            data:[
                {"id":"1", "name":"Michael Jackson", "born":1958, "died":2009},
                {"id":"2", "name":"Albert Einstein", "born":1879, "died":1955},
                {"id":"3", "name":"Abraham Lincoln", "born":1809, "died":1865},
                {"id":"4", "name":"William Shakespeare", "born":1564, "died":1616}
            ]
        });

});


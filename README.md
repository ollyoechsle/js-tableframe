JS TableFrame
=============

A tiny (1 KB), object orientated, event-based table framework for JavaScript apps.

Example:

```
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
                    valueFn:function (age, person) {
                        return person.died - person.born;
                    }
                }
            ],
            data:[
                {"id": "1", "name": "Michael Jackson", "born": 1958, "died": 2009},
                {"id": "2", "name": "Albert Einstein", "born": 1879, "died": 1955},
                {"id": "3", "name": "Abraham Lincoln", "born": 1809, "died": 1865},
                {"id": "4", "name": "William Shakespeare", "born": 1564, "died": 1616}
            ]
        });

});
```

Column  Formatters
----------

You can pass a formatter function into each column to format the column.

formatter is invoked with three arguments: the value of the element, the complete row of data, and the column instance

Events
------

The table will fire the following events:
* rowClicked - the callback will be provided with the id of the row (ensure each row object has an 'id' property)
* columnClicked - the callback will be provided with the id of the column (ensure each column object has an 'id' property)

Dependencies
------------

* ECMAScript5 (use es5shim if not on a modern browser)
* jQuery
* Subscribable (https://github.com/steveukx/Subscribable)

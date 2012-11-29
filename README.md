JS TableFrame
=============

A tiny (1.5 KB), object orientated, event-based table framework for JavaScript apps.

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
                    valueFn:function (person) {
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

Formatters
----------

You can transform the values you pass in in two ways: with value functions and formatting functions.

Formatting functions allow you to transform the value in a cell to make it appear better. For instance
you could add the following formatter to a numeric column to make it into a currency:

```
{
    id:"cost",
    name:"Cost",
    formatFn:function (originalValue, rowArray, columnInstance) {
        return originalValue.toFixed(2) + "GBP";
    }
}
```

The format function is invoked with three arguments: the value of the element, the complete row of data (as an array, not the original map), and a column instance.

The column instance has helpful methods which you can use:
* isSorted - Is this column currently the sort column
* getMax - The maximum value in the column (numeric data only)

You can also use value formatters to create `virtual` columns out from the underlying data:

```
{
   id:"age",
   name:"Age",
   valueFn:function (person) {
       return person.died - person.born;
   }

}
```

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

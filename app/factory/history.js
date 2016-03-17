angular.module('app.historyFactory', [])
    .factory('History', function ($rootScope) {
        var title = 'default';
        return {
            getProducts: function () {
                return JSON.parse(window.localStorage.historicItems);
            },
            clear: function () {
                window.localStorage.historicItems = '';
            },
            removeProduct: function (product) {
                var items = [];
                if (window.localStorage.historicItems === undefined) {

                } else {
                    items = JSON.parse(window.localStorage.historicItems)
                }
                for (var i = 0; i < items.length; i++) {
                    if (items[i].id === product.id) {
                        items.splice(i, 1);
                    }
                }

                window.localStorage.historicItems = JSON.stringify(items)
            },
            addProduct: function (product) {
                var items = [];
                if (window.localStorage.historicItems === undefined) {

                } else {
                    items = JSON.parse(window.localStorage.historicItems)
                }


                var count = 0;
                // Go through history and remove any existing references
                for (var i = 0; i < items.length; i++) {
                    if (items[i].id === product.id) {
                        items.splice(i, 1)
                    }
                }


                // If we are more than 10 remove last item
                if (items.length >= 10) {
                    for (var i = 0; i < items.length - 9; i++) {
                        items.pop();
                    }
                }


                items.unshift(product)
                window.localStorage.historicItems = JSON.stringify(items)


            }
        };
    });
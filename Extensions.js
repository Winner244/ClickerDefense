// Прокачка массива - функция sortByField: добавлена возможность сортировки по 1 параметру:
//1-1 вариант: [{type: '...', int: 12}, {type: '...', int: -7}, {type: '...', int: 3}].sortByField(x => x.int) = [{type: '...', int: -7}, {type: '...', int: 3}, {type: '...', int: 12}]
//2-1 вариант: [{type: '...', int: 12}, {type: '...', int: -7}, {type: '...', int: 3}].sortByField('int') = [{type: '...', int: -7}, {type: '...', int: 3}, {type: '...', int: 12}]
if (!Array.prototype.sortByField) {
    Array.prototype.sortByField = function(fun) {
        if(typeof fun === 'function'){
            return this.sort((a, b) => {
                if(fun(a) > fun(b)){
                    return 1;
                }

                if(fun(a) < fun(b)){
                    return -1;
                }

                return 0;
            });
        }
        else if(typeof fun === 'string'){
            return this.sortByField(x => x[fun]);
        }
    };
}
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

// Прокачка массива - функция last:
// [{type: '...', int: 12}, {type: '...', int: -7}, {type: '...', int: 3}].last() = {type: '...', int: 3}
// [234, 634, 11].last() = 11
if (!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    };
}

// Прокачка массива - функция first:
// [{type: '...', int: 12}, {type: '...', int: -7}, {type: '...', int: 3}].first() = {type: '...', int: 12}
// [234, 634, 11].first() = 234
if (!Array.prototype.first) {
    Array.prototype.first = function() {
        return this[0];
    };
}
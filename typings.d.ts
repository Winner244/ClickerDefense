interface Array<T> {
  sum(func: (this: Array<T>, element: T) => number): number;
  last(): T;
  first(): T;
  sortByField(func: (this: Array<T>, element: T) => any): Array<T>;
}

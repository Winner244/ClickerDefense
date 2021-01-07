const ADD_TODO = 'ADD_TODO';

let nextTodoId = 0
export const addTodo = (content: any) => ({
  type: ADD_TODO,
  payload: {
    id: ++nextTodoId,
    content
  }
})

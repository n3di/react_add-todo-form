// App.tsx
import React, { useState } from 'react';
import './App.scss';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import todosFromServer from './api/todos';
import usersFromServer from './api/users';

export const App = () => {
  const userMap = new Map(usersFromServer.map(u => [u.id, u]));

  const initialTodos: Todo[] = todosFromServer.map(todo => ({
    ...todo,
    user: userMap.get(todo.userId)!,
  }));

  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [titleError, setTitleError] = useState(false);
  const [userError, setUserError] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // opcjonalnie: filtr tylko litery i cyfry
    const cleaned = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
    setTitle(cleaned);
    if (titleError) setTitleError(false);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(Number(e.target.value));
    if (userError) setUserError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    if (!title.trim()) {
      setTitleError(true);
      valid = false;
    }
    if (!selectedUserId) {
      setUserError(true);
      valid = false;
    }
    if (!valid) return;

    const newId = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    const user = usersFromServer.find(u => u.id === selectedUserId)!;

    const newTodo: Todo = {
      id: newId,
      title: title.trim(),
      userId: user.id,
      completed: false,
      user,
    };

    setTodos([...todos, newTodo]);
    setTitle('');
    setSelectedUserId('');
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter todo title"
          />
          {titleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={selectedUserId}
            onChange={handleUserChange}
          >
            <option value="">Choose a user</option>
            {usersFromServer.map(u => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          {userError && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todos} />
    </div>
  );
};

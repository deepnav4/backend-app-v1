import { useState, useEffect } from 'react'
import './App.css'

const API_URL = '/api'

interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(false)
  const [randomNum, setRandomNum] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/todos`)
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Failed to fetch todos:', error)
      alert('Failed to fetch todos')
    } finally {
      setLoading(false)
    }
  }

  // Create a new todo
  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      })
      const data = await response.json()
      setTodos([data, ...todos])
      setNewTodo('')
    } catch (error) {
      console.error('Failed to create todo:', error)
      alert('Failed to create todo')
    }
  }

  // Toggle todo completion
  const toggleTodo = async (todo: Todo) => {
    try {
      const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: todo.title,
          completed: !todo.completed 
        })
      })
      const updatedTodo = await response.json()
      setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t))
    } catch (error) {
      console.error('Failed to update todo:', error)
      alert('Failed to update todo')
    }
  }

  // Update todo title
  const updateTodo = async (id: number) => {
    if (!editTitle.trim()) return

    try {
      const todo = todos.find(t => t.id === id)
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: editTitle,
          completed: todo?.completed 
        })
      })
      const updatedTodo = await response.json()
      setTodos(todos.map(t => t.id === id ? updatedTodo : t))
      setEditingId(null)
      setEditTitle('')
    } catch (error) {
      console.error('Failed to update todo:', error)
      alert('Failed to update todo')
    }
  }

  // Delete a todo
  const deleteTodo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this todo?')) return

    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE'
      })
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete todo:', error)
      alert('Failed to delete todo')
    }
  }

  // Get random number
  const getRandomNumber = async () => {
    try {
      const response = await fetch(`${API_URL}/num`)
      const data = await response.json()
      setRandomNum(data.number)
    } catch (error) {
      console.error('Failed to get random number:', error)
      alert('Failed to get random number')
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="app">
      <h1>📝 Todo App</h1>
      <p className="subtitle">Connected to: {API_URL}</p>

      {/* Random Number Feature */}
      <div className="random-section">
        <button onClick={getRandomNumber} className="random-btn">
          🎲 Get Random Number
        </button>
        {randomNum !== null && (
          <span className="random-num">Random: {randomNum}</span>
        )}
      </div>

      {/* Create Todo Form */}
      <form onSubmit={createTodo} className="todo-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
        />
        <button type="submit" className="add-btn">Add Todo</button>
      </form>

      {/* Todos List */}
      {loading ? (
        <p>Loading todos...</p>
      ) : (
        <div className="todos-list">
          {todos.length === 0 ? (
            <p className="empty-state">No todos yet! Add one above 👆</p>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                  className="todo-checkbox"
                />
                
                {editingId === todo.id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="edit-input"
                      autoFocus
                    />
                    <button onClick={() => updateTodo(todo.id)} className="save-btn">
                      ✓
                    </button>
                    <button onClick={() => {
                      setEditingId(null)
                      setEditTitle('')
                    }} className="cancel-btn">
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="todo-title">{todo.title}</span>
                    <div className="todo-actions">
                      <button 
                        onClick={() => {
                          setEditingId(todo.id)
                          setEditTitle(todo.title)
                        }} 
                        className="edit-btn"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteTodo(todo.id)} 
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Stats */}
      {todos.length > 0 && (
        <div className="stats">
          <span>Total: {todos.length}</span>
          <span>Active: {todos.filter(t => !t.completed).length}</span>
          <span>Completed: {todos.filter(t => t.completed).length}</span>
        </div>
      )}
    </div>
  )
}

export default App

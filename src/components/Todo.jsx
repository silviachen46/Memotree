// import React, { useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import './Todo.css';

// function Todo() {
//   const [todos, setTodos] = useState([]);
//   const [newTodo, setNewTodo] = useState({
//     name: '',
//     startTime: '',
//     endTime: '',
//     details: '',
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewTodo(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (newTodo.name && newTodo.startTime && newTodo.endTime) {
//       setTodos(prev => [...prev, { ...newTodo, id: Date.now().toString() }]);
//       setNewTodo({
//         name: '',
//         startTime: '',
//         endTime: '',
//         details: '',
//       });
//     }
//   };

//   const handleDelete = (id) => {
//     setTodos(prev => prev.filter(todo => todo.id !== id));
//   };

//   const onDragEnd = (result) => {
//     if (!result.destination) return;

//     const items = Array.from(todos);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);

//     setTodos(items);
//   };

//   return (
//     <div className="todo-split-container">
//       <div className="todo-form-section">
//         <h2>Add New Task</h2>
//         <form onSubmit={handleSubmit} className="todo-form">
//           <div className="form-group">
//             <label>Task Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={newTodo.name}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label>Start Time:</label>
//             <input
//               type="time"
//               name="startTime"
//               value={newTodo.startTime}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label>End Time:</label>
//             <input
//               type="time"
//               name="endTime"
//               value={newTodo.endTime}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label>Details:</label>
//             <textarea
//               name="details"
//               value={newTodo.details}
//               onChange={handleInputChange}
//               rows="3"
//             />
//           </div>
          
//           <button type="submit" className="add-button">Add Todo</button>
//         </form>
//       </div>

//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className="todo-board-section">
//           <h2>Task Board</h2>
//           <Droppable droppableId="todos">
//             {(provided) => (
//               <div
//                 className="todo-list"
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//               >
//                 {todos.map((todo, index) => (
//                   <Draggable 
//                     key={todo.id} 
//                     draggableId={todo.id} 
//                     index={index}
//                   >
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         className="todo-item"
//                       >
//                         <div className="todo-header">
//                           <h3>{todo.name}</h3>
//                           <button 
//                             onClick={() => handleDelete(todo.id)}
//                             className="delete-button"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                         <p className="todo-time">
//                           {todo.startTime} - {todo.endTime}
//                         </p>
//                         {todo.details && <p className="todo-details">{todo.details}</p>}
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </div>
//       </DragDropContext>
//     </div>
//   );
// }

// export default Todo; 

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Todo.css';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    name: '',
    startTime: '',
    endTime: '',
    details: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.name && newTodo.startTime && newTodo.endTime) {
      setTodos((prev) => [...prev, { ...newTodo, id: Date.now().toString() }]);
      setNewTodo({
        name: '',
        startTime: '',
        endTime: '',
        details: '',
      });
    }
  };

  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  };

  return (
    <div className="todo-split-container">
      <div className="todo-form-section">
        <h2>Add New Task</h2>
        <form onSubmit={handleSubmit} className="todo-form">
          <div className="form-group">
            <label>Task Name:</label>
            <input
              type="text"
              name="name"
              value={newTodo.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={newTodo.startTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time:</label>
            <input
              type="time"
              name="endTime"
              value={newTodo.endTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Details:</label>
            <textarea
              name="details"
              value={newTodo.details}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <button type="submit" className="add-button">
            Add Todo
          </button>
        </form>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="todo-board-section">
          <h2>Task Board</h2>
          <Droppable droppableId="todos" key="todos">
            {(provided) => (
              <div
                className="todo-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ minHeight: '100px' }} // Ensure droppable area has a minimum height
              >
                {todos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="todo-item"
                      >
                        <div className="todo-header">
                          <h3>{todo.name}</h3>
                          <button
                            onClick={() => handleDelete(todo.id)}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="todo-time">
                          {todo.startTime} - {todo.endTime}
                        </p>
                        {todo.details && (
                          <p className="todo-details">{todo.details}</p>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}

export default Todo;

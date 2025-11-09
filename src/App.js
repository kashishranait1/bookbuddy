import React, { useState, useEffect } from "react";
import "./App.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function App() {
  const [books, setBooks] = useState(
    JSON.parse(localStorage.getItem("books")) || []
  );
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [readPages, setReadPages] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setPages("");
    setReadPages("");
    setEditIndex(null);
  };

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    const newBook = {
      title,
      author,
      pages: parseInt(pages),
      readPages: parseInt(readPages),
    };
    if (editIndex !== null) {
      const updatedBooks = [...books];
      updatedBooks[editIndex] = newBook;
      setBooks(updatedBooks);
    } else {
      setBooks([...books, newBook]);
    }
    resetForm();
  };

  const handleEdit = (index) => {
    const book = books[index];
    setTitle(book.title);
    setAuthor(book.author);
    setPages(book.pages);
    setReadPages(book.readPages);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "App dark" : "App"}>
      <header>
        <h1>📚 BookBuddy Pro</h1>
        <button className="toggle-btn" onClick={toggleDarkMode}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <div className="container">
        {/* Form */}
        <div className="form-container">
          <h2>{editIndex !== null ? "Edit Book" : "Add a Book"}</h2>
          <form onSubmit={handleAddOrEdit}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Total Pages"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Pages Read"
              value={readPages}
              onChange={(e) => setReadPages(e.target.value)}
              required
            />
            <button type="submit">{editIndex !== null ? "Update" : "Add"}</button>
          </form>
        </div>

        {/* Book List */}
        <div className="list-container">
          <h2>Your Library</h2>
          {books.length === 0 ? (
            <p>No books added yet.</p>
          ) : (
            <ul>
              {books.map((book, index) => (
                <li key={index} className="book-card">
                  <div>
                    <b>{book.title}</b> by {book.author} <br />
                    {book.readPages}/{book.pages} pages read
                  </div>
                  <div className="buttons">
                    <button onClick={() => handleEdit(index)}>✏️ Edit</button>
                    <button onClick={() => handleDelete(index)}>🗑️ Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Chart */}
        <div className="chart-container">
          <h2>Reading Progress</h2>
          <PieChart width={350} height={350}>
            <Pie
              data={books.map((b) => ({ name: b.title, value: b.readPages }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
              isAnimationActive={true}
            >
              {books.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default App;

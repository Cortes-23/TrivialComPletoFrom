// App.jsx
import React from "react";
import "./App.css";

const categories = [
  "Ciencia",
  "Historia",
  "Geografía",
  "Arte",
  "Entretenimiento",
];

function App() {
  const handleCategoryClick = (category) => {
    console.log("Categoría seleccionada:", category);
    // Aquí puedes luego llamar a la API con fetch(`/api/trivia/generate`, { method: "POST", ... })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-indigo-300 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gradient mb-8">Juego de Trivia</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="bg-white text-purple-700 px-6 py-3 rounded-xl shadow-xl hover:scale-[1.01] transition-all font-semibold"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;

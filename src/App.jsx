// App.jsx
import React, { useState } from "react";
import "./App.css";
import axios from 'axios';

const categories = [
  "Ciencia",
  "Historia",
  "Geografía",
  "Arte",
  "Entretenimiento",
];

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCategoryClick = async (category) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('https://trivial-completo-back.vercel.app/api/trivia/generate', { category });
      setCurrentQuestion(response.data);
    } catch (err) {
      console.error("Error al generar pregunta:", err);
      setError("Error al cargar la pregunta. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-indigo-300 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gradient mb-8">Juego de Trivia</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="bg-white text-purple-700 px-6 py-3 rounded-xl shadow-xl hover:scale-[1.01] transition-all font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-purple-700 font-semibold">
          Generando pregunta...
        </div>
      )}

      {currentQuestion && !loading && (
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full">
          <h2 className="text-xl font-bold mb-4 text-purple-800">{currentQuestion.question}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => alert(option === currentQuestion.correctAnswer ? "¡Correcto!" : "Incorrecto")}
                className="w-full text-left px-4 py-2 rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

// App.jsx
import React, { useState } from "react";
import "./App.css";
import axios from 'axios';

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
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 text-gradient mb-4">Juego de Trivia</h1>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row justify-content-center mb-5">
          {["Ciencia", "Historia", "Geografía", "Arte", "Entretenimiento"].map((category) => (
            <div className="col-12 col-md-auto mb-2" key={category}>
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={() => handleCategoryClick(category)}
                disabled={loading}
              >
                {category}
              </button>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Generando pregunta...</span>
            </div>
          </div>
        )}

        {currentQuestion && !loading && (
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">{currentQuestion.question}</h2>
              <div className="d-grid gap-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className="btn btn-outline-primary text-start py-3"
                    onClick={() => alert(option === currentQuestion.correctAnswer ? "¡Correcto!" : "Incorrecto")}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

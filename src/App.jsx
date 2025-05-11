// App.jsx
import React, { useState } from "react";
import "./App.css";
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleCategoryClick = async (category) => {
    try {
      setLoading(true);
      setError(null);
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResult(false);
      
      // Obtener 5 preguntas
      const questionsArray = [];
      for (let i = 0; i < 5; i++) {
        const response = await axios.post('https://trivial-completo-back.vercel.app/api/trivia/generate', { category });
        questionsArray.push(response.data);
      }
      setQuestions(questionsArray);
    } catch (err) {
      console.error("Error al generar preguntas:", err);
      setError("Error al cargar las preguntas. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: option
    });

    // Esperar un momento para mostrar el resultado y luego avanzar
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const getAnswerButtonClass = (option, questionIndex) => {
    const selected = selectedAnswers[questionIndex] === option;
    const currentQuestion = questions[questionIndex];
    
    if (!selected || questionIndex !== currentQuestionIndex) {
      return "btn btn-outline-primary text-start py-3";
    }
    
    return option === currentQuestion.correctAnswer
      ? "btn btn-success text-start py-3"
      : "btn btn-danger text-start py-3";
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

        {!questions.length && (
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
        )}

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Generando preguntas...</span>
            </div>
          </div>
        )}

        {questions.length > 0 && !loading && !showResult && (
          <div className="card shadow-lg">
            <div className="card-body">
              <div className="mb-3">
                <span className="badge bg-primary">Pregunta {currentQuestionIndex + 1} de 5</span>
              </div>
              <h2 className="card-title h4 mb-4">{questions[currentQuestionIndex].question}</h2>
              <div className="d-grid gap-2">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    className={getAnswerButtonClass(option, currentQuestionIndex)}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswers[currentQuestionIndex]}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showResult && (
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">Resultados</h2>
              <div className="d-grid gap-3">
                {questions.map((question, index) => (
                  <div key={index} className="text-start border rounded p-3">
                    <p className="fw-bold mb-2">Pregunta {index + 1}: {question.question}</p>
                    <p className="mb-1">Tu respuesta: 
                      <span className={selectedAnswers[index] === question.correctAnswer ? 
                        "text-success fw-bold ms-2" : "text-danger fw-bold ms-2"}>
                        {selectedAnswers[index]}
                      </span>
                    </p>
                    <p className="mb-0">Respuesta correcta: 
                      <span className="text-success fw-bold ms-2">{question.correctAnswer}</span>
                    </p>
                  </div>
                ))}
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => {
                    setQuestions([]);
                    setSelectedAnswers({});
                    setCurrentQuestionIndex(0);
                    setShowResult(false);
                  }}
                >
                  Jugar de nuevo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

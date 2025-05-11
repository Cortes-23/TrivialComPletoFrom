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

  // Categorías expandidas con subcategorías
  const categories = {
    "Ciencia": ["Biología", "Física", "Química", "Astronomía", "Tecnología"],
    "Historia": ["Antigua", "Medieval", "Moderna", "Contemporánea", "Local"],
    "Geografía": ["Países", "Capitales", "Relieve", "Clima", "Océanos"],
    "Arte": ["Pintura", "Música", "Literatura", "Cine", "Arquitectura"],
    "Entretenimiento": ["Deportes", "Videojuegos", "Series", "Música Pop", "Celebridades"]
  };

  const isQuestionUnique = (newQuestion, existingQuestions) => {
    return !existingQuestions.some(q => 
      q.question.toLowerCase().trim() === newQuestion.question.toLowerCase().trim() ||
      JSON.stringify(q.options.sort()) === JSON.stringify(newQuestion.options.sort())
    );
  };

  const handleCategoryClick = async (mainCategory) => {
    try {
      setLoading(true);
      setError(null);
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResult(false);
      
      const questionsArray = [];
      const subcategories = categories[mainCategory];
      let attempts = 0;
      const maxAttempts = 15; // Límite de intentos para evitar bucle infinito

      while (questionsArray.length < 5 && attempts < maxAttempts) {
        attempts++;
        // Seleccionar una subcategoría aleatoria
        const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
        
        const response = await axios.post('https://trivial-completo-back.vercel.app/api/trivia/generate', {
          category: mainCategory,
          subcategory: subcategory,
          difficulty: Math.random() > 0.5 ? 'difícil' : 'moderado' // Variar dificultad
        });

        const newQuestion = response.data;
        
        // Solo agregar la pregunta si es única
        if (isQuestionUnique(newQuestion, questionsArray)) {
          questionsArray.push({
            ...newQuestion,
            subcategory, // Guardar la subcategoría para mostrarla
          });
        }
      }

      if (questionsArray.length < 5) {
        setError("No se pudieron generar suficientes preguntas únicas. Por favor, intenta de nuevo.");
        return;
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
            {Object.keys(categories).map((category) => (
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
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <span className="badge bg-primary">Pregunta {currentQuestionIndex + 1} de 5</span>
                <span className="badge bg-secondary">
                  {questions[currentQuestionIndex].subcategory}
                </span>
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

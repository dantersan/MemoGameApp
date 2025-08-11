"use client";

import React, { useEffect, useState } from "react";

interface CardType {
  id: number;
  img: string;
  matched: boolean;
  flipped: boolean;
}

interface Score {
  time: number;
  attempts: number;
}

const TOTAL_PAIRS = 8;

// Función para mezclar un arreglo de forma aleatoria
const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

// Inicialización de sonidos si el navegador lo soporta
const moverCarta = typeof Audio !== "undefined" ? new Audio("/sounds/moverCarta.mp3") : null;
const acierto = typeof Audio !== "undefined" ? new Audio("/sounds/acierto.mp3") : null;
const error = typeof Audio !== "undefined" ? new Audio("/sounds/error.mp3") : null;
const victoria = typeof Audio !== "undefined" ? new Audio("/sounds/victoria.mp3") : null;
const ostFondo = typeof Audio !== "undefined" ? new Audio("/sounds/ostFondo.mp3") : null;

// Ajuste de volumen para cada sonido
if (moverCarta) moverCarta.volume = 1.0;
if (acierto) acierto.volume = 1.0;
if (error) error.volume = 1.0;
if (victoria) victoria.volume = 1.0;
if (ostFondo) {
  ostFondo.loop = true;
  ostFondo.volume = 0.1;
}

export default function MemoramaGame() {
  // Estado para las cartas del memorama
  const [cards, setCards] = useState<CardType[]>([]);
  // Estados para controlar la lógica de selección de cartas
  const [firstCard, setFirstCard] = useState<CardType | null>(null);
  const [secondCard, setSecondCard] = useState<CardType | null>(null);
  // Controla si las cartas están temporalmente bloqueadas para no recibir clicks
  const [disabled, setDisabled] = useState(false);
  // Contador de intentos
  const [attempts, setAttempts] = useState(0);
  // Temporizador en segundos
  const [timer, setTimer] = useState(0);
  // Estado que indica si el juego ha terminado
  const [gameOver, setGameOver] = useState(false);
  // Estado para el ranking de puntajes guardados
  const [ranking, setRanking] = useState<Score[]>([]);
  // Bandera para saber si la música ya empezó
  const [musicStarted, setMusicStarted] = useState(false);

  // Genera el arreglo inicial de cartas y comienza el temporizador
  useEffect(() => {
    generateCards();

    // Incrementa el timer cada segundo
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Carga el ranking guardado en localStorage al montar el componente
  useEffect(() => {
    const stored = localStorage.getItem("ranking");
    if (stored) setRanking(JSON.parse(stored));
  }, []);

  // Detecta si todas las cartas están emparejadas para finalizar el juego
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setGameOver(true);

      // Reproduce sonido de victoria
      if (victoria) {
        victoria.currentTime = 0;
        victoria.play();
      }

      // Guarda la puntuación automáticamente al ganar
      saveScore();
    }
  }, [cards]);

  // Reproduce la música de fondo la primera vez que se interactúa
  const startMusicIfNeeded = () => {
    if (!musicStarted && ostFondo) {
      ostFondo.play().catch(() => {
        // Puede requerir interacción del usuario para activarse
      });
      setMusicStarted(true);
    }
  };

  // Genera las cartas, las duplica y mezcla
  const generateCards = () => {
    const imgs = Array.from({ length: TOTAL_PAIRS }, (_, i) => `${i + 1}.png`);
    const duplicatedCards = [...imgs, ...imgs].map((img, index) => ({
      id: index,
      img,
      matched: false,
      flipped: false,
    }));

    const shuffled = shuffleArray(duplicatedCards);
    setCards(shuffled);

    // Reinicia estados y contador
    setFirstCard(null);
    setSecondCard(null);
    setAttempts(0);
    setTimer(0);
    setGameOver(false);
    setDisabled(false);

    // Detiene el sonido de victoria si está activo
    if (victoria && !victoria.paused) {
      victoria.pause();
      victoria.currentTime = 0;
    }

    // Reinicia música de fondo si ya empezó
    if (ostFondo && musicStarted) {
      ostFondo.currentTime = 0;
      ostFondo.play().catch(() => {});
    }
  };

  // Maneja el clic en una carta
  const handleCardClick = (card: CardType) => {
    // Ignora clic si está deshabilitado o la carta ya está volteada o emparejada
    if (disabled || card.flipped || card.matched) return;

    startMusicIfNeeded();
    moverCarta?.play();

    // Voltea la carta clickeada
    const flipped = { ...card, flipped: true };
    const newCards = cards.map((c) => (c.id === card.id ? flipped : c));
    setCards(newCards);

    // Lógica de emparejamiento
    if (!firstCard) {
      setFirstCard(flipped);
    } else if (!secondCard) {
      setSecondCard(flipped);
      setDisabled(true);
      setAttempts((a) => a + 1);

      if (firstCard.img === flipped.img) {
        acierto?.play();

        // Marca las cartas iguales como emparejadas
        setCards((prev) =>
          prev.map((c) =>
            c.img === flipped.img ? { ...c, matched: true } : c
          )
        );

        setTimeout(() => {
          resetTurn();
        }, 500);
      } else {
        error?.play();

        // Voltea de nuevo las cartas no iguales después de un tiempo
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === flipped.id
                ? { ...c, flipped: false }
                : c
            )
          );
          resetTurn();
        }, 1000);
      }
    }
  };

  // Resetea las selecciones para el siguiente intento
  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  // Guarda la puntuación actual en el ranking y localStorage
  const saveScore = () => {
    const newScore = { time: timer, attempts };
    const updatedRanking = [...ranking, newScore]
      .sort((a, b) =>
        a.time === b.time ? a.attempts - b.attempts : a.time - b.time
      )
      .slice(0, 5);

    setRanking(updatedRanking);
    localStorage.setItem("ranking", JSON.stringify(updatedRanking));
  };

  return (
    <>
         {/* Título */}
      <h1 className="text-4xl font-bold text-center mb-6">Memorama</h1>
      {/* Información del juego: tiempo y intentos */}
      <div className="mb-4 text-lg flex justify-center gap-6">
        <div>Tiempo: {timer}s</div>
        <div>Intentos: {attempts}</div>
      </div>

      {/* Tablero de cartas */}
      <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className="cursor-pointer border rounded-lg overflow-hidden shadow-md bg-white"
          >
            <img
              src={
                card.flipped || card.matched
                  ? `/images/${card.img}`
                  : "/images/t800.png"
              }
              alt="card"
              className="w-full h-28 object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Mensaje cuando se completa el juego */}
      {gameOver && (
        <div className="mt-8 text-green-600 font-semibold text-xl text-center">
          ¡Juego completado! Resultado guardado.
        </div>
      )}

      {/* Botones para reiniciar y acerca de */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={generateCards}
          className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-xl"
        >
          Reiniciar Juego
        </button>

        <a
          href="/acerca-de"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl inline-block"
        >
          Acerca de
        </a>
      </div>

      {/* Ranking de mejores puntajes */}
      <div className="mt-10 max-w-md mx-auto text-left">
        <h2 className="text-2xl font-bold mb-4">Ranking</h2>
        <ol className="space-y-2">
          {ranking.map((score, idx) => (
            <li
              key={idx}
              className="bg-white p-3 rounded shadow flex justify-between text-sm text-gray-700"
            >
              <span>#{idx + 1}</span>
              <span>
                {score.time}s | {score.attempts} intentos
              </span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

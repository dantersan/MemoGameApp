"use client";

import React, { useEffect, useState } from "react";

interface CardType {
  id: number;
  img: string;
  matched: boolean;
  flipped: boolean;
}

interface Score {
  name: string;
  time: number;
  attempts: number;
}

const TOTAL_PAIRS = 8;

const shuffleArray = (array: any[]) =>
  [...array].sort(() => Math.random() - 0.5);

const moverCarta = typeof Audio !== "undefined" ? new Audio("/sounds/moverCarta.mp3") : null;
const acierto = typeof Audio !== "undefined" ? new Audio("/sounds/acierto.mp3") : null;
const error = typeof Audio !== "undefined" ? new Audio("/sounds/error.mp3") : null;
const victoria = typeof Audio !== "undefined" ? new Audio("/sounds/victoria.mp3") : null;
const ostFondo = typeof Audio !== "undefined" ? new Audio("/sounds/ostFondo.mp3") : null;

if (moverCarta) moverCarta.volume = 1.0;
if (acierto) acierto.volume = 1.0;
if (error) error.volume = 1.0;
if (victoria) victoria.volume = 1.0;
if (ostFondo) {
  ostFondo.loop = true;
  ostFondo.volume = 0.1;
}

export default function MemoramaGame() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [firstCard, setFirstCard] = useState<CardType | null>(null);
  const [secondCard, setSecondCard] = useState<CardType | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [ranking, setRanking] = useState<Score[]>([]);
  const [musicStarted, setMusicStarted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    generateCards();
    const stored = localStorage.getItem("ranking");
    if (stored) setRanking(JSON.parse(stored));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setGameOver(true);
      if (victoria) {
        victoria.currentTime = 0;
        victoria.play();
      }
      saveScore();
    }
  }, [cards]);

  const startMusicIfNeeded = () => {
    if (!musicStarted && ostFondo) {
      ostFondo.play().catch(() => {});
      setMusicStarted(true);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    startMusicIfNeeded();
  };

  const generateCards = () => {
    const imgs = Array.from({ length: TOTAL_PAIRS }, (_, i) => `${i + 1}.png`);
    const duplicatedCards = [...imgs, ...imgs].map((img, index) => ({
      id: index,
      img,
      matched: false,
      flipped: false,
    }));
    setCards(shuffleArray(duplicatedCards));
    setFirstCard(null);
    setSecondCard(null);
    setAttempts(0);
    setTimer(0);
    setGameOver(false);
    setDisabled(false);

    // Pausar y resetear música al reiniciar
    if (victoria && !victoria.paused) {
      victoria.pause();
      victoria.currentTime = 0;
    }
    if (ostFondo && musicStarted) {
      ostFondo.pause();
      ostFondo.currentTime = 0;
      setMusicStarted(false);
    }

    setGameStarted(false); // Reaparecer overlay
  };

  const handleCardClick = (card: CardType) => {
    if (!gameStarted) return;
    if (disabled || card.flipped || card.matched) return;

    moverCarta?.play();
    const flipped = { ...card, flipped: true };
    setCards(cards.map((c) => (c.id === card.id ? flipped : c)));

    if (!firstCard) {
      setFirstCard(flipped);
    } else if (!secondCard) {
      setSecondCard(flipped);
      setDisabled(true);
      setAttempts((a) => a + 1);

      if (firstCard.img === flipped.img) {
        acierto?.play();
        setCards((prev) =>
          prev.map((c) => (c.img === flipped.img ? { ...c, matched: true } : c))
        );
        setTimeout(resetTurn, 500);
      } else {
        error?.play();
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

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  const saveScore = () => {
    if (!playerName.trim()) return;
    const newScore = { name: playerName.trim(), time: timer, attempts };
    const updatedRanking = [...ranking, newScore]
      .sort((a, b) =>
        a.time === b.time ? a.attempts - b.attempts : a.time - b.time
      )
      .slice(0, 5);
    setRanking(updatedRanking);
    localStorage.setItem("ranking", JSON.stringify(updatedRanking));
  };

  return (
    <div className="relative max-w-xl mx-auto">
      {!gameStarted && (
  <div className="absolute inset-0 bg-black z-20 flex flex-col items-center justify-center p-8 max-w-xl mx-auto rounded-lg text-white text-center">
    <h2 className="text-3xl font-bold mb-4">Instrucciones del Memorama</h2>
    <p className="mb-6 max-w-md">
      Encuentra todas las parejas de cartas iguales.<br/>
      Haz clic en dos cartas para descubrirlas.<br/>
      Si coinciden, quedarán destapadas.<br/>
      Si no coinciden, se volverán a tapar.<br/>
      Completa el juego en el menor tiempo y con menos intentos posible.<br/>
      Ingresa tu nombre y ¡buena suerte!
    </p>
    <button
      onClick={startGame}
      className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl text-2xl font-bold shadow-lg"
    >
      Empezar
    </button>
  </div>
)}

      <h1 className="text-4xl font-bold text-center mb-6">Memorama</h1>

      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-xs mx-auto"
          disabled={gameStarted}
        />
      </div>

      <div className="mb-4 text-lg flex justify-center gap-6">
        <div>Tiempo: {timer}s</div>
        <div>Intentos: {attempts}</div>
      </div>

      <div className="grid grid-cols-4 gap-4 rounded-lg overflow-hidden shadow-md bg-white">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className="cursor-pointer border rounded-lg overflow-hidden"
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

      {gameOver && (
        <div className="mt-8 text-green-600 font-semibold text-xl text-center">
          ¡Juego completado! Resultado guardado.
        </div>
      )}

      <div className="flex justify-center mt-6 gap-4">
        {/* Botón "Tapar Cartas" eliminado */}

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

      <div className="mt-10 max-w-md mx-auto text-left">
        <h2 className="text-2xl font-bold mb-4">Ranking</h2>
        <ol className="space-y-2">
          {ranking.map((score, idx) => (
            <li
              key={idx}
              className="bg-white p-3 rounded shadow flex justify-between text-sm text-gray-700"
            >
              <span>
                #{idx + 1} {score.name}
              </span>
              <span>
                {score.time}s | {score.attempts} intentos
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

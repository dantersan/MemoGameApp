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

const TOTAL_PAIRS = 8; // 8 pares = 16 cartas

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function MemoramaGame() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [firstCard, setFirstCard] = useState<CardType | null>(null);
  const [secondCard, setSecondCard] = useState<CardType | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [ranking, setRanking] = useState<Score[]>([]);

  useEffect(() => {
    generateCards();
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("ranking");
    if (stored) setRanking(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setGameOver(true);
      saveScore();
    }
  }, [cards]);

  const generateCards = () => {
    // Crea un arreglo con nombres de imágenes "1.png" hasta "8.png"
    const imgs = Array.from({ length: TOTAL_PAIRS }, (_, i) => `${i + 1}.png`);
    // Duplicamos y creamos las cartas con ids únicos
    const duplicatedCards = [...imgs, ...imgs].map((img, idx) => ({
      id: idx,
      img,
      flipped: false,
      matched: false,
    }));
    const shuffled = shuffleArray(duplicatedCards);
    setCards(shuffled);
    setFirstCard(null);
    setSecondCard(null);
    setAttempts(0);
    setTimer(0);
    setGameOver(false);
    setDisabled(false);
  };

  const handleCardClick = (card: CardType) => {
    if (disabled || card.flipped || card.matched) return;

    const flippedCard = { ...card, flipped: true };
    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? flippedCard : c))
    );

    if (!firstCard) {
      setFirstCard(flippedCard);
    } else if (!secondCard) {
      setSecondCard(flippedCard);
      setDisabled(true);

      if (firstCard.img === flippedCard.img) {
        setCards((prev) =>
          prev.map((c) =>
            c.img === flippedCard.img ? { ...c, matched: true } : c
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === flippedCard.id
                ? { ...c, flipped: false }
                : c
            )
          );
          resetTurn();
        }, 1000);
      }

      setAttempts((a) => a + 1);
    }
  };

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  const saveScore = () => {
    const newScore: Score = { time: timer, attempts };
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
      <div className="mb-4 text-lg flex justify-center gap-6">
        <div>⏱️ Tiempo: {timer}s</div>
        <div>❌ Intentos: {attempts}</div>
      </div>

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

      {gameOver && (
        <div className="mt-8 text-green-600 font-semibold text-xl text-center">
          🎉 ¡Juego completado! Resultado guardado.
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={generateCards}
          className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-xl"
        >
          🔁 Reiniciar Juego
        </button>
      </div>

      <div className="mt-10 max-w-md mx-auto text-left">
        <h2 className="text-2xl font-bold mb-4">🏆 Ranking</h2>
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

import React, { useEffect, useState } from "react";
import Layout from "./layout";
import Image from "next/image";

interface Card {
  id: number;
  image: string;
  matched: boolean;
  flipped: boolean;
}

const generateCards = (): Card[] => {
  const cardImages = Array.from({ length: 16 }, (_, i) => `/images/${i + 1}.png`);
  const cards = cardImages.flatMap((img, i) => [
    { id: i * 2, image: img, matched: false, flipped: false },
    { id: i * 2 + 1, image: img, matched: false, flipped: false },
  ]);
  return shuffleArray(cards);
};

const shuffleArray = (array: Card[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [firstCard, setFirstCard] = useState<Card | null>(null);
  const [secondCard, setSecondCard] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [tries, setTries] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [ranking, setRanking] = useState<{ time: number; tries: number }[]>([]);

  useEffect(() => {
    setCards(generateCards());
  }, []);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => setTimer((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    if (firstCard && secondCard) {
      setDisabled(true);
      if (firstCard.image === secondCard.image) {
        setCards((prev) =>
          prev.map((card) =>
            card.image === firstCard.image
              ? { ...card, matched: true }
              : card
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, flipped: false }
                : card
            )
          );
          resetTurn();
        }, 1000);
        setTries((prev) => prev + 1);
      }
    }
  }, [secondCard]);

  useEffect(() => {
    if (cards.length && cards.every((card) => card.matched)) {
      setIsRunning(false);
      const newRanking = [...ranking, { time: timer, tries }];
      newRanking.sort((a, b) => a.time - b.time || a.tries - b.tries);
      setRanking(newRanking);
      localStorage.setItem("ranking", JSON.stringify(newRanking));
    }
  }, [cards]);

  useEffect(() => {
    const savedRanking = localStorage.getItem("ranking");
    if (savedRanking) {
      setRanking(JSON.parse(savedRanking));
    }
  }, []);

  const handleClick = (card: Card) => {
    if (!disabled && !card.flipped && !card.matched) {
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, flipped: true } : c))
      );
      if (!firstCard) {
        setFirstCard(card);
      } else if (!secondCard) {
        setSecondCard(card);
      }
    }
  };

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  return (
    <Layout>
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-purple-700 mb-6">Juego de Memorama</h1>

        <div className="flex justify-between items-center mb-4">
          <p>⏱️ Tiempo: {timer}s</p>
          <p>❌ Intentos fallidos: {tries}</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="cursor-pointer border rounded shadow"
              onClick={() => handleClick(card)}
            >
              <Image
                src={card.flipped || card.matched ? card.image : "/images/t800.png"}
                alt="card"
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">🏆 Ranking</h2>
          <ol className="list-decimal pl-5">
            {ranking.slice(0, 5).map((entry, idx) => (
              <li key={idx}>
                Tiempo: {entry.time}s, Intentos: {entry.tries}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Layout>
  );
}

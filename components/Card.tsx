
import React from 'react';
import type { CardData } from '../types';

interface CardProps {
  item: CardData;
}

const Card: React.FC<CardProps> = ({ item }) => {
  return (
    <div className="bg-gray-800 border border-brand-dark rounded-xl p-6 shadow-lg hover:shadow-brand-secondary/20 hover:border-brand-secondary/50 transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-xl font-bold text-brand-accent mb-2">{item.title}</h3>
      <p className="text-gray-300">{item.description}</p>
    </div>
  );
};

export default Card;

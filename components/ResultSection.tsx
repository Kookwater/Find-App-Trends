import React from 'react';
import Card from './Card';
import Loader from './Loader';
import type { CardData, Source } from '../types';

interface ResultSectionProps {
  title: string;
  icon: React.ReactNode;
  data: CardData[] | null;
  sources: Source[] | null;
  isLoading: boolean;
  error: string | null;
}

const ResultSection: React.FC<ResultSectionProps> = ({ title, icon, data, sources, isLoading, error }) => {
  const hasData = data && data.length > 0;

  return (
    <section className="mb-12">
      <div className="flex items-center mb-6">
        <div className="text-brand-accent mr-3">{icon}</div>
        <h2 className="text-3xl font-bold text-gray-100">{title}</h2>
      </div>
      
      {isLoading && <Loader />}

      {error && (
        <div className="text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && !hasData && (
         <div className="text-center bg-gray-800/50 border border-gray-700 text-gray-400 px-4 py-5 rounded-lg">
           <p>No results found for this category.</p>
         </div>
      )}

      {hasData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, index) => (
              <Card key={index} item={item} />
            ))}
          </div>

          {sources && sources.length > 0 && (
            <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">Sources from Google Search:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm list-disc list-inside">
                {sources.map((source, index) => (
                  <li key={index} className="truncate">
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-brand-light hover:text-brand-accent hover:underline"
                      title={source.title}
                    >
                      {source.title || new URL(source.uri).hostname}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ResultSection;
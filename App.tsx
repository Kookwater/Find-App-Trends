import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ResultSection from './components/ResultSection';
import { 
  getTrendingAppIdeas, 
  getTopDownloadedApps, 
  getPopularNiches, 
  getAppsByDownloads,
  getRecentTrends,
  getCustomSearchResult
} from './services/geminiService';
import type { SearchResult } from './types';

interface ResultsState {
  ideas: SearchResult | null;
  downloads: SearchResult | null;
  niches: SearchResult | null;
  downloadsByRange: SearchResult | null;
  recentTrends: SearchResult | null;
  customSearch: SearchResult | null;
}

interface LoadingState {
  ideas: boolean;
  downloads: boolean;
  niches: boolean;
  downloadsByRange: boolean;
  recentTrends: boolean;
  customSearch: boolean;
}

interface ErrorState {
  ideas: string | null;
  downloads: string | null;
  niches: string | null;
  downloadsByRange: string | null;
  recentTrends: string | null;
  customSearch: string | null;
}

const initialResults: ResultsState = { ideas: null, downloads: null, niches: null, downloadsByRange: null, recentTrends: null, customSearch: null };
const initialLoading: LoadingState = { ideas: false, downloads: false, niches: false, downloadsByRange: false, recentTrends: false, customSearch: false };
const initialErrors: ErrorState = { ideas: null, downloads: null, niches: null, downloadsByRange: null, recentTrends: null, customSearch: null };

const App: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>(initialLoading);
  const [errorStates, setErrorStates] = useState<ErrorState>(initialErrors);
  const [results, setResults] = useState<ResultsState>(initialResults);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [lastCustomQuery, setLastCustomQuery] = useState<string>('');


  const handleGenerate = useCallback(async () => {
    setHasSearched(true);
    setResults(prev => ({...prev, ideas: null, downloads: null, niches: null, downloadsByRange: null, recentTrends: null}));
    setErrorStates(initialErrors);
    setLoadingStates({ ...initialLoading, ideas: true, downloads: true, niches: true, downloadsByRange: true, recentTrends: true });

    getTrendingAppIdeas()
      .then(res => setResults(prev => ({...prev, ideas: res})))
      .catch(() => setErrorStates(prev => ({...prev, ideas: 'Failed to load trending ideas.'})))
      .finally(() => setLoadingStates(prev => ({...prev, ideas: false})));

    getTopDownloadedApps()
      .then(res => setResults(prev => ({...prev, downloads: res})))
      .catch(() => setErrorStates(prev => ({...prev, downloads: 'Failed to load top downloaded apps.'})))
      .finally(() => setLoadingStates(prev => ({...prev, downloads: false})));
    
    getRecentTrends()
      .then(res => setResults(prev => ({...prev, recentTrends: res})))
      .catch(() => setErrorStates(prev => ({...prev, recentTrends: 'Failed to load recent trends.'})))
      .finally(() => setLoadingStates(prev => ({...prev, recentTrends: false})));

    getAppsByDownloads()
      .then(res => setResults(prev => ({...prev, downloadsByRange: res})))
      .catch(() => setErrorStates(prev => ({...prev, downloadsByRange: 'Failed to load apps by downloads.'})))
      .finally(() => setLoadingStates(prev => ({...prev, downloadsByRange: false})));
      
    getPopularNiches()
      .then(res => setResults(prev => ({...prev, niches: res})))
      .catch(() => setErrorStates(prev => ({...prev, niches: 'Failed to load popular niches.'})))
      .finally(() => setLoadingStates(prev => ({...prev, niches: false})));

  }, []);

  const handleCustomSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const query = customQuery.trim();
    if (!query) return;

    setLastCustomQuery(query);
    setLoadingStates(prev => ({...prev, customSearch: true}));
    setErrorStates(prev => ({...prev, customSearch: null}));
    setResults(prev => ({...prev, customSearch: null}));
    
    getCustomSearchResult(query)
      .then(res => setResults(prev => ({...prev, customSearch: res})))
      .catch(() => setErrorStates(prev => ({...prev, customSearch: `Failed to get results for "${query}".`})))
      .finally(() => setLoadingStates(prev => ({...prev, customSearch: false})));

  }, [customQuery]);

  const isGeneratingDefaults = loadingStates.ideas || loadingStates.downloads || loadingStates.niches || loadingStates.downloadsByRange || loadingStates.recentTrends;
  
  const TrendingIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> </svg> );
  const DownloadIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /> </svg> );
  const NicheIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /> </svg> );
  const TieredDownloadsIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> </svg> );
  const RecentIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg> );
  const SearchIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg> );

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col">
      <main className="flex-grow container mx-auto px-4">
        <Header />
        
        <div className="text-center mb-8">
          <button
            onClick={handleGenerate}
            disabled={isGeneratingDefaults}
            className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isGeneratingDefaults ? 'Generating...' : 'Find App Trends'}
          </button>
        </div>

        <form onSubmit={handleCustomSearch} className="max-w-2xl mx-auto mb-16">
          <label htmlFor="custom-search" className="block text-center text-gray-400 mb-3">Or, explore your own ideas.</label>
          <div className="flex items-center bg-gray-800 border-2 border-gray-700 rounded-full shadow-lg p-2 focus-within:border-brand-secondary transition-colors">
            <input
              id="custom-search"
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="e.g., AI-powered fitness apps..."
              className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none px-4 py-1"
            />
            <button
              type="submit"
              disabled={loadingStates.customSearch || !customQuery.trim()}
              className="bg-brand-accent text-brand-dark font-bold py-2 px-6 rounded-full hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingStates.customSearch ? (
                 <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
              ) : 'Search'}
            </button>
          </div>
        </form>

        <div className="space-y-16">
          {(loadingStates.customSearch || errorStates.customSearch || results.customSearch) && (
            <ResultSection 
              title={lastCustomQuery ? `Results for "${lastCustomQuery}"` : "Custom Search"}
              icon={<SearchIcon />} 
              data={results.customSearch?.data ?? null} 
              sources={results.customSearch?.sources ?? null}
              isLoading={loadingStates.customSearch}
              error={errorStates.customSearch}
            />
          )}

          {hasSearched && (
            <>
              <ResultSection 
                title="Trending in the Last 2 Weeks" 
                icon={<RecentIcon />} 
                data={results.recentTrends?.data ?? null} 
                sources={results.recentTrends?.sources ?? null}
                isLoading={loadingStates.recentTrends}
                error={errorStates.recentTrends}
              />
              <ResultSection 
                title="Trending App Ideas" 
                icon={<TrendingIcon />} 
                data={results.ideas?.data ?? null} 
                sources={results.ideas?.sources ?? null}
                isLoading={loadingStates.ideas}
                error={errorStates.ideas}
              />
              <ResultSection 
                title="Top Downloaded Apps" 
                icon={<DownloadIcon />} 
                data={results.downloads?.data ?? null} 
                sources={results.downloads?.sources ?? null}
                isLoading={loadingStates.downloads}
                error={errorStates.downloads}
              />
              <ResultSection 
                title="High-Growth Apps by Downloads" 
                icon={<TieredDownloadsIcon />} 
                data={results.downloadsByRange?.data ?? null} 
                sources={results.downloadsByRange?.sources ?? null}
                isLoading={loadingStates.downloadsByRange}
                error={errorStates.downloadsByRange}
              />
              <ResultSection 
                title="Popular & Profitable Niches" 
                icon={<NicheIcon />} 
                data={results.niches?.data ?? null} 
                sources={results.niches?.sources ?? null}
                isLoading={loadingStates.niches}
                error={errorStates.niches}
              />
            </>
          )}
        </div>
        
      </main>
      <Footer />
    </div>
  );
};

export default App;

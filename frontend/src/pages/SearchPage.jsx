import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchResults from '../components/SearchResults.jsx';
import SearchBlock from '../components/SearchBlock.jsx';
import InputField from '../components/InputField.jsx';
import { fetchSearchResults } from '../api/search.js';
const FilterIcon = '/icons/Filters.svg';

export default function SearchPage() {
  const navigate = useNavigate();
  const { search: rawSearch } = useLocation();
  const params = new URLSearchParams(rawSearch);

  // filter bar toggle
  const [showFilters, setShowFilters] = useState(false);

  // search + filters state
  const [query, setQuery]           = useState(params.get('search') || '');
  const [minDeposit, setMinDeposit] = useState(params.get('minDeposit') || '');
  const [maxDeposit, setMaxDeposit] = useState(params.get('maxDeposit') || '');
  const [urgentOnly, setUrgentOnly] = useState(params.get('urgentOnly') === 'true');

  // results state
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // fetch on any change to the URL
  useEffect(() => {
    const ps = new URLSearchParams(rawSearch);
    const term = ps.get('search');
    if (!term) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError('');

    fetchSearchResults({ 
      search: term,
      minDeposit: ps.get('minDeposit'),
      maxDeposit: ps.get('maxDeposit'),
      urgentOnly: ps.get('urgentOnly') === 'true',
    })
      .then(data => {
        setResults(data); ////Once the search API call finishes and returns its data array, take that array and save it into the component’s results state so the UI can render the new list.
      })
      .catch(err => {
        setError(err.message || 'Ошибка загрузки результатов');
      })
      .finally(() => setLoading(false));
  }, [rawSearch]);

  // push new URL with filters
  const applyFilters = () => {
    if (!query.trim()) return;
    const ps = new URLSearchParams();
    ps.set('search', query.trim());
    if (minDeposit) ps.set('minDeposit', minDeposit);
    if (maxDeposit) ps.set('maxDeposit', maxDeposit);
    if (urgentOnly) ps.set('urgentOnly', 'true');
    navigate(`/search?${ps.toString()}`);
  };

  return (
    <div className="bg-[var(--color-bg-alt)] py-[150px]">
      <div className="mx-[120px] space-y-6">
        {/* Search bar */}
        <SearchBlock
          value={query}
          onChange={e => setQuery(e.target.value)}
          onSearch={applyFilters}
          placeholder="Искать специалистов…"
        />

        {/* Filter header */}
        <button
          type="button"
          onClick={() => setShowFilters(f => !f)}
          className="flex pt-[40px] items-center text-[#865A57] font-medium focus:outline-none cursor-pointer"
        >
          <img
            src={FilterIcon}
            alt="Filter"
            className={`h-5 w-5 mr-2 transition-transform ${showFilters ? 'rotate-180' : ''}`}
          />
          <span>Фильтр</span>
        </button>

        {/* Filter controls, only if toggled open */}
        {showFilters && (
          <div className="w-2/3 grid grid-cols-1 lg:grid-cols-4 gap-8">
            <InputField
                type="number"
                min={0}
                placeholder="Мин стоимость"
                value={minDeposit}
                onKeyDown={e => {
                  // block typing the minus key
                  if (e.key === '-') e.preventDefault();
                }}
                onChange={e => {
                  const raw = e.target.value;
                  // allow empty
                  if (raw === '') {
                    setMinDeposit('');
                    return;
                  }
                  // parse and only accept >= 0
                  const num = Number(raw);
                  if (!isNaN(num) && num >= 0) {
                    setMinDeposit(raw);
                  }
                }}
            />
            <InputField
              type="number"
              min={0}
              placeholder="Макс стоимость"
              value={maxDeposit}
              onKeyDown={e => {
                if (e.key === '-') e.preventDefault();
              }}
              onChange={e => {
                const raw = e.target.value;
                if (raw === '') {
                  setMaxDeposit('');
                  return;
                }
                const num = Number(raw);
                if (!isNaN(num) && num >= 0) {
                  setMaxDeposit(raw);
                }
              }}
            />
            <label className="flex items-center pt-[13px] space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={urgentOnly}
                onChange={e => setUrgentOnly(e.target.checked)}
                className="cursor-pointer h-4 w-4"
              />
              <span>Только срочные</span>
            </label>
            <button
              onClick={applyFilters}
              className="btn btn-secondary w-fill"
              type="button"
            >
              Применить
            </button>
          </div>
        )}

        {/* Results */}
        {loading && <p className='pt-[20px] text-gray-500'>Загрузка…</p>}
        {error   && <p className="text-red-500">{error}</p>}
        {!loading && !error && <SearchResults items={results} />}
      </div>
    </div>
  );
}

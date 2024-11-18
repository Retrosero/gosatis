import { Filter, ArrowUpDown, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc';

interface ProductFiltersProps {
  onSortChange: (sort: SortOption) => void;
  onItemsPerPageChange: (count: number) => void;
  itemsPerPage: number;
}

export function ProductFilters({ onSortChange, onItemsPerPageChange, itemsPerPage }: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState('');

  // Sample data - replace with actual data
  const brands = ['2A OYUNCAK', 'ADALYA', 'ADEL', 'ADORE', 'AKKUZU'];
  const packagingTypes = [
    { id: 'display', label: 'Display' },
    { id: 'kartela', label: 'Kartela' },
    { id: 'posetli', label: 'Poşetli' },
    { id: 'vakumlu', label: 'Vakumlu' },
    { id: 'bag', label: 'Bağ' },
    { id: 'fileli', label: 'Fileli' },
    { id: 'kutulu', label: 'Kutulu' },
    { id: 'standli', label: 'Standlı' },
    { id: 'cantali', label: 'Çantalı' },
  ];

  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const handleApplyFilters = () => {
    // Apply filters logic here
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrands([]);
    setSelectedPackaging([]);
    setBrandSearch('');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={cn(
          "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700",
          showFilters && "bg-gray-100 dark:bg-gray-700"
        )}
        title="Filtrele"
      >
        <Filter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      <div className="relative">
        <button
          onClick={() => setShowSort(!showSort)}
          className={cn(
            "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700",
            showSort && "bg-gray-100 dark:bg-gray-700"
          )}
          title="Sırala"
        >
          <ArrowUpDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {showSort && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-10">
            <select
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2"
            >
              <option value="name-asc">İsim (A-Z)</option>
              <option value="name-desc">İsim (Z-A)</option>
              <option value="price-asc">Fiyat (Düşük-Yüksek)</option>
              <option value="price-desc">Fiyat (Yüksek-Düşük)</option>
              <option value="stock-asc">Stok (Az-Çok)</option>
              <option value="stock-desc">Stok (Çok-Az)</option>
            </select>
          </div>
        )}
      </div>

      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className="h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2"
      >
        <option value="25">25</option>
        <option value="100">100</option>
        <option value="250">250</option>
        <option value="500">500</option>
      </select>

      {showFilters && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Ürün Filtresi</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Fiyat Aralığı */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Fiyat Aralığı</h3>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Min. Fiyat"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="number"
                    placeholder="Max. Fiyat"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Markalar */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Markalar</h3>
                <input
                  type="text"
                  placeholder="Marka Ara"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mb-2"
                />
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredBrands.map((brand) => (
                    <label key={brand} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBrands([...selectedBrands, brand]);
                          } else {
                            setSelectedBrands(selectedBrands.filter(b => b !== brand));
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ambalaj Türleri */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Ambalaj Türleri</h3>
                <div className="grid grid-cols-2 gap-2">
                  {packagingTypes.map((type) => (
                    <label key={type.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedPackaging.includes(type.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPackaging([...selectedPackaging, type.id]);
                          } else {
                            setSelectedPackaging(selectedPackaging.filter(t => t !== type.id));
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Temizle
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg"
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
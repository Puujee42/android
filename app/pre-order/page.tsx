'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react';
import PremiumProductGrid from '@/components/PremiumProductGrid';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/LanguageContext';
import { useProducts } from '@/lib/hooks/useProducts';
import { type Product } from '@/models/Product';
import InfiniteScrollTrigger from '@/components/InfiniteScrollTrigger';

type SortType = 'newest' | 'price-low' | 'price-high' | 'name-az';

export default function PreOrderPage() {
  const { t } = useTranslation();
  const { currency, convertPrice } = useLanguage();

  // Filter & Sort States
  const [sortBy, setSortBy] = useState<SortType>('name-az');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const { products, isLoading, isLoadingMore, isReachingEnd, size, setSize } = useProducts({
    section: 'Захиалга',
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined
  });

  // --- Filtering Logic ---
  let filteredProducts = [...products];

  // Apply price filter
  const minPriceNum = minPrice ? parseFloat(minPrice) : 0;
  const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;

  if (minPrice || maxPrice) {
    filteredProducts = filteredProducts.filter(p => {
      const convertedPrice = convertPrice(p.price);
      return convertedPrice >= minPriceNum && convertedPrice <= maxPriceNum;
    });
  }

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-az':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  // Get min and max prices for suggestions
  const prices = filteredProducts.map(p => convertPrice(p.price));
  const suggestedMin = prices.length > 0 ? Math.floor(Math.min(...prices) / (currency === 'USD' ? 10 : 1000)) * (currency === 'USD' ? 10 : 1000) : 0;
  const suggestedMax = prices.length > 0 ? Math.ceil(Math.max(...prices) / (currency === 'USD' ? 10 : 1000)) * (currency === 'USD' ? 10 : 1000) : (currency === 'USD' ? 1000 : 1000000);

  return (
    <div className="min-h-screen bg-white pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-bold text-sm mb-4"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t('nav', 'preOrder')}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
          >
            {t('nav', 'preOrder')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto"
          >
            {t('nav', 'preOrderDescription')}
          </motion.p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex items-center justify-end gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-orange-300 outline-none transition-all cursor-pointer"
              >
                <option value="name-az">{t('filters', 'nameAZ')}</option>
                <option value="price-low">{t('filters', 'priceLowHigh')}</option>
                <option value="price-high">{t('filters', 'priceHighLow')}</option>
              </select>
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${showPriceFilter || minPrice || maxPrice
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-white text-gray-700 border border-gray-200'
                  }`}
              >
                <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
                <span>{t('filters', 'price')}</span>
              </motion.button>

              <AnimatePresence>
                {showPriceFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-50 text-gray-900"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold">{t('filters', 'priceFilter')}</h3>
                      <button onClick={() => setShowPriceFilter(false)} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          placeholder="Min"
                          className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:border-orange-500 text-gray-900"
                        />
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          placeholder="Max"
                          className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:border-orange-500 text-gray-900"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="flex-1 px-4 py-2 text-sm bg-gray-100 rounded-lg">{t('filters', 'clear')}</button>
                        <button onClick={() => setShowPriceFilter(false)} className="flex-1 px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded-lg">{t('filters', 'apply')}</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sortedProducts.length > 0 ? (
          <>
            <motion.div
              key={sortBy}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PremiumProductGrid products={sortedProducts as any} />
            </motion.div>
            
            <InfiniteScrollTrigger
              onLoadMore={() => setSize(size + 1)}
              hasMore={!isReachingEnd}
              isLoading={isLoadingMore}
            />
          </>
        ) : (
          <div className="text-center py-20 text-gray-500">
            {t('product', 'noProductsPreorder')}
          </div>
        )}
      </div>
    </div>
  );
}

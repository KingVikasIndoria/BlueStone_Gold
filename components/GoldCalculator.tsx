import { useState } from 'react';
import { Calculator, Info } from 'lucide-react';

interface TempGoldCalculatorProps {
  price22k: number;
  price24k: number;
  city: string;
  t?: (key: string) => string; // Optional translation function
}

export default function TempGoldCalculator({ price22k, price24k, city, t }: TempGoldCalculatorProps) {
  const [grams, setGrams] = useState('');
  const [purity, setPurity] = useState<'18k' | '22k' | '24k'>('22k');
  const [makingCharges, setMakingCharges] = useState('');
  const [result, setResult] = useState<{
    goldValue: number;
    makingChargesValue: number;
    totalValue: number;
    pricePerGram: number;
  } | null>(null);

  const translate = (key: string) => {
    if (t) return t(key);
    // Default English strings
    const dict: Record<string, string> = {
      'Gold Price Calculator': 'Gold Price Calculator',
      'Weight (grams)': 'Weight (grams)',
      'Gold Purity': 'Gold Purity',
      '22K Gold': '22K Gold',
      '24K Gold': '24K Gold',
      'per gram': 'per gram',
      'Making Charges (%)': 'Making Charges (%)',
      'Usually 10-25% for jewelry': 'Usually 10-25% for jewelry',
      'Calculate Total Price': 'Calculate Total Price',
      'Calculation Results': 'Calculation Results',
      'Gold Value': 'Gold Value',
      'Making Charges': 'Making Charges',
      'Total Value': 'Total Value',
      'Price per Gram': 'Price per Gram',
      'Enter weight in grams': 'Enter weight in grams',
      'Enter making charges percentage': 'Enter making charges percentage',
    };
    return dict[key] || key;
  };

  const calculatePrice = () => {
    const gramsNum = parseFloat(grams);
    const makingChargesNum = parseFloat(makingCharges) || 0;
    if (isNaN(gramsNum) || gramsNum <= 0) {
      setResult(null);
      return;
    }
    let basePrice = price24k;
    if (purity === '22k') basePrice = price22k;
    else if (purity === '18k') basePrice = Math.round(price24k * 0.75);
    const goldValue = gramsNum * basePrice;
    const makingChargesValue = (goldValue * makingChargesNum) / 100;
    const totalValue = goldValue + makingChargesValue;
    const pricePerGram = totalValue / gramsNum;
    setResult({ goldValue, makingChargesValue, totalValue, pricePerGram });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'grams') setGrams(value);
    if (field === 'makingCharges') setMakingCharges(value);
    if ((field === 'grams' && value && makingCharges) || (field === 'makingCharges' && value && grams)) {
      setTimeout(calculatePrice, 100);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Mobile Layout */}
      <div className="block lg:hidden p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5" style={{ color: '#032d5f' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-bold" style={{ color: '#032d5f' }}>Gold Price Calculator - Chennai</h3>
        </div>

        <div className="space-y-3">
          {/* Weight Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (grams)</label>
            <input
              type="number"
              value={grams}
              onChange={(e) => handleInputChange('grams', e.target.value)}
              placeholder={translate('Enter weight in grams')}
              className="w-full px-3 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#032d5f] focus:border-[#032d5f] text-sm"
            />
          </div>

          {/* Gold Purity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gold Purity</label>
            <div className="space-y-2">
              <label className="flex items-center p-2.5 border border-gray-200 rounded-none cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="22k"
                  checked={purity === '22k'}
                  onChange={(e) => setPurity(e.target.value as '18k' | '22k' | '24k')}
                  className="w-4 h-4 border-gray-300 focus:ring-[#032d5f]"
                style={{ accentColor: '#032d5f' }}
                />
                <span className="ml-2.5 text-sm font-medium text-gray-900">22K Gold</span>
                <span className="ml-auto text-sm font-semibold text-[#032d5f]">₹{price22k.toLocaleString('en-IN')}/gram</span>
              </label>
              <label className="flex items-center p-2.5 border border-gray-200 rounded-none cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="24k"
                  checked={purity === '24k'}
                  onChange={(e) => setPurity(e.target.value as '18k' | '22k' | '24k')}
                  className="w-4 h-4 border-gray-300 focus:ring-[#032d5f]"
                style={{ accentColor: '#032d5f' }}
                />
                <span className="ml-2.5 text-sm font-medium text-gray-900">24K Gold</span>
                <span className="ml-auto text-sm font-semibold text-[#032d5f]">₹{price24k.toLocaleString('en-IN')}/gram</span>
              </label>
              <label className="flex items-center p-2.5 border border-gray-200 rounded-none cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="18k"
                  checked={purity === '18k'}
                  onChange={(e) => setPurity(e.target.value as '18k' | '22k' | '24k')}
                  className="w-4 h-4 border-gray-300 focus:ring-[#032d5f]"
                style={{ accentColor: '#032d5f' }}
                />
                <span className="ml-2.5 text-sm font-medium text-gray-900">18K Gold</span>
                <span className="ml-auto text-sm font-semibold text-[#032d5f]">₹{Math.round(price24k * 0.75).toLocaleString('en-IN')}/gram</span>
              </label>
            </div>
          </div>

          {/* Making Charges Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Making Charges (%)</label>
            <input
              type="number"
              value={makingCharges}
              onChange={(e) => handleInputChange('makingCharges', e.target.value)}
              placeholder={translate('Enter making charges percentage')}
              className="w-full px-3 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#032d5f] focus:border-[#032d5f] text-sm"
            />
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-600">
              <svg className="w-4 h-4" style={{ color: '#032d5f' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {translate('Usually 10-25% for jewelry')}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculatePrice}
            className="w-full text-white font-semibold py-2.5 px-4 rounded-md transition-colors text-sm focus:ring-2 focus:ring-[#032d5f] focus:ring-offset-2"
            style={{ backgroundColor: '#032d5f' }}
          >
            {translate('Calculate Total Price')}
          </button>

          {/* Results */}
          {result && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-bold mb-2" style={{ color: '#032d5f' }}>Calculation Results</h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">{translate('Gold Value')}:</span>
                  <span className="font-semibold" style={{ color: '#032d5f' }}>₹{formatPrice(result.goldValue)}</span>
                </div>
                {result.makingChargesValue > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">{translate('Making Charges')}:</span>
                    <span className="font-semibold" style={{ color: '#032d5f' }}>₹{formatPrice(result.makingChargesValue)}</span>
                  </div>
                )}
                <div className="border-t border-blue-200 pt-1.5 mt-1.5">
                  <div className="flex justify-between">
                    <span className="font-bold" style={{ color: '#032d5f' }}>{translate('Total Value')}:</span>
                    <span className="font-bold text-lg" style={{ color: '#032d5f' }}>₹{formatPrice(result.totalValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout - Original Design */}
      <div className="hidden lg:block p-6">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6" style={{ color: '#032d5f' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-bold" style={{ color: '#032d5f' }}>Gold Price Calculator - Chennai</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Input Section */}
          <div className="space-y-4">
            {/* Weight Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (grams)</label>
              <input
                type="number"
                value={grams}
                onChange={(e) => handleInputChange('grams', e.target.value)}
                placeholder={translate('Enter weight in grams')}
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
            </div>

            {/* Gold Purity Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Gold Purity</label>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-none cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="22k"
                    checked={purity === '22k'}
                    onChange={(e) => setPurity(e.target.value as '18k' | '22k' | '24k')}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium">{translate('22K Gold')}</div>
                    <div className="text-sm text-gray-500">{formatPrice(price22k)}/{translate('per gram')}</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-none cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="24k"
                    checked={purity === '24k'}
                    onChange={(e) => setPurity(e.target.value as '18k' | '22k' | '24k')}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium">{translate('24K Gold')}</div>
                    <div className="text-sm text-gray-500">{formatPrice(price24k)}/{translate('per gram')}</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-none cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="18k"
                    checked={purity === '18k'}
                    onChange={(e) => setPurity(e.target.value as '18k' | '22k' | '24k')}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium">18K Gold</div>
                    <div className="text-sm text-gray-500">{formatPrice(Math.round(price24k * 0.75))}/{translate('per gram')}</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Making Charges Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{translate('Making Charges (%)')}</label>
              <input
                type="number"
                value={makingCharges}
                onChange={(e) => handleInputChange('makingCharges', e.target.value)}
                placeholder={translate('Enter making charges percentage')}
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <Info className="w-3 h-3 mr-1" />
                {translate('Usually 10-25% for jewelry')}
              </p>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculatePrice}
              style={{ backgroundColor: '#032d5f' }}
              className="w-full text-white py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              {translate('Calculate Total Price')}
            </button>
          </div>

          {/* Right Column - Results Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{translate('Calculation Results')}</h4>
            {result ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{translate('Gold Value')}</div>
                  <div className="text-xl font-bold" style={{ color: '#032d5f' }}>{formatPrice(result.goldValue)}</div>
                </div>
                {result.makingChargesValue > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">{translate('Making Charges')}</div>
                    <div className="text-lg font-semibold text-gray-700">{formatPrice(result.makingChargesValue)}</div>
                  </div>
                )}
                <div className="rounded-lg p-4 border border-blue-200" style={{ backgroundColor: '#f0f4ff' }}>
                  <div className="text-sm mb-1" style={{ color: '#032d5f' }}>{translate('Total Value')}</div>
                  <div className="text-2xl font-bold" style={{ color: '#032d5f' }}>{formatPrice(result.totalValue)}</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Enter values and click calculate to see results.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
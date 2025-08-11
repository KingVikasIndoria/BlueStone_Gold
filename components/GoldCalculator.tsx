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
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center mb-6">
                    <Calculator className="w-6 h-6 mr-3" style={{ color: '#032d5f' }} />
        <h3 className="text-xl font-bold text-gray-900">
          {translate('Gold Price Calculator')} {city ? `- ${city}` : ''}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translate('Weight (grams)')}
            </label>
            <input
              type="number"
              value={grams}
              onChange={(e) => handleInputChange('grams', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder={translate('Enter weight in grams')}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translate('Gold Purity')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
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
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
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
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translate('Making Charges (%)')}
            </label>
            <input
              type="number"
              value={makingCharges}
              onChange={(e) => handleInputChange('makingCharges', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder={translate('Enter making charges percentage')}
              min="0"
              max="100"
              step="0.01"
            />
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <Info className="w-3 h-3 mr-1" />
              {translate('Usually 10-25% for jewelry')}
            </p>
          </div>
          <button
            onClick={calculatePrice}
            className="w-full text-white py-3 px-4 rounded-lg hover:opacity-90 transition-colors duration-200 font-medium"
            style={{ backgroundColor: '#032d5f' }}
          >
            {translate('Calculate Total Price')}
          </button> 
        </div>
        {/* Results Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">{translate('Calculation Results')}</h4>
          {result ? (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">{translate('Gold Value')}</div>
                <div className="text-xl font-bold text-blue-700">
                  {formatPrice(result.goldValue)}
                </div>
              </div>
              {result.makingChargesValue > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{translate('Making Charges')}</div>
                  <div className="text-lg font-semibold text-gray-700">
                    {formatPrice(result.makingChargesValue)}
                  </div>
                </div>
              )}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm text-blue-800 mb-1">{translate('Total Value')}</div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatPrice(result.totalValue)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Enter values and click calculate to see results.</div>
          )}
        </div>
      </div>
    </div>
  );
} 
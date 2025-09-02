import React, { useState, useEffect } from 'react';

type MobileStyle = 'card' | 'table';

interface GoldPriceBannerProps {
  mobileStyle?: MobileStyle;
  cityName: string;
  price22k: number;
  price24k: number;
  bluestone22k: number;
  bluestone24k: number;
  updatedLabel?: string; // optional; if absent, show today's date (no time)
}

const GoldPriceBannerComponent: React.FC<GoldPriceBannerProps> = ({ mobileStyle = 'card', cityName, price22k, price24k, bluestone22k, bluestone24k, updatedLabel }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [todayLabel, setTodayLabel] = useState<string>('');
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    budget: '',
    alertType: 'price_drop'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const images = ['/1.jpg', '/2.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    // Build a label like 'Tue, 26 Aug 2025' on the client
    const now = new Date();
    const weekday = now.toLocaleDateString('en-GB', { weekday: 'short' });
    const dmy = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setTodayLabel(`${weekday}, ${dmy}`);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const price18k = Math.round(price24k * 0.75);
  const bluestone18k = Math.round(bluestone24k * 0.75);

  const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const percentDiff = (city: number, blue: number) => {
    if (!city) return null;
    return ((city - blue) / city) * 100;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.name || !formData.budget) {
      setSubmitMessage('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Netlify Forms submission: URL-encoded POST to '/'
      const payload: Record<string, string> = {
        'form-name': 'alerts',
        phone: formData.phone,
        name: formData.name,
        budget: String(formData.budget),
        alertType: formData.alertType,
        city: cityName,
        status: 'Active',
      };

      const body = new URLSearchParams(payload).toString();
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      // Netlify may return 302/303 after processing the form. Treat 2xx and 3xx as success.
      if ((response.status >= 200 && response.status < 400) || response.status === 0) {
        setSubmitMessage('Alert set successfully!');
        setFormData({ phone: '', name: '', budget: '', alertType: 'price_drop' });
      } else {
        setSubmitMessage('Failed to set alert. Please try again.');
      }
    } catch (error: any) {
      setSubmitMessage(error?.message || 'Error submitting alert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-2 lg:gap-4 p-1 lg:p-0">
      {/* Left Section - Banner and Gold Price Card */}
      <div className="w-full lg:w-9/12 flex flex-col gap-1.5 lg:gap-4">
        {/* Banner Carousel - Mobile optimized height */}
        <div className="w-full h-24 sm:h-32 lg:h-64 relative">
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                  index === currentSlide ? 'translate-x-0' : 
                  index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                }`}
              >
                <img
                  src={image}
                  alt={`Gold Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Previous slide"
          >
            <svg className="w-3 h-3 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Next slide"
          >
            <svg className="w-3 h-3 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        {/* Gold Price Card - 60% width, 50% height */}
        <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 items-start">
            <h2 className="text-[12px] lg:text-lg font-bold text-blue-900 col-span-1">Gold Rate in {cityName}</h2>
            <span className="bg-green-100 text-green-900 px-2.5 py-1 rounded-full flex items-center font-medium text-sm justify-self-end col-span-1">
              <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
              Live Rates
            </span>
            <div className="hidden lg:block text-xs text-blue-700 italic col-span-1">All prices shown are per 1 gram.</div>
            <div className="hidden lg:flex items-center text-xs justify-self-end col-span-1" style={{ color: '#032d5f' }}>
              <svg className="w-3.5 h-3.5 mr-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Updated on {updatedLabel ?? todayLabel}
            </div>
          </div>
          {/* Mobile-optimized table with responsive design */}
          <div className="block lg:hidden">
            {mobileStyle === 'table' ? (
              // Minimalist table layout for mobile
              <div className="space-y-3">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Type</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">{cityName}</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">BlueStone</th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">Save</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { type: '18K', chennai: price18k, bluestone: bluestone18k },
                        { type: '22K', chennai: price22k, bluestone: bluestone22k },
                        { type: '24K', chennai: price24k, bluestone: bluestone24k }
                      ].map((row) => (
                        <tr key={row.type} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs font-medium text-gray-900">{row.type}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-600">{formatINR(row.chennai)}</td>
                          <td className="px-3 py-2 text-center text-xs font-semibold text-blue-600">{formatINR(row.bluestone)}</td>
                          <td className="px-3 py-2 text-center text-xs text-green-600 font-medium">{formatINR(row.chennai - row.bluestone)}</td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Mobile Card Layout - Ultra Compact Design
              <div className="space-y-1.5">
                {[
                  { type: '18K', chennai: price18k, bluestone: bluestone18k, savings: price18k - bluestone18k, percent: `${percentDiff(price18k, bluestone18k)?.toFixed(2)}%` },
                  { type: '22K', chennai: price22k, bluestone: bluestone22k, savings: price22k - bluestone22k, percent: `${percentDiff(price22k, bluestone22k)?.toFixed(2)}%` },
                  { type: '24K', chennai: price24k, bluestone: bluestone24k, savings: price24k - bluestone24k, percent: `${percentDiff(price24k, bluestone24k)?.toFixed(2)}%` }
                ].map((row, index) => (
                  <div key={row.type} className="bg-blue-50 rounded-sm p-2 border border-blue-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-semibold text-blue-900 text-sm">{row.type} Gold</span>
                      <span className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">Best Price</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-1.5">
                      <div className="text-center">
                        <div className="text-gray-600 text-xs mb-0.5">{cityName}</div>
                        <div className="text-yellow-700 font-bold text-sm">{formatINR(row.chennai)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600 text-xs mb-0.5">BlueStone</div>
                        <div className="font-bold text-sm" style={{ color: '#032d5f' }}>{formatINR(row.bluestone)}</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center text-green-700 font-semibold text-xs mb-0.5">
                        <svg className="w-3 h-3 mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                        {row.percent} lower
                      </div>
                      <div className="text-green-700 font-bold text-xs">You Save {formatINR(row.savings)}!</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Desktop Table Layout */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg border border-blue-200 shadow-sm text-base">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-blue-900 font-semibold bg-blue-50 whitespace-nowrap text-base">Type</th>
                  <th className="px-4 py-2 text-center text-blue-900 font-semibold bg-blue-50 whitespace-nowrap text-base">{cityName} (per 1g)</th>
                  <th className="px-4 py-2 text-center text-blue-900 font-semibold bg-blue-50 flex items-center justify-center gap-2 whitespace-nowrap text-base">
                    <span>BlueStone (per 1g)</span>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT2F0ldq3U6u3PbDMcZgkjtDWVM1Fgl9QQsA&s" alt="BlueStone Logo" className="w-6 h-6 rounded-full bg-white border border-blue-200 shadow inline-block" />
                  </th>
                  <th className="px-4 py-2 text-center text-blue-900 font-semibold bg-blue-50 whitespace-nowrap text-base">% Difference</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '18K', city: price18k, blue: bluestone18k },
                  { label: '22K', city: price22k, blue: bluestone22k },
                  { label: '24K', city: price24k, blue: bluestone24k },
                ].map((row) => (
                  <tr className="border-b border-blue-100 text-base" key={row.label}>
                    <td className="px-4 py-3 text-blue-800 font-medium">{row.label}</td>
                    <td className="px-4 py-3 text-center text-yellow-700 font-bold text-base">{formatINR(row.city)}</td>
                  <td className="px-4 py-3 text-center font-bold text-base" style={{ color: '#032d5f' }}>
                      {formatINR(row.blue)}
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold align-middle">Best Price</span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold align-middle">
                    <span className="flex flex-col items-center text-green-700 font-bold">
                        <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>{percentDiff(row.city, row.blue)?.toFixed(2)}% lower</span>
                        <span className="text-xs text-green-700 font-semibold mt-1">You Save {formatINR(row.city - row.blue)}!</span>
                    </span>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Right Section - Form - Mobile optimized */}
      {/* Alert Form - 25% width, 100% height */}
      <div className="w-full lg:w-3/12">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 sm:p-4 lg:p-6 h-full" style={{ minHeight: '280px', maxHeight: 'calc(100vh - 2rem)' }}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-3 sm:mb-4">
              <h4 className="text-blue-900 font-bold text-sm sm:text-base mb-1 sm:mb-2">Your Budget, Our Priority!</h4>
              <h3 className="text-blue-900 font-bold text-lg sm:text-xl mb-2 sm:mb-3">SET ALERTS</h3>
              <p className="text-blue-900 text-xs sm:text-sm leading-relaxed">
                We recommend you best products based on your budget and gold price with curated & personalized alerts.
              </p>
            </div>

            {/* Form */}
            <form 
              name="alerts" 
              method="POST" 
              data-netlify="true" 
              netlify-honeypot="bot-field" 
              onSubmit={handleSubmit} 
              className="flex-1 space-y-3 sm:space-y-4"
            >
              {/* Netlify Forms hidden fields */}
              <input type="hidden" name="form-name" value="alerts" />
              <input type="hidden" name="city" value={cityName} />
              <input type="hidden" name="status" value="Active" />
              <p className="hidden">
                <label>
                  Don’t fill this out if you're human:
                  <input name="bot-field" />
                </label>
              </p>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-blue-900 mb-1 sm:mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 000 000 0000"
                  className="w-full px-3 py-2 sm:py-2.5 border border-blue-900 rounded-none text-xs sm:text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-blue-900 mb-1 sm:mb-1.5">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full px-3 py-2 sm:py-2.5 border border-blue-900 rounded-none text-xs sm:text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-blue-900 mb-1 sm:mb-1.5">Set Maximum Budget</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-900 text-xs sm:text-sm">₹</span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-2 sm:py-2.5 border border-blue-900 rounded-none text-xs sm:text-sm focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center mt-3 sm:mt-4 mb-4 sm:mb-6">
                <input
                  type="checkbox"
                  id="alert-checkbox"
                  name="alertType"
                  checked={formData.alertType === 'price_drop'}
                  onChange={(e) => setFormData(prev => ({ ...prev, alertType: e.target.checked ? 'price_drop' : 'none' }))}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-blue-900 border-blue-900 rounded focus:ring-blue-900"
                />
                <label htmlFor="alert-checkbox" className="ml-2 text-xs sm:text-sm text-blue-900">
                  Alert me when gold rates go down
                </label>
              </div>

              {/* Benefits */}
              <div className="space-y-2 sm:space-y-2.5">
                <div className="flex items-center text-xs sm:text-sm text-blue-900">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Real-time price alerts
                </div>
                <div className="flex items-center text-xs sm:text-sm text-blue-900">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Best price guarantee
                </div>
                <div className="flex items-center text-xs sm:text-sm text-blue-900">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Personalized recommendations
                </div>
              </div>

              {/* Submit Message */}
              {submitMessage && (
                <div className={`text-xs sm:text-sm p-2 rounded ${submitMessage.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitMessage}
                </div>
              )}

              {/* Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-500 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-none transition-colors text-xs sm:text-sm focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 mt-auto"
              >
                {isSubmitting ? 'Setting Alert...' : 'Set Alerts'}
                <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldPriceBannerComponent; 
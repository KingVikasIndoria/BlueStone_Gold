import React, { useState, useEffect } from 'react';

const GoldPriceBannerComponent: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = ['/1.jpg', '/2.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 p-2 lg:p-4">
      {/* Left Section - Banner and Gold Price Card */}
      <div className="w-full lg:w-9/12 flex flex-col gap-3 lg:gap-4">
        {/* Banner Carousel - Mobile optimized height */}
        <div className="w-full h-40 sm:h-48 lg:h-64 relative">
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <h2 className="text-xl font-bold text-blue-900 col-span-1">Gold Price/Rate in Chennai</h2>
            <span className="bg-green-100 text-green-900 px-4 py-1 rounded-full flex items-center font-medium text-sm justify-self-end col-span-1">
              <svg className="w-5 h-5 mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
              Live Rates
            </span>
            <div className="text-xs text-blue-700 italic col-span-1">All prices shown are per 1 gram.</div>
            <div className="flex items-center text-xs justify-self-end col-span-1" style={{ color: '#032d5f' }}>
              <svg className="w-5 h-5 mr-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Mon, 30 Jun at 05:37 pm
            </div>
          </div>
          {/* Mobile-optimized table with responsive design */}
          <div className="block lg:hidden">
            {/* Mobile Card Layout */}
            <div className="space-y-3">
              {[
                { type: '18K', chennai: 7295, bluestone: 7220, savings: 75, percent: '1.03%' },
                { type: '22K', chennai: 8915, bluestone: 8825, savings: 90, percent: '1.01%' },
                { type: '24K', chennai: 9726, bluestone: 9626, savings: 100, percent: '1.03%' }
              ].map((row, index) => (
                <div key={row.type} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-blue-900 text-lg">{row.type} Gold</span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">Best Price</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-gray-600 text-sm mb-1">Chennai</div>
                      <div className="text-yellow-700 font-bold text-lg">₹{row.chennai.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-600 text-sm mb-1">BlueStone</div>
                      <div className="font-bold text-lg" style={{ color: '#032d5f' }}>₹{row.bluestone.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center text-green-700 font-semibold text-sm mb-1">
                      <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                      {row.percent} lower
                    </div>
                    <div className="text-green-700 font-bold text-base">You Save ₹{row.savings}!</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop Table Layout */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg border border-blue-200 shadow-sm text-base">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-blue-900 font-semibold bg-blue-50 whitespace-nowrap text-base">Type</th>
                  <th className="px-4 py-2 text-center text-blue-900 font-semibold bg-blue-50 whitespace-nowrap text-base">Chennai (per 1g)</th>
                  <th className="px-4 py-2 text-center text-blue-900 font-semibold bg-blue-50 flex items-center justify-center gap-2 whitespace-nowrap text-base">
                    <span>BlueStone (per 1g)</span>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT2F0ldq3U6u3PbDMcZgkjtDWVM1Fgl9QQsA&s" alt="BlueStone Logo" className="w-6 h-6 rounded-full bg-white border border-blue-200 shadow inline-block" />
                  </th>
                  <th className="px-4 py-2 text-center text-blue-900 font-semibold bg-blue-50 whitespace-nowrap text-base">% Difference</th>
                </tr>
              </thead>
              <tbody>
                {/* 18K Row */}
                <tr className="border-b border-blue-100 text-base">
                  <td className="px-4 py-3 text-blue-800 font-medium">18K</td>
                  <td className="px-4 py-3 text-center text-yellow-700 font-bold text-lg">₹7295</td>
                  <td className="px-4 py-3 text-center font-bold text-lg" style={{ color: '#032d5f' }}>
                    ₹7220
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold align-middle">Best Price</span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold align-middle">
                    <span className="flex flex-col items-center text-green-700 font-bold">
                      <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>1.03% lower</span>
                      <span className="text-xs text-green-700 font-semibold mt-1">You Save ₹75!</span>
                    </span>
                  </td>
                </tr>
                {/* 22K Row */}
                <tr className="border-b border-blue-100 text-base">
                  <td className="px-4 py-3 text-blue-800 font-medium">22K</td>
                  <td className="px-4 py-3 text-center text-yellow-700 font-bold text-lg">₹8915</td>
                  <td className="px-4 py-3 text-center font-bold text-lg" style={{ color: '#032d5f' }}>
                    ₹8825
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold align-middle">Best Price</span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold align-middle">
                    <span className="flex flex-col items-center text-green-700 font-bold">
                      <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>1.01% lower</span>
                      <span className="text-xs text-green-700 font-semibold mt-1">You Save ₹90!</span>
                    </span>
                  </td>
                </tr>
                {/* 24K Row */}
                <tr className="text-base">
                  <td className="px-4 py-3 text-blue-800 font-medium">24K</td>
                  <td className="px-4 py-3 text-center text-yellow-700 font-bold text-lg">₹9726</td>
                  <td className="px-4 py-3 text-center font-bold text-lg" style={{ color: '#032d5f' }}>
                    ₹9626
                    <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold align-middle">Best Price</span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold align-middle">
                    <span className="flex flex-col items-center text-green-700 font-bold">
                      <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>1.03% lower</span>
                      <span className="text-xs text-green-700 font-semibold mt-1">You Save ₹100!</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Right Section - Form - Mobile optimized */}
      <div className="w-full lg:w-3/12 flex flex-col">
        <div className="rounded-xl border border-blue-200 shadow-gold px-3 lg:px-4 py-4 lg:py-6 flex flex-col justify-between bg-white lg:sticky lg:top-4" style={{ minHeight: '350px', maxHeight: 'calc(100vh - 2rem)' }}>
          <div>
            <h3 className="text-base font-bold text-blue-900 mb-4">Your Budget, Our Priority!</h3>
            <div className="text-lg font-bold mb-4 tracking-wide" style={{ color: '#032d5f' }}>SET ALERTS</div>
            <p className="text-xs text-blue-800 mb-6 leading-relaxed">We recommend you best products based on your budget and gold price with curated & personalized alerts.</p>
            <form className="flex flex-col gap-4">
              <label className="text-xs font-medium text-blue-900 flex flex-col gap-2">
                <span className="flex items-center gap-1">
                  Phone Number <span className="text-blue-600">*</span>
                </span>
                                 <input
                   type="tel"
                   placeholder="+91 000 000 0000"
                   className="border border-blue-200 rounded-full px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base lg:text-sm w-full"
                   required
                 />
               </label>
               <label className="text-xs font-medium text-blue-900 flex flex-col gap-2">
                 <span className="flex items-center gap-1">
                   Name <span className="text-blue-600">*</span>
                 </span>
                 <input
                   type="text"
                   placeholder="Name"
                   className="border border-blue-200 rounded-full px-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base lg:text-sm w-full"
                   required
                 />
               </label>
               <label className="text-xs font-medium text-blue-900 flex flex-col gap-2">
                 Set Maximum Budget
                 <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-base">₹</span>
                   <input
                     type="number"
                     placeholder=""
                     className="border border-blue-200 rounded-full pl-8 pr-3 py-3 lg:py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base lg:text-sm w-full"
                   />
                 </div>
               </label>
              <label className="flex items-center gap-2 text-xs text-blue-800 mt-4 mb-6">
                <input type="checkbox" className="accent-blue-600 rounded" />
                Alert me when gold rates go down
              </label>
            </form>
            
            {/* Benefits Section */}
            <div className="mt-4 pt-4 border-t border-blue-100">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs" style={{ color: '#032d5f' }}>
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Real-time price alerts</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: '#032d5f' }}>
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Best price guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: '#032d5f' }}>
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Personalized recommendations</span>
                </div>
              </div>
            </div>
          </div>
                     <button
             type="submit"
             className="text-white font-semibold rounded-full px-4 py-3 lg:py-2 text-base flex items-center justify-center gap-2 transition w-full mt-4 hover:opacity-90"
             style={{ backgroundColor: '#032d5f' }}
           >
            Set Alerts
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoldPriceBannerComponent; 
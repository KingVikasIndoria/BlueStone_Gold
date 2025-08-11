import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';

const faqs = [
  {
    question: 'Where can I get the best quality gold in Bangalore?',
    answer: 'You can purchase the best quality gold in the top retail gold stores in the city. Apart from this, you can also purchase gold at almost all jewellery stores in Bangalore.'
  },
  {
    question: 'What international factors affect the gold rate today in Bangalore?',
    answer: 'Many international factors affect the gold rate in Bangalore since the domestic market of the metal is directly affected by the international bullion market. Crude oil prices, the value of international currencies, etc. play a major role in the silver prices in India and Bangalore.'
  },
  {
    question: 'Which composition of gold is more durable, 22 karat or 24 karat Gold in Bangalore?',
    answer: 'As 22 karat gold has other metals blended, it is considered more durable than 24 karat gold.'
  },
  {
    question: 'What are the different Karat options for buying gold in Bangalore?',
    answer: 'There are different karat options available for buying gold in Bangalore, such as 24 karat which is pure form of gold. There are also 22 karat, 18 karat, 14 karat, and 8 karat gold which has varying purity level. The former variety of gold the gold and alloy are mixed in a ratio of 11:1, while in 18 karat is 75% pure. Compared to the other forms of gold, 14 karat and 8 karat are far less pure.'
  },
  {
    question: 'Why do Gold Prices in Bangalore differ from other cities in India?',
    answer: 'Gold prices are different in other cities across the country than in Bangalore due to various factors. The local tariff, duty charges, state taxes, and making charges vary from one city to another, thereby causing a difference in the prices.'
  },
  {
    question: 'What is the meaning of 916 Hallmarked Gold in Bangalore?',
    answer: 'This form of gold is known for its purity level and is gold of 22 karats purity. The hallmarking signifies that it meets the specified standard set by the Bureau of Indian Standards (BIS).'
  },
  {
    question: 'What are the gold mining firms in Karnataka?',
    answer: 'Some of the gold mining firms in Karnataka are Timco Enterprises, English Indian Clays Limited, Devi Mineral Resource India Private Limited, Bangalore Ceramics, Mehta Dye Chem, Labsil Instruments, Raj Exports, MSPL Limited, Mysore Minerals Limited, and MM Enterprises.'
  },
  {
    question: 'Will the gold price in Bangalore keep changing?',
    answer: 'Yes, the gold price keeps changing due to various factors which include the value of the rupee against the U.S. dollar, the price of crude oil, the trend of the equities market, etc.'
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

const TempFAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-section my-4">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          key="faq-schema"
        />
      </Head>
      <h2 className="text-2xl font-bold text-blue-900 mb-4 mt-1">
        FAQ's on Gold Rate in Bangalore
      </h2>
      <div className="bg-white rounded-xl border border-blue-100">
        {faqs.map((faq, index) => (
          <div key={index} className={`border-b last:border-b-0 border-blue-50`}> 
            <button
              className="w-full flex items-center justify-between px-8 py-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-200 group"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-panel-${index}`}
            >
              <span className="text-lg font-semibold text-blue-900 group-hover:text-blue-700">
                {faq.question}
              </span>
              <ChevronDownIcon
                className={`w-6 h-6 text-blue-400 transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {openIndex === index && (
              <div
                id={`faq-panel-${index}`}
                className="px-8 pb-6 text-blue-800 text-base animate-fadein"
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TempFAQAccordion; 
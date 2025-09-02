import { useMemo, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Head from 'next/head';

interface FAQAccordionProps {
  cityName: string;
  price22k?: number;
  price24k?: number;
}

function formatINR(n?: number) {
  if (typeof n !== 'number' || isNaN(n)) return 'N/A';
  return '₹' + n.toLocaleString('en-IN');
}

const buildFaqs = (city: string, p22?: number, p24?: number) => [
  {
    question: `What is today’s gold rate in ${city} for 24K?`,
    answer: `Based on international trends and local demand, the gold rate changes daily. Gold Price in ${city} for 24k is ${formatINR(p24)}.`
  },
  {
    question: `What is today’s gold rate in ${city} for 22K?`,
    answer: `Based on international trends and local demand, the gold rate changes daily. Gold Price in ${city} for 22k is ${formatINR(p22)}.`
  },
  {
    question: `Is gold cheaper in ${city} compared to other cities?`,
    answer: 'Gold rates are mostly uniform across India since they depend on international prices. Minor differences may occur due to local demand, taxes, and transportation costs.'
  },
  {
    question: 'Which is better for investment: 22K or 24K gold?',
    answer: '22K Gold is best for investment in the form of gold jewellery as it is durable, on the other hand 24K Gold is best for investing in the form of coins, bars, or pure investment.'
  },
  {
    question: `How can I check the purity of gold bought in ${city}?`,
    answer: `Look for BIS hallmarking to check the purity of your gold in ${city}, verify invoice details, and shop only from trusted brands like BlueStone.`
  },
  {
    question: 'Does BlueStone offer buyback on gold jewellery?',
    answer: `Yes, BlueStone offers lifetime exchange and buyback facility on gold jewellery across ${city} and India.`
  },
  {
    question: `What is the impact of GST on gold in ${city}?`,
    answer: 'GST adds 3% on gold value and 5% on making charges of gold, making billing more transparent but slightly increasing final costs of gold.'
  },
  {
    question: 'When is the best time to buy gold?',
    answer: 'Traditionally, people buy gold during Akshaya Tritiya, Diwali, and weddings. However, the best time to buy gold is when gold rates dip.'
  },
  {
    question: `Can I buy gold coins from BlueStone in ${city}?`,
    answer: 'Yes, BlueStone offers certified gold coins and bars which are ideal for investment, gifting, and savings.'
  },
  {
    question: 'Why should I choose BlueStone over local jewellers?',
    answer: 'You should choose BlueStone over local jewellers because it guarantees purity, fair pricing, innovative designs, lifetime buyback, and unmatched convenience, which you can’t find at your local jewellery shop.'
  },
  {
    question: 'How much gram gold makes 1 tola?',
    answer: '1 tola is equivalent to 11.6638 grams of gold. Tola is a unit of mass in the ancient Indian system of weight measure.'
  }
];

const TempFAQAccordion = ({ cityName, price22k, price24k }: FAQAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = useMemo(() => buildFaqs(cityName, price22k, price24k), [cityName, price22k, price24k]);

  const faqSchema = useMemo(() => ({
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
  }), [faqs]);

  return (
    <div className="faq-section my-2">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          key="faq-schema"
        />
      </Head>
      <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 mt-0">
        {`Most Asked Questions on Gold Rate in ${cityName}`}
      </h2>
      <div className="bg-white rounded-xl border border-blue-100">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b last:border-b-0 border-blue-50"> 
            <button
              className="w-full flex items-center justify-between px-4 py-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-200 group"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-panel-${index}`}
            >
              <span className="text-sm sm:text-base md:text-lg font-semibold text-blue-900 group-hover:text-blue-700">
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
                className="px-8 pb-6 text-xs sm:text-sm md:text-base text-blue-800 animate-fadein"
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

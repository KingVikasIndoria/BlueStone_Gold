import Link from 'next/link';

const cityToSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const metroCities = [
  'Mumbai','Delhi','Kolkata','Hyderabad','Chennai','Bangalore','Lucknow','Bhopal','Ahmedabad','Vijayawada','Coimbatore','Jaipur','Kochi','Kanpur','Faridabad','Gurgaon','Madurai','Meerut','Visakhapatnam','Patna','Indore'
];

const otherCapitals = [
  'Srinagar','Bhubaneswar','Chandigarh','Dehradun','Panaji','Raipur','Ranchi','Shimla','Trivandrum'
];

const otherMajorCities = [
  'Guwahati','Kannur','Kozhikode','Kolhapur','Ludhiana','Mangalore','Malappuram','Mysore','Nagpur','Pondicherry','Pune','Salem','Surat','Trichy','Anantapur','Patiala','Daman and Diu','Pimpri Chinchwad','Kalyan-Dombivli','Tiruppur'
];

const states = [
  'Andhra Pradesh','Uttar Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttarakhand','West Bengal'
];

const InterlinkingLinks = () => {
  return (
    <section className="w-full px-2 lg:px-8 py-3 lg:py-0 text-[12px] lg:text-[14px]" style={{ fontFamily: 'Muli, Arial, sans-serif' }}>
      <div className="info-card bg-white rounded-xl border border-blue-100 shadow p-3 lg:p-4">
        <h3 className="text-blue-900 font-bold text-[11px] lg:text-[13px] mb-3">Gold Rate in Metro Cities</h3>
        <div className="space-y-4">
          {/* Metro cities */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {metroCities.map((c) => (
                <Link key={c} href={`/cities/${cityToSlug(c)}`} className="text-blue-700 hover:text-blue-900 no-underline hover:no-underline" style={{ textDecoration: 'none', borderBottom: 'none' }}>
                  {`Gold Rate in ${c}`}
                </Link>
              ))}
            </div>
          </div>

          {/* Other capitals */}
          <div>
            <h3 className="text-blue-900 font-bold text-[11px] lg:text-[13px] mb-3">Gold Rate in Other Capitals</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {otherCapitals.map((c) => (
                <Link key={c} href={`/cities/${cityToSlug(c)}`} className="text-blue-700 hover:text-blue-900 no-underline hover:no-underline" style={{ textDecoration: 'none', borderBottom: 'none' }}>
                  {`Gold Rate in ${c}`}
                </Link>
              ))}
            </div>
          </div>

          {/* Other major cities */}
          <div>
            <h3 className="text-blue-900 font-bold text-[11px] lg:text-[13px] mb-3">Gold Rate in Other Major Cities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {otherMajorCities.map((c) => (
                <Link key={c} href={`/cities/${cityToSlug(c)}`} className="text-blue-700 hover:text-blue-900 no-underline hover:no-underline" style={{ textDecoration: 'none', borderBottom: 'none' }}>
                  {`Gold Rate in ${c}`}
                </Link>
              ))}
            </div>
          </div>

          {/* States */}
          <div>
            <h3 className="text-blue-900 font-bold text-[11px] lg:text-[13px] mb-3">Gold Rate in States</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {states.map((s) => (
                <Link key={s} href={`/states/${cityToSlug(s)}`} className="text-blue-700 hover:text-blue-900 no-underline hover:no-underline" style={{ textDecoration: 'none', borderBottom: 'none' }}>
                  {`Gold Rate in ${s}`}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterlinkingLinks;

import SEO from "../../../shared/components/SEO.jsx";

export default function Disclaimer() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Legal & Tax Disclaimer | FilingBy.com"
        description="FilingBy.com legal disclaimer. Important information regarding professional CA/CS assistance, general informational content, government filings, and legal limitations."
        canonical="/default/disclaimer"
        noindex={false}
      />
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="border-b border-gray-100 pb-6">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Legal Notice</span>
          <h1 className="text-3xl font-black text-gray-900 mt-3">Legal & Tax Disclaimer</h1>
          <p className="text-xs text-gray-500 mt-2">Last Updated: July 2026 | General Information & Professional Advisory Scope</p>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-6 font-normal">
          <p className="bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-900 rounded-r-2xl font-medium">
            <strong>Important Notice:</strong> Content published on FilingBy.com, including articles, calculators, guides, and legal templates, is provided for general informational and educational purposes only and does not constitute formal legal, tax, financial, or accounting advice.
          </p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">1. Professional Advisory Boundaries</h2>
            <p>
              While FilingBy collaborates with qualified Chartered Accountants (CAs), Company Secretaries (CSs), and tax professionals to assist with administrative filings, browsing this website or utilizing our calculators does not automatically establish a formal professional-client relationship.
            </p>
            <p>
              Tax laws, statutory regulations, and government filing procedures in India change frequently. Users must verify specific facts with qualified professionals or official government portals (MCA, GSTN, Income Tax India) before taking financial or corporate decisions based on general web guides.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">2. Government Affiliation Disclaimer</h2>
            <p>
              FilingBy.com is a private technology platform and independent service provider. FilingBy is <strong>NOT affiliated with, endorsed by, or an official agency of</strong> the Ministry of Corporate Affairs (MCA), Goods and Services Tax Network (GSTN), Income Tax Department of India, Controller General of Patents Designs and Trade Marks (CGPDTM), or any central/state government department.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">3. Calculator & Estimation Tool Limitations</h2>
            <p>
              Calculators provided on this platform (such as GST Inclusive/Exclusive calculators, Income Tax regime comparison tools, HRA calculators, and ROC late fee estimators) yield estimates based on standardized mathematical formulas and user inputs. Actual tax liabilities or statutory late fees imposed by government authorities may vary depending on individual case details and specific statutory conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">4. External Links & Third-Party References</h2>
            <p>
              FilingBy.com may contain links to external government portals, statutory acts, or reference resources. FilingBy assumes no responsibility for the accuracy, availability, or content of third-party websites.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

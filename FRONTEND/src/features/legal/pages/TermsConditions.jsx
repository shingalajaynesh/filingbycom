import SEO from "../../../shared/components/SEO.jsx";

export default function TermsConditions() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Terms and Conditions | FilingBy Business Services"
        description="Read FilingBy.com Terms and Conditions governing online CA services, business registrations, tax filing support, and virtual office workspace agreements."
        canonical="/terms-conditions"
        noindex={false}
      />
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="border-b border-gray-100 pb-6">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Legal Documentation</span>
          <h1 className="text-3xl font-black text-gray-900 mt-3">Terms and Conditions</h1>
          <p className="text-xs text-gray-500 mt-2">Last Updated: July 2026 | Governing Terms for FilingBy Platform Services</p>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-6 font-normal">
          <p>
            Welcome to FilingBy.com (the "Platform", "Website", "We", "Us"). By accessing our portal, engaging our Chartered Accountant (CA) or Company Secretary (CS) consultation tools, ordering virtual office addresses, or submitting corporate documents, you ("User", "Client", "Business Entity") explicitly agree to be bound by these Terms and Conditions. Please review them carefully before initiating any service request.
          </p>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">1. Scope of Services</h2>
            <p>
              FilingBy provides digital compliance management, business incorporation guidance, GST registration facilitation, income tax return (ITR) filing support, ROC annual return assistance, legal document templates, and virtual office workspace address licensing across India. 
            </p>
            <p>
              All virtual office leases include legal No Objection Certificates (NOC), registered owner utility bills, and commercial rent agreements formatted for submission to the Ministry of Corporate Affairs (MCA), Commercial Tax Department (GSTN), and statutory authorities. Temporary physical audit desks and conference room slots are made available strictly during scheduled statutory verification inspections.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">2. User Responsibilities & Statutory KYC Obligations</h2>
            <p>
              Clients are solely responsible for ensuring the authenticity, legality, and accuracy of all identification documents (PAN, Aadhaar, Board Resolutions, Business Licenses) uploaded to FilingBy. 
            </p>
            <p>
              FilingBy acts as a professional administrative facilitator and virtual workspace licensor. We do not assume liability for illegal commercial activities, tax evasion, fraudulent filings, or corporate defaults conducted by the Client using registered addresses or filed returns.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">3. Subscription Tenure & Renewal Rules</h2>
            <p>
              Virtual office address license agreements are issued for a standard tenure of 12 or 24 months, unless explicitly negotiated under a custom enterprise agreement.
            </p>
            <p>
              Lease renewals must be finalized and paid at least thirty (30) days prior to the expiration date. Failure to renew in a timely manner entitles FilingBy and the property owner to issue an NOC revocation notice to the GST department and MCA registrar, which may result in automated statutory suspension or deregistration of the registered entity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">4. Intellectual Property & Document Security</h2>
            <p>
              All software modules, legal template engines, compliance calculators, graphics, brand assets, and platform text on FilingBy.com are protected under Indian intellectual property laws. Users may download generated legal contracts for internal business execution but may not duplicate or resell platform resources commercially.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, FilingBy.com, its directors, officers, employee CAs/CSs, and property partners shall not be held liable for any indirect, incidental, consequential, or penalty-based damages arising from statutory delays caused by government server downtime, portal outages on MCA/GSTN/Income Tax platforms, or client delays in submitting required verification documents.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-950 uppercase tracking-wide border-l-4 border-blue-600 pl-3">6. Governing Law & Dispute Jurisdiction</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any legal disputes or claims arising out of or in connection with our services shall be subject to the exclusive jurisdiction of the courts located in Surat, Gujarat, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

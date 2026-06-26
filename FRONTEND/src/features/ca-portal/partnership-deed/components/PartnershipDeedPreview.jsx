import { useMemo } from "react";

const DOT_PLACEHOLDER = "................................";

function valueOrDots(value, fallback = DOT_PLACEHOLDER) {
  const text = value == null ? "" : String(value).trim();
  return text ? text : fallback;
}

function upperOrDots(value, fallback = DOT_PLACEHOLDER) {
  const text = value == null ? "" : String(value).trim();
  return text ? text.toUpperCase() : fallback;
}

function getOrdinalWord(num) {
  const ordinals = [
    "FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH",
    "SIXTH", "SEVENTH", "EIGHTH", "NINTH", "TENTH",
    "ELEVENTH", "TWELFTH", "THIRTEENTH", "FOURTEENTH", "FIFTEENTH"
  ];
  return ordinals[num - 1] || `${num}TH`;
}

function getCardinalWord(num) {
  const cardinals = [
    "one", "two", "three", "four", "five",
    "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen"
  ];
  return cardinals[num - 1] || String(num);
}

function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
}

function formatLegalDate(dateInput) {
  if (!dateInput) return "……… Day of ___________ 20___";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "……… Day of ___________ 20___";

  const day = date.getDate();
  const year = date.getFullYear();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = months[date.getMonth()];

  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";

  return `${day}${suffix} Day of ${monthName} ${year}`;
}

function extractCityFromAddress(address) {
  if (!address || address === DOT_PLACEHOLDER) return DOT_PLACEHOLDER;

  const parts = String(address).split(",");
  if (parts.length > 1) {
    return parts[parts.length - 2].replace(/\d+/g, "").trim().toUpperCase() || DOT_PLACEHOLDER;
  }

  return String(address).replace(/\d+/g, "").trim().toUpperCase() || DOT_PLACEHOLDER;
}

export default function PartnershipDeedPreview({ formData }) {
  const formattedDate = useMemo(() => formatLegalDate(formData.deedDate), [formData.deedDate]);

  const totalShare = useMemo(() => {
    return formData.partners.reduce((sum, p) => sum + Number(p.profitSharePercent || 0), 0);
  }, [formData.partners]);

  const managingPartnersJoined = useMemo(() => {
    const list = formData.partners.filter((p) => p.isManagingPartner).map((p) => p.fullName || "___________");
    const final = list.length > 0 ? list : formData.partners.map((p) => p.fullName || "___________");
    return final.join(" AND ").toUpperCase();
  }, [formData.partners]);

  const bankOperatorsJoined = useMemo(() => {
    const list = formData.partners.filter((p) => p.canOperateBankAccount).map((p) => p.fullName || "___________");
    const final = list.length > 0 ? list : formData.partners.map((p) => p.fullName || "___________");
    return final.join(" AND ").toUpperCase();
  }, [formData.partners]);

  const businessName = upperOrDots(formData.businessName);
  const businessActivity = valueOrDots(formData.businessActivity);
  const officeAddress = valueOrDots(formData.officeAddress);
  const cityLine = extractCityFromAddress(formData.officeAddress);
  const witnessLine = "_____________________________________";

  let clauseNum = 1;
  const getClauseNumber = () => `${clauseNum++}. `;

  const PageBreakSeparator = () => (
    <div className="my-8 border-t-2 border-dashed border-gray-300 relative select-none w-full">
      <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Page Break
      </span>
    </div>
  );

  return (
    <div className="bg-slate-100 rounded-2xl p-4 md:p-6 border border-gray-300 h-[calc(100vh-180px)] overflow-y-auto shadow-inner flex flex-col items-center">
      <div className="text-center mb-4 w-full">
        <span className="text-[10px] uppercase font-bold text-gray-550 bg-gray-200 px-3 py-1 rounded-full">
          Real-Time Draft Preview (Read-Only)
        </span>
      </div>

      <div
        className="bg-white border border-gray-300 shadow-md select-none text-[#000000] text-justify"
        style={{
          width: "612pt",
          minHeight: "1008pt",
          paddingTop: "69.8pt",
          paddingBottom: "69.8pt",
          paddingLeft: "90.1pt",
          paddingRight: "90pt",
          fontFamily: 'Cambria, "Liberation Serif", Caladea, serif',
          fontSize: "12.7pt",
          lineHeight: "22.3pt",
          background: "#ffffff",
        }}
      >
        {/* Cover Page */}
        <div
          className="relative text-center select-none"
          style={{
            width: "612pt",
            height: "1008pt",
            margin: "-69.8pt -90pt -69.8pt -90.1pt",
            padding: 0,
            background: "#ffffff",
          }}
        >
          <div style={{
            position: "absolute",
            top: "340.9pt",
            left: 0,
            width: "612pt",
            textAlign: "center",
            fontSize: "21.2pt",
            fontWeight: "bold",
            textTransform: "uppercase",
            lineHeight: 1.2
          }}>
            {businessName}
          </div>
          <div style={{
            position: "absolute",
            top: "390.7pt",
            left: 0,
            width: "612pt",
            textAlign: "center",
            fontSize: "21.2pt",
            fontWeight: "bold",
            textTransform: "uppercase",
            lineHeight: 1.2
          }}>
            PARTNERSHIP DEED
          </div>
          <div style={{
            position: "absolute",
            top: "439.2pt",
            left: "90pt",
            width: "432pt",
            textAlign: "center",
            fontSize: "12.7pt",
            fontWeight: "bold",
            lineHeight: "22.3pt"
          }}>
            Address: {officeAddress}
          </div>
        </div>

        <PageBreakSeparator />

        <div className="content-container w-full">
          <h1 style={{ fontSize: "17pt", fontWeight: "bold", textAlign: "center", margin: 0, marginBottom: "31.8pt", lineHeight: 1.2 }}>
            Deed of Partnership
          </h1>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            This deed of partnership is made on <strong>{formattedDate}</strong> between:
          </p>
          
          <div style={{ margin: 0, marginBottom: "22.3pt" }}>
            {formData.partners.map((partner, idx) => {
              const ordinal = getOrdinalWord(idx + 1);
              const fullName = upperOrDots(partner.fullName);
              const address = valueOrDots(partner.address);

              if (partner.type === "company") {
                const companyName = upperOrDots(partner.companyName);
                return (
                  <p key={partner.id} style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
                    {idx + 1}.<strong>{fullName}</strong>, Nominee Director of <strong>{companyName}</strong>, residing at <strong>{address}</strong> hereinafter referred to as <strong>{ordinal} PARTNER</strong>.
                  </p>
                );
              }

              const fatherName = upperOrDots(partner.fatherName);
              return (
                <p key={partner.id} style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
                  {idx + 1}.<strong>{fullName}</strong>, son of <strong>{fatherName}</strong>, residing at <strong>{address}</strong> hereinafter referred to as <strong>{ordinal} PARTNER</strong>.
                </p>
              );
            })}
          </div>

          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            Whereas, the parties hereto have agreed to commence business in partnership among themselves with the effect from the date of this presents a business interalia {businessActivity} under the name and style of <strong>M/S. {businessName}</strong>, having its office at <strong>{officeAddress}</strong> and it is expedient to have written instrument of partnership. Now this partnership deed witnesses as follows:
          </p>

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, marginTop: "22.3pt", lineHeight: "22.3pt" }}>
            {getClauseNumber()}NAME OF BUSINESS
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            <strong>“M/S. {businessName}”</strong>
          </p>

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, marginTop: "22.3pt", lineHeight: "22.3pt" }}>
            {getClauseNumber()}BUSINESS ACTIVITY
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            The parties here to have mutually agreed to carry on the business of ALL TYPES OF {businessActivity.toUpperCase()} services.
          </p>

          <PageBreakSeparator />

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, lineHeight: "22.3pt" }}>
            {getClauseNumber()}PLACE OF BUSINESS
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            The principal place of the partnership business will be situated at <strong>{officeAddress}</strong>
          </p>

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, marginTop: "22.3pt", lineHeight: "22.3pt" }}>
            {getClauseNumber()}DURATION OF PARTNERSHIP
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            The duration of the partnership will be at will.
          </p>

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, marginTop: "22.3pt", lineHeight: "22.3pt" }}>
            {getClauseNumber()}CAPITAL OF THE FIRM
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            That the capital required for the partnership shall be contributed by the partners as mutually agreed upon amongst the partners. A simple interest @12% p.a. shall be payable by the firm to the partners on their capital contribution.
          </p>

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, marginTop: "22.3pt", lineHeight: "22.3pt" }}>
            {getClauseNumber()}PROFIT SHARING RATIO
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            The profit or loss of the firm shall be shared as per following ratio among all the partners and transferred to partner’s current account.
          </p>

          <div style={{ marginTop: 0, marginBottom: "22.3pt" }}>
            <div style={{
              fontSize: "14.8pt",
              lineHeight: "19.1pt",
              marginLeft: "14.5pt",
              width: "443.4pt",
              minWidth: "443.4pt",
            }}>
              {formData.partners.map((partner, idx) => {
                const ordinalNum = idx + 1;
                const ordinalSuffix = getOrdinalSuffix(ordinalNum).replace(String(ordinalNum), "");
                const isCompany = partner.type === "company";

                return (
                  <div key={partner.id} style={{ display: "flex", marginBottom: isCompany ? "10.6pt" : 0 }}>
                    <div style={{ width: "77pt", minWidth: "77pt", flexShrink: 0 }}>
                      {ordinalNum}<sup style={{ fontSize: "10.6pt", verticalAlign: "super" }}>{ordinalSuffix}</sup> Partner
                    </div>
                    <div style={{ width: "320pt", minWidth: "320pt", flexShrink: 0 }}>
                      {isCompany ? (
                        <>
                          <strong>{upperOrDots(partner.companyName)}</strong>
                          <br />
                          {upperOrDots(partner.fullName)} (Director )
                        </>
                      ) : (
                        <strong>{upperOrDots(partner.fullName)}</strong>
                      )}
                    </div>
                    <div style={{ width: "46.4pt", minWidth: "46.4pt", textAlign: "right", flexShrink: 0 }}>
                      {Number(partner.profitSharePercent || 0).toFixed(2)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, marginTop: "22.3pt", lineHeight: "22.3pt" }}>
            {getClauseNumber()}MANAGEMENT
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            The <strong>{managingPartnersJoined}</strong> shall be Managing Partner and he will look after all the day to day transaction of the firm and any legal activities in the name of the firm and the remaining partners shall co-operate to do so.
          </p>

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, marginTop: "22.3pt", lineHeight: "22.3pt" }}>
            {getClauseNumber()}OPERATION OF BANK ACCOUNTS
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            The firm shall open a current account in the name of <strong>M/S. {businessName}</strong>, at any bank and such account shall be operated by <strong>{bankOperatorsJoined}</strong> as declared from time to time to the Banks.
          </p>

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, marginTop: "22.3pt", lineHeight: "22.3pt" }}>
            {getClauseNumber()}BORROWING
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            The written consent of all Partners will be required for the partnership to avail credit facilities from any financial institution.
          </p>

          <PageBreakSeparator />

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, lineHeight: "22.3pt" }}>
            {getClauseNumber()}ACCOUNTS
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            The firms shall regularly maintain in the ordinary course of business, true and correct accounts of all its transactions and also of all its assets and liabilities, the property books of account, which shall ordinarily be kept at the firm’s place of business. The accounting year shall be the financial year from 1st April onwards and the balance sheet shall be properly audited and the same shall be signed by all the Partners. Every Partner shall have access to the books and the right to verify their correctness.
          </p>

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, marginTop: "22.3pt", lineHeight: "22.3pt" }}>
            {getClauseNumber()}Remuneration to partners:-
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            We, the partners, have agreed to act as active partners. Also we partners who are acting as working partners of this partnership firm of ours and looking after the day to day running of the business and working in the partnership are entitled to remuneration as mentioned below.
          </p>

          <div style={{ marginTop: 0, marginBottom: 0 }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12.7pt",
              marginBottom: "22.3pt",
              border: "1px solid #000000"
            }}>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #000000", padding: "6.4pt 10.6pt", verticalAlign: "top", lineHeight: "22.3pt" }}>
                    1. If loss or Rs. 6,00,000/- in case of annual book profit (accounting profit).
                  </td>
                  <td style={{ border: "1px solid #000000", padding: "6.4pt 10.6pt", verticalAlign: "top", lineHeight: "22.3pt" }}>
                    Rs. 3,00,000/- or 90% of book profit whichever is higher,
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #000000", padding: "6.4pt 10.6pt", verticalAlign: "top", lineHeight: "22.3pt" }}>
                    2. Rs. 6,00,000/- above book profit
                  </td>
                  <td style={{ border: "1px solid #000000", padding: "6.4pt 10.6pt", verticalAlign: "top", lineHeight: "22.3pt" }}>
                    60% of book profit
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            (a) Annual remuneration of each partner to be apportioned according to the percentage of income of the partnership firm as per the share of profit and loss of that partner.
          </p>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            (b) For the calculation of the amount mentioned above, the income as per Explanation 3 of Section: 40(b) of the Income-tax Act or the provisions which are subject to that assessment year and the amendments thereto have to be taken into account.
          </p>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            (c) If the partnership firm has suffered loss in computing the income as per the provisions of the Income Tax Act as mentioned in Clause No. (b) above, then the partners shall not be entitled to remuneration in that case.
          </p>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            (d) Partners in a partnership firm may increase or decrease the amount of remuneration to the amount specified above. Also, the working partners of the entire party shall not be able to alter or change the method of calculation of remuneration mentioned in (a) above.
          </p>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            (e) It is decided to pay remuneration to the working partners for being active in the partnership firm. The amount of their remuneration has to be deposited with them at the end of the fiscal year when the accounts of the firm are to be finalized and will be eligible to pay remuneration as mentioned in No. (a) above.
          </p>

          <PageBreakSeparator />

          <p style={{ textAlign: "justify", margin: 0, lineHeight: "22.3pt" }}>
            (f) Active partners may withdraw their remuneration as working partners during the accounting year. Any amount deposited in the capital of the respective partners and against their current capital or against their interest in the profits of that accounting year can be withdrawn by all the parties as determined.
          </p>

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, marginTop: "22.3pt", lineHeight: "22.3pt" }}>
            {getClauseNumber()}RETIREMENT
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            If any partner shall at anytime during the subsistence of the partnership, be desirous of retiring from the firm, it shall be competent from his to do so, provided he shall give at least one calendar month notice of his intention of doing so. The remaining partner shall pay to the retiring partner or his legal representatives of the deceased partner, the purchase money of his share in the assets of the firm.
          </p>

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, marginTop: "22.3pt", lineHeight: "22.3pt" }}>
            {getClauseNumber()}DEATH OF PARTNER
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            In the event of the death of any partners, one of the legal representatives of the deceased partner shall become the partner of the firm and in the event the legal representative show their denial to point the firm, they shall be paid the part of the part of the purchase amount calculated as on the date of the death of the partner.
          </p>

          <h2 style={{ fontSize: "12.7pt", fontWeight: "bold", textTransform: "uppercase", margin: 0, marginTop: "22.3pt", lineHeight: "22.3pt" }}>
            {getClauseNumber()}ARBITRATION
          </h2>
          <p style={{ textAlign: "justify", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
            Whenever there be any difference of opinion or any dispute between the partners the partners shall refer the same to an arbitration of one person. The decision of the arbitration so nominated shall be final and binding on all partners, such arbitration proceedings shall be governed by Indian Arbitration Act, which is in force.
          </p>

          <p style={{ textAlign: "justify", margin: 0, lineHeight: "22.3pt" }}>
            <strong>{getClauseNumber()}</strong>That the provisions of the INDIAN PARTNERSHIP ACT 1932, shall apply as regards matters not expressly provided for hereinbefore in this partnership deed.
          </p>
          <p style={{ textAlign: "justify", margin: 0, lineHeight: "22.3pt" }}>
            <strong>{getClauseNumber()}</strong>That the matters for which no provisions have been made in this deed may be decided upon by mutual consent of the parties in writing.
          </p>

          <p style={{ textAlign: "justify", margin: 0, lineHeight: "22.3pt" }}>…………………………..</p>
          <p style={{ textAlign: "justify", margin: 0, lineHeight: "22.3pt" }}><strong>{cityLine}</strong></p>

          <PageBreakSeparator />

          <p style={{ textAlign: "justify", margin: 0, lineHeight: "22.3pt" }}>
            In witness whereof, this deed of partnership is signed sealed and delivered this <strong>{formattedDate}</strong> at <strong>{officeAddress}</strong>.
          </p>

          <div style={{ marginTop: 0 }}>
            {formData.partners.map((partner, idx) => {
              const ordinal = getOrdinalWord(idx + 1);
              const fullName = upperOrDots(partner.fullName);
              const isCompany = partner.type === "company";
              const marginTop = idx === 0 ? "44.5pt" : "65.7pt";

              return (
                <div key={partner.id} style={{ marginTop, pageBreakInside: "avoid" }}>
                  <p style={{ fontWeight: "bold", margin: 0, textTransform: "uppercase", lineHeight: "22.3pt" }}>
                    <strong>{ordinal} PARTNER</strong>
                  </p>
                  {isCompany ? (
                    <>
                      <p style={{ fontWeight: "bold", margin: 0, textTransform: "uppercase", lineHeight: "22.3pt" }}>
                        <strong>{upperOrDots(partner.companyName)}</strong>
                      </p>
                      <p style={{ fontWeight: "bold", margin: 0, textTransform: "uppercase", lineHeight: "22.3pt" }}>
                        <strong>{fullName}</strong>
                      </p>
                      <p style={{ fontWeight: "normal", margin: 0, textTransform: "uppercase", lineHeight: "22.3pt" }}>
                        (AUTHORIZE NOMINEE DIRECTOR)
                      </p>
                    </>
                  ) : (
                    <p style={{ fontWeight: "bold", margin: 0, textTransform: "uppercase", lineHeight: "22.3pt" }}>
                      <strong>{fullName}</strong>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "65.7pt", pageBreakInside: "avoid" }}>
            <p style={{ fontWeight: "bold", margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>
              <strong>WITNESS:</strong>
            </p>
            <p style={{ margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>1.</p>
            <p style={{ margin: 0, marginBottom: "22.3pt", lineHeight: "22.3pt" }}>2.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

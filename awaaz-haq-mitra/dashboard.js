/**
 * AWAAZ — "Haq Mitra" (My Rights Friend)
 * Caseworker Dashboard Management & Application Draft Generator
 */

class CaseworkerDashboard {
  constructor(schemesList) {
    this.schemes = schemesList;
    this.cases = [
      {
        id: "case-001",
        name: "Ramesh Kumar",
        age: 38,
        gender: "male",
        state: "Uttar Pradesh",
        occupation: "farmer",
        landholding: 1.2,
        annualIncome: 80000,
        category: "OBC",
        isBpl: true,
        isPregnant: true, // Wife pregnant
        hasConcreteHouse: false,
        hasLpgConnection: false,
        hasGovtPension: false,
        isTaxPayer: false,
        phone: "+91 98452 10293",
        aadhaar: "4820 1928 3049",
        rationCard: "UP-R-84920194",
        bankName: "State Bank of India",
        bankAcc: "30491829304",
        bankIfsc: "SBIN0001048",
        district: "Gorakhpur",
        village: "Pipraich",
        documents: {
          "Aadhaar Card": true,
          "Land Ownership Documents (Khatauni/Patta)": false, // Missing
          "Bank Account Passbook": true,
          "Mobile Number linked with Aadhaar": true,
          "Identity Proof": true,
          "Ration Card (BPL/NFSA)": true,
          "Income Certificate": false, // Missing
          "Family Identity Document": true,
          "MCP Card (Mother and Child Protection Card)": true
        }
      },
      {
        id: "case-002",
        name: "Savitri Bai",
        age: 62,
        gender: "female",
        state: "Maharashtra",
        occupation: "domestic_worker",
        landholding: 0,
        annualIncome: 18000,
        category: "SC",
        isBpl: true,
        isPregnant: false,
        hasConcreteHouse: false,
        hasLpgConnection: false,
        hasGovtPension: false,
        isTaxPayer: false,
        isWidow: true,
        phone: "+91 94210 58291",
        aadhaar: "8392 0184 9283",
        rationCard: "MH-B-3049102",
        bankName: "Bank of Maharashtra",
        bankAcc: "60293849102",
        bankIfsc: "MAHB0000492",
        district: "Satara",
        village: "Karad",
        documents: {
          "Age Certificate (Minimum 60 years unless disabled/widow)": true,
          "Income Certificate (Family income below ₹21,000/year)": true,
          "Residence Certificate of Maharashtra (15 years)": false, // Missing
          "Disability Certificate (if claiming under disability)": false, // N/A
          "BPL Card": true,
          "Aadhaar Card": true,
          "Bank Account Passbook": true
        }
      },
      {
        id: "case-003",
        name: "Anitha Devi",
        age: 30,
        gender: "female",
        state: "Tamil Nadu",
        occupation: "laborer",
        landholding: 0,
        annualIncome: 60000,
        category: "ST",
        isBpl: true,
        isPregnant: false,
        hasConcreteHouse: false,
        hasLpgConnection: false,
        hasGovtPension: false,
        isTaxPayer: false,
        phone: "+91 91760 93021",
        aadhaar: "9048 2938 1029",
        rationCard: "TN-A-9402948",
        bankName: "Indian Bank",
        bankAcc: "50192838492",
        bankIfsc: "IDIB000T049",
        district: "Salem",
        village: "Omalur",
        documents: {
          "Aadhaar Card": true,
          "Bank Account Passbook": true,
          "Ration Card issued by State Govt": true,
          "BPL Certificate / Caste Certificate (for SC/ST)": true,
          "Address Proof": true
        }
      }
    ];

    this.activeCaseId = "case-001";
  }

  getActiveCase() {
    return this.cases.find(c => c.id === this.activeCaseId) || this.cases[0];
  }

  setActiveCase(caseId) {
    this.activeCaseId = caseId;
  }

  updateCaseDocumentStatus(caseId, docName, status) {
    const caseObj = this.cases.find(c => c.id === caseId);
    if (caseObj && caseObj.documents) {
      caseObj.documents[docName] = status;
    }
  }

  addCaseFromProfile(profile) {
    // Generate new unique ID
    const newId = `case-${String(this.cases.length + 1).padStart(3, "0")}`;
    
    // Build initial document mapping based on all matched schemes
    const documents = {
      "Aadhaar Card": true,
      "Bank Account Passbook": false
    };
    
    const matchedSchemes = this.schemes.filter(s => s.eligibilityRules.check(profile));
    matchedSchemes.forEach(s => {
      s.requiredDocuments.forEach(doc => {
        if (!(doc in documents)) {
          documents[doc] = false; // Default to unverified/missing
        }
      });
    });

    const newCase = {
      id: newId,
      name: profile.name || "Unknown Beneficiary",
      age: profile.age || 35,
      gender: profile.gender || "male",
      state: profile.state || "Uttar Pradesh",
      occupation: profile.occupation || "other",
      landholding: profile.landholding || 0,
      annualIncome: profile.annualIncome || 60000,
      category: profile.category || "General",
      isBpl: profile.isBpl || false,
      isPregnant: profile.isPregnant || false,
      isDisabled: profile.isDisabled || false,
      hasConcreteHouse: profile.hasConcreteHouse !== undefined ? profile.hasConcreteHouse : true,
      hasLpgConnection: profile.hasLpgConnection || false,
      hasGovtPension: profile.hasGovtPension || false,
      isTaxPayer: profile.isTaxPayer || false,
      isWidow: profile.isWidow || false,
      phone: profile.phone || "+91 99000 00000",
      aadhaar: profile.aadhaar || "XXXX XXXX XXXX",
      rationCard: profile.rationCard || "Not Provided",
      bankName: profile.bankName || "Enter Bank Name",
      bankAcc: profile.bankAcc || "XXXXXX",
      bankIfsc: profile.bankIfsc || "XXXX0000000",
      district: profile.district || "Select District",
      village: profile.village || "Enter Village",
      documents: documents
    };

    this.cases.unshift(newCase); // Add to beginning of array
    this.activeCaseId = newId;
    return newCase;
  }

  // Generate HTML for prefilled forms dynamically
  generatePrefilledFormHTML(caseObj, scheme) {
    if (!caseObj || !scheme) return "";

    let formFieldsHTML = "";
    scheme.formFields.forEach(field => {
      let val = "";
      
      // Auto-mapping heuristics
      if (field.id.includes("name") || field.id.includes("applicant")) {
        val = caseObj.name;
      } else if (field.id === "age_proof") {
        val = caseObj.age;
      } else if (field.id === "land_area") {
        val = caseObj.landholding;
      } else if (field.id === "bank_name") {
        val = caseObj.bankName;
      } else if (field.id === "bank_acc") {
        val = caseObj.bankAcc;
      } else if (field.id === "bank_ifsc") {
        val = caseObj.bankIfsc;
      } else if (field.id === "ration_card_no") {
        val = caseObj.rationCard;
      } else if (field.id === "caste_category") {
        val = caseObj.category;
      }

      if (field.type === "select") {
        const optionsHTML = (field.options || []).map(opt => 
          `<option value="${opt}" ${opt.toLowerCase() === String(val).toLowerCase() ? "selected" : ""}>${opt}</option>`
        ).join("");
        formFieldsHTML += `
          <div class="form-group">
            <label for="form-${field.id}">${field.label}</label>
            <select id="form-${field.id}" name="${field.id}">${optionsHTML}</select>
          </div>
        `;
      } else {
        formFieldsHTML += `
          <div class="form-group">
            <label for="form-${field.id}">${field.label}</label>
            <input type="${field.type}" id="form-${field.id}" name="${field.id}" value="${val}" placeholder="Not Provided">
          </div>
        `;
      }
    });

    return `
      <div class="official-draft-container">
        <div class="government-header">
          <div class="emblem-placeholder">🇮🇳</div>
          <h2>GOVERNMENT OF INDIA / GOVERNMENT OF ${caseObj.state.toUpperCase()}</h2>
          <h3>APPLICATION FORM DRAFT — PRE-FILLED BY AWAAZ</h3>
          <p class="form-subtitle">Scheme: ${scheme.name}</p>
        </div>

        <hr class="form-divider">

        <div class="form-metadata-grid">
          <div><strong>Case ID:</strong> ${caseObj.id}</div>
          <div><strong>Status:</strong> Draft Generated</div>
          <div><strong>Language:</strong> English (Vernacular Original)</div>
          <div><strong>Assisted By:</strong> Caseworker Portal</div>
        </div>

        <h4 class="section-title">1. Personal & Demographic Details</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Applicant Full Name</label>
            <input type="text" value="${caseObj.name}" readonly>
          </div>
          <div class="form-group">
            <label>Mobile Number</label>
            <input type="text" value="${caseObj.phone}" readonly>
          </div>
          <div class="form-group">
            <label>Aadhaar Number</label>
            <input type="text" value="${caseObj.aadhaar}" readonly>
          </div>
          <div class="form-group">
            <label>Ration Card Number</label>
            <input type="text" value="${caseObj.rationCard}" readonly>
          </div>
          <div class="form-group">
            <label>State of Residence</label>
            <input type="text" value="${caseObj.state}" readonly>
          </div>
          <div class="form-group">
            <label>District</label>
            <input type="text" value="${caseObj.district}" readonly>
          </div>
          <div class="form-group">
            <label>Village/Town</label>
            <input type="text" value="${caseObj.village}" readonly>
          </div>
          <div class="form-group">
            <label>Social Category (Caste)</label>
            <input type="text" value="${caseObj.category}" readonly>
          </div>
          <div class="form-group font-weight-bold">
            <label>Self-Declared Annual Income</label>
            <input type="text" value="₹${caseObj.annualIncome ? caseObj.annualIncome.toLocaleString('en-IN') : 'N/A'}" readonly>
          </div>
          <div class="form-group">
            <label>Occupation</label>
            <input type="text" value="${caseObj.occupation.toUpperCase()}" readonly>
          </div>
        </div>

        <h4 class="section-title">2. Financial Institution Details</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Bank Name</label>
            <input type="text" value="${caseObj.bankName}" readonly>
          </div>
          <div class="form-group">
            <label>Bank Account Number</label>
            <input type="text" value="${caseObj.bankAcc}" readonly>
          </div>
          <div class="form-group">
            <label>IFSC Code</label>
            <input type="text" value="${caseObj.bankIfsc}" readonly>
          </div>
        </div>

        <h4 class="section-title">3. Scheme Specific Variables</h4>
        <div class="form-grid scheme-specific-fields">
          ${formFieldsHTML}
        </div>

        <h4 class="section-title">4. Document Verification Checklist status</h4>
        <div class="document-summary-list">
          ${scheme.requiredDocuments.map(doc => {
            const isVerified = !!caseObj.documents[doc];
            return `
              <div class="doc-summary-item ${isVerified ? 'verified' : 'missing'}">
                <span class="doc-icon">${isVerified ? '✓' : '✗'}</span>
                <span class="doc-name">${doc}</span>
                <span class="doc-badge">${isVerified ? 'Verified' : 'Pending / Missing'}</span>
              </div>
            `;
          }).join("")}
        </div>

        <div class="declaration-block">
          <p><strong>Declaration:</strong> I hereby declare that all the information provided above is true to the best of my knowledge. I consent to share my Aadhaar details for verifying my eligibility against welfare schemes.</p>
          <div class="signature-line">
            <div class="sig-box">
              <p class="sig-space"></p>
              <p>Signature/Thumb Impression of Beneficiary</p>
            </div>
            <div class="sig-box">
              <p class="sig-space"></p>
              <p>Signature of Caseworker / Haq Mitra</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CaseworkerDashboard };
}

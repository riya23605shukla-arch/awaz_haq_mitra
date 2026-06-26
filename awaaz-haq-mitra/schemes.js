/**
 * AWAAZ — "Haq Mitra" (My Rights Friend)
 * Central & State Welfare Schemes Database with eligibility rules
 */

const SCHEMES = [
  {
    id: "pm-kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    vernacularNames: {
      en: "PM-KISAN (Farmer Income Support)",
      hi: "पीएम-किसान (किसान सम्मान निधि)",
      te: "పీఎం-కిసాన్ (రైతు సహాయ నిధి)",
      ta: "பிஎம்-கிசான் (விவசாயி உதவித் தொகை)",
      bn: "পিএম-কিষাণ (কৃষক সম্মান তহবিল)",
      mr: "पीएम-किसान (शेतकरी सन्मान निधी)"
    },
    ministry: "Ministry of Agriculture and Farmers Welfare",
    type: "Central",
    category: "Agriculture",
    benefits: "Direct income support of ₹6,000 per year in three equal installments of ₹2,000 directly into bank accounts.",
    description: "A central sector scheme to provide income support to all landholding farmer families across the country, to enable them to take care of agricultural expenses.",
    requiredDocuments: [
      "Aadhaar Card",
      "Land Ownership Documents (Khatauni/Patta)",
      "Bank Account Passbook",
      "Mobile Number linked with Aadhaar",
      "Identity Proof"
    ],
    eligibilityRules: {
      description: "Landholding farmer families with cultivable land. Excludes institutional landholders, income tax payers, and retired pensioners drawing > ₹10,000/month.",
      check: (profile) => {
        return (
          profile.occupation === "farmer" &&
          profile.landholding > 0 &&
          profile.annualIncome < 300000 &&
          !profile.isTaxPayer
        );
      }
    },
    formFields: [
      { id: "farmer_name", label: "Farmer's Full Name (as in Aadhaar)", type: "text" },
      { id: "father_husband_name", label: "Father/Husband Name", type: "text" },
      { id: "land_survey_no", label: "Land Survey/Khasra Number", type: "text" },
      { id: "land_area", label: "Land Holding Size (in Hectares)", type: "number" },
      { id: "bank_name", label: "Bank Name & Branch", type: "text" },
      { id: "bank_acc", label: "Bank Account Number", type: "text" },
      { id: "bank_ifsc", label: "IFSC Code", type: "text" }
    ]
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    vernacularNames: {
      en: "Ayushman Bharat (Free Health Cover)",
      hi: "आयुष्मान भारत (मुफ़्त इलाज)",
      te: "ఆయుష్మాన్ భారత్ (ఉచిత వైద్య బీమా)",
      ta: "ஆயுஷ்மான் பாரத் (இலவச மருத்துவக் காப்பீடு)",
      bn: "আয়ুষ্মান ভারত (বিনামূল্যে চিকিৎসা)",
      mr: "आयुष्मान भारत (मोफत आरोग्य विमा)"
    },
    ministry: "Ministry of Health and Family Welfare",
    type: "Central",
    category: "Health",
    benefits: "Cashless health cover of up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization.",
    description: "The largest government-funded healthcare program in the world, targeting poor, deprived rural families and identified occupational categories of urban workers' families.",
    requiredDocuments: [
      "Aadhaar Card",
      "Ration Card (BPL/NFSA)",
      "Income Certificate",
      "Family Identity Document"
    ],
    eligibilityRules: {
      description: "Families listed in the Socio-Economic Caste Census (SECC 2011), BPL cardholders, or low-income households (income under ₹1.2 Lakhs/year in rural areas).",
      check: (profile) => {
        return (
          profile.isBpl ||
          profile.annualIncome <= 120000 ||
          profile.occupation === "laborer" ||
          profile.occupation === "domestic_worker"
        );
      }
    },
    formFields: [
      { id: "head_of_family", label: "Head of Family Name", type: "text" },
      { id: "ration_card_no", label: "Ration Card Number", type: "text" },
      { id: "family_members_count", label: "Total Number of Family Members", type: "number" },
      { id: "pre_existing_illness", label: "Any Pre-existing Illness?", type: "text" }
    ]
  },
  {
    id: "pm-awas-yojana",
    name: "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
    vernacularNames: {
      en: "PMAY-G (Housing for All)",
      hi: "प्रधानमंत्री आवास योजना (पक्का घर)",
      te: "పీఎం ఆవాస్ యోజన (సొంత ఇల్లు)",
      ta: "பிஎம் அவாஸ் யோஜனா (சொந்த வீடு)",
      bn: "প্রধানমন্ত্রী আবাস যোজনা (পাকা বাড়ি)",
      mr: "पंतप्रधान आवास योजना (पक्के घर)"
    },
    ministry: "Ministry of Rural Development",
    type: "Central",
    category: "Housing",
    benefits: "Financial assistance of ₹1,20,000 in plains and ₹1,30,000 in hilly/difficult areas for construction of a pucca house, plus ₹12,000 for toilet construction.",
    description: "A social welfare program to provide housing for the rural poor in India, replacing kutcha (temporary) houses with permanent masonry structures.",
    requiredDocuments: [
      "Aadhaar Card",
      "Bank Account Details",
      "MGNREGA Job Card Number",
      "Swachh Bharat Mission (SBM) Number",
      "Land Ownership Certificate / Patta"
    ],
    eligibilityRules: {
      description: "Families living in kutcha/dilapidated houses, landless laborers, BPL households, or households with income below ₹1.8 Lakhs/year and no concrete house.",
      check: (profile) => {
        return (
          !profile.hasConcreteHouse &&
          (profile.isBpl || profile.annualIncome <= 180000)
        );
      }
    },
    formFields: [
      { id: "applicant_name", label: "Applicant Name", type: "text" },
      { id: "current_house_type", label: "Current House Type (Kutcha/Semi-Pucca/Homeless)", type: "select", options: ["Kutcha", "Semi-Pucca", "Homeless"] },
      { id: "job_card_no", label: "MGNREGA Job Card Number (Optional)", type: "text" },
      { id: "land_ownership_details", label: "Do you own the construction plot?", type: "select", options: ["Yes", "No"] }
    ]
  },
  {
    id: "pm-ujjwala",
    name: "Pradhan Mantri Ujjwala Yojana (PMUY 2.0)",
    vernacularNames: {
      en: "PM Ujjwala Yojana (Free Gas Connection)",
      hi: "प्रधानमंत्री उज्ज्वला योजना (मुफ़्त गैस)",
      te: "పీఎం ఉజ్వల యోజన (ఉచిత గ్యాస్ కనెక్షన్)",
      ta: "பிஎம் உஜ்வாலா யோஜனா (இலவச எரிவாயு இணைப்பு)",
      bn: "প্রধানমন্ত্রী উজ্জ্বলা যোজনা (বিনামূল্যে গ্যাস)",
      mr: "पंतप्रधान उज्ज्वला योजना (मोफत गॅस कनेक्शन)"
    },
    ministry: "Ministry of Petroleum and Natural Gas",
    type: "Central",
    category: "Women & Child",
    benefits: "Free LPG Connection, first cylinder refill for free, and a hotplate (stove) along with ongoing cylinder subsidies.",
    description: "A scheme launched to safeguard the health of women and children by providing them with clean cooking fuel (LPG) so they don't have to cook in smoky kitchens.",
    requiredDocuments: [
      "Aadhaar Card of Applicant & adult family members",
      "Ration Card issued by State Govt",
      "BPL Certificate / Caste Certificate (for SC/ST)",
      "Bank Account Passbook",
      "Address Proof"
    ],
    eligibilityRules: {
      description: "Must be a woman, aged 18+, belonging to a BPL household, SC/ST, or other backward communities, with no existing LPG connection in the household.",
      check: (profile) => {
        return (
          profile.gender === "female" &&
          profile.age >= 18 &&
          (profile.isBpl || profile.annualIncome <= 150000 || profile.category === "SC" || profile.category === "ST") &&
          !profile.hasLpgConnection
        );
      }
    },
    formFields: [
      { id: "woman_name", label: "Woman Applicant Name", type: "text" },
      { id: "age_proof", label: "Date of Birth / Age", type: "number" },
      { id: "household_members", label: "Number of Adult Family Members", type: "number" },
      { id: "caste_category", label: "Caste/Social Category", type: "select", options: ["SC", "ST", "OBC", "General"] }
    ]
  },
  {
    id: "pm-sym",
    name: "Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)",
    vernacularNames: {
      en: "PM-SYM (Pension for Workers)",
      hi: "पीएम श्रम योगी मान-धन (पेंशन योजना)",
      te: "పీఎం శ్రమ యోగి మాన్-ధన్ (పెన్షన్ స్కీమ్)",
      ta: "பிஎம் ஷ்ரம் யோகி மான்-தன் (ஓய்வூதியத் திட்டம்)",
      bn: "পিএম শ্রম যোগী মান-ধন (পেনশন স্কিম)",
      mr: "पीएम श्रम योगी मान-धन (पेन्शन योजना)"
    },
    ministry: "Ministry of Labour and Employment",
    type: "Central",
    category: "Pension",
    benefits: "Assured monthly pension of ₹3,000 after attaining the age of 60 years. 50% husband/wife family pension in case of death.",
    description: "A voluntary and contributory pension scheme for unorganized workers like street vendors, rickshaw pullers, domestic helpers, construction workers, etc.",
    requiredDocuments: [
      "Aadhaar Card",
      "Savings Bank Account Passbook (Auto-debit setup)",
      "Mobile Number"
    ],
    eligibilityRules: {
      description: "Unorganized workers aged between 18 and 40 years. Monthly income should be ₹15,000 or less. Should not be covered under EPFO/ESIC/NPS or be an income taxpayer.",
      check: (profile) => {
        return (
          profile.age >= 18 &&
          profile.age <= 40 &&
          profile.annualIncome <= 180000 &&
          (profile.occupation === "laborer" || profile.occupation === "domestic_worker" || profile.occupation === "unemployed" || profile.occupation === "other") &&
          !profile.isTaxPayer &&
          !profile.hasGovtPension
        );
      }
    },
    formFields: [
      { id: "worker_name", label: "Worker Name", type: "text" },
      { id: "nominee_name", label: "Nominee Name (Spouse/Child)", type: "text" },
      { id: "nominee_relation", label: "Relationship with Nominee", type: "text" },
      { id: "monthly_contribution", label: "Preferred Monthly Premium Contribution (₹55 - ₹200 based on age)", type: "number" }
    ]
  },
  {
    id: "pm-mvy",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    vernacularNames: {
      en: "PM Matru Vandana Yojana (Maternity Benefit)",
      hi: "प्रधानमंत्री मातृ वंदना योजना (गर्भवती सहायता)",
      te: "పీఎం మాతృ వందన యోజన (గర్భిణీ తోడ్పాటు)",
      ta: "பிஎம் மாத்ரு வந்தனா யோஜனா (கர்ப்பிணி உதவி)",
      bn: "প্রধানমন্ত্রী মাতৃ বন্দনা যোজনা (মাতৃত্বকালীন সুবিধা)",
      mr: "पंतप्रधान मातृ वंदना योजना (मदर बेनिफिट)"
    },
    ministry: "Ministry of Women and Child Development",
    type: "Central",
    category: "Women & Child",
    benefits: "Direct cash incentive of ₹5,000 paid in installments directly into bank accounts for pregnant women and lactating mothers for the first child.",
    description: "A maternity benefit program to provide partial compensation for wage loss so that the woman can take adequate rest before and after delivery, promoting healthy institutional births.",
    requiredDocuments: [
      "Aadhaar Card of mother and husband",
      "Mother's Bank Account Passbook",
      "MCP Card (Mother and Child Protection Card)",
      "Doctor/Clinic Pregnancy Registration Certificate"
    ],
    eligibilityRules: {
      description: "Pregnant women and lactating mothers for the first living child in the family. Excludes women in regular employment with Central/State Govt or PSUs.",
      check: (profile) => {
        return (
          profile.gender === "female" &&
          profile.isPregnant &&
          !profile.isGovtEmployee
        );
      }
    },
    formFields: [
      { id: "mother_name", label: "Mother's Name", type: "text" },
      { id: "husband_name", label: "Husband's Name", type: "text" },
      { id: "pregnancy_date", label: "LMP Date (Last Menstrual Period)", type: "date" },
      { id: "mcp_card_reg_no", label: "MCP Card Registration Number", type: "text" }
    ]
  },
  {
    id: "janani-suraksha",
    name: "Janani Suraksha Yojana (JSY)",
    vernacularNames: {
      en: "Janani Suraksha Yojana (Safe Delivery Cash)",
      hi: "जननी सुरक्षा योजना (सुरक्षित प्रसव नकद)",
      te: "జనని సురక్ష యోజన (ప్రసవ ఆర్థిక సహాయం)",
      ta: "ஜனனி சுரக்ஷா யோஜனா (பிரசவ பண உதவி)",
      bn: "জননী সুরক্ষা যোজনা (সুরক্ষিত প্রসব সুবিধা)",
      mr: "जननी सुरक्षा योजना (सुरक्षित बाळंतपण भत्ता)"
    },
    ministry: "Ministry of Health and Family Welfare",
    type: "Central",
    category: "Women & Child",
    benefits: "Cash assistance of ₹1,400 (rural) or ₹1,000 (urban) to the mother for institutional delivery, plus ₹600/₹400 incentive to the ASHA worker helper.",
    description: "A safe motherhood intervention under the National Health Mission (NHM) to reduce maternal and neonatal mortality by promoting institutional delivery among poor pregnant women.",
    requiredDocuments: [
      "Aadhaar Card",
      "BPL Ration Card (or SC/ST Certificate)",
      "Janani Suraksha Card/MCP Card",
      "Institutional Delivery Certificate (issued by Govt Hospital)"
    ],
    eligibilityRules: {
      description: "Pregnant women from BPL households, or SC/ST communities, delivering in government health centers or accredited private hospitals.",
      check: (profile) => {
        return (
          profile.gender === "female" &&
          profile.isPregnant &&
          (profile.isBpl || profile.category === "SC" || profile.category === "ST")
        );
      }
    },
    formFields: [
      { id: "mother_name", label: "Mother's Name", type: "text" },
      { id: "hospital_name", label: "Government Health Center/Hospital Name", type: "text" },
      { id: "delivery_date", label: "Expected/Actual Delivery Date", type: "date" },
      { id: "asha_worker_name", label: "Name of assisting ASHA Worker", type: "text" }
    ]
  },
  {
    id: "atal-pension",
    name: "Atal Pension Yojana (APY)",
    vernacularNames: {
      en: "Atal Pension Yojana (Guaranteed Pension)",
      hi: "अटल पेंशन योजना (सरकारी पेंशन)",
      te: "అటల్ పెన్షన్ యోజన (హామీ పెన్షన్)",
      ta: "அடல் பென்ஷன் யோஜனா (உத்தரவாத ஓய்வூதியம்)",
      bn: "অটল পেনশন যোজনা (নিশ্চিত পেনশন)",
      mr: "अटल पेन्शन योजना (हमी पेन्शन)"
    },
    ministry: "Ministry of Finance",
    type: "Central",
    category: "Pension",
    benefits: "Guaranteed minimum monthly pension of ₹1,000 to ₹5,000 after the age of 60, depending on the contributions made.",
    description: "A pension scheme targeted mainly at the unorganized sector workers to provide them social security in their old age.",
    requiredDocuments: [
      "Aadhaar Card",
      "Savings Bank Account linked with Mobile Number",
      "APY Registration Form"
    ],
    eligibilityRules: {
      description: "All citizens of India aged between 18 and 40 years. Must have a savings bank account. Should not be an income taxpayer.",
      check: (profile) => {
        return (
          profile.age >= 18 &&
          profile.age <= 40 &&
          !profile.isTaxPayer
        );
      }
    },
    formFields: [
      { id: "subscriber_name", label: "Subscriber Name", type: "text" },
      { id: "pension_amount", label: "Desired Monthly Pension Amount (₹1000/₹2000/₹3000/₹4000/₹5000)", type: "select", options: ["1000", "2000", "3000", "4000", "5000"] },
      { id: "spouse_name", label: "Spouse Name", type: "text" },
      { id: "premium_frequency", label: "Premium Payment Frequency", type: "select", options: ["Monthly", "Quarterly", "Half-Yearly"] }
    ]
  },
  {
    id: "sanjay-gandhi-niradhar",
    name: "Sanjay Gandhi Niradhar Yojana (SGNY) - Maharashtra",
    vernacularNames: {
      en: "SGNY Pension (Maharashtra)",
      hi: "संजय गांधी निराधार योजना (वृद्ध/अपंग)",
      te: "ఎస్జీఎన్వై పెన్షన్ (మహారాష్ట్ర)",
      ta: "எஸ்ஜிஎன்ஒய் ஓய்வூதியம் (மகாராஷ்டிரா)",
      bn: "এসজিএনওয়াই পেনশন (মহারাষ্ট্র)",
      mr: "संजय गांधी निराधार योजना (निराधारांना मदत)"
    },
    ministry: "Social Justice and Special Assistance, Govt of Maharashtra",
    type: "State",
    category: "Pension",
    benefits: "Monthly pension of ₹1,000 per month (₹1,200 for family with 2 or more beneficiaries) to destitute persons.",
    description: "A state scheme in Maharashtra providing monthly financial aid to destitute persons, blind, disabled, orphans, widows, or citizens suffering from major illnesses.",
    requiredDocuments: [
      "Age Certificate (Minimum 60 years unless disabled/widow)",
      "Income Certificate (Family income below ₹21,000/year)",
      "Residence Certificate of Maharashtra (15 years)",
      "Disability Certificate (if claiming under disability)",
      "BPL Card"
    ],
    eligibilityRules: {
      description: "Resident of Maharashtra for 15+ years. Destitute, aged 60+ (or disabled/widow with no age limit), and family income under ₹21,000 per annum.",
      check: (profile) => {
        return (
          profile.state === "Maharashtra" &&
          (profile.age >= 60 || profile.isDisabled || (profile.gender === "female" && profile.isWidow)) &&
          profile.annualIncome <= 21000
        );
      }
    },
    formFields: [
      { id: "beneficiary_name", label: "Beneficiary Name", type: "text" },
      { id: "destitution_reason", label: "Reason for Destitution Assistance", type: "select", options: ["Old Age", "Disability", "Widowhood", "Major Illness"] },
      { id: "duration_of_residence", label: "Duration of Residence in Maharashtra (Years)", type: "number" }
    ]
  },
  {
    id: "ladli-behna",
    name: "Mukhyamantri Ladli Behna Yojana - Madhya Pradesh",
    vernacularNames: {
      en: "Ladli Behna Yojana (MP Woman Cash Support)",
      hi: "लाड़ली बहना योजना (म.प्र. महिला सहायता)",
      te: "లాడ్లీ బెహనా యోజన (మధ్యప్రదేశ్)",
      ta: "லாட்லி பெஹ்னா யோஜனா (மத்திய பிரதேசம்)",
      bn: "লাডলি বহনা যোজনা (মধ্যপ্রদেশ)",
      mr: "लाडकी बहीण योजना (मध्य प्रदेश)"
    },
    ministry: "Women and Child Development, Govt of Madhya Pradesh",
    type: "State",
    category: "Women & Child",
    benefits: "Direct monthly transfer of ₹1,250 per month into the Aadhaar-linked bank accounts of eligible women.",
    description: "A welfare scheme introduced by Madhya Pradesh state government to improve the health, nutrition, and financial independence of women in the state.",
    requiredDocuments: [
      "Samagra Family ID / Member ID",
      "Aadhaar Card",
      "Domicile Certificate of Madhya Pradesh",
      "Bank Account linked with Aadhaar & enabled for DBT"
    ],
    eligibilityRules: {
      description: "Resident of Madhya Pradesh. Married, widowed, or divorced women aged between 21 and 60 years. Family income must be under ₹2.5 Lakhs/year and family should not pay income tax.",
      check: (profile) => {
        return (
          profile.state === "Madhya Pradesh" &&
          profile.gender === "female" &&
          profile.age >= 21 &&
          profile.age <= 60 &&
          profile.annualIncome <= 250000 &&
          !profile.isTaxPayer
        );
      }
    },
    formFields: [
      { id: "applicant_samagra_id", label: "Samagra Member ID (9 digits)", type: "text" },
      { id: "marital_status", label: "Marital Status", type: "select", options: ["Married", "Widowed", "Divorced", "Unmarried"] },
      { id: "family_own_tractor", label: "Does family own a tractor?", type: "select", options: ["No", "Yes"] }
    ]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SCHEMES };
}

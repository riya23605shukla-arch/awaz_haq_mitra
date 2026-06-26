/**
 * AWAAZ — "Haq Mitra" (My Rights Friend)
 * WhatsApp AI Conversation Engine and Speech Middleware
 */

class WhatsAppEngine {
  constructor(onUpdateProfile, onUpdateChat, onSpeakStatus) {
    this.onUpdateProfile = onUpdateProfile;
    this.onUpdateChat = onUpdateChat;
    this.onSpeakStatus = onSpeakStatus;
    
    // Default initial profile
    this.currentProfile = {
      name: "",
      age: null,
      gender: "male",
      state: "Uttar Pradesh",
      occupation: "other",
      landholding: 0,
      annualIncome: null,
      category: "General",
      isBpl: false,
      isPregnant: false,
      isDisabled: false,
      hasConcreteHouse: true,
      hasLpgConnection: false,
      hasGovtPension: false,
      isTaxPayer: false,
      isWidow: false,
      isGovtEmployee: false
    };

    this.chatHistory = [];
    this.language = "en";
    this.recognition = null;
    this.isRecording = false;

    // Supported languages config
    this.languages = {
      en: { name: "English", code: "en-IN", greeting: "Hello, I am Haq Mitra. Tell me about your life situation. Where do you live, what is your age, job, and family income? I will find matching government schemes for you." },
      hi: { name: "हिंदी (Hindi)", code: "hi-IN", greeting: "नमस्ते, मैं हूँ हक़ मित्र। मुझे अपनी जीवन स्थिति के बारे में बताएं। आप कहाँ रहते हैं, आपकी उम्र, काम और परिवार की आय क्या है? मैं आपके लिए सरकारी योजनाएं ढूंढूंगा।" },
      mr: { name: "मराठी (Marathi)", code: "mr-IN", greeting: "नमस्कार, मी हक मित्र आहे. मला तुमच्या परिस्थितीबद्दल सांगा. तुम्ही कुठे राहता, तुमचे वय, काम आणि उत्पन्न काय आहे? मी तुमच्यासाठी सरकारी योजना शोधेन." },
      te: { name: "తెలుగు (Telugu)", code: "te-IN", greeting: "నమస్తే, నేను హక్ మిత్ర. మీ జీవిత పరిస్థితి గురించి నాకు చెప్పండి. మీరు ఎక్కడ నివసిస్తున్నారు, మీ వయస్సు, ఉద్యోగం మరియు కుటుంబ ఆదాయం ఎంత? నేను మీకు సరిపోయే ప్రభుత్వ పథకాలను కనుగొంటాను." },
      ta: { name: "தமிழ் (Tamil)", code: "ta-IN", greeting: "வணக்கம், நான் ஹக் மித்ரா. உங்கள் வாழ்க்கை நிலைமையைப் பற்றி என்னிடம் கூறுங்கள். நீங்கள் எங்கே வசிக்கிறீர்கள், உங்கள் வயது, தொழில் மற்றும் வருமானம் என்ன? உங்களுக்குப் பொருந்தும் திட்டங்களைக் கண்டறிவேன்." },
      bn: { name: "বাংলা (Bengali)", code: "bn-IN", greeting: "নমস্কার, আমি হক মিত্র। আপনার জীবনযাত্রা সম্পর্কে বলুন। আপনি কোথায় থাকেন, আপনার বয়স, পেশা এবং আয় কত? আমি আপনার যোগ্য সরকারি প্রকল্পগুলি খুঁজে দেব।" }
    };

    // Pre-configured simulation scenarios
    this.scenarios = {
      ramesh: {
        name: "Ramesh Kumar",
        language: "hi",
        audioText: "मैं उत्तर प्रदेश का रहने वाला हूँ। मेरा नाम रमेश कुमार है। मैं एक छोटा किसान हूँ और मेरे पास 1 हेक्टेयर खेती की ज़मीन है। मेरी सालाना कमाई लगभग 80,000 रुपये है। मेरी पत्नी अभी गर्भवती है। क्या हमें सरकार से कोई मदद मिल सकती है?",
        translation: "I live in Uttar Pradesh. My name is Ramesh Kumar. I am a small farmer and I have 1 hectare of agricultural land. My annual income is around 80,000 rupees. My wife is currently pregnant. Can we get any help from the government?",
        extracted: {
          name: "Ramesh Kumar",
          age: 38,
          gender: "male",
          state: "Uttar Pradesh",
          occupation: "farmer",
          landholding: 1,
          annualIncome: 80000,
          category: "OBC",
          isBpl: true,
          isPregnant: true,
          hasConcreteHouse: false,
          hasLpgConnection: false,
          hasGovtPension: false
        },
        aiResponse: {
          hi: "रमेश जी, आपकी स्थिति के अनुसार आप निम्नलिखित योजनाओं के पात्र हैं:\n1. **पीएम-किसान**: खेती के लिए सालाना ₹6,000 सीधे बैंक खाते में।\n2. **आयुष्मान भारत (PM-JAY)**: आपकी ₹80,000 आय होने के कारण आपको ₹5 लाख का मुफ़्त स्वास्थ्य बीमा मिलेगा।\n3. **प्रधानमंत्री मातृ वंदना योजना (PMMVY)**: आपकी गर्भवती पत्नी के लिए ₹5,000 की मातृत्व सहायता मिलेगी।\n4. **प्रधानमंत्री आवास योजना (PMAY-G)**: यदि आपका कच्चा मकान है, तो पक्का घर बनाने के लिए ₹1.2 लाख मिलेंगे।\n\nमैंने आपके लिए एक दस्तावेज चेकलिस्ट और आवेदन पत्र तैयार कर दिया है। क्या मैं इसे आगे की मदद के लिए आपके नजदीकी हक मित्र केंद्र पर भेज दूं?",
          en: "Ramesh ji, based on your profile, you qualify for the following schemes:\n1. **PM-KISAN**: ₹6,000/year direct cash support for farming.\n2. **Ayushman Bharat (PM-JAY)**: Free health coverage of up to ₹5 Lakhs.\n3. **PM Matru Vandana Yojana (PMMVY)**: ₹5,000 cash aid for your pregnant wife's first child.\n4. **PMAY-G (Housing)**: ₹1.2 Lakh assistance to build a permanent home as you live in a kutcha house.\n\nI have generated your document checklist and a pre-filled draft. Should I send this to your local caseworker?"
        }
      },
      savitri: {
        name: "Savitri Bai",
        language: "mr",
        audioText: "मी महाराष्ट्रात राहते, माझं नाव सावित्री आहे. मी लोकांच्या घरी धुणीभांडी करते, माझे वय 62 वर्षे आहे आणि माझे पती वारले आहेत. घरात दुसरं कोणी कमावणारं नाही, माझी वार्षिक कमाई 18,000 रुपये आहे. माझ्यासाठी काही पेन्शन किंवा योजना आहे का?",
        translation: "I live in Maharashtra, my name is Savitri. I do household chores in people's houses. My age is 62 years and my husband has passed away. There is no one else earning, my annual income is 18,000 rupees. Is there any pension or scheme for me?",
        extracted: {
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
          isWidow: true
        },
        aiResponse: {
          mr: "सावित्रीबाई, तुमच्या माहितीनुसार तुम्ही खालील शासकीय योजनांचे लाभ घेऊ शकता:\n1. **संजय गांधी निराधार योजना (महाराष्ट्र)**: तुम्हाला प्रतिमहा ₹1,000 ते ₹1,200 पेन्शन मिळू शकते कारण तुमचे वय 60 वर्षांपेक्षा जास्त आहे आणि तुम्ही निराधार आहात.\n2. **आयुष्मान भारत (PM-JAY)**: तुम्हाला ₹5 लाख रुपयांपर्यंत मोफत उपचाराचे कार्ड मिळेल.\n3. **प्रधानमंत्री उज्ज्वला योजना (PMUY)**: मोफत गॅस शेगडी आणि जोडणी मिळेल.\n4. **प्रधानमंत्री आवास योजना (PMAY-G)**: पक्के घर बांधण्यासाठी आर्थिक मदत मिळू शकते.\n\nमी तुमचा फॉर्म आणि कागदपत्रांची यादी तयार केली आहे. ती तुम्हाला जवळच्या सेवा केंद्रात पाठवू का?",
          en: "Savitri Bai, according to your information, you qualify for the following government schemes:\n1. **Sanjay Gandhi Niradhar Yojana (Maharashtra)**: destitution pension of ₹1,000/month as you are over 60 with low income.\n2. **Ayushman Bharat (PM-JAY)**: Free health care cover of ₹5 Lakhs/year.\n3. **PM Ujjwala Yojana (PMUY)**: Free LPG cylinder connection.\n4. **PMAY-G**: Financial aid to rebuild your kutcha house.\n\nI have created your file. Should I send this to your regional Haq Mitra helper?"
        }
      },
      anitha: {
        name: "Anitha Devi",
        language: "ta",
        audioText: "என் பெயர் அனிதா. நான் தமிழ்நாட்டில் வசித்து வருகிறேன். நான் ஒரு தையல் கூலி வேலை செய்கிறேன். என் வயது 30. எனக்கு சொந்தமாக வீடு இல்லை, ஒரு குடிசையில் தான் வசிக்கிறோம். என் கணவருக்கு நிரந்தர வேலை இல்லை, வருட வருமானம் 60,000 ரூபாய் தான். எங்களுக்கு சொந்தமாக நிலம் எதுவும் இல்லை. எங்களுக்கு ஏதாவது உதவி கிடைக்குமா?",
        translation: "My name is Anitha. I live in Tamil Nadu. I work as a tailor doing wage labor. My age is 30. I don't own a house, we live in a hut. My husband has no permanent job, annual income is 60,000 rupees. We do not own land. Can we get any help?",
        extracted: {
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
          isWidow: false
        },
        aiResponse: {
          ta: "அனிதா அவர்களே, உங்கள் விவரங்களின்படி நீங்கள் பின்வரும் திட்டங்களுக்குத் தகுதி பெற்றுள்ளீர்கள்:\n1. **ஆயுஷ்மான் பாரத் (PM-JAY)**: ஆண்டிற்கு ₹5 லட்சம் வரையிலான இலவச மருத்துவக் காப்பீடு அட்டை.\n2. **பிஎம் அவாஸ் யோஜனா (PMAY-G)**: நீங்கள் குடிசை வீட்டில் வசிப்பதால், புதிய கான்கிரீட் வீடு கட்ட ₹1.2 லட்சம் நிதியுதவி.\n3. **பிஎம் உஜ்வாலா யோஜனா (PMUY)**: இலவச கேஸ் சிலிண்டர் மற்றும் அடுப்பு இணைப்பு.\n4. **பிஎம் ஷ்ரம் யோகி மான்-தன் (PM-SYM)**: தையல் தொழில் செய்யும் உங்களுக்கு 60 வயதுக்குப் பின் ₹3,000 மாத ஓய்வூதியம் கிடைக்க பங்களிப்புத் திட்டம்.\n\nஉங்கள் விவரங்களைச் சேமித்து விண்ணப்பத்தை உருவாக்கியுள்ளேன். இதை உங்கள் பகுதி சமூக ஊழியருக்குப் பகிரவா?",
          en: "Anitha, based on your details, you qualify for the following schemes:\n1. **Ayushman Bharat (PM-JAY)**: Health card covering ₹5 Lakhs/year.\n2. **PMAY-G (Housing)**: ₹1.2 Lakh financial assistance for building a concrete house.\n3. **PM Ujjwala Yojana (PMUY)**: Free cooking gas connection.\n4. **PM Shram Yogi Maan-dhan (PM-SYM)**: Voluntary pension providing ₹3,000/month after age 60.\n\nI have generated the form drafts and document list. Shall I forward it to your regional social helper?"
        }
      }
    };

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        
        this.recognition.onstart = () => {
          this.isRecording = true;
          this.onSpeakStatus("listening");
        };

        this.recognition.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          this.isRecording = false;
          this.onSpeakStatus("error", event.error);
        };

        this.recognition.onend = () => {
          this.isRecording = false;
          this.onSpeakStatus("idle");
        };

        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          this.processSpeechInput(transcript);
        };
      }
    }
  }

  setLanguage(langCode) {
    if (this.languages[langCode]) {
      this.language = langCode;
      if (this.recognition) {
        this.recognition.lang = this.languages[langCode].code;
      }
    }
  }

  // Speak text out loud using browser TTS
  speakText(text, lang = this.language) {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      
      // Clean markdown tags for clear speech
      const cleanText = text.replace(/[*#_`\[\]()]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = this.languages[lang].code;
      
      utterance.onstart = () => this.onSpeakStatus("speaking");
      utterance.onend = () => this.onSpeakStatus("idle");
      utterance.onerror = () => this.onSpeakStatus("idle");
      
      window.speechSynthesis.speak(utterance);
    }
  }

  stopSpeaking() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.onSpeakStatus("idle");
    }
  }

  startRecording() {
    if (this.recognition && !this.isRecording) {
      try {
        this.recognition.lang = this.languages[this.language].code;
        this.recognition.start();
      } catch (e) {
        console.error(e);
      }
    } else {
      // Mock recording start if browser doesn't support Web Speech API
      this.isRecording = true;
      this.onSpeakStatus("listening");
      setTimeout(() => {
        if (this.isRecording) {
          this.stopRecordingAndMock();
        }
      }, 5000);
    }
  }

  stopRecordingAndMock() {
    this.isRecording = false;
    this.onSpeakStatus("idle");
    
    // Select a random phrase or fallback depending on lang
    let mockPhrase = "";
    if (this.language === "hi") {
      mockPhrase = "मेरा नाम रामप्रसाद है। मेरी उम्र 45 वर्ष है। मैं मध्य प्रदेश में रहता हूँ और मजदूरी करता हूँ। मेरी सालाना आय 90,000 रुपये है। मेरे पास पक्का घर नहीं है।";
    } else {
      mockPhrase = "My name is Ramprasad. I am 45 years old. I live in Madhya Pradesh and work as a laborer. My annual income is 90,000 rupees. I do not have a concrete house.";
    }
    this.processSpeechInput(mockPhrase);
  }

  stopRecording() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    } else if (this.isRecording) {
      this.stopRecordingAndMock();
    }
  }

  // Process manual or transcribed text input
  processSpeechInput(text) {
    // Add user message to chat history
    this.chatHistory.push({
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.onUpdateChat([...this.chatHistory]);

    // Parsing NLP simulation
    setTimeout(() => {
      const translation = this.simulateTranslation(text, this.language);
      const extractedProfile = this.simulateEntityExtraction(translation, text);
      
      // Merge with current state
      this.currentProfile = { ...this.currentProfile, ...extractedProfile };
      this.onUpdateProfile(this.currentProfile);

      // Generate AI response
      const responseText = this.generateBotResponse(this.currentProfile, this.language);
      
      this.chatHistory.push({
        sender: "bot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.onUpdateChat([...this.chatHistory]);

      // Speak response out loud
      this.speakText(responseText, this.language);
    }, 1500);
  }

  // Load a preset simulation profile
  loadScenario(scenarioKey) {
    const scenario = this.scenarios[scenarioKey];
    if (!scenario) return;

    this.language = scenario.language;
    this.currentProfile = { ...this.currentProfile, ...scenario.extracted };
    
    // Add User query to chat
    this.chatHistory.push({
      sender: "user",
      text: scenario.audioText,
      translation: scenario.translation,
      isAudioSimulated: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    this.onUpdateProfile(this.currentProfile);
    this.onUpdateChat([...this.chatHistory]);

    // Add Bot response
    setTimeout(() => {
      const responseText = scenario.aiResponse[this.language];
      this.chatHistory.push({
        sender: "bot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.onUpdateChat([...this.chatHistory]);
      this.speakText(responseText, this.language);
    }, 1200);
  }

  // Simple simulated Translation layer
  simulateTranslation(text, lang) {
    if (lang === "en") return text;
    
    // Check keywords in vernacular language and construct approximate English equivalent
    const lowerText = text.toLowerCase();
    let engSummary = "";

    // State extraction
    if (lowerText.includes("उत्तर प्रदेश") || lowerText.includes("यूपी") || lowerText.includes("uttar pradesh")) engSummary += "I live in Uttar Pradesh. ";
    if (lowerText.includes("महाराष्ट्र") || lowerText.includes("maharashtra")) engSummary += "I live in Maharashtra. ";
    if (lowerText.includes("मध्य प्रदेश") || lowerText.includes("mp") || lowerText.includes("madhya pradesh")) engSummary += "I live in Madhya Pradesh. ";
    if (lowerText.includes("तमिलनाडु") || lowerText.includes("தமிழ்நாடு") || lowerText.includes("tamil nadu")) engSummary += "I live in Tamil Nadu. ";
    if (lowerText.includes("पश्चिम बंगाल") || lowerText.includes("পশ্চিমবঙ্গ") || lowerText.includes("bengal")) engSummary += "I live in West Bengal. ";

    // Occupation
    if (lowerText.includes("किसान") || lowerText.includes("खेती") || lowerText.includes("farmer") || lowerText.includes("விவசாயி")) engSummary += "I am a farmer. ";
    if (lowerText.includes("मजदूर") || lowerText.includes("मजदूरी") || lowerText.includes("labour") || lowerText.includes("வேலை")) engSummary += "I work as a laborer. ";
    if (lowerText.includes("कामवाली") || lowerText.includes("घरकाम") || lowerText.includes("domestic") || lowerText.includes("வீட்டு வேலை")) engSummary += "I am a domestic worker. ";

    // Income
    const numMatches = text.match(/\d+,\d+|\d+/g);
    if (numMatches) {
      const numbers = numMatches.map(n => parseInt(n.replace(/,/g, "")));
      const income = numbers.find(n => n > 5000);
      if (income) engSummary += `My annual income is ${income} rupees. `;
      
      const age = numbers.find(n => n > 15 && n < 90);
      if (age) engSummary += `My age is ${age} years old. `;
    }

    // Pregnancy
    if (lowerText.includes("गर्भवती") || lowerText.includes("बच्चा") || lowerText.includes("pregnant") || lowerText.includes("கர்ப்பிணி")) engSummary += "My wife is pregnant. ";

    // House status
    if (lowerText.includes("कच्चा मकान") || lowerText.includes("झोपड़ी") || lowerText.includes("குடிசை") || lowerText.includes("no house") || lowerText.includes("no concrete house")) engSummary += "I do not have a concrete house. ";

    return engSummary || text;
  }

  // Simulated NER / Entity Parser
  simulateEntityExtraction(englishText, originalText) {
    const profile = {};
    const lowerText = englishText.toLowerCase();
    const origLower = originalText.toLowerCase();

    // Name Extraction (Fallback defaults)
    if (origLower.includes("रमेश") || lowerText.includes("ramesh")) {
      profile.name = "Ramesh Kumar";
      profile.gender = "male";
    } else if (origLower.includes("सावित्री") || lowerText.includes("savitri")) {
      profile.name = "Savitri Bai";
      profile.gender = "female";
      profile.isWidow = true;
    } else if (origLower.includes("अनीता") || lowerText.includes("anitha") || origLower.includes("அனிதா")) {
      profile.name = "Anitha Devi";
      profile.gender = "female";
    } else if (origLower.includes("रामप्रसाद") || lowerText.includes("ramprasad")) {
      profile.name = "Ramprasad Ahirwar";
      profile.gender = "male";
    } else {
      profile.name = "Citizen Beneficiary";
    }

    // Age
    const ageMatch = lowerText.match(/age is (\d+)/i) || origLower.match(/(\d+)\s*(साल|वर्ष|वय|வயது|বছর)/i);
    if (ageMatch) {
      profile.age = parseInt(ageMatch[1]);
    } else {
      if (lowerText.includes("old age") || lowerText.includes("elderly") || lowerText.includes("retired")) {
        profile.age = 65;
      }
    }

    // State
    if (lowerText.includes("uttar pradesh")) profile.state = "Uttar Pradesh";
    else if (lowerText.includes("maharashtra")) profile.state = "Maharashtra";
    else if (lowerText.includes("madhya pradesh")) profile.state = "Madhya Pradesh";
    else if (lowerText.includes("tamil nadu")) profile.state = "Tamil Nadu";
    else if (lowerText.includes("west bengal")) profile.state = "West Bengal";

    // Occupation
    if (lowerText.includes("farmer")) {
      profile.occupation = "farmer";
      profile.landholding = 1.2; // default simulated
    } else if (lowerText.includes("laborer") || lowerText.includes("wage worker")) {
      profile.occupation = "laborer";
      profile.landholding = 0;
    } else if (lowerText.includes("domestic worker") || lowerText.includes("household chores")) {
      profile.occupation = "domestic_worker";
      profile.landholding = 0;
    }

    // Income
    const incomeMatch = lowerText.match(/income is (\d+)/i) || origLower.match(/(कमाई|उत्पन्न|வருமானம்|আয়)\s*(\d+)/i);
    if (incomeMatch) {
      profile.annualIncome = parseInt(incomeMatch[1]);
    } else {
      // Intuitively map BPL
      if (lowerText.includes("poor") || lowerText.includes("bpl") || lowerText.includes("no money")) {
        profile.annualIncome = 45000;
        profile.isBpl = true;
      }
    }

    // Housing
    if (lowerText.includes("no concrete house") || lowerText.includes("kutcha house") || lowerText.includes("hut")) {
      profile.hasConcreteHouse = false;
    }

    // Pregnancy
    if (lowerText.includes("pregnant") || lowerText.includes("pregnancy")) {
      profile.isPregnant = true;
      if (profile.gender === "male") {
        // If sender is male speaking about wife, we mark pregnancy active for case dashboard mapping
        profile.isPregnant = true;
      }
    }

    // Caste Categories (simulated heuristics or default)
    if (lowerText.includes("sc") || origLower.includes("अनुसूचित जाति")) {
      profile.category = "SC";
      profile.isBpl = true;
    } else if (lowerText.includes("st") || origLower.includes("अनुसूचित जनजाति")) {
      profile.category = "ST";
      profile.isBpl = true;
    } else if (lowerText.includes("obc") || origLower.includes("पिछड़ा वर्ग")) {
      profile.category = "OBC";
    }

    return profile;
  }

  // Generate dynamic matching bots responses based on parsed eligibility
  generateBotResponse(profile, lang) {
    // Run rule evaluation against SCHEMES
    if (typeof window !== "undefined" && window.SCHEMES) {
      const matches = window.SCHEMES.filter(s => s.eligibilityRules.check(profile));
      
      const greetings = {
        en: `Thank you, ${profile.name || "friend"}. Based on the details provided:`,
        hi: `धन्यवाद, ${profile.name || "मित्र"}। आपके द्वारा दी गई जानकारी के अनुसार:`,
        mr: `धन्यवाद, ${profile.name || "मित्रा"}. आपण दिलेल्या माहितीनुसार:`,
        ta: `நன்றி, ${profile.name || "நண்பரே"}. நீங்கள் வழங்கிய விவரங்களின் அடிப்படையில்:`,
        te: `ధన్యవాదాలు, ${profile.name || "మిత్రమా"}. మీరు అందించిన వివరాల ప్రకారం:`,
        bn: `ধন্যবাদ, ${profile.name || "বন্ধু"}। আপনার দেওয়া তথ্য অনুযায়ী:`
      };

      const followups = {
        en: "\n\nI have created a dedicated case folder. A local community volunteer (Haq Mitra) can now print your pre-filled application forms and guide you through verifying your documents.",
        hi: "\n\nमैंने आपके लिए एक डिजिटल फ़ाइल बना दी है। आपके क्षेत्र के सामाजिक कार्यकर्ता (हक़ मित्र) आपके लिए आवेदन पत्र प्रिंट कर सकते हैं और दस्तावेजों की जांच में मदद कर सकते हैं।",
        mr: "\n\nमी तुमची डिजिटल फाईल तयार केली आहे. तुमच्या भागातील सामाजिक कार्यकर्ते (हक मित्र) अर्ज प्रिंट करू शकतात आणि कागदपत्रे तपासण्यात मदत करू शकतात.",
        ta: "\n\nநான் உங்களுக்காக ஒரு கோப்பை உருவாக்கியுள்ளேன். உங்கள் பகுதி சமூக ஊழியர் இந்த விண்ணப்பங்களை அச்சிட்டு, ஆவணங்களைச் சரிபார்க்க உங்களுக்கு உதவுவார்.",
        te: "\n\nనేను మీ కోసం ఒక డిజిటల్ ఫైల్‌ను సృష్టించాను. మీ ప్రాంతంలోని స్వచ్ఛంద సేవకుడు (హక్ మిత్ర) ఈ దరఖాస్తును ప్రింట్ చేసి, మీ పత్రాలను సరిచూసుకోవడంలో సహాయపడతారు.",
        bn: "\n\nআমি আপনার জন্য একটি ডিজিটাল ফাইল তৈরি করেছি। আপনার এলাকার সমাজকর্মী (হক মিত্র) আপনার জন্য আবেদনপত্র প্রিন্ট করে দিতে পারবেন এবং নথিপত্র মেলাতে সাহায্য করবেন।"
      };

      let response = greetings[lang] || greetings.en;
      
      if (matches.length === 0) {
        const noMatchMsg = {
          en: "\nWe couldn't match you to a specific scheme immediately. Let me gather more info. What is your family income, and do you own a BPL ration card?",
          hi: "\nअभी किसी योजना से सीधा मिलान नहीं हो पाया है। कृपया कुछ और जानकारी दें - क्या आपके पास बीपीएल राशन कार्ड है, और आपकी कुल मासिक आय कितनी है?",
          mr: "\nसध्या कोणत्याही योजनेशी थेट जुळणी झाली नाही. कृपया अधिक माहिती द्या - तुमच्याकडे बीपीएल रेशन कार्ड आहे का, आणि तुमचे एकूण मासिक उत्पन्न किती आहे?",
          ta: "\nதற்போது எந்தத் திட்டமும் நேரடியாகப் பொருந்தவில்லை. உங்களிடம் பிபிஎல் ரேஷன் கார்டு இருக்கிறதா, உங்கள் மாத வருமானம் எவ்வளவு?",
          te: "\nప్రస్తుతం ఏ పథకంతోనూ సరిపోలలేదు. మీ వద్ద బీపీఎల్ రేషన్ కార్డ్ ఉందా, మరియు మీ నెలవारी ఆదాయం ఎంత?",
          bn: "\nবর্তমানে কোনো প্রকল্পের সাথে সরাসরি মিল পাওয়া যায়নি। আপনার কাছে কি বিপিএল রেশন কার্ড আছে, এবং আপনার মাসিক আয় কত?"
        };
        response += noMatchMsg[lang] || noMatchMsg.en;
      } else {
        response += "\n";
        matches.forEach((s, idx) => {
          const schemeName = s.vernacularNames[lang] || s.name;
          response += `\n${idx + 1}. **${schemeName}**`;
        });
        response += followups[lang] || followups.en;
      }
      return response;
    }
    
    // Fallback response if SCHEMES is not loaded globally
    return "Profile parsed. Please check the Caseworker Dashboard to see matching schemes and document checklists.";
  }

  resetChat() {
    this.chatHistory = [];
    this.currentProfile = {
      name: "",
      age: null,
      gender: "male",
      state: "Uttar Pradesh",
      occupation: "other",
      landholding: 0,
      annualIncome: null,
      category: "General",
      isBpl: false,
      isPregnant: false,
      isDisabled: false,
      hasConcreteHouse: true,
      hasLpgConnection: false,
      hasGovtPension: false,
      isTaxPayer: false,
      isWidow: false,
      isGovtEmployee: false
    };
    this.onUpdateProfile(this.currentProfile);
    
    // Re-initialize with initial greeting in current language
    const greeting = this.languages[this.language].greeting;
    this.chatHistory.push({
      sender: "bot",
      text: greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.onUpdateChat([...this.chatHistory]);
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { WhatsAppEngine };
}

/**
 * AWAAZ — "Haq Mitra" (My Rights Friend)
 * Application Controller (Coordinates UI, Event Listeners, State Rendering)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Engines (SCHEMES must be loaded globally from schemes.js)
  const schemesList = window.SCHEMES || [];
  const dashboard = new CaseworkerDashboard(schemesList);
  
  // Wires up updates from WhatsApp Simulator
  const whatsapp = new WhatsAppEngine(
    // onUpdateProfile
    (profile) => {
      renderProfileAnalysis(profile);
      // Synchronize changes to active caseworker inputs if it matches
    },
    // onUpdateChat
    (chatHistory) => {
      renderChatStream(chatHistory);
    },
    // onSpeakStatus
    (status, errorMsg) => {
      updateVoiceButtonState(status, errorMsg);
    }
  );

  // Expose engines globally for debugging
  window.awaazApp = { whatsapp, dashboard };

  // 2. DOM Elements Selection
  const tabButtons = document.querySelectorAll(".nav-link");
  const tabContents = document.querySelectorAll(".tab-pane");
  const themeToggle = document.getElementById("theme-toggle");
  const langSelect = document.getElementById("global-lang");
  
  // WhatsApp Elements
  const chatMessages = document.getElementById("chat-messages");
  const recordBtn = document.getElementById("record-btn");
  const micIcon = recordBtn.querySelector(".mic-icon");
  const visualizerCanvas = document.getElementById("visualizer");
  const chatInput = document.getElementById("chat-text-input");
  const sendBtn = document.getElementById("send-btn");
  const stopSpeakBtn = document.getElementById("stop-speak-btn");
  const scenarioCards = document.querySelectorAll(".scenario-card");
  
  // Extractor Elements
  const extName = document.getElementById("ext-name");
  const extAge = document.getElementById("ext-age");
  const extGender = document.getElementById("ext-gender");
  const extState = document.getElementById("ext-state");
  const extOccupation = document.getElementById("ext-occupation");
  const extIncome = document.getElementById("ext-income");
  const extLand = document.getElementById("ext-land");
  const extPreg = document.getElementById("ext-preg");
  const extConcrete = document.getElementById("ext-concrete");
  const extMatchedSchemes = document.getElementById("ext-matched-schemes");
  const saveCaseBtn = document.getElementById("save-case-btn");

  // Caseworker Elements
  const caseListContainer = document.getElementById("case-list");
  const docChecklistContainer = document.getElementById("doc-checklist");
  const activeCaseDetails = document.getElementById("active-case-details");
  const caseNameHeader = document.getElementById("case-name-header");
  const caseIdHeader = document.getElementById("case-id-header");
  const formPreviewContainer = document.getElementById("form-preview-container");
  const activeCaseSchemeSelect = document.getElementById("active-case-scheme-select");
  const printFormBtn = document.getElementById("print-form-btn");

  // Scheme Explorer Elements
  const schemesContainer = document.getElementById("schemes-container");
  const schemeSearchInput = document.getElementById("scheme-search");
  const schemeCategoryFilters = document.querySelectorAll(".filter-btn");

  // Visualizer Animation variables
  let visualizerInterval = null;
  let audioContext = null;
  let canvasContext = visualizerCanvas.getContext("2d");

  // 3. Tab Routing Logic
  tabButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute("data-tab");
      
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      
      btn.classList.add("active");
      document.getElementById(targetTab).classList.add("active");

      // Handle tab-specific load actions
      if (targetTab === "caseworker-tab") {
        renderCaseList();
        renderActiveCase();
      } else if (targetTab === "schemes-tab") {
        renderSchemeExplorer();
      }
    });
  });

  // Theme Toggler
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  });

  // Global Language Selector
  langSelect.addEventListener("change", (e) => {
    const selectedLang = e.target.value;
    whatsapp.setLanguage(selectedLang);
    whatsapp.resetChat();
  });

  // 4. WhatsApp Chat Simulation Wires
  whatsapp.resetChat(); // Load initial greeting

  // Text input submission
  sendBtn.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (text) {
      whatsapp.processSpeechInput(text);
      chatInput.value = "";
    }
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendBtn.click();
    }
  });

  // Speech Record Button Wires
  recordBtn.addEventListener("click", () => {
    if (whatsapp.isRecording) {
      whatsapp.stopRecording();
    } else {
      whatsapp.startRecording();
    }
  });

  stopSpeakBtn.addEventListener("click", () => {
    whatsapp.stopSpeaking();
  });

  // Pre-configured Scenarios Wires
  scenarioCards.forEach(card => {
    card.addEventListener("click", () => {
      const scenarioKey = card.getAttribute("data-scenario");
      // Visual feedback
      scenarioCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      
      whatsapp.resetChat();
      whatsapp.loadScenario(scenarioKey);
      
      // Select appropriate language on UI
      const scenario = whatsapp.scenarios[scenarioKey];
      langSelect.value = scenario.language;
    });
  });

  // Save Case to Caseworker Panel
  saveCaseBtn.addEventListener("click", () => {
    const newCase = dashboard.addCaseFromProfile(whatsapp.currentProfile);
    
    // Custom beautiful alert/toast
    showToast(`Case folder created for ${newCase.name} (${newCase.id})! Opening caseworker portal...`);
    
    // Auto navigate to caseworker dashboard
    setTimeout(() => {
      document.querySelector('[data-tab="caseworker-tab"]').click();
      renderCaseList();
      dashboard.setActiveCase(newCase.id);
      renderActiveCase();
    }, 1200);
  });

  // 5. WhatsApp UI Renderers
  function renderChatStream(history) {
    chatMessages.innerHTML = "";
    history.forEach(msg => {
      const isBot = msg.sender === "bot";
      const bubble = document.createElement("div");
      bubble.classList.add("chat-bubble", isBot ? "bot-bubble" : "user-bubble");
      
      let translationHTML = "";
      if (msg.translation) {
        translationHTML = `<div class="msg-translation">🌐 Translated: "${msg.translation}"</div>`;
      }

      let audioIconHTML = "";
      if (msg.isAudioSimulated) {
        audioIconHTML = `<div class="audio-note-sim">🎙️ Voice Note</div>`;
      }

      // Convert Markdown to Simple HTML in response
      let formattedText = msg.text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

      bubble.innerHTML = `
        <div class="message-content">
          ${audioIconHTML}
          <p>${formattedText}</p>
          ${translationHTML}
          <span class="message-time">${msg.timestamp}</span>
        </div>
      `;
      chatMessages.appendChild(bubble);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function renderProfileAnalysis(profile) {
    extName.innerText = profile.name || "Detecting...";
    extAge.innerText = profile.age ? `${profile.age} Years` : "Detecting...";
    extGender.innerText = profile.gender ? profile.gender.toUpperCase() : "Detecting...";
    extState.innerText = profile.state || "Detecting...";
    extOccupation.innerText = profile.occupation ? profile.occupation.replace("_", " ").toUpperCase() : "Detecting...";
    extIncome.innerText = profile.annualIncome ? `₹${profile.annualIncome.toLocaleString('en-IN')}` : "Detecting...";
    extLand.innerText = profile.landholding ? `${profile.landholding} Hectares` : "0 (Landless)";
    extPreg.innerText = profile.isPregnant ? "Yes" : "No";
    extConcrete.innerText = profile.hasConcreteHouse ? "Yes (Concrete)" : "No (Kutcha)";

    // Run direct eligibility
    extMatchedSchemes.innerHTML = "";
    const matches = schemesList.filter(s => s.eligibilityRules.check(profile));
    
    if (matches.length === 0) {
      extMatchedSchemes.innerHTML = `<li class="no-schemes-badge">Waiting for matches...</li>`;
      saveCaseBtn.disabled = true;
    } else {
      saveCaseBtn.disabled = false;
      matches.forEach(s => {
        const li = document.createElement("li");
        li.className = "matched-scheme-item-badge";
        li.innerHTML = `
          <div class="badge-title">${s.name}</div>
          <div class="badge-subtitle">${s.type} • ${s.category}</div>
        `;
        extMatchedSchemes.appendChild(li);
      });
    }
  }

  function updateVoiceButtonState(status, errorMsg) {
    if (status === "listening") {
      recordBtn.classList.add("recording");
      micIcon.textContent = "⏹️";
      recordBtn.querySelector(".btn-label").textContent = "Stop & Process";
      startVisualizerAnimation();
    } else if (status === "speaking") {
      stopSpeakBtn.style.display = "inline-flex";
    } else if (status === "idle") {
      recordBtn.classList.remove("recording");
      micIcon.textContent = "🎙️";
      recordBtn.querySelector(".btn-label").textContent = "Record Voice";
      stopSpeakBtn.style.display = "none";
      stopVisualizerAnimation();
    } else if (status === "error") {
      recordBtn.classList.remove("recording");
      micIcon.textContent = "🎙️";
      recordBtn.querySelector(".btn-label").textContent = "Record Voice";
      stopVisualizerAnimation();
      showToast(`Voice input failed: ${errorMsg || "unsupported"}. Using manual typing instead!`);
    }
  }

  // Audio Canvas Visualizer simulation
  function startVisualizerAnimation() {
    visualizerCanvas.style.display = "block";
    const width = visualizerCanvas.width;
    const height = visualizerCanvas.height;
    
    visualizerInterval = setInterval(() => {
      canvasContext.clearRect(0, 0, width, height);
      canvasContext.fillStyle = "#FF7C0A";
      
      const barWidth = 4;
      const spacing = 3;
      const numBars = Math.floor(width / (barWidth + spacing));
      
      for (let i = 0; i < numBars; i++) {
        // Create sinusoidal/random wave behavior
        const factor = Math.sin((i / 5) + (Date.now() / 150));
        const amplitude = Math.random() * (height / 2);
        const barHeight = (height / 3) + (factor * amplitude);
        const y = (height - barHeight) / 2;
        
        canvasContext.fillRect(i * (barWidth + spacing), y, barWidth, barHeight);
      }
    }, 80);
  }

  function stopVisualizerAnimation() {
    if (visualizerInterval) {
      clearInterval(visualizerInterval);
      visualizerInterval = null;
    }
    canvasContext.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    visualizerCanvas.style.display = "none";
  }

  // 6. Caseworker Dashboard Wires & Renderers
  function renderCaseList() {
    caseListContainer.innerHTML = "";
    dashboard.cases.forEach(c => {
      const activeCase = dashboard.getActiveCase();
      const div = document.createElement("div");
      div.className = `case-card-item ${c.id === activeCase.id ? 'active' : ''}`;
      
      // Calculate documents progress
      const docs = Object.keys(c.documents);
      const verifiedDocsCount = docs.filter(d => c.documents[d]).length;
      
      div.innerHTML = `
        <div class="case-meta">
          <span class="case-id-tag">${c.id}</span>
          <span class="case-state-badge">${c.state}</span>
        </div>
        <h4 class="case-name">${c.name}</h4>
        <div class="case-details">
          <span>Age: ${c.age}</span> • <span>${c.occupation.replace("_", " ")}</span>
        </div>
        <div class="case-progress-bar">
          <div class="progress-fill" style="width: ${(verifiedDocsCount / Math.max(1, docs.length)) * 100}%"></div>
        </div>
        <div class="case-docs-count">${verifiedDocsCount}/${docs.length} Documents Verified</div>
      `;

      div.addEventListener("click", () => {
        dashboard.setActiveCase(c.id);
        renderCaseList(); // updates active selection highlight
        renderActiveCase();
      });

      caseListContainer.appendChild(div);
    });
  }

  function renderActiveCase() {
    const caseObj = dashboard.getActiveCase();
    if (!caseObj) return;

    caseNameHeader.textContent = caseObj.name;
    caseIdHeader.textContent = `ID: ${caseObj.id}`;

    // Fill demographic inputs in form editor sidebar
    document.getElementById("edit-name").value = caseObj.name;
    document.getElementById("edit-age").value = caseObj.age;
    document.getElementById("edit-gender").value = caseObj.gender;
    document.getElementById("edit-state").value = caseObj.state;
    document.getElementById("edit-occupation").value = caseObj.occupation;
    document.getElementById("edit-income").value = caseObj.annualIncome || "";
    document.getElementById("edit-land").value = caseObj.landholding;
    document.getElementById("edit-bpl").checked = caseObj.isBpl;
    document.getElementById("edit-preg").checked = caseObj.isPregnant;
    document.getElementById("edit-disabled").checked = caseObj.isDisabled;
    document.getElementById("edit-concrete").checked = caseObj.hasConcreteHouse;

    // Fill contact details
    document.getElementById("edit-phone").value = caseObj.phone || "";
    document.getElementById("edit-aadhaar").value = caseObj.aadhaar || "";
    document.getElementById("edit-ration").value = caseObj.rationCard || "";
    document.getElementById("edit-bankname").value = caseObj.bankName || "";
    document.getElementById("edit-bankacc").value = caseObj.bankAcc || "";
    document.getElementById("edit-bankifsc").value = caseObj.bankIfsc || "";
    document.getElementById("edit-district").value = caseObj.district || "";
    document.getElementById("edit-village").value = caseObj.village || "";

    // Save profile modifications handler
    const saveProfileChanges = () => {
      caseObj.name = document.getElementById("edit-name").value;
      caseObj.age = parseInt(document.getElementById("edit-age").value) || caseObj.age;
      caseObj.gender = document.getElementById("edit-gender").value;
      caseObj.state = document.getElementById("edit-state").value;
      caseObj.occupation = document.getElementById("edit-occupation").value;
      caseObj.annualIncome = parseInt(document.getElementById("edit-income").value) || caseObj.annualIncome;
      caseObj.landholding = parseFloat(document.getElementById("edit-land").value) || 0;
      caseObj.isBpl = document.getElementById("edit-bpl").checked;
      caseObj.isPregnant = document.getElementById("edit-preg").checked;
      caseObj.isDisabled = document.getElementById("edit-disabled").checked;
      caseObj.hasConcreteHouse = document.getElementById("edit-concrete").checked;

      caseObj.phone = document.getElementById("edit-phone").value;
      caseObj.aadhaar = document.getElementById("edit-aadhaar").value;
      caseObj.rationCard = document.getElementById("edit-ration").value;
      caseObj.bankName = document.getElementById("edit-bankname").value;
      caseObj.bankAcc = document.getElementById("edit-bankacc").value;
      caseObj.bankIfsc = document.getElementById("edit-bankifsc").value;
      caseObj.district = document.getElementById("edit-district").value;
      caseObj.village = document.getElementById("edit-village").value;

      // Update documents based on new matches (don't delete verified ones though)
      const matched = schemesList.filter(s => s.eligibilityRules.check(caseObj));
      matched.forEach(s => {
        s.requiredDocuments.forEach(doc => {
          if (!(doc in caseObj.documents)) {
            caseObj.documents[doc] = false;
          }
        });
      });

      renderCaseList();
      renderActiveCase();
      showToast("Beneficiary profile updated successfully!");
    };

    // Remove old listeners to prevent leak
    const saveDetailsBtn = document.getElementById("save-case-details-btn");
    const newSaveDetailsBtn = saveDetailsBtn.cloneNode(true);
    saveDetailsBtn.parentNode.replaceChild(newSaveDetailsBtn, saveDetailsBtn);
    newSaveDetailsBtn.addEventListener("click", saveProfileChanges);

    // Compute schemes matched & render select dropdown
    const matchedSchemes = schemesList.filter(s => s.eligibilityRules.check(caseObj));
    activeCaseSchemeSelect.innerHTML = "";
    
    if (matchedSchemes.length === 0) {
      activeCaseSchemeSelect.innerHTML = `<option value="">No Schemes Matched</option>`;
      docChecklistContainer.innerHTML = `<div class="no-docs-message">No matching schemes. Update eligibility profile inputs above.</div>`;
      formPreviewContainer.innerHTML = `<div class="no-form-message">No application preview available.</div>`;
      printFormBtn.disabled = true;
    } else {
      printFormBtn.disabled = false;
      matchedSchemes.forEach(s => {
        const option = document.createElement("option");
        option.value = s.id;
        option.textContent = s.name;
        activeCaseSchemeSelect.appendChild(option);
      });

      // Render default scheme details on drop selection
      const renderSelectedSchemeDetails = () => {
        const selectedSchemeId = activeCaseSchemeSelect.value;
        const selectedScheme = schemesList.find(s => s.id === selectedSchemeId);
        if (selectedScheme) {
          renderCaseChecklist(caseObj, selectedScheme);
          renderApplicationPreview(caseObj, selectedScheme);
        }
      };

      activeCaseSchemeSelect.addEventListener("change", renderSelectedSchemeDetails);
      renderSelectedSchemeDetails();
    }
  }

  function renderCaseChecklist(caseObj, scheme) {
    docChecklistContainer.innerHTML = "";
    
    // Display Ministry and Benefit Summary first
    const schemeBrief = document.createElement("div");
    schemeBrief.className = "scheme-brief-box";
    schemeBrief.innerHTML = `
      <h5>${scheme.ministry}</h5>
      <p><strong>Benefit:</strong> ${scheme.benefits}</p>
    `;
    docChecklistContainer.appendChild(schemeBrief);

    scheme.requiredDocuments.forEach(doc => {
      const isVerified = !!caseObj.documents[doc];
      
      const div = document.createElement("div");
      div.className = `checklist-row-item ${isVerified ? 'verified' : 'pending'}`;
      
      div.innerHTML = `
        <label class="doc-chk-label">
          <input type="checkbox" class="doc-checkbox-input" ${isVerified ? 'checked' : ''}>
          <span class="custom-checkbox"></span>
          <span class="doc-name-text">${doc}</span>
        </label>
        <span class="doc-status-pill">${isVerified ? 'Verified' : 'Pending'}</span>
      `;

      // Checkbox click behavior
      const chk = div.querySelector(".doc-checkbox-input");
      chk.addEventListener("change", (e) => {
        const checked = e.target.checked;
        dashboard.updateCaseDocumentStatus(caseObj.id, doc, checked);
        
        // Refresh items
        renderCaseList(); // Refreshes verified document fraction
        renderCaseChecklist(caseObj, scheme);
        renderApplicationPreview(caseObj, scheme);
      });

      docChecklistContainer.appendChild(div);
    });
  }

  function renderApplicationPreview(caseObj, scheme) {
    formPreviewContainer.innerHTML = dashboard.generatePrefilledFormHTML(caseObj, scheme);
  }

  // Printing application form action
  printFormBtn.addEventListener("click", () => {
    window.print();
  });

  // 7. Scheme Explorer Wires & Renderers
  let activeExplorerCategory = "All";

  function renderSchemeExplorer() {
    schemesContainer.innerHTML = "";
    const searchVal = schemeSearchInput.value.toLowerCase().trim();

    const filtered = schemesList.filter(scheme => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchVal) || 
                            scheme.ministry.toLowerCase().includes(searchVal) ||
                            scheme.description.toLowerCase().includes(searchVal);
      
      const matchesCategory = activeExplorerCategory === "All" || 
                              scheme.category === activeExplorerCategory;
      
      return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
      schemesContainer.innerHTML = `<div class="no-schemes-found">No government schemes match your criteria. Try adjusting filters.</div>`;
      return;
    }

    filtered.forEach(scheme => {
      const card = document.createElement("div");
      card.className = "scheme-info-card";
      
      card.innerHTML = `
        <div class="scheme-card-header">
          <span class="scheme-type-tag ${scheme.type.toLowerCase()}">${scheme.type} Government</span>
          <span class="scheme-cat-badge">${scheme.category}</span>
        </div>
        <h3 class="scheme-card-title">${scheme.name}</h3>
        <h4 class="scheme-card-ministry">${scheme.ministry}</h4>
        <p class="scheme-card-desc">${scheme.description}</p>
        
        <div class="scheme-benefits-callout">
          <strong>Benefits:</strong> ${scheme.benefits}
        </div>

        <div class="scheme-accordion-section">
          <div class="accordion-header">📋 Required Documents (${scheme.requiredDocuments.length})</div>
          <ul class="accordion-content doc-bullet-list">
            ${scheme.requiredDocuments.map(doc => `<li>${doc}</li>`).join("")}
          </ul>
        </div>

        <div class="scheme-accordion-section">
          <div class="accordion-header">⚙️ Eligibility Evaluation Criteria</div>
          <div class="accordion-content eligibility-clause">
            <p>${scheme.eligibilityRules.description}</p>
            <div class="eligibility-calculator-box">
              <h6>Quick Eligibility Calculator</h6>
              <div class="calculator-inputs-grid">
                <div class="calc-input">
                  <label>Age</label>
                  <input type="number" class="calc-age" value="35" min="1" max="100">
                </div>
                <div class="calc-input">
                  <label>Annual Income (₹)</label>
                  <input type="number" class="calc-income" value="60000" step="5000">
                </div>
                <div class="calc-input">
                  <label>Occupation</label>
                  <select class="calc-occ">
                    <option value="farmer">Farmer</option>
                    <option value="laborer">Laborer</option>
                    <option value="domestic_worker">Domestic Worker</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="other">Other/Professional</option>
                  </select>
                </div>
                <div class="calc-input">
                  <label>State</label>
                  <select class="calc-state">
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                </div>
              </div>
              <div class="calc-checkboxes">
                <label><input type="checkbox" class="calc-bpl" checked> Has BPL Card</label>
                <label><input type="checkbox" class="calc-preg"> Pregnant</label>
                <label><input type="checkbox" class="calc-disabled"> Disabled</label>
              </div>
              <button class="calc-evaluate-btn">Check Eligibility</button>
              <div class="calc-result-alert"></div>
            </div>
          </div>
        </div>
      `;

      // Setup simple accordion toggles
      const accordionHeaders = card.querySelectorAll(".accordion-header");
      accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
          header.classList.toggle("open");
          const content = header.nextElementSibling;
          content.classList.toggle("open");
        });
      });

      // Quick Eligibility calculation events
      const calcAge = card.querySelector(".calc-age");
      const calcIncome = card.querySelector(".calc-income");
      const calcOcc = card.querySelector(".calc-occ");
      const calcState = card.querySelector(".calc-state");
      const calcBpl = card.querySelector(".calc-bpl");
      const calcPreg = card.querySelector(".calc-preg");
      const calcDisabled = card.querySelector(".calc-disabled");
      const calcBtn = card.querySelector(".calc-evaluate-btn");
      const calcResult = card.querySelector(".calc-result-alert");

      calcBtn.addEventListener("click", () => {
        // Construct temporary profile for calculation
        const testProfile = {
          name: "Test User",
          age: parseInt(calcAge.value) || 35,
          annualIncome: parseInt(calcIncome.value) || 60000,
          occupation: calcOcc.value,
          state: calcState.value,
          gender: "female", // default testing
          category: "General",
          isBpl: calcBpl.checked,
          isPregnant: calcPreg.checked,
          isDisabled: calcDisabled.checked,
          hasConcreteHouse: false,
          hasLpgConnection: false,
          hasGovtPension: false
        };

        const passes = scheme.eligibilityRules.check(testProfile);
        calcResult.style.display = "block";
        if (passes) {
          calcResult.className = "calc-result-alert success";
          calcResult.innerHTML = `<strong>Eligible!</strong> Profile attributes meet the qualifying thresholds for this scheme.`;
        } else {
          calcResult.className = "calc-result-alert fail";
          calcResult.innerHTML = `<strong>Ineligible.</strong> Profile does not meet the specified criteria.`;
        }
      });

      schemesContainer.appendChild(card);
    });
  }

  // Wire up filter triggers
  schemeCategoryFilters.forEach(btn => {
    btn.addEventListener("click", () => {
      schemeCategoryFilters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeExplorerCategory = btn.getAttribute("data-category");
      renderSchemeExplorer();
    });
  });

  schemeSearchInput.addEventListener("input", renderSchemeExplorer);

  // 8. Custom Notification System (Toast)
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 4000);
  }
});

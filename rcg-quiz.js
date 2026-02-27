(function () {
    const CFG = {
        WEBHOOK: 'https://hook.eu2.make.com/YOUR_WEBHOOK_ID',
        BOOK_URL: '/contact',
        LOOPS_API_KEY: '77b1203684adef8831e2d5e7b6230ed1'  // 🔑 Replace with your Loops.so API key
    };

    const PROFILES = [
        { min: 7, max: 11, tier: 'High Risk', name: 'The Reactive Negotiator' },
        { min: 12, max: 14, tier: 'Developing', name: 'The Cautious Negotiator' },
        { min: 15, max: 18, tier: 'Advanced', name: 'The Composed Negotiator' },
        { min: 19, max: 21, tier: 'Elite', name: 'The Master Negotiator' }
    ];

    const GLOSSARY = [
        { t: 'GDV', d: 'Gross Development Value - Total estimated value of a property project upon completion.' },
        { t: 'UHNW', d: 'Ultra-High-Net-Worth - Individuals with investable assets exceeding £30 million.' },
        { t: 'BATNA', d: 'Best Alternative To a Negotiated Agreement - Your strongest walk-away option.' },
        { t: 'Emotional Regulation', d: 'The ability to maintain composure and strategic thinking under pressure.' },
        { t: 'Phantom Bidder', d: 'A pressure tactic where counterparties claim competing offers exist.' },
        { t: 'No-Oriented Question', d: 'Tactical communication method designed to elicit "no" responses.' },
        { t: 'JV', d: 'Joint Venture - Strategic partnership sharing risk and profit.' },
        { t: 'Forward-Funding', d: 'Investment model where funder commits capital before development completion.' }
    ];

    const QS = [
        { tag: 'Pressure-Induced Errors', q: 'A £25M disposal is at the exchange stage. The counterparty legal team introduces a late, complex warranty demand to chip the price by £500k. Your lead agent fears the deal will unravel.', opts: ['Concede the margin to secure the exchange immediately.', 'Split the difference to show good faith.', 'Pause the negotiation completely to signal indifference.'], scores: [1, 2, 3] },
        { tag: 'Influence Without Authority', q: 'You are in a Joint Venture dialogue with a Local Authority partner who is stalling on a key planning density agreement.', opts: ['Escalate to legal or political channels.', 'Accept the lower density to maintain relationship.', 'Reframe the stakeholder vector victory conditions.'], scores: [1, 2, 3] },
        { tag: 'Trust Deficit', q: 'An UHNW client becomes emotionally volatile during a site visit, threatening to withdraw instruction due to a perceived lack of deference.', opts: ['Apologise profusely and offer fee reduction.', 'Defend your team professionalism with evidence.', 'Tactically empathise with frustration then pivot.'], scores: [1, 2, 3] },
        { tag: 'Pressure-Induced Errors', q: 'Your firm is competing for a landmark site. Vendor hints a rival bid is 5% higher but "prefers your vision" if you match by close of play.', opts: ['Match the bid immediately.', 'Increase your offer by 2.5% as compromise.', 'Stand firm on valuation but enhance non-monetary terms.'], scores: [1, 2, 3] },
        { tag: 'Influence Without Authority', q: 'A key institutional investor is getting cold feet on forward-funding. They are unresponsive to your calls.', opts: ['Send detailed email explaining fears are unfounded.', 'Wait for them to reach out.', 'Trigger a "No-Oriented" communication.'], scores: [1, 2, 3] },
        { tag: 'Trust Deficit', q: 'Negotiating a lease renewal with a long-term commercial tenant who feels "gouged" by the new market rent proposal.', opts: ['Strictly rely on comparable evidence.', 'Offer a rent-free period.', 'Validate feelings of being squeezed before numbers.'], scores: [1, 2, 3] },
        { tag: 'Pressure-Induced Errors', q: 'During a board conflict regarding a capital call, personal accusations are made against your division.', opts: ['Counter-attack with data.', 'Suppress anger and remain silent.', 'Label the emotion in the room and steer back.'], scores: [1, 2, 3] }
    ];

    const UI_TEMPLATE = `
    <div class="rcg-quiz-container">
        <!-- (Global top-right removed as per request) -->

        <main id="rcg-quiz-main">
            <!-- ══ 1. INTRO ══ -->
            <div class="rcg-screen rcg-active rcg-theme-dark" id="rcg-intro">
                <div class="rcg-card" style="max-width:860px;margin:0 auto;text-align:center;position:relative">
                    <button class="rcg-btn-top-right" onclick="toggleModal('glossary-modal', true)"
                        title="Open Glossary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"
                            stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </button>
                    <h1 class="rcg-screen-title rcg-serif" style="margin-bottom:48px; font-size: 42px;">Let's start with
                        your<br>name & email</h1>
                    <div style="max-width: 700px; margin: 0 auto; text-align:left">
                        <div class="rcg-field-group">
                            <label class="rcg-field-label" style="opacity: 0.8;">Enter your name</label>
                            <input class="rcg-field-input" type="text" id="inp-name" placeholder="" />
                        </div>
                        <div class="rcg-field-group">
                            <label class="rcg-field-label" style="opacity: 0.8;">Enter your email <span
                                    style="color:#bb0000">*</span></label>
                            <div style="position: relative;">
                                <span style="position: absolute; left: 16px; top: 13px; color: #8b8ba0;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                <input class="rcg-field-input" type="email" id="inp-email"
                                    placeholder="email@example.com" style="padding-left: 48px;" />
                            </div>
                            <p class="rcg-error-msg" id="err-intro">Please enter your name and a valid email.</p>
                        </div>
                    </div>
                    <div class="rcg-btn-row" style="max-width: 700px; margin: 40px auto 0;">
                        <button class="rcg-btn-cancel" onclick="closeQuizApp()">Cancel</button>
                        <button class="rcg-btn-next" onclick="submitIntro()">Next <svg
                                xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"
                                viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg></button>
                    </div>
                </div>
            </div>

            <!-- ══ 2. CONTEXT ══ -->
            <div class="rcg-screen rcg-theme-dark" id="rcg-context">
                <div class="rcg-card" style="position:relative">
                    <button class="rcg-btn-top-right" onclick="toggleModal('glossary-modal', true)"
                        title="Open Glossary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"
                            stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </button>
                    <h2 class="rcg-screen-title">Select Your Professional Context</h2>
                    <p class="rcg-screen-sub">Choose the environment that best matches your negotiation landscape. This
                        ensures scenarios are calibrated to your specific challenges.</p>
                    <div class="rcg-context-list">
                        <div class="rcg-ctx-card" onclick="selectContext(this,'Real Estate Professional')" id="ctx-0">
                            <div class="rcg-ctx-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div style="flex: 1;">
                                <div class="rcg-ctx-name">Real Estate Professional</div>
                                <div class="rcg-ctx-desc">I work in property development, investment, sales, or lettings
                                    and negotiate deals involving land, buildings, or real estate transactions.</div>
                                <div
                                    style="display: flex; align-items: center; gap: 8px; color: #8b8ba0; font-size: 13px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Scenarios: GDV, JV partnerships, UHNW clients, property disposals
                                </div>
                            </div>
                            <div style="color: #4a5568; align-self: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        <div class="rcg-ctx-card" onclick="selectContext(this,'Business Leader')" id="ctx-1">
                            <div class="rcg-ctx-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div style="flex: 1;">
                                <div class="rcg-ctx-name">Business Executive / Leader</div>
                                <div class="rcg-ctx-desc">I lead business operations, corporate strategy, M&A,
                                    partnerships, or executive negotiations across any industry outside of real estate.
                                </div>
                                <div
                                    style="display: flex; align-items: center; gap: 8px; color: #8b8ba0; font-size: 13px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Scenarios: M&A, vendor contracts, funding, cross-functional influence
                                </div>
                            </div>
                            <div style="color: #4a5568; align-self: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="rcg-btn-row">
                        <button class="rcg-btn-cancel" onclick="go('rcg-intro')">← Back</button>
                        <button class="rcg-btn-next" id="btn-ctx" onclick="go('rcg-calibration')" disabled
                            title="Please select a context">Continue <svg xmlns="http://www.w3.org/2000/svg" width="14"
                                height="14" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg></button>
                    </div>
                </div>
            </div>

            <!-- ══ 3. AUDIT CALIBRATION ══ -->
            <div class="rcg-screen rcg-theme-dark" id="rcg-calibration">
                <div class="rcg-card" style="position:relative">
                    <button class="rcg-btn-top-right" onclick="toggleModal('glossary-modal', true)"
                        title="Open Glossary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"
                            stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                    </button>
                    <h2 class="rcg-screen-title">Audit Calibration</h2>
                    <p class="rcg-screen-sub">To ensure your projection is calibrated to your context, please provide
                        your sector details.</p>

                    <div style="width: 100%;">
                        <div class="rcg-cal-section" style="margin-bottom: 32px;">
                            <div class="rcg-cal-label" style="font-weight: 700; color: #fff; margin-bottom: 12px;">
                                Professional Role</div>
                            <div style="position: relative;">
                                <select class="rcg-cal-select" id="cal-role" onchange="checkCal()">
                                    <option value="">Select your position...</option>
                                    <option>Partner / Principal</option>
                                    <option>Associate Director</option>
                                    <option>Director / Head of</option>
                                    <option>C-Suite / MD</option>
                                    <option>Business Owner / Founder</option>
                                    <option>Consultant / Advisor</option>
                                </select>
                                <span
                                    style="position: absolute; right: 16px; top: 18px; pointer-events: none; color: #8b8ba0;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        <div class="rcg-cal-section">
                            <div class="rcg-cal-label" style="font-weight: 700; color: #fff; margin-bottom: 8px;">
                                Annual Transaction Volume (GDV/Sales) <span
                                    style="font-weight: 400; color: #8b8ba0; font-size: 13px;">(GDV/Sales)</span></div>
                            <div class="rcg-slider-val" id="slider-display"
                                style="color: #fff; font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 700; margin: 24px 0 12px;">
                                £50 MILLION+</div>
                            <div class="rcg-slider-row" style="color: #8b8ba0; font-size: 12px; margin-bottom: 8px;">
                                <span>£10M</span><span>£500M+</span>
                            </div>
                            <input type="range" id="gdv-slider" min="0" max="100" value="10"
                                oninput="updateSlider(this.value)" style="background: #2d2d3f; height: 12px;" />
                            <p style="font-size:13px;color:#8b8ba0;margin-top:20px;line-height: 1.5;">*Used to calculate
                                your estimated potential impact using our internal assumptions.</p>
                        </div>
                    </div>

                    <div class="rcg-btn-row" style="margin-top: 48px;">
                        <button class="rcg-btn-cancel" onclick="go('rcg-context')">← Back</button>
                        <button class="rcg-btn-next" id="btn-cal" onclick="startScenarios()" disabled>Start Assessment
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"
                                viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg></button>
                    </div>
                </div>
            </div>

            <!-- ══ 4. QUESTION ══ -->
            <div class="rcg-screen" id="rcg-question">
                <div style="max-width: 800px; margin: 0 auto;">
                    <div class="rcg-progress-header"
                        style="color: #8b8ba0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                        <span id="q-label"></span>
                        <span id="q-pct" style="float: right;"></span>
                    </div>
                    <div class="rcg-progress-track" style="background: #2d2d3f; height: 4px; margin: 8px 0 40px;">
                        <div class="rcg-progress-fill" id="q-bar" style="background: #ef4444;"></div>
                    </div>

                    <div class="rcg-card" style="position:relative; padding: 60px;">
                        <div style="display: inline-block; background: #2d2d3f; color: #8b8ba0; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 4px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px;"
                            id="q-tag"></div>

                        <button class="rcg-btn-top-right" onclick="toggleModal('glossary-modal', true)"
                            title="Open Glossary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                        </button>
                        <p class="rcg-serif" id="q-text"
                            style="font-size: 28px; line-height: 1.4; color: #fff; margin: 0;">
                        </p>

                        <div class="rcg-options-list" id="q-options" style="margin-top: 48px;"></div>
                    </div>

                    <div class="rcg-q-nav" style="margin-top: 32px; display: flex; justify-content: space-between;">
                        <!-- Nav buttons inserted by JS -->
                    </div>
                </div>
            </div>

            <!-- ══ 5. LOADING ══ -->
            <div class="rcg-screen" id="rcg-loading">
                <div style="max-width:480px;margin:80px auto;text-align:center">
                    <div style="position: relative; width: 80px; height: 80px; margin: 0 auto 40px;">
                        <div class="rcg-spinner"
                            style="border: 4px solid #2d2d3f; border-top-color: #ef4444; width: 100%; height: 100%; border-radius: 50%; animation: rcgSpin 1s linear infinite;">
                        </div>
                        <div class="rcg-spinner-pulse"
                            style="position:absolute;inset:0;border-radius:50%;animation:rcgPulse 1.5s ease-in-out infinite;">
                        </div>
                    </div>
                    <h2 class="rcg-screen-title rcg-serif" style="font-size: 32px; margin-bottom: 12px;">Analysing
                        Response Patterns...</h2>
                    <p style="color:#8b8ba0;font-size:15px;margin-bottom:48px">Applying our Internal
                        Scoring Framework
                    </p>
                    <div style="text-align: left; max-width: 320px; margin: 0 auto;">
                        <ul class="rcg-load-checklist" id="load-list" style="list-style: none; padding: 0;">
                            <li class="rcg-load-item" id="li-1"
                                style="display: flex; align-items: center; gap: 12px; color: #8b8ba0; font-size: 15px; margin-bottom: 16px; opacity: 0; transform: translateX(-10px); transition: opacity 0.4s ease, transform 0.4s ease;">
                                <span class="rcg-li-icon"
                                    style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: rgba(239,68,68,0.15); border: 1.5px solid #ef4444; flex-shrink:0;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none"
                                        viewBox="0 0 24 24" stroke="#ef4444">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                            d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                Evaluating Pressure Thresholds...
                            </li>
                            <li class="rcg-load-item" id="li-2"
                                style="display: flex; align-items: center; gap: 12px; color: #8b8ba0; font-size: 15px; margin-bottom: 16px; opacity: 0; transform: translateX(-10px); transition: opacity 0.4s ease, transform 0.4s ease;">
                                <span class="rcg-li-icon"
                                    style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: rgba(239,68,68,0.15); border: 1.5px solid #ef4444; flex-shrink:0;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none"
                                        viewBox="0 0 24 24" stroke="#ef4444">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                            d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                Calculating Potential Impact...
                            </li>
                            <li class="rcg-load-item" id="li-3"
                                style="display: flex; align-items: center; gap: 12px; color: #8b8ba0; font-size: 15px; margin-bottom: 16px; opacity: 0; transform: translateX(-10px); transition: opacity 0.4s ease, transform 0.4s ease;">
                                <span class="rcg-li-icon"
                                    style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: rgba(239,68,68,0.15); border: 1.5px solid #ef4444; flex-shrink:0;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none"
                                        viewBox="0 0 24 24" stroke="#ef4444">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                            d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                Generating Your Report...
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- ══ 6. RESULTS ══ -->
            <div class="rcg-screen" id="rcg-results">
                <div class="rcg-res-banner"
                    style="background: #1a1b35; border: none; padding: 40px; border-radius: 0; margin: -32px -24px 32px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="flex:1">
                        <div class="rcg-res-banner-label"
                            style="color: #eaac08; display: flex; align-items: center; gap: 8px; font-weight: 700; margin-bottom: 12px; font-size: 11px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            POTENTIAL DEVELOPMENT AREA IDENTIFIED
                        </div>
                        <div class="rcg-res-banner-title rcg-serif" id="r-weak-name"
                            style="font-size: 38px; margin-bottom: 12px;">
                        </div>
                        <div class="rcg-res-banner-desc"
                            style="color: rgba(255,255,255,0.6); max-width: 500px; line-height: 1.6;">
                            Based on our
                            internal assessment, your responses suggest this area may benefit from
                            further development
                            and training.</div>
                    </div>
                    <div class="rcg-res-score-pill"
                        style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 16px 24px; text-align: right;">
                        <div
                            style="font-size: 10px; color: rgba(255,255,255,0.5); font-weight: 700; text-transform: uppercase;">
                            YOUR SCORE</div>
                        <div style="margin-top: 4px;"><span class="rcg-res-score-val rcg-serif" id="r-score"
                                style="font-size: 42px;">2.7</span><span
                                style="font-size: 18px; color: rgba(255,255,255,0.3);">/5.0</span></div>
                    </div>
                </div>

                <div style="background: transparent; margin: 0 -24px -32px; padding: 48px 24px;">
                    <div
                        style="max-width: 860px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                        <!-- Left: Competency Breakdown -->
                        <div class="rcg-res-section">
                            <div class="rcg-res-section-title"
                                style="color: #8b8ba0; font-size: 12px; font-weight: 700; margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between;">
                                <span style="display: flex; align-items: center; gap: 8px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    COMPETENCY BREAKDOWN
                                </span>
                                <a href="#" onclick="toggleModal('calc-modal', true); return false;"
                                    style="color:#8b8ba0; text-decoration: none; font-weight: 400; text-transform: none; display: flex; align-items: center; gap: 4px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    How is this calculated?
                                </a>
                            </div>
                            <div id="r-comp-bars"></div>
                        </div>

                        <!-- Right: Estimated Potential Impact -->
                        <div>
                            <div class="rcg-res-section-title"
                                style="color: #8b8ba0; font-size: 12px; font-weight: 700; margin-bottom: 32px; display: flex; align-items: center; gap: 8px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                ESTIMATED POTENTIAL IMPACT
                            </div>

                            <div
                                style="background: rgba(245, 158, 11, 0.05); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 4px; margin-bottom: 32px;">
                                <div style="display: flex; gap: 12px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                                        viewBox="0 0 24 24" stroke="#f59e0b" style="flex-shrink: 0;">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <div
                                            style="font-weight: 700; color: #f59e0b; font-size: 13px; margin-bottom: 4px;">
                                            Internal Assumptions Only</div>
                                        <div style="font-size: 12px; color: #8b8ba0; line-height: 1.5;">
                                            The figures
                                            below are theoretical projections based on our proprietary
                                            internal scoring system. These are <strong>not verified statistics</strong>
                                            and should not be used as financial advice.</div>
                                    </div>
                                </div>
                            </div>

                            <div style="display: flex; gap: 24px;">
                                <div class="rcg-impact-gap-box"
                                    style="background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); padding: 32px 24px; text-align: left; flex: 0 0 220px;">
                                    <div class="rcg-impact-gap-label"
                                        style="font-size: 11px; color: #8b8ba0; margin-bottom: 12px;">Estimated Annual
                                        Potential Value Gap</div>
                                    <div class="rcg-impact-gap-val" id="r-gap"
                                        style="font-size: 32px; color: #fff; margin-bottom: 8px;">
                                        $1,250,000</div>
                                    <div id="r-gap-note"
                                        style="font-size: 10px; color: #8b8ba0; font-weight: 700; text-transform: uppercase;">
                                        HIGH RISK LEVEL • 2.5% ASSUMED RATE</div>
                                </div>
                                <div class="rcg-impact-analysis" id="r-impact-text"
                                    style="color: #8b8ba0; font-size: 14px; line-height: 1.6;">
                                    <strong>Our Analysis:</strong> Based on your responses and our internal framework,
                                    we estimate that pressure-related decisions may be affecting deal outcomes. This
                                    projection uses our assumed leakage percentages applied to your stated volume.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="rcg-res-cta"
                        style="max-width: 600px; margin: 80px auto 0; text-align: center; border-top: 1px solid #2d2d3f; padding-top: 60px;">
                        <h3 class="rcg-serif" style="font-size: 28px; color: #fff; margin-bottom: 12px;">Develop Your
                            Team's Negotiation Composure</h3>
                        <p style="color: #8b8ba0; font-size: 15px; margin-bottom: 32px;">Explore how targeted training
                            could help your team maintain composure and strategic thinking during high-pressure
                            negotiations.</p>

                        <div style="display: flex; flex-direction: column; gap: 16px; align-items: center;">
                            <button class="rcg-btn-primary" onclick="book()"
                                style="width: 100%; max-width: 400px; display:flex; align-items:center; justify-content: center; gap:8px; background: #990000; border: none;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Request Training Proposal for Your Team
                            </button>
                            <button class="rcg-btn-secondary" onclick="methodology()"
                                style="width: 100%; max-width: 400px; display:flex; align-items:center; justify-content: center; gap:8px; border-color: #2d2d3f; color: #fff;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Learn About Our Methodology
                            </button>
                        </div>

                        <div style="margin-top: 32px; color: #8b8ba0; font-size: 12px;">We'll send a
                            customized proposal
                            within 24 hours. No sales calls, just strategy.</div>

                        <div
                            style="margin-top: 48px; border-top: 1px solid #2d2d3f; padding-top: 24px; display: flex; justify-content: center; gap: 24px; color: #8b8ba0; font-size: 13px;">
                            <button onclick="retake()"
                                style="cursor: pointer; display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 10px 20px; color: #8b8ba0; font-size: 13px; font-weight: 600; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)';this.style.color='#fff'" onmouseout="this.style.background='transparent';this.style.color='#8b8ba0'">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Retake Audit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Component Footer for Utility: Close Quiz -->
        <footer class="rcg-quiz-footer">
            <button class="rcg-btn-footer-close" onclick="closeQuizApp()">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24"
                    stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Exit Audit
            </button>
        </footer>
    </div>

    <!-- INTERNAL MODALS (Glossary & Calculation) -->
    <div class="rcg-modal-overlay" id="glossary-modal"
        onclick="if(event.target===this)toggleModal('glossary-modal', false)">
        <div class="rcg-modal-content">
            <div class="rcg-modal-header">
                <h3 class="rcg-serif" style="color:#fff">Terminology Glossary</h3><button class="rcg-modal-close"
                    onclick="toggleModal('glossary-modal', false)">&times;</button>
            </div>
            <div id="glossary-items-container"></div>
        </div>
    </div>
    <div class="rcg-modal-overlay" id="calc-modal" onclick="if(event.target===this)toggleModal('calc-modal', false)">
        <div class="rcg-modal-content" style="max-width:540px">
            <div class="rcg-modal-header">
                <h3 class="rcg-serif" style="color:#fff">How Our Internal Scoring System Works</h3><button
                    class="rcg-modal-close" onclick="toggleModal('calc-modal', false)">&times;</button>
            </div>
            <div id="calc-content-container"></div>
        </div>
    </div>
`;


    // Quiz App UI Controls
    window.openQuizApp = function () {
        const modal = document.getElementById('rcg-quiz-app-modal');
        if (modal && !modal.querySelector('.rcg-quiz-container')) {
            modal.innerHTML = UI_TEMPLATE;
            // Re-populate dynamic content after injection
            initDynamicContent();
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    window.closeQuizApp = function () { document.getElementById('rcg-quiz-app-modal').classList.remove('active'); document.body.style.overflow = ''; };

    // Internal Modals Controls
    window.toggleModal = function (id, on) { const m = document.getElementById(id); if (m) m.classList.toggle('rcg-active', on); };

    // Navigation
    window.go = function (id) {
        document.querySelectorAll('.rcg-screen').forEach(s => s.classList.remove('rcg-active'));
        document.getElementById(id).classList.add('rcg-active');
        document.querySelector('.rcg-quiz-container').scrollTop = 0;
    };

    // Logic
    window.submitIntro = function () {
        const n = document.getElementById('inp-name').value.trim();
        const e = document.getElementById('inp-email').value.trim();
        if (!n || !e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { document.getElementById('err-intro').style.display = 'block'; return; }
        user = { name: n, email: e }; go('rcg-context');
    };

    window.selectContext = function (el, val) {
        user.context = val;
        document.querySelectorAll('.rcg-ctx-card').forEach(c => c.classList.remove('rcg-selected'));
        el.classList.add('rcg-selected');
        document.getElementById('btn-ctx').disabled = false;
    };

    const GDV_VALS = ['£10M', '£20M', '£30M', '£40M', '£50M', '£75M', '£100M', '£150M', '£200M', '£300M', '£500M+'];
    window.updateSlider = function (v) {
        const idx = Math.round(v / 10); const lbl = GDV_VALS[idx];
        document.getElementById('slider-display').textContent = lbl + (idx == 10 ? '' : '');
        user.gdv = lbl;
    };
    window.checkCal = function () { user.role = document.getElementById('cal-role').value; document.getElementById('btn-cal').disabled = !user.role; };

    window.startScenarios = function () { answers = []; curQ = 0; go('rcg-question'); renderQ(); };

    function renderQ() {
        const q = QS[curQ]; const pct = Math.round(((curQ + 1) / QS.length) * 100);
        document.getElementById('q-label').textContent = `SCENARIO ${curQ + 1} OF ${QS.length}`;
        document.getElementById('q-pct').textContent = `${pct}% COMPLETE`;
        document.getElementById('q-bar').style.width = `${((curQ + 1) / QS.length) * 100}%`;
        document.getElementById('q-tag').textContent = q.tag;
        document.getElementById('q-text').textContent = q.q;

        const container = document.getElementById('q-options');
        container.innerHTML = '';
        q.opts.forEach((opt, i) => {
            const btn = document.createElement('div');
            btn.className = 'rcg-option-card' + (answers[curQ]?.i === i ? ' rcg-selected' : '');
            btn.innerHTML = `
                    <div class="rcg-option-radio">
                        ${answers[curQ]?.i === i ? '<div class="rcg-option-bullet"></div>' : ''}
                    </div>
                    <span class="rcg-option-text">${opt}</span>
                `;
            btn.onclick = () => { answers[curQ] = { i, score: q.scores[i] }; renderQ(); setTimeout(() => nextQ(), 350); };
            container.appendChild(btn);
        });

        const nav = document.querySelector('.rcg-q-nav');
        nav.innerHTML = `
                <button class="rcg-btn-back" id="q-back" onclick="prevQ()" ${curQ === 0 ? 'disabled' : ''} style="border-color: #2d2d3f; color: #fff; background: transparent;">← Back</button>
                <button class="rcg-btn-next" id="q-next" onclick="nextQ()" ${answers[curQ] === undefined ? 'disabled' : ''} style="background: #990000; border: none; color: #fff;">
                    ${curQ === QS.length - 1 ? 'Finalise Audit' : 'Next'} &rarr;
                </button>
            `;
    }

    window.nextQ = function () { if (curQ < QS.length - 1) { curQ++; renderQ(); } else finishQuiz(); };
    window.prevQ = function () { if (curQ > 0) { curQ--; renderQ(); } else { go('rcg-calibration'); } };

    async function finishQuiz() {
        go('rcg-loading');
        function showLi(id, delay) {
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) { el.style.opacity = '1'; el.style.transform = 'translateX(0)'; }
            }, delay);
        }
        showLi('li-1', 600);
        showLi('li-2', 1300);
        showLi('li-3', 2000);
        const total = answers.reduce((s, a) => s + (a?.score || 0), 0);

        // Wait for both the minimum animation time (2900ms) and the webhook API calls to finish
        // This ensures the email is sent/triggered while the loading screen is active.
        await Promise.all([
            new Promise(resolve => setTimeout(resolve, 2900)),
            sendWebhook(total)
        ]);

        showResults(total);
    }

    function showResults(total) {
        const overall = Math.round((total / 21) * 5 * 10) / 10;
        document.getElementById('r-score').textContent = overall.toFixed(1);

        const catScores = {};
        const CATS = ['Trust Deficit', 'Influence Without Authority', 'Pressure-Induced Errors'];
        CATS.forEach(c => {
            const qIdx = QS.map((q, i) => q.tag === c ? i : -1).filter(i => i >= 0);
            const sum = qIdx.reduce((s, i) => s + (answers[i]?.score || 0), 0);
            catScores[c] = Math.round((sum / (qIdx.length * 3)) * 5 * 10) / 10;
        });
        const weak = CATS.reduce((a, b) => catScores[a] <= catScores[b] ? a : b);
        document.getElementById('r-weak-name').textContent = weak;

        const barsContainer = document.getElementById('r-comp-bars');
        barsContainer.innerHTML = '';
        CATS.forEach(cat => {
            const s = catScores[cat]; const pct = (s / 5) * 100;
            let color = cat === weak ? '#ef4444' : s < 3.5 ? '#f97316' : '#3b82f6';
            barsContainer.innerHTML += `
                    <div style="margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 13px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.5px;">
                            <span>${cat}</span>
                            <span>${s.toFixed(1)}/5</span>
                        </div>
                        <div style="height: 8px; background: #2d2d3f; border-radius: 99px; overflow: hidden;">
                            <div class="rcg-comp-fill" style="width:0%; height: 100%; border-radius: 99px; background: ${color}; transition: width 1.5s cubic-bezier(0.1, 0, 0, 1);" data-pct="${pct}"></div>
                        </div>
                    </div>
                `;
        });

        const gdvVal = parseFloat((user.gdv || '50').replace(/[^\d.]/g, '')) || 50;
        let rate = overall < 3 ? 0.05 : 0.03;
        const gap = gdvVal * 1000000 * rate;
        document.getElementById('r-gap').textContent = '£' + (gap >= 1000000 ? (gap / 1000000).toFixed(1) + 'M' : (gap / 1000).toFixed(0) + 'K');
        document.getElementById('r-gap-note').textContent = `BASED ON ${(rate * 100).toFixed(1)}% ASSUMED LEAKAGE`;
        document.getElementById('r-impact-text').innerHTML = `<strong>Our Analysis:</strong> Proprietary analysis suggests that ${weak.toLowerCase()} factors represent a key area of potential value erosion within your negotiation landscape.`;

        go('rcg-results');
        setTimeout(() => { document.querySelectorAll('.rcg-comp-fill').forEach(f => f.style.width = f.dataset.pct + '%'); }, 100);
    }

    async function sendWebhook(total) {
        const payload = { ...user, score: total, timestamp: new Date().toISOString() };
        const promises = [];

        // ── Send to Make/Zapier webhook (optional) ──
        if (!CFG.WEBHOOK.includes('YOUR_WEBHOOK')) {
            promises.push(
                fetch(CFG.WEBHOOK, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
                    .catch(console.error)
            );
        }

        // ── Send to Loops.so ──
        if (!CFG.LOOPS_API_KEY.includes('YOUR_LOOPS')) {
            const overall = Math.round((total / 21) * 5 * 10) / 10;

            // First we update/create the contact
            const updateContact = fetch('https://app.loops.so/api/v1/contacts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + CFG.LOOPS_API_KEY
                },
                body: JSON.stringify({
                    email: user.email,
                    firstName: user.name,
                    source: 'RCG Negotiation Quiz',
                    subscribed: true,
                    // Custom properties (must be created in Loops.so dashboard first)
                    quizScore: overall,
                    quizContext: user.context || '',
                    quizRole: user.role || '',
                    quizGDV: user.gdv || ''
                })
            }).then(r => r.json()).then(d => console.log('Loops.so Contact:', d)).catch(console.error);

            // Then we send a custom event to trigger an email workflow/journey in Loops naturally
            const sendEvent = fetch('https://app.loops.so/api/v1/events/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + CFG.LOOPS_API_KEY
                },
                body: JSON.stringify({
                    email: user.email,
                    eventName: 'quiz_completed', // Trigger an email inside Loops using this event name
                    quizScore: overall,
                    firstName: user.name,
                    quizContext: user.context || '',
                    quizRole: user.role || '',
                    quizGDV: user.gdv || ''
                })
            }).then(r => r.json()).then(d => console.log('Loops.so Event:', d)).catch(console.error);

            promises.push(Promise.all([updateContact, sendEvent]));
        } else {
            console.log('Loops.so payload (dev):', payload);
        }

        await Promise.all(promises);
    }

    window.book = function () { window.location.href = '/contact'; };
    window.methodology = function () { window.location.href = '/methodology-2'; };
    window.retake = function () { location.reload(); };

    // Listen for Webflow Triggers
    document.addEventListener('click', function (e) {
        const t = e.target.closest('[data-quiz-trigger="open"]');
        if (t) { e.preventDefault(); openQuizApp(); }
    });

    function initDynamicContent() {
        // Populate dynamic content
        const gc = document.getElementById('glossary-items-container');
        if (gc) {
            gc.innerHTML = '';
            GLOSSARY.forEach(g => gc.innerHTML += `<div class="m-section"><div class="m-title">${g.t}</div><div class="m-text">${g.d}</div></div>`);
        }

        const cc = document.getElementById('calc-content-container');
        if (cc) {
            cc.innerHTML = `
                    <div class="calc-disclaimer">
                        <p><strong>Important Disclaimer:</strong> All scores, projections, and risk assessments in this audit are based on our proprietary internal scoring methodology developed by Red Centre Global. These are assumptions designed to provide directional insights, not verified financial advice or guarantees.</p>
                    </div>

                    <div class="calc-section-title">Assessment Methodology</div>
                    <p class="calc-section-body">Each scenario is designed by our team with experience in high-stakes negotiations. Your responses are scored on a 1–5 scale based on our internal evaluation framework for emotional regulation under pressure.</p>

                    <div class="tier-box t1"><div class="tier-num">1</div><div><div class="tier-h">Critical Risk (Our Assessment)</div><div class="tier-p">Responses that may indicate reactive, emotion-driven patterns according to our framework.</div></div></div>
                    <div class="tier-box t2"><div class="tier-num">2</div><div><div class="tier-h">High Risk (Our Assessment)</div><div class="tier-p">Partially controlled responses that may still be vulnerable to pressure tactics in our view.</div></div></div>
                    <div class="tier-box t3"><div class="tier-num">3</div><div><div class="tier-h">Moderate (Our Assessment)</div><div class="tier-p">Adequate composure but potentially lacking tactical sophistication based on our criteria.</div></div></div>
                    <div class="tier-box t4"><div class="tier-num">4</div><div><div class="tier-h">Competent (Our Assessment)</div><div class="tier-p">Strong emotional regulation with tactical awareness according to our framework.</div></div></div>
                    <div class="tier-box t5"><div class="tier-num">5</div><div><div class="tier-h">Mastery (Our Assessment)</div><div class="tier-p">Elite-level composure based on our internal criteria for optimal negotiation responses.</div></div></div>

                    <div class="calc-section-title" style="margin-top:24px;">Estimated Financial Impact Calculation</div>
                    <p class="calc-section-body"><strong>This is an assumption-based projection only.</strong> Your estimated margin impact is calculated using our proprietary leakage formula: we apply an assumed percentage (ranging from 0.2% to 4.0% based on your score profile) to your stated annual transaction volume.</p>
                    <p class="calc-section-body"><strong>Important:</strong> This figure represents our theoretical assessment of potential value erosion and should not be treated as financial fact. Actual results will vary significantly based on market conditions, team expertise, and countless other factors not captured in this brief assessment.</p>

                    <div class="calc-use-box">
                        <span class="calc-use-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Use This Data Responsibly
                        </span>
                        <p class="calc-section-body" style="margin:8px 0 0;">This audit is designed as a conversation-starter and self-reflection tool. All results are based on Red Centre Global's internal assumptions and should be independently verified before making any business decisions.</p>
                    </div>
                `;
        }
        updateSlider(10);
    }

    // Listen for Webflow Triggers

    // Init removed from global scope as it now happens on modal open
})();

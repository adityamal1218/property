import React, { useState, useMemo } from "react";

// ============================================================
// Innsight — Project Planning v2
// One-tab ecosystem: Learn, Decide, Act.
// Drop-in replacement for the Project Planning tab only.
// Other tabs (Start Here, Project Viability, Subsidy & Policy,
// Brand & Insights, Book Expert Review) remain untouched.
// ============================================================

const C = {
  ivory: "#F5F1E8",
  ivoryDeep: "#EFE9D9",
  green: "#1F3A2E",
  greenSoft: "#2E5544",
  greenInk: "#143025",
  gold: "#B08D3D",
  goldSoft: "#C9A862",
  beige: "#EDE6D3",
  beigeDeep: "#E8DFC7",
  charcoal: "#2A2A2A",
  charcoalSoft: "#4A4A4A",
  line: "#D9D2BE",
  lineSoft: "#E5DFCD",
  warnBg: "#F6EDDC",
  warnBorder: "#C9A862",
  warnText: "#7A5A1F",
  riskBg: "#F2E1DC",
  riskBorder: "#B5664D",
  riskText: "#7A2F1A",
  goodBg: "#E3EBE5",
  goodBorder: "#7FA088",
  goodText: "#2E5544",
  white: "#FFFFFF",
};

// ============================================================
// DATA LAYER
// ============================================================

// ---- A. Project journey: 9 macro stages, with sub-content ----
const JOURNEY = [
  {
    id: "idea",
    code: "01",
    name: "Idea",
    summary: "What to build, where, for whom — before any commitment.",
    duration: "2 – 8 weeks",
    decisions: [
      "Which hospitality format fits the land, capital, and demand",
      "Who is the target guest, and at what price point",
      "Whether the project is viable in principle (gut-check before feasibility)",
      "Whether the owner has the temperament for hospitality operations",
    ],
    experts: ["Hotel Project Consultant", "Market Research", "Owner-side Advisor"],
    documents: ["Concept note (3–5 pages)", "Capital availability statement", "Family alignment record"],
    mistakes: [
      "Starting with an architect before the concept is locked",
      "Choosing a category by imitation (because a friend built a resort)",
      "Assuming demand without testing it",
    ],
    output: "Written concept brief with category, capacity, and tentative budget",
    cta: "Discuss the Concept",
  },
  {
    id: "land",
    code: "02",
    name: "Land",
    summary: "Verify the land before any other commitment.",
    duration: "3 – 8 weeks",
    decisions: [
      "Is the land legally usable for hospitality (zoning + title)",
      "Does the location have access, utilities, demand generators",
      "Will neighborhood, future development, and infrastructure support the project",
      "Should this land be bought / leased / sold and replaced",
    ],
    experts: ["Land Due Diligence Expert", "Legal Advisor", "Surveyor", "Architect (preliminary)"],
    documents: [
      "30-year title search",
      "Khasra/Khatauni record",
      "Master plan extract",
      "Encumbrance certificate",
      "Site survey",
      "Soil testing report",
    ],
    mistakes: [
      "Verbal assurance on zoning",
      "Skipping independent title search",
      "Ignoring borewell / CGWA permission requirement",
      "Buying land before confirming road frontage compliance",
    ],
    output: "Signed site-validation report",
    cta: "Review the Land",
  },
  {
    id: "feasibility",
    code: "03",
    name: "Feasibility",
    summary: "Test the numbers before the design.",
    duration: "6 – 12 weeks",
    decisions: [
      "What is the realistic demand and competition picture",
      "What revenue, expenses, breakeven and ROI does the project produce",
      "What is the right room count, F&B mix, banquet capacity",
      "Should the project proceed, pivot, or stop",
    ],
    experts: ["Feasibility Consultant", "Market Research", "CA / Financial Modeller", "Owner-side Advisor"],
    documents: ["Demand study", "Competition map", "Financial model with sensitivities", "Bankable DPR"],
    mistakes: [
      "Modelling to justify the project instead of test it",
      "Using broker-supplied occupancy and ARR figures",
      "Skipping sensitivity analysis (what if occupancy is 8% lower)",
    ],
    output: "Feasibility report with proceed/pivot/stop recommendation",
    cta: "Get Feasibility Reviewed",
  },
  {
    id: "design",
    code: "04",
    name: "Design",
    summary: "Translate the concept into drawings — without losing the math.",
    duration: "16 – 28 weeks",
    decisions: [
      "Which architect, structural, MEP, kitchen, landscape consultants to appoint",
      "What floor plan, façade, room mix to lock",
      "How to balance guest experience with operational efficiency",
      "When to freeze drawings (post-freeze changes cost 5–10× more)",
    ],
    experts: [
      "Hospitality Architect",
      "Interior Designer",
      "Structural Consultant",
      "MEP Consultant",
      "Kitchen Consultant",
      "Landscape Consultant",
      "Lighting Consultant",
      "Acoustic Consultant",
    ],
    documents: [
      "Architectural drawings (concept → schematic → GFC)",
      "Specification book",
      "Material and finish schedule",
      "MEP services drawings",
      "Kitchen layout with equipment list",
    ],
    mistakes: [
      "Hiring residential or commercial architects (not hospitality-trained)",
      "Skipping the mock-up room",
      "Letting the architect design the kitchen",
      "No GFC sign-off before construction starts",
    ],
    output: "Approved Good-for-Construction (GFC) drawings",
    cta: "Request Design Review",
  },
  {
    id: "approvals",
    code: "05",
    name: "Approvals",
    summary: "Sequence the licenses so the slowest one doesn't hold you hostage.",
    duration: "9 – 24 months (overlaps with design + construction)",
    decisions: [
      "Which approvals apply to this exact project and state",
      "Which are the rate-limiting steps (excise, environment clearance)",
      "Whether the entity, land, and project type align for each",
      "How to track and document every submission",
    ],
    experts: ["Licensing Consultant", "Excise Consultant", "FSSAI Consultant", "Fire Consultant", "Environment Consultant", "Legal Advisor"],
    documents: [
      "Sanctioned building plan",
      "Fire NOC (provisional + final)",
      "Pollution consent (Establish + Operate)",
      "FSSAI license",
      "Excise license (if applicable)",
      "Tourism registration",
      "Electrical load sanction",
      "Liquor license (if applicable)",
    ],
    mistakes: [
      "Starting construction on verbal assurance",
      "Filing for FSSAI before kitchen exhaust permission",
      "Filing for excise after construction (huge delay risk)",
    ],
    output: "Approvals tracker with each license, status, and date",
    cta: "Map My Approvals",
  },
  {
    id: "construction",
    code: "06",
    name: "Construction",
    summary: "Execute, with paperwork — not WhatsApp.",
    duration: "12 – 24 months",
    decisions: [
      "Which civil, MEP, interior, waterproofing, firefighting contractors to appoint",
      "What contracts to sign (and what clauses to insist on)",
      "How to monitor quality, cost, timeline weekly",
      "When to approve variations and at what cost",
    ],
    experts: [
      "Project Management Consultant (PMC)",
      "Civil Contractor",
      "MEP Contractor",
      "Interior Contractor",
      "Waterproofing Contractor",
      "Firefighting Contractor",
      "HVAC Contractor",
      "Owner-side Advisor",
    ],
    documents: [
      "Signed contracts with all annexures",
      "Weekly progress reports",
      "Variation order register",
      "Quality inspection log",
      "Payment certification record",
      "Safety checklist",
      "Snag list",
    ],
    mistakes: [
      "Choosing contractor on lowest quote",
      "Vague BOQ with 'as per design' lines",
      "No defect liability period or retention",
      "No written change-management process",
    ],
    output: "Completion certificate + closed snag list",
    cta: "Get Construction Monitored",
  },
  {
    id: "procurement",
    code: "07",
    name: "Procurement",
    summary: "FF&E and OS&E — start earlier than feels comfortable.",
    duration: "Starts at design freeze; completes 30 days pre-opening",
    decisions: [
      "Which furniture, kitchen, bathroom, technology, OS&E vendors to use",
      "What samples and mock-ups to approve before manufacturing",
      "What payment, delivery, warranty terms to insist on",
      "When to lock specs (and resist mid-procurement substitutions)",
    ],
    experts: [
      "Procurement Consultant",
      "Kitchen Consultant",
      "Furniture Vendor",
      "Bed and Mattress Vendor",
      "Linen Vendor",
      "Bathroom Fixtures Vendor",
      "Lighting Vendor",
      "Technology Vendor (PMS, POS, CM)",
    ],
    documents: [
      "Locked BOQ with brand-level specs",
      "Approved samples (signed and stored)",
      "Mock-up room approval",
      "Purchase orders with retention",
      "Delivery tracker",
      "Warranty register",
    ],
    mistakes: [
      "Starting procurement too late (cheap-import logistics fail)",
      "Approving photos instead of physical samples",
      "Accepting 'equivalent' brand substitutions on delivery",
      "Under-ordering OS&E pars (single set per room)",
    ],
    output: "Installed, tested FF&E + OS&E inventory matched to pars",
    cta: "Plan My Procurement",
  },
  {
    id: "preopening",
    code: "08",
    name: "Pre-opening",
    summary: "Hire, train, test — before the first paying guest.",
    duration: "90 – 180 days",
    decisions: [
      "What organisation structure, staffing, salary bands to set",
      "Which operator / brand to engage (independent vs HMA vs franchise)",
      "What SOPs, training, trial-run cadence to run",
      "How to set up PMS/POS/channel manager, OTAs, website, rate plan",
    ],
    experts: [
      "Pre-opening Consultant",
      "Hotel Operator / Brand",
      "Revenue Management Consultant",
      "Branding Agency",
      "Photography / Videography",
      "Digital Marketing Agency",
      "SOP / Training Consultant",
      "OTA Onboarding Support",
    ],
    documents: [
      "Org chart with JDs",
      "Staffing plan and salary bands",
      "SOP set per department",
      "Training calendar with sign-offs",
      "PMS/POS/CM live with logins",
      "Rate plan mapped across channels",
      "Soft-opening plan",
    ],
    mistakes: [
      "Hiring department heads too late",
      "Treating soft opening as full launch",
      "No trial meal or trial stay before paying guests",
      "Photography rushed; rates published without strategy",
    ],
    output: "Operational property with trained staff, live systems, and guest pipeline",
    cta: "Plan Pre-opening",
  },
  {
    id: "opening",
    code: "09",
    name: "Opening & first 100 days",
    summary: "Open well. Review honestly. Correct fast.",
    duration: "100 days post-opening",
    decisions: [
      "How to phase soft launch into full operations",
      "What guest feedback to act on (and what to ignore)",
      "What operational audit cadence to maintain",
      "When and how to course-correct revenue, expenses, staffing",
    ],
    experts: [
      "Revenue Management Consultant",
      "Operations Auditor",
      "Sales Consultant",
      "Owner-side Advisor",
    ],
    documents: [
      "Daily occupancy and ARR report",
      "Guest review tracker (Google + OTA)",
      "Weekly P&L",
      "Staff retention dashboard",
      "100-day review document",
    ],
    mistakes: [
      "Skipping the 100-day review because numbers look fine",
      "Reacting to every negative review instead of patterns",
      "Cutting marketing in month 2 to save cash",
      "Promoting the GM out of operations too early",
    ],
    output: "100-day review with corrective plan and stabilised KPIs",
    cta: "Set Up 100-Day Review",
  },
];

// ---- B. Expert categories (28) grouped — for Connect With Experts ----
const EXPERT_CATEGORIES = [
  {
    group: "Strategy & Owner-side Advisory",
    items: [
      {
        id: "hotel-consultant",
        name: "Hotel Project Consultant",
        whenNeeded: "Idea + feasibility + design stages",
        helps: "Full-spectrum project guidance — concept, feasibility, brand, operator, design, vendor, pre-opening, opening.",
        questions: [
          "How many hospitality projects (not commercial) have you completed end-to-end?",
          "Show three projects of similar scale — site visits possible?",
          "How do you handle conflicts of interest with vendors / operators?",
          "What is included in your fee, and what is billed separately?",
        ],
        documents: ["Project portfolio", "References", "Engagement letter draft", "Conflict-of-interest disclosure"],
        engagementStage: "From idea stage through opening (or selected modules)",
        commonMistakes: [
          "Hiring on referral without verifying hospitality depth",
          "Confusing PMC with project consultant — different roles",
          "No written scope or deliverables",
        ],
        feeModel: "Retainer + milestone, or fixed-fee modules. Mid-range projects: ₹8L–₹40L total engagement.",
        cta: "Request Consultant Introduction",
      },
      {
        id: "feasibility",
        name: "Feasibility Consultant",
        whenNeeded: "Feasibility stage",
        helps: "Independent demand study, market analysis, financial model, viability call.",
        questions: [
          "Sample three feasibility reports from past 24 months",
          "Will you do site visit + primary research, or only desk work?",
          "What is your stand on saying 'do not build' if data supports it?",
        ],
        documents: ["Sample reports", "Methodology document", "References from owners who declined to build"],
        engagementStage: "Pre-design, pre-DPR",
        commonMistakes: [
          "Using bank-DPR consultants as feasibility consultants",
          "Skipping primary research (talking to nearby property managers)",
          "Optimistic ARR/occupancy assumptions to justify the project",
        ],
        feeModel: "Fixed fee per project. Typical ₹4L–₹18L depending on scope and site visit.",
        cta: "Request Feasibility Introduction",
      },
      {
        id: "owner-rep",
        name: "Owner Representative / Project Management Consultant",
        whenNeeded: "Design + construction + pre-opening",
        helps: "Sits on the owner's side through the project lifecycle. Decision support, vendor coordination, contract review.",
        questions: [
          "Are you independent of contractors and operators (no commissions)?",
          "How many projects do you handle concurrently?",
          "What is your reporting cadence?",
        ],
        documents: ["Past project list", "Independence declaration", "Reporting samples"],
        engagementStage: "From design start through 100-day post-opening",
        commonMistakes: [
          "Hiring a contractor's PMC (conflict of interest)",
          "Vague scope leading to passive observation",
          "No decision authority defined",
        ],
        feeModel: "Monthly retainer. Typical ₹2L–₹6L/month depending on project scale.",
        cta: "Request Owner Representative Introduction",
      },
    ],
  },
  {
    group: "Land, Legal & Compliance",
    items: [
      {
        id: "land-due-diligence",
        name: "Land Due Diligence Expert",
        whenNeeded: "Before land purchase",
        helps: "Title search, encumbrance, mutation, dispute history, zoning verification, ESZ overlay check.",
        questions: [
          "How many years' title search (30-year minimum for hospitality)?",
          "Have you handled ESZ / tribal-land / forest-adjacent projects?",
          "Will you issue a signed title opinion?",
        ],
        documents: ["Sample title opinions", "Bar council registration", "Past hospitality work"],
        engagementStage: "Before land payment",
        commonMistakes: [
          "Relying on the seller's title search",
          "Using a general lawyer for hospitality-specific land issues",
        ],
        feeModel: "Fixed fee per parcel, ₹50K–₹3L. Higher for complex/ESZ/forest projects.",
        cta: "Request Land Diligence Introduction",
      },
      {
        id: "legal-advisor",
        name: "Legal Advisor (Hospitality)",
        whenNeeded: "Throughout, especially contracts and disputes",
        helps: "Contract drafting and review (architect, contractor, operator, HMA), regulatory advice, dispute resolution.",
        questions: [
          "Have you drafted or reviewed Hotel Management Agreements (HMAs)?",
          "What hospitality litigation have you handled?",
          "Bar council number and practice details?",
        ],
        documents: ["Past contracts (redacted)", "References from hospitality owners"],
        engagementStage: "Land → opening → ongoing retainer",
        commonMistakes: [
          "Using a generalist for HMA/operator contracts",
          "Skipping legal review on contractor agreements",
        ],
        feeModel: "Hourly (₹3K–₹15K/hr) or annual retainer (₹6L–₹25L). Per-contract fee also common.",
        cta: "Request Legal Advisor Introduction",
      },
      {
        id: "licensing",
        name: "Licensing / Approvals Consultant",
        whenNeeded: "From design stage through pre-opening",
        helps: "Building permission, fire NOC, pollution, tourism registration, local approvals.",
        questions: [
          "Which specific approvals have you closed in this state in past 24 months?",
          "How do you handle officer-level engagement (without bribery)?",
          "What is your timeline commitment?",
        ],
        documents: ["State-specific approval track record", "Sample approval letters from past clients"],
        engagementStage: "Design through pre-opening",
        commonMistakes: [
          "Hiring on price without verifying state experience",
          "No timeline commitment in writing",
          "Mixing licensing consultant with subsidy consultant",
        ],
        feeModel: "Fixed fee per approval, or bundled. Bundle typical ₹3L–₹15L per project.",
        cta: "Request Licensing Consultant Introduction",
      },
      {
        id: "excise",
        name: "Excise / Liquor License Consultant",
        whenNeeded: "9–18 months before opening (or earlier in slow states)",
        helps: "Excise application, state-specific liquor licenses, bar permissions, renewal management.",
        questions: [
          "Which state are you specialised in?",
          "Recent successful liquor licenses (past 24 months)?",
          "What is the realistic timeline and approval rate?",
        ],
        documents: ["State excise specialisation proof", "Recent license approvals (redacted)"],
        engagementStage: "Pre-construction or early construction",
        commonMistakes: [
          "Starting excise late (this is the rate-limiting license)",
          "Promising guaranteed approval — never trust this",
        ],
        feeModel: "Fixed fee + success-linked. Fixed typically ₹2L–₹6L; success fee state-dependent.",
        cta: "Request Excise Consultant Introduction",
      },
      {
        id: "fssai",
        name: "FSSAI Consultant",
        whenNeeded: "Before kitchen commissioning",
        helps: "FSSAI registration/license, kitchen layout compliance, food safety SOPs, renewal.",
        questions: [
          "Central or State license — which applies to this project?",
          "Have you handled multi-outlet hotels (4+ F&B outlets)?",
        ],
        documents: ["FSSAI registration credentials", "Past hospitality clients"],
        engagementStage: "Construction → pre-opening",
        commonMistakes: ["Treating FSSAI as a formality (audits do happen)"],
        feeModel: "Fixed fee per license, ₹40K–₹2L. Often bundled with CA work.",
        cta: "Request FSSAI Consultant Introduction",
      },
      {
        id: "fire",
        name: "Fire Consultant",
        whenNeeded: "Design stage onwards",
        helps: "Fire NOC drawings, system design, NBC compliance, fire suppression for kitchens, periodic certification.",
        questions: [
          "Are you empanelled with the state fire department?",
          "How many hotel fire NOCs have you closed in the past 24 months?",
        ],
        documents: ["Empanelment certificate", "Past hotel project list"],
        engagementStage: "Design → construction → opening",
        commonMistakes: [
          "Treating fire as paperwork — it's structural and operational",
          "Decorative fire stairs that block actual exit width",
        ],
        feeModel: "Fixed fee per project. ₹1.5L–₹6L based on scale.",
        cta: "Request Fire Consultant Introduction",
      },
      {
        id: "ca-finance",
        name: "CA / Finance Consultant (Hospitality)",
        whenNeeded: "From feasibility through operations",
        helps: "Financial modelling, tax structuring, debt syndication, GST registration, compliance, ongoing audit.",
        questions: [
          "Hospitality clients in current portfolio?",
          "Have you arranged hospitality term loans in past 24 months?",
          "Familiarity with state tourism subsidies?",
        ],
        documents: ["Hospitality client list", "ICAI registration", "Sample financial models"],
        engagementStage: "Feasibility → opening → ongoing",
        commonMistakes: ["Using a generalist CA who doesn't know hospitality structures"],
        feeModel: "Annual retainer ₹6L–₹30L + project-specific fees.",
        cta: "Request CA Introduction",
      },
    ],
  },
  {
    group: "Design & Planning",
    items: [
      {
        id: "architect",
        name: "Hospitality Architect",
        whenNeeded: "Design stage",
        helps: "Master plan, building design, façade, room layouts, public areas, BOH planning.",
        questions: [
          "Portfolio of hospitality projects (not commercial / residential)?",
          "Can we visit two completed projects of similar scale?",
          "Who will be the day-to-day architect on this project?",
        ],
        documents: ["Council of Architecture (CoA) registration", "Portfolio", "Past references"],
        engagementStage: "Idea → design → construction supervision",
        commonMistakes: [
          "Hiring an architect with no hospitality work",
          "Letting the architect design the kitchen and BOH (use specialists)",
          "Approving design without mock-up room",
        ],
        feeModel: "Percentage of construction cost (4–8%) or fixed fee. Premium architects 8–12%.",
        cta: "Request Architect Introduction",
      },
      {
        id: "interior",
        name: "Interior Designer",
        whenNeeded: "After GFC drawings approved",
        helps: "Room interiors, public area interiors, F&B interiors, FF&E specifications.",
        questions: [
          "Hospitality interior portfolio with visits possible?",
          "Will you make a mock-up room before bulk procurement?",
          "Are you fee-only or do you take vendor commissions?",
        ],
        documents: ["Portfolio", "Mock-up samples"],
        engagementStage: "Design stage",
        commonMistakes: [
          "Hiring residential interior designers for hospitality",
          "Approving photos instead of mock-ups",
        ],
        feeModel: "Percentage of interior cost (8–15%) or fixed fee. Vendor-commission models — avoid.",
        cta: "Request Interior Designer Introduction",
      },
      {
        id: "mep",
        name: "MEP Consultant",
        whenNeeded: "Design stage",
        helps: "Electrical, plumbing, HVAC, firefighting design — sized for hospitality loads.",
        questions: [
          "What hotel MEP projects have you delivered?",
          "How do you coordinate with civil and interior teams?",
        ],
        documents: ["Hospitality MEP portfolio", "Coordination protocols"],
        engagementStage: "Design → construction supervision",
        commonMistakes: ["Treating MEP as a sub-discipline of civil"],
        feeModel: "Percentage of MEP cost or fixed fee.",
        cta: "Request MEP Consultant Introduction",
      },
      {
        id: "kitchen-consultant",
        name: "Kitchen Consultant",
        whenNeeded: "Design stage",
        helps: "Commercial kitchen design, equipment list, exhaust/MUA, FSSAI compliance, banquet kitchens.",
        questions: [
          "How many F&B outlets / banquet kitchens designed?",
          "Are you OEM-neutral (no equipment commissions)?",
        ],
        documents: ["Kitchen project list", "OEM neutrality declaration"],
        engagementStage: "Design stage",
        commonMistakes: [
          "Letting architect design the kitchen",
          "Choosing a kitchen consultant tied to one OEM",
        ],
        feeModel: "Fixed fee per kitchen. Typical ₹1.5L–₹8L per outlet.",
        cta: "Request Kitchen Consultant Introduction",
      },
      {
        id: "landscape",
        name: "Landscape Consultant",
        whenNeeded: "Design stage",
        helps: "Hard and soft landscape, water bodies, irrigation, plant selection, lighting.",
        questions: [
          "Hospitality landscape portfolio?",
          "Local plant expertise and irrigation maintenance plan?",
        ],
        documents: ["Portfolio", "Plant schedule samples"],
        engagementStage: "Design + post-opening maintenance",
        commonMistakes: ["Skipping landscape maintenance contract — gardens die in dry season"],
        feeModel: "Fixed fee or percentage of landscape cost.",
        cta: "Request Landscape Consultant Introduction",
      },
    ],
  },
  {
    group: "Construction & Site",
    items: [
      {
        id: "civil-contractor",
        name: "Civil Contractor",
        whenNeeded: "Construction stage",
        helps: "Foundation, structure, masonry, finishing.",
        questions: [
          "Hospitality projects completed (not just commercial / residential)?",
          "Site engineer's CV before we sign?",
          "Defect liability period offered?",
        ],
        documents: ["Past hospitality projects", "Balance sheets", "Insurance"],
        engagementStage: "Construction stage",
        commonMistakes: ["Lowest-quote selection", "Vague BOQ", "No defect liability"],
        feeModel: "BOQ-based or lumpsum. Plus retention (5–10%) for defect liability.",
        cta: "Request Civil Contractor Introduction",
      },
      {
        id: "mep-contractor",
        name: "MEP Contractor",
        whenNeeded: "Construction stage",
        helps: "Electrical, plumbing, HVAC, firefighting installation.",
        questions: [
          "Hospitality MEP track record?",
          "Brand authorisations (OEM letters)?",
          "Commissioning protocol?",
        ],
        documents: ["Past projects", "OEM authorisations", "Commissioning samples"],
        engagementStage: "Construction stage",
        commonMistakes: ["No equipment-brand commitment; substitutions at site"],
        feeModel: "BOQ-based.",
        cta: "Request MEP Contractor Introduction",
      },
      {
        id: "interior-contractor",
        name: "Interior Contractor",
        whenNeeded: "Post-civil stage",
        helps: "Walls, ceilings, joinery, finishes, FF&E install.",
        questions: [
          "Hospitality finish track record?",
          "Mock-up willingness?",
          "Warranty period?",
        ],
        documents: ["Past projects", "Sample mock-ups", "Warranty terms"],
        engagementStage: "Post-civil → finishing",
        commonMistakes: ["Skipping mock-up; brand substitutions"],
        feeModel: "BOQ-based with retention.",
        cta: "Request Interior Contractor Introduction",
      },
      {
        id: "swimming-pool",
        name: "Swimming Pool Vendor",
        whenNeeded: "Construction stage",
        helps: "Pool design, construction, filtration, maintenance.",
        questions: [
          "Hospitality pool projects (commercial-grade)?",
          "Filtration system brand and capacity calculation?",
          "Maintenance AMC offered?",
        ],
        documents: ["Past projects", "Filtration specs", "AMC samples"],
        engagementStage: "Construction stage",
        commonMistakes: ["Domestic-grade pool for hospitality; under-sized filtration"],
        feeModel: "Per-project fixed. AMC annual.",
        cta: "Request Swimming Pool Vendor Introduction",
      },
      {
        id: "solar-dg-electrical",
        name: "Solar / DG / Electrical Vendor",
        whenNeeded: "MEP stage",
        helps: "Solar rooftop, DG sets, electrical infrastructure, energy management.",
        questions: [
          "Past hospitality installations?",
          "Net-metering and state-policy expertise?",
          "AMC and emergency response?",
        ],
        documents: ["OEM authorisations", "Past installations"],
        engagementStage: "MEP and pre-opening",
        commonMistakes: ["Under-sized DG; no redundancy; no AMC"],
        feeModel: "Per-system supply + install + AMC.",
        cta: "Request Solar/DG Vendor Introduction",
      },
    ],
  },
  {
    group: "Procurement & Vendors",
    items: [
      {
        id: "procurement-vendor",
        name: "Procurement Consultant",
        whenNeeded: "Pre-construction → pre-opening",
        helps: "Vendor short-listing, comparative quotation, sample/mock-up management, PO and delivery tracking.",
        questions: [
          "Are you commission-free (fees only from owner)?",
          "Past hotel procurements managed?",
        ],
        documents: ["Past clients", "Commission-free declaration"],
        engagementStage: "Design → pre-opening",
        commonMistakes: ["Hiring a procurement person who takes vendor kickbacks"],
        feeModel: "Fixed fee or % of procurement budget (transparent).",
        cta: "Request Procurement Consultant Introduction",
      },
      {
        id: "furniture",
        name: "Furniture Vendor",
        whenNeeded: "After design freeze",
        helps: "Hotel-grade furniture — guest rooms, lobby, F&B, banquet.",
        questions: ["Hotel-grade vs residential-grade — clarify in writing", "Factory visit possible?", "Warranty?"],
        documents: ["Factory address", "Past hotel projects", "Sample units"],
        engagementStage: "Procurement stage",
        commonMistakes: ["Domestic furniture in hospitality use"],
        feeModel: "Per-unit pricing with bulk discounts.",
        cta: "Request Furniture Vendor Introduction",
      },
      {
        id: "kitchen-equipment",
        name: "Kitchen Equipment Vendor",
        whenNeeded: "Pre-installation",
        helps: "Commercial kitchen equipment, exhaust, cold rooms, dishwashing.",
        questions: ["OEM authorisations?", "Commissioning protocol?", "AMC capability?"],
        documents: ["OEM letters", "Past projects", "Commissioning reports"],
        engagementStage: "Pre-installation → opening",
        commonMistakes: ["Treating commercial kitchen as scaled-up domestic kitchen"],
        feeModel: "Per-item with installation. AMC separate.",
        cta: "Request Kitchen Equipment Vendor Introduction",
      },
      {
        id: "linen",
        name: "Linen Vendor",
        whenNeeded: "60–90 days pre-opening",
        helps: "Bed linen, bath linen, F&B linen, banquet covers.",
        questions: ["GSM, thread count, fabric blend?", "Sample washing — 50-cycle test?", "Replacement cycle and warranty?"],
        documents: ["Spec sheets", "Sample units", "Test reports"],
        engagementStage: "Pre-opening",
        commonMistakes: ["Under-ordering pars (single set per room)"],
        feeModel: "Per-unit pricing.",
        cta: "Request Linen Vendor Introduction",
      },
      {
        id: "housekeeping",
        name: "Housekeeping Vendor",
        whenNeeded: "Pre-opening + ongoing",
        helps: "Chemicals, equipment, carts, amenities, uniforms.",
        questions: ["Hotel-specific chemicals and protocols?", "AMC and training support?"],
        documents: ["Product list", "MSDS sheets", "Training samples"],
        engagementStage: "Pre-opening → ongoing",
        commonMistakes: ["Buying retail chemicals for hospitality use"],
        feeModel: "Per-unit + AMC.",
        cta: "Request Housekeeping Vendor Introduction",
      },
      {
        id: "laundry",
        name: "Laundry Vendor",
        whenNeeded: "Design (if on-premise) or pre-opening (if outsourced)",
        helps: "On-premise laundry equipment OR outsourced laundry service.",
        questions: ["On-premise vs outsourced math for our scale?", "Response time and quality SLAs?"],
        documents: ["Equipment specs OR service SLAs", "Past clients"],
        engagementStage: "Design or pre-opening",
        commonMistakes: ["Building in-house laundry without doing the math vs outsourcing"],
        feeModel: "Equipment supply OR per-kg service pricing.",
        cta: "Request Laundry Vendor Introduction",
      },
      {
        id: "security",
        name: "Security Vendor",
        whenNeeded: "Pre-opening",
        helps: "Manned security, CCTV monitoring, access control, training.",
        questions: ["PSARA compliant?", "Hospitality experience?", "Training and supervision protocols?"],
        documents: ["PSARA license", "Past clients"],
        engagementStage: "Pre-opening + ongoing",
        commonMistakes: ["Hiring non-PSARA agencies (legal exposure)"],
        feeModel: "Per-guard monthly.",
        cta: "Request Security Vendor Introduction",
      },
      {
        id: "landscaping-vendor",
        name: "Landscaping Maintenance Vendor",
        whenNeeded: "Pre-opening + ongoing",
        helps: "Garden maintenance, irrigation, pest, plant replacement.",
        questions: ["Hospitality landscape experience?", "Local plant expertise?"],
        documents: ["Past clients", "Maintenance plan template"],
        engagementStage: "Post-landscape install",
        commonMistakes: ["No maintenance contract — gardens die in dry season"],
        feeModel: "Monthly retainer.",
        cta: "Request Landscape Vendor Introduction",
      },
    ],
  },
  {
    group: "Operations, Tech & Pre-opening",
    items: [
      {
        id: "operator",
        name: "Hotel Operator (HMA / Franchise)",
        whenNeeded: "Pre-construction or construction stage",
        helps: "Brand standards, management, distribution, loyalty. Independent / soft brand / franchise / HMA.",
        questions: [
          "What is your performance test in HMA?",
          "Owner protections in the contract?",
          "Comparable property in our market?",
        ],
        documents: ["Standard HMA term sheet", "Comparable property data"],
        engagementStage: "Pre-construction or construction",
        commonMistakes: [
          "Signing HMA without legal review",
          "Choosing operator on brand-recall instead of fit",
        ],
        feeModel: "Base + incentive + marketing + sales contributions. Multi-year contract.",
        cta: "Request Operator Introduction",
      },
      {
        id: "preopening-consultant",
        name: "Pre-opening Consultant",
        whenNeeded: "90–180 days pre-opening",
        helps: "Hiring, training, SOPs, soft opening, opening readiness.",
        questions: ["Past pre-openings (with timeline data)?", "Will you stay through soft opening?"],
        documents: ["Past pre-opening projects", "Sample SOP set"],
        engagementStage: "Pre-opening through soft launch",
        commonMistakes: ["Hiring pre-opening consultant 30 days before opening (too late)"],
        feeModel: "Fixed-fee program. Typical ₹6L–₹25L.",
        cta: "Request Pre-opening Consultant Introduction",
      },
      {
        id: "revenue-management",
        name: "Revenue Management Consultant",
        whenNeeded: "Pre-opening + first 12 months",
        helps: "Rate strategy, channel optimisation, comp-set, demand forecasting.",
        questions: ["Past revenue improvements (with data)?", "Tools and tech stack used?"],
        documents: ["Case studies", "Tool list"],
        engagementStage: "Pre-opening → operations",
        commonMistakes: ["Setting rates without comp-set analysis"],
        feeModel: "Monthly retainer ₹50K–₹3L.",
        cta: "Request Revenue Management Introduction",
      },
      {
        id: "branding-website",
        name: "Branding & Website Agency",
        whenNeeded: "90–120 days pre-opening",
        helps: "Brand identity, logo, website, booking engine, content, photography.",
        questions: ["Hospitality brand portfolio?", "SEO and booking engine integration?"],
        documents: ["Portfolio", "Past hospitality websites"],
        engagementStage: "Pre-opening",
        commonMistakes: ["Generic agency without hospitality experience"],
        feeModel: "Fixed-fee project + monthly support.",
        cta: "Request Branding Agency Introduction",
      },
      {
        id: "technology",
        name: "Technology Vendor (PMS / POS / CM / Booking Engine)",
        whenNeeded: "60–90 days pre-opening",
        helps: "Integrated tech stack — PMS, POS, channel manager, booking engine, integrations.",
        questions: [
          "PMS-POS-CM integration tested with our exact configuration?",
          "Data ownership and exit clause?",
          "Local support response time?",
        ],
        documents: ["Reference clients", "SLA documents", "Integration map"],
        engagementStage: "Pre-opening + ongoing",
        commonMistakes: [
          "Choosing PMS, POS, CM separately without integration testing",
          "No data exit clause",
        ],
        feeModel: "Setup + annual subscription per module.",
        cta: "Request Technology Vendor Introduction",
      },
      {
        id: "ota-channel-manager",
        name: "OTA / Channel Manager / PMS Provider",
        whenNeeded: "60–90 days pre-opening",
        helps: "OTA onboarding, channel manager setup, rate parity management.",
        questions: ["Connectivity with major OTAs?", "Rate parity tools?", "Reporting?"],
        documents: ["OTA contract templates", "Setup checklist"],
        engagementStage: "Pre-opening → ongoing",
        commonMistakes: ["No rate parity strategy; over-dependence on one OTA"],
        feeModel: "Setup + monthly per property.",
        cta: "Request OTA / Channel Manager Introduction",
      },
    ],
  },
];

// ---- C. Data-backed assumption library ----
// Each assumption tied to a "data button" by id
const ASSUMPTIONS = {
  "capex-per-key": {
    title: "CAPEX per key — ₹35L to ₹2.5 Cr",
    means: "Total capital expenditure to build one hotel key (room) — including land development, civil construction, MEP, interiors, FF&E, soft costs, and pre-opening burn.",
    used: [
      "Range reflects mid-scale (₹35L–₹65L) to luxury (₹1.5–2.5 Cr) hotel projects in India",
      "Excludes land cost (land is highly site-specific)",
      "Includes 10–15% contingency",
      "Assumes BOQ-based contractor; not turnkey premium pricing",
    ],
    increases: [
      "Tier-1 city land development costs",
      "Luxury or 5-star positioning (premium FF&E, higher per-key built-up)",
      "Higher built-up area per key (suites, larger F&B, banquet)",
      "Imported materials and equipment",
      "Slow construction due to financing or approval delays",
    ],
    decreases: [
      "Mid-scale or budget positioning",
      "Tier-2/3 location with lower labour and material costs",
      "Smaller per-key built-up (efficient design)",
      "Locally sourced FF&E",
      "Modular or pre-fab construction (limited but emerging)",
    ],
    regional: "North India: 10–15% lower than South / metros. Hill stations: 15–25% higher due to logistics. Tier-3 towns: 20–30% lower than metro benchmarks.",
    source: "Composite of operator-published benchmarks (HVS, Hotelivate annual reports), CBRE Hospitality Trends, primary discussions with hospitality QS firms, and 2024–25 owner-reported figures.",
    confidence: "Medium-High",
    disclaimer: "Final capex depends on land specifics, design choices, contractor quality, and inflation. Use this only for planning-stage gut-check, not as a budget commitment.",
    consultantWhen: "When you have a specific site, concept, and category in mind — get a project-specific cost estimate from a QS firm or hospitality cost consultant.",
  },
  "breakeven-occupancy": {
    title: "Breakeven occupancy — 45% to 58% (hotels)",
    means: "The occupancy percentage at which a hotel covers all fixed and variable costs but does not yet generate profit.",
    used: [
      "Assumes stabilised ARR (year 3+)",
      "Mid-scale hotel: ~₹4,000–6,500 ARR",
      "Operating cost structure typical for owner-operated mid-scale hotels in tier-2/3 India",
      "No debt service factored (add 5–10 percentage points if debt-financed)",
    ],
    increases: [
      "Higher fixed costs (luxury staffing, expensive ground rent, large banquet kitchen)",
      "Lower ARR (price competition, weak market)",
      "Debt-heavy financing",
      "Inefficient operations (high food cost, staff cost above 30%)",
    ],
    decreases: [
      "Lower per-key built-up (efficient design)",
      "Higher ARR (premium positioning that holds)",
      "Strong F&B and banquet contribution",
      "Owner-operated (lower management fees)",
      "Subsidised land or interest costs",
    ],
    regional: "Tier-1 city business hotels: 50–58%. Tier-2 leisure resorts: 42–50% (lower base but seasonality). Wildlife resorts: 35–45% but at much higher ARR.",
    source: "Operator-disclosed performance benchmarks, FHRAI annual reports, primary owner interviews, hotel-school case studies from XLRI / IIMs.",
    confidence: "Medium-High",
    disclaimer: "Breakeven varies meaningfully by capex per key, debt structure, and operating discipline. The same property at the same revenue can be profitable for one owner and unprofitable for another based on operating choices.",
    consultantWhen: "Before signing land or starting construction — get a project-specific breakeven model with sensitivity analysis (what if occupancy is 8% lower).",
  },
  "approval-lead-time": {
    title: "Approvals lead time — 9 to 24 months",
    means: "The end-to-end time from project conception to having all major approvals required to open and operate a hospitality property.",
    used: [
      "Includes building permission, fire NOC, pollution consent, FSSAI, tourism registration, electrical sanction, lift approval",
      "Excise/liquor licenses extend this to 18–24 months in many states",
      "Excludes time for land conversion if applicable (add 6–18 months)",
      "Assumes parallel filing across approvals (sequential filing adds 30–50%)",
    ],
    increases: [
      "Excise/liquor license required (especially in slow states)",
      "Environment clearance required (for ESZ, large projects)",
      "Land conversion / diversion needed",
      "Forest dept NOC for wildlife belts",
      "Government regime change during filing",
    ],
    decreases: [
      "Industrial / tourism estate locations (pre-approved)",
      "Single-window clearance states (Gujarat, Madhya Pradesh tourism policy)",
      "Smaller built-up area (under EIA threshold)",
      "No alcohol (no excise license needed)",
    ],
    regional: "Madhya Pradesh, Gujarat, Karnataka: relatively faster. Maharashtra, Tamil Nadu: medium. UP, Bihar, West Bengal: slower. Goa: tourism faster, excise slower.",
    source: "State-specific approval timelines from licensing consultants, tourism dept disclosures, primary owner experiences over 2022–2025.",
    confidence: "Medium",
    disclaimer: "Approval timelines are highly state-specific and change with government regimes. Verify with a state-specific licensing consultant before committing capital.",
    consultantWhen: "Before signing land — get a state-specific approval matrix and realistic timeline from a licensing consultant in that state.",
  },
  "staff-per-key": {
    title: "Staff per key — 0.8 to 1.6",
    means: "Number of staff (across all departments) required per hotel key for stable operations.",
    used: [
      "Mid-scale hotels: 0.8–1.0 per key",
      "Upscale: 1.0–1.3 per key",
      "Luxury / resort: 1.2–1.6 per key (higher due to F&B, banquet, spa, recreation)",
      "Includes management, F&O, F&B, kitchen, housekeeping, engineering, security, sales/admin",
    ],
    increases: [
      "Higher star category / brand standards",
      "Larger F&B and banquet operations",
      "Spa, recreation, kids' club facilities",
      "Resort with multiple guest experiences",
      "Inefficient SOPs or low automation",
    ],
    decreases: [
      "Smaller F&B footprint",
      "Mid-scale positioning",
      "Strong systems and SOPs",
      "Cross-trained multi-skill staff",
      "Outsourced housekeeping / security / laundry",
    ],
    regional: "South India hotels often run leaner (0.75–0.95 per key). North India banquet-heavy hotels often run higher (1.1–1.4). Hill / resort properties: higher due to staff housing logistics.",
    source: "HVS / Hotelivate annual studies, FHRAI surveys, brand-published staffing guidelines (Marriott, IHG, Taj), primary owner data.",
    confidence: "High",
    disclaimer: "Staff ratios should not be the sole basis for staffing — actual structure depends on outlets, occupancy seasonality, and operator standards.",
    consultantWhen: "During pre-opening — get a project-specific org chart and staffing plan from a pre-opening consultant.",
  },
  "parking-ratio": {
    title: "Parking ratio — per local bye-laws + practical override",
    means: "Number of car-parking spaces required per key + outlets + banquet, based on local building bye-laws and operational reality.",
    used: [
      "Bye-laws typically require 1 spot per 2–4 keys (varies by city)",
      "Banquet halls: 1 spot per 6–10 sqm of banquet area",
      "Restaurants: 1 spot per 4–6 covers",
      "Practical override: real wedding-hosting hotels need 2–4× bye-law parking",
    ],
    increases: [
      "Banquet / wedding-active properties",
      "Restaurant with weekend dining popularity",
      "Tier-1 city hotels with corporate events",
    ],
    decreases: [
      "Boutique / leisure-only properties",
      "Properties with valet + offsite overflow",
      "Urban properties on metro lines",
    ],
    regional: "Mumbai, Bangalore, Delhi: strict bye-laws and difficult enforcement. Tier-2 cities: more lenient bye-laws but neighbor pressure. Hill / leisure: depends on local panchayat.",
    source: "State-specific building bye-laws, FAR / ground coverage rules, primary observations from wedding-hosting hotels.",
    confidence: "Medium-High (bye-laws) / High (practical override)",
    disclaimer: "Bye-law parking is the legal minimum, not the operational requirement. Build to operational reality.",
    consultantWhen: "Before design freeze — get a parking demand study from a hospitality architect or PMC familiar with your local enforcement.",
  },
  "utility-load": {
    title: "Utility load — 5 to 10 kVA per key (electrical)",
    means: "Sanctioned electrical load required per hotel key, including all common areas, F&B, banquet, BOH on a per-key basis.",
    used: [
      "Mid-scale: 5–7 kVA per key",
      "Upscale: 7–9 kVA per key",
      "Luxury / resort with extensive amenities: 9–12 kVA per key",
      "Banquet-heavy properties add 1–2 kVA per key for event-day spikes",
    ],
    increases: [
      "Extensive HVAC (luxury, high humidity zones)",
      "Large kitchens and bakery operations",
      "Banquet + event halls",
      "Spa, gym, pool, recreation areas",
      "EV charging stations (emerging requirement)",
    ],
    decreases: [
      "Cooler climates (less HVAC load)",
      "Smaller F&B footprint",
      "Solar offset (reduces grid sanctioned load)",
      "Energy-efficient design (LED, BMS, VFD)",
    ],
    regional: "South India: higher HVAC loads. North hill stations: lower. Tier-2 cities may have weaker grid (require larger DG redundancy).",
    source: "Hotel MEP consultant load calculations, brand-standard guidelines, FHRAI / EESL energy benchmarks.",
    confidence: "High",
    disclaimer: "Final sanctioned load depends on connected load + diversity factor and is determined by the local electricity utility based on signed-off MEP drawings.",
    consultantWhen: "Design stage — get a project-specific load calculation from a hospitality MEP consultant.",
  },
  "consultant-fee": {
    title: "Consultant fee range — varies by category",
    means: "Typical professional fees for hospitality consultants in India, by category.",
    used: [
      "Hotel project consultant: ₹8L–₹40L total engagement",
      "Feasibility consultant: ₹4L–₹18L per study",
      "Owner representative / PMC: ₹2L–₹6L/month",
      "Licensing consultant: ₹3L–₹15L bundle",
      "Excise consultant: ₹2L–₹6L + success-linked",
      "Hospitality architect: 4–8% of construction cost (premium: 8–12%)",
    ],
    increases: [
      "Premium / global brand consultants",
      "Multi-site portfolio engagements",
      "Mid-engagement scope additions",
      "Tier-1 city consultants",
    ],
    decreases: [
      "Single-module engagements",
      "Tier-2/3 city consultants (when capability is similar)",
      "Bundle pricing across services",
    ],
    regional: "Mumbai / Delhi / Bangalore consultants charge 20–40% premium over tier-2 city consultants for comparable scope.",
    source: "Primary discussions with hospitality consultants, owner-reported engagements, industry benchmarks 2024–25.",
    confidence: "Medium-High",
    disclaimer: "Fees vary by scope, consultant seniority, project complexity, and engagement model. Always sign a written engagement letter with defined scope.",
    consultantWhen: "When you have a shortlist of 2–3 consultants — get written engagement letters with scoped fees, not just rate cards.",
  },
  "construction-timeline": {
    title: "Construction timeline — 12 to 24 months",
    means: "From breaking ground to completion certificate, for a typical hotel / resort project.",
    used: [
      "Mid-scale 50-key hotel: 14–18 months",
      "Upscale 100-key hotel: 18–22 months",
      "Resort with cottages: 16–22 months",
      "Marriage garden / banquet hall: 8–14 months",
    ],
    increases: [
      "Complex structures (heritage, high-rise, basement)",
      "Cash-flow constraints causing stop-start construction",
      "Approval delays mid-construction",
      "Monsoon / climate disruptions (especially hill / wildlife belts)",
      "Vendor / contractor disputes",
    ],
    decreases: [
      "Pre-fab / modular construction (limited use)",
      "Single-contractor turnkey (faster, less coordination)",
      "Smaller projects (under 40 keys)",
      "Strong PMC discipline",
    ],
    regional: "North India: monsoon less disruptive. South / West coastal: monsoon impacts 60–90 days. Hill stations: monsoon and winter both impact.",
    source: "Owner-reported construction histories, PMC firm data, industry case studies.",
    confidence: "Medium-High",
    disclaimer: "Construction timeline is the most commonly missed estimate in hospitality. Add 15–25% buffer to any contractor commitment.",
    consultantWhen: "Pre-contract stage — get a milestone-linked schedule with liquidated damages clause built into the contractor agreement.",
  },
  "pre-opening-cost": {
    title: "Pre-opening cost — 4% to 8% of capex",
    means: "Total cost incurred before the property opens for paying guests — including hiring, training, salaries before revenue, soft launch, marketing, photography, technology setup, OS&E.",
    used: [
      "Mid-scale: 4–5% of total capex",
      "Upscale: 5–7% of capex",
      "Luxury / resort: 6–8% of capex",
      "Pre-opening period: 90–180 days",
    ],
    increases: [
      "Longer pre-opening period (luxury properties need more training)",
      "Higher staffing during pre-opening",
      "Premium photography, branding, launch marketing",
      "Operator brand training requirements",
      "Delayed opening (every month of delay adds 0.5–1% to capex)",
    ],
    decreases: [
      "Shorter, well-managed pre-opening",
      "Lean staffing during ramp-up",
      "Owner-led marketing (vs agency)",
      "Cross-trained multi-skill teams",
    ],
    regional: "Tier-1 city: higher pre-opening due to expensive talent. Tier-2/3: lower base but harder to find experienced talent.",
    source: "Owner-reported pre-opening expenses, brand-standard pre-opening budgets, primary case studies.",
    confidence: "Medium-High",
    disclaimer: "Pre-opening is the most commonly under-budgeted item in hospitality projects. Build a separate pre-opening budget — do not bury it inside capex.",
    consultantWhen: "120 days before opening — engage a pre-opening consultant with a written 120-day calendar.",
  },
  "room-size": {
    title: "Room size — 200 to 600 sqft (carpet)",
    means: "Typical guest room carpet area in Indian hotels by category.",
    used: [
      "Budget: 180–220 sqft",
      "Mid-scale: 240–320 sqft",
      "Upscale: 320–400 sqft",
      "Luxury: 400–600 sqft",
      "Suites: 500–1,200 sqft",
    ],
    increases: [
      "Suite count in inventory",
      "Premium positioning",
      "Resort / leisure (guests expect larger rooms)",
      "Bathroom-with-tub configurations",
    ],
    decreases: [
      "Budget / business positioning",
      "Land-constrained urban sites",
      "Efficient layouts (no wasted corridors)",
    ],
    regional: "Goa / Kerala resorts: larger rooms expected. Mumbai / Delhi business: smaller, efficient. Tier-2 cities: mid-range typical.",
    source: "Brand standards (Marriott, IHG, Taj, Oberoi), FHRAI category guidelines, primary observations.",
    confidence: "High",
    disclaimer: "Room size is a brand-standard requirement for franchised / managed hotels. Independent properties have flexibility but should benchmark against competition.",
    consultantWhen: "Design stage — confirm room sizes with hospitality architect against brand standards or independent market positioning.",
  },
  "land-size": {
    title: "Land size — 0.3 acre to 50+ acres",
    means: "Typical land requirement by hospitality format in India.",
    used: [
      "Urban hotel: 0.3–1.5 acres (high FAR / vertical)",
      "Resort: 5–25 acres",
      "Wildlife resort: 5–20 acres (often part of larger leased land)",
      "Marriage garden: 1–10 acres",
      "Glamping / safari camp: 5–50+ acres",
    ],
    increases: [
      "Lower FAR / ground coverage limits",
      "Required parking, banquet, gardens",
      "Resort experience (cottages with privacy)",
      "Setback / heritage / view restrictions",
    ],
    decreases: [
      "High-FAR urban zoning",
      "Compact business hotel concepts",
      "Efficient design (multi-floor banquet, structured parking)",
    ],
    regional: "Urban hotels in Mumbai / Delhi: smaller land, higher FAR. Tier-2 cities: more land available. Hill stations: gradient affects usable land.",
    source: "Hotel master-planning benchmarks, brand-development standards, primary site visits.",
    confidence: "High",
    disclaimer: "Usable land is not the same as total land. Setbacks, FAR, ground coverage, and topography all reduce usable area significantly.",
    consultantWhen: "Before land purchase — get a usable-land analysis from a hospitality architect.",
  },
};

// ---- D. Methodology bullets ----
const METHODOLOGY_SOURCES = [
  {
    title: "Industry benchmarks",
    detail: "HVS, Hotelivate, CBRE Hospitality, JLL annual reports. FHRAI surveys. Tourism ministry data. Used for high-level capex, occupancy, ARR ranges.",
  },
  {
    title: "Consultant inputs",
    detail: "Discussions with hospitality consultants, QS firms, architects, MEP consultants. Used for unit-level cost and load calculations.",
  },
  {
    title: "Operator experience",
    detail: "Insights from operators (Marriott, IHG, Taj, Oberoi, ITC, Lemon Tree, Sarovar, etc.) on staffing, brand standards, distribution. Used for operating model assumptions.",
  },
  {
    title: "Published government rules",
    detail: "Building bye-laws, NBC, FSSAI regulations, fire safety codes, pollution norms, EIA rules. Used for compliance and approval timelines.",
  },
  {
    title: "State tourism policies",
    detail: "MP Tourism Policy, Rajasthan Tourism Policy, Karnataka, UP, Uttarakhand, etc. Used for subsidy assumptions and tourism registration timelines.",
  },
  {
    title: "Local authority norms",
    detail: "Municipal corporations, town planning, panchayat-level rules. Used for site-specific approval and bye-law assumptions.",
  },
  {
    title: "Vendor quotations",
    detail: "Anonymised vendor quotes across categories — kitchen equipment, FF&E, technology, MEP. Used for procurement budgets.",
  },
  {
    title: "Project case studies",
    detail: "Real owner-reported project data (anonymised) on capex, timeline, breakeven. Used to validate ranges against actuals.",
  },
  {
    title: "Construction cost references",
    detail: "QS firm rate analyses, CPWD-style benchmarks adapted for hospitality. Used for civil and finish cost estimates.",
  },
  {
    title: "Market research",
    detail: "Primary research, OTA performance data, occupancy trackers, ADR benchmarks. Used for demand and revenue assumptions.",
  },
  {
    title: "Feasibility assumptions",
    detail: "Standard financial assumptions on ramp-up, debt structure, working capital, tax. Used for ROI and payback models.",
  },
];

// ============================================================
// PRIMITIVES (consistent with rest of Innsight site)
// ============================================================

const Pill = ({ children, tone = "neutral" }) => {
  const map = {
    neutral: { bg: C.ivory, fg: C.charcoalSoft, bd: C.line },
    green: { bg: C.goodBg, fg: C.goodText, bd: C.goodBorder },
    gold: { bg: "#F1E6CC", fg: "#7A5A1F", bd: C.goldSoft },
    warn: { bg: C.warnBg, fg: C.warnText, bd: C.warnBorder },
    risk: { bg: C.riskBg, fg: C.riskText, bd: C.riskBorder },
  };
  const s = map[tone] || map.neutral;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        fontSize: 10.5,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontWeight: 600,
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.bd}`,
        borderRadius: 2,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

const Card = ({ children, deep = false, style = {} }) => (
  <div
    style={{
      background: deep ? C.beigeDeep : C.beige,
      border: `1px solid ${C.line}`,
      borderRadius: 4,
      padding: 22,
      ...style,
    }}
  >
    {children}
  </div>
);

const Warning = ({ children, title = "Owner warning" }) => (
  <div
    style={{
      background: C.warnBg,
      border: `1px solid ${C.warnBorder}`,
      borderLeft: `3px solid ${C.warnBorder}`,
      padding: "14px 18px",
      borderRadius: 3,
      margin: "16px 0",
    }}
  >
    <div
      style={{
        fontSize: 10.5,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: C.warnText,
        fontWeight: 700,
        marginBottom: 6,
      }}
    >
      ⚠  {title}
    </div>
    <div style={{ color: C.charcoal, fontSize: 14, lineHeight: 1.6 }}>{children}</div>
  </div>
);

// "View Assumptions" trigger — small icon-style button that opens a modal
const DataButton = ({ assumptionId, onOpen, label = "View Assumptions" }) => (
  <button
    onClick={() => onOpen(assumptionId)}
    style={{
      background: "transparent",
      border: `1px solid ${C.goldSoft}`,
      color: C.gold,
      padding: "4px 10px",
      fontSize: 10.5,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontWeight: 600,
      cursor: "pointer",
      borderRadius: 2,
      fontFamily: "'Inter', sans-serif",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      marginLeft: 10,
    }}
  >
    <span style={{ fontSize: 11 }}>ⓘ</span> {label}
  </button>
);

// Assumption Modal
const AssumptionModal = ({ assumptionId, onClose }) => {
  if (!assumptionId) return null;
  const a = ASSUMPTIONS[assumptionId];
  if (!a) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(20, 48, 37, 0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 20px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.ivory,
          maxWidth: 720,
          width: "100%",
          borderRadius: 6,
          padding: "32px 32px 28px",
          boxShadow: "0 20px 60px rgba(20,48,37,0.25)",
          border: `1px solid ${C.line}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div
              style={{
                fontSize: 10.5,
                letterSpacing: "0.22em",
                color: C.gold,
                fontWeight: 700,
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              Data behind this number
            </div>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 26,
                color: C.green,
                margin: 0,
                lineHeight: 1.15,
                fontWeight: 600,
              }}
            >
              {a.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 24,
              color: C.charcoalSoft,
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div style={{ display: "grid", gap: 18, fontSize: 14, color: C.charcoal, lineHeight: 1.65 }}>
          <div>
            <div style={labelStyle()}>What this number means</div>
            <div>{a.means}</div>
          </div>
          <div>
            <div style={labelStyle()}>Assumptions used</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {a.used.map((u, i) => <li key={i} style={{ marginBottom: 4 }}>{u}</li>)}
            </ul>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={labelStyle("risk")}>What can increase the number</div>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {a.increases.map((u, i) => <li key={i} style={{ marginBottom: 4 }}>{u}</li>)}
              </ul>
            </div>
            <div>
              <div style={labelStyle("good")}>What can reduce the number</div>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {a.decreases.map((u, i) => <li key={i} style={{ marginBottom: 4 }}>{u}</li>)}
              </ul>
            </div>
          </div>
          <div>
            <div style={labelStyle()}>Regional variation</div>
            <div>{a.regional}</div>
          </div>
          <div>
            <div style={labelStyle()}>Source type used</div>
            <div>{a.source}</div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <Pill tone={a.confidence.includes("High") ? "green" : "gold"}>
              Confidence: {a.confidence}
            </Pill>
          </div>
          <div
            style={{
              background: C.warnBg,
              borderLeft: `3px solid ${C.warnBorder}`,
              padding: "12px 14px",
              borderRadius: 3,
              fontSize: 13.5,
            }}
          >
            <strong style={{ color: C.warnText }}>Disclaimer.</strong> {a.disclaimer}
          </div>
          <div
            style={{
              background: C.goodBg,
              borderLeft: `3px solid ${C.goodBorder}`,
              padding: "12px 14px",
              borderRadius: 3,
              fontSize: 13.5,
            }}
          >
            <strong style={{ color: C.goodText }}>Speak to a consultant when:</strong> {a.consultantWhen}
          </div>
        </div>
      </div>
    </div>
  );
};

function labelStyle(tone = "default") {
  const c = tone === "risk" ? C.riskText : tone === "good" ? C.goodText : C.gold;
  return {
    fontSize: 10.5,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: c,
    fontWeight: 700,
    marginBottom: 6,
  };
}

// Number tile with data button
const StatTile = ({ value, label, assumptionId, onOpen }) => (
  <div
    style={{
      background: C.beige,
      border: `1px solid ${C.line}`,
      padding: "16px 18px",
      borderRadius: 4,
    }}
  >
    <div
      style={{
        fontSize: 10,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: C.gold,
        fontWeight: 700,
        marginBottom: 6,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 22,
        color: C.green,
        fontWeight: 600,
        lineHeight: 1.2,
        marginBottom: 6,
      }}
    >
      {value}
    </div>
    {assumptionId && <DataButton assumptionId={assumptionId} onOpen={onOpen} label="View Assumptions" />}
  </div>
);

// Booking request form
const BookingForm = ({ selectedExpert, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    projectType: "",
    projectStage: "",
    projectLocation: "",
    investmentSize: "",
    challenge: "",
    timeline: "",
    name: "",
    email: "",
    phone: "",
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(20, 48, 37, 0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 20px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.ivory,
          maxWidth: 680,
          width: "100%",
          borderRadius: 6,
          padding: "32px",
          boxShadow: "0 20px 60px rgba(20,48,37,0.25)",
          border: `1px solid ${C.line}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div
              style={{
                fontSize: 10.5,
                letterSpacing: "0.22em",
                color: C.gold,
                fontWeight: 700,
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              Expert introduction request
            </div>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 24,
                color: C.green,
                margin: 0,
                lineHeight: 1.15,
                fontWeight: 600,
              }}
            >
              Request: {selectedExpert?.name || "Expert"}
            </h3>
            <p style={{ fontSize: 13.5, color: C.charcoalSoft, marginTop: 8, lineHeight: 1.55 }}>
              We curate, verify and personally introduce experts based on your project specifics —
              we do not list pay-to-list vendors. Submit the form below and we will respond within 5 working days.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 24,
              color: C.charcoalSoft,
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <FormField label="Project type" value={form.projectType} onChange={set("projectType")}
            options={["Hotel", "Resort", "Wildlife Resort", "Marriage Garden", "Restaurant / Café", "Bar / Brewery", "Villa / Airbnb", "Experiential / Tourism"]} />
          <FormField label="Project stage" value={form.projectStage} onChange={set("projectStage")}
            options={["Idea", "Land identified", "Feasibility", "Design", "Approvals", "Construction", "Procurement", "Pre-opening", "Operational"]} />
          <FormField label="Project location (city / district / state)" value={form.projectLocation} onChange={set("projectLocation")} placeholder="e.g., Bhopal, Madhya Pradesh" />
          <FormField label="Approximate investment size (excluding land)" value={form.investmentSize} onChange={set("investmentSize")}
            options={["Under ₹3 Cr", "₹3–10 Cr", "₹10–25 Cr", "₹25–50 Cr", "₹50–100 Cr", "Above ₹100 Cr"]} />
          <FormField label="Decision timeline" value={form.timeline} onChange={set("timeline")}
            options={["Within 30 days", "1–3 months", "3–6 months", "6–12 months", "Exploratory"]} />
          <FormField label="What is the specific question you want answered?" value={form.challenge} onChange={set("challenge")} textarea placeholder="Minimum 50 characters — this helps us match the right expert." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormField label="Your name" value={form.name} onChange={set("name")} />
            <FormField label="Phone (with country code)" value={form.phone} onChange={set("phone")} />
          </div>
          <FormField label="Email" value={form.email} onChange={set("email")} type="email" />
        </div>

        <button
          onClick={() => onSubmit && onSubmit({ ...form, expert: selectedExpert?.name })}
          style={{
            marginTop: 22,
            background: C.green,
            color: C.ivory,
            border: "none",
            padding: "14px 28px",
            fontSize: 12.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            borderRadius: 2,
            width: "100%",
          }}
        >
          Submit Introduction Request  →
        </button>

        <div style={{ fontSize: 12, color: C.charcoalSoft, marginTop: 14, lineHeight: 1.55, fontStyle: "italic", textAlign: "center" }}>
          By application. We review weekly. Response within five working days.
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, value, onChange, options, textarea, placeholder, type = "text" }) => (
  <div>
    <div
      style={{
        fontSize: 10.5,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: C.gold,
        fontWeight: 700,
        marginBottom: 6,
      }}
    >
      {label}
    </div>
    {options ? (
      <select
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: 14,
          border: `1px solid ${C.line}`,
          background: C.white,
          color: C.charcoal,
          borderRadius: 3,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <option value="">Select...</option>
        {options.map((o, i) => <option key={i} value={o}>{o}</option>)}
      </select>
    ) : textarea ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: 14,
          border: `1px solid ${C.line}`,
          background: C.white,
          color: C.charcoal,
          borderRadius: 3,
          fontFamily: "'Inter', sans-serif",
          resize: "vertical",
          minHeight: 80,
        }}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: 14,
          border: `1px solid ${C.line}`,
          background: C.white,
          color: C.charcoal,
          borderRadius: 3,
          fontFamily: "'Inter', sans-serif",
        }}
      />
    )}
  </div>
);

// ============================================================
// SECTION COMPONENTS
// ============================================================

const SectionWrap = ({ id, children, dark = false, padded = true }) => (
  <section
    id={id}
    style={{
      padding: padded ? "72px 24px" : "0",
      background: dark ? C.beigeDeep : "transparent",
      borderTop: `1px solid ${C.line}`,
    }}
  >
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>{children}</div>
  </section>
);

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div style={{ marginBottom: 36 }}>
    {eyebrow && (
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.24em",
          color: C.gold,
          fontWeight: 700,
          marginBottom: 14,
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </div>
    )}
    <h2
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "clamp(28px, 4.2vw, 44px)",
        color: C.green,
        margin: 0,
        lineHeight: 1.1,
        fontWeight: 600,
        letterSpacing: "-0.015em",
        maxWidth: 880,
      }}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        style={{
          fontSize: 16.5,
          color: C.charcoalSoft,
          marginTop: 18,
          maxWidth: 820,
          lineHeight: 1.65,
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ProjectPlanningV2() {
  const [openAssumption, setOpenAssumption] = useState(null);
  const [activeStage, setActiveStage] = useState("idea");
  const [activeExpertGroup, setActiveExpertGroup] = useState(EXPERT_CATEGORIES[0].group);
  const [expandedExpert, setExpandedExpert] = useState(null);
  const [bookingFor, setBookingFor] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const stage = useMemo(() => JOURNEY.find((j) => j.id === activeStage), [activeStage]);
  const expertGroup = useMemo(
    () => EXPERT_CATEGORIES.find((g) => g.group === activeExpertGroup),
    [activeExpertGroup]
  );

  const handleSubmitBooking = (data) => {
    // In production: POST to your backend or email service (Formspree, Tally, etc.)
    console.log("Booking request:", data);
    setSubmitted(true);
    setTimeout(() => {
      setBookingFor(null);
      setSubmitted(false);
    }, 2200);
  };

  return (
    <div
      style={{
        background: C.ivory,
        color: C.charcoal,
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        button:hover { opacity: 0.92; }
        ::selection { background: ${C.gold}; color: ${C.ivory}; }
      `}</style>

      {/* ============================================================
          HEADER
      ============================================================ */}
      <header style={{ padding: "72px 24px 40px", maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.24em",
            color: C.gold,
            fontWeight: 700,
            marginBottom: 18,
            textTransform: "uppercase",
          }}
        >
          Innsight  ·  Project Planning
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(38px, 6.5vw, 68px)",
            color: C.green,
            margin: 0,
            lineHeight: 1.04,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          Hospitality project intelligence — from land to launch.
        </h1>
        <p
          style={{
            fontSize: 17.5,
            color: C.charcoalSoft,
            marginTop: 22,
            maxWidth: 880,
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          Learn what to build. Decide whether it works. Act with the right experts at your side.
        </p>
        <p
          style={{
            fontSize: 15.5,
            color: C.charcoal,
            marginTop: 22,
            maxWidth: 920,
            lineHeight: 1.7,
          }}
        >
          A hospitality project doesn't fail only because of weak revenue. It fails from wrong
          sequence — starting construction before validating land, signing contractors before
          locking BOQ, hiring vendors before approving samples, opening before testing systems.
          This page helps you plan the project step by step, with every number backed by
          documented assumptions, and every step supported by curated experts.
        </p>

        {/* Three-pillar promise */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
            marginTop: 40,
          }}
        >
          {[
            { eyebrow: "01  ·  Learn", title: "What to plan, where to plan it",
              desc: "Stage-wise project journey from idea to opening. Every decision, every document, every common mistake — with the math behind every number." },
            { eyebrow: "02  ·  Decide", title: "Numbers with assumptions, not slogans",
              desc: "Every range on this page has a 'View Assumptions' button. See what drives the number up, what drives it down, and when to talk to a specialist." },
            { eyebrow: "03  ·  Act", title: "Connect with curated experts",
              desc: "Hand-picked consultants and vendors across 28 categories. Innsight introduces you personally — not a pay-to-list directory." },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                background: C.beige,
                border: `1px solid ${C.line}`,
                padding: "20px 22px",
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.2em",
                  color: C.gold,
                  fontWeight: 700,
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                {c.eyebrow}
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 22,
                  color: C.green,
                  fontWeight: 600,
                  marginBottom: 8,
                  lineHeight: 1.25,
                }}
              >
                {c.title}
              </div>
              <div style={{ fontSize: 13.5, color: C.charcoal, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </header>

      {/* ============================================================
          QUICK PLANNING SNAPSHOT (key numbers with data buttons)
      ============================================================ */}
      <SectionWrap id="snapshot">
        <SectionHeader
          eyebrow="Planning snapshot"
          title="Eight numbers every owner should know — and the math behind each"
          subtitle="These are planning ranges, not final estimates. Click 'View Assumptions' on any number to see what drives it up or down for your specific project."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          <StatTile value="₹35L – ₹2.5 Cr" label="CAPEX per key" assumptionId="capex-per-key" onOpen={setOpenAssumption} />
          <StatTile value="45 – 58%" label="Breakeven occupancy" assumptionId="breakeven-occupancy" onOpen={setOpenAssumption} />
          <StatTile value="9 – 24 months" label="Approval lead time" assumptionId="approval-lead-time" onOpen={setOpenAssumption} />
          <StatTile value="12 – 24 months" label="Construction timeline" assumptionId="construction-timeline" onOpen={setOpenAssumption} />
          <StatTile value="0.8 – 1.6" label="Staff per key" assumptionId="staff-per-key" onOpen={setOpenAssumption} />
          <StatTile value="5 – 10 kVA / key" label="Electrical load" assumptionId="utility-load" onOpen={setOpenAssumption} />
          <StatTile value="200 – 600 sqft" label="Guest room size" assumptionId="room-size" onOpen={setOpenAssumption} />
          <StatTile value="4 – 8% of capex" label="Pre-opening cost" assumptionId="pre-opening-cost" onOpen={setOpenAssumption} />
        </div>

        <div
          style={{
            background: C.warnBg,
            borderLeft: `3px solid ${C.warnBorder}`,
            padding: "16px 20px",
            borderRadius: 3,
            marginTop: 32,
            fontSize: 14,
            color: C.charcoal,
            lineHeight: 1.65,
          }}
        >
          <strong style={{ color: C.warnText }}>Important.</strong> These are planning ranges, not final project estimates.
          Final numbers depend on land, location, project design, approvals, vendor selection, and state regulations.
          Always commission a project-specific feasibility study before deploying capital.
        </div>
      </SectionWrap>

      {/* ============================================================
          1. LEARN — STAGE-WISE PROJECT JOURNEY
      ============================================================ */}
      <SectionWrap id="journey" dark>
        <SectionHeader
          eyebrow="Layer 01  ·  Learn"
          title="The project journey — nine stages from idea to opening"
          subtitle="Each stage shows what to decide, which expert to engage, what documents to produce, what mistakes to avoid, and how long it should take."
        />

        {/* Stage selector */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 32,
          }}
        >
          {JOURNEY.map((j) => {
            const isActive = activeStage === j.id;
            return (
              <button
                key={j.id}
                onClick={() => setActiveStage(j.id)}
                style={{
                  background: isActive ? C.green : C.ivory,
                  color: isActive ? C.ivory : C.green,
                  border: `1px solid ${isActive ? C.green : C.line}`,
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontSize: 12,
                  letterSpacing: "0.04em",
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: 2,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <span
                  style={{
                    color: isActive ? C.goldSoft : C.gold,
                    marginRight: 8,
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {j.code}
                </span>
                {j.name}
              </button>
            );
          })}
        </div>

        {/* Stage detail */}
        {stage && (
          <div
            style={{
              background: C.ivory,
              border: `1px solid ${C.line}`,
              borderRadius: 6,
              padding: "32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap", marginBottom: 16 }}>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 32,
                  color: C.gold,
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {stage.code}
              </span>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 32,
                  color: C.green,
                  margin: 0,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {stage.name}
              </h3>
              <Pill tone="gold">Duration: {stage.duration}</Pill>
            </div>
            <p style={{ fontSize: 16, color: C.charcoalSoft, marginTop: 0, marginBottom: 24, fontStyle: "italic", lineHeight: 1.6 }}>
              {stage.summary}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
              <Card>
                <div style={labelStyle()}>What the owner must decide</div>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 14, color: C.charcoal, lineHeight: 1.65 }}>
                  {stage.decisions.map((d, i) => <li key={i} style={{ marginBottom: 6 }}>{d}</li>)}
                </ul>
              </Card>
              <Card>
                <div style={labelStyle()}>Documents to produce</div>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 14, color: C.charcoal, lineHeight: 1.65 }}>
                  {stage.documents.map((d, i) => <li key={i} style={{ marginBottom: 6 }}>{d}</li>)}
                </ul>
              </Card>
              <Card>
                <div style={labelStyle("risk")}>Common mistakes</div>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 14, color: C.charcoal, lineHeight: 1.65 }}>
                  {stage.mistakes.map((d, i) => <li key={i} style={{ marginBottom: 6 }}>{d}</li>)}
                </ul>
              </Card>
              <Card deep>
                <div style={labelStyle("good")}>Experts you may need</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {stage.experts.map((e, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 12.5,
                        color: C.charcoal,
                        background: C.ivory,
                        border: `1px solid ${C.lineSoft}`,
                        padding: "5px 10px",
                        borderRadius: 2,
                      }}
                    >
                      {e}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 16, fontSize: 13, color: C.charcoalSoft, lineHeight: 1.6 }}>
                  Output expected: <strong style={{ color: C.green }}>{stage.output}</strong>
                </div>
              </Card>
            </div>

            <div style={{ marginTop: 26, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  const el = document.getElementById("connect-experts");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  background: C.green,
                  color: C.ivory,
                  border: "none",
                  padding: "12px 22px",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: 2,
                }}
              >
                {stage.cta}  →
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("methodology");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  background: "transparent",
                  color: C.green,
                  border: `1px solid ${C.green}`,
                  padding: "12px 22px",
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: 2,
                }}
              >
                Methodology
              </button>
            </div>
          </div>
        )}
      </SectionWrap>

      {/* ============================================================
          2. DECIDE — METHODOLOGY
      ============================================================ */}
      <SectionWrap id="methodology">
        <SectionHeader
          eyebrow="Layer 02  ·  Decide"
          title="How we calculate every number on this page"
          subtitle="Transparency is the only credible signal in an industry full of opinion-as-fact. Here is exactly what feeds every number you see."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {METHODOLOGY_SOURCES.map((s, i) => (
            <Card key={i}>
              <div style={labelStyle()}>{s.title}</div>
              <div style={{ fontSize: 14, color: C.charcoal, lineHeight: 1.65, marginTop: 4 }}>{s.detail}</div>
            </Card>
          ))}
        </div>

        <div
          style={{
            marginTop: 32,
            background: C.beigeDeep,
            border: `1px solid ${C.line}`,
            borderLeft: `4px solid ${C.gold}`,
            padding: "22px 26px",
            borderRadius: 4,
            fontSize: 15,
            color: C.charcoal,
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          "These are planning ranges, not final project estimates. Final numbers depend on land,
          location, project design, approvals, vendor selection, and state regulations."
        </div>
      </SectionWrap>

      {/* ============================================================
          3. ACT — CONNECT WITH EXPERTS
      ============================================================ */}
      <SectionWrap id="connect-experts" dark>
        <SectionHeader
          eyebrow="Layer 03  ·  Act"
          title="Connect with curated hospitality experts"
          subtitle="Twenty-eight categories of consultants and vendors, organised by project stage. Innsight curates and personally introduces — we do not run a pay-to-list directory. Every expert is selected for hospitality-specific competence."
        />

        <Pill tone="green">Innsight-curated  ·  No pay-to-list  ·  Owner-side bias</Pill>

        {/* Expert group selector */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: `1px solid ${C.line}`,
            marginTop: 28,
            marginBottom: 32,
            flexWrap: "wrap",
            overflowX: "auto",
          }}
        >
          {EXPERT_CATEGORIES.map((g) => {
            const isActive = activeExpertGroup === g.group;
            return (
              <button
                key={g.group}
                onClick={() => {
                  setActiveExpertGroup(g.group);
                  setExpandedExpert(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "12px 18px",
                  cursor: "pointer",
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? C.green : C.charcoalSoft,
                  borderBottom: isActive ? `2px solid ${C.gold}` : "2px solid transparent",
                  marginBottom: -1,
                  fontFamily: "'Inter', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {g.group}
              </button>
            );
          })}
        </div>

        {/* Expert cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
          {expertGroup?.items.map((x) => {
            const isOpen = expandedExpert === x.id;
            return (
              <div
                key={x.id}
                style={{
                  background: C.ivory,
                  border: `1px solid ${C.line}`,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setExpandedExpert(isOpen ? null : x.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "20px 24px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 22,
                        color: C.green,
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {x.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        color: C.charcoalSoft,
                        marginTop: 4,
                        lineHeight: 1.55,
                      }}
                    >
                      <strong style={{ color: C.gold }}>When:</strong> {x.whenNeeded}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 22,
                      color: C.gold,
                      transition: "transform 200ms ease",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      fontWeight: 300,
                    }}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 24px 24px" }}>
                    <div
                      style={{
                        fontSize: 14.5,
                        color: C.charcoal,
                        lineHeight: 1.65,
                        marginBottom: 18,
                        paddingBottom: 14,
                        borderBottom: `1px solid ${C.lineSoft}`,
                      }}
                    >
                      {x.helps}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 18 }}>
                      <div>
                        <div style={labelStyle()}>Questions to ask before hiring</div>
                        <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13.5, lineHeight: 1.6, color: C.charcoal }}>
                          {x.questions.map((q, i) => <li key={i} style={{ marginBottom: 5 }}>{q}</li>)}
                        </ul>
                      </div>
                      <div>
                        <div style={labelStyle()}>Documents to request</div>
                        <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13.5, lineHeight: 1.6, color: C.charcoal }}>
                          {x.documents.map((q, i) => <li key={i} style={{ marginBottom: 5 }}>{q}</li>)}
                        </ul>
                      </div>
                      <div>
                        <div style={labelStyle("risk")}>Common mistakes</div>
                        <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13.5, lineHeight: 1.6, color: C.charcoal }}>
                          {x.commonMistakes.map((q, i) => <li key={i} style={{ marginBottom: 5 }}>{q}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 22 }}>
                      <div>
                        <div style={labelStyle()}>Engagement stage</div>
                        <div style={{ fontSize: 13.5, color: C.charcoal, lineHeight: 1.55 }}>{x.engagementStage}</div>
                      </div>
                      <div>
                        <div style={labelStyle()}>Typical fee model
                          <DataButton assumptionId="consultant-fee" onOpen={setOpenAssumption} label="Fees" />
                        </div>
                        <div style={{ fontSize: 13.5, color: C.charcoal, lineHeight: 1.55 }}>{x.feeModel}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setBookingFor(x)}
                      style={{
                        background: C.green,
                        color: C.ivory,
                        border: "none",
                        padding: "12px 22px",
                        fontSize: 12,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                        borderRadius: 2,
                      }}
                    >
                      {x.cta}  →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Disclaimer about curation model */}
        <div
          style={{
            marginTop: 32,
            background: C.warnBg,
            border: `1px solid ${C.warnBorder}`,
            borderLeft: `3px solid ${C.warnBorder}`,
            padding: "16px 20px",
            borderRadius: 3,
            fontSize: 13.5,
            color: C.charcoal,
            lineHeight: 1.65,
          }}
        >
          <strong style={{ color: C.warnText }}>How introductions work.</strong> Innsight curates and
          verifies experts based on hospitality-specific competence. We do not list pay-to-list vendors
          and we do not earn commissions from experts. Final selection depends on quotation,
          site visit, samples, references, warranty, contract terms, and your independent review.
          We may also recommend you do not engage at this stage if your project is not ready.
        </div>
      </SectionWrap>

      {/* ============================================================
          FEATURES PREVIEW (what's coming)
      ============================================================ */}
      <SectionWrap id="features">
        <SectionHeader
          eyebrow="Coming next"
          title="Decision tools we are building into this platform"
          subtitle="Features that move from learning to deciding to acting — built only when they add real owner value."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {[
            { t: "Project Feasibility Checker", d: "Plug in your inputs — get a viability gut-check with our assumptions visible." },
            { t: "Land Suitability Score", d: "Score any land against 5 critical hospitality criteria with reasoning per dimension." },
            { t: "Approval Complexity Score", d: "State-specific approval map showing rate-limiting licenses and realistic timelines." },
            { t: "CAPEX Estimator", d: "Range estimate by category, location, and scale — with assumption transparency." },
            { t: "Document Checklist (downloadable)", d: "Stage-wise document checklists you can take to your team." },
            { t: "Vendor Comparison Templates", d: "Apples-to-apples comparison sheets for each vendor category." },
            { t: "State-wise Approval Guides", d: "MP, Rajasthan, Karnataka, UP, Maharashtra, Goa — what to file, when, where." },
            { t: "Project Readiness Questionnaire", d: "30-question diagnostic — are you ready to start construction? Be honest." },
          ].map((f, i) => (
            <Card key={i}>
              <Pill tone="gold">Coming soon</Pill>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 19,
                  color: C.green,
                  fontWeight: 600,
                  marginTop: 12,
                  marginBottom: 8,
                  lineHeight: 1.25,
                }}
              >
                {f.t}
              </div>
              <div style={{ fontSize: 13.5, color: C.charcoal, lineHeight: 1.6 }}>{f.d}</div>
            </Card>
          ))}
        </div>
      </SectionWrap>

      {/* ============================================================
          PROMISE / GUIDING PRINCIPLES
      ============================================================ */}
      <SectionWrap id="promise" dark>
        <SectionHeader
          eyebrow="What this platform stands for"
          title="The rules we will not break"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {[
            { t: "Owner-side, always", d: "Innsight earns from owners only. No commissions from operators, vendors, brands or contractors." },
            { t: "Transparent numbers", d: "Every range on this page has documented assumptions. No 'industry-standard' claims without sources." },
            { t: "Curated, not crowd-sourced", d: "Experts are introduced based on competence and fit. We do not run a pay-to-list directory." },
            { t: "Honest, including when honest costs us", d: "We will say 'do not build' when the data supports it. We will say 'wait six months' when you are not ready." },
            { t: "Disclaimers, not promises", d: "We will not guarantee subsidy approval, ROI, operator tie-ups, or licensing outcomes. We will commit to rigour." },
            { t: "Discreet by default", d: "Your project details, financials, and decisions stay between Innsight and you. Always." },
          ].map((p, i) => (
            <Card key={i}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 19,
                  color: C.green,
                  fontWeight: 600,
                  marginBottom: 8,
                  lineHeight: 1.25,
                }}
              >
                {p.t}
              </div>
              <div style={{ fontSize: 13.5, color: C.charcoal, lineHeight: 1.6 }}>{p.d}</div>
            </Card>
          ))}
        </div>
      </SectionWrap>

      {/* ============================================================
          FINAL CTA
      ============================================================ */}
      <section
        style={{
          padding: "72px 24px 96px",
          background: C.green,
          color: C.ivory,
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.24em",
              color: C.goldSoft,
              fontWeight: 600,
              marginBottom: 18,
              textTransform: "uppercase",
            }}
          >
            Private review
          </div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(28px, 4.5vw, 44px)",
              color: C.ivory,
              margin: 0,
              lineHeight: 1.15,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Have your project reviewed before you commit capital
          </h2>
          <p
            style={{
              fontSize: 16.5,
              color: "#D8D1B8",
              marginTop: 20,
              lineHeight: 1.7,
              maxWidth: 720,
              margin: "20px auto 0",
            }}
          >
            One conversation with Innsight can prevent a five-year correction.
            Bring your concept, your land, your numbers — we'll review them
            against the framework you've just read.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 36 }}>
            <button
              onClick={() => {
                window.location.hash = "#book-expert-review";
              }}
              style={{
                background: C.gold,
                color: C.green,
                border: "none",
                padding: "16px 32px",
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                borderRadius: 2,
              }}
            >
              Apply for Project Review  →
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("connect-experts");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                background: "transparent",
                color: C.ivory,
                border: `1px solid ${C.goldSoft}`,
                padding: "16px 32px",
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                borderRadius: 2,
              }}
            >
              Browse Experts
            </button>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#A8A088",
              marginTop: 22,
              fontStyle: "italic",
            }}
          >
            By application. We review weekly. Response within five working days.
          </div>
        </div>
      </section>

      {/* ============================================================
          MODALS
      ============================================================ */}
      <AssumptionModal assumptionId={openAssumption} onClose={() => setOpenAssumption(null)} />
      {bookingFor && (
        submitted ? (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(20, 48, 37, 0.55)",
              backdropFilter: "blur(4px)",
              zIndex: 1100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <div
              style={{
                background: C.ivory,
                padding: "36px 40px",
                borderRadius: 6,
                textAlign: "center",
                maxWidth: 460,
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 26,
                  color: C.green,
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                Application received.
              </div>
              <div style={{ fontSize: 14, color: C.charcoal, lineHeight: 1.65 }}>
                We will review it within five working days and respond by email.
                If we determine that another advisor is a better fit, we will tell you that directly.
              </div>
            </div>
          </div>
        ) : (
          <BookingForm
            selectedExpert={bookingFor}
            onClose={() => setBookingFor(null)}
            onSubmit={handleSubmitBooking}
          />
        )
      )}
    </div>
  );
}

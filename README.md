# SchemeEase 2.0

**Government Scheme Discovery & Eligibility Platform**

A full-stack web application that helps citizens discover government welfare schemes based on their personal profile. Built with React, FastAPI, and a deterministic eligibility matching engine.

---

## 🌐 Live Deployment

**Production Site**: https://scheme-ease.vercel.app

**Backend API**: https://schemease-backend.onrender.com

**Repository**: https://github.com/Rakshan-32/SchemeEase

**Hosting**:
- Frontend: Vercel (SPA with deep-link routing)
- Backend: Render (FastAPI on Free tier)
- Contact Form: Resend HTTP API (SMTP ports blocked on Render Free)

---

## ✨ What It Does

SchemeEase evaluates user profiles against **52 government schemes** across 16 categories and provides:

- ✅ **Personalized Recommendations** - Cross-category matching (agriculture + disability + social welfare schemes for a farmer with disability)
- ✅ **Transparent Eligibility** - Shows exactly why schemes matched and what information is missing
- ✅ **Bilingual Support** - Complete English/Tamil localization (UI + scheme content)
- ✅ **Smart Search** - Keyword search with English/Tamil aliases, URL persistence
- ✅ **Application Tracking** - Track scheme applications with branching status model
- ✅ **Save & Compare** - Save favorites, compare up to 3 schemes side-by-side
- ✅ **Print & Share** - Print-optimized summaries, deep-link sharing

---

## 🎯 Key Features

### For Citizens
- **Profile-Based Matching**: Enter age, income, occupation, social category, location, disability status → get ranked scheme recommendations
- **Eligibility Clarity**: Each scheme shows "Eligible", "Needs More Info", or "Not Eligible" with detailed reasoning
- **Document Checklists**: Complete list of required documents for each scheme
- **Application Tracker**: Track application status from "Preparing Documents" to "Approved/Rejected"
- **Favorites & History**: Save schemes, view recently viewed schemes
- **Dark Mode**: Full light/dark theme support with glassmorphic UI
- **Mobile Responsive**: Works on desktop, tablet, and mobile devices

### Technical Features
- **Deterministic Engine**: Data-driven eligibility evaluation - add schemes without code changes
- **Profile Normalization**: Handles schema evolution gracefully - users never lose data across updates
- **URL-Based Search**: Shareable search results, refresh-persistent queries
- **LocalStorage Persistence**: Client-side data storage (no backend database required)
- **Error Boundary**: Graceful error handling with user-friendly messages
- **Cross-Browser**: Works on Chrome, Edge, Firefox, Safari

---

## 📊 Scheme Database

**52 Government Schemes** across 16 categories:

| Category | Count | Example Schemes |
|----------|-------|-----------------|
| Entrepreneurship | 7 | Stand-Up India, PMMY, NEEDS, UYEGP, TWEES |
| Education | 7 | SC/ST Scholarships, NMMS, Girls Secondary Education |
| Agriculture | 6 | PM-KISAN, PMFBY, PM KUSUM, e-NAM, KCC |
| Social Security | 6 | APY, PM-SYM, IGNOAPS, SCSS |
| Health | 5 | PM-JAY, JSY, RSBY, Mission Indradhanush |
| Housing | 3 | PMAY-Urban, PMAY-Gramin, CLSS |
| Disability | 3 | ADIP, DDRS, Niramaya |
| Women & Child | 3 | PMMVY, Nari Shakti, Mahila Shakti |
| Employment | 2 | MGNREGA, e-Shram |
| + 5 more categories | 10 | Infrastructure, Food Security, Livelihood, etc. |

All schemes include structured eligibility criteria, document checklists, benefits, application methods, and official source URLs.

---

## 🏗️ Core Architecture

### Tech Stack

**Frontend**:
- React 18.2
- React Router 6.18
- Vite 5.0 (build tool)
- Tailwind CSS 3.3
- Framer Motion (animations)
- Lucide React (icons)
- Vitest (testing - 152 tests)

**Backend**:
- Python 3.9+
- FastAPI 0.115+
- Uvicorn (ASGI server)
- Pydantic (validation)
- python-dotenv (environment variables)

**Data**:
- JSON file database (schemes.json - 52 schemes)
- LocalStorage (user data, favorites, tracker)

### Logical Module Organization

While the source code is organized into 29 files for maintainability, they logically group into 8 conceptual modules:

#### 1. Application Shell
**Files**: `App.jsx`, `main.jsx`

**Purpose**: Application entry point, routing, authentication state, theme/language state, global search coordination, URL state management.

**Key Responsibilities**:
- React Router configuration
- Authentication flow (login → profile setup → dashboard)
- Dark mode / Tamil-English toggle
- Page-aware navbar search with `?q=` URL persistence
- Deep link handling (`/schemes/:id`)

#### 2. Pages & Sections
**Files**: `sections.jsx`, `AllSchemes.jsx`, `Auth.jsx`, `SchemePublicView.jsx`

**Purpose**: Full-page components and major application sections.

**Key Components**:
- `Dashboard` - Main hub with scheme results, favorites, tracker, compare, notifications
- `AllSchemes` - Browse all 52 schemes with search/filter/sort
- `Auth` - Login/signup forms with Ripon Building background
- `SchemePublicView` - Unauthenticated scheme detail view for sharing
- FAQ, Contact, Profile sections

#### 3. Profile System
**Files**: `ProfileForm.jsx`, `ProfilePage.jsx`, `ProfileSetup.jsx`, `profileSchema.js`, `profileNormalization.js`, `profileCompletion.js`

**Purpose**: User profile management and eligibility data collection.

**Flow**:
1. **ProfileSetup.jsx** - 4-step wizard for initial profile creation
2. **profileSchema.js** - Field definitions, validation rules, occupation-specific fields
3. **ProfileForm.jsx** - Dynamic form rendering based on schema
4. **profileNormalization.js** - Schema migration, data cleaning, field clearing on occupation change
5. **profileCompletion.js** - Occupation-aware completion scoring
6. **ProfilePage.jsx** - Read-only profile display with edit capability

**Critical Logic**:
- Student vs Farmer get different required fields
- Old schema migrations preserve user data across updates
- Null values distinguish "unknown" from "explicitly false"

#### 4. Scheme Discovery & Search
**Files**: `schemeSearch.js`, `schemeLocalization.js`, `eligibilityLabels.js`, `data.js`

**Purpose**: Search, localization, and scheme presentation logic.

**Key Features**:
- **schemeSearch.js**: Deterministic search with Tamil aliases (மாணவர் → student), acronyms (PM-KISAN), profile-independent ranking
- **schemeLocalization.js**: Ministry translations, document translations, Tamil fallback logic
- **eligibilityLabels.js**: Human-readable criterion labels ("Farmer / Agriculture profile" instead of "farmer=true")
- **data.js**: API client functions, localStorage helpers, deep link utilities

**Search Algorithm**:
1. Normalize query (remove spaces, lowercase)
2. Match against name, keywords, Tamil aliases
3. Rank by: exact match > word start > substring
4. Return deterministic ordered results

#### 5. Shared UI Components
**Files**: `components.jsx`, `SchemeDetailModal.jsx`, `MissingInfoModal.jsx`, `ErrorBoundary.jsx`

**Purpose**: Reusable UI building blocks.

**Key Components**:
- **SchemeCard** - Displays scheme with benefits/documents preview, favorites, compare
- **SchemeDetailModal** - Full scheme details with "Why This Matched" explanation
- **MissingInfoModal** - Shows which profile fields are needed and why
- **GlassCard, GlassPanel** - Glassmorphic container components
- **ErrorBoundary** - Catches React errors, shows user-friendly message

#### 6. Print & Share
**Files**: `PrintContext.jsx`, `SchemePrintView.jsx`

**Purpose**: Print-optimized scheme summaries with government watermark.

**Features**:
- Single-scheme printing with light theme
- Benefits and document checklist
- TN emblem watermark
- Clean print styling (no navigation/buttons)

#### 7. Backend Engine
**Files**: `main.py`, `engine.py`, `schemes.json`

**Purpose**: Eligibility evaluation and API endpoints.

**API Endpoints**:
- `POST /analyze` - Evaluate profile against all schemes
- `GET /schemes/:id` - Fetch single scheme
- `POST /contact` - Send contact form email
- `GET /health` - Health check

**Engine Logic** (`engine.py`):
1. Load schemes.json (52 schemes with structured criteria)
2. For each scheme, evaluate every eligibility rule against profile
3. Categorize as: ELIGIBLE / NEEDS_MORE_INFO / INELIGIBLE
4. Return matched/missing/failed criteria for transparency

**Key Engines**:
- **NEEDS** (New Entrepreneur Development Scheme) - checks entrepreneur criteria
- **UYEGP** (MSME subsidy) - checks MSME-specific criteria
- **TWEES** (Women entrepreneurship) - checks gender + entrepreneur criteria

#### 8. Testing
**Files**: `*.test.js` (5 test files, 152 tests)

**Coverage**:
- `eligibilityLabels.test.js` - Label translations
- `profileCompletion.test.js` - Completion scoring logic
- `profileNormalization.test.js` - Schema migrations
- `schemeLocalization.test.js` - Tamil translations
- `searchNavigation.test.js` - Search state management
- `app.test.js` - Integration tests

---

## 📖 Files You Should Study (15 Essential Files)

To understand the complete system, study these files in order:

### Backend (3 files)
1. **`backend/schemes.json`** - The scheme database structure
2. **`backend/engine.py`** - Eligibility evaluation logic
3. **`backend/main.py`** - API endpoints

### Frontend Core (5 files)
4. **`frontend/src/App.jsx`** - Application shell and routing
5. **`frontend/src/main.jsx`** - React entry point
6. **`frontend/src/sections.jsx`** - Dashboard and major sections
7. **`frontend/src/components.jsx`** - Reusable UI components
8. **`frontend/src/data.js`** - API client and utilities

### Profile System (3 files)
9. **`frontend/src/profileSchema.js`** - Profile field definitions
10. **`frontend/src/profileNormalization.js`** - Schema migration logic
11. **`frontend/src/ProfileForm.jsx`** - Dynamic form rendering

### Scheme System (3 files)
12. **`frontend/src/schemeSearch.js`** - Search algorithm
13. **`frontend/src/schemeLocalization.js`** - Tamil localization
14. **`frontend/src/SchemeDetailModal.jsx`** - Scheme display

### Critical UX (1 file)
15. **`frontend/src/MissingInfoModal.jsx`** - Missing information UI

**Optional Deep Dives**:
- `AllSchemes.jsx` - Browse interface
- `ProfileSetup.jsx` - Wizard flow
- `SchemePrintView.jsx` - Print implementation
- Test files - Expected behavior examples

---

## 🚀 Local Setup

### Prerequisites
- **Node.js** 18+ and npm (for frontend)
- **Python** 3.9+ (for backend)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env
# Edit .env with your Resend API key (for contact form)

# Run server
uvicorn main:app --reload
```

Backend will run at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### Environment Variables

Backend requires Resend API configuration for the contact form. See `backend/.env.example` for required variables:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_ADMIN_EMAIL=your_email@example.com
CONTACT_FROM_EMAIL=onboarding@resend.dev
FRONTEND_URL=http://localhost:5173
```

**Important**: Sign up at [Resend](https://resend.com) for a free API key (100 emails/day). Render Free tier blocks SMTP ports, so HTTP-based email APIs like Resend are required for production.

---

## 🧪 Testing

```bash
cd frontend
npm test              # Run tests in watch mode
npm test -- --run     # Run tests once
```

**Test Coverage**:
- 6 test files
- 152 total tests
- Covers: eligibility labels, profile completion, profile normalization, scheme localization, search navigation, integration tests

---

## 📦 Production Build

### Frontend Build

```bash
cd frontend
npm run build
```

Generates optimized production build in `frontend/dist/` directory (~450KB gzipped).

### Backend Deployment

For production deployment, use Gunicorn with Uvicorn worker:

```bash
pip install gunicorn
gunicorn -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:8000 main:app
```

---

## 🔐 Security Notes

- **Never commit `.env` files** - use `.env.example` as template
- **Password hashing** - bcrypt with salt rounds (client-side in demo)
- **API keys** - store Resend API key in environment variables only
- **CORS** - production configured with FRONTEND_URL environment variable
- **LocalStorage** - Sensitive data stays client-side only

---

## 📱 Browser Support

- ✅ Chrome/Edge (full feature support)
- ✅ Firefox (all features)
- ✅ Safari (all features)
- ✅ Mobile browsers (responsive design)

---

## 🌐 Deployment

**Current Production Stack**:
- **Frontend**: Vercel (https://scheme-ease.vercel.app)
- **Backend**: Render Free tier (https://schemease-backend.onrender.com)
- **Email**: Resend HTTP API (SMTP ports blocked on Render Free)

**Deployment Configuration**:

**Frontend (Vercel)**:
- Root Directory: `frontend`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_BASE_URL=https://schemease-backend.onrender.com`

**Backend (Render)**:
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment Variables: `RESEND_API_KEY`, `CONTACT_ADMIN_EMAIL`, `FRONTEND_URL`

**Critical Configuration**:
1. SPA routing via `vercel.json` (handles `/schemes/:id` deep links)
2. CORS configured via `FRONTEND_URL` environment variable
3. Contact form requires Resend API key
4. Test deep links and contact form after deployment

---

## 🎓 Project Highlights for Review/Viva

1. **Cross-Category Matching**: Unlike most finders that match by occupation alone, evaluates all dimensions simultaneously (a disabled farmer qualifies for agriculture + disability + social schemes)
2. **Deterministic Engine**: All eligibility decisions traceable to specific criteria in schemes.json - no black-box AI
3. **Profile Normalization**: Handles schema evolution without user data loss (Student model changed from binary to multi-level education)
4. **Bilingual by Design**: Tamil integrated from database to UI, not a bolt-on translation layer
5. **Search Persistence**: URL-based state (`?q=`) enables shareable, refresh-persistent search results
6. **Application Tracking**: Realistic branching model (Approved OR Rejected, not sequential states)
7. **Test Coverage**: 152 tests covering core business logic, migrations, and integrations
8. **No Database Required**: Entire user state in LocalStorage - zero backend persistence complexity

---

## 📊 Project Statistics

- **52 government schemes** across 16 categories
- **152 automated tests** (all passing)
- **100% Tamil localization** (schemes + UI)
- **29 source files** organized into 8 logical modules
- **~450KB production build** (gzipped)
- **Zero backend database** (LocalStorage + stateless API)
- **3 eligibility engines**: General matching, NEEDS, UYEGP/TWEES

---

## 📂 Repository Structure

```
SchemEase_2.0/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Application shell
│   │   ├── main.jsx                 # React entry
│   │   ├── index.css                # Global styles
│   │   ├── sections.jsx             # Dashboard & sections
│   │   ├── AllSchemes.jsx           # Browse all schemes
│   │   ├── Auth.jsx                 # Login/signup
│   │   ├── ProfileSetup.jsx         # Profile wizard
│   │   ├── ProfilePage.jsx          # Profile view
│   │   ├── ProfileForm.jsx          # Dynamic form
│   │   ├── profileSchema.js         # Field definitions
│   │   ├── profileNormalization.js  # Schema migration
│   │   ├── profileCompletion.js     # Completion scoring
│   │   ├── SchemeDetailModal.jsx    # Scheme details
│   │   ├── SchemePublicView.jsx     # Public view
│   │   ├── SchemePrintView.jsx      # Print view
│   │   ├── MissingInfoModal.jsx     # Missing info UI
│   │   ├── ErrorBoundary.jsx        # Error handling
│   │   ├── PrintContext.jsx         # Print theme
│   │   ├── components.jsx           # Reusable UI
│   │   ├── data.js                  # API client
│   │   ├── schemeSearch.js          # Search algorithm
│   │   ├── schemeLocalization.js    # Tamil translations
│   │   ├── eligibilityLabels.js     # Criteria labels
│   │   └── *.test.js                # 6 test files (152 tests)
│   ├── public/
│   │   ├── ribbon-building.jpg      # Hero image
│   │   ├── tn-emblem-watermark.png  # Watermark
│   │   └── _redirects               # SPA routing
│   ├── package.json
│   ├── vite.config.js               # Vite + Vitest config
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── main.py                      # FastAPI app
│   ├── engine.py                    # Eligibility engine
│   ├── schemes.json                 # 52 schemes database
│   ├── requirements.txt
│   └── .env.example                 # Environment template
│
├── README.md                        # This file
└── .gitignore
```

---

## 🤝 Contributing

This is a college project built for demonstration purposes. If you'd like to extend it:

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

---

## 📄 License

Educational project - free to use for learning and reference.

---

## 👤 Author

Built as a college project to demonstrate full-stack development skills, government data modeling, and citizen-focused UX design.

---

## 📞 Support

For questions or issues:
1. Review the "Core Architecture" section above
2. Check the "Files You Should Study" list
3. Review test files for expected behavior
4. Use the Contact form in the application (requires SMTP setup)

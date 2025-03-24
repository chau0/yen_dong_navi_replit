# 🎯 PRD: JPY→VND Exchange Timing App – Frontend (React)

**Goal:**  
Create a visually striking, intuitive, and highly interactive frontend that clearly communicates whether "Now" is a good time to exchange Japanese Yen (JPY) to Vietnamese Dong (VND), attracting and retaining users through outstanding UX/UI.

---

## 🧩 Tech Stack & Tools
- **Framework:** React.js (Vite or Next.js)
- **Styling:** Tailwind CSS with TailwindUI or Shadcn/ui components
- **Animations:** Framer Motion (smooth transitions, loading states)
- **Charting:** Recharts (interactive charts)
- **Icons:** Lucide Icons or Heroicons
- **State Management:** Zustand or Redux Toolkit (optional for simplicity)
- **Data fetching:** Axios or TanStack Query (React Query)

---

## 🌟 UX/UI Objectives
- **Visual Appeal:** Clear, modern, and minimalist aesthetics.
- **Ease of Use:** Simple navigation, immediate clarity.
- **Interactivity:** Engaging visual cues (animations, subtle interactions).
- **Mobile-first:** Fully responsive for seamless use on mobile devices.

---

## 📦 Frontend Structure (React)
```
/src
├── components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ExchangeRateCard.jsx
│   ├── TrendChart.jsx
│   ├── ForecastChart.jsx
│   ├── SuggestionIndicator.jsx
│   ├── AlertForm.jsx
│   └── UserPoll.jsx
├── pages
│   ├── Home.jsx
│   ├── Alerts.jsx
│   └── ForecastDetails.jsx
├── hooks
│   ├── useExchangeRate.js
│   └── useForecast.js
├── api
│   └── apiClient.js
└── App.jsx
```

## 🎨 Pages & Components

### 1. Homepage (`Home.jsx`)

#### Components included:
- **Header.jsx**
  - Logo and app title (animated fade-in)
  - Simple navigation (Home, Alerts, Forecast Details)
- **ExchangeRateCard.jsx**
  - Large, dynamic display of current rate
  - Animated updates (pulse or highlight briefly upon data change)
- **SuggestionIndicator.jsx**
  - Visual indicator with colored badges:
    - 🟢 Good (rising animation)
    - 🟡 Neutral (pulse animation)
    - 🔴 Bad (shake or fade animation)
  - Short explanation on hover/click
- **TrendChart.jsx**
  - Interactive line chart (last 30 days)
  - Responsive, hoverable for detailed daily rate view
  - Tooltips showing date & rate clearly
- **ForecastChart.jsx**
  - Future predictions (7 days)
  - Confidence intervals (shaded bands)
  - Tooltip clearly stating this is a forecast (hover interaction)
- **AlertForm.jsx** (floating button opens modal)
  - Allow users to set target rate
  - Animated transition on open/close
- **UserPoll.jsx**
  - "Do you think now is a good time?" interactive poll
  - Display current poll results (% of yes/no)

---

### 2. Alerts Page (`Alerts.jsx`)
- Simple, elegant form to set/manage alerts.
- Display existing alerts (animated entry/fade-in).
- Notification preference toggles (email, push notifications - placeholder initially).

---

### 3. Forecast Details (`ForecastDetails.jsx`)
- Detailed forecast visualization.
- Explain ML predictions with clear language.
- Charts with interactive hover effects for explanations.

---

## ⚙️ Data Fetching (Frontend API Calls)
Use Axios or React Query for async data fetching:

```javascript
// apiClient.js example
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.yourdomain.com',
});

export const fetchCurrentRate = async () => {
  const { data } = await apiClient.get('/api/rate/current');
  return data;
};
```

## 🎞️ UI/UX Enhancements
- Animated Page Transitions
- Real-time Data Updates
- Charts Interaction
- Alerts & Notifications

## 📱 Responsiveness & Accessibility
- Mobile-first responsive layout
- Accessible design
- Fluid layout

## 💡 Additional Features
- Dark/Light Mode Toggle
- User-customizable Dashboard
- Gamification elements
- Social Proof display

## 🚀 Milestone Deliverables
### MVP (Phase 1):
- Homepage with live rates
- Basic animations
- Core functionality

### Phase 2:
- Alerts system
- Poll feature
- Mobile optimization

### Phase 3 (Optional):
- Detailed forecasts
- Advanced features

## 🛠️ Recommended Dependencies
- Tailwind CSS
- Framer Motion
- Axios/React Query
- Recharts
- Zustand/Redux Toolkit

## ✅ Acceptance Criteria
- Visually attractive homepage
- Interactive UI/UX
- Mobile-responsive design
- Consistent data handling

## 📌 Notes
- Focus on UX & visual polish
- Use mock APIs initially

## ✨ Success Criteria
Users should instantly understand when to exchange currency, appreciate the clarity, and feel engaged by the interactive and appealing interface.

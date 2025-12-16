import React, { useState, useEffect, useCallback } from 'react';

// --- Environment Variables (MANDATORY FOR FIREBASE READY APPS) ---
// Note: These are placeholders provided by the execution environment. 
// Replace with actual values/logic in a real GitHub deployment.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- Mock Data & Icons ---
// Custom SVG Icon component (as external libraries like lucide-react are not supported in single-file mode)
const Icon = ({ name, className = 'w-6 h-6' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {name === 'Gauge' && <path d="M12 19.5c-.773 0-1.5-.04-2.22-.11C6.918 19.165 4 17.062 4 13.5 4 8.272 7.582 4 12 4s8 4.272 8 9.5c0 3.562-2.918 5.665-5.78 5.89-1.3.1-2.6.11-3.22.11zM12 14V8M15 15l-3-3" />}
    {name === 'Bell' && <path d="M18.8 1.8A.6.6 0 0 1 19 2v.2a.6.6 0 0 0 .2.2c.2.2.2.6 0 .8l-2 2a.6.6 0 0 1-.8 0l-1.2-1.2a.6.6 0 0 0-.8 0l-2 2a.6.6 0 0 1-.8 0l-1.2-1.2a.6.6 0 0 0-.8 0l-2 2a.6.6 0 0 1-.8 0l-1.2-1.2a.6.6 0 0 0-.8 0l-2 2a.6.6 0 0 1-.8 0l-2-2a.6.6 0 0 0-.8 0L3 5.2a.6.6 0 1 1-.8-.8l2-2a.6.6 0 0 1 .8 0L6.2 3a.6.6 0 0 0 .8 0l2-2a.6.6 0 0 1 .8 0l1.2 1.2a.6.6 0 0 0 .8 0l2-2a.6.6 0 0 1 .8 0l1.2 1.2a.6.6 0 0 0 .8 0l2-2a.6.6 0 0 1 .8 0z" />}
    {name === 'Calendar' && (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </>
    )}
    {name === 'Factory' && <path d="M2 20h20v-2H2v2zm5.5-12h9v10h-9V8zm0-4h9v2h-9V4zM2 8h3v10H2V8zm17 0h3v10h-3V8z" />}
    {name === 'MessageSquare' && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
    {name === 'CheckCircle' && (
      <>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </>
    )}
    {name === 'Wrench' && <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-3.37 3.37a1.06 1.06 0 0 1-1.4 0l-2-2a1.06 1.06 0 0 1 0-1.4l3.37-3.37a6 6 0 0 1 7.94-7.94l-3.77 3.77Z"/>}
    {name === 'Activity' && <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>}
    {name === 'Users' && (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </>
    )}
    {name === 'Target' && (
      <>
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </>
    )}
    {name === 'Car' && (
      // Simple car profile view SVG
      <>
        <path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"/>
        <circle cx="7.5" cy="15.5" r="1.5"/>
        <circle cx="16.5" cy="15.5" r="1.5"/>
        <path d="M5 9h14v2H5z"/>
      </>
    )}
  </svg>
);

const MOCK_VEHICLE_DATA = {
  make: 'Hero',
  model: 'Optima-E',
  vin: 'VIN-5829-EPR',
  healthScore: 88,
  breakdownRisk: 'Low (4%)',
  nextServiceMiles: 1500,
  mileage: 18450,
  alerts: [
    { component: 'Brake Pad Wear (Front)', severity: 'High', details: 'Predicted failure in ~45 days (85% confidence)', icon: 'Bell' },
    { component: 'Battery Cell Imbalance', severity: 'Medium', details: 'Minor voltage fluctuation detected in Cell 5', icon: 'Activity' },
  ],
};

const MOCK_MANUFACTURING_DATA = [
  { part: 'Brake Pad Assembly', rca: 'Vendor material inconsistency (Batch 4)', capa: 'Switched to Vendor B + mandatory quarterly sample tests', failure_rate_reduction: '15%' },
  { part: 'Headlight LED Driver', rca: 'Overheating due to compact housing', capa: 'Redesigned heat sink and added thermal throttle logic', failure_rate_reduction: '22%' },
];


// --- Helper Components ---

/** Card component for displaying key metrics with animation. */
const MetricCard = ({ title, value, unit, colorClass, iconName }) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 transition duration-300 hover:shadow-2xl hover:scale-[1.03] transform">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
      <Icon name={iconName} className={`w-6 h-6 ${colorClass}`} />
    </div>
    <p className="mt-2 text-4xl font-extrabold text-white leading-none">
      {value}
      <span className="text-xl font-medium text-gray-400 ml-1">{unit}</span>
    </p>
  </div>
);

/** Navigation Link with animation. */
const NavItem = ({ view, currentView, setView, iconName }) => (
  <button
    onClick={() => setView(view)}
    className={`flex items-center space-x-3 p-3 rounded-xl transition duration-300 w-full text-left font-medium
      ${currentView === view
        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/50'
        : 'text-gray-300 hover:bg-gray-700 hover:text-violet-400 hover:translate-x-1'
      } transform ease-out`}
  >
    <Icon name={iconName} className="w-5 h-5" />
    <span>{view}</span>
  </button>
);

/** Wrapper for view content to apply a fade-in animation on navigation. */
const AnimatedView = ({ children, viewKey }) => (
  // Use key prop to force re-mounting and trigger the CSS animation
  <div key={viewKey} className="animate-fade-slide-in">
    {children}
  </div>
);


// --- Main Views (Slide 9 Content) ---

/** 1. Vehicle Health Dashboard */
const DashboardView = () => (
  <div className="space-y-8 p-4 md:p-8">
    <h1 className="text-3xl font-bold text-white animate-slide-in-down">Vehicle Health Dashboard</h1>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <MetricCard
        title="Predictive Health Score"
        value={MOCK_VEHICLE_DATA.healthScore}
        unit="%"
        colorClass="text-green-400"
        iconName="Target"
      />
      <MetricCard
        title="Breakdown Risk (30-day)"
        value={MOCK_VEHICLE_DATA.breakdownRisk.split(' ')[0]}
        unit={MOCK_VEHICLE_DATA.breakdownRisk.split(' ')[1]}
        colorClass="text-yellow-400"
        iconName="Activity"
      />
      <MetricCard
        title="Next Service Due"
        value={MOCK_VEHICLE_DATA.nextServiceMiles}
        unit="miles"
        colorClass="text-blue-400"
        iconName="Calendar"
      />
      <MetricCard
        title="Total Mileage"
        value={MOCK_VEHICLE_DATA.mileage.toLocaleString()}
        unit="mi"
        colorClass="text-gray-400"
        iconName="Gauge"
      />
    </div>

    <h2 className="text-2xl font-semibold text-gray-300 pt-4">Vehicle Details</h2>
    <div className="bg-gray-800 p-6 rounded-xl shadow border border-gray-700 hover:shadow-md transition duration-200 text-gray-300">
      <p><strong>Make:</strong> {MOCK_VEHICLE_DATA.make}</p>
      <p><strong>Model:</strong> {MOCK_VEHICLE_DATA.model}</p>
      <p><strong>VIN:</strong> {MOCK_VEHICLE_DATA.vin}</p>
    </div>
  </div>
);

/** 2. Alert & Recommendation Screen */
const AlertRecommendationView = ({ setView }) => (
  <div className="space-y-8 p-4 md:p-8">
    <h1 className="text-3xl font-bold text-white animate-slide-in-down">Predictive Alerts & Service Recommendation</h1>

    {/* Custom Pulse Animation for Critical Alert */}
    <div className="bg-red-900/40 border-l-4 border-red-500 p-6 rounded-lg shadow-md animate-alert-pulse">
      <div className="flex items-center space-x-3">
        <Icon name="Bell" className="w-8 h-8 text-red-500 animate-shake" />
        <h2 className="text-xl font-bold text-red-400">CRITICAL PREDICTIVE ALERT</h2>
      </div>
      <p className="mt-3 text-red-300">
        The **AI Diagnosis Worker Agent** has detected a high risk of failure for **{MOCK_VEHICLE_DATA.alerts[0].component}** within the next 45 days.
        This is based on continuous sensor data analysis (RPM variance, temperature spikes).
      </p>
    </div>

    {/* Service Recommendation */}
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-violet-700 space-y-4 hover:shadow-xl transition duration-300">
      <div className="flex items-center space-x-3">
        <Icon name="Wrench" className="w-7 h-7 text-violet-400" />
        <h2 className="text-2xl font-semibold text-violet-400">AI-Generated Service Recommendation</h2>
      </div>
      <p className="text-gray-300">
        To proactively prevent a breakdown and ensure safety, the **Master Agent** recommends scheduling a 'Brake System Inspection and Replacement' service immediately.
      </p>
      <ul className="list-disc pl-5 text-gray-400 space-y-1">
        <li>**Recommended Service Center:** 'Pro-Auto Service Center' (Nearest and authorized for {MOCK_VEHICLE_DATA.make}).</li>
        <li>**Estimated Time:** 1.5 hours.</li>
        <li>**Cost Estimate:** ₹4,500 - ₹5,500.</li>
      </ul>
      <button
        onClick={() => setView('Scheduling')}
        className="mt-6 w-full md:w-auto bg-violet-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-violet-700 transition duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
      >
        <Icon name="Calendar" className="w-5 h-5 inline mr-2" />
        Book Recommended Service Now
      </button>
    </div>
  </div>
);

/** 3. Scheduling Screen */
const SchedulingView = () => {
  const [selectedDate, setSelectedDate] = useState('2025-12-28');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [isScheduled, setIsScheduled] = useState(false);

  const availableSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'];

  const handleBook = () => {
    // Simulate Service Scheduler API call
    setTimeout(() => {
      setIsScheduled(true);
    }, 500);
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white animate-slide-in-down">Proactive Service Scheduling</h1>

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        {isScheduled ? (
          <div className="text-center py-10 animate-fade-slide-in">
            <Icon name="CheckCircle" className="w-20 h-20 text-green-500 mx-auto animate-bounce-once" />
            <h2 className="text-3xl font-bold mt-4 text-green-400">Booking Confirmed!</h2>
            <p className="mt-2 text-lg text-gray-300">
              Your service is booked for **{selectedDate}** at **{selectedSlot}**.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              The **Engagement Agent** will send an SMS reminder 24 hours prior.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-300">1. Select Date & Time</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div className="space-y-3">
                <label htmlFor="date" className="block text-sm font-medium text-gray-400">
                  Preferred Date (Recommending next 7 days)
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-violet-500 focus:border-violet-500 transition duration-150"
                />
              </div>

              {/* Slot Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-400">
                  Available Slots (Service Center Capacity Optimized)
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-full text-sm font-medium transition duration-200 transform
                        ${selectedSlot === slot
                          ? 'bg-violet-600 text-white shadow-lg hover:scale-105'
                          : 'bg-gray-700 text-gray-300 hover:bg-violet-800 hover:text-white'
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-300 pt-4">2. Confirm Details</h2>
            <p className="text-lg font-medium text-gray-300">
              Service: Brake System Proactive Maintenance ({MOCK_VEHICLE_DATA.alerts[0].component})
            </p>

            <button
              onClick={handleBook}
              disabled={!selectedDate || !selectedSlot}
              className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Booking for {selectedSlot} on {selectedDate}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/** 4. Manufacturing Insights Summary */
const ManufacturingInsightsView = () => (
  <div className="space-y-8 p-4 md:p-8">
    <h1 className="text-3xl font-bold text-white animate-slide-in-down">Manufacturing Feedback Loop Insights</h1>
    <p className="text-gray-400">
      The **Manufacturing Insights Worker Agent** aggregates RCA/CAPA data from service tickets
      to provide actionable intelligence to the production line, closing the feedback loop.
    </p>

    <div className="bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Failed Component
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Root Cause Analysis (RCA)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Corrective Action Plan (CAPA)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Failure Rate Reduction
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {MOCK_MANUFACTURING_DATA.map((item, index) => (
            <tr key={index} className="hover:bg-gray-700 transition duration-150">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                {item.part}
              </td>
              <td className="px-6 py-4 text-sm text-gray-400 max-w-xs">{item.rca}</td>
              <td className="px-6 py-4 text-sm text-gray-400 max-w-xs">{item.capa}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                {item.failure_rate_reduction}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="flex justify-start">
        <div className="bg-violet-900/40 border-l-4 border-violet-500 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="flex items-center space-x-2">
                <Icon name="Users" className="w-5 h-5 text-violet-400" />
                <p className="text-sm font-medium text-violet-300">
                    **UEBA Insight:** Monitoring shows no abnormal data extraction patterns by the Manufacturing Insights Agent.
                </p>
            </div>
        </div>
    </div>
  </div>
);

/** Main Application Component */
const App = () => {
  const [currentView, setCurrentView] = useState('Dashboard');

  // Placeholder for Firebase/Auth Initialization (MANDATORY STRUCTURE)
  useEffect(() => {
    const mockAuthCheck = async () => {
      // Mocking successful auth state
      console.log(`App ID: ${appId} - Auth Ready.`);
    };

    mockAuthCheck();
  }, []);

  // Render the current view based on state
  const renderView = useCallback(() => {
    switch (currentView) {
      case 'Dashboard':
        return <DashboardView />;
      case 'Alerts & Recommendations':
        return <AlertRecommendationView setView={setCurrentView} />;
      case 'Scheduling':
        return <SchedulingView />;
      case 'Manufacturing Insights':
        return <ManufacturingInsightsView />;
      default:
        return <DashboardView />;
    }
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans antialiased">
      {/* Tailwind CSS Script (MANDATORY) - Not needed in a real React project using a build step */}
      <script src="https://cdn.tailwindcss.com"></script>

      {/* Custom CSS for Animations (Needed for "crazy good" effects) */}
      <style>
        {`
        /* Critical Alert Pulse */
        @keyframes alert-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } /* Red-500 */
          50% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
        }
        .animate-alert-pulse {
          animation: alert-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* View Content Fade/Slide In */
        @keyframes fade-slide-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide-in {
          animation: fade-slide-in 0.5s ease-out forwards;
        }

        /* Title Slide Down */
        @keyframes slide-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-down {
            animation: slide-in-down 0.4s ease-out forwards;
        }
        
        /* Bounce once for confirmation checkmark */
        @keyframes bounce-once {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-30px);
            }
            60% {
                transform: translateY(-15px);
            }
        }
        .animate-bounce-once {
            animation: bounce-once 1s ease-in-out 1;
        }
        
        /* Subtle Shake for Bell icon */
        @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            10%, 30%, 50%, 70%, 90% { transform: rotate(5deg); }
            20%, 40%, 60%, 80% { transform: rotate(-5deg); }
        }
        .animate-shake {
            animation: shake 0.5s ease-in-out infinite;
        }
        `}
      </style>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {/* Sidebar Navigation (Always Visible) */}
        <aside className="w-full md:w-64 p-4 md:p-0 md:pr-6 md:sticky top-6 self-start">
          <div className="bg-gray-800 p-6 rounded-xl shadow-2xl shadow-violet-900/50 space-y-2">
            <h2 className="text-xl font-bold text-violet-400 mb-4 animate-slide-in-down flex items-center space-x-2">
                <Icon name="Car" className="w-6 h-6 text-violet-500 animate-pulse" />
                <span>AutoAI Platform</span>
            </h2>
            <NavItem
              view="Dashboard"
              currentView={currentView}
              setView={setCurrentView}
              iconName="Gauge"
            />
            <NavItem
              view="Alerts & Recommendations"
              currentView={currentView}
              setView={setCurrentView}
              iconName="Bell"
            />
            <NavItem
              view="Scheduling"
              currentView={currentView}
              setView={setCurrentView}
              iconName="Calendar"
            />
            <NavItem
              view="Manufacturing Insights"
              currentView={currentView}
              setView={setCurrentView}
              iconName="Factory"
            />

            <div className="pt-4 border-t border-gray-700 mt-4 text-xs text-gray-500">
                <p>App ID: {appId}</p>
                <p>Status: Prototype Mode</p>
            </div>
          </div>
        </aside>

        {/* Content Area - Wrapped for View Transitions */}
        <main className="flex-1 bg-gray-800 md:ml-4 rounded-xl shadow-2xl shadow-violet-900/50">
          <AnimatedView viewKey={currentView}>
            {renderView()}
          </AnimatedView>
        </main>
      </div>
    </div>
  );
};

export default App;

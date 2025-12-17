import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Car, AlertTriangle, Calendar, Wrench, TrendingUp, 
  Activity, CheckCircle, Phone, MapPin, Settings, Bell, BarChart3,
  Clock, Users, ThumbsUp, Shield, Zap, Factory
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

// API Functions
const api = {
  getVehicleHealth: async (vehicleId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicle/${vehicleId}/health`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  sendMessage: async (message, vehicleId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, vehicleId }),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  scheduleService: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/service/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getManufacturingInsights: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/manufacturing/insights`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  }
};

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Vehicle Health', icon: Car },
    { id: 'alerts', label: 'Predictive Alerts', icon: AlertTriangle },
    { id: 'scheduling', label: 'Service Scheduling', icon: Calendar },
    { id: 'voice', label: 'Voice Assistant', icon: Phone },
    { id: 'manufacturing', label: 'Manufacturing Insights', icon: Factory },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AutoServe AI
            </h1>
            <p className="text-xs text-gray-500">Predictive Maintenance</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Shield className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">UEBA Security</p>
              <p className="text-sm font-medium text-white">Active</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            All agent activities monitored
          </div>
        </div>
      </div>
    </div>
  );
};

// Vehicle Health Dashboard
const VehicleDashboard = () => {
  const [vehicleData, setVehicleData] = useState({
    id: 'HERO-2024-001',
    model: 'Hero Splendor Plus',
    health: 78,
    mileage: 12450,
    lastService: '45 days ago',
    predictedFailure: 'Medium Risk'
  });

  const healthMetrics = [
    { label: 'Engine Health', value: 85, status: 'good', icon: Wrench },
    { label: 'Brake System', value: 65, status: 'warning', icon: AlertTriangle },
    { label: 'Transmission', value: 90, status: 'good', icon: Activity },
    { label: 'Electrical', value: 72, status: 'warning', icon: Zap },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Vehicle Info Card */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{vehicleData.model}</h2>
            <p className="text-blue-100 mb-1">VIN: {vehicleData.id}</p>
            <p className="text-sm text-blue-100">Odometer: {vehicleData.mileage.toLocaleString()} km</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-2">
              <div className="text-3xl font-bold">{vehicleData.health}%</div>
            </div>
            <p className="text-sm text-blue-100">Overall Health</p>
          </div>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {healthMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const statusColor = metric.status === 'good' ? 'text-green-500' : 'text-yellow-500';
          return (
            <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-blue-500 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <Icon className={`w-5 h-5 ${statusColor}`} />
                  </div>
                  <span className="font-medium text-white">{metric.label}</span>
                </div>
                <span className={`text-2xl font-bold ${statusColor}`}>{metric.value}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${metric.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${metric.value}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Telemetry */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <span>Real-Time Telemetry Data</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Engine Temp', value: '89°C', normal: true },
            { label: 'Oil Pressure', value: '42 PSI', normal: true },
            { label: 'Battery', value: '12.4V', normal: false },
            { label: 'Fuel Level', value: '65%', normal: true },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <p className="text-sm text-gray-400 mb-1">{item.label}</p>
              <p className={`text-xl font-bold ${item.normal ? 'text-green-400' : 'text-yellow-400'}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Predictive Alerts
const PredictiveAlerts = () => {
  const alerts = [
    {
      id: 1,
      severity: 'high',
      component: 'Brake Pads',
      prediction: 'Replacement needed in ~250 km',
      confidence: 94,
      recommendation: 'Schedule service within 7 days',
      icon: AlertTriangle
    },
    {
      id: 2,
      severity: 'medium',
      component: 'Battery',
      prediction: 'Degradation detected, 30 days remaining',
      confidence: 87,
      recommendation: 'Monitor and replace soon',
      icon: Zap
    },
    {
      id: 3,
      severity: 'low',
      component: 'Air Filter',
      prediction: 'Cleaning recommended',
      confidence: 76,
      recommendation: 'Next scheduled service',
      icon: Activity
    },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-2">Predictive Maintenance Alerts</h3>
        <p className="text-sm text-gray-400 mb-4">AI-powered predictions based on vehicle telemetry and historical data</p>
        
        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            const severityColors = {
              high: 'border-red-500 bg-red-500/10',
              medium: 'border-yellow-500 bg-yellow-500/10',
              low: 'border-blue-500 bg-blue-500/10'
            };
            const severityText = {
              high: 'text-red-400',
              medium: 'text-yellow-400',
              low: 'text-blue-400'
            };
            
            return (
              <div key={alert.id} className={`border-l-4 ${severityColors[alert.severity]} p-4 rounded-r-lg`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon className={`w-6 h-6 ${severityText[alert.severity]} mt-1`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{alert.component}</h4>
                      <p className="text-sm text-gray-300 mb-2">{alert.prediction}</p>
                      <p className="text-xs text-gray-400 mb-2">
                        <span className="font-medium">Recommendation:</span> {alert.recommendation}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Confidence:</span>
                        <div className="flex-1 max-w-xs bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${alert.severity === 'high' ? 'bg-red-500' : alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                            style={{ width: `${alert.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-white">{alert.confidence}%</span>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Schedule Service
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prediction Model Info */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">AI Prediction Model</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Model Type</p>
            <p className="text-white font-medium">LSTM + Random Forest</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Accuracy</p>
            <p className="text-green-400 font-medium">94.3%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Data Points Analyzed</p>
            <p className="text-white font-medium">2.4M+</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Last Updated</p>
            <p className="text-white font-medium">2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Service Scheduling
const ServiceScheduling = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [serviceCenter, setServiceCenter] = useState('');

  const availableSlots = [
    '09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '04:00 PM'
  ];

  const serviceCenters = [
    { id: 1, name: 'Hero Service Center - MG Road', distance: '2.3 km', capacity: 'Available' },
    { id: 2, name: 'Hero Service Center - Koramangala', distance: '4.1 km', capacity: 'Limited' },
    { id: 3, name: 'Hero Service Center - Indiranagar', distance: '5.8 km', capacity: 'Available' },
  ];

  const handleSchedule = async () => {
    try {
      await api.scheduleService({
        vehicleId: 'HERO-2024-001',
        date: selectedDate,
        time: selectedTime,
        serviceCenter: serviceCenter
      });
      alert('Service scheduled successfully!');
    } catch (error) {
      alert('Error scheduling service');
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-blue-500" />
          <span>Schedule Proactive Service</span>
        </h3>

        <div className="space-y-6">
          {/* Service Center Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Select Service Center</label>
            <div className="space-y-3">
              {serviceCenters.map((center) => (
                <div 
                  key={center.id}
                  onClick={() => setServiceCenter(center.name)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    serviceCenter === center.name 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-white">{center.name}</h4>
                        <p className="text-sm text-gray-400">{center.distance} away</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      center.capacity === 'Available' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {center.capacity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Available Time Slots</label>
            <div className="grid grid-cols-3 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-3 rounded-lg font-medium transition-all ${
                    selectedTime === slot
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-900 border border-gray-700 text-gray-300 hover:border-blue-500'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime || !serviceCenter}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Confirm Booking</span>
          </button>
        </div>
      </div>

      {/* Service History */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Service History</h3>
        <div className="space-y-3">
          {[
            { date: '2024-11-15', type: 'Scheduled Maintenance', status: 'Completed' },
            { date: '2024-09-20', type: 'Brake Service', status: 'Completed' },
            { date: '2024-07-10', type: 'Oil Change', status: 'Completed' },
          ].map((service, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
              <div>
                <p className="font-medium text-white">{service.type}</p>
                <p className="text-sm text-gray-400">{service.date}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Voice Assistant Interface
const VoiceAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I noticed your vehicle needs brake pad replacement soon. Would you like me to help schedule a service?' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await api.sendMessage(input, 'HERO-2024-001');
      const assistantMessage = {
        role: 'assistant',
        content: response.message || 'I can help you schedule that service. When would be convenient for you?'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize for the technical issue. Please try again or contact customer support.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-100 border border-gray-700'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm text-gray-400">Processing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 border-t border-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => setIsListening(!isListening)}
            className={`p-4 rounded-full transition-all ${
              isListening 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Phone className="w-6 h-6 text-white" />
          </button>
          <span className="text-sm text-gray-400">
            {isListening ? 'Listening...' : 'Click to speak'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type or speak your query..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={handleSendMessage}
            disabled={isProcessing}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// Manufacturing Insights
const ManufacturingInsights = () => {
  const rcaData = [
    { component: 'Brake Pads', failures: 156, rootCause: 'Material degradation in high-temp environments', action: 'Update compound formula' },
    { component: 'Battery', failures: 89, rootCause: 'Inadequate thermal management', action: 'Redesign cooling system' },
    { component: 'Clutch Cable', failures: 67, rootCause: 'Premature wear due to friction', action: 'Improve cable coating' },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
          <Factory className="w-6 h-6 text-cyan-500" />
          <span>Manufacturing Feedback Loop</span>
        </h3>
        <p className="text-sm text-gray-400 mb-6">RCA & CAPA insights for quality improvement</p>

        <div className="space-y-4">
          {rcaData.map((item, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-700 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{item.component}</h4>
                  <p className="text-sm text-gray-400 mb-2">
                    <span className="font-medium text-red-400">{item.failures} failures</span> reported
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-400">
                  High Priority
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Root Cause Analysis:</p>
                  <p className="text-sm text-gray-300">{item.rootCause}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Corrective Action:</p>
                  <p className="text-sm text-cyan-400">{item.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Breakdown Reduction', value: '42%', icon: TrendingUp, color: 'text-green-400' },
          { label: 'Service Utilization', value: '68%', icon: Users, color: 'text-blue-400' },
          { label: 'Customer Satisfaction', value: '4.7/5', icon: ThumbsUp, color: 'text-yellow-400' },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center space-x-3 mb-2">
                <Icon className={`w-6 h-6 ${metric.color}`} />
                <span className="text-sm text-gray-400">{metric.label}</span>
              </div>
              <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Analytics Dashboard
const AnalyticsDashboard = () => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Vehicles', value: '2,456', icon: Car },
          { label: 'Alerts Generated', value: '342', icon: Bell },
          { label: 'Services Scheduled', value: '189', icon: Calendar },
          { label: 'Avg Response Time', value: '3.2 min', icon: Clock },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center space-x-2 mb-2">
                <Icon className="w-5 h-5 text-blue-400" />
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-500" />
          <span>System Performance Metrics</span>
        </h3>
        <div className="space-y-4">
          {[
            { metric: 'Prediction Accuracy', value: 94, color: 'bg-green-500' },
            { metric: 'Customer Engagement Rate', value: 76, color: 'bg-blue-500' },
            { metric: 'Service Completion Rate', value: 88, color: 'bg-cyan-500' },
            { metric: 'Manufacturing Feedback Integration', value: 92, color: 'bg-purple-500' },
          ].map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-300">{item.metric}</span>
                <span className="text-sm font-semibold text-white">{item.value}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Agent Activity Log</h3>
        <div className="space-y-3">
          {[
            { agent: 'Data Analysis Agent', action: 'Analyzed telemetry for VEH-001', time: '2 min ago', status: 'success' },
            { agent: 'Diagnosis Agent', action: 'Identified brake wear issue', time: '5 min ago', status: 'success' },
            { agent: 'Engagement Agent', action: 'Initiated voice call to customer', time: '8 min ago', status: 'processing' },
            { agent: 'Scheduling Agent', action: 'Booked service slot at MG Road', time: '12 min ago', status: 'success' },
            { agent: 'Feedback Agent', action: 'Collected post-service feedback', time: '1 hour ago', status: 'success' },
          ].map((log, idx) => (
            <div key={idx} className="flex items-start justify-between py-3 border-b border-gray-700 last:border-0">
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  log.status === 'success' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                }`}></div>
                <div>
                  <p className="font-medium text-white text-sm">{log.agent}</p>
                  <p className="text-xs text-gray-400">{log.action}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const PredictiveMaintenanceSystem = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {activeTab === 'dashboard' && 'Vehicle Health Dashboard'}
              {activeTab === 'alerts' && 'Predictive Maintenance Alerts'}
              {activeTab === 'scheduling' && 'Proactive Service Scheduling'}
              {activeTab === 'voice' && 'AI Voice Assistant'}
              {activeTab === 'manufacturing' && 'Manufacturing Insights & RCA'}
              {activeTab === 'analytics' && 'Analytics & Reports'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {activeTab === 'dashboard' && 'Real-time vehicle telemetry and health monitoring'}
              {activeTab === 'alerts' && 'AI-powered failure predictions with confidence scores'}
              {activeTab === 'scheduling' && 'Smart scheduling based on capacity and proximity'}
              {activeTab === 'voice' && 'Natural language service booking assistant'}
              {activeTab === 'manufacturing' && 'CAPA feedback loop for quality improvement'}
              {activeTab === 'analytics' && 'System performance and business metrics'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">EY Techathon 6.0</p>
              <p className="text-xs text-gray-500">Hero MotoCorp + M&M</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          {activeTab === 'dashboard' && <VehicleDashboard />}
          {activeTab === 'alerts' && <PredictiveAlerts />}
          {activeTab === 'scheduling' && <ServiceScheduling />}
          {activeTab === 'voice' && <VoiceAssistant />}
          {activeTab === 'manufacturing' && <ManufacturingInsights />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
        </main>
      </div>
    </div>
  );
};

export default PredictiveMaintenanceSystem

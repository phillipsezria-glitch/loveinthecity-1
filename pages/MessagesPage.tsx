import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import { StorageManager } from '../utils/localStorage';

// Issue type descriptions and styling
const ISSUE_CONFIG = {
  inquiry: { label: 'General Inquiry', color: 'blue', icon: '💬' },
  reserve: { label: 'Reserve a Profile', color: 'red', icon: '❤️' },
  support: { label: 'Support 24/7', color: 'green', icon: '📞' },
  vip: { label: 'VIP Upgrade & Billing', color: 'purple', icon: '👑' },
  password: { label: 'Login Password', color: 'orange', icon: '🔐' },
  verification: { label: 'Account Verification', color: 'yellow', icon: '✓' },
  report: { label: 'Report a User', color: 'red', icon: '⚠️' },
  videos: { label: 'Private Videos', color: 'pink', icon: '🎥' },
  pin: { label: 'Payment PIN', color: 'purple', icon: '🛡️' },
  funding: { label: 'Funding Details', color: 'orange', icon: '💰' },
  announcements: { label: 'Announcements', color: 'yellow', icon: '📢' }
};

export const MessagesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storage = StorageManager.getInstance();
  
  // Get user profile and URL parameters
  const userProfile = storage.getUserProfile();
  const queryParams = new URLSearchParams(location.search);
  const partnerId = queryParams.get('partnerId');
  const issueType = queryParams.get('issue') || 'inquiry';
  
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    issue: issueType,
    selectedProfile: partnerId || '',
    message: ''
  });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  // Debug log for prefilled data
  useEffect(() => {
    console.log('📨 MessagesPage Loaded - Initial Data:');
    console.log('   URL Params: { issue:', issueType, ', partnerId:', partnerId, '}');
    console.log('   User Profile:', userProfile);
    console.log('   MOCK_USERS find result:', MOCK_USERS.find(u => u.id === partnerId));
  }, []);
  
  // Prefill form when URL params or user profile change
  useEffect(() => {
    console.log('🔄 Prefill Effect Triggered:');
    console.log('   issueType:', issueType);
    console.log('   partnerId:', partnerId);
    console.log('   userProfile:', userProfile);
    
    const newFormData = {
      name: userProfile?.name || '',
      phone: userProfile?.phone || '',
      issue: issueType,
      selectedProfile: partnerId || '',
      message: ''
    };
    
    setFormData(newFormData);
    console.log('✅ Form updated with:', newFormData);
  }, [partnerId, issueType, userProfile]);

  const telegramUrl = 'https://t.me/loveinthecity';
  const whatsappUrl = 'https://wa.me/1234567890';

  const messagePreview = `Hi! My name is ${formData.name || 'Friend'}.${
    formData.issue === 'reserve'
      ? ` I'm interested in ${MOCK_USERS.find(u => u.id === formData.selectedProfile)?.name || 'someone'}. ${formData.message}`
      : ` ${formData.message}`
  }`;

  const sendMessage = (platform: 'telegram' | 'whatsapp') => {
    // Validate form
    if (!formData.name.trim()) {
      setError('❌ Please enter your name');
      return;
    }
    if (!formData.phone.trim()) {
      setError('❌ Please enter your phone number');
      return;
    }
    if (formData.issue === 'reserve' && !formData.selectedProfile) {
      setError('❌ Please select a profile to reserve');
      return;
    }
    
    setError(''); // Clear error if validation passes
    
    // Copy to clipboard
    navigator.clipboard.writeText(messagePreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Open platform
    const url = platform === 'telegram' ? telegramUrl : whatsappUrl;
    setTimeout(() => {
      window.open(url, '_blank');
    }, 100);
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-white to-gray-50 pb-20 font-sans text-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back Button Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Contact Support</h1>
        </div>

        {/* Issue Type Banner */}
        {issueType !== 'inquiry' && (() => {
          const config = ISSUE_CONFIG[issueType as keyof typeof ISSUE_CONFIG] || ISSUE_CONFIG.inquiry;
          const colorMap: Record<string, string> = {
            blue: 'bg-blue-50 border-blue-200',
            red: 'bg-red-50 border-red-200',
            green: 'bg-green-50 border-green-200',
            purple: 'bg-purple-50 border-purple-200',
            orange: 'bg-orange-50 border-orange-200',
            yellow: 'bg-yellow-50 border-yellow-200',
            pink: 'bg-pink-50 border-pink-200'
          };
          const textColorMap: Record<string, string> = {
            blue: 'text-blue-700',
            red: 'text-red-700',
            green: 'text-green-700',
            purple: 'text-purple-700',
            orange: 'text-orange-700',
            yellow: 'text-yellow-700',
            pink: 'text-pink-700'
          };
          return (
            <div className={`${colorMap[config.color as keyof typeof colorMap]} border-2 rounded-xl p-4 mb-6 flex items-center gap-3`}>
              <span className="text-2xl">{config.icon}</span>
              <div>
                <p className={`font-bold ${textColorMap[config.color as keyof typeof textColorMap]}`}>{config.label}</p>
                <p className="text-xs text-gray-600">Request Type: {issueType}</p>
              </div>
            </div>
          );
        })()}

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          {/* Debug Panel - Shows prefilled data */}
          <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono">
            <p className="font-bold text-gray-700 mb-2">📋 Form State:</p>
            <p className="text-gray-600">Issue: <span className="text-gray-900 font-bold">{formData.issue}</span></p>
            <p className="text-gray-600">Profile ID: <span className="text-gray-900 font-bold">{formData.selectedProfile || 'none'}</span></p>
            <p className="text-gray-600">Profile Name: <span className="text-gray-900 font-bold">{MOCK_USERS.find(u => u.id === formData.selectedProfile)?.name || 'N/A'}</span></p>
            <p className="text-gray-600">Your Name: <span className="text-gray-900 font-bold">{formData.name || 'empty'}</span></p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-6 pb-4 border-b border-gray-100">
            Connect with our team via Telegram or WhatsApp to reserve your match!
          </p>
          {/* Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Phone Number</label>
              <input
                type="tel"
                placeholder="Your phone number..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          {/* Issue Type */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Reason for Contact</label>
            <select
              value={formData.issue}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white focus:outline-none transition"
            >
              <option value="inquiry">General Inquiry</option>
              <option value="reserve">Reserve a Profile</option>
              <option value="support">Need Help / Support</option>
              <option value="vip">VIP Upgrade & Billing</option>
              <option value="password">Password Reset</option>
              <option value="verification">Account Verification</option>
              <option value="report">Report a User</option>
              <option value="videos">Private Videos</option>
              <option value="pin">Payment PIN</option>
              <option value="funding">Funding Details</option>
              <option value="announcements">Announcements</option>
            </select>
          </div>

          {/* Profile Selection */}
          {formData.issue === 'reserve' && (
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Which profile interests you?</label>
              <select
                value={formData.selectedProfile}
                onChange={(e) => setFormData({ ...formData, selectedProfile: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white focus:outline-none transition"
              >
                <option value="">Select a profile...</option>
                {MOCK_USERS.filter(u => u.id !== 'support').map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}, {user.age} - {user.residence}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Message */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Additional Message (optional)</label>
            <textarea
              placeholder="Tell us more about yourself or your preferences..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white focus:outline-none transition resize-none h-24"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Message Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Your Message Preview:</p>
            <p className="text-sm text-gray-700 leading-relaxed p-3 bg-white rounded-lg border border-gray-100">
              {messagePreview}
            </p>
          </div>

          {/* Send Buttons - Telegram & WhatsApp */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => sendMessage('telegram')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295-.41 0-.34-.145-.477-.477l-2.09-6.881c-.135-.43-.033-.662.352-.662l9.155-3.527c.41-.126.647.104.535.617z" />
              </svg>
              <span className="text-sm">Telegram</span>
            </button>
            <button
              onClick={() => sendMessage('whatsapp')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.052 0-2.081.405-2.84 1.12-.78.725-1.215 1.708-1.215 2.748 0 1.486.772 2.934 2.122 3.791 1.075.67 2.631 1.123 4.001 1.123h.004c2.176 0 4.236-1.41 5.115-3.44.559-1.331.665-2.432.318-3.519-.464-1.402-1.823-2.777-3.588-3.289-.52-.15-1.061-.226-1.629-.226z" />
              </svg>
              <span className="text-sm">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Service Card */}
        <div className="bg-gradient-to-br from-primary to-pink-600 text-white rounded-3xl p-8 mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
              <MessageCircle size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Connect With Our Team</h2>
            <p className="text-white/90 text-sm leading-relaxed">
              Copy your message above and share it on Telegram or WhatsApp. Our specialists will match you with your perfect connection instantly!
            </p>
          </div>
        </div>

        {/* Contact Options */}
        <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Connect Now</h3>

        <div className="space-y-3 mb-8">
          {/* Telegram */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-5 bg-white rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-lg active:scale-95 transition-all shadow-sm group cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295-.41 0-.34-.145-.477-.477l-2.09-6.881c-.135-.43-.033-.662.352-.662l9.155-3.527c.41-.126.647.104.535.617z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-0.5">Telegram</h4>
              <p className="text-xs text-gray-500">Paste message → Open chat</p>
            </div>
            <div className="text-blue-600 group-hover:text-blue-700 transition">
              <Send size={20} />
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-5 bg-white rounded-2xl border border-gray-200 hover:border-green-400 hover:shadow-lg active:scale-95 transition-all shadow-sm group cursor-pointer"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.052 0-2.081.405-2.84 1.12-.78.725-1.215 1.708-1.215 2.748 0 1.486.772 2.934 2.122 3.791 1.075.67 2.631 1.123 4.001 1.123h.004c2.176 0 4.236-1.41 5.115-3.44.559-1.331.665-2.432.318-3.519-.464-1.402-1.823-2.777-3.588-3.289-.52-.15-1.061-.226-1.629-.226 1.326-1.26 2.08-3.023 2.08-4.99 0-.268-.011-.533-.032-.795 1.326 1.26 2.08 3.023 2.08 4.99 0 .268.011.533.032.795-1.326-1.26-2.08-3.023-2.08-4.99 0-1.967.754-3.73 2.08-4.99-.021.262-.032.527-.032.795 0 1.967.754 3.73 2.08 4.99-1.326 1.26-2.08 3.023-2.08 4.99 0 .268.011.533.032.795z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-0.5">WhatsApp</h4>
              <p className="text-xs text-gray-500">Paste message → Send directly</p>
            </div>
            <div className="text-green-600 group-hover:text-green-700 transition">
              <Send size={20} />
            </div>
          </a>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h4 className="font-bold text-blue-900 mb-2 text-sm">📋 How It Works:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>✓ Fill in your details above</li>
            <li>✓ Select the profile you're interested in (if applicable)</li>
            <li>✓ Copy your pre-filled message</li>
            <li>✓ Paste it to Telegram or WhatsApp</li>
            <li>✓ Our team will match you instantly!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

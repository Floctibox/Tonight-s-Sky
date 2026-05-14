import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSavedEvents } from '../hooks/useSavedEvents';
import { SectionCard } from './ui/SectionCard';

export function ProfilePage({ isOpen, onClose }) {
  const { user, updateProfile, logout } = useAuth();
  const { events, loadUpcomingEvents } = useSavedEvents();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    emailNotificationsEnabled: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        emailNotificationsEnabled: user.emailNotificationsEnabled !== false,
      });
    }
    if (isOpen) {
      loadUpcomingEvents();
    }
  }, [user, isOpen, loadUpcomingEvents]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (!formData.username) {
      setError('Please fill in username');
      return;
    }

    try {
      setLoading(true);
      await updateProfile(formData);
      setSuccess('Profile updated!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 rounded-t-lg sticky top-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Profile & Settings</h2>
            <button
              onClick={onClose}
              className="text-slate-200 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-900 border border-red-700 text-red-200 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900 border border-green-700 text-green-200 rounded">
              {success}
            </div>
          )}

          {/* Account Info Section */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Account Information</h3>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-teal-500"
                    disabled={loading}
                  />
                </div>

                <div className="bg-slate-700 p-3 rounded">
                  <p className="text-slate-300 text-sm">Email: {user.email}</p>
                  <p className="text-slate-400 text-xs mt-1">Email cannot be changed</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-600 text-white py-2 px-4 rounded transition"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-4 rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-slate-300">
                    <span className="font-medium">Username:</span> {user.username}
                  </p>
                  <p className="text-slate-300">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-slate-400 text-sm">
                    <span className="font-medium">Member since:</span>{' '}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded transition"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>

          {/* Notifications Section */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Notification Preferences</h3>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="emailNotificationsEnabled"
                checked={formData.emailNotificationsEnabled}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <div>
                <p className="text-slate-200 font-medium">Email Reminders</p>
                <p className="text-slate-400 text-sm">
                  Receive email reminders 1 day before saved events
                </p>
              </div>
            </label>

            {formData.emailNotificationsEnabled !== user.emailNotificationsEnabled && (
              <button
                onClick={handleSave}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
              >
                Save Preference
              </button>
            )}
          </div>

          {/* Upcoming Events Section */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-bold text-slate-100 mb-4">
              🌟 Next {events.length > 0 ? events.length : 'No'} Upcoming Events
            </h3>

            {events.length === 0 ? (
              <p className="text-slate-400">No upcoming events saved.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event._id}
                    className="p-3 bg-slate-700 border border-slate-600 rounded"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-slate-100">{event.title}</p>
                        <p className="text-sm text-slate-400">
                          {new Date(event.eventDate).toLocaleDateString()} at{' '}
                          {new Date(event.eventDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {event.reminderEnabled && (
                        <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
                          📧 Reminder On
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {events.length > 5 && (
                  <p className="text-slate-400 text-sm mt-2">
                    +{events.length - 5} more events...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4">
            <h3 className="text-lg font-bold text-red-300 mb-4">Danger Zone</h3>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSavedEvents } from '../hooks/useSavedEvents';

export function SaveEventModal({ isOpen, onClose, eventToSave }) {
  const { user } = useAuth();
  const { addEvent, loading: eventsLoading } = useSavedEvents();
  const [formData, setFormData] = useState({
    title: '',
    eventType: 'other',
    description: '',
    eventDate: '',
    notes: '',
    reminderEnabled: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (eventToSave) {
      setFormData({
        title: eventToSave.title || '',
        eventType: eventToSave.eventType || 'other',
        description: eventToSave.description || '',
        eventDate: eventToSave.eventDate || '',
        notes: eventToSave.notes || '',
        reminderEnabled: true,
      });
    }
  }, [eventToSave, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.eventDate) {
      setError('Please fill in title and date');
      return;
    }

    try {
      setLoading(true);
      await addEvent({
        ...formData,
        eventDate: new Date(formData.eventDate).toISOString(),
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          title: '',
          eventType: 'other',
          description: '',
          eventDate: '',
          notes: '',
          reminderEnabled: true,
        });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-lg shadow-xl max-w-md w-full border border-slate-700">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white">Save Event</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-900 border border-red-700 text-red-200 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900 border border-green-700 text-green-200 rounded">
              ✓ Event saved successfully!
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Perseid Meteor Shower"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-purple-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Event Type</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-purple-500"
              disabled={loading}
            >
              <option value="meteor_shower">Meteor Shower</option>
              <option value="eclipse">Eclipse</option>
              <option value="full_moon">Full Moon</option>
              <option value="new_moon">New Moon</option>
              <option value="planetary_alignment">Planetary Alignment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Date & Time</label>
            <input
              type="datetime-local"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-purple-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add details about this event..."
              rows="2"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-purple-500 resize-none"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Personal Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Your personal notes..."
              rows="2"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-purple-500 resize-none"
              disabled={loading}
            />
          </div>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="reminderEnabled"
              checked={formData.reminderEnabled}
              onChange={handleChange}
              className="w-4 h-4"
              disabled={loading}
            />
            <span className="text-slate-200">Send email reminder 1 day before</span>
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || eventsLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-medium py-2 px-4 rounded transition"
            >
              {loading ? 'Saving...' : 'Save Event'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

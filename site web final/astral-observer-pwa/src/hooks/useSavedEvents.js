import { useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

export function useSavedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getSavedEvents();
      setEvents(response.events);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUpcomingEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getUpcomingEvents();
      setEvents(response.events);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = useCallback(async (event) => {
    try {
      setError(null);
      const response = await apiClient.addEvent(event);
      setEvents([...events, response.event]);
      return response.event;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [events]);

  const updateEvent = useCallback(async (id, data) => {
    try {
      setError(null);
      const response = await apiClient.updateEvent(id, data);
      setEvents(events.map(e => e._id === id ? response.event : e));
      return response.event;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [events]);

  const deleteEvent = useCallback(async (id) => {
    try {
      setError(null);
      await apiClient.deleteEvent(id);
      setEvents(events.filter(e => e._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [events]);

  return {
    events,
    loading,
    error,
    loadEvents,
    loadUpcomingEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}

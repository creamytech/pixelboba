'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Clock, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface TimeEntry {
  id: string;
  duration: number;
  description: string;
  billable: boolean;
  startTime: Date;
  endTime?: Date;
}

interface TimeTrackerProps {
  taskId: string;
  onTimeUpdate?: (totalMinutes: number) => void;
}

export default function TimeTracker({ taskId, onTimeUpdate }: TimeTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualHours, setManualHours] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualBillable, setManualBillable] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    fetchTimeEntries();
  }, [taskId]);

  useEffect(() => {
    if (isTracking) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTracking]);

  const fetchTimeEntries = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/time-entries`);
      if (response.ok) {
        const data = await response.json();
        setTimeEntries(data.entries || []);
      }
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    setCurrentTime(0);
  };

  const pauseTracking = () => {
    setIsTracking(false);
  };

  const stopTracking = async () => {
    if (currentTime === 0) return;

    setIsTracking(false);

    const durationMinutes = Math.floor(currentTime / 60);
    if (durationMinutes === 0) {
      setCurrentTime(0);
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}/time-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: durationMinutes,
          description: 'Time tracked',
          isBillable: true,
        }),
      });

      if (response.ok) {
        await fetchTimeEntries();
        setCurrentTime(0);
        if (onTimeUpdate) {
          onTimeUpdate(getTotalMinutes() + durationMinutes);
        }
      }
    } catch (error) {
      console.error('Error saving time entry:', error);
    }
  };

  const addManualEntry = async () => {
    const hours = parseInt(manualHours) || 0;
    const minutes = parseInt(manualMinutes) || 0;
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes === 0) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}/time-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: totalMinutes,
          description: manualDescription || 'Manual entry',
          isBillable: manualBillable,
        }),
      });

      if (response.ok) {
        await fetchTimeEntries();
        setShowManualEntry(false);
        setManualHours('');
        setManualMinutes('');
        setManualDescription('');
        setManualBillable(true);
        if (onTimeUpdate) {
          onTimeUpdate(getTotalMinutes() + totalMinutes);
        }
      }
    } catch (error) {
      console.error('Error adding manual entry:', error);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/time-entries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTimeEntries();
        if (onTimeUpdate) {
          onTimeUpdate(getTotalMinutes());
        }
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getTotalMinutes = () => {
    return timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  };

  const getTotalBillableMinutes = () => {
    return timeEntries.filter((e) => e.billable).reduce((sum, entry) => sum + entry.duration, 0);
  };

  return (
    <div className="space-y-4">
      {/* Timer Display */}
      <div className="bg-gradient-to-br from-taro/10 to-deep-taro/10 rounded-xl border-3 border-ink p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-taro" />
            <span className="font-black text-ink uppercase text-sm">Time Tracker</span>
          </div>
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="px-3 py-1.5 bg-white border-2 border-ink rounded-lg font-black text-xs uppercase hover:bg-cream transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3 h-3" />
            Manual Entry
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="font-mono text-5xl font-black text-ink mb-2">
            {formatTime(currentTime)}
          </div>
          <p className="text-sm font-bold text-ink/60">
            {isTracking ? 'Timer running...' : 'Ready to track time'}
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          {!isTracking ? (
            <button
              onClick={startTracking}
              className="px-6 py-3 bg-matcha text-white font-black rounded-lg border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]] transition-all uppercase text-sm flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          ) : (
            <>
              <button
                onClick={pauseTracking}
                className="px-6 py-3 bg-thai-tea text-white font-black rounded-lg border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]] transition-all uppercase text-sm flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
              <button
                onClick={stopTracking}
                className="px-6 py-3 bg-strawberry text-white font-black rounded-lg border-3 border-ink shadow-[3px_3px_0px_0px_rgba(58,0,29,1)] hover:shadow-[5px_5px_0px_0px_rgba(58,0,29,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]] transition-all uppercase text-sm flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Stop & Save
              </button>
            </>
          )}
        </div>
      </div>

      {/* Manual Entry Form */}
      <AnimatePresence>
        {showManualEntry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl border-3 border-ink p-4"
          >
            <h4 className="font-black text-ink uppercase text-sm mb-3">Add Manual Entry</h4>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Hours"
                  value={manualHours}
                  onChange={(e) => setManualHours(e.target.value)}
                  className="flex-1 px-3 py-2 border-2 border-ink rounded-lg font-bold"
                />
                <input
                  type="number"
                  placeholder="Minutes"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(e.target.value)}
                  className="flex-1 px-3 py-2 border-2 border-ink rounded-lg font-bold"
                />
              </div>
              <input
                type="text"
                placeholder="Description (optional)"
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                className="w-full px-3 py-2 border-2 border-ink rounded-lg font-bold"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={manualBillable}
                  onChange={(e) => setManualBillable(e.target.checked)}
                  className="w-4 h-4 border-2 border-ink rounded"
                />
                <span className="font-bold text-sm text-ink">Billable</span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={addManualEntry}
                  className="flex-1 px-4 py-2 bg-matcha text-white font-black rounded-lg border-2 border-ink hover:bg-green-600 transition-colors uppercase text-sm"
                >
                  Add Entry
                </button>
                <button
                  onClick={() => setShowManualEntry(false)}
                  className="px-4 py-2 bg-cream text-ink font-black rounded-lg border-2 border-ink hover:bg-brown-sugar/20 transition-colors uppercase text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Summary */}
      {timeEntries.length > 0 && (
        <div className="bg-white rounded-xl border-3 border-ink p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-bold text-ink/60 uppercase mb-1">Total Time</p>
              <p className="text-2xl font-black text-ink">{formatDuration(getTotalMinutes())}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-ink/60 uppercase mb-1">Billable Time</p>
              <p className="text-2xl font-black text-matcha">
                {formatDuration(getTotalBillableMinutes())}
              </p>
            </div>
          </div>

          <div className="border-t-2 border-ink/10 pt-4">
            <h4 className="font-black text-ink uppercase text-sm mb-3">Time Entries</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {timeEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-cream/30 rounded-lg border-2 border-ink/10"
                >
                  <div className="flex-1">
                    <p className="font-bold text-sm text-ink">{entry.description}</p>
                    <p className="text-xs text-ink/60 font-bold">
                      {formatDuration(entry.duration)} {entry.billable && '• Billable'}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 text-strawberry hover:bg-strawberry/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

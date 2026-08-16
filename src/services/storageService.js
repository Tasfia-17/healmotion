import { get, set, del } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';

const SESSIONS_KEY = 'healmotion_sessions';

export async function saveSession(sessionData) {
  const sessions = (await get(SESSIONS_KEY)) || [];
  const session = { id: uuidv4(), ...sessionData, savedAt: Date.now() };
  sessions.push(session);
  await set(SESSIONS_KEY, sessions);
  return session;
}

export async function getAllSessions() {
  return (await get(SESSIONS_KEY)) || [];
}

export async function getRecentSessions(days = 7) {
  const sessions = await getAllSessions();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return sessions.filter(s => s.savedAt > cutoff);
}

export async function getProfile() {
  const saved = localStorage.getItem('healmotion_user');
  return saved ? JSON.parse(saved) : null;
}

export async function getWeeklyStats() {
  const sessions = await getRecentSessions(7);
  if (sessions.length === 0) return { totalSessions: 0, totalReps: 0, avgSymmetry: 0, streak: 0 };

  let totalReps = 0, totalSym = 0, symCount = 0;
  for (const session of sessions) {
    for (const ex of (session.exercises || [])) {
      totalReps += ex.repsCompleted || 0;
      if (ex.symmetryIndex) { totalSym += ex.symmetryIndex; symCount++; }
    }
  }

  // Streak calculation
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let streak = 0;
  for (let i = 0; i < 7; i++) {
    const day = new Date(today.getTime() - i * 86400000);
    const dayEnd = new Date(day.getTime() + 86400000);
    if (sessions.some(s => s.savedAt >= day.getTime() && s.savedAt < dayEnd.getTime())) streak++;
    else break;
  }

  return {
    totalSessions: sessions.length,
    totalReps,
    avgSymmetry: symCount > 0 ? Math.round(totalSym / symCount) : 0,
    streak,
  };
}

export function exportSessionsCSV(sessions) {
  const headers = ['Date', 'Exercise', 'Reps', 'Target', 'ROM', 'Symmetry', 'Fatigue', 'Compensations'];
  const rows = [];
  for (const session of sessions) {
    for (const ex of (session.exercises || [])) {
      rows.push([
        new Date(session.savedAt).toLocaleDateString(),
        ex.exerciseId || '', ex.repsCompleted || 0, ex.targetReps || 0,
        ex.avgROM ? ex.avgROM.toFixed(1) : '', ex.symmetryIndex || '',
        ex.fatigueLevel ? ex.fatigueLevel.toFixed(0) : '', ex.compensationsDetected || 0,
      ]);
    }
  }
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export async function clearAllData() {
  await del(SESSIONS_KEY);
  localStorage.removeItem('healmotion_user');
}

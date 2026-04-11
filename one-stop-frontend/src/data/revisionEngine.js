// Revision Engine — Spaced repetition system
// localStorage key: onestop_revision_queue

const STORAGE_KEY = 'onestop_revision_queue';

// Intervals in days based on performance
const INTERVALS = { great: 14, good: 7, weak: 3, fail: 1 };

export function getRevisionQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRevisionQueue(queue) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

// Add or update a topic in revision queue based on accuracy
export function updateRevision(topic, accuracy) {
  const queue = getRevisionQueue();
  const now = new Date();
  
  let intervalDays;
  if (accuracy >= 85) intervalDays = INTERVALS.great;
  else if (accuracy >= 65) intervalDays = INTERVALS.good;
  else if (accuracy >= 40) intervalDays = INTERVALS.weak;
  else intervalDays = INTERVALS.fail;

  const nextRevision = new Date(now.getTime() + intervalDays * 86400000).toISOString();
  
  const existingIdx = queue.findIndex(item => item.topic === topic);
  const entry = { topic, accuracy, nextRevision, intervalDays, lastRevised: now.toISOString() };
  
  if (existingIdx >= 0) {
    queue[existingIdx] = entry;
  } else {
    queue.push(entry);
  }
  
  saveRevisionQueue(queue);
  return entry;
}

// Get topics due for revision today
export function getTopicsDueToday() {
  const queue = getRevisionQueue();
  const now = new Date();
  return queue
    .filter(item => new Date(item.nextRevision) <= now)
    .sort((a, b) => a.accuracy - b.accuracy); // weakest first
}

// Get all revision topics sorted by urgency
export function getAllRevisionTopics() {
  const queue = getRevisionQueue();
  const now = new Date();
  return queue
    .map(item => ({
      ...item,
      daysUntilDue: Math.ceil((new Date(item.nextRevision) - now) / 86400000),
      isDue: new Date(item.nextRevision) <= now,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

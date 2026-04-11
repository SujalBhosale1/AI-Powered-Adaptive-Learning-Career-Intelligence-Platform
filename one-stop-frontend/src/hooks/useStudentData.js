// Unified student data hook — abstracts all localStorage state

import { useState, useEffect } from 'react';
import { getSkillScores, getOverallScore, getTopicStatus, getAccuracy, getPrioritizedTopics, getConfusedTopics } from '../data/skillEngine';
import { getXPData, getBadges, getLevel, getXPForNextLevel, getLevelTitle, awardXP, checkAndAwardBadges } from '../data/gamificationEngine';
import { getTopicsDueToday, getAllRevisionTopics } from '../data/revisionEngine';

export function useStudentData() {
  const [skillScores, setSkillScores] = useState({});
  const [xpData, setXpData] = useState({});
  const [badges, setBadges] = useState([]);
  const [revisionQueue, setRevisionQueue] = useState([]);
  const [newBadgePopup, setNewBadgePopup] = useState(null);

  function refresh() {
    const scores = getSkillScores();
    setSkillScores(scores);
    setXpData(getXPData());
    setBadges(getBadges());
    setRevisionQueue(getTopicsDueToday());
  }

  useEffect(() => {
    refresh();
  }, []);

  // Award XP and refresh state
  function giveXP(reason, count = 1) {
    const { earned, updated } = awardXP(reason, count);
    setXpData(updated);
    
    // Check badges
    const newBadges = checkAndAwardBadges(getSkillScores());
    if (newBadges.length > 0) {
      setBadges(getBadges());
      setNewBadgePopup(newBadges[0]); // Show first new badge
      setTimeout(() => setNewBadgePopup(null), 4000);
    }
    return earned;
  }

  const overallScore = getOverallScore();
  const prioritizedTopics = getPrioritizedTopics();
  const confusedTopics = getConfusedTopics();
  const levelInfo = getXPForNextLevel(xpData.total ?? 0);
  const levelTitle = getLevelTitle(xpData.level ?? 1);

  return {
    skillScores,
    xpData,
    badges,
    revisionQueue,
    overallScore,
    prioritizedTopics,
    confusedTopics,
    levelInfo,
    levelTitle,
    newBadgePopup,
    giveXP,
    refresh,
    // helpers
    getAccuracy,
    getTopicStatus,
    getPrioritizedTopics,
    getAllRevisionTopics,
  };
}

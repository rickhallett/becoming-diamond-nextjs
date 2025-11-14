/**
 * Mark All Sprint Days as Complete (For Testing)
 *
 * Usage:
 * 1. Open browser console (F12)
 * 2. Paste this entire script
 * 3. Press Enter
 * 4. Refresh the page
 */

const now = new Date().toISOString();

const completeProgress = {
  sprintId: '30-day-sprint',
  enrollmentDate: now,
  completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  currentDay: 31, // Allow access to day 31 (test day)
  totalDaysCompleted: 30,
  completionPercentage: 100,
  status: 'completed',
  lastAccessDate: now,
  createdAt: now,
  updatedAt: now,
};

// Save to localStorage
localStorage.setItem('sprint_progress_v1', JSON.stringify(completeProgress));

console.log('✅ All 30 sprint days marked as complete!');
console.log('✅ Current day set to 31 (allows access to test day)');
console.log('📊 Progress:', completeProgress);
console.log('🔄 Refresh the page to see changes');

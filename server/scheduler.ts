import cron from 'node-cron';
import { createDailyRiddle } from './services/riddleService';

let scheduledTask: cron.ScheduledTask | null = null;

export function startRiddleScheduler() {
  // Schedule to run every day at midnight
  scheduledTask = cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled task: generating daily riddle');
    try {
      const result = await createDailyRiddle();
      if (result.success) {
        console.log('Successfully generated daily riddle');
      } else {
        console.error('Failed to generate daily riddle:', result.error);
      }
    } catch (error) {
      console.error('Error in riddle scheduler:', error);
    }
  });

  console.log('Daily riddle scheduler started');
  return scheduledTask;
}

export function stopRiddleScheduler() {
  if (scheduledTask) {
    scheduledTask.stop();
    console.log('Daily riddle scheduler stopped');
  }
}

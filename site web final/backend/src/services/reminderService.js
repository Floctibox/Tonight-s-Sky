import cron from 'node-cron';
import { User } from '../models/User.js';
import { sendReminderEmail } from './emailService.js';

let cronJobs = [];

// Schedule reminders to run daily at 8 AM
export function startReminderScheduler() {
  console.log('📅 Starting reminder scheduler...');

  // Run every day at 8:00 AM
  const job = cron.schedule('0 8 * * *', async () => {
    console.log(`[${new Date().toISOString()}] ⏰ Running daily reminder check...`);
    await checkAndSendReminders();
  });

  cronJobs.push(job);

  // Also check on server start
  checkAndSendReminders();
}

export async function checkAndSendReminders() {
  try {
    // Get tomorrow's date at start and end
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    // Find all users with saved events that are tomorrow and not yet reminded
    const users = await User.find({
      savedEvents: {
        $elemMatch: {
          eventDate: { $gte: tomorrow, $lte: tomorrowEnd },
          reminderEnabled: true,
          reminderSent: false,
        },
      },
      emailNotificationsEnabled: true,
    });

    if (users.length === 0) {
      console.log('ℹ No reminders to send today');
      return;
    }

    console.log(`📧 Found ${users.length} users with upcoming events`);

    for (const user of users) {
      for (const event of user.savedEvents) {
        const eventDate = new Date(event.eventDate);

        // Check if this event is tomorrow and hasn't been reminded
        if (
          event.reminderEnabled &&
          !event.reminderSent &&
          eventDate >= tomorrow &&
          eventDate <= tomorrowEnd
        ) {
          const emailSent = await sendReminderEmail(user, event);

          if (emailSent) {
            // Update the event to mark reminder as sent
            event.reminderSent = true;
            event.reminderSentAt = new Date();
            await user.save();
            console.log(`✓ Reminder sent for "${event.title}" to ${user.email}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('✗ Error checking reminders:', error.message);
  }
}

export function stopReminderScheduler() {
  cronJobs.forEach(job => job.stop());
  cronJobs = [];
  console.log('✓ Reminder scheduler stopped');
}

// Manual trigger for testing
export async function triggerRemindersNow() {
  console.log('🔔 Manually triggering reminders...');
  await checkAndSendReminders();
}

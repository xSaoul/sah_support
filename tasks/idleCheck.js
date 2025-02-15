const db = require('../mariadb');
async function checkIdleThreads(client) {
  const [rows] = await db.execute(`
    SELECT thread_id, op_id, reminder_sent_time FROM thread_timers
    WHERE reminder_sent = FALSE
    AND last_posted < NOW() - INTERVAL 48 HOUR
    `);

  for (const { thread_id, op_id } of rows) {
    try {
      const thread = await client.channels.fetch(thread_id);
      if (thread) {
        const lastMessage = await thread.messages.fetch({ limit: 1 });
        const lastMessageAuthor = lastMessage.first()?.author.id;

        if (lastMessageAuthor === op_id) {
          await db.execute(
            `
            UPDATE thread_timers 
            SET last_posted = NOW(), close_scheduled_time = NULL 
            WHERE thread_id = ?`,
            [thread_id]
          );
          console.log(`Reminder skipped, last message was posted by OP in thread ${thread_id}`);
          continue;
        }
        await thread.send({
          content: `<@${op_id}> Your thread has been idle for over 48 hours. 
            <tree_end:951969115264913528> If this issue is not resolved, please reply within 24hrs to prevent this thread from closing.`,
        });
        await db.execute(
          `
          UPDATE thread_timers 
          SET reminder_sent = TRUE, close_scheduled_time = NOW() + INTERVAL 24 HOUR 
          WHERE thread_id = ?`,
          [thread_id]
        );
      }
      console.log(`Sent reminder to ${op_id} in thread ${thread_id}`);
    } catch (err) {
      console.error(`Failed to send message in thread ${thread_id}:`, err);
    }
  }
}

module.exports = { checkIdleThreads };

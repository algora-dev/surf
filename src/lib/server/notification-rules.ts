import {db} from './db';
import {defaultNotificationRules,type NotificationRules} from '../notification-rules';
export async function readNotificationRules():Promise<NotificationRules>{const rows=await db<NotificationRules[]>('business_settings?id=eq.1&select=reminders_enabled,default_reminder_minutes,whatsapp_alerts,daily_summary');return {...defaultNotificationRules,...rows[0]};}

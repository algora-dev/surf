import {localParts,statusAt,type Block,type Hours} from './booking';
export type NotificationRules={reminders_enabled:boolean;default_reminder_minutes:number;whatsapp_alerts:boolean;daily_summary:boolean};
export const defaultNotificationRules:NotificationRules={reminders_enabled:false,default_reminder_minutes:60,whatsapp_alerts:false,daily_summary:false};
export function reminderDue(b:Block,rules:NotificationRules,now:Date){const minutes=b.reminder_minutes??rules.default_reminder_minutes;const start=Date.parse(b.starts_at);return rules.reminders_enabled&&b.kind==='lesson'&&minutes>0&&start>+now&&start-minutes*60000<=+now;}
export function reminderKey(b:Block){return `lesson/${b.id}/${new Date(b.starts_at).toISOString()}`;}
export function quietHours(now:Date,hours:Hours|null){return !hours?.configured||statusAt(now,[],hours)==='rest';}
export function summaryDue(now:Date,hours:Hours|null,rules:NotificationRules){if(!rules.daily_summary||quietHours(now,hours))return false;const hour=Number(localParts(now).time.slice(0,2));return hour>=6&&hour<12;}

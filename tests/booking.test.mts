import assert from 'node:assert/strict';
import {statusAt,toUtc,localParts,type Hours,type Block} from '../src/lib/booking.ts';
const hours:Hours={start_time:'08:00',end_time:'19:00',days:[1,2,3,4,5],configured:true};
const d=(s:string)=>new Date(toUtc(s));
const block=(kind:Block['kind'],start='2026-11-25T10:00',end='2026-11-25T12:00'):Block=>({id:kind,kind,starts_at:toUtc(start),ends_at:toUtc(end),title:'private',enquiry_id:null});
assert.equal(localParts(d('2026-11-25T10:00')).time,'10:00');
assert.equal(statusAt(d('2026-11-25T10:00'),[],hours),'available');
assert.equal(statusAt(d('2026-11-25T07:59'),[],hours),'rest');
assert.equal(statusAt(d('2026-11-25T19:00'),[],hours),'rest');
assert.equal(statusAt(d('2026-11-28T10:00'),[],hours),'rest');
assert.equal(statusAt(d('2026-11-25T10:00'),[],null),'unknown');
for(const k of ['lesson','rest','travel','off'] as const){assert.equal(statusAt(d('2026-11-25T10:30'),[block(k)],hours),k);assert.equal(statusAt(d('2026-11-25T12:00'),[block(k)],hours),'available')}
assert.equal(statusAt(d('2026-11-25T10:30'),[block('lesson'),block('off')],hours),'off');
assert.equal(statusAt(d('2026-11-25T10:30'),[block('rest'),block('travel')],hours),'travel');
assert.equal(statusAt(d('2026-11-26T02:00'),[block('travel','2026-11-25T23:00','2026-11-26T06:00')],hours),'travel');
assert.throws(()=>toUtc('2026-02-30T10:00'));
console.log('All availability assertions passed (15+ cases).');

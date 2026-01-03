"use strict";

const TH_OFFSET_MINUTES = 7 * 60;
const TH_OFFSET_MS = TH_OFFSET_MINUTES * 60 * 1000;

/** ตรวจว่า string เป็นเวลาไทยอยู่แล้วหรือไม่ (+07:00 / +0700) */
function isThaiTimeString(value) {
  if (typeof value !== "string") return false;
  return /(\+07:00|\+0700)$/.test(value.trim());
}

/** ตรวจว่า string มี timezone ติดมาแล้วหรือไม่ (Z หรือ ±hh:mm หรือ ±hhmm) */
function hasTimezoneInfo(value) {
  if (typeof value !== "string") return false;
  return /(Z|[+-]\d{2}:\d{2}|[+-]\d{4})$/.test(value.trim());
}

/**
 * แปลง input เป็น Date (instant)
 * - ถ้าเป็น Date => คืนเลย
 * - ถ้าเป็น string:
 *    - มี timezone => new Date(value) ได้เลย
 *    - ไม่มี timezone => "ตีความว่าเป็นเวลาไทย" แล้วแปลงเป็น instant โดยลบ offset 7 ชั่วโมง
 */
function toDateAssumingThai(input) {
  if (!input) return null;
  if (input instanceof Date) return input;

  if (typeof input === "string") {
    const s = input.trim();
    if (hasTimezoneInfo(s)) return new Date(s);

    // ไม่มี timezone: ถือว่าเป็นเวลาไทย (local clock) => แปลงเป็น UTC instant
    // ตัวอย่าง "2025-12-17T10:00:00" (ไทย) => instant = 03:00Z
    const parsed = new Date(s); // จะตีความเป็น local ของเครื่องรัน แต่เราไม่อยากพึ่ง local
    // ทางที่ปลอดภัย: parse เองเป็นตัวเลข (รองรับ ISO แบบมาตรฐาน)
    // ถ้า format ไม่ชัด ให้ fallback parsed
    const m = s.match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/
    );
    if (!m) return parsed;

    const year = Number(m[1]);
    const month = Number(m[2]) - 1;
    const day = Number(m[3]);
    const hh = Number(m[4] ?? 0);
    const mm = Number(m[5] ?? 0);
    const ss = Number(m[6] ?? 0);
    const ms = Number((m[7] ?? "0").padEnd(3, "0"));

    // สร้างเป็น "UTC แบบเดียวกับตัวเลขที่ให้มา" ก่อน แล้วค่อย - offset ไทย เพื่อได้ instant จริง
    const utcLike = Date.UTC(year, month, day, hh, mm, ss, ms);
    return new Date(utcLike - TH_OFFSET_MS);
  }

  // number timestamp
  if (typeof input === "number") return new Date(input);

  return new Date(input);
}

/** ทำให้เลข 2 หลัก */
function pad2(n) {
  return String(n).padStart(2, "0");
}

/** ทำให้เลข 3 หลัก */
function pad3(n) {
  return String(n).padStart(3, "0");
}

/**
 * ฟอร์แมต Date เป็นเวลาไทยพร้อม offset +07:00
 * - รับ Date หรือ string หรือ number
 * - ถ้า input เป็น string และเป็นไทยอยู่แล้ว => คืนเดิม
 */
function toThaiISOString(value) {
  if (!value) return null;

  if (typeof value === "string" && isThaiTimeString(value)) {
    return value.trim();
  }

  const d = value instanceof Date ? value : toDateAssumingThai(value);
  if (!(d instanceof Date) || isNaN(d.getTime())) return null;

  // เอา instant ไปเลื่อน +7ชม เพื่ออ่านเป็น "เวลาไทย" ด้วย getter แบบ UTC
  const shifted = new Date(d.getTime() + TH_OFFSET_MS);

  const yyyy = shifted.getUTCFullYear();
  const MM = pad2(shifted.getUTCMonth() + 1);
  const dd = pad2(shifted.getUTCDate());
  const HH = pad2(shifted.getUTCHours());
  const mm = pad2(shifted.getUTCMinutes());
  const ss = pad2(shifted.getUTCSeconds());
  const mss = pad3(shifted.getUTCMilliseconds());

  return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}.${mss}+07:00`;
}

/**
 * คำนวณช่วงวัน (00:00 -> 00:00 วันถัดไป) “ตามเวลาไทย”
 * คืนค่า { start: Date, end: Date } เป็น instant จริง
 */
function normalizeThaiDayRange(input) {
  const d = toDateAssumingThai(input) || new Date();

  // อ่านวัน/เดือน/ปี "ตามเวลาไทย" ด้วยวิธี shift +7 แล้วอ่านค่า UTC
  const shifted = new Date(d.getTime() + TH_OFFSET_MS);
  const y = shifted.getUTCFullYear();
  const m = shifted.getUTCMonth();
  const day = shifted.getUTCDate();

  // startThai (00:00 ไทย) => instant = Date.UTC(y,m,day,0,0,0) - offset
  const start = new Date(Date.UTC(y, m, day, 0, 0, 0, 0) - TH_OFFSET_MS);
  const end = new Date(Date.UTC(y, m, day + 1, 0, 0, 0, 0) - TH_OFFSET_MS);

  return { start, end };
}

/**
 * ได้ "ตอนนี้" แบบ timestamp เดียวกัน แต่ helper นี้ไว้ทำให้โค้ดอ่านชัดว่าต้องการเวลาไทย
 * (การเก็บลง DB เป็น instant เหมือนเดิม; จะไปมีผลจริงตอน format/normalize range)
 */
function now() {
  return new Date();
}

module.exports = {
  TH_OFFSET_MINUTES,
  isThaiTimeString,
  hasTimezoneInfo,
  toDateAssumingThai,
  toThaiISOString,
  normalizeThaiDayRange,
  now,
};

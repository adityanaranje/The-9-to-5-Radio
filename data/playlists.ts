// YouTube playlist IDs per station — sourced from environment variables.
//
// Set these in `.env.local` (or your deploy platform's environment variables).
// They use the NEXT_PUBLIC_ prefix so they are available to the browser at
// build time. The value is the part after `list=` in a playlist URL, e.g.
//   https://www.youtube.com/playlist?list=PLxxxxxxxxxxxxxxxxxxxxx
//       -> NEXT_PUBLIC_PLAYLIST_...=PLxxxxxxxxxxxxxxxxxxxxx
//
// Leave a value unset (or empty) to show a "coming soon" state for that station.
export const stationPlaylists: Record<string, string> = {
  'chai-break-fm': process.env.NEXT_PUBLIC_PLAYLIST_CHAI_BREAK_FM || '',
  'code-coffee': process.env.NEXT_PUBLIC_PLAYLIST_CODE_COFFEE || '',
  'office-commute': process.env.NEXT_PUBLIC_PLAYLIST_OFFICE_COMMUTE || '',
  'monday-survival': process.env.NEXT_PUBLIC_PLAYLIST_MONDAY_SURVIVAL || '',
  'deep-work-fm': process.env.NEXT_PUBLIC_PLAYLIST_DEEP_WORK_FM || '',
  'deadline-mode': process.env.NEXT_PUBLIC_PLAYLIST_DEADLINE_MODE || '',
  'post-lunch-fm': process.env.NEXT_PUBLIC_PLAYLIST_POST_LUNCH_FM || '',
  'friday-5-pm': process.env.NEXT_PUBLIC_PLAYLIST_FRIDAY_5PM || '',
  'salary-credited-fm': process.env.NEXT_PUBLIC_PLAYLIST_SALARY_CREDITED_FM || '',
  'wfh-radio': process.env.NEXT_PUBLIC_PLAYLIST_WFH_RADIO || '',
  'late-night-deployment': process.env.NEXT_PUBLIC_PLAYLIST_LATE_NIGHT_DEPLOYMENT || '',
  'leave-approved-fm': process.env.NEXT_PUBLIC_PLAYLIST_LEAVE_APPROVED_FM || '',
  'appraisal-season': process.env.NEXT_PUBLIC_PLAYLIST_APPRAISAL_SEASON || '',
  'notice-period-fm': process.env.NEXT_PUBLIC_PLAYLIST_NOTICE_PERIOD_FM || '',
  'corporate-burnout-fm': process.env.NEXT_PUBLIC_PLAYLIST_CORPORATE_BURNOUT_FM || '',
  'monsoon-desk-fm': process.env.NEXT_PUBLIC_PLAYLIST_MONSOON_DESK_FM || '',
};

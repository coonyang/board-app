/**
 * coonyang-library(node_modules 안의 외부 패키지)가 사용하는 Tailwind 클래스는
 * board-app 소스에 문자 그대로 등장하지 않아 기본 스캔 대상에서 빠진다.
 * `@source`로 node_modules를 직접 가리키면 Turbopack 개발 서버가 간헐적으로
 * 모듈 해석 경로를 오염시켜(dev 서버 hang) 여기 문자열로만 나열해 스캔되게 한다.
 * 렌더링되지 않는 파일이며, coonyang-library 버전을 올릴 때 className을 다시 맞춰야 한다.
 */
export const COONYANG_LIBRARY_CLASS_SAFELIST = `
  flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900
  flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400
  text-sm text-zinc-500 dark:text-zinc-400
  text-2xl font-bold text-zinc-900 dark:text-zinc-50
  rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900
  flex items-center gap-2
  shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400
  truncate text-lg font-bold text-zinc-900 dark:text-zinc-50
  ml-1 text-zinc-400
  mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400
  mt-3 text-xs text-zinc-400 dark:text-zinc-500
  inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400
`;

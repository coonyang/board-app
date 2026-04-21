interface ErrorMessageProps {
  error?: string;
}

const errorMap: Record<string, string> = {
  exists: "이미 존재하는 아이디입니다.",
  "need-login": "로그인이 필요합니다.",
  "not-found": "아이디를 찾을 수 없습니다.",
  forbidden: "권한이 없습니다.",
  "wrong-password": "비밀번호가 일치하지 않습니다.",
  "invalid-login": "아이디 또는 비밀번호를 확인해주세요.",
  "need-input": "제목과 내용을 모두 입력해주세요.",
  "invalid-login2": "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
};

export default function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;

  const message = errorMap[error] || "알 수 없는 오류가 발생했습니다.";

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{message}</p>
        </div>
      </div>
    </div>
  );
}

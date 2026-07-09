import { AlertCircle } from "lucide-react";

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
  "username-too-short": "아이디는 2자 이상이어야 합니다",
  "password-too-short": "비밀번호는 6자 이상이어야 합니다",
  "invalid-username": "아이디는 완성된 글자여야합니다.",
  "invalid-password": "비밀번호에 공백(스페이스)가 섞여있습니다.",
};

export default function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;

  const message = errorMap[error] || "알 수 없는 오류가 발생했습니다.";

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border-l-4 border-danger bg-danger/10 p-4">
      <AlertCircle size={18} className="shrink-0 text-danger" />
      <p className="text-sm font-medium text-danger">{message}</p>
    </div>
  );
}

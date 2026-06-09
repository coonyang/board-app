export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  let res = await fetch(input, init);

  if (res.status !== 401) {
    return res;
  }

  const refreshRes = await fetch("/api/auth/refresh", {
    method: "POST",
  });

  if (!refreshRes.ok) {
    window.location.href = "/login";
    throw new Error("Refresh failed");
  }

  res = await fetch(input, init);

  return res;
}

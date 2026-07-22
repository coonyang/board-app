"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { userIdToColor } from "@/lib/color";
import { Send } from "lucide-react";

type Direction = "up" | "down" | "left" | "right";

type RemotePlayer = {
  userId: string;
  nickname: string;
  x: number;
  y: number;
  direction: Direction;
  color: string;
  message: string | null;
};

type ChatMessage = {
  userId: string;
  nickname: string;
  content: string;
  createdAt: string;
};

const MOVE_KEYS: Record<string, Direction> = {
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
};

const TICK_MS = 50;
const STEP = 2.5;
const HEARTBEAT_MS = 400;
const POLL_MS = 1000;
const BUBBLE_MS = 5000;

export default function PlazaClient({
  userId,
  nickname,
}: {
  userId: string;
  nickname: string;
}) {
  const [pos, setPos] = useState({ x: 50, y: 55 });
  const [direction, setDirection] = useState<Direction>("down");
  const [room, setRoom] = useState<number | null>(null);
  const [players, setPlayers] = useState<RemotePlayer[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [myMessage, setMyMessage] = useState<{
    text: string;
    at: number;
  } | null>(null);
  const [chatInput, setChatInput] = useState("");

  const heldKeys = useRef<Set<Direction>>(new Set());
  const isTyping = useRef(false);
  const posRef = useRef(pos);
  const dirRef = useRef(direction);
  const chatLogRef = useRef<HTMLDivElement>(null);

  posRef.current = pos;
  dirRef.current = direction;

  const myColor = userIdToColor(userId);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTyping.current) return;
      const dir = MOVE_KEYS[e.code];
      if (!dir) return;
      e.preventDefault();
      heldKeys.current.add(dir);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const dir = MOVE_KEYS[e.code];
      if (!dir) return;
      heldKeys.current.delete(dir);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      const keys = heldKeys.current;
      if (keys.size === 0) return;

      let dx = 0;
      let dy = 0;
      if (keys.has("up")) dy -= 1;
      if (keys.has("down")) dy += 1;
      if (keys.has("left")) dx -= 1;
      if (keys.has("right")) dx += 1;

      if (dx === 0 && dy === 0) return;

      const norm = Math.sqrt(dx * dx + dy * dy);
      dx = (dx / norm) * STEP;
      dy = (dy / norm) * STEP;

      const nextDir: Direction =
        Math.abs(dy) >= Math.abs(dx)
          ? dy < 0
            ? "up"
            : "down"
          : dx < 0
            ? "left"
            : "right";

      setPos((prev) => ({
        x: Math.max(3, Math.min(97, prev.x + dx)),
        y: Math.max(8, Math.min(95, prev.y + dy)),
      }));
      setDirection(nextDir);
    }, TICK_MS);

    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchWithAuth("/api/plaza/join", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setRoom(data.room ?? 1);
      })
      .catch(() => {
        if (!cancelled) setRoom(1);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (room === null) return;

    const sendHeartbeat = () => {
      fetchWithAuth("/api/plaza/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x: posRef.current.x,
          y: posRef.current.y,
          direction: dirRef.current,
          room,
        }),
      }).catch(() => {});
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, HEARTBEAT_MS);

    const leave = () => {
      fetch("/api/plaza/leave", { method: "POST", keepalive: true }).catch(
        () => {},
      );
    };
    window.addEventListener("pagehide", leave);

    return () => {
      clearInterval(interval);
      window.removeEventListener("pagehide", leave);
      leave();
    };
  }, [room]);

  useEffect(() => {
    if (room === null) return;

    const poll = async () => {
      try {
        const res = await fetchWithAuth(`/api/plaza/state?room=${room}`);
        if (!res.ok) return;
        const data = await res.json();
        setPlayers(
          (data.players as RemotePlayer[]).filter((p) => p.userId !== userId),
        );
        setMessages(data.messages as ChatMessage[]);
      } catch {
        // 폴링 실패는 다음 주기에 재시도
      }
    };

    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => clearInterval(interval);
  }, [room, userId]);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!myMessage) return;
    const timeout = setTimeout(() => setMyMessage(null), BUBBLE_MS);
    return () => clearTimeout(timeout);
  }, [myMessage]);

  const sendChat = useCallback(async () => {
    const content = chatInput.trim();
    if (!content || room === null) return;

    setChatInput("");
    setMyMessage({ text: content, at: Date.now() });

    try {
      await fetchWithAuth("/api/plaza/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, room }),
      });
    } catch {
      // 전송 실패해도 로컬 말풍선은 유지
    }
  }, [chatInput, room]);

  if (room === null) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
        <h1 className="text-xl font-bold text-fg">만남의 광장</h1>
        <div className="flex h-[65vh] min-h-[420px] items-center justify-center rounded-2xl border border-border bg-surface text-muted">
          입장 중...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-fg">만남의 광장</h1>
        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
          {room}번 방
        </span>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative h-[65vh] min-h-[420px] flex-1 overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface to-surface-2 bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-[length:28px_28px]">
          <Decor />

          {players.map((p) => (
            <Avatar
              key={p.userId}
              x={p.x}
              y={p.y}
              color={p.color}
              nickname={p.nickname}
              message={p.message}
              smooth
            />
          ))}

          <Avatar
            x={pos.x}
            y={pos.y}
            color={myColor}
            nickname={`${nickname} (나)`}
            message={
              myMessage && Date.now() - myMessage.at < BUBBLE_MS
                ? myMessage.text
                : null
            }
            highlight
          />

          <div className="absolute bottom-3 left-3 rounded-lg bg-surface/80 px-3 py-1.5 text-xs text-muted backdrop-blur">
            방향키 / WASD로 이동
          </div>
        </div>

        <div className="flex w-full flex-col rounded-2xl border border-border bg-surface md:w-72">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold text-fg">
            채팅 ({players.length + 1}명 접속중)
          </div>
          <div
            ref={chatLogRef}
            className="flex h-64 flex-col gap-2 overflow-y-auto px-4 py-3 md:h-[calc(65vh-96px)]"
          >
            {messages.length === 0 && (
              <p className="text-sm text-muted">아직 채팅이 없어요.</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className="text-sm">
                <span className="font-semibold text-accent">
                  {m.nickname}
                </span>
                <span className="text-fg"> {m.content}</span>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendChat();
            }}
            className="flex gap-2 border-t border-border p-3"
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onFocus={() => (isTyping.current = true)}
              onBlur={() => (isTyping.current = false)}
              maxLength={200}
              placeholder="메시지 입력..."
              className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg outline-none placeholder:text-muted focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              aria-label="전송"
              className="flex items-center justify-center rounded-lg bg-accent px-3 text-accent-fg transition-colors hover:bg-accent-hover"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Avatar({
  x,
  y,
  color,
  nickname,
  message,
  highlight,
  smooth,
}: {
  x: number;
  y: number;
  color: string;
  nickname: string;
  message: string | null;
  highlight?: boolean;
  smooth?: boolean;
}) {
  return (
    <div
      className={`absolute flex -translate-x-1/2 -translate-y-full flex-col items-center ${
        smooth ? "transition-[left,top] duration-700 ease-linear" : ""
      }`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {message && (
        <div className="mb-1 max-w-[9rem] truncate rounded-xl bg-surface px-3 py-1.5 text-xs text-fg shadow-md ring-1 ring-border">
          {message}
        </div>
      )}
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-md ring-2 ${
          highlight ? "ring-accent" : "ring-transparent"
        }`}
        style={{ backgroundColor: color }}
      >
        {nickname.slice(0, 1)}
      </div>
      <span className="mt-1 rounded bg-surface/80 px-1.5 py-0.5 text-[10px] font-medium text-muted backdrop-blur">
        {nickname}
      </span>
    </div>
  );
}

function Decor() {
  const items = [
    { left: "8%", top: "18%", icon: "🌳" },
    { left: "88%", top: "22%", icon: "🌳" },
    { left: "15%", top: "70%", icon: "💺" },
    { left: "78%", top: "65%", icon: "💺" },
    { left: "50%", top: "12%", icon: "⛲" },
  ];
  return (
    <>
      {items.map((item, i) => (
        <span
          key={i}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-3xl opacity-70"
          style={{ left: item.left, top: item.top }}
        >
          {item.icon}
        </span>
      ))}
    </>
  );
}

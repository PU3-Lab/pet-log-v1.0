"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, Pill, SectionHeader } from "@/components/ui";
import { communityBoards, communityPosts } from "@/lib/mock-data";
import type { CommunityBoard, CommunityFeed } from "@/lib/types";

const feedFilters: CommunityFeed[] = ["인기글", "최신글", "내 주변"];

export default function CommunityPage() {
  const [activeBoard, setActiveBoard] = useState<CommunityBoard | null>(null);
  const [activeFeed, setActiveFeed] = useState<CommunityFeed>("인기글");

  const posts = useMemo(() => {
    return communityPosts.filter((post) => {
      const matchesFeed = post.feeds.includes(activeFeed);
      const matchesBoard = activeBoard ? post.board === activeBoard : true;
      return matchesFeed && matchesBoard;
    });
  }, [activeBoard, activeFeed]);

  return (
    <AppShell subtitle="커뮤니티" title="커뮤니티">
      <div className="space-y-5">
        <div className="grid grid-cols-5 gap-2">
          {communityBoards.map((item) => {
            const active = activeBoard === item;
            return (
              <button
                aria-pressed={active}
                className={`rounded-2xl p-2 text-center shadow-[0_8px_22px_rgba(49,65,44,0.06)] transition ${
                  active ? "bg-[#16804b] text-white" : "bg-white text-[#4a5547]"
                }`}
                key={item}
                onClick={() => setActiveBoard(active ? null : item)}
                type="button"
              >
                <div className={`mx-auto mb-2 h-10 w-10 rounded-full ${active ? "bg-white/25" : "bg-[#eef5e9]"}`} />
                <p className={`break-keep text-[11px] font-bold ${active ? "text-white" : "text-[#4a5547]"}`}>{item}</p>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          {feedFilters.map((filter) => (
            <Pill active={activeFeed === filter} key={filter} onClick={() => setActiveFeed(filter)}>
              {filter}
            </Pill>
          ))}
        </div>

        <section>
          <SectionHeader
            action={
              activeBoard ? (
                <button className="text-xs font-bold text-[#16804b]" onClick={() => setActiveBoard(null)} type="button">
                  전체 보기
                </button>
              ) : null
            }
            title={activeBoard ? `${activeBoard} ${activeFeed}` : activeFeed}
          />
          <div className="space-y-3">
            {posts.map((post) => (
              <Card className="p-4" key={post.title}>
                <p className="text-xs font-bold text-[#16804b]">{post.board}</p>
                <h2 className="mt-2 text-sm font-black text-[#1f2922]">{post.title}</h2>
                <p className="mt-2 text-xs font-semibold text-[#7c8777]">
                  댓글 {post.comments} · 공감 {post.likes}
                  {post.distance ? ` · ${post.distance}` : ""}
                </p>
              </Card>
            ))}
            {posts.length === 0 ? (
              <Card className="p-5 text-center">
                <h2 className="text-sm font-bold text-[#1f2922]">표시할 글이 없습니다.</h2>
                <p className="mt-2 text-sm leading-6 text-[#667262]">게시판이나 글 필터를 바꿔보세요.</p>
              </Card>
            ) : null}
          </div>
        </section>

        <button className="h-12 w-full rounded-2xl bg-[#16804b] text-base font-bold text-white shadow-[0_8px_22px_rgba(22,128,75,0.25)]">
          글쓰기
        </button>
      </div>
    </AppShell>
  );
}

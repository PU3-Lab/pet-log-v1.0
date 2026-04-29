"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, Pill, SectionHeader } from "@/components/ui";
import { createCommunityComment, createCommunityPost, getCommunityPostDetail, getCommunityPosts } from "@/lib/community";
import { communityBoards, communityComments, communityPosts } from "@/lib/mock-data";
import type { CommunityBoard, CommunityFeed } from "@/lib/types";

const feedFilters: CommunityFeed[] = ["인기글", "최신글", "내 주변"];

export default function CommunityPage() {
  const [posts, setPosts] = useState(communityPosts);
  const [comments, setComments] = useState(communityComments);
  const [activeBoard, setActiveBoard] = useState<CommunityBoard | null>(null);
  const [activeFeed, setActiveFeed] = useState<CommunityFeed>("인기글");
  const [selectedPostId, setSelectedPostId] = useState(communityPosts[0]?.id ?? "");
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [commentDraft, setCommentDraft] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [draftBoard, setDraftBoard] = useState<CommunityBoard>("자유게시판");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");

  const visiblePosts = useMemo(() => getCommunityPosts(posts, { feed: activeFeed, board: activeBoard }), [activeBoard, activeFeed, posts]);
  const selectedPost = useMemo(() => posts.find((post) => post.id === selectedPostId) ?? visiblePosts[0], [posts, selectedPostId, visiblePosts]);
  const selectedDetail = useMemo(
    () => (selectedPost ? getCommunityPostDetail(selectedPost, comments) : null),
    [comments, selectedPost],
  );

  function addComment() {
    if (!selectedPost || !commentDraft.trim()) {
      return;
    }

    const comment = createCommunityComment({ postId: selectedPost.id, body: commentDraft });
    setComments((current) => [comment, ...current]);
    setPosts((current) =>
      current.map((post) => (post.id === selectedPost.id ? { ...post, comments: post.comments + 1 } : post)),
    );
    setCommentDraft("");
  }

  function submitPost() {
    if (!draftTitle.trim() || !draftBody.trim()) {
      return;
    }

    const post = createCommunityPost({ board: draftBoard, title: draftTitle, body: draftBody });
    setPosts((current) => [post, ...current]);
    setSelectedPostId(post.id);
    setActiveBoard(draftBoard);
    setActiveFeed("최신글");
    setDraftTitle("");
    setDraftBody("");
    setIsComposerOpen(false);
  }

  function toggleSavedPost(postId: string) {
    setSavedPostIds((current) => (current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId]));
  }

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
                <button
                  className="text-xs font-bold text-[#16804b]"
                  onClick={() => {
                    setActiveBoard(null);
                    setSelectedPostId("");
                  }}
                  type="button"
                >
                  전체 보기
                </button>
              ) : null
            }
            title={activeBoard ? `${activeBoard} ${activeFeed}` : activeFeed}
          />
          <div className="space-y-3">
            {visiblePosts.map((post) => (
              <button
                className={`w-full rounded-2xl border bg-white p-4 text-left shadow-[0_8px_24px_rgba(49,65,44,0.06)] transition ${
                  selectedPost?.id === post.id ? "border-[#16804b]" : "border-[#e0e6da]"
                }`}
                key={post.id}
                onClick={() => setSelectedPostId(post.id)}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#16804b]">{post.board}</p>
                    <h2 className="mt-2 text-sm font-black leading-5 text-[#1f2922]">{post.title}</h2>
                  </div>
                  {savedPostIds.includes(post.id) ? (
                    <span className="rounded-full bg-[#fff2dd] px-2 py-1 text-[11px] font-black text-[#a4651a]">저장됨</span>
                  ) : null}
                </div>
                <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-[#667262]">{post.body}</p>
                <p className="mt-2 text-xs font-semibold text-[#7c8777]">
                  {post.authorName} · 댓글 {post.comments} · 공감 {post.likes}
                  {post.distance ? ` · ${post.distance}` : ""}
                </p>
              </button>
            ))}
            {visiblePosts.length === 0 ? (
              <Card className="p-5 text-center">
                <h2 className="text-sm font-bold text-[#1f2922]">표시할 글이 없습니다.</h2>
                <p className="mt-2 text-sm leading-6 text-[#667262]">게시판이나 글 필터를 바꿔보세요.</p>
              </Card>
            ) : null}
          </div>
        </section>

        {selectedDetail ? (
          <section>
            <SectionHeader title="상세" />
            <Card>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#16804b]">{selectedDetail.meta}</p>
                  <h2 className="mt-2 text-lg font-black leading-6 text-[#1f2922]">{selectedDetail.title}</h2>
                  <p className="mt-1 text-xs font-semibold text-[#7c8777]">
                    {selectedDetail.authorName} · {selectedDetail.createdAt}
                  </p>
                </div>
                <button
                  aria-pressed={savedPostIds.includes(selectedDetail.id)}
                  className={`h-10 shrink-0 rounded-xl px-3 text-sm font-black ${
                    savedPostIds.includes(selectedDetail.id) ? "bg-[#fff2dd] text-[#a4651a]" : "bg-[#edf8ed] text-[#16804b]"
                  }`}
                  onClick={() => toggleSavedPost(selectedDetail.id)}
                  type="button"
                >
                  저장
                </button>
              </div>
              <p className="mt-4 text-sm font-semibold leading-7 text-[#4d594b]">{selectedDetail.body}</p>
              {selectedDetail.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedDetail.tags.map((tag) => (
                    <span className="rounded-full bg-[#f0f3ed] px-3 py-1 text-xs font-bold text-[#667262]" key={tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </Card>
          </section>
        ) : null}

        {selectedDetail ? (
          <section>
            <SectionHeader title={`댓글 ${selectedDetail.commentItems.length}`} />
            <div className="space-y-3">
              <div className="rounded-2xl border border-[#e0e6da] bg-white p-3 shadow-[0_8px_24px_rgba(49,65,44,0.06)]">
                <textarea
                  className="min-h-20 w-full resize-none rounded-xl border border-[#dce7d7] bg-[#fbfdf8] p-3 text-sm font-semibold leading-6 text-[#1f2922] outline-none focus:border-[#16804b]"
                  onChange={(event) => setCommentDraft(event.target.value)}
                  placeholder="댓글을 입력하세요"
                  value={commentDraft}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    className="h-10 rounded-xl bg-[#16804b] px-4 text-sm font-black text-white disabled:bg-[#cfd8ca]"
                    disabled={!commentDraft.trim()}
                    onClick={addComment}
                    type="button"
                  >
                    댓글 등록
                  </button>
                </div>
              </div>

              {selectedDetail.commentItems.map((comment) => (
                <Card className="p-3" key={comment.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-[#1f2922]">{comment.authorName}</p>
                    <p className="text-xs font-semibold text-[#9aa393]">{comment.createdAt}</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#5c6758]">{comment.body}</p>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <button
            className="h-12 w-full rounded-2xl bg-[#16804b] text-base font-bold text-white shadow-[0_8px_22px_rgba(22,128,75,0.25)]"
            onClick={() => setIsComposerOpen((current) => !current)}
            type="button"
          >
            {isComposerOpen ? "글쓰기 닫기" : "글쓰기"}
          </button>

          {isComposerOpen ? (
            <Card className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                {communityBoards.map((board) => (
                  <Pill active={draftBoard === board} className="w-full px-2 text-xs" key={board} onClick={() => setDraftBoard(board)}>
                    {board}
                  </Pill>
                ))}
              </div>
              <input
                className="mt-3 h-11 w-full rounded-xl border border-[#dce7d7] bg-[#fbfdf8] px-3 text-sm font-bold text-[#1f2922] outline-none focus:border-[#16804b]"
                onChange={(event) => setDraftTitle(event.target.value)}
                placeholder="제목"
                value={draftTitle}
              />
              <textarea
                className="mt-3 min-h-28 w-full resize-none rounded-xl border border-[#dce7d7] bg-[#fbfdf8] p-3 text-sm font-semibold leading-6 text-[#1f2922] outline-none focus:border-[#16804b]"
                onChange={(event) => setDraftBody(event.target.value)}
                placeholder="내용을 입력하세요"
                value={draftBody}
              />
              <button
                className="mt-3 h-11 w-full rounded-xl bg-[#16804b] text-sm font-black text-white disabled:bg-[#cfd8ca]"
                disabled={!draftTitle.trim() || !draftBody.trim()}
                onClick={submitPost}
                type="button"
              >
                게시하기
              </button>
            </Card>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}

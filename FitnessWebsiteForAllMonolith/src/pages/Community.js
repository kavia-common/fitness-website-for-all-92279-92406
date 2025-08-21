import React, { useEffect, useState } from "react";
import { ForumAPI } from "../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";

export function CommunityHome() {
  const [topics, setTopics] = useState([]);
  useEffect(() => {
    ForumAPI.listTopics().then((d) => setTopics(d?.results || d || [])).catch(() => {});
  }, []);
  return (
    <main className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Community</h1>
        <Link to="/community/new" className="btn">New Topic</Link>
      </div>
      <ul>
        {topics.map((t) => (
          <li key={t.id} className="card" style={{ padding: ".8rem", margin: ".5rem 0" }}>
            <Link to={`/community/${t.id}`} style={{ fontWeight: 700 }}>{t.title}</Link>
            <p style={{ margin: 0 }}>{t.summary || t.body?.slice(0, 120)}</p>
          </li>
        ))}
        {topics.length === 0 && <p>No topics yet.</p>}
      </ul>
    </main>
  );
}

export function TopicDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [reply, setReply] = useState("");
  useEffect(() => {
    ForumAPI.getTopic(id).then(setTopic).catch(() => {});
  }, [id]);

  const onReply = async () => {
    if (!reply.trim()) return;
    try {
      const res = await ForumAPI.replyTopic(id, { body: reply });
      setTopic({ ...topic, posts: [...(topic.posts || []), res] });
      setReply("");
    } catch (e) {
      alert(e.message || "Reply failed");
    }
  };

  if (!topic) return <main className="container"><p>Loading...</p></main>;
  return (
    <main className="container">
      <article className="card" style={{ padding: "1rem" }}>
        <h1>{topic.title}</h1>
        <p>{topic.body}</p>
      </article>
      <section className="card" style={{ padding: "1rem", marginTop: "1rem" }}>
        <h2>Replies</h2>
        <ul>
          {(topic.posts || []).map((p) => (
            <li key={p.id} className="card" style={{ padding: ".6rem", margin: ".4rem 0" }}>
              <strong>{p.author?.name || "User"}</strong>
              <p style={{ margin: 0 }}>{p.body}</p>
            </li>
          ))}
          {(topic.posts || []).length === 0 && <li>No replies yet.</li>}
        </ul>
        <div className="form-row">
          <label htmlFor="reply">Add a reply</label>
          <textarea id="reply" className="input" rows={3} value={reply} onChange={(e) => setReply(e.target.value)} />
        </div>
        <button className="btn" onClick={onReply}>Reply</button>
      </section>
    </main>
  );
}

export function NewTopic() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();
  const onCreate = async () => {
    try {
      const data = await ForumAPI.createTopic({ title, body });
      navigate(`/community/${data.id}`);
    } catch (e) {
      alert(e.message || "Create topic failed");
    }
  };
  return (
    <main className="container">
      <section className="card" style={{ padding: "1rem" }}>
        <h1>Start a new topic</h1>
        <div className="form-row">
          <label htmlFor="t-title">Title</label>
          <input id="t-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-row">
          <label htmlFor="t-body">Body</label>
          <textarea id="t-body" className="input" rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <button className="btn" onClick={onCreate}>Create Topic</button>
      </section>
    </main>
  );
}

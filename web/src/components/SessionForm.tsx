import { Session } from "../types";

interface SessionFormProps {
  session: Session;
  onChange: (session: Session) => void;
  onSave: () => Promise<void> | void;
  onNew: () => void;
  onDelete: () => Promise<void> | void;
  sessions: Session[];
  onSelectExisting: (id: string) => void;
  isSaving: boolean;
}

export function SessionForm({
  session,
  onChange,
  onSave,
  onNew,
  onDelete,
  sessions,
  onSelectExisting,
  isSaving
}: SessionFormProps) {
  const handleField = (field: keyof Session, value: string) => {
    onChange({ ...session, [field]: value });
  };

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>Session setup</h2>
          <p className="panel-subtitle">Configure the main instructions and tags for this facilitation run.</p>
        </div>
        <div className="session-actions">
          <button type="button" onClick={onNew}>
            New session
          </button>
          {session._id && (
            <button type="button" className="danger" onClick={onDelete}>
              Delete
            </button>
          )}
          <button type="button" onClick={() => void onSave()} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      <div className="session-grid">
        <div>
          <label htmlFor="session-name">Name</label>
          <input
            id="session-name"
            value={session.name}
            onChange={(event) => handleField("name", event.target.value)}
            placeholder="BTS Q2 Trends"
          />
        </div>
        <div>
          <label htmlFor="session-owner">Created by</label>
          <input
            id="session-owner"
            value={session.createdBy ?? ""}
            onChange={(event) => handleField("createdBy", event.target.value)}
            placeholder="facilitator@bts.com"
          />
        </div>
        <div>
          <label htmlFor="session-picker">Load existing</label>
          <select
            id="session-picker"
            value={session._id ?? ""}
            onChange={(event) => onSelectExisting(event.target.value)}
          >
            <option value="">— Select a saved session —</option>
            {sessions.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="session-prompt">
        <label htmlFor="session-prompt">Main system prompt</label>
        <textarea
          id="session-prompt"
          value={session.systemPrompt}
          onChange={(event) => handleField("systemPrompt", event.target.value)}
          rows={6}
        />
      </div>
    </section>
  );
}

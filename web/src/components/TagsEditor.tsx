import { useState } from "react";
import { TagConfig } from "../types";
import clsx from "clsx";

interface TagsEditorProps {
  value: TagConfig[];
  onChange: (tags: TagConfig[]) => void;
}

const emptyTag: TagConfig = {
  key: "",
  subPrompt: ""
};

export function TagsEditor({ value, onChange }: TagsEditorProps) {
  const [draft, setDraft] = useState<TagConfig>(emptyTag);

  const handleAdd = () => {
    if (!draft.key.trim() || !draft.subPrompt.trim()) return;
    onChange([...value, { ...draft, patterns: draft.patterns?.filter(Boolean) }]);
    setDraft(emptyTag);
  };

  const updateTag = (index: number, updates: Partial<TagConfig>) => {
    const next = value.map((tag, i) => (i === index ? { ...tag, ...updates } : tag));
    onChange(next);
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h3>Tags &amp; Sub-prompts</h3>
          <p className="panel-subtitle">Detected tags append their sub-prompts to the main instructions for a single reply.</p>
        </div>
      </header>

      <div className="tag-list">
        {value.length === 0 && <p className="empty">No tags configured yet.</p>}
        {value.map((tag, index) => (
          <div key={tag.key || index} className="tag-item">
            <div className="tag-columns">
              <div>
                <label>Key</label>
                <input
                  value={tag.key}
                  onChange={(event) => updateTag(index, { key: event.target.value })}
                  placeholder="pricing"
                />
              </div>
              <div>
                <label>Description</label>
                <input
                  value={tag.description ?? ""}
                  onChange={(event) => updateTag(index, { description: event.target.value })}
                  placeholder="When pricing is shown"
                />
              </div>
              <div>
                <label>Threshold</label>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={tag.threshold ?? ""}
                  onChange={(event) =>
                    updateTag(index, {
                      threshold: event.target.value ? Number(event.target.value) : undefined
                    })
                  }
                  placeholder="0.6"
                />
              </div>
            </div>
            <div className="tag-columns">
              <div className="wide">
                <label>Sub-prompt</label>
                <textarea
                  value={tag.subPrompt}
                  onChange={(event) => updateTag(index, { subPrompt: event.target.value })}
                  placeholder="Confirm currency; present 3-tier price summary"
                />
              </div>
              <div className="wide">
                <label>Patterns / OCR hints</label>
                <input
                  value={tag.patterns?.join(", ") ?? ""}
                  onChange={(event) =>
                    updateTag(index, {
                      patterns: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                    })
                  }
                  placeholder="USD, pricing, price"
                />
              </div>
            </div>
            <button className="danger" onClick={() => removeTag(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className={clsx("tag-item", "tag-new")}
           onKeyDown={(event) => {
             if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
               event.preventDefault();
               handleAdd();
             }
           }}>
        <h4>Add Tag</h4>
        <div className="tag-columns">
          <div>
            <label>Key</label>
            <input value={draft.key} onChange={(event) => setDraft({ ...draft, key: event.target.value })} />
          </div>
          <div className="wide">
            <label>Sub-prompt</label>
            <input
              value={draft.subPrompt}
              onChange={(event) => setDraft({ ...draft, subPrompt: event.target.value })}
            />
          </div>
        </div>
        <div className="tag-columns">
          <div className="wide">
            <label>Patterns</label>
            <input
              value={draft.patterns?.join(", ") ?? ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  patterns: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                })
              }
            />
          </div>
          <div>
            <label>Threshold</label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={draft.threshold ?? ""}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  threshold: event.target.value ? Number(event.target.value) : undefined
                })
              }
            />
          </div>
        </div>
        <button onClick={handleAdd}>Add tag</button>
      </div>
    </section>
  );
}

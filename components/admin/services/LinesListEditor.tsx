'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { linesToList } from '@/lib/cms/services/schema';

type LinesListEditorProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function LinesListEditor({ id, value, onChange, placeholder }: LinesListEditorProps) {
  const items = value.split('\n');

  function updateLine(index: number, text: string) {
    const next = [...items];
    next[index] = text;
    onChange(next.join('\n'));
  }

  function addLine() {
    onChange(items.length === 1 && items[0] === '' ? '' : [...items, ''].join('\n'));
  }

  function removeLine(index: number) {
    const next = items.filter((_, i) => i !== index);
    onChange(next.join('\n'));
  }

  const displayItems = items.length === 0 ? [''] : items;

  return (
    <div className="space-y-2">
      {displayItems.map((line, index) => (
        <div key={`${id}-${index}`} className="flex gap-2">
          <Input
            id={index === 0 ? id : undefined}
            value={line}
            onChange={(e) => updateLine(index, e.target.value)}
            placeholder={placeholder ?? `Item ${index + 1}`}
            className="admin-field"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-white/65 hover:text-white"
            onClick={() => removeLine(index)}
            disabled={displayItems.length === 1 && !linesToList(value).length}
            aria-label={`Remove item ${index + 1}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-white/15 bg-transparent text-white hover:bg-white/5"
        onClick={addLine}
      >
        <Plus className="size-4" />
        Add item
      </Button>
    </div>
  );
}

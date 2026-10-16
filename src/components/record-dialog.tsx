import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type Field = {
  name: string; label: string; type?: string; required?: boolean;
  options?: string[]; defaultValue?: string;
};

export function RecordDialog({ title, fields, onSubmit, trigger }: {
  title: string; fields: Field[]; onSubmit: (v: Record<string, string | null>) => Promise<void>; trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const o: Record<string, string | null> = {};
    fd.forEach((v, k) => { const s = String(v).trim(); o[k] = s === "" ? null : s; });
    await onSubmit(o);
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button><Plus className="h-4 w-4" />{title}</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <form onSubmit={handle} className="grid gap-4">
          {fields.map((f) => (
            <div key={f.name}>
              <Label htmlFor={f.name}>{f.label}</Label>
              {f.options ? (
                <select id={f.name} name={f.name} defaultValue={f.defaultValue}
                  className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm capitalize">
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <Input id={f.name} name={f.name} type={f.type ?? "text"} required={f.required}
                  defaultValue={f.defaultValue} step={f.type === "number" ? "0.01" : undefined} className="mt-1" />
              )}
            </div>
          ))}
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const today = () => new Date().toISOString().slice(0, 10);

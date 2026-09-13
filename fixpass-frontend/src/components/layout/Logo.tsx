import { Send } from 'lucide-react'

/** Logo GuPass: avião de papel verde + "GU" (roxo) "PASS" (verde). */
export function Logo({ className }: { className?: string }) {
  return (
    <div className={className ?? 'flex items-center gap-1.5'}>
      <Send className="size-5 shrink-0 fill-brand-primary text-brand-primary" />
      <span className="text-lg font-black tracking-tight">
        <span className="text-brand-dark">GU</span>
        <span className="text-brand-primary">PASS</span>
      </span>
    </div>
  )
}

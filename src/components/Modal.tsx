import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  drawer?: boolean;
  wide?: boolean;
};

export default function Modal({ title, onClose, children, drawer = false, wide = false }: ModalProps) {
  const panel = useRef<HTMLElement>(null);
  const close = useRef(onClose);
  const reducedMotion = useReducedMotion();
  close.current = onClose;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const root = document.getElementById('root');
    document.body.style.overflow = 'hidden';
    root?.setAttribute('inert', '');
    const frame = requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close.current();
      if (event.key !== 'Tab' || !panel.current) return;
      const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls], [tabindex="0"]',
      )).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && (current === first || current === panel.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || current === panel.current)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      root?.removeAttribute('inert');
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <motion.div
      className={`modal-backdrop ${drawer ? 'drawer-backdrop' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <motion.section
        ref={panel}
        className={`dialog-panel ${drawer ? 'drawer-panel' : ''} ${wide ? 'dialog-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        initial={drawer ? { x: '100%' } : { y: 20, scale: 0.98 }}
        animate={drawer ? { x: 0 } : { y: 0, scale: 1 }}
        exit={drawer ? { x: '100%' } : { y: 12, scale: 0.98 }}
        transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="dialog-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={21} /></button>
        </header>
        <div className="dialog-content">{children}</div>
      </motion.section>
    </motion.div>,
    document.body,
  );
}
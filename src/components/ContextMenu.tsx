import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

export interface MenuItem {
  id: string;
  icon?: React.ElementType;
  label: string;
  shortcut?: string;
  dest?: string;
  danger?: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
}

export interface MenuSection {
  id: string;
  items: MenuItem[];
}

interface ContextMenuProps {
  trigger: React.ReactNode;
  sections: MenuSection[];
  align?: 'left' | 'right';
  className?: string;
}

export function ContextMenu({ trigger, sections, align = 'left', className }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Calculate position when opening
  const openMenu = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 220; // min-w-[220px]

      let left: number;
      if (align === 'right') {
        left = rect.right - menuWidth;
      } else {
        left = rect.left;
      }

      // Prevent going off the right edge
      if (left + menuWidth > window.innerWidth - 8) {
        left = window.innerWidth - menuWidth - 8;
      }
      // Prevent going off the left edge
      if (left < 8) {
        left = 8;
      }

      setPosition({
        top: rect.bottom + 4,
        left,
      });
    }
    setIsOpen(true);
  }, [align]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Close on scroll anywhere (menu might be mispositioned)
    const handleScroll = () => setIsOpen(false);

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={triggerRef}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (isOpen) {
            setIsOpen(false);
          } else {
            openMenu();
          }
        }}
        className="inline-flex items-center justify-center cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && position && createPortal(
        <div
          ref={menuRef}
          className={cn(
            "fixed z-[9999] min-w-[220px] rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-1.5 focus:outline-none",
            className
          )}
          style={{
            top: position.top,
            left: position.left,
            animation: 'fadeIn 0.15s ease-out both',
          }}
        >
          {sections.map((section, sIdx) => (
            <React.Fragment key={section.id}>
              {sIdx > 0 && <div className="h-px bg-slate-100 my-1.5 mx-2" />}
              <div className="px-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.onClick) item.onClick();
                      if (!item.hasSubmenu) setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-1.5 text-sm rounded-md transition-colors duration-150 outline-none",
                      item.danger
                        ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                      "group"
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          item.danger ? "text-red-500" : "text-slate-400 group-hover:text-slate-500"
                        )}
                      />
                    )}
                    <span className="flex-1 text-left font-medium">{item.label}</span>

                    {item.shortcut && (
                      <span className="text-[10px] tracking-widest font-bold uppercase text-slate-400 group-hover:text-slate-500 ml-3">
                        {item.shortcut}
                      </span>
                    )}

                    {item.hasSubmenu && (
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-500 ml-1 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

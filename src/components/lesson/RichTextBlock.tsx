import React from 'react';
import { RichTextBlockData } from '@/types';
import { Lightbulb, AlertTriangle, BookOpen, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RichTextBlockProps {
  data: RichTextBlockData;
}

export function RichTextBlock({ data }: RichTextBlockProps) {
  const calloutStyles = {
    tip: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      icon: <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-950',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    },
    grammar_note: {
      bg: 'bg-blue-50 border-blue-200 text-blue-950',
      icon: <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
    },
    cultural: {
      bg: 'bg-purple-50 border-purple-200 text-purple-950',
      icon: <Compass className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />,
    },
  };

  // Basic markdown-like rendering for headings and bullet points
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg md:text-xl font-bold text-gray-900 mt-4 mb-2">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl md:text-2xl font-bold text-gray-900 mt-5 mb-2.5">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-6 mb-3">
            {trimmed.replace('# ', '')}
          </h1>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-gray-700 leading-relaxed my-1">
            {renderInlineStyles(trimmed.substring(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+\.\s/, '');
        return (
          <li key={idx} className="ml-5 list-decimal text-gray-700 leading-relaxed my-1">
            {renderInlineStyles(itemText)}
          </li>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="border-l-4 border-emerald-500 bg-emerald-50/50 pl-4 py-2 my-2.5 italic text-gray-700 rounded-r-lg"
          >
            {renderInlineStyles(trimmed.replace('> ', ''))}
          </blockquote>
        );
      }

      return (
        <p key={idx} className="text-gray-700 leading-relaxed my-2 text-sm md:text-base">
          {renderInlineStyles(trimmed)}
        </p>
      );
    });
  };

  const renderInlineStyles = (text: string) => {
    // Basic bold parsing: **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      <div className="prose prose-emerald max-w-none">
        {renderFormattedContent(data.content)}
      </div>

      {data.callout && (
        <div
          className={cn(
            'flex items-start gap-3.5 p-4 md:p-5 rounded-2xl border transition-all mt-4',
            calloutStyles[data.callout.type]?.bg || calloutStyles.tip.bg
          )}
        >
          {calloutStyles[data.callout.type]?.icon || calloutStyles.tip.icon}
          <div className="flex-1">
            <h4 className="font-bold text-sm md:text-base mb-1">
              {data.callout.title}
            </h4>
            <p className="text-xs md:text-sm leading-relaxed opacity-90">
              {data.callout.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

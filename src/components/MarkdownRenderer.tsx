interface Props {
  content: string;
}

function parseInline(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-teal-50 text-teal-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
}

export default function MarkdownRenderer({ content }: Props) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-base font-bold text-teal-800 mt-3 mb-1.5 first:mt-0">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-sm font-semibold text-slate-700 mt-2 mb-1">
          {line.slice(4)}
        </h3>
      );
    } else if (line === '---') {
      elements.push(<hr key={key++} className="border-slate-200 my-2" />);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="space-y-1 my-1.5 ml-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
              <span className="text-teal-500 mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 block"></span>
              <span dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (line.match(/^\d+\. /)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      elements.push(
        <ol key={key++} className="space-y-1 my-1.5 ml-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
              <span className="text-teal-600 font-semibold shrink-0 text-xs mt-0.5">{idx + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    } else if (line.trim() === '') {
      // skip empty lines (handled by spacing)
    } else {
      elements.push(
        <p
          key={key++}
          className="text-sm text-slate-700 leading-relaxed my-0.5"
          dangerouslySetInnerHTML={{ __html: parseInline(line) }}
        />
      );
    }

    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

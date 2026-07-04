import React from 'react';
import useThemeStore from '../store/themeStore.js';
import DataService from '../api/dataService.js';

const ExportBookmarks = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const exportToJSON = () => {
    const bookmarks = DataService.getBookmarks();
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      bookmarks: bookmarks.map(b => ({
        title: b.title,
        source: b.source,
        url: b.url,
        published: b.published,
        bookmarkedAt: b.bookmarkedAt,
        description: b.description
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `news-monitor-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const bookmarks = DataService.getBookmarks();
    const headers = ['Title', 'Source', 'URL', 'Published', 'Bookmarked At', 'Description'];
    const rows = bookmarks.map(b => [
      `"${b.title?.replace(/"/g, '""') || ''}"`,
      `"${b.source?.replace(/"/g, '""') || ''}"`,
      `"${b.url?.replace(/"/g, '""') || ''}"`,
      `"${b.published || ''}"`,
      `"${b.bookmarkedAt || ''}"`,
      `"${b.description?.replace(/"/g, '""').replace(/\n/g, ' ') || ''}"`
    ]);

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `news-monitor-bookmarks-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToText = () => {
    const bookmarks = DataService.getBookmarks();
    const text = bookmarks.map((b, i) => `
[${i + 1}] ${b.title}
Source: ${b.source}
URL: ${b.url}
Published: ${b.published ? new Date(b.published).toLocaleDateString() : 'N/A'}
Bookmarked: ${b.bookmarkedAt ? new Date(b.bookmarkedAt).toLocaleDateString() : 'N/A'}
${b.description || ''}
${'-'.repeat(60)}
`).join('\n');

    const blob = new Blob([`News Monitor Bookmarks\nExported: ${new Date().toLocaleDateString()}\n\n${text}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `news-monitor-bookmarks-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>📤 Export Bookmarks</h3>
      <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Export your bookmarked articles in various formats
      </p>
      <div className="space-y-3">
        <button
          onClick={exportToJSON}
          className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium`}
        >
          📄 Export as JSON
        </button>
        <button
          onClick={exportToCSV}
          className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white font-medium`}
        >
          📊 Export as CSV
        </button>
        <button
          onClick={exportToText}
          className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors ${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white font-medium`}
        >
          📝 Export as Text
        </button>
      </div>
      <p className={`text-xs mt-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        Exported {DataService.getBookmarks().length} bookmarks
      </p>
    </div>
  );
};

export default ExportBookmarks;

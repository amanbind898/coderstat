"use client";
import React, { useState } from 'react';

export default function QuestionImporter() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [jsonData, setJsonData] = useState('');
  
  const handleImport = async () => {
    setLoading(true);
    try {
      const parsedData = JSON.parse(jsonData);

      const response = await fetch('/api/questions/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import questions');
      }

      setResult(data);
    } catch (error) {
      console.error('Import error:', error);
      setResult({
        added: 0,
        skipped: 0,
        errors: [error.message],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setJsonData(e.target?.result);
    };
    reader.readAsText(file); // ✅ keep only once
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Import Questions</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload JSON File
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or Paste JSON Data
          </label>
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-40"
            placeholder='{"Sheet1": [{"Topic:": "Array", "Problem: ": "Reverse the array", "Done": "<->", "URL": "https://example.com"}]}'
          />
        </div>

        <button
          onClick={handleImport}
          disabled={loading || !jsonData}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300"
        >
          {loading ? 'Importing...' : 'Import Questions'}
        </button>

        {result && (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="font-medium">Import Results:</h3>
            <p>Added: {result.added} questions</p>
            <p>Skipped: {result.skipped} questions</p>

            {result.errors.length > 0 && (
              <div className="mt-2">
                <h4 className="font-medium text-red-600">Errors:</h4>
                <ul className="list-disc pl-5 text-sm text-red-600">
                  {result.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { CodeSnippet, ProgrammingLanguage } from '../types';
import { api } from '../services/api';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-themes-all';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, description: string, codes: { language_id: number; code: string }[]) => void;
}

export default function CodeSnippetModal({ isOpen, onClose, onSubmit }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [snippets, setSnippets] = useState<{ language_id: number; code: string }[]>([
        { language_id: 1, code: '' }
    ]);
    const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        try {
            const data = await api.getLanguages();
            setLanguages(data);
            // Set first language as default
            if (data.length > 0) {
                setSnippets([{ language_id: data[0].id, code: '' }]);
            }
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(title, description, snippets);
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setSnippets([{ language_id: 1, code: '' }]);
    };

    const addSnippet = () => {
        setSnippets([...snippets, { language_id: 1, code: '' }]);
    };

    const removeSnippet = (index: number) => {
        setSnippets(snippets.filter((_, i) => i !== index));
    };

    const updateSnippet = (index: number, field: keyof { language_id: number; code: string }, value: string | number) => {
        const newSnippets = [...snippets];
        newSnippets[index] = { ...newSnippets[index], [field]: value };
        setSnippets(newSnippets);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Add Code Snippet</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter snippet title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                rows={3}
                                placeholder="Describe your code snippet"
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700">Code Snippets</label>
                                <button
                                    type="button"
                                    onClick={addSnippet}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                >
                                    Add Snippet
                                </button>
                            </div>

                            {snippets.map((snippet, index) => (
                                <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <select
                                            value={snippet.language_id.toString()}
                                            onChange={(e) => updateSnippet(index, 'language_id', e.target.value)}
                                            className="px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {languages.map((lang) => (
                                                <option key={lang.id} value={lang.id}>
                                                    {lang.name.charAt(0).toUpperCase() + lang.name.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        {snippets.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSnippet(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <CodeMirror
                                        value={snippet.code}
                                        height="200px"
                                        theme={vscodeDark}
                                        onChange={(value) => updateSnippet(index, 'code', value)}
                                        className="overflow-hidden rounded-lg"
                                        basicSetup={{
                                            lineNumbers: true,
                                            highlightActiveLineGutter: true,
                                            highlightActiveLine: true,
                                            foldGutter: true,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save Snippet
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ProgrammingLanguage, NewProgrammingLanguage } from '../../types';
import { PlusCircleIcon, TrashIcon, ExclamationCircleIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const LanguageManagement: React.FC = () => {
    const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
    const [newLanguage, setNewLanguage] = useState<NewProgrammingLanguage>({ name: '', code: '' });
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        try {
            const response = await api.getLanguages();
            setLanguages(response);
        } catch (err) {
            setError('Failed to fetch languages');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createLanguage(newLanguage);
            setNewLanguage({ name: '', code: '' });
            fetchLanguages();
        } catch (err) {
            setError('Failed to create language');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.deleteLanguage(id);
            fetchLanguages();
            setDeleteConfirm(null);
        } catch (err) {
            setError('Failed to delete language');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>Language Management</span>
            </h2>

            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Language Name"
                        value={newLanguage.name}
                        onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                        className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Language Code"
                        value={newLanguage.code}
                        onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
                        className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-32"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <PlusCircleIcon className="h-5 w-5" />
                        Add Language
                    </button>
                </div>
            </form>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Code</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {languages.map((language) => (
                            <tr key={language.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{language.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{language.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{language.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {deleteConfirm === language.id ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-600 flex items-center">
                                                <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 mr-1" />
                                                Confirm delete?
                                            </span>
                                            <button
                                                onClick={() => handleDelete(language.id)}
                                                className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1"
                                            >
                                                <CheckCircleIcon className="h-5 w-5" />
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                                            >
                                                <XCircleIcon className="h-5 w-5" />
                                                No
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(language.id)}
                                            className="text-red-600 hover:text-red-900 font-medium flex items-center gap-1"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LanguageManagement;
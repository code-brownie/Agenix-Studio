'use client'

import React, { useState } from 'react';
import { Search, Play, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { chatSession } from '@/utils/GeminiModel';

interface ImageResult {
    link: string
    image: {
        contextLink: string
    }
    title: string
}

interface VideoResult {
    videoId: string
    title: string
    thumbnail: string
}

export default function IntegratedSearch() {
    // Shared state
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Website Recommendation State
    const [jsonResponse, setJsonResponse] = useState('');

    // Media Search States
    const [imageResults, setImageResults] = useState<ImageResult[]>([]);
    const [videoResults, setVideoResults] = useState<VideoResult[]>([]);
    const [activeTab, setActiveTab] = useState<'recommendations' | 'images' | 'videos'>('recommendations');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setImageResults([]);
        setVideoResults([]);
        setJsonResponse('');

        try {
            // Website Recommendations
            const inputPrompt = `Keywords: ${query}. Based on these keywords, provide recommendations for building a website using a website builder on our platform. The user does not need to code, and the recommendations should focus on leveraging the platform's features. The response should be in the following valid JSON format: \n\n{
                "recommendations": [
                    {
                        "title": "Title of Recommendation",
                        "description": "Detailed description of the recommendation, tailored to the website builder's features."
                    },
                    ...
                ]
            }`;

            const recommendationResult = await chatSession.sendMessage(inputPrompt);
            const rawResponse = recommendationResult.response.text();
            const cleanedResponse = rawResponse.replace('```json', '').replace('```', '');
            setJsonResponse(cleanedResponse);

            // Image Search
            const imageEndpoint = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
                query.trim()
            )}&cx=${process.env.NEXT_PUBLIC_CUSTOM_SEARCH_ENGINE_ID}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&searchType=image&num=10`;

            // Video Search
            const videoEndpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                query.trim()
            )}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&type=video&maxResults=10`;

            const [imageResponse, videoResponse] = await Promise.all([
                fetch(imageEndpoint),
                fetch(videoEndpoint)
            ]);

            const imageData = await imageResponse.json();
            const videoData = await videoResponse.json();

            if (!imageResponse.ok || !videoResponse.ok) {
                throw new Error('Failed to fetch media');
            }

            setImageResults(imageData.items || []);
            setVideoResults(
                videoData.items.map((video: any) => ({
                    videoId: video.id.videoId,
                    title: video.snippet.title,
                    thumbnail: video.snippet.thumbnails.high.url
                }))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const parseAndDisplayRecommendations = () => {
        try {
            const parsedResponse = JSON.parse(jsonResponse);
            return (
                <ul className="space-y-3 text-gray-700">
                    {parsedResponse.recommendations.map((rec: any, index: number) => (
                        <li key={index} className="bg-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-semibold text-blue-700 mb-2">{rec.title}</h3>
                            <p className="text-sm">{rec.description}</p>
                        </li>
                    ))}
                </ul>
            );
        } catch (error) {
            return <p className="text-red-500 bg-red-50 p-3 rounded-md">Invalid JSON response format.</p>;
        }
    };

    return (
        <div className="px-8 mx-auto py-8 bg-gray-900 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center text-white mb-10">Recommendation Explorer</h1>

            <form onSubmit={handleSubmit} className="mb-8 flex justify-center items-center space-x-4">
                <div className="relative w-full max-w-xl">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter keywords for website, images, and videos..."
                        className="w-full px-4 py-3 pl-10 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-300"
                        required
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md transition duration-300"
                >
                    <Search className="w-5 h-5" />
                    <span>{loading ? 'Searching...' : 'Search'}</span>
                </button>
            </form>

            {error && (
                <div className="text-red-500 text-center mb-4 bg-red-50 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {loading && (
                <div className="text-center text-white animate-pulse">
                    Loading results...
                </div>
            )}

            <div className="flex justify-center mb-6">
                <div className="bg-white rounded-full shadow-md inline-flex">
                    <button
                        onClick={() => setActiveTab('recommendations')}
                        className={`px-6 py-2 rounded-full transition-colors ${activeTab === 'recommendations'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Recommendations
                    </button>
                    <button
                        onClick={() => setActiveTab('images')}
                        className={`px-6 py-2 rounded-full transition-colors ${activeTab === 'images'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Images
                    </button>
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`px-6 py-2 rounded-full transition-colors ${activeTab === 'videos'
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Videos
                    </button>
                </div>
            </div>

            {activeTab === 'recommendations' && jsonResponse && (
                <div className="mt-8 space-y-4">
                    <h2 className="text-2xl font-semibold text-blue-800">Website Recommendations:</h2>
                    {parseAndDisplayRecommendations()}
                </div>
            )}

            {activeTab === 'images' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {imageResults.map((img, index) => (
                        <div key={index} className="relative group">
                            <a
                                href={img.image.contextLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <Image
                                        src={img.link}
                                        alt={img.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                        <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'videos' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {videoResults.map((video, index) => (
                        <div key={index} className="relative group">
                            <a
                                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <div className="relative aspect-video overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <Image
                                        src={video.thumbnail}
                                        alt={video.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                        <Play className="text-white w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <p className="mt-2 text-center text-white line-clamp-2 text-sm">{video.title}</p>
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && query &&
                (activeTab === 'images' && imageResults.length === 0) &&
                (activeTab === 'videos' && videoResults.length === 0) &&
                (activeTab === 'recommendations' && !jsonResponse) && (
                    <div className="text-center text-gray-600 bg-white p-6 rounded-lg shadow-md">
                        No results found. Try a different search term.
                    </div>
                )}
        </div>
    );
}
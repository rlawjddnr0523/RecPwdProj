import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // 아이콘 라이브러리 (lucide-react)
import { AnimatePresence, motion } from "framer-motion"; // 부드러운 애니메이션 라이브러리 (framer-motion)

const App: React.FC = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState<string[]>([]);

    const addKeyword = () => {
        if (keyword.trim() && !keywords.includes(keyword.trim())) {
            setKeywords([...keywords, keyword.trim()]);
            setKeyword('');
        }
    };

    const handleSubmit = async () => {
        if (!password) return;

        const res = await fetch('http://localhost:8000/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password, keywords }),
        });

        const data = await res.json();
        setRecommendations(data.recommendations);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">비밀번호 추천기</h1>

                <div className="relative mb-4">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-0 pr-10 z-10" // focus:ring-0로 파란색 하이라이트 제거
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none hover:outline-none active:outline-none !bg-transparent" // focus:outline-none으로 아이콘 버튼의 테두리 제거
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="flex mb-4">
                    <input
                        type="text"
                        placeholder="키워드 입력"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-0"
                    />
                    <button
                        onClick={addKeyword}
                        className="bg-blue-600 text-black px-4 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-0"
                    >
                        추가
                    </button>
                </div>
                <AnimatePresence>
                    {keywords.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">추가된 키워드:</p>
                            <div className="flex flex-wrap gap-2">
                                {keywords.map((kw, idx) => (
                                    <motion.div
                                        key={kw}
                                        onClick={() =>
                                            setKeywords(keywords.filter((_, i) => i !== idx))
                                        }
                                        className="inline-flex items-center bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium px-3 py-1 rounded-full cursor-pointer transition-all group mr-2 mb-2"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <span>{kw}</span>
                                        <span className="ml-2 text-blue-500 group-hover:text-blue-700 text-xs">✕</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </AnimatePresence>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 text-black py-2 rounded-lg hover:bg-green-700 transition"
                >
                    추천 받기
                </button>

                {recommendations.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2">추천 비밀번호:</h2>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                            {recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;

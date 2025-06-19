import React, { useState } from 'react';
import * as motion from "motion/react-client"; // 부드러운 애니메이션 라이브러리 (motion)
import { AnimatePresence } from "motion/react";
import generateRandomString from "./assets/RequestPWD.ts";


const App: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [pwdLength, setPwdLength] = useState(20);
    const [pwdSpecLet, setPwdSpecLet] = useState(false);
    const [pwdUpperCase, setPwdUpperCase] = useState(false);

    const addKeyword = () => {
        if (keyword.trim() && !keywords.includes(keyword.trim())) {
            setKeywords([...keywords, keyword.trim()]);
            setKeyword('');
        }
    };

    const onlyEngKeyword = (value: string) => {
        return value.replace(/[\u3131-\u318E\uAC00-\uD7A3\u1100-\u11FF\u3000-\u303F\u4E00-\u9FFF\u3040-\u30FF\uFF00-\uFFEF]/g, "");
    };

    const handleSubmit = async (
        length:number,
        includeUppercase:boolean,
        includeSpecialChars:boolean,
        keywords:string[]
    ) => {

        const random = generateRandomString({
            length: length,
            includeUppercase: includeUppercase,
            includeSpecialChars: includeSpecialChars,
            keywords: keywords,
            excludeStrings: ['123', '1234', 'password', 'qwerty', 'abc', '1111', '0000'],
        });

        setRecommendations([random]);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-6">
            <div className="bg-white dark:bg-black shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-1 text-center">비밀번호 추천기</h1>
                <h4 className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                    비밀번호는 최소 10자리에서 최대 40자리까지 설정가능하고,<br/> 영문 키워드만 입력가능합니다!
                </h4>

                <div className="flex mb-4">
                    <input
                        type="text"
                        placeholder="키워드 입력"
                        value={keyword}
                        onChange={(e) => setKeyword(onlyEngKeyword(e.target.value))}
                        onKeyUp={(e) => {
                            if (e.code === 'Space' || e.code === 'Enter' ||e.key === ' ') {
                                const trimmed = onlyEngKeyword(keyword).trim();
                                if (trimmed) {
                                    setKeywords([...keywords, trimmed]);
                                    setKeyword(""); // 입력창 비우기
                        }}}}
                        className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-0"
                    />

                    <button
                        onClick={addKeyword}
                        className="bg-blue-600 text-black dark:text-white px-4 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-0"
                    >
                        추가
                    </button>
                </div>
                <AnimatePresence mode={"wait"}>
                {keywords.length > 0 && (
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">추가된 키워드:</p>
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
                                    transition={{ duration: 0.3 }}
                                >
                                    <span>{kw}</span>
                                    <span className="ml-2 text-blue-500 group-hover:text-blue-700 text-xs">✕</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
                </AnimatePresence>

                <div className="">
                    <label>추천받을 비밀번호의 길이: </label>
                    <input
                        className="ml-2 border-b"
                        type="number"
                        min="10" max="40" step="1"
                        value={pwdLength}
                        onChange={(e) => setPwdLength(e.target.valueAsNumber)}
                    />
                    <label className={"text-xs"}>자리</label>
                    <input
                        className="my-2 w-96 appearance-none outline-none h-4 rounded-2xl bg-gradient-to-r from-red-500 to-green-500 thumb"
                        type="range"
                        min="10" max="40" step="1"
                        value={pwdLength}
                        onChange={(e) => setPwdLength(e.target.valueAsNumber)}
                    />
                </div>

                <div className="mb-4">
                    <label>특수문자 넣을까요? </label>
                    <input
                        type='checkbox'
                        checked={pwdSpecLet}
                        onChange={(e) => setPwdSpecLet(e.target.checked)}
                    />

                    <AnimatePresence mode="wait">
                        <motion.label
                            key={pwdSpecLet ? "yes" : "no"}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className={`align-text-bottom text-sm ${pwdSpecLet ? "text-green-500" : "text-red-500"}`}
                        >
                            {pwdSpecLet ? " ✅ 네!" : " ❌ 아니요.."}
                        </motion.label>
                    </AnimatePresence>
                    <br/>
                    <label>대문자 사용할까요? </label>
                    <input
                        type='checkbox'
                        checked={pwdUpperCase}
                        onChange={(e) => setPwdUpperCase(e.target.checked)}
                    />
                    <AnimatePresence mode="wait">
                        <motion.label
                            key={pwdUpperCase ? "yes" : "no"}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className={`align-text-bottom text-sm ${pwdUpperCase ? "text-green-500" : "text-red-500"}`}
                        >
                            {pwdUpperCase ? " ✅ 네!" : " ❌ 아니요.."}
                        </motion.label>
                    </AnimatePresence>
                </div>

                <button
                    onClick={() => handleSubmit(pwdLength, pwdUpperCase, pwdSpecLet, keywords)}
                    className="w-full bg-green-600 text-black dark:text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                    추천 받기
                </button>

                {recommendations.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2">추천 비밀번호:</h2>
                        <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-400">
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

function generateRandomString(options: {
    length: number;
    includeUppercase?: boolean;
    includeSpecialChars?: boolean;
    keywords?: string[];
    excludeStrings?: string[]; // 이 부분 추가됨
    maxRetries?: number;       // 무한 루프 방지용
}): string {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$^&*?';

    let charPool = lowercaseChars + numberChars;

    if (options.includeUppercase) {
        charPool += uppercaseChars;
    }
    if (options.includeSpecialChars) {
        charPool += specialChars;
    }

    const {
        length,
        keywords = [],
        excludeStrings = [],
        maxRetries = 1000,
    } = options;

    const keywordString = keywords.join('');
    const remainingLength = Math.max(0, length - keywordString.length);

    const insertAt = (str: string, insert: string, index: number) =>
        str.slice(0, index) + insert + str.slice(index);

    // 랜덤 문자열을 생성하고 조건 검사까지 포함
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        let result = '';

        for (let i = 0; i < remainingLength; i++) {
            const randomIndex = Math.floor(Math.random() * charPool.length);
            result += charPool[randomIndex];
        }

        for (const keyword of keywords) {
            const insertPos = Math.floor(Math.random() * (result.length + 1));
            result = insertAt(result, keyword, insertPos);
        }

        result = result.slice(0, length);

        const hasExcluded = excludeStrings.some(ex => result.includes(ex));
        if (!hasExcluded) {
            return result;
        }
    }

    throw new Error('조건에 맞는 문자열을 생성할 수 없습니다. 제외 조건이 너무 엄격할 수 있습니다.');
}

export default generateRandomString;

const firebaseConfig = {
  apiKey: "AIzaSyCzGtWktDSj8WLAW-1Ov0U-L0Z2K9UXLxg",
  authDomain: "game-15767.firebaseapp.com",
  databaseURL: "https://game-15767-default-rtdb.firebaseio.com",
  projectId: "game-15767",
  storageBucket: "game-15767.firebasestorage.app",
  messagingSenderId: "764363656874",
  appId: "1:764363656874:web:a9f3eeda14e0cd7be70ad3"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth(); 
const mainMenu = document.getElementById('main-menu');
const authSection = document.getElementById('auth-section');
const authTitle = document.getElementById('auth-title');
const authUsernameInput = document.getElementById('auth-username'); 
const authEmailInput = document.getElementById('auth-email');
const authPasswordInput = document.getElementById('auth-password');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authStatus = document.getElementById('auth-status');
const registerLink = document.getElementById('register-link');
const loginLink = document.getElementById('login-link');
const registerLinkContainer = document.getElementById('register-link-container');
const loginLinkContainer = document.getElementById('login-link-container');
const welcomeMessage = document.getElementById('welcome-message'); 


const startKanaPracticeBtn = document.getElementById('start-kana-practice');
const kanaPracticeSection = document.getElementById('kana-practice-section');
const kanaDisplay = document.getElementById('kana-display');
const kanaOptionsContainer = document.getElementById('kana-options');
const kanaFeedback = document.getElementById('kana-feedback');
const nextKanaBtn = document.getElementById('nextKana');
const kanaScoreDisplay = document.getElementById('kana-score-display');
const menuToggleKana = document.getElementById('menu-toggle-kana');

const startVocabularyPracticeBtn = document.getElementById('start-vocabulary-practice');
const vocabularyPracticeSection = document.getElementById('vocabulary-practice-section');
const vocabularyDisplay = document.getElementById('vocabulary-display');
const vocabularyOptionsContainer = document.getElementById('vocabulary-options');
const vocabularyFeedback = document.getElementById('vocabulary-feedback');
const nextVocabularyBtn = document.getElementById('nextVocabulary');
const vocabularyScoreDisplay = document.getElementById('vocabulary-score-display');
const menuToggleVocabulary = document.getElementById('menu-toggle-vocabulary');

const startTranslationPracticeBtn = document.getElementById('start-translation-practice');
const translationPracticeSection = document.getElementById('translation-practice-section');
const translationQuestionDisplay = document.getElementById('translation-question-display');
const translationInput = document.getElementById('translation-input');
const checkTranslationBtn = document.getElementById('checkTranslation');
const translationFeedback = document.getElementById('translation-feedback');
const nextTranslationBtn = document.getElementById('nextTranslation');
const translationScoreDisplay = document.getElementById('translation-score-display');
const menuToggleTranslation = document.getElementById('menu-toggle-translation');


const gameMenuOverlay = document.getElementById('game-menu-overlay'); 
const resumeGameBtn = document.getElementById('resume-game');
const returnToMainBtn = document.getElementById('return-to-main');
const exitGameBtn = document.getElementById('exit-game');

const viewLeaderboardBtn = document.getElementById('view-leaderboard'); 
const leaderboardSection = document.getElementById('leaderboard-section');
const leaderboardList = document.getElementById('leaderboard-list');
const backToMainMenuFromLeaderboardBtn = document.getElementById('backToMainMenuFromLeaderboard');

const mainMenuToggle = document.getElementById('main-menu-toggle');
const mainMenuOverlay = document.getElementById('main-menu-overlay');
const viewLeaderboardFromMenuBtn = document.getElementById('view-leaderboard-from-menu');
const logoutFromMenuBtn = document.getElementById('logout-from-menu');
const closeMainMenuOverlayBtn = document.getElementById('close-main-menu-overlay');

let currentKanaIndex = 0;
let kanaScore = 0;
let kanaData = {};
let kanaPracticeMode = '';

let currentVocabularyIndex = 0;
let vocabularyScore = 0;
let vocabularyData = {};

let currentTranslationIndex = 0;
let translationScore = 0;
let translationData = {};

let currentPracticeType = ''; 

fetch('database.txt')
    .then(response => response.json())
    .then(data => {
        kanaData = data.kana_practice; 
        vocabularyData = data.vocabulary;
        translationData = data.sentences_translation;
    })
    .catch(error => console.error('Error loading database.txt:', error));

auth.onAuthStateChanged(user => {
    if (user) {
        showMainMenu();
    } else {
        authEmailInput.value = '';
        authPasswordInput.value = '';
        authUsernameInput.value = ''; 
        authStatus.textContent = '';
        mainMenu.classList.add('hidden');
        kanaPracticeSection.classList.add('hidden');
        vocabularyPracticeSection.classList.add('hidden');
        translationPracticeSection.classList.add('hidden');
        leaderboardSection.classList.add('hidden');
        gameMenuOverlay.classList.add('hidden'); 
        mainMenuOverlay.classList.add('hidden'); 
        authSection.classList.remove('hidden'); 
        authTitle.textContent = '登入';
        authSubmitBtn.textContent = '登入';
        authUsernameInput.classList.add('hidden'); 
        registerLinkContainer.classList.remove('hidden');
        loginLinkContainer.classList.add('hidden');
    }
});

registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    authTitle.textContent = '註冊';
    authSubmitBtn.textContent = '註冊';
    authUsernameInput.classList.remove('hidden'); 
    registerLinkContainer.classList.add('hidden');
    loginLinkContainer.classList.remove('hidden');
    authStatus.textContent = ''; 
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    authTitle.textContent = '登入';
    authSubmitBtn.textContent = '登入';
    authUsernameInput.classList.add('hidden'); 
    registerLinkContainer.classList.remove('hidden');
    loginLinkContainer.classList.add('hidden');
    authStatus.textContent = '';
});


authSubmitBtn.addEventListener('click', () => {
    const email = authEmailInput.value;
    const password = authPasswordInput.value;
    const username = authUsernameInput.value; 

    authStatus.textContent = '';

    if (authTitle.textContent === '註冊') {
        
        if (!username) { 
            authStatus.textContent = '使用者名稱不能為空！';
            authStatus.style.color = 'red';
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return user.updateProfile({
                    displayName: username
                }).then(() => {
                    authStatus.textContent = `註冊成功！歡迎 ${user.displayName}`;
                    authStatus.style.color = 'green';
                    setTimeout(() => {
                        showMainMenu(); 
                    }, 1500); 
                    database.ref('users/' + user.uid).set({
                        username: username,
                        email: email,
                        score: 0 
                    });
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("註冊失敗:", error);
                if (errorCode === 'auth/email-already-in-use') {
                    authStatus.textContent = '此電子郵件已被註冊。';
                } else if (errorCode === 'auth/invalid-email') {
                    authStatus.textContent = '電子郵件格式無效。';
                } else if (errorCode === 'auth/weak-password') {
                    authStatus.textContent = '密碼至少需要6個字元。';
                } else {
                    authStatus.textContent = `註冊失敗: ${errorMessage}`;
                }
                authStatus.style.color = 'red';
            });
    } else {
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                authStatus.textContent = `登入成功！歡迎 ${user.displayName || user.email.split('@')[0]}`; 
                authStatus.style.color = 'green';
                setTimeout(() => {
                    showMainMenu(); 
                }, 1500); 
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("登入失敗:", error);
                if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                    authStatus.textContent = '電子郵件或密碼不正確。';
                } else if (errorCode === 'auth/invalid-email') {
                    authStatus.textContent = '電子郵件格式無效。';
                } else {
                    authStatus.textContent = `登入失敗: ${errorMessage}`;
                }
                authStatus.style.color = 'red';
            });
    }
});

function showMainMenu() {
    authSection.classList.add('hidden');
    kanaPracticeSection.classList.add('hidden');
    vocabularyPracticeSection.classList.add('hidden');
    translationPracticeSection.classList.add('hidden');
    leaderboardSection.classList.add('hidden');
    gameMenuOverlay.classList.add('hidden'); 
    mainMenuOverlay.classList.add('hidden'); 
    mainMenu.classList.remove('hidden');

    const user = auth.currentUser;
    if (user) {
        const usernameToDisplay = user.displayName || user.email.split('@')[0];
        welcomeMessage.textContent = `歡迎回來，${usernameToDisplay}！`;
    } else {
        welcomeMessage.textContent = '';
    }

    resetFeedbackAndScoreDisplays(); 
}

function showKanaPractice() {
    mainMenu.classList.add('hidden');
    kanaPracticeSection.classList.remove('hidden');
    currentPracticeType = 'kana';
    startKanaQuiz();
}

function showVocabularyPractice() {
    mainMenu.classList.add('hidden');
    vocabularyPracticeSection.classList.remove('hidden');
    currentPracticeType = 'vocabulary';
    startVocabularyQuiz();
}

function showTranslationPractice() {
    mainMenu.classList.add('hidden');
    translationPracticeSection.classList.remove('hidden');
    currentPracticeType = 'translation';
    startTranslationQuiz();
}

function showLeaderboard() {
    mainMenu.classList.add('hidden');
    leaderboardSection.classList.remove('hidden');
    gameMenuOverlay.classList.add('hidden');
    mainMenuOverlay.classList.add('hidden');
    updateLeaderboard();
}

function showGameMenu() {
    gameMenuOverlay.classList.remove('hidden');
}

function hideGameMenu() {
    gameMenuOverlay.classList.add('hidden');
}

function showMainMenuOverlay() {
    mainMenuOverlay.classList.remove('hidden');
}

function hideMainMenuOverlay() {
    mainMenuOverlay.classList.add('hidden');
}

function resetFeedbackAndScoreDisplays() {
    kanaFeedback.textContent = '';
    kanaScoreDisplay.textContent = '得分: 0';
    kanaScoreDisplay.classList.remove('hidden'); 
    nextKanaBtn.classList.add('hidden');
    kanaOptionsContainer.innerHTML = '';
    kanaDisplay.textContent = '';

    vocabularyFeedback.textContent = '';
    vocabularyScoreDisplay.textContent = '得分: 0';
    vocabularyScoreDisplay.classList.remove('hidden'); 
    nextVocabularyBtn.classList.add('hidden');
    vocabularyOptionsContainer.innerHTML = '';
    vocabularyDisplay.textContent = '';

    translationFeedback.textContent = '';
    translationScoreDisplay.textContent = '得分: 0';
    translationScoreDisplay.classList.remove('hidden'); 
    nextTranslationBtn.classList.add('hidden');
    translationQuestionDisplay.textContent = '';
    translationInput.value = '';
    checkTranslationBtn.classList.remove('hidden'); 
}

startKanaPracticeBtn.addEventListener('click', showKanaPractice);
startVocabularyPracticeBtn.addEventListener('click', showVocabularyPractice);
startTranslationPracticeBtn.addEventListener('click', showTranslationPractice);

menuToggleKana.addEventListener('click', showGameMenu);
menuToggleVocabulary.addEventListener('click', showGameMenu);
menuToggleTranslation.addEventListener('click', showGameMenu);

mainMenuToggle.addEventListener('click', showMainMenuOverlay);
closeMainMenuOverlayBtn.addEventListener('click', hideMainMenuOverlay);

viewLeaderboardFromMenuBtn.addEventListener('click', showLeaderboard); 

logoutFromMenuBtn.addEventListener('click', () => {
    hideMainMenuOverlay(); 
    auth.signOut().then(() => {
        console.log('User signed out.');
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
});


resumeGameBtn.addEventListener('click', hideGameMenu);

returnToMainBtn.addEventListener('click', () => {
    hideGameMenu();
    if (auth.currentUser) {
        let currentScore = 0;
        if (currentPracticeType === 'kana') {
            currentScore = kanaScore;
        } else if (currentPracticeType === 'vocabulary') {
            currentScore = vocabularyScore;
        } else if (currentPracticeType === 'translation') {
            currentScore = translationScore;
        }
        updateUserScore(auth.currentUser.uid, currentScore);
    }
    showMainMenu();
});

exitGameBtn.addEventListener('click', () => {
    hideGameMenu();
    if (auth.currentUser) {
        let currentScore = 0;
        if (currentPracticeType === 'kana') {
            currentScore = kanaScore;
        } else if (currentPracticeType === 'vocabulary') {
            currentScore = vocabularyScore;
        } else if (currentPracticeType === 'translation') {
            currentScore = translationScore;
        }
        updateUserScore(auth.currentUser.uid, currentScore);
    }
   
    authSection.classList.remove('hidden');
    mainMenu.classList.add('hidden');
    kanaPracticeSection.classList.add('hidden');
    vocabularyPracticeSection.classList.add('hidden');
    translationPracticeSection.classList.add('hidden');
    leaderboardSection.classList.add('hidden');
    resetAuthFormAndStatus(); 
});

backToMainMenuFromLeaderboardBtn.addEventListener('click', showMainMenu);


function resetAuthFormAndStatus() {
    authEmailInput.value = '';
    authPasswordInput.value = '';
    authUsernameInput.value = '';
    authStatus.textContent = '';
    authTitle.textContent = '登入';
    authSubmitBtn.textContent = '登入';
    authUsernameInput.classList.add('hidden');
    registerLinkContainer.classList.remove('hidden');
    loginLinkContainer.classList.add('hidden');
}


function startKanaQuiz() {
    kanaScore = 0;
    currentKanaIndex = 0;
    kanaFeedback.textContent = '';
    kanaScoreDisplay.textContent = `得分: ${kanaScore}`;
    kanaScoreDisplay.classList.remove('hidden');

    const hiraganaKeys = Object.keys(kanaData).filter(key => kanaData[key].type === 'hiragana');
    const katakanaKeys = Object.keys(kanaData).filter(key => kanaData[key].type === 'katakana');
    

    const modes = ['hiragana', 'katakana', 'mixed'];
    kanaPracticeMode = modes[Math.floor(Math.random() * modes.length)];
    let shuffledKanaKeys;

    if (kanaPracticeMode === 'hiragana') {
        shuffledKanaKeys = shuffleArray(hiraganaKeys);
        kanaPracticeSection.querySelector('h2').textContent = '平假名練習';
    } else if (kanaPracticeMode === 'katakana') {
        shuffledKanaKeys = shuffleArray(katakanaKeys);
        kanaPracticeSection.querySelector('h2').textContent = '片假名練習';
    } else {
        shuffledKanaKeys = shuffleArray([...hiraganaKeys, ...katakanaKeys]);
        kanaPracticeSection.querySelector('h2').textContent = '五十音綜合練習';
    }
    displayNextKanaQuestion(shuffledKanaKeys);
}

function displayNextKanaQuestion(shuffledKeys) {
    if (currentKanaIndex < shuffledKeys.length) {
        const kanaKey = shuffledKeys[currentKanaIndex];
        const currentKana = kanaData[kanaKey];
        kanaDisplay.textContent = currentKana.kana;
        kanaOptionsContainer.innerHTML = ''; 
        kanaFeedback.textContent = ''; 
        nextKanaBtn.classList.add('hidden');
        
        const options = generateOptions(currentKana.romaji, kanaData, 'romaji');
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-btn');
            button.addEventListener('click', () => checkKanaAnswer(option, currentKana.romaji, shuffledKeys));
            kanaOptionsContainer.appendChild(button);
        });
    } else {
        endKanaQuiz(shuffledKeys.length);
    }
}

function checkKanaAnswer(selectedRomaji, correctRomaji, shuffledKeys) {
    const options = kanaOptionsContainer.querySelectorAll('.option-btn');
    options.forEach(btn => {
        btn.disabled = true; 
        if (btn.textContent === correctRomaji) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedRomaji) {
            btn.classList.add('incorrect');
        }
    });

    if (selectedRomaji === correctRomaji) {
        kanaFeedback.textContent = '正確！';
        kanaFeedback.style.color = 'green';
        kanaScore++;
    } else {
        kanaFeedback.textContent = `錯誤！正確答案是 ${correctRomaji}`;
        kanaFeedback.style.color = 'red';
    }
    kanaScoreDisplay.textContent = `得分: ${kanaScore}`; 
    nextKanaBtn.classList.remove('hidden');
}

nextKanaBtn.addEventListener('click', () => {
    currentKanaIndex++; 
    const hiraganaKeys = Object.keys(kanaData).filter(key => kanaData[key].type === 'hiragana');
    const katakanaKeys = Object.keys(kanaData).filter(key => kanaData[key].type === 'katakana');
    let shuffledKeys;

    if (kanaPracticeMode === 'hiragana') {
        shuffledKeys = shuffleArray(hiraganaKeys);
    } else if (kanaPracticeMode === 'katakana') {
        shuffledKeys = shuffleArray(katakanaKeys);
    } else {
        shuffledKeys = shuffleArray([...hiraganaKeys, ...katakanaKeys]);
    }
    displayNextKanaQuestion(shuffledKeys);
});

function endKanaQuiz(totalQuestions) {
    kanaFeedback.textContent = `練習結束！你的總得分是 ${kanaScore} / ${totalQuestions}。`;
    kanaFeedback.style.color = 'blue';
    kanaScoreDisplay.classList.add('hidden'); 
    nextKanaBtn.classList.add('hidden');
    kanaOptionsContainer.innerHTML = ''; 
}



function startVocabularyQuiz() {
    vocabularyScore = 0;
    currentVocabularyIndex = 0;
    vocabularyFeedback.textContent = ''; 
    vocabularyScoreDisplay.textContent = `得分: ${vocabularyScore}`; 
    vocabularyScoreDisplay.classList.remove('hidden');

    const vocabularyKeys = shuffleArray(Object.keys(vocabularyData));
    displayNextVocabularyQuestion(vocabularyKeys);
}

function displayNextVocabularyQuestion(shuffledKeys) {
    if (currentVocabularyIndex < shuffledKeys.length) {
        const vocabKey = shuffledKeys[currentVocabularyIndex];
        const currentVocab = vocabularyData[vocabKey];
        vocabularyDisplay.textContent = currentVocab.japanese; 
        vocabularyOptionsContainer.innerHTML = '';
        vocabularyFeedback.textContent = '';
        nextVocabularyBtn.classList.add('hidden');
        
        const options = generateOptions(currentVocab.chinese, vocabularyData, 'chinese'); 
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-btn');
            button.addEventListener('click', () => checkVocabularyAnswer(option, currentVocab.chinese, shuffledKeys));
            vocabularyOptionsContainer.appendChild(button);
        });
    } else {
        endVocabularyQuiz(shuffledKeys.length);
    }
}

function checkVocabularyAnswer(selectedChinese, correctChinese, shuffledKeys) {
    const options = vocabularyOptionsContainer.querySelectorAll('.option-btn');
    options.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctChinese) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedChinese) {
            btn.classList.add('incorrect');
        }
    });

    if (selectedChinese === correctChinese) {
        vocabularyFeedback.textContent = '正確！';
        vocabularyFeedback.style.color = 'green';
        vocabularyScore++;
    } else {
        vocabularyFeedback.textContent = `錯誤！正確答案是 ${correctChinese}`;
        vocabularyFeedback.style.color = 'red';
    }
    vocabularyScoreDisplay.textContent = `得分: ${vocabularyScore}`;
    nextVocabularyBtn.classList.remove('hidden');
}

nextVocabularyBtn.addEventListener('click', () => {
    currentVocabularyIndex++; 
    const shuffledKeys = shuffleArray(Object.keys(vocabularyData));
    displayNextVocabularyQuestion(shuffledKeys);
});

function endVocabularyQuiz(totalQuestions) {
    vocabularyFeedback.textContent = `練習結束！你的總得分是 ${vocabularyScore} / ${totalQuestions}。`;
    vocabularyFeedback.style.color = 'blue';
    vocabularyScoreDisplay.classList.add('hidden'); 
    nextVocabularyBtn.classList.add('hidden');
    vocabularyOptionsContainer.innerHTML = '';
}

function startTranslationQuiz() {
    translationScore = 0;
    currentTranslationIndex = 0;
    translationFeedback.textContent = '';
    translationScoreDisplay.textContent = `得分: ${translationScore}`; 
    translationScoreDisplay.classList.remove('hidden');

    translationInput.value = '';
    checkTranslationBtn.classList.remove('hidden'); 
    const translationKeys = shuffleArray(Object.keys(translationData));
    displayNextTranslationQuestion(translationKeys);
}

function displayNextTranslationQuestion(shuffledKeys) {
    if (currentTranslationIndex < shuffledKeys.length) {
        const sentenceKey = shuffledKeys[currentTranslationIndex];
        const currentSentence = translationData[sentenceKey];
        translationQuestionDisplay.textContent = currentSentence.japanese; 
        translationInput.value = ''; 
        translationFeedback.textContent = ''; 
        nextTranslationBtn.classList.add('hidden');
        checkTranslationBtn.classList.remove('hidden'); 
        translationInput.disabled = false; 
        translationInput.classList.remove('hidden'); 
    } else {
        endTranslationQuiz(shuffledKeys.length);
    }
}

checkTranslationBtn.addEventListener('click', () => {
    const userAnswer = translationInput.value.trim();
    const shuffledKeys = shuffleArray(Object.keys(translationData)); 
    const currentSentenceKey = shuffledKeys[currentTranslationIndex];
    const correctChinese = translationData[currentSentenceKey].chinese;

    if (userAnswer === correctChinese) {
        translationFeedback.textContent = '正確！';
        translationFeedback.style.color = 'green';
        translationScore++;
    } else {
        translationFeedback.textContent = `錯誤！正確答案是 ${correctChinese}`;
        translationFeedback.style.color = 'red';
    }
    translationScoreDisplay.textContent = `得分: ${translationScore}`; 
    nextTranslationBtn.classList.remove('hidden');
    checkTranslationBtn.classList.add('hidden'); 
    translationInput.disabled = true; 
});

nextTranslationBtn.addEventListener('click', () => {
    currentTranslationIndex++; 
    const shuffledKeys = shuffleArray(Object.keys(translationData));
    displayNextTranslationQuestion(shuffledKeys);
});


function endTranslationQuiz(totalQuestions) {
    translationFeedback.textContent = `練習結束！你的總得分是 ${translationScore} / ${totalQuestions}。`;
    translationFeedback.style.color = 'blue';
    translationScoreDisplay.classList.add('hidden'); 
    nextTranslationBtn.classList.add('hidden');
    checkTranslationBtn.classList.add('hidden'); 
    translationInput.classList.add('hidden'); 
}

function updateLeaderboard() {
    leaderboardList.innerHTML = '<li>載入中...</li>';
    database.ref('users').orderByChild('score').limitToLast(10).once('value', (snapshot) => {
        leaderboardList.innerHTML = '';
        const users = [];
        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            users.push({
                username: userData.username,
                score: userData.score
            });
        });

        users.sort((a, b) => b.score - a.score); 

        if (users.length === 0) {
            leaderboardList.innerHTML = '<li>目前沒有排行榜資料。</li>';
        } else {
            users.forEach((user, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<span>${index + 1}. <strong>${user.username}</strong></span> <span>${user.score} 分</span>`;
                leaderboardList.appendChild(listItem);
            });
        }
    }, (errorObject) => {
        console.error("The read failed: " + errorObject.code);
        leaderboardList.innerHTML = '<li>載入排行榜失敗。</li>';
    });
}

function updateUserScore(uid, scoreToAdd) {
    const userRef = database.ref('users/' + uid);
    userRef.once('value').then(snapshot => {
        let currentScore = snapshot.val() && snapshot.val().score ? snapshot.val().score : 0;
        const newScore = currentScore + scoreToAdd;
        userRef.update({ score: newScore })
            .then(() => console.log('分數更新成功！'))
            .catch(error => console.error('分數更新失敗：', error));
    }).catch(error => console.error('獲取用戶分數失敗：', error));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateOptions(correctAnswer, data, key) {
    const allOptions = new Set();
    allOptions.add(correctAnswer);

    const dataArray = Object.values(data);
    while (allOptions.size < 4) { 
        const randomIndex = Math.floor(Math.random() * dataArray.length);
        const randomItem = dataArray[randomIndex];
        if (randomItem && randomItem[key] && !allOptions.has(randomItem[key])) { 
            allOptions.add(randomItem[key]);
        }
    }

    let optionsArray = Array.from(allOptions);

    while (optionsArray.length < 4 && optionsArray.length < dataArray.length) {
        const randomIndex = Math.floor(Math.random() * dataArray.length);
        const randomItem = dataArray[randomIndex];
        if (randomItem && randomItem[key] && !optionsArray.includes(randomItem[key])) {
            optionsArray.push(randomItem[key]);
        }
    }

    return shuffleArray(optionsArray);
}


document.addEventListener('DOMContentLoaded', () => {
    mainMenu.classList.add('hidden');
    kanaPracticeSection.classList.add('hidden');
    vocabularyPracticeSection.classList.add('hidden');
    translationPracticeSection.classList.add('hidden');
    leaderboardSection.classList.add('hidden');
    gameMenuOverlay.classList.add('hidden'); 
    mainMenuOverlay.classList.add('hidden'); 
    authSection.classList.remove('hidden'); 
}); 
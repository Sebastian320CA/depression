// ============================================================
// DOM ELEMENTS
// ============================================================

const rainContainer = document.getElementById('rain-container');
const scoreCounter = document.getElementById('score-counter');

const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatBoxContainer = document.getElementById('chat-box-container');
const emergencyAlert = document.getElementById('emergency-alert');
const typingIndicator = document.getElementById('typing-indicator');

const btnSend = document.getElementById('btn-send');
const btnUnlockChat = document.getElementById('btn-unlock-chat');

const mascotSprite = document.getElementById('mascot-sprite');
const mascotText = document.getElementById('mascot-text');
const mascotHeading = document.querySelector('.mascot-section h2');
const quizQuestion = document.getElementById('quiz-question');
const quizOptionsContainer = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');


// ============================================================
// RAIN GAME
// ============================================================

const healthyActions = [
    "Exercise a bit",
    "Talk to a friend",
    "Meditate for 5 min",
    "Write your thoughts",
    "Get some sunlight",
    "Listen to music",
    "Asking for help is okay",
    "One step at a time",
    "Validate your emotions",
    "Rest without guilt",
    "Drink some water",
    "Hug a pet"
];

const harmfulHabits = [
    "Isolate yourself",
    "Ignore your feelings",
    "Overwork without rest",
    "Skip your meals",
    "Stay in the dark all day",
    "Bottle up your anger",
    "Pretend you are okay",
    "Suffer in silence",
    "Neglect your sleep"
];

let caughtScore = 0;

function createIdeaDrop() {

    if (!rainContainer) return;

    const drop = document.createElement('div');
    drop.classList.add('idea-drop');

    // 70% good / 30% harmful
    const isGood = Math.random() > 0.3;

    if (isGood) {

        drop.innerText =
            healthyActions[
                Math.floor(Math.random() * healthyActions.length)
            ];

    } else {

        drop.innerText =
            harmfulHabits[
                Math.floor(Math.random() * harmfulHabits.length)
            ];

        drop.classList.add('bad-habit');
    }

    // Random horizontal position
    drop.style.left = Math.random() * 70 + 5 + '%';

    // Random falling speed
    const duration = Math.random() * 2 + 3.5;

    drop.style.animationDuration = duration + 's';

    // Click interaction
    drop.addEventListener('click', () => {

        // Prevent double clicking
        if (drop.classList.contains('burst-out')) return;

        if (isGood) {
            caughtScore += 1;
        } else {
            caughtScore -= 1;
        }

        if (scoreCounter) {
            scoreCounter.innerText = caughtScore;
        }

        drop.classList.add('burst-out');

        setTimeout(() => {
            if (drop.parentNode) {
                drop.remove();
            }
        }, 200);
    });

    rainContainer.appendChild(drop);

    // Automatically remove after animation
    setTimeout(() => {

        if (drop.parentNode) {
            drop.remove();
        }

    }, duration * 1000);
}


// Spawn drops every 1.1 seconds
if (rainContainer) {
    setInterval(createIdeaDrop, 1100);
}


// ============================================================
// CHATBOT
// ============================================================

// Words that trigger the emergency screen.
//
// IMPORTANT:
// This is only a simple keyword filter.
// It is NOT a substitute for professional crisis detection.

const palabrasProhibidas = [
    "kill myself",
    "suicide",
    "suicidal",
    "want to die",
    "i want to die",
    "end my life",
    "hurt myself",
    "self harm",
    "self-harm"
];


// Contextual responses
const smartReplies = [

    {
        keywords: [
            "sad",
            "depressed",
            "cry",
            "lonely"
        ],

        text:
            "I'm so sorry you're feeling this way. " +
            "It's completely valid to feel low, but please don't carry " +
            "this weight all by yourself. 🤍"
    },

    {

        keywords: [
            "anxious",
            "panic",
            "scared",
            "stress",
            "overwhelmed"
        ],

        text:
            "Take a deep breath with me. " +
            "Breathe in for 4 seconds, hold it, and let it out. " +
            "You don't have to solve everything at once."
    },

    {

        keywords: [
            "tired",
            "exhausted",
            "give up",
            "burnout"
        ],

        text:
            "It is okay to rest. " +
            "You don't have to fix everything today. " +
            "Take a guilt-free break; your wellbeing matters most."
    },

    {

        keywords: [
            "hello",
            "hi",
            "hey"
        ],

        text:
            "Hello! I'm here to listen. " +
            "How has your mind been treating you today?"
    }
];


// Generic responses
const respuestasBotFallback = [

    "Thank you for sharing that with me. Letting your feelings out is a beautiful step toward healing.",

    "I'm listening closely. Remember that recovery isn't a straight line, and you're doing your best by being here.",

    "Thank you for trusting this space. You matter, and your feelings are valid."

];


// ============================================================
// ADD CHAT MESSAGE
// ============================================================

function agregarMensajeVisual(texto, clase) {

    // If the chat doesn't exist, simply stop
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');

    msgDiv.classList.add('message', clase);

    msgDiv.innerText = texto;

    // Keep typing indicator at the bottom
    if (
        typingIndicator &&
        typingIndicator.parentNode === chatMessages
    ) {

        chatMessages.insertBefore(
            msgDiv,
            typingIndicator
        );

    } else {

        chatMessages.appendChild(msgDiv);
    }

    // Scroll to bottom
    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


// ============================================================
// SEND MESSAGE
// ============================================================

function enviarMensaje() {

    // Make sure the chat input exists
    if (!chatInput) return;

    const texto = chatInput.value.trim();

    // Empty message
    if (texto === "") return;


    // --------------------------------------------------------
    // SAFETY CHECK
    // --------------------------------------------------------

    const lowercaseText =
        texto.toLowerCase();

    const contienePalabraRiesgo =
        palabrasProhibidas.some(
            palabra =>
                lowercaseText.includes(palabra)
        );


    if (contienePalabraRiesgo) {

        if (chatBoxContainer) {
            chatBoxContainer.classList.add('hidden');
        }

        if (emergencyAlert) {
            emergencyAlert.classList.remove('hidden');
        }

        chatInput.value = "";

        return;
    }


    // --------------------------------------------------------
    // USER MESSAGE
    // --------------------------------------------------------

    agregarMensajeVisual(
        texto,
        'user'
    );

    chatInput.value = "";


    // --------------------------------------------------------
    // TYPING INDICATOR
    // --------------------------------------------------------

    if (
        typingIndicator &&
        chatMessages
    ) {

        chatMessages.appendChild(
            typingIndicator
        );

        typingIndicator.classList.remove(
            'hidden'
        );

        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    }


    // --------------------------------------------------------
    // BOT RESPONSE
    // --------------------------------------------------------

    setTimeout(() => {

        if (typingIndicator) {
            typingIndicator.classList.add(
                'hidden'
            );
        }


        const lowercaseInput =
            texto.toLowerCase();

        let responseText = "";


        // Search contextual response
        for (const item of smartReplies) {

            const hasMatch =
                item.keywords.some(
                    keyword =>
                        lowercaseInput.includes(
                            keyword
                        )
                );

            if (hasMatch) {

                responseText =
                    item.text;

                break;
            }
        }


        // Fallback response
        if (!responseText) {

            responseText =
                respuestasBotFallback[
                    Math.floor(
                        Math.random() *
                        respuestasBotFallback.length
                    )
                ];
        }


        agregarMensajeVisual(
            "Bot: " + responseText,
            'bot-reply'
        );

    }, 1500);
}


// ============================================================
// CHAT EVENTS
// ============================================================

if (btnSend) {

    btnSend.addEventListener(
        'click',
        enviarMensaje
    );
}


if (chatInput) {

    chatInput.addEventListener(
        'keypress',
        event => {

            if (event.key === 'Enter') {

                event.preventDefault();

                enviarMensaje();
            }

        }
    );
}


// ============================================================
// UNLOCK CHAT
// ============================================================

if (btnUnlockChat) {

    btnUnlockChat.addEventListener(
        'click',
        () => {

            if (emergencyAlert) {

                emergencyAlert.classList.add(
                    'hidden'
                );
            }


            if (chatBoxContainer) {

                chatBoxContainer.classList.remove(
                    'hidden'
                );
            }


            agregarMensajeVisual(
                "System: Chat restored. Please make sure to use this space safely.",
                "system"
            );

        }
    );
}


// ============================================================
// SMART MASCOTS + QUIZ
// ============================================================

const mascots = [

    {
        icon: "🧸",
        name: "Barnaby the Bear",
        color: "#a67c52",

        question:
            "If a friend tells you they feel overwhelmed and hopeless, what is the best first step?",

        options: [
            "Tell them to just smile and be happy",

            "Listen actively without judgment and validate their feelings",

            "Give them immediate space and don't reply"
        ],

        answer: 1
    },


    {
        icon: "🐱",
        name: "Cleo the Cat",
        color: "#f39c12",

        question:
            "Which of these is a healthy coping mechanism when dealing with sudden anxiety?",

        options: [
            "Practicing deep box-breathing exercises",

            "Ignoring it until it goes away",

            "Drinking multiple cups of heavy coffee"
        ],

        answer: 0
    },


    {
        icon: "🐸",
        name: "Finn the Frog",
        color: "#27ae60",

        question:
            "True or False: Asking for professional mental help is a sign of personal weakness.",

        options: [
            "True, you should always fix it on your own",

            "False, it is a brave step toward healing and strength"
        ],

        answer: 1
    },


    {
        icon: "🦊",
        name: "Felix the Fox",
        color: "#e67e22",

        question:
            "What should you do if you feel burnt out or trapped by negative thoughts?",

        options: [
            "Force yourself to stay highly productive",

            "Take a guilt-free rest break and clear your mind",

            "Isolate yourself completely from loved ones"
        ],

        answer: 1
    }

];


let currentMascotIndex = 0;
let rotationInterval = null;


// ============================================================
// LOAD MASCOT
// ============================================================

function loadMascotAndQuiz() {

    // Mascot section doesn't exist
    if (!mascotSprite) return;


    // Fade out
    mascotSprite.classList.add(
        'mascot-hidden'
    );


    if (quizFeedback) {

        quizFeedback.classList.add(
            'hidden'
        );
    }


    setTimeout(() => {

        const mascot =
            mascots[currentMascotIndex];


        // Mascot icon
        mascotSprite.innerText =
            mascot.icon;


        // Heading
        if (mascotHeading) {

            mascotHeading.innerText =
                `Learn with ${mascot.name}`;
        }


        // Mascot glow
        mascotSprite.style.textShadow =
            `0 0 20px ${mascot.color}50`;


        // Mascot description
        if (mascotText) {

            mascotText.innerText =
                `Hi! I am ${mascot.name}. Try solving my mental health challenge below! 🧠`;
        }


        // Question
        if (quizQuestion) {

            quizQuestion.innerText =
                mascot.question;
        }


        // Options
        if (quizOptionsContainer) {

            quizOptionsContainer.innerHTML = "";


            mascot.options.forEach(
                (optionText, index) => {

                    const btn =
                        document.createElement(
                            'button'
                        );

                    btn.classList.add(
                        'quiz-btn'
                    );

                    btn.innerText =
                        optionText;


                    btn.addEventListener(
                        'click',
                        () => {

                            checkAnswer(
                                index,
                                btn
                            );

                        }
                    );


                    quizOptionsContainer.appendChild(
                        btn
                    );
                }
            );
        }


        // Fade in
        mascotSprite.classList.remove(
            'mascot-hidden'
        );

    }, 500);
}


// ============================================================
// CHECK QUIZ ANSWER
// ============================================================

function checkAnswer(
    selectedIndex,
    clickedButton
) {

    const mascot =
        mascots[currentMascotIndex];


    if (
        !quizOptionsContainer ||
        !quizFeedback
    ) {
        return;
    }


    const buttons =
        quizOptionsContainer.querySelectorAll(
            '.quiz-btn'
        );


    // Disable all buttons
    buttons.forEach(
        button => {
            button.disabled = true;
        }
    );


    // --------------------------------------------------------
    // CORRECT
    // --------------------------------------------------------

    if (
        selectedIndex === mascot.answer
    ) {

        clickedButton.classList.add(
            'correct'
        );


        quizFeedback.innerText =
            "✨ Correct! Awesome job! Perfect for your emotional wellbeing.";


        quizFeedback.className =
            "quiz-feedback success";


        // Stop automatic rotation
        clearInterval(
            rotationInterval
        );


        // Move to next mascot
        setTimeout(() => {

            nextMascot();

            startAutoRotation();

        }, 3500);

    }


    // --------------------------------------------------------
    // WRONG
    // --------------------------------------------------------

    else {

        clickedButton.classList.add(
            'wrong'
        );


        if (buttons[mascot.answer]) {

            buttons[
                mascot.answer
            ].classList.add(
                'correct'
            );
        }


        quizFeedback.innerText =
            "❌ Not quite, but it's a great learning moment! Try the next buddy.";


        quizFeedback.className =
            "quiz-feedback error";


        clearInterval(
            rotationInterval
        );


        setTimeout(() => {

            nextMascot();

            startAutoRotation();

        }, 4000);
    }
}


// ============================================================
// NEXT MASCOT
// ============================================================

function nextMascot() {

    currentMascotIndex =
        (currentMascotIndex + 1) %
        mascots.length;

    loadMascotAndQuiz();
}


// ============================================================
// AUTO ROTATION
// ============================================================

function startAutoRotation() {

    // Always clear previous interval first
    clearInterval(
        rotationInterval
    );


    // Only start if mascot exists
    if (!mascotSprite) return;


    rotationInterval =
        setInterval(
            nextMascot,
            12000
        );
}


// ============================================================
// MASCOT CLICK
// ============================================================

if (mascotSprite) {

    mascotSprite.addEventListener(
        'click',
        () => {

            clearInterval(
                rotationInterval
            );

            nextMascot();

            startAutoRotation();
        }
    );
}


// ============================================================
// INITIALIZE MASCOT SYSTEM
// ============================================================

if (mascotSprite) {

    mascotSprite.classList.add(
        'mascot-fade'
    );

    loadMascotAndQuiz();

    startAutoRotation();
}


// ============================================================
// PREMIUM SCROLL REVEAL
// ============================================================

function initializeScrollReveal() {

    const revealedElements =
        document.querySelectorAll(
            '.reveal-on-scroll'
        );


    // Browser doesn't support IntersectionObserver
    if (
        !('IntersectionObserver' in window)
    ) {

        revealedElements.forEach(
            element => {

                element.classList.add(
                    'active'
                );

            }
        );

        return;
    }


    const scrollObserver =
        new IntersectionObserver(
            (
                entries,
                observer
            ) => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                'active'
                            );


                            observer.unobserve(
                                entry.target
                            );
                        }

                    }
                );

            },
            {
                threshold: 0.1
            }
        );


    revealedElements.forEach(
        element => {

            scrollObserver.observe(
                element
            );

        }
    );
}


// ============================================================
// INITIALIZE EVERYTHING
// ============================================================

if (
    document.readyState === 'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        initializeScrollReveal
    );

} else {

    initializeScrollReveal();
}
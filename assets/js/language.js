// Multi-Language Support System
class LanguageManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.languages = ['en', 'hi', 'mr'];
        
        this.translations = {
            en: {
                // Common
                home: 'Home',
                logout: 'Logout',
                profile: 'My Profile',
                welcome: 'Welcome',
                loading: 'Loading...',
                
                // Login Page
                login_title: 'Mental Health Self-Check',
                login_subtitle: 'Your personal wellness companion',
                login_fullname: 'Full Name',
                login_student_id: 'Student Number',
                login_email: 'Email (Optional)',
                login_button: 'Login',
                login_privacy: 'Your data is stored only on this device',
                login_existing: 'Existing users on this device',
                created_by: 'Created by Vishwajeet S Patil',
                
                // Navigation
                nav_home: 'Home',
                nav_quiz: 'Take Mood Check',
                nav_breathing: 'Breathing Exercise',
                nav_tips: 'Stress Tips',
                nav_help: 'Emergency Help',
                nav_games: 'Games',
                
                // Profile
                profile_title: 'My Profile & Progress',
                profile_info: 'Your Information',
                profile_student_id: 'Student ID: ',
                profile_email: 'Email: ',
                profile_created: 'Account created: ',
                profile_logins: 'Total logins: ',
                profile_progress: 'Your Progress',
                profile_quizzes: 'Quizzes Completed',
                profile_breathing_minutes: 'Breathing Minutes',
                profile_breathing_sessions: 'Breathing Sessions',
                profile_tips_viewed: 'Tips Viewed',
                profile_total_sessions: 'Total Sessions',
                profile_last_quiz: 'Last Quiz Score',
                profile_activity: 'Recent Activity',
                profile_achievements: 'Achievements',
                profile_delete_data: 'Delete Account',
                profile_privacy: 'Your privacy is important',
                
                // Tips
                tips_title: 'Stress Management Tips',
                tips_personalized: 'Personalized Tips Based on Your Assessment',
                tips_no_quiz: 'Take the mood check quiz to receive personalized tips',
                tips_stress_level: 'Based on your stress level: ',
                
                // Games
                games_title: 'Stress Relief Games',
                games_subtitle: 'Relax and have fun!',
                game_memory: 'Memory Match',
                game_puzzle: 'Puzzle Game',
                game_breathing_balloon: 'Breathing Balloon',
                game_color_match: 'Color Match',
                
                // Messages
                msg_success: 'Success!',
                msg_error: 'Error',
                msg_logout_confirm: 'Are you sure you want to logout?',
                msg_delete_confirm: 'Are you sure you want to delete your account?',
            },
            hi: {
                // Common
                home: 'होम',
                logout: 'लॉगआउट',
                profile: 'मेरी प्रोफाइल',
                welcome: 'स्वागत है',
                loading: 'लोड हो रहा है...',
                
                // Login Page
                login_title: 'मानसिक स्वास्थ्य स्व-जांच',
                login_subtitle: 'आपका व्यक्तिगत कल्याण साथी',
                login_fullname: 'पूरा नाम',
                login_student_id: 'छात्र संख्या',
                login_email: 'ईमेल (वैकल्पिक)',
                login_button: 'लॉगिन',
                login_privacy: 'आपका डेटा केवल इस डिवाइस पर संग्रहीत है',
                login_existing: 'इस डिवाइस पर मौजूदा उपयोगकर्ता',
                created_by: 'विश्वजीत एस पटिल द्वारा निर्मित',
                
                // Navigation
                nav_home: 'होम',
                nav_quiz: 'मूड चेक लें',
                nav_breathing: 'श्वास व्यायाम',
                nav_tips: 'तनाव टिप्स',
                nav_help: 'आपातकालीन सहायता',
                nav_games: 'खेल',
                
                // Profile
                profile_title: 'मेरी प्रोफाइल और प्रगति',
                profile_info: 'आपकी जानकारी',
                profile_student_id: 'छात्र आईडी: ',
                profile_email: 'ईमेल: ',
                profile_created: 'खाता बनाया गया: ',
                profile_logins: 'कुल लॉगिन: ',
                profile_progress: 'आपकी प्रगति',
                profile_quizzes: 'पूर्ण किए गए प्रश्नोत्तरी',
                profile_breathing_minutes: 'श्वास मिनट',
                profile_breathing_sessions: 'श्वास सत्र',
                profile_tips_viewed: 'देखी गई टिप्स',
                profile_total_sessions: 'कुल सत्र',
                profile_last_quiz: 'अंतिम क्विज स्कोर',
                profile_activity: 'हाल की गतिविधि',
                profile_achievements: 'उपलब्धियां',
                profile_delete_data: 'खाता हटाएं',
                profile_privacy: 'आपकी गोपनीयता महत्वपूर्ण है',
                
                // Tips
                tips_title: 'तनाव प्रबंधन टिप्स',
                tips_personalized: 'आपके आकलन के आधार पर व्यक्तिगत सुझाव',
                tips_no_quiz: 'व्यक्तिगत टिप्स प्राप्त करने के लिए मूड चेक क्विज लें',
                tips_stress_level: 'आपके तनाव स्तर के आधार पर: ',
                
                // Games
                games_title: 'तनाव राहत खेल',
                games_subtitle: 'आराम करें और मज़े करें!',
                game_memory: 'स्मृति मेल',
                game_puzzle: 'पहेली खेल',
                game_breathing_balloon: 'श्वास गुब्बारा',
                game_color_match: 'रंग मेल',
                
                // Messages
                msg_success: 'सफल!',
                msg_error: 'त्रुटि',
                msg_logout_confirm: 'क्या आप निश्चित हैं कि आप लॉगआउट करना चाहते हैं?',
                msg_delete_confirm: 'क्या आप निश्चित हैं कि आप अपना खाता हटाना चाहते हैं?',
            },
            mr: {
                // Common
                home: 'होम',
                logout: 'लॉगआउट',
                profile: 'माझे प्रोफाइल',
                welcome: 'स्वागतम',
                loading: 'लोड होत आहे...',
                
                // Login Page
                login_title: 'मानसिक आरोग्य स्व-तपास',
                login_subtitle: 'आपला व्यक्तिगत कल्याण साथी',
                login_fullname: 'पूर्ण नाव',
                login_student_id: 'विद्यार्थी संख्या',
                login_email: 'ई-मेल (पर्यायी)',
                login_button: 'लॉगिन',
                login_privacy: 'आपचा डेटा केवळ या डिव्हाइसवर संग्रहित आहे',
                login_existing: 'या डिव्हाइसवर विद्यमान वापरकर्ते',
                created_by: 'विश्वजीत एस पटील द्वारे तयार केलेले',
                
                // Navigation
                nav_home: 'होम',
                nav_quiz: 'मूड तपासा',
                nav_breathing: 'श्वास व्यायाम',
                nav_tips: 'तनाव सुझाव',
                nav_help: 'आपातकालीन मदत',
                nav_games: 'खेळ',
                
                // Profile
                profile_title: 'माझे प्रोफाइल आणि प्रगती',
                profile_info: 'आपली माहिती',
                profile_student_id: 'विद्यार्थी आयडी: ',
                profile_email: 'ई-मेल: ',
                profile_created: 'खाते तयार केले: ',
                profile_logins: 'एकूण लॉगिन: ',
                profile_progress: 'आपली प्रगती',
                profile_quizzes: 'पूर्ण केलेले प्रश्नोत्तरी',
                profile_breathing_minutes: 'श्वास मिनिटे',
                profile_breathing_sessions: 'श्वास सत्र',
                profile_tips_viewed: 'पाहिलेले सुझाव',
                profile_total_sessions: 'एकूण सत्र',
                profile_last_quiz: 'अंतिम क्विज स्कोर',
                profile_activity: 'अलीकडील क्रिया',
                profile_achievements: 'कामगिरी',
                profile_delete_data: 'खाते हटवा',
                profile_privacy: 'आपली गोपनीयता महत्वाची आहे',
                
                // Tips
                tips_title: 'तनाव व्यवस्थापन सुझाव',
                tips_personalized: 'आपल्या मूल्यांकनाच्या आधारे व्यक्तिगत सुझाव',
                tips_no_quiz: 'व्यक्तिगत सुझाव प्राप्त करण्यासाठी मूड चेक क्विज घ्या',
                tips_stress_level: 'आपल्या तनाव स्तरावर आधारित: ',
                
                // Games
                games_title: 'तनाव राहत खेळ',
                games_subtitle: 'विश्रांती घ्या आणि मजा करा!',
                game_memory: 'स्मृती जुळवा',
                game_puzzle: 'पहेली खेळ',
                game_breathing_balloon: 'श्वास फुगा',
                game_color_match: 'रंग जुळवा',
                
                // Messages
                msg_success: 'यशस्वी!',
                msg_error: 'त्रुटी',
                msg_logout_confirm: 'तुम्हाला लॉगआउट करायचे आहे का?',
                msg_delete_confirm: 'तुम्हाला तुमचे खाते हटवायचे आहे का?',
            }
        };
        
        this.init();
    }

    init() {
        this.setupLanguageSelector();
        this.applyLanguage();
    }

    setupLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (!selector) {
            // Create language selector if not exists
            this.createLanguageSelector();
        }
    }

    createLanguageSelector() {
        const selector = document.createElement('select');
        selector.id = 'language-selector';
        selector.className = 'language-selector';
        
        const languages = {
            en: '🌐 English',
            hi: '🇮🇳 हिन्दी',
            mr: '🇮🇳 मराठी'
        };
        
        Object.entries(languages).forEach(([code, label]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = label;
            if (code === this.currentLanguage) {
                option.selected = true;
            }
            selector.appendChild(option);
        });
        
        selector.addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });
        
        // Insert after nav
        const nav = document.querySelector('.top-nav');
        if (nav) {
            nav.appendChild(selector);
        }
    }

    getStoredLanguage() {
        return localStorage.getItem('mh_language') || 'en';
    }

    setLanguage(lang) {
        if (!this.languages.includes(lang)) return;
        
        this.currentLanguage = lang;
        localStorage.setItem('mh_language', lang);
        this.applyLanguage();
        window.location.reload(); // Reload to apply language changes
    }

    applyLanguage() {
        const translations = this.translations[this.currentLanguage];
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                element.placeholder = translations[key];
            }
        });
    }

    t(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Initialize language manager globally
window.languageManager = new LanguageManager();

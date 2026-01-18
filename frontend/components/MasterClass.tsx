
import React, { useState, useMemo } from 'react';
import { AcademyCourse, Lesson } from '../types';
import { 
  LucideGraduationCap, 
  LucidePlay, 
  LucideClock, 
  LucideStar, 
  LucideChevronLeft, 
  LucideCheckCircle, 
  LucideXCircle,
  LucideBookOpen,
  LucideTrophy,
  LucideChevronRight,
  LucideAlertCircle,
  LucideTarget,
  LucideZap,
  LucideShieldAlert,
  LucideBrainCircuit,
  LucideBarChart3
} from 'lucide-react';

const ACADEMY_DATA: AcademyCourse[] = [
  {
    id: 'prop-trading-mastery',
    title: 'Prop Trading : Architecture & Mécaniques Institutionnelles',
    level: 'INTERMEDIATE',
    duration: '8h 45m',
    category: 'Institutional Core',
    thumbnail: '🏛️',
    description: 'Une immersion profonde dans le fonctionnement des firmes de proprietory trading. Comprendre les algorithmes de surveillance et les protocoles de conformité.',
    lessons: [
      {
        id: 'pt-l1',
        title: 'Le Modèle Économique et le Protocole d\'Évaluation',
        introduction: "Bienvenue dans le Module Fondateur. Le passage du trading retail au trading institutionnel n'est pas qu'une question de capital, c'est une mutation structurelle de votre approche du marché. Ce cours détaille pourquoi les firmes existent, comment elles gèrent leur risque global et ce qu'elles recherchent réellement chez un trader financé.",
        theory: `
        **1. L'Origine et l'Évolution du Prop Trading**
        Le Proprietary Trading (Prop Trading) a muté. Historiquement confiné aux "pits" de Wall Street et de la City, il s'est démocratisé via le modèle "Evaluation-based Funding". La firme ne parie pas sur vos gains, elle parie sur votre capacité à respecter un protocole strict. 

        **2. Le Triptyque de l'Évaluation : Consistance, Risque, Discipline**
        - **Hurdle Rate (Objectif de Profit)** : Généralement fixé entre 8% et 10%. Ce chiffre n'est pas arbitraire ; il représente une performance alpha supérieure à la moyenne du marché sur une période donnée.
        - **Maximum Drawdown (MDD)** : La limite de survie. En Prop Trading, le MDD est souvent "Trailing" (suiveur) ou "Static" (fixe). Comprendre la nuance est vital : un MDD suiveur s'ajuste à votre point haut d'équité, verrouillant vos gains potentiels en faveur de la firme.
        - **Consistency Rule** : Certaines firmes exigent qu'aucun jour de trading ne représente plus de 30% à 50% de votre profit total. Cela élimine les "Lucky Shots" et favorise les traders statistiquement stables.

        **3. Les Algorithmes de Surveillance (RMS)**
        Votre compte est relié à un Risk Management System (RMS) automatisé. Toute violation (Hard Breach) entraîne une déconnexion instantanée du serveur MT4/MT5/C-Trader. Ces systèmes surveillent l'exposition totale (Margin Usage) et les corrélations entre actifs pour éviter une surexposition sur une seule devise.
        `,
        examples: `
        **Scénario de Validation Réel :**
        Un trader gère un compte de 100 000 $. 
        - Profit Target : 10 000 $ (10%)
        - Max Loss : 10 000 $ (10%)
        - Max Daily Loss : 5 000 $ (5%)

        Le trader réalise 3 000 $ le premier jour. Son nouveau plafond de perte journalière pour le lendemain est calculé sur son équité de clôture (103 000 $). S'il retombe à 98 000 $ en cours de journée, il échoue, car la perte de 5 000 $ (103k - 98k) a été atteinte, même si le compte global est toujours au-dessus du capital initial.
        `,
        commonErrors: `
        - **Le "All-in" sur l'Or ou le Nasdaq** : Chercher à valider le challenge en 48h. Les RMS détectent l'agressivité excessive et marquent le trader comme "Gambler".
        - **Ignorer les Fenêtres de News** : Ouvrir ou fermer des positions dans les 2 minutes entourant une annonce "High Impact" (NFP, CPI), ce qui entraîne souvent une invalidation des profits.
        `,
        bestPractices: `
        - **Règle du Risque de 0.5%** : Ne jamais risquer plus de 0.5% du capital initial par idée de trade. Cela permet d'encaisser 20 pertes consécutives avant d'atteindre le drawdown maximal.
        - **Trading Window** : Se spécialiser sur une session spécifique (Londres ou New York) pour garantir une volatilité exploitable.
        `,
        summary: "Le Prop Trading est un métier de gestion de risque déléguée. Votre contrat n'est pas de prédire le futur, mais de protéger le capital de la firme tout en extrayant une faible marge statistique.",
        quizzes: [
          {
            question: "Quelle est la principale différence entre un Drawdown Statique et un Drawdown Trailing ?",
            options: [
              "Le statique ne bouge jamais par rapport au capital initial, le trailing suit le point haut de l'équité.",
              "Le trailing est calculé par le broker, le statique par la Prop Firm.",
              "Le statique est pour les débutants, le trailing pour les pros.",
              "Il n'y a aucune différence réelle."
            ],
            correctIndex: 0,
            explanation: "Le Trailing Drawdown est plus difficile car il réduit votre marge de manœuvre à mesure que vous gagnez, protégeant ainsi les profits de la firme."
          },
          {
            question: "Pourquoi une 'Consistency Rule' de 30% est-elle imposée ?",
            options: [
              "Pour forcer le trader à payer plus de frais.",
              "Pour s'assurer que le profit est le résultat d'un processus reproductible et non d'un coup de chance unique.",
              "Pour limiter les gains du trader.",
              "Pour tester la rapidité d'exécution."
            ],
            correctIndex: 1,
            explanation: "La consistance est le Graal des institutions ; elles cherchent des courbes de gains lisses, pas des pics erratiques."
          },
          {
            question: "Un trader a un compte de 50k$ avec une limite journalière de 2.5k$. Il commence la journée à 52k$. À quel niveau le compte est-il coupé ?",
            options: ["47.5k$", "50k$", "49.5k$", "51k$"],
            correctIndex: 2,
            explanation: "52k (équité de départ) - 2.5k (limite journalière) = 49.5k$."
          },
          {
            question: "Qu'est-ce qu'une 'Hard Breach' ?",
            options: [
              "Une clôture de position en profit.",
              "Une violation critique des règles entraînant la perte du compte.",
              "Une demande de retrait de fonds.",
              "Une mise à jour du terminal."
            ],
            correctIndex: 1,
            explanation: "Toute violation des limites de perte est considérée comme une rupture de contrat irréversible."
          },
          {
            question: "La 'Margin Usage' excessive est souvent un signal de :",
            options: ["Grande confiance", "Over-leveraging (Sur-levier)", "Bonne stratégie", "Rapidité"],
            correctIndex: 1,
            explanation: "Utiliser trop de marge réduit la capacité du compte à encaisser la volatilité normale."
          },
          {
            question: "Pourquoi est-il risqué de trader durant le NFP (Non-Farm Payroll) ?",
            options: [
              "Le marché est fermé.",
              "Le slippage et l'élargissement des spreads peuvent déclencher des Stop Loss de manière injuste.",
              "Les Prop Firms dorment pendant ce temps.",
              "Le prix ne bouge pas assez."
            ],
            correctIndex: 1,
            explanation: "La volatilité extrême rend l'exécution imprévisible, ce que les institutions détestent."
          },
          {
            question: "Quel est le 'Profit Split' standard dans l'industrie ?",
            options: ["10% / 90%", "80% pour le trader / 20% pour la firme", "50% / 50%", "100% pour le trader"],
            correctIndex: 1,
            explanation: "La majorité des firmes sérieuses offrent entre 70% et 90% au trader performant."
          },
          {
            question: "Que se passe-t-il si vous atteignez l'objectif de profit mais violez une règle mineure ?",
            options: [
              "Vous êtes payé quand même.",
              "Le challenge est invalidé (Soft ou Hard Breach selon la firme).",
              "L'objectif augmente.",
              "On vous donne une seconde chance gratuite."
            ],
            correctIndex: 1,
            explanation: "Les règles sont des conditions sine qua non de validation."
          },
          {
            question: "Le terme 'Funding' signifie que la firme :",
            options: [
              "Vous donne de l'argent cash sur votre compte bancaire.",
              "Vous donne accès à un capital de trading institutionnel sous gestion.",
              "Paie vos factures internet.",
              "Investit dans votre entreprise."
            ],
            correctIndex: 1,
            explanation: "C'est un partenariat de gestion de capital, pas un prêt personnel."
          },
          {
            question: "Quelle est la durée moyenne d'une phase d'évaluation ?",
            options: ["1 jour", "Illimitée ou 30-60 jours selon le modèle", "1 an", "1 heure"],
            correctIndex: 1,
            explanation: "Le modèle moderne tend vers l'illimité pour réduire la pression psychologique sur le trader."
          }
        ]
      }
    ]
  },
  {
    id: 'advanced-risk-engineering',
    title: 'Ingénierie du Risque : La Mathématique de la Survie',
    level: 'ADVANCED',
    duration: '12h 30m',
    category: 'Quantitative Finance',
    thumbnail: '🛡️',
    description: 'Une analyse rigoureuse de la gestion des positions, de l\'espérance mathématique et de la variance statistique appliquée au trading à haute capitalisation.',
    lessons: [
      {
        id: 're-l1',
        title: 'Espérance Mathématique et Gestion de la Variance',
        introduction: "Le trading n'est pas un jeu de prédiction, c'est un jeu de nombres. Cette leçon déconstruit les mythes de l'analyse technique pour se concentrer sur la seule chose qui compte : l'espérance mathématique positive (Expectancy).",
        theory: `
        **1. La Formule de l'Expectancy**
        L'espérance (E) se calcule ainsi : 
        \`E = (Win Rate * Average Win) - (Loss Rate * Average Loss)\`
        Si E > 0, votre système est profitable à long terme. La majorité des traders débutants se concentrent sur le 'Win Rate' alors que les professionnels optimisent le ratio 'Average Win / Average Loss' (Risk:Reward).

        **2. Comprendre la Variance (The Losing Streak)**
        Même avec un Win Rate de 60%, il y a une probabilité statistique de 98% de subir une série de 6 pertes consécutives au cours de 100 trades. Si vous risquez 2% par trade, cette série normale vous amènera à -12% de drawdown, violant la plupart des règles de Prop Firm.
        
        **3. Le Modèle de Position Sizing Dynamique**
        - **Risque Fixe** : On risque un montant monétaire identique par trade.
        - **Risque en Pourcentage** : On ajuste le lot en fonction de la balance actuelle.
        - **Le Kelly Criterion** : Une formule mathématique pour déterminer la taille optimale d'une mise. En trading, on utilise souvent le "Fractional Kelly" (1/4 ou 1/10) pour éviter la ruine statistique.

        **4. Corrélation de Portefeuille**
        Ouvrir un achat sur EUR/USD et un achat sur GBP/USD simultanément n'est pas une diversification, c'est un double pari sur la faiblesse du Dollar. En cas de retournement du USD, votre risque réel est doublé.
        `,
        examples: `
        **Calcul du Lot pour le Challenge :**
        Capital : 100 000 $
        Risque par trade : 0.25% (250 $)
        Stop Loss : 15 Pips
        Paire : EUR/USD (Valeur du pip = 10 $ pour 1 lot standard)
        
        \`Taille du Lot = 250 / (15 * 10) = 1.66 Lots\`
        Ce calcul doit être automatisé. Toute erreur manuelle peut coûter le challenge.
        `,
        commonErrors: `
        - **La Martingale** : Doubler sa mise après une perte pour 'se refaire'. C'est le moyen le plus rapide d'activer le RMS de la firme et d'être banni.
        - **Le Risque Fixe en Pips** : Utiliser 1 lot pour 10 pips de SL et 1 lot pour 50 pips de SL. Le risque monétaire est 5 fois plus élevé dans le second cas.
        `,
        bestPractices: `
        - **Équation de Ruine** : Maintenir un risque tel que la probabilité de toucher le drawdown maximal soit inférieure à 1%.
        - **Capping Journalier** : S'imposer une limite de 2 pertes consécutives par jour. Au-delà, la psychologie est altérée et la variance devient dangereuse.
        `,
        summary: "La gestion du risque n'est pas une contrainte, c'est votre seul avantage concurrentiel. Le marché est aléatoire à court terme, mais vos mathématiques doivent être déterministes.",
        quizzes: [
          {
            question: "Quelle est l'espérance d'un système avec 40% de réussite, un gain moyen de 300$ et une perte moyenne de 100$ ?",
            options: ["+20$", "+60$", "+120$", "-10$"],
            correctIndex: 1,
            explanation: "(0.4 * 300) - (0.6 * 100) = 120 - 60 = 60$. Le système est largement profitable."
          },
          {
            question: "Le 'Risk of Ruin' augmente de manière exponentielle quand :",
            options: [
              "Le Win Rate augmente.",
              "Le risque par trade dépasse 2%.",
              "Le broker change ses spreads.",
              "On utilise un stop loss."
            ],
            correctIndex: 1,
            explanation: "Au-delà de 2%, la variance peut détruire un compte avant que la loi des grands nombres ne s'applique."
          },
          {
            question: "Pourquoi les corrélations d'actifs sont-elles importantes ?",
            options: [
              "Elles permettent de gagner plus.",
              "Elles évitent de doubler ou tripler son risque sur une seule devise sans le savoir.",
              "Elles prédisent le futur.",
              "Elles sont inutiles en Prop Trading."
            ],
            correctIndex: 1,
            explanation: "Trader des paires corrélées positivement revient à augmenter son levier de manière invisible."
          },
          {
            question: "Que se passe-t-il si vous risquez 1% par trade et subissez 10 pertes consécutives ?",
            options: [
              "Vous perdez 10% exactement.",
              "Vous perdez environ 9.56% à cause de la capitalisation dégressive.",
              "Vous gagnez de l'argent.",
              "Le compte est doublé."
            ],
            correctIndex: 1,
            explanation: "Le calcul se fait sur la balance restante, créant un effet de frein à la baisse."
          },
          {
            question: "L'objectif d'un stop loss est de :",
            options: [
              "Prédire où le prix va s'arrêter.",
              "Invalider une hypothèse de trading et protéger le capital.",
              "Donner de l'argent au broker.",
              "Faire peur aux autres traders."
            ],
            correctIndex: 1,
            explanation: "Un SL est un point de sortie logique où votre scénario n'est plus valable."
          },
          {
            question: "Qu'est-ce que le ratio de Sharpe ?",
            options: [
              "Un ratio de profit simple.",
              "Une mesure de la performance ajustée au risque (volatilité).",
              "La vitesse d'exécution.",
              "Une marque de couteaux."
            ],
            correctIndex: 1,
            explanation: "Les institutions utilisent le Sharpe pour savoir si votre profit est 'propre' ou le fruit d'une prise de risque excessive."
          },
          {
            question: "Dans un challenge de 100k$, si vous perdez 4 500$ en une matinée avec une limite journalière de 5 000$, que devez-vous faire ?",
            options: [
              "Prendre un dernier gros trade pour remonter.",
              "Arrêter immédiatement pour éviter le 'slippage' qui pourrait vous faire sauter.",
              "Changer d'actif.",
              "Appeler le support."
            ],
            correctIndex: 1,
            explanation: "La proximité de la limite journalière est une zone de danger critique."
          },
          {
            question: "Le 'Scaling In' consiste à :",
            options: [
              "Sortir d'une position.",
              "Ajouter à une position gagnante en gérant le risque global.",
              "Doubler une position perdante.",
              "Prier pour que le prix monte."
            ],
            correctIndex: 1,
            explanation: "C'est une technique avancée pour maximiser les gains sur les tendances fortes."
          },
          {
            question: "La valeur d'un pip sur le Gold (XAUUSD) pour 1.00 lot est de :",
            options: ["1$", "10$", "100$", "Variable selon le broker"],
            correctIndex: 1,
            explanation: "Standardisé à 10$ pour un mouvement de 0.10 sur la plupart des flux institutionnels."
          },
          {
            question: "Quel est le risque majeur d'utiliser un levier de 1:100 ?",
            options: [
              "Aucun risque.",
              "Permet de perdre la totalité du capital autorisé en quelques secondes.",
              "On gagne trop vite.",
              "Le spread diminue."
            ],
            correctIndex: 1,
            explanation: "Le levier est un outil de capitalisation qui amplifie autant les erreurs que les succès."
          }
        ]
      }
    ]
  },
  {
    id: 'performance-psychology',
    title: 'Psychologie de Haute Performance : Le Mindset du Trader Financé',
    level: 'ADVANCED',
    duration: '6h 15m',
    category: 'Behavioral Finance',
    thumbnail: '🧠',
    description: 'Une exploration neurologique et comportementale du trading. Comment reprogrammer son cerveau pour accepter l\'incertitude et la discipline algorithmique.',
    lessons: [
      {
        id: 'ps-l1',
        title: 'Neurologie du Risque et Biais Cognitifs',
        introduction: "Vous ne tradez pas le marché, vous tradez vos propres croyances. Cette leçon vous apprend à identifier et neutraliser les impulsions biologiques qui sabotent votre performance.",
        theory: `
        **1. L'Amydgale vs le Cortex Préfrontal**
        Lors d'une perte, l'amygdale (cerveau limbique) déclenche une réaction de "Combat ou Fuite". Cela se traduit par le Revenge Trading (Combat) ou l'incapacité à cliquer (Fuite). Le trader d'élite utilise des protocoles pour forcer le cortex préfrontal (logique) à reprendre le contrôle.

        **2. L'Aversion à la Perte (Prospect Theory)**
        Kahneman & Tversky ont prouvé que la douleur d'une perte de 1000$ est deux fois plus intense que la joie d'un gain de 1000$. En trading, cela pousse à couper ses gains trop tôt par peur qu'ils disparaissent, et à laisser courir ses pertes en espérant un retour à l'équilibre.

        **3. Le Biais de Récence**
        C'est la tendance à accorder trop d'importance aux derniers résultats. Trois gains d'affilée créent une illusion d'invincibilité (euphorie), tandis que trois pertes créent un sentiment d'échec total. Les deux sont dangereux car ils altèrent l'exécution du plan de trading.

        **4. La Discipline comme Système, non comme Volonté**
        La volonté est une ressource épuisable. Le trader pro ne "se force pas" à être discipliné ; il crée un environnement (SOP - Standard Operating Procedures) où l'indiscipline est techniquement impossible ou trop coûteuse.
        `,
        examples: `
        **Cas d'école : Le Syndrome de la 'Ligne de Flottaison'**
        Un trader est à +8% sur son challenge (objectif 10%). Il voit une opportunité mais hésite. La peur de 'perdre son avance' l'empêche de prendre le trade qui l'aurait validé. Finalement, il prend un trade impulsif plus tard par frustration et retombe à 0%. C'est un échec psychologique de gestion d'équité.
        `,
        commonErrors: `
        - **Vérifier son PnL flottant chaque seconde** : Cela active le stress chronique et pousse aux décisions impulsives.
        - **Trader pour 'Payer une Facture'** : Le besoin d'argent crée un biais de résultat qui détruit l'objectivité face au graphique.
        `,
        bestPractices: `
        - **Process-Oriented Trading** : Se noter sur la qualité de l'exécution, non sur le résultat financier. Un trade perdant mais parfaitement exécuté est une victoire.
        - **Routine Pré-Marché** : Méditation, revue du calendrier économique et validation de l'état émotionnel avant d'ouvrir le terminal.
        `,
        summary: "Le trading est la forme d'introspection la plus chère au monde. Le succès vient du détachement émotionnel et de l'acceptation totale des probabilités.",
        quizzes: [
          {
            question: "Qu'est-ce que l'aversion à la perte en trading ?",
            options: [
              "Le fait de détester perdre.",
              "La tendance à couper ses profits vite et laisser courir ses pertes.",
              "Une stratégie de gestion du risque.",
              "Le calcul du drawdown."
            ],
            correctIndex: 1,
            explanation: "C'est un biais cognitif qui pousse à une gestion asymétrique et destructrice du capital."
          },
          {
            question: "Le 'Revenge Trading' est provoqué par :",
            options: [
              "Une analyse trop complexe.",
              "Une blessure narcissique suite à une perte non acceptée.",
              "Un manque de capital.",
              "Une connexion internet lente."
            ],
            correctIndex: 1,
            explanation: "Le cerveau cherche à restaurer son ego en 'reprenant' l'argent au marché immédiatement."
          },
          {
            question: "Pourquoi est-il important de ne pas regarder son PnL en continu ?",
            options: [
              "Pour économiser de la batterie.",
              "Pour éviter les stimuli émotionnels qui altèrent la prise de décision logique.",
              "Parce que le broker n'aime pas ça.",
              "C'est une règle de la Prop Firm."
            ],
            correctIndex: 1,
            explanation: "Le PnL flottant active des émotions de peur ou d'avidité inutiles pour l'exécution du plan."
          },
          {
            question: "Que signifie 'penser en probabilités' ?",
            options: [
              "Être sûr de gagner le prochain trade.",
              "Accepter qu'un trade individuel a un résultat incertain, mais que 100 trades ont un résultat prévisible.",
              "Calculer des maths complexes.",
              "Utiliser une calculatrice de lots."
            ],
            correctIndex: 1,
            explanation: "C'est le changement de paradigme qui sépare les amateurs des professionnels."
          },
          {
            question: "L'euphorie après une série de gains mène souvent à :",
            options: [
              "Une meilleure performance.",
              "Une prise de risque excessive et un relâchement de la discipline.",
              "Plus de calme.",
              "Un arrêt du trading."
            ],
            correctIndex: 1,
            explanation: "L'euphorie est aussi dangereuse que la dépression en trading ; elle aveugle face au risque."
          },
          {
            question: "Quelle est la meilleure façon de gérer le stress en drawdown ?",
            options: [
              "Augmenter les lots.",
              "Réduire drastiquement la taille des positions pour regagner en confiance.",
              "Arrêter de trader pour toujours.",
              "Acheter un nouvel indicateur."
            ],
            correctIndex: 1,
            explanation: "Réduire le risque réduit la charge émotionnelle, permettant un retour à la logique."
          },
          {
            question: "Un 'Trading Journal' sert principalement à :",
            options: [
              "Noter ses profits pour les impôts.",
              "Identifier ses propres schémas de comportement et erreurs répétitives.",
              "Montrer ses trades sur Instagram.",
              "Se souvenir du prix de l'Or."
            ],
            correctIndex: 1,
            explanation: "C'est l'outil d'auto-analyse indispensable pour évoluer."
          },
          {
            question: "L'ego en trading se manifeste par :",
            options: [
              "Une grande politesse.",
              "Le besoin d'avoir raison contre le prix (ne pas couper sa perte).",
              "Une montre de luxe.",
              "L'utilisation de plusieurs écrans."
            ],
            correctIndex: 1,
            explanation: "L'ego est l'ennemi de l'adaptabilité. Le marché a toujours raison."
          },
          {
            question: "Le FOMO (Fear Of Missing Out) est :",
            options: [
              "Une technique de scalping.",
              "La peur de rater un mouvement, poussant à entrer sans signal valide.",
              "Un indicateur de volume.",
              "Une marque de plateforme."
            ],
            correctIndex: 1,
            explanation: "Le FOMO est une réaction impulsive à la volatilité."
          },
          {
            question: "La 'Discipline' en trading est comparée à :",
            options: ["Un sprint", "Un muscle qui se fatigue ou un système automatisé", "Une option", "Un talent inné"],
            correctIndex: 1,
            explanation: "Elle doit être soutenue par des règles rigides car la volonté humaine fluctue."
          }
        ]
      }
    ]
  }
];

const MasterClass: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'CONTENT' | 'QUIZ' | 'RESULTS'>('CONTENT');
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentLesson = selectedCourse?.lessons[currentLessonIndex];

  const handleStartCourse = (course: AcademyCourse) => {
    setSelectedCourse(course);
    setCurrentLessonIndex(0);
    setViewMode('CONTENT');
    resetQuiz();
  };

  const resetQuiz = () => {
    setQuizAnswers([]);
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
  };

  const handleNextQuestion = (optionIdx: number) => {
    const newAnswers = [...quizAnswers, optionIdx];
    setQuizAnswers(newAnswers);
    setShowExplanation(true);
  };

  const proceedToNext = () => {
    if (!currentLesson) return;
    if (currentQuestionIndex < currentLesson.quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      setViewMode('RESULTS');
    }
  };

  const quizScore = useMemo(() => {
    if (!currentLesson) return 0;
    return quizAnswers.filter((ans, idx) => ans === currentLesson.quizzes[idx].correctIndex).length;
  }, [quizAnswers, currentLesson]);

  if (selectedCourse && currentLesson) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-right-4 duration-500">
        <header className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <button 
            onClick={() => { setSelectedCourse(null); resetQuiz(); }}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group font-black uppercase text-xs tracking-widest"
          >
            <LucideChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            QUITTER L'ACADÉMIE
          </button>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Chapitre Actuel</p>
                <p className="text-xs font-black text-indigo-400 italic">Leçon {currentLessonIndex + 1} / {selectedCourse.lessons.length}</p>
             </div>
             <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                <LucideBookOpen size={20} />
             </div>
          </div>
        </header>

        <div className="bg-[#121214] border border-white/5 rounded-[48px] overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[800px]">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-80 bg-black/20 border-r border-white/5 p-8 space-y-6">
            <div>
              <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6 italic">Programme de Certification</h3>
              <div className="space-y-4">
                {selectedCourse.lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => { setCurrentLessonIndex(idx); setViewMode('CONTENT'); resetQuiz(); }}
                    className={`w-full p-5 rounded-3xl text-left transition-all border group ${
                      currentLessonIndex === idx 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl shadow-indigo-600/20' 
                      : 'bg-transparent border-transparent text-zinc-500 hover:bg-white/5 hover:border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] ${currentLessonIndex === idx ? 'bg-white/20' : 'bg-zinc-800 group-hover:bg-zinc-700'}`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-black uppercase tracking-tight leading-tight">{lesson.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-white/5">
              <div className="bg-amber-500/5 p-6 rounded-3xl border border-amber-500/10">
                <div className="flex items-center gap-3 mb-4">
                  <LucideBarChart3 className="text-amber-500" size={16} />
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Statistiques</span>
                </div>
                <p className="text-zinc-500 text-[10px] leading-relaxed italic">"La réussite de ce module débloque les badges de confiance pour les investisseurs."</p>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow p-8 lg:p-16 overflow-y-auto max-h-[900px] bg-gradient-to-br from-[#121214] to-black">
            {viewMode === 'CONTENT' ? (
              <div className="space-y-16 animate-in fade-in duration-700">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-4 py-1.5 rounded-full border border-indigo-400/20">{selectedCourse.category}</span>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-800 px-4 py-1.5 rounded-full border border-white/5">{selectedCourse.level}</span>
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">{currentLesson.title}</h1>
                </div>

                <div className="space-y-14">
                   {/* Intro */}
                   <div className="bg-indigo-600/5 p-10 rounded-[40px] border border-indigo-500/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[60px] -z-10 group-hover:bg-indigo-600/20 transition-all duration-1000" />
                      <h3 className="text-xl font-black text-indigo-400 uppercase italic mb-6 flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center"><LucideZap size={20} /></div> 
                        1. Introduction Stratégique
                      </h3>
                      <p className="text-zinc-300 text-lg leading-relaxed italic border-l-4 border-indigo-500/40 pl-8 font-medium">{currentLesson.introduction}</p>
                   </div>

                   {/* Theory */}
                   <div className="space-y-8 px-4">
                      <h3 className="text-2xl font-black text-white uppercase italic flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20"><LucideTarget size={24} /></div>
                        2. Fondements Théoriques Avancés
                      </h3>
                      <div className="text-zinc-400 text-lg leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
                        {currentLesson.theory.split('\n').map((line, i) => (
                          <p key={i} className={line.startsWith('**') ? 'text-white font-black uppercase tracking-tight mt-10 first:mt-0' : ''}>
                            {line.replace(/\*\*/g, '')}
                          </p>
                        ))}
                      </div>
                   </div>

                   {/* Examples */}
                   <div className="bg-emerald-500/5 p-10 rounded-[40px] border border-emerald-500/10 relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 blur-[60px] -z-10" />
                      <h3 className="text-xl font-black text-emerald-400 uppercase italic mb-6 flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center"><LucidePlay size={20} /></div>
                        3. Analyse de Cas Réel
                      </h3>
                      <p className="text-zinc-300 text-lg leading-relaxed italic font-medium">{currentLesson.examples}</p>
                   </div>

                   {/* Errors & Practices */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-rose-500/5 p-10 rounded-[40px] border border-rose-500/10 group hover:bg-rose-500/10 transition-colors">
                        <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center"><LucideShieldAlert size={16} /></div> 
                          Rampes de Sortie (Erreurs)
                        </h3>
                        <div className="text-zinc-500 text-sm leading-relaxed whitespace-pre-line font-bold italic">
                          {currentLesson.commonErrors}
                        </div>
                      </div>
                      <div className="bg-indigo-500/5 p-10 rounded-[40px] border border-indigo-500/10 group hover:bg-indigo-500/10 transition-colors">
                        <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center"><LucideStar size={16} /></div>
                          Protocoles d'Excellence
                        </h3>
                        <div className="text-zinc-500 text-sm leading-relaxed whitespace-pre-line font-bold italic">
                          {currentLesson.bestPractices}
                        </div>
                      </div>
                   </div>

                   {/* Summary */}
                   <div className="p-10 border dark:border-white/5 border-black/5 bg-black/40 rounded-[40px] shadow-inner">
                      <h3 className="text-[10px] font-black text-zinc-500 uppercase mb-4 tracking-widest italic">Synthèse Pédagogique du Module</h3>
                      <p className="text-zinc-400 text-lg italic font-medium leading-relaxed">"{currentLesson.summary}"</p>
                   </div>
                </div>

                <div className="pt-16 pb-10">
                  <button 
                    onClick={() => setViewMode('QUIZ')}
                    className="group w-full py-8 bg-indigo-600 text-white font-black rounded-[32px] hover:bg-indigo-500 transition-all shadow-3xl shadow-indigo-600/30 flex items-center justify-center gap-6 text-xl uppercase tracking-tighter"
                  >
                    <LucideTrophy size={28} className="group-hover:rotate-12 transition-transform" />
                    CERTIFIER LE MODULE ({currentLesson.quizzes.length} QUESTIONS)
                  </button>
                  <p className="text-center mt-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Temps estimé : 15-20 minutes • Examen à enjeux élevés</p>
                </div>
              </div>
            ) : viewMode === 'QUIZ' ? (
              <div className="space-y-12 animate-in slide-in-from-bottom-12 duration-700">
                <div className="flex justify-between items-center bg-black/60 p-8 rounded-[32px] border dark:border-white/5 border-black/5 shadow-2xl backdrop-blur-xl">
                   <div>
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 italic">Examen Technique de Validation</p>
                     <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Question {currentQuestionIndex + 1} <span className="text-zinc-700">/ {currentLesson.quizzes.length}</span></h3>
                   </div>
                   <div className="w-20 h-20 rounded-3xl border-4 border-indigo-600/20 border-t-indigo-600 animate-spin flex items-center justify-center bg-black/40">
                     <span className="animate-none text-xs font-black text-white italic">{Math.round(((currentQuestionIndex + 1) / currentLesson.quizzes.length) * 100)}%</span>
                   </div>
                </div>

                <div className="space-y-12 max-w-4xl mx-auto">
                  <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight italic tracking-tight">{currentLesson.quizzes[currentQuestionIndex].question}</h2>
                  
                  <div className="grid grid-cols-1 gap-5">
                    {currentLesson.quizzes[currentQuestionIndex].options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        disabled={showExplanation}
                        onClick={() => handleNextQuestion(oIdx)}
                        className={`group p-8 rounded-[32px] text-left border-2 transition-all font-black text-lg relative overflow-hidden ${
                          quizAnswers[currentQuestionIndex] === oIdx
                            ? oIdx === currentLesson.quizzes[currentQuestionIndex].correctIndex 
                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                                : 'border-rose-500 bg-rose-500/10 text-rose-400'
                            : showExplanation && oIdx === currentLesson.quizzes[currentQuestionIndex].correctIndex 
                                ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400'
                                : 'border-white/5 bg-black/40 text-zinc-500 hover:border-indigo-500/50 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-6 relative z-10">
                          <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-colors ${quizAnswers[currentQuestionIndex] === oIdx ? 'bg-white/10' : 'bg-zinc-800 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="flex-grow">{opt}</span>
                          {showExplanation && oIdx === currentLesson.quizzes[currentQuestionIndex].correctIndex && <LucideCheckCircle className="text-emerald-500" size={24} />}
                          {showExplanation && quizAnswers[currentQuestionIndex] === oIdx && oIdx !== currentLesson.quizzes[currentQuestionIndex].correctIndex && <LucideXCircle className="text-rose-500" size={24} />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {showExplanation && (
                    <div className="p-10 rounded-[40px] bg-indigo-600/10 border border-indigo-500/20 animate-in zoom-in-95 duration-500 shadow-2xl">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><LucideAlertCircle size={20} /></div>
                        <h4 className="text-lg font-black text-indigo-300 uppercase italic tracking-tighter">Décryptage Institutionnel</h4>
                      </div>
                      <p className="text-zinc-400 text-lg italic leading-relaxed font-medium mb-10">{currentLesson.quizzes[currentQuestionIndex].explanation}</p>
                      <button 
                        onClick={proceedToNext}
                        className="w-full py-6 bg-white text-black font-black rounded-3xl flex items-center justify-center gap-4 hover:bg-zinc-200 transition-all shadow-xl text-lg uppercase tracking-widest"
                      >
                        {currentQuestionIndex < currentLesson.quizzes.length - 1 ? 'QUESTION SUIVANTE' : 'VOIR LES RÉSULTATS DE CERTIFICATION'}
                        <LucideChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-12 animate-in zoom-in-95 duration-700 py-16">
                <div className="relative">
                   <div className="w-72 h-72 rounded-full border-8 border-indigo-600/20 flex items-center justify-center bg-black/40 shadow-3xl">
                     <LucideTrophy size={140} className="text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-bounce" />
                   </div>
                   <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-12 py-5 rounded-[32px] font-black text-4xl shadow-3xl shadow-indigo-600/40 italic">
                      {quizScore} <span className="text-indigo-300 text-2xl">/ {currentLesson.quizzes.length}</span>
                   </div>
                </div>

                <div className="space-y-6 max-w-2xl">
                  <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Bilan de Performance</h2>
                  <p className="text-zinc-500 text-xl font-medium leading-relaxed">
                    {quizScore === currentLesson.quizzes.length 
                      ? "Score Parfait. Vous maîtrisez les protocoles institutionnels. Votre node TradeSense est désormais certifié 'Elite Tier'." 
                      : quizScore >= currentLesson.quizzes.length * 0.7 
                      ? "Module Validé. Vos bases théoriques sont solides, mais restez vigilant sur l'application pratique en drawdown."
                      : "Certification Échouée. En Prop Trading, une erreur théorique se transforme en perte de capital. Revoyez les concepts avant de trader."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl pt-6">
                   <button 
                     onClick={() => { resetQuiz(); setViewMode('CONTENT'); }}
                     className="flex-grow py-6 bg-zinc-900 text-white font-black rounded-3xl hover:bg-zinc-800 border border-white/5 transition-all text-sm uppercase tracking-widest"
                   >
                     REPRENDRE LA LEÇON
                   </button>
                   <button 
                     onClick={() => { setSelectedCourse(null); resetQuiz(); }}
                     className="flex-grow py-6 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-500 shadow-2xl shadow-indigo-600/40 transition-all text-sm uppercase tracking-widest"
                   >
                     RETOUR AU CATALOGUE
                   </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-20 animate-in fade-in duration-1000">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 border-b border-white/5 pb-16">
        <div className="flex items-center gap-10">
          <div className="p-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[40px] shadow-[0_0_50px_rgba(245,158,11,0.2)] group hover:rotate-6 transition-transform duration-500">
            <LucideGraduationCap className="text-black" size={56} />
          </div>
          <div>
            <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">TradeSense Academy</h2>
            <p className="text-zinc-500 text-lg font-black uppercase tracking-widest flex items-center gap-3">
               <LucideBarChart3 className="text-indigo-500" size={20} /> Certification Professionnelle Prop Firm
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 bg-indigo-600/10 px-10 py-6 rounded-[32px] border border-indigo-500/20 backdrop-blur-md">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-xl"><LucideStar size={24} fill="currentColor" /></div>
          <div className="text-left">
            <span className="block text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Standard de Formation</span>
            <span className="text-lg font-black text-white italic tracking-tight">PROFESSIONAL GRADE V2.5</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {ACADEMY_DATA.map((course) => (
          <div key={course.id} className="bg-[#121214] border border-white/5 rounded-[56px] overflow-hidden group hover:border-indigo-500/40 transition-all duration-500 shadow-3xl flex flex-col relative">
            <div className="h-64 bg-zinc-900 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform duration-1000 ease-out relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
              <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              {course.thumbnail}
            </div>
            <div className="p-12 flex-grow flex flex-col relative z-20">
              <div className="flex items-center gap-4 mb-8">
                <span className={`text-[10px] font-black px-5 py-2 rounded-full border ${
                  course.level === 'BEGINNER' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                  course.level === 'INTERMEDIATE' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-500 border-rose-500/20'
                }`}>
                  {course.level}
                </span>
                <span className="flex items-center gap-2 text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-auto">
                  <LucideClock size={16} /> {course.duration}
                </span>
              </div>
              <h4 className="text-3xl font-black text-white mb-6 group-hover:text-indigo-400 transition-colors italic uppercase tracking-tighter leading-none">
                {course.title}
              </h4>
              <p className="text-zinc-500 text-sm mb-12 leading-relaxed font-bold italic">
                {course.description}
              </p>
              <button 
                onClick={() => handleStartCourse(course)}
                className="mt-auto w-full py-6 bg-white text-black font-black rounded-[28px] text-xs flex items-center justify-center gap-4 hover:bg-zinc-200 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl uppercase tracking-widest"
              >
                <LucideZap size={18} fill="currentColor" /> DÉBARRER LE MODULE PRO
              </button>
            </div>
          </div>
        ))}

        {/* Locked Teaser */}
        <div className="bg-black/20 border-2 border-dashed border-white/5 rounded-[56px] p-12 flex flex-col items-center justify-center text-center opacity-30 grayscale group hover:grayscale-0 transition-all duration-700">
           <div className="w-24 h-24 bg-zinc-800 rounded-[32px] flex items-center justify-center mb-8 border border-white/5 group-hover:bg-indigo-600/10 group-hover:border-indigo-500/20">
              <LucideBrainCircuit className="text-zinc-600 group-hover:text-indigo-400" size={48} />
           </div>
           <h4 className="text-2xl font-black text-zinc-600 uppercase italic tracking-tighter leading-none">Algorithm Design & HFT Flow</h4>
           <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mt-4">Module Avancé • En cours de développement</p>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-[#121214] border dark:border-white/5 border-black/5 p-16 rounded-[64px] flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] -z-10" />
        <div className="flex items-center gap-10">
          <div className="w-24 h-24 bg-indigo-600/10 rounded-[32px] flex items-center justify-center border border-indigo-500/20 shadow-2xl">
            <LucideTrophy className="text-indigo-500" size={44} fill="currentColor" />
          </div>
          <div className="text-left">
            <p className="text-7xl font-black text-white italic leading-none mb-3 tracking-tighter">0 <span className="text-zinc-800">/ 3</span></p>
            <p className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
               <LucideCheckCircle size={14} className="text-emerald-500" /> Certifications de Compétence
            </p>
          </div>
        </div>
        
        <div className="flex-grow w-full max-w-2xl space-y-6">
           <div className="flex justify-between items-end px-2">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Progression du Curriculum</span>
              <span className="text-sm font-black text-zinc-700 italic uppercase">0% Synchronisé</span>
           </div>
           <div className="h-8 bg-black/60 rounded-full p-2 border border-white/5 relative overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(79,70,229,0.5)]" 
                style={{ width: '0%' }} 
              />
           </div>
        </div>

        <div className="flex flex-col items-center lg:items-end text-center lg:text-right gap-2">
           <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Rang Académique Actuel</span>
           <div className="px-8 py-4 bg-zinc-900 rounded-3xl border border-white/5 font-black text-zinc-600 italic text-sm tracking-tighter shadow-2xl uppercase">
              NOVICE_LEVEL_0
           </div>
        </div>
      </div>
    </div>
  );
};

export default MasterClass;

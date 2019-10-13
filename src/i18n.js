import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          SignUpButton_title: "Sign Up",
          SignUpButton_signedUp: "Welcome!",
          SignUpButton_notSignedUp: "Sign Up",
          SignupInvitation : "Signup is just one clic!",
          LoginInvitation : "Please, enter your login/password.",
          Login_out : "Log out",
          Login_in : "Log in",
          Menu:'Menu',
          App_title : "Hello, welcome to discover tools for learning chinese with joy!",
          GameCard_vote: "Vote!",
          GameCard_go : "Go!",
          GameTextAbstract_readCharacterWritePinyin: "Read character, write pinyin!",
          GameTextAbstract_readCharacterSelectFrench: "Read character, select french!",
          GameTextAbstract_readCharacterChoosePronunciation: "Read character, choose pronunciation!",
          GameDecorationCharacter_gameNotAvailable : "Vote!",
          Rank_points : "pts",
          WelcomeMessage_goodToSeeYou : "This is good to see you back!",
          WelcomeMessage_countingTime : " That was already ",
          WelcomeMessage_day : " day!",
          WelcomeMessage_days: " days!",
        }
      },
      fr: {
        translations: {
          SignUpButton_title: "Je m'incris!",
          SignUpButton_signedUp: "Bienvenue!",
          SignUpButton_notSignedUp: "Je m'incris!",
          SignupInvitation : "Je m'inscris en quelques clics",
          LoginInvitation : "Veuillez saisir vos identifiants de connexion",
          Login_out : "Se déconnecter",
          Login_in : "Se connecter",
          Menu:'Menu',
          App_title : "Bonjour et bienvenue pour découvrir des outils vous accompagnant dans l'apprentissage du chinois.",
          GameCard_vote: "Je vote!",
          GameCard_go : "J'y vais!",
          GameTextAbstract_readCharacterWritePinyin: "Lire le caractère, écrire le pinyin!",
          GameTextAbstract_readCharacterSelectFrench: "Lire le caractère, choisir le bon mot en français!",
          GameTextAbstract_readCharacterChoosePronunciation: "Lire le caractère, choisir la bonne prononciation!",
          GameDecorationCharacter_gameNotAvailable : "Je vote pour!",
          CharacterMaison : "家",
          Rank_points : "pts",
          WelcomeMessage_goodToSeeYou : "C'est bon de vous revoir.",
          WelcomeMessage_countingTime: "Cela faisait déjà ",
          WelcomeMessage_day : " jour!",
          WelcomeMessage_days: " jours!",
        }
      }
    },
    fallbackLng: "en",
    debug: true,

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

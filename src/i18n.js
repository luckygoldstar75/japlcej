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
          SignUp_welcome :"Welcome, thank you for subscribing.",
          SignUp_welcome_reemission_link: "Hello, we just need a couple of information here",
          SignUp_invitation: "Just a few clics to subscribe",
          SignUpButton_title: "Sign Up",
          SignUpButton_signedUp: "Subscribe!",
          SignUpButton_notSignedUp: "Sign Up",
          SignUp_confirmation_link_needed : "Need a new confirmation link ?",
          SignUp_email: "Email",
          SignUp_password :"Password",
          SignUp_confirmation_password :"Confirm",
          Login_out : "Log out",
          Login_in : "Log in",
          Login_required : "You must first login in order to play!",
          Login_your_password :"Your password",
          Login_your_email: "youremail@here",
          Login_forgotten_password :"Forgotten password?",
          Login_email : "Email",
          Login_password : "Password",
          Login_invitation: "Please, input necessary information for login",
          Reset_password_welcome : "Welcome, you may now change your password.",
          Forgotten_password_resend_welcome : "Welcome, please input your information and we will send you an email",
          Menu:'Menu',
          App_title : "Hello, welcome to discover tools for learning chinese with joy!",
          Button_close : "Close",
          Button_submit : "Submit",
          GameCard_vote: "Vote!",
          GameCard_go : "Go!",
          Game_button_submit : "Submit",
          Game_button_next : "Next",
          GameTextAbstract_readCharacterWritePinyin: "Read character, write pinyin!",
          GameTextAbstract_readCharacterSelectFrench: "Read character, select french!",
          GameTextAbstract_readCharacterChoosePronunciation: "Read character, choose pronunciation!",
          GameTextAbstract_ListenThenSelectCharacter : "Listen the select the good character",
          GameDecorationCharacter_gameNotAvailable : "Vote!",
          Game_not_available_oups: 'Oups! game not Available!',
          Rank_points : "pts",
          WelcomeMessage_goodToSeeYou : "This is good to see you back!",
          WelcomeMessage_countingTime : " That was already ",
          WelcomeMessage_day : " day!",
          WelcomeMessage_days: " days!",
          Browser_too_old: "Your browser is too old to play audio HTML 5. You would better change it ! ;)"
        }
      },
      fr: {
        translations: {
          SignUp_welcome :"Bienvenue et merci de saisir les informations nécessaires pour votre inscription",
          SignUp_welcome_reemission_link: "Bonjour, veuillez saisir les informations demandées",
          SignUpButton_title: "Je m'incris!",
          SignUpButton_signedUp: "S'inscrire!",
          SignUpButton_notSignedUp: "Je m'incris!",
          SignUp_invitation : "Je m'inscris en quelques clics",
          SignUp_confirmation_link_needed : "Besoin d'un nouveau lien de confirmation ?",
          SignUp_email: "Email",
          SignUp_password :"Mot de passe",
          SignUp_confirmation_password :"Confirmer",
          Login_password : "Mot de passe",
          Login_out : "Se déconnecter",
          Login_in : "Se connecter",
          Login_required : "Vous devez d'abord vous connecter avant de jouer! Merci.",
          Login_your_password :"Votre mot de passe",
          Login_your_email: "Votre email",
          Login_forgotten_password :"Mot de passe oublié ?",
          Login_invitation: "Merci de saisir vos identifiants pour vous connecter",
          Reset_password_welcome : "Bienvenue pour votre changement de mot de passe",
          Forgotten_password_resend_welcome : "Merci de saisir les informations nécessaires pour que nous puissions vous renvoyer un mail de confirmation",
          Menu:'Menu',
          App_title : "Bonjour et bienvenue pour découvrir des outils vous accompagneront dans l'apprentissage du chinois.",
          Button_close : "Fermer",
          Button_submit : "Envoyer",
          GameCard_vote: "Je vote!",
          GameCard_go : "J'y vais!",
          Game_button_submit : "Valider",
          Game_button_next : "Suivant",
          GameTextAbstract_readCharacterWritePinyin: "Lire le caractère, écrire le pinyin!",
          GameTextAbstract_readCharacterSelectFrench: "Lire le caractère, choisir le bon mot en français!",
          GameTextAbstract_readCharacterChoosePronunciation: "Lire le caractère, choisir la bonne prononciation!",
          GameTextAbstract_ListenThenSelectCharacter : "Ecoute puis sélectionne le bon caractère",
          GameDecorationCharacter_gameNotAvailable : "Je vote pour!",
          Game_not_available_oups: "Oups! Le jeu n'est pas encore disponible!",
          CharacterMaison : "家",
          Rank_points : "pts",
          WelcomeMessage_goodToSeeYou : "C'est bon de vous revoir.",
          WelcomeMessage_countingTime: "Cela faisait déjà ",
          WelcomeMessage_day : " jour!",
          WelcomeMessage_days: " jours!",
          Browser_too_old: "Votre navigateur ne prend pas en charge l'audio HTML.Il est trop vieux, changez le ! ;)"
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

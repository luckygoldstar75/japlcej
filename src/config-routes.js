//import './config-login.js'
export const japlcejAPI = process.env.REACT_APP_backendURLRadical||'http://melocal:4000/services/';
export const routesURLs = {
 GUESS : 'guess',
 IS_LOGGEDIN : 'login',
 LOGIN : 'login',
 LOGIN_FORGOT_PASSWORD : 'forgotPassword',
 DO_PASSWORD_RESET : 'resetPassword',
 LOGOUT  :'logout',
 SIGNUP :'signup',
 SIGNUP_REEMISSION_REQUEST : 'signupReemissionRequest',
 USER_RANK_INFO : 'rank',
 GETSCORES : 'scores',
 GETPLAYERRESULTS : 'playerResults' //playerResults/{gameName}/{level}
};

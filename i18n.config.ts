export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            TBD: 'TBD',
            layouts: {
                title: 'Global title'
            },
            welcome: 'Welcome',
            submit: 'Submit',
            login: 'Login',
            profile: 'Profile',
            signedWith: 'Signed in with',
            signIn: 'Sign in',
            signInGoogle: 'Sign in with Google',
            signOut: 'Sign out',
            signUp: 'Sign up',
            noAccount: `Don't have an account?`
        },
        fr: {
            layouts: {
                title: 'Titre global'
            },
            welcome: 'Bienvenue',
            submit: 'Valider',
            login: 'Connexion',
            profile: 'Profil',
            signedWith: 'Connecté avec',
            signIn: 'Connexion',
            signInGoogle: 'Se connecter avec Google',
            signOut: 'Se déconnecter',
            signUp: `S'inscrire`,
            noAccount: `Vous n'avez pas de compte ?`
        }
    }
}))
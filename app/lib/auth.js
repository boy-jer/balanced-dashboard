var defaultBalancedAuthOptions = {
    baseUrl: ENV.BALANCED.AUTH,
    signInEndPoint: '/logins',
    signOutEndPoint: '/logins/current',

    tokenKey: 'id',
    tokenIdKey: 'user_uri',
    userModel: 'Balanced.User',

    // We're using the cookie, so Ember Auth doesn't need to worry about the token
    tokenLocation: 'none',
    sessionAdapter: 'cookie',
    modules: ['authRedirectable', 'actionRedirectable', 'rememberable'],
    authRedirectable: {
        route: 'login'
    },
    actionRedirectable: {
        signInSmart: true,
        signInBlacklist: ['login'],
        signOutRoute: 'index'
    },
    rememberable: {
        tokenKey: 'uri',
        period: 1,
        autoRecall: true
    }
};

Balanced.Auth = Ember.Auth.create(_.extend(defaultBalancedAuthOptions, window.BalancedAuthOptions));

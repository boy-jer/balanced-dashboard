Balanced.Adapter = Balanced.FixtureAdapter.create();

$(window).load(function () {

    QUnit.testStart(function () {

        // Display an error if asynchronous operations are queued outside of
        // Ember.run.  You need this if you want to stay sane.
        Ember.testing = true;
        Balanced.reset();

        //  we don't actually care about hitting a server
        Ember.ENV.BALANCED.WWW = 'http://example.org';
        Balanced.THROTTLE = 0;

        // Set up Ember Auth
        Ember.run(function () {
            Balanced.Auth.set('authToken', '/users/USeb4a5d6ca6ed11e2bea6026ba7db2987');
            Balanced.Auth.set('userId', '/users/USeb4a5d6ca6ed11e2bea6026ba7db2987');
            Balanced.Auth.set('signedIn', true);
            Balanced.Auth.set('user', Balanced.User.find(Balanced.Auth.userId));
        });
    });

    QUnit.testDone(function () {
        Ember.run(function () {
            Balanced.Auth.set('authToken', null);
            Balanced.Auth.set('userId', null);
            Balanced.Auth.set('signedIn', false);
            Balanced.Auth.set('user', null);
        });
        Ember.testing = false;
    });

});

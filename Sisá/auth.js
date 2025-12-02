// auth.js - simple client-side auth helpers (demo only - not secure)
(function(){
    window.SisAuth = {
        // Demo credentials (change as needed)
        username: 'teste',
        password: '123456',

        authenticate: function(user, pass) {
            return user === this.username && pass === this.password;
        },

        setAuth: function() {
            try { localStorage.setItem('sis_auth', '1'); } catch(e) {}
        },

        clearAuth: function() {
            try { localStorage.removeItem('sis_auth'); } catch(e) {}
        },

        isAuthenticated: function() {
            try { return localStorage.getItem('sis_auth') === '1'; } catch(e) { return false; }
        },

        requireAuth: function() {
            if (!this.isAuthenticated()) {
                var redirect = 'login.html?redirect=' + encodeURIComponent(location.pathname.replace(/^\//, ''));
                location.href = redirect;
            }
        }
    };
})();

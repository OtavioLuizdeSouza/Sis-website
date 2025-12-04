// auth.js - simple client-side auth helpers (demo only - not secure)
(function(){
    window.SisAuth = {
        // Demo credentials (change as needed)
        username: 'simone.souza',
        password: 'estetica4830',
        
        // Duração da sessão em dias (padrão: 1 dia)
        sessionDuration: 1,

        authenticate: function(user, pass) {
            return user === this.username && pass === this.password;
        },

        // Define autenticação com timestamp de expiração
        setAuth: function() {
            try {
                var expiryTime = new Date().getTime() + (this.sessionDuration * 24 * 60 * 60 * 1000);
                localStorage.setItem('sis_auth', '1');
                localStorage.setItem('sis_auth_expiry', expiryTime.toString());
                console.log('[Auth] Session set. Valid until:', new Date(expiryTime).toLocaleString());
                return true;
            } catch(e) {
                console.error('[Auth] Error setting session:', e);
                return false;
            }
        },

        clearAuth: function() {
            try {
                localStorage.removeItem('sis_auth');
                localStorage.removeItem('sis_auth_expiry');
                console.log('[Auth] Session cleared');
                return true;
            } catch(e) {
                console.error('[Auth] Error clearing session:', e);
                return false;
            }
        },

        // Verifica se autenticado e se não expirou
        isAuthenticated: function() {
            try {
                var auth = localStorage.getItem('sis_auth');
                var expiry = localStorage.getItem('sis_auth_expiry');
                
                console.log('[Auth] Check - token:', auth, ', expiry:', expiry);
                
                // Sem token = não autenticado
                if (!auth || auth !== '1') {
                    return false;
                }
                
                // Com token mas sem expiração = assume válido (compatibilidade)
                if (!expiry) {
                    return true;
                }
                
                // Verifica se expirou
                var now = new Date().getTime();
                var expiryNum = parseInt(expiry, 10);
                
                if (now > expiryNum) {
                    console.log('[Auth] Session expired, clearing');
                    this.clearAuth();
                    return false;
                }
                
                console.log('[Auth] Valid session found');
                return true;
            } catch(e) { 
                console.error('[Auth] Error checking session:', e);
                return false; 
            }
        },

        requireAuth: function() {
            var isAuth = this.isAuthenticated();
            console.log('[Auth] requireAuth called - authenticated:', isAuth);
            
            if (!isAuth) {
                var page = location.pathname.split('/').pop() || 'documentacao.html';
                var redirect = 'login.html?redirect=' + encodeURIComponent(page);
                console.log('[Auth] Redirecting to login, redirect param:', redirect);
                location.href = redirect;
            }
        }
    };
    
    // Teste rápido do localStorage
    console.log('[Auth] Testing localStorage...');
    try {
        localStorage.setItem('__test', '1');
        localStorage.removeItem('__test');
        console.log('[Auth] localStorage works OK');
    } catch(e) {
        console.error('[Auth] localStorage NOT available:', e);
    }
})();

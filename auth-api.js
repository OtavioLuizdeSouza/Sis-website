// auth-api.js - comunica com o backend para autenticação
(function(){
    const API_URL = 'http://localhost:3000/api'; // Altere conforme necessário
    
    window.SisAuth = {
        apiUrl: API_URL,

        // Login via API
        async login(username, password) {
            try {
                console.log('[Auth] Sending login request for user:', username);
                const response = await fetch(`${this.apiUrl}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ username, password })
                });

                console.log('[Auth] Login response status:', response.status);
                console.log('[Auth] Response headers:', {
                    'set-cookie': response.headers.get('set-cookie'),
                    'content-type': response.headers.get('content-type')
                });
                console.log('[Auth] Document cookies after login:', document.cookie);

                const data = await response.json();
                console.log('[Auth] Login response data:', data);
                
                if (data.success) {
                    console.log('[Auth] Login successful for user:', data.user.username);
                    // Aguarda um pouco para garantir que o cookie foi salvo
                    await new Promise(resolve => setTimeout(resolve, 500));
                    return { success: true, user: data.user };
                } else {
                    console.log('[Auth] Login failed:', data.message);
                    return { success: false, message: data.message };
                }
            } catch (error) {
                console.error('[Auth] Login error:', error);
                return { success: false, message: 'Erro de conexão com servidor. Verifique se o servidor está rodando em http://localhost:3000' };
            }
        },

        // Verificar se está autenticado
        async isAuthenticated() {
            try {
                console.log('[Auth] Checking authentication...');
                console.log('[Auth] Current document.cookie:', document.cookie);
                
                const response = await fetch(`${this.apiUrl}/auth-check`, {
                    method: 'GET',
                    credentials: 'include'
                });

                console.log('[Auth] Auth-check response status:', response.status);
                console.log('[Auth] Auth-check document.cookie:', document.cookie);

                if (!response.ok) {
                    console.log('[Auth] Auth check returned status:', response.status);
                    return false;
                }

                const data = await response.json();
                console.log('[Auth] Auth check response:', data);
                const isAuth = data.authenticated === true;
                console.log('[Auth] Is authenticated:', isAuth);
                return isAuth;
            } catch (error) {
                console.error('[Auth] Auth check error:', error);
                return false;
            }
        },

        // Logout
        async logout() {
            try {
                console.log('[Auth] Sending logout request...');
                const response = await fetch(`${this.apiUrl}/logout`, {
                    method: 'POST',
                    credentials: 'include'
                });

                const data = await response.json();
                console.log('[Auth] Logout response:', data);
                return data.success;
            } catch (error) {
                console.error('[Auth] Logout error:', error);
                return false;
            }
        },

        // Requer autenticação (redireciona se não estiver autenticado)
        async requireAuth() {
            console.log('[Auth] requireAuth called');
            const isAuth = await this.isAuthenticated();
            console.log('[Auth] requireAuth - authenticated:', isAuth);

            if (!isAuth) {
                const page = location.pathname.split('/').pop() || 'documentacao-new.html';
                const redirect = 'login-new.html?redirect=' + encodeURIComponent(page);
                console.log('[Auth] Redirecting to login, redirect param:', redirect);
                location.href = redirect;
            } else {
                console.log('[Auth] User is authenticated, allowing access');
            }
        }
    };
})();

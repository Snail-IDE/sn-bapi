// Function to dynamically load Fengari from a URL
function loadFengariFromURL(url) {
    return fetch(url)
        .then(response => response.text())
        .then(scriptText => {
            // Execute the script using eval
            eval(scriptText);
        })
        .catch(error => {
            console.error('Failed to load Fengari:', error);
        });
}

// Function to execute Lua code
function executeLuaCode(luaCode) {
    // Create a new Lua state
    const L = fengari.luat_newstate();
    
    try {
        // Load Lua code
        fengari.luaL_loadstring(L, luaCode);
        
        // Execute Lua code
        fengari.lua_pcall(L, 0, fengari.LUA_MULTRET, 0);
        
        // Get results
        const results = [];
        while (!fengari.lua_isnil(L, -1)) {
            results.push(fengari.lua_tojsstring(L, -1));
            fengari.lua_pop(L, 1);
        }
        
        return results;
    } catch (error) {
        return { error: error.message };
    } finally {
        // Close Lua state
        fengari.lua_close(L);
    }
}

// Function to get Lua code from URL parameter
function getLuaCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lua') || '';
}

// Function to run Lua code from URL parameter
function runLuaCodeFromURL() {
    const luaCode = getLuaCodeFromURL();
    return executeLuaCode(luaCode);
}

// Load Fengari from the specified URL
const fengariURL = 'https://nmsderp.is-a.dev/EzScript/scripts/fengari-web.js';
loadFengariFromURL(fengariURL)
    .then(() => {
        // Fengari is now loaded, you can use it here
        console.log('Fengari loaded successfully!');
        
        // Example usage: Execute Lua code from URL parameter
        const result = runLuaCodeFromURL();
        console.log('Result:', result);
    });

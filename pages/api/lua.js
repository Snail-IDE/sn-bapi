import { lua, lauxlib, lualib } from 'fengari';

export default async (req, res) => {
  const text = req.query.text;
  if (!text || typeof text !== 'string') {
    return res.status(400)
      .setHeader('Content-Type', 'application/json')
      .send(JSON.stringify({
        error: "Provide some text",
        example: "/lua?text=print('Hello, Lua!')"
      }, null, 4));
  }

  const L = lauxlib.luaL_newstate(); // Create a new Lua state
  lualib.luaL_openlibs(L); // Open Lua libraries

  try {
    lua.luaL_loadstring(L, text); // Load Lua code
    lua.lua_call(L, 0, 0); // Execute Lua code
    res.status(200).send("Lua code executed successfully.");
  } catch (err) {
    return res.status(400)
      .setHeader('Content-Type', 'application/json')
      .send(JSON.stringify({
        error: String(err)
      }, null, 4));
  } finally {
    lua.lua_close(L); // Close Lua state
  }
}

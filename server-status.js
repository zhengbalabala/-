const express = require('express');
const { status } = require('minecraft-server-util');
const app = express();

const SERVER_HOST = 'shaogemcserver.cn';
const SERVER_PORT = 12593;

// 允许 GitHub Pages 跨域访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});

app.get('/status', async (req, res) => {
  try {
    const result = await status(SERVER_HOST, SERVER_PORT, { 
      timeout: 8000,
      enableSRV: true 
    });

    res.json({
      online: true,
      players: {
        online: result.players.online || 0,
        max: result.players.max || 40,
        list: result.players.sample || []
      },
      version: result.version?.name || '1.21.11',
      motd: result.motd?.clean || 'ShaoGeMCserver'
    });
  } catch (error) {
    console.error('查询错误:', error.message);
    res.json({
      online: false,
      players: { online: 0, list: [] },
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Minecraft 状态查询服务已启动！`);
  console.log(`访问: http://localhost:${PORT}/status`);
});

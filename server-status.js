const express = require('express');
const { status } = require('minecraft-server-util');
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 允许 GitHub Pages 跨域访问
  next();
});

app.get('/status', async (req, res) => {
  try {
    const result = await status('shaogemcserver.cn', 12593, { timeout: 5000 });
    
    res.json({
      online: true,
      players: {
        online: result.players.online,
        max: result.players.max,
        list: result.players.sample || []
      },
      version: result.version.name,
      motd: result.motd.clean || result.motd,
      latency: result.latency
    });
  } catch (error) {
    console.error('查询失败:', error.message);
    res.json({
      online: false,
      players: { online: 0, list: [] },
      error: '服务器可能离线或查询超时'
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 服务器状态 API 已启动: http://localhost:${PORT}/status`);
});
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/tiktok/:username', async (req, res) => {
    const { username } = req.params;
    const cleanUser = username.replace('@', '').trim();

    try {
        const response = await fetch(`https://www.tiktok.com/@${cleanUser}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        const html = await response.text();
        const jsonMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/);

        if (!jsonMatch) {
            return res.status(404).json({ success: false, message: 'User not found or blocked' });
        }

        const jsonData = JSON.parse(jsonMatch[1]);
        const userDetail = jsonData.__DEFAULT_SCOPE__['webapp.user-detail']?.userInfo;

        if (!userDetail) {
            return res.status(404).json({ success: false, message: 'User details unavailable' });
        }

        return res.json({
            success: true,
            username: userDetail.user.uniqueId,
            nickname: userDetail.user.nickname,
            avatar: userDetail.user.avatarLarger || userDetail.user.avatarMedium,
            followers: userDetail.stats.followerCount
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = app;

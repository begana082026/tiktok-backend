const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

// TikTok Profile Fetcher Route
app.get('/api/tiktok/:username', async (req, res) => {
    const { username } = req.params;
    const cleanUser = username.replace('@', '').trim();

    try {
        const response = await fetch(`https://www.tikwm.com/api/user/info?unique_id=${cleanUser}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const data = await response.json();

        if (data && data.code === 0 && data.data) {
            const user = data.data.user;
            const stats = data.data.stats;

            return res.json({
                status: true,
                username: user.uniqueId,
                nickname: user.nickname,
                avatar: user.avatar,
                followers: stats.followerCount,
                following: stats.followingCount
            });
        } else {
            return res.status(404).json({ status: false, message: 'User Not Found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Server Connection Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

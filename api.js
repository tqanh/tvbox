// TikTok API Integration for TVBox
// Research API Documentation: https://developers.tiktok.com/doc/research-api-get-started

class TikTokAPI {
    constructor() {
        // API Configuration - BẠN CẦN THAY THẾ BẰNG API KEY THỰC
        this.apiKey = localStorage.getItem('tiktok_api_key') || 'YOUR_API_KEY_HERE';
        this.baseURL = 'https://open.tiktokapis.com/v2/research';
        
        // Sample data cho demo (khi chưa có API key)
        this.useSampleData = this.apiKey === 'YOUR_API_KEY_HERE';
    }
    
    // Set API key
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('tiktok_api_key', key);
        this.useSampleData = false;
    }
    
    // Search videos
    async searchVideos(keyword, cursor = 0) {
        if (this.useSampleData) {
            return this.getSampleVideos();
        }
        
        try {
            const response = await fetch(`${this.baseURL}/video/search/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    query: {
                        keywords: [keyword],
                        region_code: 'VN',
                        fields: ['id', 'create_time', 'username', 'region_code', 'share_count', 'view_count', 'like_count', 'comment_count', 'music_id', 'hashtag_names', 'video_description', 'title', 'effect_ids', 'playlist_id']
                    },
                    cursor: cursor,
                    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, ''),
                    end_date: new Date().toISOString().split('T')[0].replace(/-/g, '')
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                videos: data.data?.videos || [],
                cursor: data.data?.cursor,
                hasMore: data.data?.has_more
            };
        } catch (error) {
            console.error('TikTok API Error:', error);
            return this.getSampleVideos();
        }
    }
    
    // Get video info via oEmbed
    async getVideoEmbed(url) {
        try {
            const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('oEmbed Error:', error);
            return null;
        }
    }
    
    // Sample data for demo
    getSampleVideos() {
        return {
            videos: [
                {
                    id: '7234567890123456789',
                    video_description: 'Tổng tài trong bộ vest đen 🖤 #tongtai #ceo #fyp',
                    username: '@tongtai_luxury',
                    like_count: 1200000,
                    comment_count: 45200,
                    share_count: 12100,
                    view_count: 5800000,
                    create_time: Date.now() / 1000 - 86400,
                    title: 'Tổng tài điển trai',
                    hashtag_names: ['tongtai', 'ceo', 'fyp'],
                    thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'
                },
                {
                    id: '7234567890123456790',
                    video_description: 'A day in my life as CEO 💼 #ceo #morningroutine #tongtai',
                    username: '@ceo_official',
                    like_count: 856400,
                    comment_count: 32100,
                    share_count: 8500,
                    view_count: 3200000,
                    create_time: Date.now() / 1000 - 172800,
                    title: 'CEO lifestyle',
                    hashtag_names: ['ceo', 'morningroutine', 'tongtai'],
                    thumbnail_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop'
                },
                {
                    id: '7234567890123456791',
                    video_description: 'Bad boy vibes 😎 #badboy #tongtai #fashion',
                    username: '@badboy_style',
                    like_count: 2100000,
                    comment_count: 89300,
                    share_count: 25600,
                    view_count: 8500000,
                    create_time: Date.now() / 1000 - 259200,
                    title: 'Bad boy style',
                    hashtag_names: ['badboy', 'tongtai', 'fashion'],
                    thumbnail_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop'
                },
                {
                    id: '7234567890123456792',
                    video_description: 'Quý ông lịch lãm 🎩 #gentleman #style #tongtai',
                    username: '@gentleman_vn',
                    like_count: 567800,
                    comment_count: 21400,
                    share_count: 6200,
                    view_count: 2100000,
                    create_time: Date.now() / 1000 - 345600,
                    title: 'Gentleman style',
                    hashtag_names: ['gentleman', 'style', 'tongtai'],
                    thumbnail_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop'
                },
                {
                    id: '7234567890123456793',
                    video_description: 'Luxury lifestyle ✨ #richkid #luxury #tongtai',
                    username: '@richkid_life',
                    like_count: 3400000,
                    comment_count: 125600,
                    share_count: 45800,
                    view_count: 12000000,
                    create_time: Date.now() / 1000 - 432000,
                    title: 'Rich kid life',
                    hashtag_names: ['richkid', 'luxury', 'tongtai'],
                    thumbnail_url: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=600&fit=crop'
                },
                {
                    id: '7234567890123456794',
                    video_description: 'Alpha male energy 💪 #alpha #tongtai #motivation',
                    username: '@alpha_male',
                    like_count: 1800000,
                    comment_count: 67200,
                    share_count: 18900,
                    view_count: 7200000,
                    create_time: Date.now() / 1000 - 518400,
                    title: 'Alpha male',
                    hashtag_names: ['alpha', 'tongtai', 'motivation'],
                    thumbnail_url: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=600&fit=crop'
                },
                {
                    id: '7234567890123456795',
                    video_description: 'Perfect fit 👔 #suit #fashion #tongtai',
                    username: '@suit_master',
                    like_count: 923100,
                    comment_count: 38700,
                    share_count: 11200,
                    view_count: 4100000,
                    create_time: Date.now() / 1000 - 604800,
                    title: 'Suit master',
                    hashtag_names: ['suit', 'fashion', 'tongtai'],
                    thumbnail_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop'
                },
                {
                    id: '7234567890123456796',
                    video_description: 'Billionaire mindset 🏆 #billionaire #goals #tongtai',
                    username: '@billionaire_goals',
                    like_count: 4200000,
                    comment_count: 156800,
                    share_count: 62300,
                    view_count: 15000000,
                    create_time: Date.now() / 1000 - 691200,
                    title: 'Billionaire goals',
                    hashtag_names: ['billionaire', 'goals', 'tongtai'],
                    thumbnail_url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=600&fit=crop'
                }
            ],
            cursor: null,
            hasMore: false,
            sample: true
        };
    }
    
    // Get video URL from ID - return sample MP4 videos for demo
    getVideoUrl(videoId, username) {
        // Map video IDs to sample MP4 videos
        const sampleVideos = {
            '7234567890123456789': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            '7234567890123456790': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            '7234567890123456791': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            '7234567890123456792': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            '7234567890123456793': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            '7234567890123456794': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
        };
        
        return sampleVideos[videoId] || `https://www.tiktok.com/${username}/video/${videoId}`;
    }
}

// Export for use in app.js
window.TikTokAPI = TikTokAPI;

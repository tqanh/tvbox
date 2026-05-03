// TVBox - TikTok Research API Integration
// Full-screen vertical video with up/down navigation

class TVBoxApp {
    constructor() {
        this.videos = [];
        this.currentVideoIndex = 0;
        this.isLoading = false;
        this.api = new TikTokAPI();
        this.searchKeyword = 'tổng tài';
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadVideos();
    }
    
    cacheElements() {
        this.videoContainer = document.getElementById('videoContainer');
        this.videoFeed = document.getElementById('videoFeed');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.searchInput = document.getElementById('searchInput');
    }
    
    bindEvents() {
        // Keyboard navigation for TV
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        
        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchKeyword = this.searchInput.value || 'tổng tài';
                    this.loadVideos();
                }
            });
        }
    }
    
    handleKeyNavigation(e) {
        switch(e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                this.prevVideo();
                break;
                
            case 'ArrowDown':
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                this.nextVideo();
                break;
                
            case 'Enter':
                e.preventDefault();
                this.togglePlayPause();
                break;
                
            case 'Escape':
            case 'Backspace':
                e.preventDefault();
                this.toggleMute();
                break;
                
            case 'm':
            case 'M':
                e.preventDefault();
                this.toggleMute();
                break;
        }
    }
    
    async loadVideos() {
        this.showLoading();
        
        try {
            const result = await this.api.searchVideos(this.searchKeyword);
            this.videos = result.videos.map(v => ({
                id: v.id,
                author: v.username,
                desc: v.video_description || v.title,
                thumbnail: v.thumbnail_url || `https://picsum.photos/400/600?random=${v.id}`,
                likes: this.formatNumber(v.like_count),
                comments: this.formatNumber(v.comment_count),
                shares: this.formatNumber(v.share_count),
                views: this.formatNumber(v.view_count),
                hashtags: v.hashtag_names || [],
                createTime: new Date(v.create_time * 1000).toLocaleDateString('vi-VN'),
                videoUrl: this.api.getVideoUrl(v.id, v.username)
            }));
            
            if (result.sample) {
                console.log('Using sample data - Add TikTok API key for real videos');
            }
            
            this.renderVideoFeed();
        } catch (error) {
            console.error('Load videos error:', error);
            // Fallback to sample data
            this.videos = this.getFallbackVideos();
            this.renderVideoFeed();
        }
        
        this.hideLoading();
        
        // Start playing first video
        setTimeout(() => this.playCurrentVideo(), 500);
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    getFallbackVideos() {
        // Fallback sample videos
        return [
            {
                id: '1',
                author: '@tongtai_luxury',
                desc: 'Tổng tài trong bộ vest đen 🖤 #tongtai #ceo #fyp',
                thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
                likes: '1.2M',
                comments: '45.2K',
                shares: '12.1K',
                views: '5.8M',
                hashtags: ['tongtai', 'ceo', 'fyp'],
                createTime: '2 ngày trước',
                videoUrl: 'https://www.tiktok.com/@tongtai_luxury/video/7234567890123456789'
            },
            {
                id: '2',
                author: '@ceo_official',
                desc: 'A day in my life as CEO 💼 #ceo #morningroutine #tongtai',
                thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop',
                likes: '856.4K',
                comments: '32.1K',
                shares: '8.5K',
                views: '3.2M',
                hashtags: ['ceo', 'morningroutine', 'tongtai'],
                createTime: '3 ngày trước',
                videoUrl: 'https://www.tiktok.com/@ceo_official/video/7234567890123456790'
            }
        ];
    }
    
    renderVideoFeed() {
        this.videoFeed.innerHTML = this.videos.map((video, index) => `
            <div class="video-item ${index === 0 ? 'active' : ''}" data-index="${index}" data-url="${video.videoUrl}">
                <div class="video-frame" id="video-${index}">
                    <img src="${video.thumbnail}" class="video-thumbnail-img" alt="${video.desc}" loading="lazy">
                    <div class="play-button-overlay" onclick="app.loadVideoPlayer(${index})">
                        <div class="play-icon">▶</div>
                    </div>
                </div>
                
                <div class="video-overlay">
                    <div class="video-info">
                        <div class="author-row">
                            <img src="${video.thumbnail}" class="author-avatar" alt="${video.author}">
                            <span class="author-name">${video.author}</span>
                            <span class="post-time">${video.createTime}</span>
                        </div>
                        <p class="video-desc">${this.formatDesc(video.desc)}</p>
                        <div class="music-row">
                            <span class="music-icon">♪</span>
                            <span class="music-name">Nhạc nền - ${video.hashtags[0] || 'TikTok'}</span>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <div class="action-btn" onclick="app.likeVideo(${index})">
                            <div class="action-icon">♥</div>
                            <span>${video.likes}</span>
                        </div>
                        <div class="action-btn">
                            <div class="action-icon">💬</div>
                            <span>${video.comments}</span>
                        </div>
                        <div class="action-btn" onclick="app.shareVideo(${index})">
                            <div class="action-icon">↗</div>
                            <span>${video.shares}</span>
                        </div>
                        <div class="action-btn record-disc">💿</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    formatDesc(desc) {
        return desc.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
    }
    
    async loadVideoPlayer(index) {
        const video = this.videos[index];
        if (!video) return;
        
        const frame = document.getElementById(`video-${index}`);
        
        // Try to get oEmbed
        try {
            const embedData = await this.api.getVideoEmbed(video.videoUrl);
            if (embedData && embedData.html) {
                frame.innerHTML = embedData.html;
            } else {
                // Fallback: open in new tab
                window.open(video.videoUrl, '_blank');
            }
        } catch (error) {
            console.error('oEmbed error:', error);
            window.open(video.videoUrl, '_blank');
        }
    }
    
    likeVideo(index) {
        const btn = document.querySelectorAll('.action-btn')[index * 4];
        btn.style.transform = 'scale(1.2)';
        btn.querySelector('.action-icon').style.color = '#ff0050';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 200);
    }
    
    shareVideo(index) {
        const video = this.videos[index];
        if (navigator.share) {
            navigator.share({
                title: video.desc,
                url: video.videoUrl
            });
        } else {
            navigator.clipboard.writeText(video.videoUrl);
            alert('Đã copy link!');
        }
    }
    
    showLoading() {
        this.isLoading = true;
        this.loadingIndicator.style.display = 'flex';
    }
    
    hideLoading() {
        this.isLoading = false;
        this.loadingIndicator.style.display = 'none';
    }
    
    nextVideo() {
        if (this.isLoading || this.currentVideoIndex >= this.videos.length - 1) {
            this.currentVideoIndex = -1;
        }
        
        this.currentVideoIndex++;
        this.updateActiveVideo();
    }
    
    prevVideo() {
        if (this.isLoading || this.currentVideoIndex <= 0) {
            this.currentVideoIndex = this.videos.length;
        }
        
        this.currentVideoIndex--;
        this.updateActiveVideo();
    }
    
    updateActiveVideo() {
        const items = this.videoFeed.querySelectorAll('.video-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentVideoIndex);
        });
        
        const activeItem = items[this.currentVideoIndex];
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    playCurrentVideo() {
        // Auto load player for current video
        setTimeout(() => {
            this.loadVideoPlayer(this.currentVideoIndex);
        }, 1000);
    }
    
    togglePlayPause() {
        // Handled by video player
    }
    
    toggleMute() {
        // Handled by video player
        const indicator = document.getElementById('muteIndicator');
        indicator.textContent = indicator.textContent === '🔊' ? '🔇' : '🔊';
        indicator.classList.add('show');
        setTimeout(() => indicator.classList.remove('show'), 1000);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TVBoxApp();
});

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW failed', err));
    });
}

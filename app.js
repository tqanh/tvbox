// TVBox - TikTok Research API Integration
// Full-screen vertical video with up/down navigation

class TVBoxApp {
    constructor() {
        this.videos = [];
        this.currentVideoIndex = 0;
        this.isLoading = false;
        this.isModalOpen = false;
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
        // If modal is open, close it on Escape/Backspace
        if (this.isModalOpen) {
            if (e.key === 'Escape' || e.key === 'Backspace') {
                e.preventDefault();
                this.closeVideoModal();
                return;
            }
        }
        
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
                this.loadVideoPlayer(this.currentVideoIndex);
                break;
                
            case 'Escape':
            case 'Backspace':
                e.preventDefault();
                // If on landing page, do nothing
                // If on player page, go back
                if (window.location.pathname.includes('player.html')) {
                    window.location.href = 'index.html';
                }
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
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
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
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
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
        
        // Create full-screen video player
        const modal = document.createElement('div');
        modal.id = 'videoModal';
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-btn" onclick="app.closeVideoModal()">← Quay lại</button>
                <div class="video-player-container" id="videoPlayerContainer">
                    <video id="activeVideo" autoplay muted playsinline controls>
                        <source src="${video.videoUrl}" type="video/mp4">
                        Trình duyệt không hỗ trợ video.
                    </video>
                </div>
                <div class="video-info-modal">
                    <h3>${video.author}</h3>
                    <p>${video.desc}</p>
                    <div class="stats">
                        <span>♥ ${video.likes}</span>
                        <span>💬 ${video.comments}</span>
                        <span>↗ ${video.shares}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 1000;
            display: flex;
            flex-direction: column;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .modal-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 20px;
            }
            .close-btn {
                background: #ff0050;
                color: #fff;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                margin-bottom: 20px;
                align-self: flex-start;
                z-index: 10;
            }
            .close-btn:hover {
                background: #ff1a66;
            }
            .close-btn:focus {
                outline: 2px solid #fff;
                outline-offset: 2px;
            }
            .video-player-container {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #000;
                position: relative;
            }
            .video-player-container video {
                max-width: 100%;
                max-height: 70vh;
                border-radius: 12px;
                object-fit: contain;
            }
            .video-player-container video::-webkit-media-controls {
                background: rgba(0,0,0,0.5);
            }
            .video-info-modal {
                padding: 20px 0;
                color: #fff;
            }
            .video-info-modal h3 {
                font-size: 20px;
                margin-bottom: 10px;
            }
            .video-info-modal p {
                font-size: 16px;
                opacity: 0.8;
                margin-bottom: 15px;
                line-height: 1.4;
            }
            .video-info-modal .stats {
                display: flex;
                gap: 20px;
                font-size: 14px;
                opacity: 0.7;
            }
            .video-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #fff;
                font-size: 18px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        this.isModalOpen = true;
        
        // Handle video element
        const videoEl = document.getElementById('activeVideo');
        if (videoEl) {
            // Try to unmute after autoplay
            videoEl.addEventListener('loadeddata', () => {
                videoEl.muted = false;
                videoEl.volume = 1;
            });
            
            // Handle play error (autoplay policy)
            videoEl.addEventListener('error', (e) => {
                console.log('Video error, trying with controls');
                videoEl.controls = true;
            });
        }
        
        // Focus the close button for keyboard navigation
        document.querySelector('.close-btn').focus();
    }
    
    closeVideoModal() {
        const modal = document.getElementById('videoModal');
        if (modal) {
            modal.remove();
        }
        this.isModalOpen = false;
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

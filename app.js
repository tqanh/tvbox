// TVBox - TikTok Style Video Player for TV
// Full-screen vertical video with up/down navigation

class TVBoxApp {
    constructor() {
        this.videos = [];
        this.currentVideoIndex = 0;
        this.isLoading = false;
        
        // Sample TikTok-style videos (9:16 aspect ratio samples)
        this.sampleVideos = [
            {
                id: '1',
                author: '@tongtai_luxury',
                desc: 'Tổng tài trong bộ vest đen 🖤 #tongtai #ceo #fyp',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                likes: '1.2M',
                comments: '45.2K',
                shares: '12.1K',
                music: 'Nhạc nền - Luxury Vibes'
            },
            {
                id: '2',
                author: '@ceo_official',
                desc: 'A day in my life as CEO 💼 #ceo #morningroutine #tongtai',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
                likes: '856.4K',
                comments: '32.1K',
                shares: '8.5K',
                music: 'Original sound - CEO Official'
            },
            {
                id: '3',
                author: '@badboy_style',
                desc: 'Bad boy vibes 😎 #badboy #tongtai #fashion',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
                likes: '2.1M',
                comments: '89.3K',
                shares: '25.6K',
                music: 'Bad Boy - Original Mix'
            },
            {
                id: '4',
                author: '@gentleman_vn',
                desc: 'Quý ông lịch lãm 🎩 #gentleman #style #tongtai',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
                likes: '567.8K',
                comments: '21.4K',
                shares: '6.2K',
                music: 'Classical Vibes - Gentleman'
            },
            {
                id: '5',
                author: '@richkid_life',
                desc: 'Luxury lifestyle ✨ #richkid #luxury #tongtai',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=100&h=100&fit=crop',
                likes: '3.4M',
                comments: '125.6K',
                shares: '45.8K',
                music: 'Luxury Life - Beats'
            },
            {
                id: '6',
                author: '@alpha_male',
                desc: 'Alpha male energy 💪 #alpha #tongtai #motivation',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
                avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=100&h=100&fit=crop',
                likes: '1.8M',
                comments: '67.2K',
                shares: '18.9K',
                music: 'Alpha - Motivation Beats'
            },
            {
                id: '7',
                author: '@suit_master',
                desc: 'Perfect fit 👔 #suit #fashion #tongtai',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                avatar: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop',
                likes: '923.1K',
                comments: '38.7K',
                shares: '11.2K',
                music: 'Suit Up - Fashion Beats'
            },
            {
                id: '8',
                author: '@billionaire_goals',
                desc: 'Billionaire mindset 🏆 #billionaire #goals #tongtai',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
                avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&fit=crop',
                likes: '4.2M',
                comments: '156.8K',
                shares: '62.3K',
                music: 'Success - Billionaire Beats'
            }
        ];
        
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
    }
    
    bindEvents() {
        // Keyboard navigation for TV
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        
        // Touch/scroll for mobile
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextVideo();
                } else {
                    this.prevVideo();
                }
            }
        });
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
                // Toggle mute/unmute
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
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.videos = this.sampleVideos;
        this.renderVideoFeed();
        this.hideLoading();
        
        // Start playing first video
        this.playCurrentVideo();
    }
    
    renderVideoFeed() {
        this.videoFeed.innerHTML = this.videos.map((video, index) => `
            <div class="video-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                <video 
                    class="video-player"
                    src="${video.videoUrl}"
                    loop
                    playsinline
                    preload="metadata"
                    poster="${video.avatar}"
                ></video>
                
                <div class="video-overlay">
                    <div class="video-info">
                        <div class="author-row">
                            <img src="${video.avatar}" class="author-avatar" alt="${video.author}">
                            <span class="author-name">${video.author}</span>
                            <button class="follow-btn" tabindex="-1">Follow</button>
                        </div>
                        <p class="video-desc">${this.formatDesc(video.desc)}</p>
                        <div class="music-row">
                            <span class="music-icon">♪</span>
                            <span class="music-name">${video.music}</span>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <div class="action-btn">
                            <div class="action-icon">♥</div>
                            <span>${video.likes}</span>
                        </div>
                        <div class="action-btn">
                            <div class="action-icon">💬</div>
                            <span>${video.comments}</span>
                        </div>
                        <div class="action-btn">
                            <div class="action-icon">↗</div>
                            <span>${video.shares}</span>
                        </div>
                        <div class="action-btn">
                            <div class="action-icon record-disc">💿</div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers for action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                btn.style.transform = 'scale(0.9)';
                setTimeout(() => btn.style.transform = '', 150);
            });
        });
    }
    
    formatDesc(desc) {
        return desc.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
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
            // Loop back to first video
            this.currentVideoIndex = -1;
        }
        
        this.pauseCurrentVideo();
        this.currentVideoIndex++;
        this.updateActiveVideo();
        this.playCurrentVideo();
    }
    
    prevVideo() {
        if (this.isLoading || this.currentVideoIndex <= 0) {
            // Loop to last video
            this.currentVideoIndex = this.videos.length;
        }
        
        this.pauseCurrentVideo();
        this.currentVideoIndex--;
        this.updateActiveVideo();
        this.playCurrentVideo();
    }
    
    updateActiveVideo() {
        const items = this.videoFeed.querySelectorAll('.video-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentVideoIndex);
        });
        
        // Scroll to active video
        const activeItem = items[this.currentVideoIndex];
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    playCurrentVideo() {
        const items = this.videoFeed.querySelectorAll('.video-item');
        const activeItem = items[this.currentVideoIndex];
        
        if (activeItem) {
            const video = activeItem.querySelector('video');
            if (video) {
                video.currentTime = 0;
                video.play().catch(() => {
                    // Auto-play blocked, show play button
                    console.log('Autoplay blocked');
                });
            }
        }
    }
    
    pauseCurrentVideo() {
        const items = this.videoFeed.querySelectorAll('.video-item');
        const activeItem = items[this.currentVideoIndex];
        
        if (activeItem) {
            const video = activeItem.querySelector('video');
            if (video) {
                video.pause();
            }
        }
    }
    
    togglePlayPause() {
        const items = this.videoFeed.querySelectorAll('.video-item');
        const activeItem = items[this.currentVideoIndex];
        
        if (activeItem) {
            const video = activeItem.querySelector('video');
            if (video) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        }
    }
    
    toggleMute() {
        const items = this.videoFeed.querySelectorAll('.video-item');
        items.forEach(item => {
            const video = item.querySelector('video');
            if (video) {
                video.muted = !video.muted;
            }
        });
        
        // Show mute indicator
        const indicator = document.getElementById('muteIndicator');
        const isMuted = items[0]?.querySelector('video')?.muted;
        indicator.textContent = isMuted ? '🔇' : '🔊';
        indicator.classList.add('show');
        setTimeout(() => indicator.classList.remove('show'), 1000);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.tvboxApp = new TVBoxApp();
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW failed', err));
    });
}

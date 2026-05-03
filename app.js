// TVBox - TikTok Tổng Tài App
// Optimized for TV navigation with remote control

class TVBoxApp {
    constructor() {
        this.currentCategory = 'tongtai';
        this.videos = [];
        this.focusedIndex = 0;
        this.isModalOpen = false;
        
        // Sample video data - Tổng Tài themed
        this.sampleVideos = [
            {
                id: '1',
                author: 'CEO Luxury',
                desc: 'Tổng tài điển trai trong bộ vest đen #tongtai #ceo',
                thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
                likes: '1.2M',
                views: '5.8M',
                embedUrl: 'https://www.tiktok.com/embed/v1/1'
            },
            {
                id: '2',
                author: 'Gentleman Style',
                desc: 'Quý ông lịch lãm #gentleman #tongtai',
                thumbnail: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=600&fit=crop',
                likes: '856K',
                views: '3.2M',
                embedUrl: 'https://www.tiktok.com/embed/v1/2'
            },
            {
                id: '3',
                author: 'Bad Boy Official',
                desc: 'Bad boy nhưng tốt bụng #badboy #tongtai',
                thumbnail: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=400&h=600&fit=crop',
                likes: '2.1M',
                views: '8.5M',
                embedUrl: 'https://www.tiktok.com/embed/v1/3'
            },
            {
                id: '4',
                author: 'Luxury Life',
                desc: 'Cuộc sống của CEO trẻ #luxury #ceo',
                thumbnail: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=600&fit=crop',
                likes: '1.5M',
                views: '6.1M',
                embedUrl: 'https://www.tiktok.com/embed/v1/4'
            },
            {
                id: '5',
                author: 'Fashion King',
                desc: 'Tổng tài và gu thời trang đỉnh cao #fashion #tongtai',
                thumbnail: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=600&fit=crop',
                likes: '967K',
                views: '4.3M',
                embedUrl: 'https://www.tiktok.com/embed/v1/5'
            },
            {
                id: '6',
                author: 'Elite Boss',
                desc: 'Khi tổng tài làm việc #boss #tongtai',
                thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=600&fit=crop',
                likes: '1.8M',
                views: '7.2M',
                embedUrl: 'https://www.tiktok.com/embed/v1/6'
            },
            {
                id: '7',
                author: 'Mystery Man',
                desc: 'Chàng trai bí ẩn đầy quyến rũ #mystery #tongtai',
                thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop',
                likes: '3.2M',
                views: '12M',
                embedUrl: 'https://www.tiktok.com/embed/v1/7'
            },
            {
                id: '8',
                author: 'Office King',
                desc: 'Chủ tịch giả nghèo đi làm #office #tongtai',
                thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop',
                likes: '1.1M',
                views: '4.8M',
                embedUrl: 'https://www.tiktok.com/embed/v1/8'
            },
            {
                id: '9',
                author: 'Rich Kid',
                desc: 'Thiếu gia nhà giàu #richkid #tongtai',
                thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop',
                likes: '2.5M',
                views: '9.1M',
                embedUrl: 'https://www.tiktok.com/embed/v1/9'
            },
            {
                id: '10',
                author: 'CEO Alpha',
                desc: 'Alpha male vibes #alpha #tongtai #ceo',
                thumbnail: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=600&fit=crop',
                likes: '1.9M',
                views: '7.8M',
                embedUrl: 'https://www.tiktok.com/embed/v1/10'
            },
            {
                id: '11',
                author: 'Suit Master',
                desc: 'Nghệ thuật mặc vest #suit #tongtai',
                thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop',
                likes: '780K',
                views: '3.1M',
                embedUrl: 'https://www.tiktok.com/embed/v1/11'
            },
            {
                id: '12',
                author: 'Billionaire',
                desc: 'Tỷ phú trẻ tuổi #billionaire #tongtai',
                thumbnail: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=600&fit=crop',
                likes: '4.1M',
                views: '15M',
                embedUrl: 'https://www.tiktok.com/embed/v1/12'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadVideos();
        this.setupTVNavigation();
    }
    
    cacheElements() {
        this.videoGrid = document.getElementById('videoGrid');
        this.searchInput = document.getElementById('searchInput');
        this.categoryTabs = document.querySelectorAll('.category-tab');
        this.videoModal = document.getElementById('videoModal');
        this.videoPlayer = document.getElementById('videoPlayer');
        this.closeBtn = document.getElementById('closeBtn');
    }
    
    bindEvents() {
        // Category tabs
        this.categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchCategory(tab));
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.switchCategory(tab);
            });
        });
        
        // Search
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // Modal close
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.videoModal.addEventListener('click', (e) => {
            if (e.target === this.videoModal) this.closeModal();
        });
        
        // Global keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
    }
    
    setupTVNavigation() {
        // Set initial focus
        setTimeout(() => {
            if (this.categoryTabs.length > 0) {
                this.categoryTabs[0].focus();
            }
        }, 100);
    }
    
    handleKeyNavigation(e) {
        if (this.isModalOpen) {
            if (e.key === 'Escape' || e.key === 'Backspace') {
                e.preventDefault();
                this.closeModal();
            }
            return;
        }
        
        const cards = this.videoGrid.querySelectorAll('.video-card');
        const focusableElements = [
            this.searchInput,
            ...this.categoryTabs,
            ...cards
        ].filter(el => el && !el.disabled);
        
        const currentFocus = document.activeElement;
        const currentIndex = focusableElements.indexOf(currentFocus);
        
        let nextIndex = currentIndex;
        const cols = Math.floor(this.videoGrid.clientWidth / 350) || 3;
        
        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                if (currentIndex < focusableElements.length - 1) {
                    nextIndex = currentIndex + 1;
                }
                break;
                
            case 'ArrowLeft':
                e.preventDefault();
                if (currentIndex > 0) {
                    nextIndex = currentIndex - 1;
                }
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                // Skip to next row if in video grid
                if (currentFocus.classList?.contains('video-card')) {
                    if (currentIndex + cols < focusableElements.length) {
                        nextIndex = currentIndex + cols;
                    }
                } else {
                    // Move to next focusable element
                    if (currentIndex < focusableElements.length - 1) {
                        nextIndex = currentIndex + 1;
                    }
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                // Skip to previous row if in video grid
                if (currentFocus.classList?.contains('video-card')) {
                    if (currentIndex - cols >= 0) {
                        nextIndex = currentIndex - cols;
                    } else {
                        // Move to search or tabs
                        nextIndex = Math.max(0, currentIndex - cols);
                    }
                } else {
                    if (currentIndex > 0) {
                        nextIndex = currentIndex - 1;
                    }
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                if (currentFocus.classList?.contains('video-card')) {
                    const videoId = currentFocus.dataset.id;
                    this.openVideo(videoId);
                } else if (currentFocus.classList?.contains('category-tab')) {
                    this.switchCategory(currentFocus);
                }
                break;
                
            case 'Escape':
            case 'Backspace':
                e.preventDefault();
                // Focus search input
                this.searchInput.focus();
                break;
        }
        
        if (nextIndex !== currentIndex && focusableElements[nextIndex]) {
            focusableElements[nextIndex].focus();
            focusableElements[nextIndex].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'center'
            });
        }
    }
    
    switchCategory(tab) {
        // Update UI
        this.categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update state
        this.currentCategory = tab.dataset.category;
        
        // Reload videos
        this.loadVideos();
        
        // Reset focus
        this.focusedIndex = 0;
    }
    
    async loadVideos() {
        this.videoGrid.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                Đang tải video ${this.getCategoryName()}...
            </div>
        `;
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter videos by category (in real app, this would be an API call)
        const categoryVideos = this.sampleVideos.map(v => ({
            ...v,
            desc: v.desc.replace(/#\w+/g, '') + ` #${this.currentCategory} #tongtai`
        }));
        
        this.videos = categoryVideos;
        this.renderVideos();
    }
    
    getCategoryName() {
        const names = {
            tongtai: 'Tổng Tài',
            ceo: 'CEO',
            badboy: 'Bad Boy',
            gentleman: 'Quý Ông',
            fashion: 'Thời Trang',
            luxury: 'Luxury'
        };
        return names[this.currentCategory] || 'Tổng Tài';
    }
    
    renderVideos() {
        if (this.videos.length === 0) {
            this.videoGrid.innerHTML = `
                <div class="loading">
                    Không tìm thấy video nào
                </div>
            `;
            return;
        }
        
        this.videoGrid.innerHTML = this.videos.map((video, index) => `
            <div class="video-card" 
                 data-id="${video.id}" 
                 tabindex="${index + 10}"
                 role="button"
                 aria-label="Video ${video.author}: ${video.desc}">
                <img src="${video.thumbnail}" alt="${video.desc}" class="video-thumbnail" loading="lazy">
                <div class="play-overlay"></div>
                <div class="video-info">
                    <div class="video-author">${video.author}</div>
                    <div class="video-desc">${video.desc}</div>
                    <div class="video-stats">
                        <span>♥ ${video.likes}</span>
                        <span>▶ ${video.views}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Bind click events to new cards
        const cards = this.videoGrid.querySelectorAll('.video-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                this.openVideo(card.dataset.id);
            });
        });
    }
    
    handleSearch(query) {
        if (!query.trim()) {
            this.loadVideos();
            return;
        }
        
        const searchLower = query.toLowerCase();
        const filtered = this.sampleVideos.filter(video => 
            video.author.toLowerCase().includes(searchLower) ||
            video.desc.toLowerCase().includes(searchLower)
        );
        
        this.videos = filtered;
        this.renderVideos();
    }
    
    openVideo(videoId) {
        const video = this.videos.find(v => v.id === videoId) || this.sampleVideos.find(v => v.id === videoId);
        if (!video) return;
        
        // Create TikTok embed iframe
        // Note: In production, use actual TikTok embed URL or oEmbed API
        this.videoPlayer.innerHTML = `
            <div style="width:100%; height:100%; background: linear-gradient(135deg, #1a1a2e, #16213e); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px; text-align:center;">
                <img src="${video.thumbnail}" style="width:100%; max-width:400px; border-radius:12px; margin-bottom:20px;">
                <h2 style="font-size:24px; margin-bottom:10px; color:#ff6b6b;">${video.author}</h2>
                <p style="font-size:16px; opacity:0.8; margin-bottom:20px;">${video.desc}</p>
                <div style="display:flex; gap:20px; font-size:14px; opacity:0.6;">
                    <span>♥ ${video.likes}</span>
                    <span>▶ ${video.views}</span>
                </div>
                <p style="margin-top:30px; font-size:14px; opacity:0.5;">
                    TikTok Player Demo<br>
                    <small>(Tích hợp TikTok API trong production)</small>
                </p>
            </div>
        `;
        
        this.videoModal.classList.add('active');
        this.isModalOpen = true;
        this.closeBtn.focus();
        
        // Request fullscreen on TV
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    }
    
    closeModal() {
        this.videoModal.classList.remove('active');
        this.isModalOpen = false;
        this.videoPlayer.innerHTML = '';
        
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        }
        
        // Return focus to grid
        const cards = this.videoGrid.querySelectorAll('.video-card');
        if (cards[this.focusedIndex]) {
            cards[this.focusedIndex].focus();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tvboxApp = new TVBoxApp();
});

// Register for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

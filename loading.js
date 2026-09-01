// loading.js - Handles all loading and preloading

class LoadingManager {
    constructor() {
        this.loadingScreen = null;
        this.progressBar = null;
        this.loadingText = null;
        this.loadedImages = 0;
        this.totalImages = 0;
        this.imagesToLoad = ['galaxy.png'];
    }

    init() {
        this.createLoadingScreen();
        this.preloadImages();
    }

    createLoadingScreen() {
        // Create loading screen HTML
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.id = 'loading-screen';
        this.loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0e27 0%, #141a3a 50%, #1a1f4a 100%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s ease;
        `;

        // Logo/Icon
        const logo = document.createElement('div');
        logo.innerHTML = '<i class="fa-solid fa-comments" style="font-size: 64px; color: #00a884; margin-bottom: 30px; animation: pulse 2s infinite;"></i>';
        this.loadingScreen.appendChild(logo);

        // Loading text
        this.loadingText = document.createElement('div');
        this.loadingText.textContent = 'Loading ASAP Chat...';
        this.loadingText.style.cssText = `
            color: #e8eaf0;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            font-family: 'Inter', sans-serif;
        `;
        this.loadingScreen.appendChild(this.loadingText);

        // Progress bar container
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            width: 250px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        `;

        // Progress bar
        this.progressBar = document.createElement('div');
        this.progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #00a884, #00d4a8);
            transition: width 0.3s ease;
            border-radius: 2px;
        `;
        progressContainer.appendChild(this.progressBar);
        this.loadingScreen.appendChild(progressContainer);

        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
            }
        `;
        this.loadingScreen.appendChild(style);

        document.body.appendChild(this.loadingScreen);
    }

    preloadImages() {
        this.totalImages = this.imagesToLoad.length;
        
        this.imagesToLoad.forEach((imageSrc, index) => {
            const img = new Image();
            img.src = imageSrc;
            
            img.onload = () => {
                this.loadedImages++;
                this.updateProgress();
            };
            
            img.onerror = () => {
                console.warn(`Failed to load image: ${imageSrc}`);
                this.loadedImages++;
                this.updateProgress();
            };
        });

        // Start checking if all loaded
        this.checkAllLoaded();
    }

    updateProgress() {
        const progress = (this.loadedImages / this.totalImages) * 100;
        this.progressBar.style.width = `${progress}%`;
        
        // Update text based on progress
        if (progress < 30) {
            this.loadingText.textContent = 'Loading assets...';
        } else if (progress < 70) {
            this.loadingText.textContent = 'Preparing chat...';
        } else if (progress < 100) {
            this.loadingText.textContent = 'Almost ready...';
        } else {
            this.loadingText.textContent = 'Ready!';
        }
    }

    checkAllLoaded() {
        const checkInterval = setInterval(() => {
            if (this.loadedImages >= this.totalImages) {
                clearInterval(checkInterval);
                setTimeout(() => this.hideLoadingScreen(), 500);
            }
        }, 100);
    }

    hideLoadingScreen() {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            // Dispatch custom event when loading is complete
            window.dispatchEvent(new CustomEvent('appReady'));
        }, 500);
    }

    showLoadingScreen() {
        this.loadingScreen.style.display = 'flex';
        setTimeout(() => {
            this.loadingScreen.style.opacity = '1';
        }, 10);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.loadingManager = new LoadingManager();
        window.loadingManager.init();
    });
} else {
    window.loadingManager = new LoadingManager();
    window.loadingManager.init();
}

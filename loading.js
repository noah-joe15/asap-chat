// =========================================================
// ASAP CHAT - LOADING MANAGER
// =========================================================

class LoadingManager {

    constructor() {

        this.loadingScreen = null;
        this.progressBar = null;
        this.loadingText = null;

        this.loadedImages = 0;
        this.totalImages = 0;

        this.imagesToLoad = [
            "galaxy.png"
        ];

    }


    init() {

        this.createLoadingScreen();

        this.preloadImages();

    }


    createLoadingScreen() {

        this.loadingScreen =
            document.createElement(
                "div"
            );


        this.loadingScreen.id =
            "loading-screen";


        this.loadingScreen.style.cssText = `

            position: fixed;

            inset: 0;

            width: 100%;

            height: 100dvh;

            height: -webkit-fill-available;

            background:
                linear-gradient(
                    135deg,
                    #0a0e27 0%,
                    #141a3a 50%,
                    #1a1f4a 100%
                );

            z-index: 99999;

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: center;

            transition:
                opacity 0.5s ease;

        `;


        const logo =
            document.createElement(
                "div"
            );


        logo.innerHTML = `

            <i
                class="fa-solid fa-comments"
                style="
                    font-size:64px;
                    color:#00a884;
                    margin-bottom:30px;
                    animation:pulse 2s infinite;
                "
            ></i>

        `;


        this.loadingScreen.appendChild(
            logo
        );


        this.loadingText =
            document.createElement(
                "div"
            );


        this.loadingText.textContent =
            "Loading ASAP Chat...";


        this.loadingText.style.cssText = `

            color: #e8eaf0;

            font-size: 20px;

            font-weight: 600;

            margin-bottom: 20px;

            font-family:
                Inter,
                -apple-system,
                BlinkMacSystemFont,
                sans-serif;

        `;


        this.loadingScreen.appendChild(
            this.loadingText
        );


        const progressContainer =
            document.createElement(
                "div"
            );


        progressContainer.style.cssText = `

            width: 250px;

            max-width: 70vw;

            height: 4px;

            background:
                rgba(255,255,255,0.1);

            border-radius: 10px;

            overflow: hidden;

        `;


        this.progressBar =
            document.createElement(
                "div"
            );


        this.progressBar.style.cssText = `

            width: 0%;

            height: 100%;

            background:
                linear-gradient(
                    90deg,
                    #00a884,
                    #00d4a8
                );

            transition:
                width 0.3s ease;

            border-radius: 10px;

        `;


        progressContainer.appendChild(
            this.progressBar
        );


        this.loadingScreen.appendChild(
            progressContainer
        );


        const style =
            document.createElement(
                "style"
            );


        style.textContent = `

            @keyframes pulse {

                0%,100% {
                    transform: scale(1);
                    opacity: 1;
                }

                50% {
                    transform: scale(1.1);
                    opacity: .8;
                }

            }

        `;


        this.loadingScreen.appendChild(
            style
        );


        document.body.appendChild(
            this.loadingScreen
        );

    }


    preloadImages() {

        this.totalImages =
            this.imagesToLoad.length;


        if (
            this.totalImages === 0
        ) {

            this.loadedImages = 0;

            this.updateProgress();

            this.hideLoadingScreen();

            return;

        }


        const safetyTimer =
            setTimeout(() => {

                if (
                    this.loadedImages <
                    this.totalImages
                ) {

                    this.loadedImages =
                        this.totalImages;

                    this.updateProgress();

                }

            }, 3000);


        this.imagesToLoad.forEach(
            imageSrc => {

                const img =
                    new Image();


                img.src =
                    imageSrc;


                img.onload = () => {

                    this.loadedImages++;

                    this.updateProgress();

                };


                img.onerror = () => {

                    console.warn(
                        `Failed to load ${imageSrc}`
                    );

                    this.loadedImages++;

                    this.updateProgress();

                };

            }
        );


        const checkInterval =
            setInterval(() => {

                if (
                    this.loadedImages >=
                    this.totalImages
                ) {

                    clearInterval(
                        checkInterval
                    );

                    clearTimeout(
                        safetyTimer
                    );


                    setTimeout(
                        () =>
                            this.hideLoadingScreen(),
                        300
                    );

                }

            }, 100);

    }


    updateProgress() {

        if (
            !this.progressBar ||
            !this.loadingText
        )
            return;


        const progress =
            Math.min(
                (
                    this.loadedImages /
                    this.totalImages
                ) * 100,
                100
            );


        this.progressBar.style.width =
            `${progress}%`;


        if (progress < 30) {

            this.loadingText.textContent =
                "Loading assets...";

        } else if (progress < 70) {

            this.loadingText.textContent =
                "Preparing chat...";

        } else if (progress < 100) {

            this.loadingText.textContent =
                "Almost ready...";

        } else {

            this.loadingText.textContent =
                "Ready!";

        }

    }


    hideLoadingScreen() {

        if (
            !this.loadingScreen
        )
            return;


        this.loadingScreen.style.opacity =
            "0";


        setTimeout(() => {

            if (
                this.loadingScreen
            ) {

                this.loadingScreen.style.display =
                    "none";

            }


            window.dispatchEvent(
                new CustomEvent(
                    "appReady"
                )
            );

        }, 500);

    }

}


/* =========================================================
   START
========================================================= */

function startLoading() {

    window.loadingManager =
        new LoadingManager();

    window.loadingManager.init();

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startLoading
    );

} else {

    startLoading();

}

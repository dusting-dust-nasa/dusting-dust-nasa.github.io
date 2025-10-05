        let viewer;

        document.addEventListener('DOMContentLoaded', function() {
            viewer = OpenSeadragon({
                id: 'openseadragon-viewer',
                prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@4.1.0/build/openseadragon/images/',
                tileSources: './img/biggest.dzi',
                animationTime: 1.2,
                blendTime: 0.3,
                constrainDuringPan: true,
                maxZoomPixelRatio: 3,
                minZoomLevel: 0.5,
                visibilityRatio: 1,
                zoomPerScroll: 1.6,
                showNavigator: true,
                navigatorPosition: 'BOTTOM_RIGHT',
                navigatorSizeRatio: 0.12,
                navigatorBackground: 'rgba(11, 61, 145, 0.8)',
                navigatorBorderColor: '#64ffda',
                navigatorDisplayRegionColor: 'rgba(100, 255, 218, 0.3)',
                showHomeControl: false,
                showZoomControl: false,
                showFullPageControl: false,
                showSequenceControl: false,
                gestureSettingsMouse: {
                    scrollToZoom: true,
                    clickToZoom: true,
                    dblClickToZoom: true,
                    pinchToZoom: true,
                    flickEnabled: true
                },
                gestureSettingsTouch: {
                    scrollToZoom: false,
                    clickToZoom: false,
                    dblClickToZoom: true,
                    pinchToZoom: true,
                    flickEnabled: true
                }
            });

            // Hide loading indicator when ready
            viewer.addHandler('open', function() {
                document.getElementById('loading').style.display = 'none';
                updateMissionStatus('Scan Complete');
            });

            // Error handling
            viewer.addHandler('open-failed', function() {
                document.getElementById('loading').innerHTML = 
                    '<div class="loading-orbit"></div><div class="loading-text" style="color: #FC3D21;">Mission Failed: Signal Lost</div>';
                updateMissionStatus('Connection Lost');
            });

            // Update coordinates display
            viewer.addHandler('animation', function() {
                updateCoordinates();
            });

            viewer.addHandler('zoom', function() {
                updateCoordinates();
            });

            viewer.addHandler('pan', function() {
                updateCoordinates();
            });
        });

        // Update mission status
        function updateMissionStatus(status) {
            const statusElement = document.querySelector('.mission-status');
            if (statusElement) {
                statusElement.innerHTML = `<div class="status-dot"></div>${status}`;
            }
        }

        // Update coordinates display
        function updateCoordinates() {
            if (!viewer) return;
            
            const center = viewer.viewport.getCenter();
            const zoom = viewer.viewport.getZoom();
            const coordsElement = document.getElementById('coordinates');
            
            if (coordsElement) {
                coordsElement.textContent = 
                    `COORDINATES: ${center.x.toFixed(4)}, ${center.y.toFixed(4)} • ZOOM: ${zoom.toFixed(2)}X`;
            }
        }

        // Fullscreen functionality
        function toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.querySelector('.viewer-wrapper').requestFullscreen().catch(err => {
                    console.log('Fullscreen not supported');
                });
            } else {
                document.exitFullscreen();
            }
        }

        // Keyboard shortcuts - Mission control commands
        document.addEventListener('keydown', function(e) {
            if (!viewer) return;
            
            switch(e.key.toLowerCase()) {
                case 'h':
                case 'home':
                    viewer.viewport.goHome();
                    break;
                case '=':
                case '+':
                    viewer.viewport.zoomBy(1.5);
                    break;
                case '-':
                    viewer.viewport.zoomBy(0.7);
                    break;
                case 'f':
                    if (!e.ctrlKey && e.key !== 'F11') {
                        e.preventDefault();
                        toggleFullscreen();
                    }
                    break;
                case 'r':
                    viewer.viewport.goHome();
                    break;
            }
        });

        // Initialize coordinates display
        window.addEventListener('load', function() {
            setTimeout(updateCoordinates, 1000);
        });
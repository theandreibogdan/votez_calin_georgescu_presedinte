document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const cropperDiv = document.getElementById('cropperDiv');
    const mainContainer = document.getElementById('mainContainer');
    const imageToEdit = document.getElementById('imageToEdit');
    const confirmCropBtn = document.getElementById('confirmCrop');
    const cancelCropBtn = document.getElementById('cancelCrop');
    const resultContainer = document.getElementById('resultContainer');
    const finalCanvas = document.getElementById('finalCanvas');
    const downloadBtn = document.getElementById('downloadBtn');

    let cropper = null;
    let originalImage = null;
    const overlayImage = new Image();
    overlayImage.src = 'overlay.png';

    uploadBtn.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                // Store original image for high-res processing
                originalImage = new Image();
                originalImage.src = e.target.result;
                
                // Show cropper
                cropperDiv.classList.remove('hidden');
                mainContainer.classList.add('hidden');
                
                // Set image source
                imageToEdit.src = e.target.result;

                // Initialize cropper
                if (cropper) {
                    cropper.destroy();
                }
                
                cropper = new Cropper(imageToEdit, {
                    aspectRatio: 1,
                    viewMode: 1,
                    responsive: true,
                    background: false,
                    ready: function() {
                        // Get image data
                        const imageData = cropper.getImageData();
                        const minDimension = Math.min(imageData.width, imageData.height);
                        
                        // Calculate crop box size based on image orientation
                        let cropBoxWidth, cropBoxHeight;
                        if (imageData.height > imageData.width) {
                            // Portrait orientation
                            cropBoxWidth = imageData.width;
                            cropBoxHeight = imageData.width;
                        } else {
                            // Landscape or square orientation
                            cropBoxWidth = imageData.height;
                            cropBoxHeight = imageData.height;
                        }
                        
                        // Calculate the initial crop box position to center it
                        const left = (imageData.width - cropBoxWidth) / 2;
                        const top = (imageData.height - cropBoxHeight) / 2;
                        
                        // Set the crop box to the calculated dimensions
                        cropper.setCropBoxData({
                            left: left,
                            top: top,
                            width: cropBoxWidth,
                            height: cropBoxHeight
                        });
                    }
                });
            };

            reader.readAsDataURL(file);
        }
    });

    cancelCropBtn.addEventListener('click', () => {
        cropperDiv.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    });

    confirmCropBtn.addEventListener('click', () => {
        if (!cropper) return;

        const outputSize = 1080;
        finalCanvas.width = outputSize;
        finalCanvas.height = outputSize;
        
        const ctx = finalCanvas.getContext('2d');
        
        // Get the cropped canvas directly from cropper.js
        const croppedCanvas = cropper.getCroppedCanvas({
            width: outputSize,
            height: outputSize
        });
        
        // Draw the cropped image
        ctx.drawImage(croppedCanvas, 0, 0, outputSize, outputSize);
        
        // Draw overlay
        ctx.drawImage(overlayImage, 0, 0, outputSize, outputSize);

        // Show result
        cropperDiv.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        resultContainer.classList.remove('hidden');
        document.getElementById('initialContent').classList.add('hidden');
    });

    downloadBtn.addEventListener('click', async () => {
        const button = document.getElementById('downloadBtn');
        const buttonText = button.innerHTML;
        
        try {
            // Show loading state
            button.classList.add('button-disabled');
            button.innerHTML = `<i class="fas fa-spinner spinner mr-2"></i>Se descarca...`;
            
            // Get the canvas data
            const dataUrl = finalCanvas.toDataURL('image/png');
            
            // For iOS devices
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                // Create a temporary link
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'votez-calin-georgescu.png';
                
                // Try multiple approaches for iOS
                if (navigator.share) {
                    // If Web Share API is available, use it
                    const blob = await (await fetch(dataUrl)).blob();
                    const file = new File([blob], 'votez-calin-georgescu.png', { type: 'image/png' });
                    
                    try {
                        await navigator.share({
                            files: [file],
                            title: 'Descarca Imaginea'
                        });
                    } catch (shareError) {
                        // Fallback to opening in new tab if sharing fails
                        window.open(dataUrl, '_blank');
                    }
                } else {
                    // Fallback to opening in new tab
                    window.open(dataUrl, '_blank');
                }
            } else {
                // For other devices, use the download link method
                const link = document.createElement('a');
                link.download = 'votez-calin-georgescu.png';
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            // Show success message
            button.innerHTML = `<i class="fas fa-check mr-2"></i>Descarcat cu succes!`;
            setTimeout(() => {
                button.innerHTML = buttonText;
                button.classList.remove('button-disabled');
            }, 2000);
            
        } catch (error) {
            console.error('Download failed:', error);
            // Show error message
            button.innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i>Eroare la descarcare`;
            setTimeout(() => {
                button.innerHTML = buttonText;
                button.classList.remove('button-disabled');
            }, 2000);
        }
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        document.getElementById('initialContent').classList.remove('hidden');
        resultContainer.classList.add('hidden');
        imageInput.value = ''; // Reset file input
    });

    // Function to create multiple confetti bursts
    function celebrateSuccess() {
        // First burst from the middle
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Left side burst
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
        }, 250);

        // Right side burst
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 400);
    }
}); 
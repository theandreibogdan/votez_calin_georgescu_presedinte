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
                    background: false
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

        // Get crop data and canvas data
        const cropData = cropper.getData();
        const canvasData = cropper.getCanvasData();
        
        // Calculate the ratio between original image and cropper canvas
        const scaleX = originalImage.naturalWidth / canvasData.width;
        const scaleY = originalImage.naturalHeight / canvasData.height;
        
        // Use consistent size for output (e.g., 1080px for social media)
        const outputSize = 1080;
        finalCanvas.width = outputSize;
        finalCanvas.height = outputSize;
        
        const ctx = finalCanvas.getContext('2d');
        
        // Clear the canvas
        ctx.clearRect(0, 0, outputSize, outputSize);
        
        // Draw cropped image maintaining aspect ratio
        ctx.drawImage(
            originalImage,
            cropData.x * scaleX,
            cropData.y * scaleY,
            cropData.width * scaleX,
            cropData.height * scaleY,
            0,
            0,
            outputSize,
            outputSize
        );

        // Draw overlay at the same size
        ctx.drawImage(overlayImage, 0, 0, outputSize, outputSize);

        // Show result
        cropperDiv.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        resultContainer.classList.remove('hidden');
        document.getElementById('initialContent').classList.add('hidden');

        // Add confetti effect
        celebrateSuccess();
    });

    downloadBtn.addEventListener('click', () => {
        // Create a temporary link
        const link = document.createElement('a');
        link.download = 'processed-image.png';
        link.href = finalCanvas.toDataURL('image/png');
        link.click();
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
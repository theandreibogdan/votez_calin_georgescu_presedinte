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

        // Get crop data
        const cropData = cropper.getData();
        const ratio = originalImage.naturalWidth / cropper.getImageData().naturalWidth;

        // Create high-res canvas
        const size = Math.max(cropData.width, cropData.height) * ratio;
        finalCanvas.width = size;
        finalCanvas.height = size;
        const ctx = finalCanvas.getContext('2d');

        // Draw cropped image at high resolution
        ctx.drawImage(
            originalImage,
            cropData.x * ratio,
            cropData.y * ratio,
            cropData.width * ratio,
            cropData.height * ratio,
            0,
            0,
            size,
            size
        );

        // Draw overlay with full opacity
        ctx.drawImage(overlayImage, 0, 0, size, size);

        // Show result
        cropperDiv.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        resultContainer.classList.remove('hidden');
    });

    downloadBtn.addEventListener('click', () => {
        // Create a temporary link
        const link = document.createElement('a');
        link.download = 'processed-image.png';
        link.href = finalCanvas.toDataURL('image/png');
        link.click();
    });
}); 
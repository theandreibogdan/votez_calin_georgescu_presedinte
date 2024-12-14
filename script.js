document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const cropperContainer = document.getElementById('cropperContainer');
    const imageToEdit = document.getElementById('imageToEdit');
    const confirmCropBtn = document.getElementById('confirmCrop');
    const resultContainer = document.getElementById('resultContainer');
    const finalCanvas = document.getElementById('finalCanvas');

    let cropper = null;
    const flagImage = new Image();
    flagImage.src = 'flag.jpg'; // Make sure to have flag.jpg in the same directory

    uploadBtn.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                // Show cropper container
                cropperContainer.classList.remove('hidden');
                resultContainer.classList.add('hidden');
                
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

    confirmCropBtn.addEventListener('click', () => {
        if (!cropper) return;

        // Get cropped canvas
        const croppedCanvas = cropper.getCroppedCanvas({
            width: 500,  // Fixed size for consistency
            height: 500
        });

        // Create final canvas
        finalCanvas.width = 500;
        finalCanvas.height = 500;
        const ctx = finalCanvas.getContext('2d');

        // Draw cropped image
        ctx.drawImage(croppedCanvas, 0, 0);

        // Draw flag with 50% opacity
        ctx.globalAlpha = 0.5;
        ctx.drawImage(flagImage, 0, 0, 500, 500);
        ctx.globalAlpha = 1.0;

        // Show result
        cropperContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
    });
}); 
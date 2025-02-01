<script lang="ts">
import { Button } from '$lib/components/common';

const handleDocumentUpload = () => {
  // TODO: Implement document upload
  console.log('Document upload clicked');
};

const handleImageUpload = () => {
  // TODO: Implement image upload
  console.log('Image upload clicked');
};
</script>

<div class="upload-section">
  <Button 
    variant="secondary"
    ariaLabel="Upload documents"
    tabindex={0}
    ariaDescribedby="upload-docs-desc"
    ariaExpanded={false}
    ariaHaspopup={false}
    ariaControls=""
    onClick={handleDocumentUpload}
  >
    Upload Documents
  </Button>

  <Button 
    variant="secondary"
    ariaLabel="Upload images"
    tabindex={0}
    ariaDescribedby="upload-images-desc"
    ariaExpanded={false}
    ariaHaspopup={false}
    ariaControls=""
    onClick={handleImageUpload}
  >
    Upload Images
  </Button>
</div>

<style>
.upload-section {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}
</style> 
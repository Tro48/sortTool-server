<script setup lang="ts">
</script>
<template>
    <h3 class="section-header"><slot></slot></h3>
</template>
<style scoped>
.section-header {
    padding: 5px;
    border-radius: 5px;
    background-color: var(--bg-color-section);
    font-size: 1rem;
    font-weight: 400;
    text-transform: uppercase;
}
</style>

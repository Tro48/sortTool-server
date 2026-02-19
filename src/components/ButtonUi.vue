<script lang="ts">
</script>
<template>
    <button class="button"><slot></slot></button>
</template>
<style scoped>
 .button {
    padding: 5px 10px;
    background-color: transparent;
    border-radius: 10px;
    cursor: pointer;
    color: var(--text-color);
    transition: 0.3s;
 }

 .button:hover {
    opacity: .9;
    transition: 0.3s;
 }

 .button:active{
    scale: .98;
}
</style>

<script lang="ts">
</script>
<template>
    <button class="button"><slot></slot></button>
</template>
<style scoped>
 .button {
    padding: 5px 10px;
    background-color: rgb(113, 113, 113);
    border-radius: 10px;
    cursor: pointer;
    color: var(--bg-color);
    box-shadow: 0 0 15px 5px rgba(60, 60, 60, 0.3) inset;
    transition: 0.3s;
 }

 .button:hover {
    background-color: rgb(122, 122, 122);
    transition: 0.3s;
 }

 .button:active{
    scale: .98;
}
</style>

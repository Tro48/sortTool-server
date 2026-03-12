<script setup lang="ts"></script>
<template>
	<h3 class="section-header"><slot></slot></h3>
</template>
<style scoped>
.section-header {
	padding: var(--padding-page);
	border-radius: var(--br-page);
	background-color: var(--bg-color-section);
	font-size: var(--font-size-big);
	font-weight: var(--font-weight-normal);
	text-transform: uppercase;
}
</style>

<script setup lang="ts">
import { io } from 'socket.io-client';
import { nextTick, onMounted, ref, watch } from 'vue';
import mockLogs from '../mockLogs.json';
import LogItem from './LogItem.vue';
const baseUrl = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_PORT}/`;

const logsList = ref<HTMLUListElement | null>(null);

const socket = io(baseUrl, { autoConnect: true });

async function scrollToBottom() {
	await nextTick();
	if (logsList.value) {
		logsList.value.scrollTop = logsList.value.scrollHeight;
	}
}

onMounted(() => {
	scrollToBottom();
	socket.on('connect', () => {
		console.log(`[Бэкенд]: Подключено`);
		// Отобразить на странице
	});
  socket.on('log', (data) => {
    console.log(`[Бэкенд]: ${data.time} - ${data.message}`);
    // отображение на странице: нужно пушить в массив логов или обновлять стейт
  })
});

watch(
	() => mockLogs.length,
	() => {
		scrollToBottom();
	},
);
</script>
<template>
	<section class="section">
		<h4 class="section-header">
			<span class="log-name">Имя</span>
			<span class="log-state">Состояние</span>
			<span class="log-message">Сообщение</span>
		</h4>
		<ul class="logs-list" ref="logsList">
			<LogItem
				v-for="value in mockLogs"
				:key="value.name"
				:name="value.name"
				:state="value.state"
				:message="value.message"
			/>
		</ul>
	</section>
</template>
<style scoped>
.section-header {
	display: flex;
	gap: 5px;
	inline-size: 100%;
	padding: 5px;
	background-color: var(--bg-color-section);
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	font-size: 14px;
}

.section-header > span:not(:last-child) {
	border-right: 1px solid var(--bg-color);
}

.log-name {
	inline-size: 25%;
}
.log-state {
	inline-size: 15%;
}
.log-message {
	inline-size: 60%;
}

.section {
	display: flex;
	flex-direction: column;
	justify-content: start;
	align-items: center;
	gap: 5px;
	inline-size: 100%;
	block-size: 100%;
}

.logs-list {
	display: flex;
	flex-direction: column;
	gap: 5px;
	inline-size: 100%;
	block-size: 100%;
	padding: 5px;
	background-color: var(--bg-color-section);
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	overflow-y: auto;
	scroll-behavior: smooth;
	font-size: 14px;
	scrollbar-width: thin;
}
</style>

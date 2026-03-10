<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useLogs } from '../stores/useLogsStore';
import { useSocket } from '../stores/useSettingsStore';
import LogItem from './LogItem.vue';

const logsListRef = ref<HTMLUListElement | null>(null);

const logs = useLogs();
const socket = useSocket();
const { logsList } = storeToRefs(logs);

async function scrollToBottom() {
	await nextTick();
	if (logsListRef.value) {
		logsListRef.value.scrollTop = logsListRef.value.scrollHeight;
	}
}

onMounted(() => {
	logs.fetchGetAllLogs();
	socket.onLog(logs.setLogItem);
	scrollToBottom();
});

watch(
	() => logsListRef,
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
		<div class="logs-list-container">
			<ul v-if="logsList.size > 0" class="logs-list" ref="logsListRef">
				<LogItem
					v-for="[key, value] in logsList"
					:key="key"
					:name="value.fileName"
					:state="value.state"
					:message="value.message"
				/>
			</ul>
			<div v-else class="empty-message"><p>Логи отсутствуют</p></div>
		</div>
	</section>
</template>
<style scoped>
.section-header {
	display: grid;
	grid-template-columns: 25% 15% 60%;
	gap: 5px;
	inline-size: 100%;
	padding: 10px;
	background-color: var(--bg-color-section);
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	font-size: 14px;
	text-transform: uppercase;
}

.empty-message {
	display: flex;
	justify-content: center;
	align-items: center;
	inline-size: 100%;
	block-size: 100%;
	font-size: 18px;
	font-weight: 600;
	text-transform: uppercase;
	color: var(--text-color-secondary);
}

.log-name {
	border-right: 1px solid var(--bg-color);
}

.log-state {
	justify-self: center;
	border: none;
}
.log-message {
	padding-left: 5px;
	border-left: 1px solid var(--bg-color);
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

.logs-list-container {
	inline-size: 100%;
	block-size: 100%;
	padding: 5px;
	border-radius: 5px;
	background-color: var(--bg-color-section);
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	overflow-y: hidden;
}

.logs-list {
	display: flex;
	flex-direction: column;
	gap: 5px;
	inline-size: 100%;
	block-size: 100%;
	padding: 5px;
	border-radius: 5px;
	overflow-y: auto;
	scroll-behavior: smooth;
	font-size: 14px;
	scrollbar-width: thin;
}
</style>

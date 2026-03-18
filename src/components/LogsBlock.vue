<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useLogs } from '../stores/useLogsStore';
import { useSocket } from '../stores/useSettingsStore';
import LogItem from './LogItem.vue';
import Skeleton from './Skeleton.vue';

const logs = useLogs();
const socket = useSocket();
const { getLogsList, isLoading } = storeToRefs(logs);

onMounted(() => {
	logs.fetchGetAllLogs();
	socket.onLog(logs.setLogItem);
});
</script>
<template>
	<section class="section">
		<h4 class="section-header">
			<span class="log-name">Имя</span>
			<span class="log-state">Состояние</span>
			<span class="log-message">Сообщение</span>
		</h4>
		<div class="logs-list-container">
			<ul v-if="isLoading" class="logs-list">
				<Skeleton v-for="n in 21" :key="'skeleton-' + n" />
			</ul>
			<ul v-else-if="getLogsList.length > 0" class="logs-list">
				<LogItem
					v-for="item in getLogsList"
					:key="item.fileName"
					:name="item.fileName"
					:state="item.state"
					:message="item.message"
				/>
			</ul>
			<div v-else class="empty-message"><p>Логи отсутствуют</p></div>
		</div>
	</section>
</template>
<style scoped>
.section-header {
	display: grid;
	grid-template-columns: var(--columns-logs);
	gap: var(--gap-page);
	inline-size: var(--inline-size-full);
	padding: calc(var(--padding-page) * 2);
	background-color: var(--bg-color-section);
	box-shadow: var(--shadow);
	border-radius: var(--br-page);
	font-size: var(--font-size-normal);
	text-transform: uppercase;
}

.empty-message {
	display: flex;
	justify-content: center;
	align-items: center;
	inline-size: var(--inline-size-full);
	block-size: 100%;
	font-size: var(--font-size-big);
	font-weight: var(--font-weight-bold);
	text-transform: uppercase;
	color: var(--text-color-secondary);
}

.log-name {
	border-right: 1px solid var(--bg-color);
	overflow: hidden;
}

.log-state {
	max-inline-size: fit-content;
	justify-self: center;
	border: none;
	overflow: hidden;
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
	gap: var(--gap-page);
	inline-size: var(--inline-size-full);
	block-size: 100%;
}

.logs-list-container {
	inline-size: var(--inline-size-full);
	block-size: 100%;
	padding: var(--padding-page);
	border-radius: var(--br-page);
	background-color: var(--bg-color-section);
	box-shadow: var(--shadow);
	overflow-y: hidden;
}

.logs-list {
	display: flex;
	flex-direction: column;
	gap: var(--gap-page);
	inline-size: var(--inline-size-full);
	block-size: 100%;
	padding: var(--padding-page);
	border-radius: var(--br-page);
	overflow-y: auto;
	scroll-behavior: smooth;
	font-size: var(--font-size-normal);
	scrollbar-width: thin;
}
</style>

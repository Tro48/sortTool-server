<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import AddSettingsDir from './components/AddSettingsDir.vue';
import LogsBlock from './components/LogsBlock.vue';
import SettingsBlock from './components/SettingsBlock.vue';
import TabsPanel from './components/TabsPanel.vue';
import { useSettings, useSocket } from './stores/useSettingsStore';

const settings = useSettings();
const socket = useSocket()
const { isSettingsDirState } = storeToRefs(settings);
const { scriptState } = storeToRefs(socket);

onMounted(() => {
	settings.fetchSettingsDirState();
	socket.onScriptListenerState();
});
</script>

<template>
	<template v-if="!isSettingsDirState"> <AddSettingsDir /></template>
	<template v-else>
		<header class="header">
			<div class="header-content">
				<svg
					class="site-logo"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 150 150"
					fill="none"
				>
					<mask id="myMask">
						<rect width="100%" height="100%" fill="white" />
						<path
							fill="black"
							d="m29.481 99.083 9.413-11.154h3.078l-8.884 11.154h19.88s1.79.205 2.902 0c1.63-.3 2.53-.807 3.783-1.845 1.344-1.115 2.104-1.962 2.55-3.606.75-2.758-.527-4.78-2.55-6.877-9.575-9.921-23.12-7.91-31.403-17.19 0 0-2.547-3.536-3.343-6.122-1.586-5.154-.817-8.81 1.584-13.67 1.353-2.737 2.472-4.18 4.75-6.289 2.29-2.12 3.829-3.185 6.773-4.36 2.536-1.013 6.86-1.51 6.86-1.51H78.83l-5.806 7.715-11.611 14.088h-2.639l6.597-8.05H49.01s-5.709-.301-7.83 1.929c-2.082 2.19-2.82 4.877-1.319 7.463.801 1.38 3.167 2.684 3.167 2.684l5.981 3.354 13.195 5.702 6.333 3.606c1.192.857 4.58 3.661 6.333 6.793 1.033 1.846 1.54 2.973 1.935 5.031.421 2.19.267 3.49 0 5.703-.225 1.863-.48 2.902-1.055 4.696-1.254 4.262-3.45 7.319-7.213 9.811 0 0-3.183 2.322-5.542 3.187-2.635.967-7.125 1.174-7.125 1.174H18.75zM102.823 100.88v11.491H90.35z"
						/>
						<path
							fill="black"
							d="M80.387 37.5h50.863l-10.792 13.772h-17.603v48.203l-14.507 12.911V51.272H69.684z"
						/>
					</mask>

					<circle cx="75" cy="75" r="74.5" fill="#0096d6" mask="url(#myMask)" />
				</svg>
				<div class="header-content-text">
					<h1>SortTool Settings</h1>
					<p>Автоматическая отправка файлов</p>
				</div>
			</div>
			<p v-if="scriptState">{{ scriptState }}</p>
		</header>
		<main class="main">
			<TabsPanel :names="['Логи', 'Настройки']" :panels="[LogsBlock, SettingsBlock]" />
		</main>
	</template>
</template>

<style scoped>
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	inline-size: 100%;
	background-color: transparent;
	border-radius: 5px;
	color: var(--text-color);
	padding: 5px;
}

.header-content {
	display: flex;
	align-items: center;
	gap: 10px;
}

.header-content-text {
	display: flex;
	flex-direction: column;
}

.site-logo {
	width: 35px;
	height: 35px;
}
.header-content-text > h1 {
	font-size: 18px;
	font-weight: 400;
}

.header-content-text > p {
	font-size: 12px;
	font-weight: 400;
}
.main {
	inline-size: 100%;
	min-block-size: 85vh;
	max-block-size: 90vh;
	padding: 0 5px;
	color: var(--text-color);
}
</style>

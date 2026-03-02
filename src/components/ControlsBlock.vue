<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettings } from '../stores/useSettingsStore';
import ButtonUi from './ButtonUi.vue';

const settings = useSettings();

const { isStartScript } = storeToRefs(settings);
</script>
<template>
	<div class="controls-block">
		<ButtonUi
			type="button"
			@click="settings.fetchStopScript"
			tooltip="Остановить скрипт"
			v-if="isStartScript"
			><v-icon>mdi-stop-circle-outline</v-icon></ButtonUi
		>
		<ButtonUi type="button" @click="settings.fetchPlayScript" tooltip="Запустить скрипт" v-else
			><v-icon>mdi-play-circle-outline</v-icon></ButtonUi
		>
	</div>
</template>
<style scoped>
.controls-block {
	display: flex;
	justify-content: end;
	gap: 5px;
	padding: 5px;
}
</style>

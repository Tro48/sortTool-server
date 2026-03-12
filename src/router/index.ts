import { useSettings } from '@/stores/useSettingsStore';
import { storeToRefs } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
	{ path: '/', name: 'Home', component: () => import('../components/Main.vue') },
	{
		path: '/setupSettings',
		name: 'SetupSettings',
		component: () => import('../components/AddSettingsDir.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(async (to, from, next) => {
	try {
		const settings = useSettings();
		const { isSettingsDirState } = storeToRefs(settings);
		await settings.fetchSettingsDirState();

		if (!isSettingsDirState.value && to.name !== 'SetupSettings') {
			next({ name: 'SetupSettings' });
		} else if (isSettingsDirState.value && to.name === 'SetupSettings') {
			next({ name: 'Home' });
		} else {
			next();
		}
	} catch (error) {
		next();
	}
});

export default router;

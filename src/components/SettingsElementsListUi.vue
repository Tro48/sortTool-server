<script setup lang="ts">
import { computed } from 'vue';
import Skeleton from './Skeleton.vue';

const props = defineProps<{
	data: { id: string; value: string }[];
	loader?: boolean;
	skeletonCount?: number;
	delFunc: (id: string) => Promise<void>;
}>();

const count = computed(() => props.skeletonCount ?? 3);
</script>

<template>
	<ul class="data-list">
		<template v-if="props.loader">
			<Skeleton width="30px" height="30px" v-for="n in count" :key="'skeleton-' + n" />
		</template>

		<template v-else>
			<li
				v-for="item in props.data"
				:key="item.id"
				@dblclick="props.delFunc(item.id)"
				class="data-item"
			>
				{{ item.value }}
			</li>
		</template>
	</ul>
</template>

<style scoped>
.data-list {
	display: flex;
	gap: 5px;
  max-inline-size: 400px;
}

.data-item {
  display: flex;
  align-items: center;
  justify-content: center;
	inline-size: 30px;
	block-size: 30px;
	font-size: 12px;
  font-weight: 400;
	background-color: var(--bg-color);
	border-radius: 5px;
	cursor: pointer;
  user-select: none;
	transition: background-color 0.3s;
}

.data-item:hover {
	background-color: var(--hover-page);
	transition: background-color 0.3s;
}
</style>

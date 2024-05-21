<template>
  <Select
    class="w-35"
    v-bind="$attrs"
    :options="operTypeOptions"
    v-model:value="innerValue"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
  import { Select } from 'ant-design-vue';
  import { Opentype } from './typing';
  import { ref } from 'vue';

  defineOptions({ name: 'OpenSelector' });

  const operTypeOptions = [
    { label: '抽屉打开窗口', value: 'drawer' },
    { label: '模态框打开窗口', value: 'modal' },
  ];

  const props = defineProps({
    value: {
      type: String as PropType<Opentype>,
      default: 'modal',
    },
  });

  const emit = defineEmits(['update:value']);

  const innerValue = ref<string>(props.value || 'modal');
  function handleChange(value: string) {
    emit('update:value', value);
    innerValue.value = value;
  }
</script>

<style scoped></style>

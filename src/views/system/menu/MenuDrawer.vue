<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';

  import { getMenuList, addMenu, updateMenu } from '@/api/sys/menu';
  import { SysMenuSaveParam } from '#/sys/menu';

  defineOptions({ name: 'MenuDrawer' });

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);

  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    await resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      await setFieldsValue({
        ...data.record,
      });
    }
    const treeData = await getMenuList();
    await updateSchema([
      {
        field: 'parentId',
        componentProps: {
          treeData,
          fieldNames: {
            label: 'label',
            key: 'id',
            value: 'id',
          },
        },
        dynamicDisabled: () => {
          return isUpdate.value;
        },
      },
      {
        field: 'type',
        dynamicDisabled: () => {
          return isUpdate.value;
        },
        componentProps: {
          onChange: (value: string) => {
            if (value === 'RESOURCE') {
              setFieldsValue({
                icon: '',
                frameSrc: '',
                href: '',
                path: '',
                // 打开方式重置为组件打开
                openType: '1',
                component: '',
              });
            }
          },
        },
      },
      {
        field: 'openType',
        dynamicDisabled: ({ values }) => {
          return values.type === 'RESOURCE' || isUpdate.value;
        },
      },
      {
        field: 'icon',
        dynamicReadonly: ({ values }) => {
          return values.type === 'RESOURCE';
        },
      },
    ]);
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

  async function handleSubmit() {
    try {
      const values: SysMenuSaveParam = await validate();
      setDrawerProps({ confirmLoading: true });

      isUpdate.value ? await updateMenu(values) : await addMenu(values);

      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>

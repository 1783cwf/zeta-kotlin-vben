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

    const { record, update } = data;
    isUpdate.value = update.value;
    if (record) {
      // 如果菜单ID有值，就设置菜单ID为父ID。如果菜单ID没有值，说明添加的是一级菜单
      await setFieldsValue({ parentId: record.id || record.parentId });
    }
    if (unref(isUpdate)) {
      console.log(record);
      await setFieldsValue({
        ...data.record,
      });
    }

    // 在最外面包一层根目录
    const treeData = [
      {
        id: '0',
        label: '根菜单',
        children: await getMenuList(),
      },
    ];
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
          treeLine: { showLeafIcon: false },
          // 默认展开的树节点
          treeDefaultExpandedKeys: [0],
          treeDefaultExpandAll: false,
        },
        dynamicDisabled: () => {
          return isUpdate.value;
        },
      },
      {
        field: 'menuType',
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
          return values.menuType === 'RESOURCE' || isUpdate.value;
        },
      },
      {
        field: 'icon',
        dynamicReadonly: ({ values }) => {
          return values.menuType === 'RESOURCE';
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

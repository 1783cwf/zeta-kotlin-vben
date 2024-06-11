<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column?.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '新增',
                icon: IconEnum.ADD,
                type: 'primary',
                ghost: true,
                onClick: handleEdit.bind(null, record!!),
              },
              {
                label: '修改',
                type: 'primary',
                icon: IconEnum.EDIT,
                onClick: handleEdit.bind(null, record!!),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'primary',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record!!),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { nextTick } from 'vue';

  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { deleteMenu, getMenuList } from '@/api/sys/menu';

  import { useDrawer } from '@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';

  import { columns } from './menu.data';
  import { IconEnum } from '@/enums/appEnum';

  defineOptions({ name: 'MenuManagement' });

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload, expandAll }] = useTable({
    title: '菜单列表',
    api: getMenuList,
    columns,
    isTreeTable: true,
    pagination: false,
    striped: false,
    useSearchForm: false,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
    actionColumn: {
      width: 240,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  function handleCreate(record?: Recordable) {
    const parentId = record?.id || '0';
    openDrawer(true, {
      update: false,
      record: { parentId },
    });
  }

  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      update: true,
    });
  }

  async function handleDelete(record: Recordable) {
    const res = await deleteMenu(record.id);
    if (res) {
      await reload();
    }
  }

  function handleSuccess() {
    reload();
  }

  function onFetchSuccess() {
    // 演示默认展开所有表项
    nextTick(expandAll);
  }
</script>

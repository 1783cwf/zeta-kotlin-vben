import { BasicColumn, FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import Icon from '@/components/Icon/Icon.vue';

export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'label',
    width: 200,
    align: 'left',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 50,
    customRender: ({ record }) => {
      return h(Icon, { icon: record.icon });
    },
  },
  {
    title: '权限标识',
    dataIndex: 'authority',
    width: 180,
  },
  {
    title: '路由地址',
    dataIndex: 'path',
    width: 180,
  },
  {
    title: '组件路径',
    dataIndex: 'component',
  },
  {
    title: '排序',
    dataIndex: 'sortValue',
    width: 50,
  },
  {
    key: 'hide',
    title: '是否隐藏',
    width: '100px',
    customRender: ({ record }) => {
      const hide = record.hide;
      const color = hide ? 'red' : 'green';
      const text = hide ? '隐藏' : '显示';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    key: 'menuType',
    title: '类型',
    width: '100px',
    align: 'center',
    customRender({ record }) {
      const menuType = record.menuType;
      const color = menuType === 'MENU' ? 'green' : 'red';
      const text = menuType === 'MENU' ? '菜单' : '按钮';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
];
const isMenu = (menuType: string) => menuType === 'MENU';
const isButton = (menuType: string) => menuType === 'RESOURCE';

export const menuTypes = [
  { label: '菜单', value: 'MENU' },
  { label: '按钮', value: 'RESOURCE' },
];

export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'label',
  //   label: '菜单名称',
  //   component: 'Input',
  //   colProps: { span: 8 },
  // },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: '菜单ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'parentId',
    label: '上级菜单',
    component: 'TreeSelect',
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'menuType',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: 'MENU',
    componentProps: {
      options: [...menuTypes],
    },
  },
  {
    field: 'label',
    label: '菜单名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'openType',
    label: '打开方式',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '组件', value: '1' },
        { label: '内链', value: '2' },
        { label: '外链', value: '3' },
      ],
    },
  },

  {
    field: 'name',
    label: '路由名称',
    component: 'Input',
    required({ values }) {
      return values.menuType === 'MENU';
    },
    helpMessage: 'Vue Router的路由标识，需要唯一值。建议用英文命名',
    dynamicDisabled: ({ values }): boolean => {
      return values.menuType === 'RESOURCE';
    },
  },
  {
    field: 'frameSrc',
    label: '内链地址',
    component: 'Input',
    ifShow({ values }) {
      return values.openType === '2';
    },
  },
  {
    field: 'href',
    label: '外链地址',
    component: 'Input',
    ifShow({ values }) {
      return values.openType === '3';
    },
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    ifShow({ values }) {
      return isMenu(values.menuType);
    },
  },
  {
    field: 'path',
    label: '路由地址',
    component: 'Input',
    helpMessage: '如果是子级路由，需要拼接父级路由;如果菜单类型是按钮，路由地址可以不用填写',
    dynamicDisabled: ({ values }): boolean => {
      return !isMenu(values.menuType);
    },
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Input',
    helpMessage: '如果新增的菜单是层级菜单，组件路径可以不用填写',
    dynamicDisabled: ({ values }): boolean => {
      return !isMenu(values.menuType);
    },
  },
  {
    field: 'redirect',
    label: '重定向地址',
    component: 'Input',
    helpMessage: '影响面包屑点击之后，跳转到哪个路由地址',
    dynamicDisabled: ({ values }): boolean => {
      return !isMenu(values.menuType);
    },
  },
  {
    field: 'sortValue',
    label: '排序',
    component: 'InputNumber',
    defaultValue: 0,
  },

  {
    field: 'authority',
    label: '权限标识',
    component: 'Input',
    helpMessage: `菜单类型为'菜单'时,权限标识不需要填写`,
    dynamicDisabled({ values }) {
      return values.menuType === 'MENU';
    },
  },
  {
    field: 'keepAlive',
    label: '是否缓存',
    component: 'RadioButtonGroup',
    defaultValue: 'true',
    helpMessage: '页面缓存，需要搭配路由name使用',
    componentProps: {
      options: [
        { label: '否', value: 'false' },
        { label: '是', value: 'true' },
      ],
    },
    dynamicDisabled: ({ values }) => !isMenu(values.menuType),
  },
  {
    field: 'hide',
    label: '是否隐藏',
    component: 'RadioButtonGroup',
    defaultValue: false,
    helpMessage: '如果隐藏，则不会出现在左侧菜单栏',
    componentProps: {
      options: [
        { label: '显示', value: false },
        { label: '隐藏', value: true },
      ],
    },
    ifShow: ({ values }) => !isButton(values.menuType),
  },
  {
    field: 'version',
    component: 'Input',
    ifShow: false,
  },
];

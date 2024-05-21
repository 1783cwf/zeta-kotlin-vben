import { withInstall } from '@/utils';
import openSelector from './src/OpenSelector.vue';

export const OpenSelector = withInstall(openSelector);
export { useOpenType } from './src/hooks/useOpenWindow';
export * from './src/typing';

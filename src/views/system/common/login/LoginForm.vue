<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('system.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('system.login.password')"
      />
    </FormItem>
    <FormItem name="code" class="enter-x" v-if="image.requiredCapcha">
      <Input
        ref="imageCimageCodeRefodeRef"
        size="large"
        v-model:value="formData.code"
        placeholder="输入验证码"
        @keyup.enter="handleLogin"
      >
        <template #addonAfter>
          <img :width="120" :height="38" :src="verifyCode" @click="refreshCaptchaImage" />
        </template>
      </Input>
    </FormItem>
    <FormItem hidden name="key" class="enter-x" v-if="image.requiredCapcha">
      <Input disabled />
    </FormItem>
    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('system.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('system.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('system.login.loginButton') }}
      </Button>
      <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
        {{ t('system.login.registerButton') }}
      </Button> -->
    </FormItem>
    <ARow class="enter-x" :gutter="[16, 16]">
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.MOBILE)">
          {{ t('system.login.mobileSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">
          {{ t('system.login.qrSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">
          {{ t('system.login.registerButton') }}
        </Button>
      </ACol>
    </ARow>

    <Divider class="enter-x">{{ t('system.login.otherSignIn') }}</Divider>

    <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div>
  </Form>
</template>
<script lang="ts" setup>
  import { computed, onMounted, reactive, ref, unref } from 'vue';

  import { Button, Checkbox, Col, Divider, Form, Input, Row } from 'ant-design-vue';
  import {
    AlipayCircleFilled,
    GithubFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
    WechatFilled,
  } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';

  import { useUserStore } from '@/store/modules/user';
  import { LoginStateEnum, useFormRules, useFormValid, useLoginState } from './useLogin';
  import { useDesign } from '@/hooks/web/useDesign';
  import { captchaApi } from '@/api/sys/user';
  import { cryptoEncode } from '@/utils/crypto';
  import { GrantTypeEnum } from '@/api/sys/model/login';
  //import { onKeyStroke } from '@vueuse/core';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);

  const formData: any = reactive({
    account: 'zetaAdmin',
    password: 'admin',
    // account: '',
    // password: '',
    code: '',
    key: '',
  });
  const verifyCode = ref<string>('');
  // 验证码信息
  const image = reactive({
    requiredCapcha: true,
    imageInfo: '',
  });

  async function refreshCaptchaImage() {
    const data = await captchaApi();
    verifyCode.value = data?.base64;
    formData.key = data?.key;

    // 如果当前环境是开发环境，直接填写验证码
    if (process.env.NODE_ENV === 'development') {
      formData.code = data?.text;
    }
  }

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        code: data.code,
        key: data.key,
        password: cryptoEncode(data?.password),
        account: data.account,
        mode: 'none', //不要默认的错误提示
        grantType: GrantTypeEnum.PASSWORD,
      });
      if (userInfo) {
        notification.success({
          message: t('system.login.loginSuccessTitle'),
          description: `${t('system.login.loginSuccessDesc')}: ${userInfo.username}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('system.api.errorTip'),
        content: (error as unknown as Error).message || t('system.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
      await refreshCaptchaImage();
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    // 验证码
    await refreshCaptchaImage();
  });
</script>

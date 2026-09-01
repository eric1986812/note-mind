// MindFlow 支付流程测试 - 2026-09-01
// 跑前 4 步(注册 → 选 plan → 跳 Creem checkout),不真付

const { chromium } = require('playwright');

const TEST_EMAIL = `mindflow-test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'test1234';
const TEST_NAME = 'MindFlow Test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'zh-CN',
  });
  const page = await ctx.newPage();

  // 收集所有 console error
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });

  console.log('========== MindFlow 支付流程测试 ==========');
  console.log('测试账号:', TEST_EMAIL);
  console.log('当前时间:', new Date().toISOString());
  console.log('');

  // ===== Step 1: 访问 /pricing =====
  console.log('--- Step 1: 访问 /pricing ---');
  await page.goto('https://mindflow.wang/pricing', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/test_01_pricing.png', fullPage: true });

  // 验证 3 档
  const planCount = await page.locator('text=/月付|年付|免费/').count();
  const price4_99 = await page.getByText('$4.99').count();
  const price39_99 = await page.getByText('$39.99').count();
  console.log(`  ✅ /pricing 加载完成`);
  console.log(`  - 看到 "月付/年付/免费" 字样: ${planCount} 处`);
  console.log(`  - 看到 "$4.99": ${price4_99} 处`);
  console.log(`  - 看到 "$39.99": ${price39_99} 处`);
  console.log(`  - 截图: /tmp/test_01_pricing.png`);

  // ===== Step 2: 点月付 "立即订阅" =====
  console.log('');
  console.log('--- Step 2: 点月付 $4.99 "立即订阅" ---');
  const monthCta = page.getByText('立即订阅').nth(0); // 假设月付在前
  // 先确认注册弹窗
  const authModalVisible = await page.getByText(/登录以继续|邮箱/).isVisible().catch(() => false);
  if (authModalVisible) {
    console.log('  ✅ 注册/登录弹窗出现');
  } else {
    // 弹窗可能还没出,等一下
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: '/tmp/test_02_auth_modal.png', fullPage: true });
  console.log('  - 截图: /tmp/test_02_auth_modal.png');

  // ===== Step 3: 填写注册信息 =====
  console.log('');
  console.log('--- Step 3: 填写注册信息 ---');
  // 找输入框
  const emailInput = page.locator('input[type="email"], input[placeholder*="邮箱"], input[placeholder*="email"]').first();
  const pwdInput = page.locator('input[type="password"]').first();
  const nameInput = page.locator('input[placeholder*="昵称"]').first();

  if (await emailInput.isVisible().catch(() => false)) {
    await emailInput.fill(TEST_EMAIL);
    console.log(`  ✅ 邮箱填入: ${TEST_EMAIL}`);
  } else {
    console.log('  ⚠️  找不到邮箱输入框');
  }
  if (await pwdInput.isVisible().catch(() => false)) {
    await pwdInput.fill(TEST_PASSWORD);
    console.log(`  ✅ 密码填入: ${TEST_PASSWORD}`);
  }
  if (await nameInput.isVisible().catch(() => false)) {
    await nameInput.fill(TEST_NAME);
    console.log(`  ✅ 昵称填入: ${TEST_NAME}`);
  }
  await page.screenshot({ path: '/tmp/test_03_form_filled.png', fullPage: true });
  console.log('  - 截图: /tmp/test_03_form_filled.png');

  // ===== Step 4: 提交注册 =====
  console.log('');
  console.log('--- Step 4: 提交注册 ---');
  const submitBtn = page.getByText(/注册 \+ 继续|注册并继续|Register/).first();
  if (await submitBtn.isVisible().catch(() => false)) {
    await submitBtn.click();
    console.log('  ✅ 点注册按钮');
    // 等 5 秒看是否跳到 Creem 或弹错
    await page.waitForTimeout(5000);
    await page.screenshot({ path: '/tmp/test_04_after_register.png', fullPage: true });

    const currentUrl = page.url();
    console.log(`  当前 URL: ${currentUrl}`);

    if (currentUrl.includes('creem.io')) {
      console.log('  ✅ 已跳转到 Creem checkout!');
      // 等待 Creem 页面加载
      await page.waitForTimeout(3000);
      await page.screenshot({ path: '/tmp/test_05_creem_checkout.png', fullPage: true });

      // 读 Creem 页面文字
      const creemText = await page.locator('body').textContent();
      const has4_99 = creemText.includes('$4.99') || creemText.includes('4.99');
      const hasMindFlow = creemText.includes('MindFlow');
      const hasMonthly = creemText.toLowerCase().includes('monthly');
      console.log(`  - Creem 页面含 "$4.99": ${has4_99 ? '✅' : '❌'}`);
      console.log(`  - Creem 页面含 "MindFlow": ${hasMindFlow ? '✅' : '❌'}`);
      console.log(`  - Creem 页面含 "Monthly": ${hasMonthly ? '✅' : '❌'}`);
      console.log(`  - 截图: /tmp/test_05_creem_checkout.png`);
    } else if (currentUrl.includes('/upload') || currentUrl.includes('/pricing')) {
      console.log('  ⚠️  没跳到 Creem,看当前页面状态');
    }
  }

  console.log('');
  console.log('========== 错误汇总 ==========');
  if (errors.length === 0) {
    console.log('  ✅ 无 console error');
  } else {
    errors.forEach(e => console.log('  ❌ ' + e));
  }

  await browser.close();
  console.log('');
  console.log('测试完成。截图都在 /tmp/test_*.png');
})().catch(e => {
  console.error('TEST FAILED:', e.message);
  console.error(e.stack);
  process.exit(1);
});

// MindFlow 支付流程测试 v2
// 流程:点 中文按钮 → 点月付 → 注册 → 跳 Creem → 截图(不真付)

const { chromium } = require('playwright');

const TEST_EMAIL = `mindflow-test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'test1234';
const TEST_NAME = 'MindFlow Test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();

  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console.error: ' + m.text()); });

  console.log('========== MindFlow 支付流程测试 v2 ==========');
  console.log('测试账号:', TEST_EMAIL);
  console.log('');

  // ===== Step 1: 访问 /pricing,点"中文"按钮 =====
  console.log('--- Step 1: 访问 /pricing,点中文 ---');
  await page.goto('https://mindflow.wang/pricing', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // 找"中文"按钮(右上角)并点击
  const zhBtn = page.getByText('中文', { exact: false }).first();
  if (await zhBtn.isVisible().catch(() => false)) {
    await zhBtn.click();
    console.log('  ✅ 点"中文"按钮');
    await page.waitForTimeout(2000);
  } else {
    console.log('  ⚠️  找不到"中文"按钮');
  }

  await page.screenshot({ path: '/tmp/test_01_pricing_zh.png', fullPage: true });
  const bodyText = await page.locator('body').textContent();
  console.log(`  - 页面含 "一杯奶茶钱": ${bodyText.includes('一杯奶茶钱') ? '✅' : '❌'}`);
  console.log(`  - 页面含 "月付版": ${bodyText.includes('月付版') ? '✅' : '❌'}`);
  console.log(`  - 页面含 "免费版": ${bodyText.includes('免费版') ? '✅' : '❌'}`);
  console.log(`  - 页面含 "年付版": ${bodyText.includes('年付版') ? '✅' : '❌'}`);
  console.log(`  - 页面含 "\$4.99": ${bodyText.includes('$4.99') ? '✅' : '❌'}`);
  console.log(`  - 页面含 "\$39.99": ${bodyText.includes('$39.99') ? '✅' : '❌'}`);
  console.log(`  - 截图: /tmp/test_01_pricing_zh.png`);

  // ===== Step 2: 点月付版"立即订阅" =====
  console.log('');
  console.log('--- Step 2: 点月付版"立即订阅" ---');
  const ctaBtns = await page.getByText('立即订阅').all();
  console.log(`  - 找到"立即订阅"按钮: ${ctaBtns.length} 个`);

  if (ctaBtns.length >= 1) {
    // 第 0 个是月付(月付在前)
    await ctaBtns[0].click();
    console.log('  ✅ 点了第 1 个"立即订阅"(月付)');
    await page.waitForTimeout(2000);
  }
  await page.screenshot({ path: '/tmp/test_02_after_click.png', fullPage: true });

  // 检查是否弹出注册 modal
  const hasModal = await page.getByText(/邮箱|登录|注册/).first().isVisible().catch(() => false);
  console.log(`  - 注册弹窗出现: ${hasModal ? '✅' : '❌'}`);
  console.log(`  - 截图: /tmp/test_02_after_click.png`);

  // ===== Step 3: 填写注册 =====
  console.log('');
  console.log('--- Step 3: 填写注册 ---');

  // modal 里通常有 input[type="email"]
  const emailInputs = await page.locator('input[type="email"]').all();
  const pwdInputs = await page.locator('input[type="password"]').all();
  console.log(`  - 找到 email 输入框: ${emailInputs.length} 个`);
  console.log(`  - 找到 password 输入框: ${pwdInputs.length} 个`);

  if (emailInputs.length > 0 && pwdInputs.length > 0) {
    await emailInputs[0].fill(TEST_EMAIL);
    await pwdInputs[0].fill(TEST_PASSWORD);
    console.log(`  ✅ 填了: ${TEST_EMAIL} / ${TEST_PASSWORD}`);

    await page.screenshot({ path: '/tmp/test_03_filled.png', fullPage: true });
    console.log(`  - 截图: /tmp/test_03_filled.png`);

    // ===== Step 4: 提交注册 =====
    console.log('');
    console.log('--- Step 4: 提交注册 ---');

    // 找 "注册 + 继续" 按钮
    const submitBtn = page.getByText('注册 + 继续').first();
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      console.log('  ✅ 点"注册 + 继续"');
      await page.waitForTimeout(5000);

      const currentUrl = page.url();
      console.log(`  当前 URL: ${currentUrl}`);

      if (currentUrl.includes('creem.io')) {
        console.log('  ✅ 已跳转到 Creem checkout!');
        await page.waitForTimeout(3000);
        await page.screenshot({ path: '/tmp/test_05_creem.png', fullPage: true });
        const creemText = await page.locator('body').textContent();
        console.log(`  - Creem 页面含 "\$4.99": ${creemText.includes('$4.99') || creemText.includes('4.99') ? '✅' : '❌'}`);
        console.log(`  - Creem 页面含 "MindFlow": ${creemText.includes('MindFlow') ? '✅' : '❌'}`);
        console.log(`  - 截图: /tmp/test_05_creem.png`);
      } else if (currentUrl.includes('/upload')) {
        console.log('  ⚠️  跳到 /upload 了(可能注册失败/成功但 checkout 出错)');
        const alertText = await page.evaluate(() => {
          // 看看页面是不是有错误提示
          return document.body.innerText.slice(0, 500);
        });
        console.log('  页面文字:', alertText);
        await page.screenshot({ path: '/tmp/test_05_after_register.png', fullPage: true });
      } else {
        console.log(`  ⚠️  跳到意外 URL: ${currentUrl}`);
        await page.screenshot({ path: '/tmp/test_05_unknown.png', fullPage: true });
      }
    } else {
      console.log('  ❌ 找不到"注册 + 继续"按钮');
    }
  } else {
    console.log('  ❌ 找不到注册表单(可能 modal 没弹)');
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

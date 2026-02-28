import { test, expect } from '@playwright/test';

test.describe('DreamVideo 页面测试', () => {

  test('首页显示正确', async ({ page }) => {
    await page.goto('/');

    // 检查标题
    await expect(page.locator('h1')).toContainText('文字变视频');

    // 检查按钮
    await expect(page.locator('text=开始创作')).toBeVisible();
    await expect(page.locator('text=历史记录')).toBeVisible();

    // 截图
    await page.screenshot({ path: 'tests/screenshots/home.png', fullPage: true });
  });

  test('生成页面显示正确', async ({ page }) => {
    await page.goto('/generate');

    // 检查标题
    await expect(page.locator('h1')).toContainText('创作视频');

    // 检查输入框
    await expect(page.locator('textarea')).toBeVisible();

    // 检查设置面板
    await expect(page.locator('text=生成设置')).toBeVisible();

    // 截图
    await page.screenshot({ path: 'tests/screenshots/generate.png', fullPage: true });
  });

  test('历史页面显示正确', async ({ page }) => {
    await page.goto('/history');

    // 检查标题
    await expect(page.locator('h1')).toContainText('历史记录');

    // 检查空状态或列表
    await expect(page.locator('text=暂无记录').or(page.locator('.grid'))).toBeVisible();

    // 截图
    await page.screenshot({ path: 'tests/screenshots/history.png', fullPage: true });
  });

  test('设置页面显示正确', async ({ page }) => {
    await page.goto('/settings');

    // 检查标题
    await expect(page.locator('h1')).toContainText('设置');

    // 检查设置项
    await expect(page.locator('text=主题')).toBeVisible();
    await expect(page.locator('text=API 配置管理')).toBeVisible();

    // 截图
    await page.screenshot({ path: 'tests/screenshots/settings.png', fullPage: true });
  });

  test('API 配置页面显示正确', async ({ page }) => {
    await page.goto('/settings/api');

    // 检查标题
    await expect(page.locator('h1')).toContainText('API 配置');

    // 检查添加按钮
    await expect(page.locator('text=添加 API 配置')).toBeVisible();

    // 截图
    await page.screenshot({ path: 'tests/screenshots/api-config.png', fullPage: true });
  });

  test('页面导航正常工作', async ({ page }) => {
    // 从首页开始
    await page.goto('/');

    // 点击开始创作
    await page.click('text=开始创作');
    await expect(page).toHaveURL(/.*generate/);

    // 返回首页
    await page.click('text=返回');
    await expect(page).toHaveURL('/');

    // 点击历史记录
    await page.click('text=历史记录');
    await expect(page).toHaveURL(/.*history/);
  });
});

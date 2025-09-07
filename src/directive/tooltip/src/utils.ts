// src/directive/tooltip/src/utils.ts
/**
 * 提示框工具函数模块
 * 包含通用工具函数
 */

import type { TooltipInstance } from './type';

// 常量定义
const OVERFLOW_TOLERANCE = 1; // 溢出检测容差(px)
const TRANSITION_DURATION = 200; // 过渡动画时长(ms)

/**
 * 检查文本是否溢出
 * @param el 目标元素
 * @param maxLines 最大行数
 * @returns 是否溢出
 */
export const checkTextOverflow = (el: HTMLElement, maxLines: number): boolean => {
  // 元素不可见时不检测
  if (el.offsetParent === null) return false;

  // 单行文本检测
  if (maxLines === 1) {
    return el.scrollWidth > el.clientWidth + OVERFLOW_TOLERANCE;
  }

  // 多行文本检测
  return el.scrollHeight > el.clientHeight + OVERFLOW_TOLERANCE;
};

/**
 * 显示提示框
 * @param instance 提示框实例
 */
export const showTooltip = (instance: TooltipInstance): void => {
  if (!instance.tooltip || instance.visible) return;

  // 设置内容
  const contentEl = instance.tooltip.querySelector('.tooltip-content');
  if (contentEl) {
    contentEl.textContent = instance.options.content || instance.reference.textContent || '';
  }

  // 显示动画
  instance.tooltip.style.visibility = 'visible';
  instance.tooltip.style.opacity = '1';
  instance.tooltip.style.transform = 'translateY(0)';

  // 更新状态
  instance.visible = true;

  // 设置自动关闭
  if (instance.options.duration && instance.options.duration > 0) {
    if (instance.timer) clearTimeout(instance.timer);
    instance.timer = window.setTimeout(() => {
      hideTooltip(instance);
    }, instance.options.duration);
  }
};

/**
 * 隐藏提示框
 * @param instance 提示框实例
 */
export const hideTooltip = (instance: TooltipInstance): void => {
  if (!instance.tooltip || !instance.visible) return;

  // 清除自动关闭计时器
  if (instance.timer) {
    clearTimeout(instance.timer);
    instance.timer = null;
  }

  // 隐藏动画
  instance.tooltip.style.opacity = '0';
  instance.tooltip.style.transform = 'translateY(-5px)';

  // 延迟隐藏（等待动画完成）
  const hideTimer = window.setTimeout(() => {
    if (instance.tooltip) {
      instance.tooltip.style.visibility = 'hidden';
      instance.tooltip.style.transform = 'translateY(0)'; // 重置变换
    }
    instance.visible = false;
  }, TRANSITION_DURATION);

  instance.hideTimer = hideTimer;
};

/**
 * 销毁提示框实例
 * @param instance 提示框实例
 */
export const destroyTooltip = (instance: TooltipInstance): void => {
  // 清除所有计时器
  if (instance.timer) clearTimeout(instance.timer);
  if (instance.hideTimer) clearTimeout(instance.hideTimer);

  // 移除DOM元素
  if (instance.tooltip && instance.tooltip.parentElement) {
    instance.tooltip.parentElement.removeChild(instance.tooltip);
  }
};

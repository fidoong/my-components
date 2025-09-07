// src/directive/tooltip/src/style.ts
/**
 * 提示框样式模块
 * 负责所有样式相关的操作
 */

import type { TooltipOptions, Placement, Theme } from './type';

/**
 * 创建提示框元素
 * @param options 配置选项
 * @returns 提示框DOM元素
 */
export const createTooltipElement = (options: TooltipOptions): HTMLElement => {
  const tooltip = document.createElement('div');
  const isLightTheme = options.theme === 'light';

  // 基础样式
  tooltip.className = `tooltip-popper ${isLightTheme ? 'is-light' : 'is-dark'} ${options.className || ''}`;
  tooltip.style.cssText = `
    position: absolute;
    z-index: 2000;
    display: block;
    visibility: hidden;
    opacity: 0;
    pointer-events: ${options.enterable ? 'auto' : 'none'};
    transition: opacity 0.2s, transform 0.2s;
    transform-origin: center top;
    user-select: text;
    max-width: 200px;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.4;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: ${isLightTheme ? '#fff' : '#303133'};
    color: ${isLightTheme ? '#303133' : '#fff'};
    border: ${isLightTheme ? '1px solid #e5e7eb' : 'none'};
  `;

  // 创建箭头元素
  const arrow = document.createElement('div');
  arrow.className = 'tooltip-arrow';
  tooltip.appendChild(arrow);

  // 创建内容容器
  const content = document.createElement('div');
  content.className = 'tooltip-content';
  tooltip.appendChild(content);

  document.body.appendChild(tooltip);
  return tooltip;
};

/**
 * 更新箭头样式和位置
 * @param tooltip 提示框元素
 * @param placement 位置
 * @param theme 主题
 */
export const updateArrowStyle = (tooltip: HTMLElement, placement: Placement, theme: Theme): void => {
  const arrow = tooltip.querySelector('.tooltip-arrow') as HTMLElement;
  if (!arrow) return;

  const isLightTheme = theme === 'light';
  const arrowColor = isLightTheme ? '#fff' : '#303133';
  const borderColor = isLightTheme ? '#e5e7eb' : 'transparent';

  // 重置样式
  arrow.style.cssText = `
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
  `;

  // 基础位置
  const basePlacement = placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';

  switch (basePlacement) {
    case 'top':
      arrow.style.bottom = isLightTheme ? '-6px' : '-5px';
      arrow.style.left = '50%';
      arrow.style.transform = 'translateX(-50%)';
      arrow.style.borderWidth = '5px 5px 0';
      arrow.style.borderTopColor = arrowColor;
      if (isLightTheme) arrow.style.borderBottomColor = borderColor;
      break;

    case 'bottom':
      arrow.style.top = isLightTheme ? '-6px' : '-5px';
      arrow.style.left = '50%';
      arrow.style.transform = 'translateX(-50%)';
      arrow.style.borderWidth = '0 5px 5px';
      arrow.style.borderBottomColor = arrowColor;
      if (isLightTheme) arrow.style.borderTopColor = borderColor;
      break;

    case 'left':
      arrow.style.right = isLightTheme ? '-6px' : '-5px';
      arrow.style.top = '50%';
      arrow.style.transform = 'translateY(-50%)';
      arrow.style.borderWidth = '5px 0 5px 5px';
      arrow.style.borderLeftColor = arrowColor;
      if (isLightTheme) arrow.style.borderRightColor = borderColor;
      break;

    case 'right':
      arrow.style.left = isLightTheme ? '-6px' : '-5px';
      arrow.style.top = '50%';
      arrow.style.transform = 'translateY(-50%)';
      arrow.style.borderWidth = '5px 5px 5px 0';
      arrow.style.borderRightColor = arrowColor;
      if (isLightTheme) arrow.style.borderLeftColor = borderColor;
      break;
  }
};

/**
 * 应用文本溢出样式
 * @param el 目标元素
 * @param maxLines 最大行数
 */
export const applyOverflowStyles = (el: HTMLElement, maxLines: number): void => {
  if (maxLines === 1) {
    // 单行文本样式
    el.style.whiteSpace = 'nowrap';
    el.style.overflow = 'hidden';
    el.style.textOverflow = 'ellipsis';
  } else {
    // 多行文本样式
    el.style.overflow = 'hidden';
    el.style.display = '-webkit-box';
    (el.style as any).webkitLineClamp = maxLines.toString();
    (el.style as any).webkitBoxOrient = 'vertical';
  }
};

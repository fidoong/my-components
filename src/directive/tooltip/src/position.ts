/**
 * 提示框位置计算模块
 * 负责提示框的位置计算和更新
 */

import type { Placement, PositionOptions } from './type';

// 位置坐标接口
export interface Position {
  top: number;
  left: number;
}


/**
 * 安全地获取元素偏移高度
 */
const getSafeOffsetHeight = (element: HTMLElement | null): number => {
  return element?.offsetHeight || 0;
};

/**
 * 检查位置是否在视口内（带缓冲区域）
 */
const isPositionInViewport = (pos: Position, tooltip: HTMLElement, buffer = 4): boolean => {
  const rect = tooltip.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  return (
    pos.left >= -buffer &&
    pos.top >= -buffer &&
    pos.left + rect.width <= viewportWidth + buffer &&
    pos.top + rect.height <= viewportHeight + buffer
  );
};

/**
 * 计算单个位置的坐标
 */
const calculateSinglePosition = (
  reference: HTMLElement | null,
  tooltip: HTMLElement | null,
  placement: 'top' | 'bottom' | 'left' | 'right',
  offset: number
): Position => {
  if (!reference || !tooltip) {
    console.warn('计算位置失败：参考元素或提示框元素不存在');
    return { top: 0, left: 0 };
  }

  // 强制刷新布局
  getSafeOffsetHeight(reference);
  getSafeOffsetHeight(tooltip);

  const referenceRect = reference.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  const pos: Position = { top: 0, left: 0 };

  switch (placement) {
    case 'top':
      pos.top = referenceRect.top + scrollTop - tooltipRect.height - offset;
      pos.left = referenceRect.left + scrollLeft + (referenceRect.width / 2) - (tooltipRect.width / 2);
      break;

    case 'bottom':
      pos.top = referenceRect.bottom + scrollTop + offset;
      pos.left = referenceRect.left + scrollLeft + (referenceRect.width / 2) - (tooltipRect.width / 2);
      break;

    case 'left':
      pos.top = referenceRect.top + scrollTop + (referenceRect.height / 2) - (tooltipRect.height / 2);
      pos.left = referenceRect.left + scrollLeft - tooltipRect.width - offset;
      break;

    case 'right':
      pos.top = referenceRect.top + scrollTop + (referenceRect.height / 2) - (tooltipRect.height / 2);
      pos.left = referenceRect.right + scrollLeft + offset;
      break;
  }

  return pos;
};


/**
 * 计算提示框位置
 */
// 修改 src/directive/tooltip/src/position.ts 中的 calculatePosition 函数
export const calculatePosition = async (
  reference: HTMLElement | null,
  tooltip: HTMLElement | null,
  options: PositionOptions
): Promise<{ pos: Position; actualPlacement: Placement }> => {
  if (!reference || !tooltip) {
    console.error('无法计算位置：参考元素或提示框元素为null');
    return {
      pos: { top: 0, left: 0 },
      actualPlacement: 'bottom'
    };
  }

  // 新增：强制等待元素渲染完成（关键修复）
  await new Promise(resolve => {
    // 优先使用requestAnimationFrame确保布局更新
    if ((window as any)?.requestAnimationFrame) {
      requestAnimationFrame(resolve);
    } else {
      setTimeout(resolve, 10);
    }
  });

  // 确保元素已渲染到DOM中
  if (!reference.offsetParent) {
    console.warn('触发元素未渲染到DOM中，使用默认位置');
    return {
      pos: { top: 0, left: 0 },
      actualPlacement: 'bottom'
    };
  }

  try {
    const validPlacements: Placement[] = ['top', 'bottom', 'left', 'right'];
    const placement = validPlacements.includes(options.placement)
      ? options.placement
      : 'bottom';

    // 新增：首次计算前强制刷新布局
    reference.getBoundingClientRect();
    tooltip.getBoundingClientRect();

    let pos = calculateSinglePosition(
      reference,
      tooltip,
      placement as 'top' | 'bottom' | 'left' | 'right',
      options.offset || 12
    );

    // 新增：首次位置校验失败时增加重试机制
    if (!isPositionInViewport(pos, tooltip)) {
      // 等待更长时间确保渲染完成
      await new Promise(resolve => setTimeout(resolve, 20));
      pos = calculateSinglePosition(
        reference,
        tooltip,
        placement as 'top' | 'bottom' | 'left' | 'right',
        options.offset || 12
      );
    }

    return {
      pos: pos || { top: 0, left: 0 },
      actualPlacement: placement
    };
  } catch (error) {
    console.error('计算位置时发生错误：', error);
    return {
      pos: { top: 0, left: 0 },
      actualPlacement: 'bottom'
    };
  }
};

/**
 * 更新提示框位置
 */
export const updateTooltipPosition = (
  tooltip: HTMLElement | null,
  pos: Position | undefined,
  placement: Placement
): void => {
  if (!tooltip || !pos) {
    console.error('无法更新提示框位置：提示框元素或位置信息不存在');
    return;
  }

  const wasVisible = tooltip.style.visibility !== 'hidden';
  if (wasVisible) {
    tooltip.style.visibility = 'hidden';
  }

  tooltip.style.top = `${Math.round(pos.top)}px`;
  tooltip.style.left = `${Math.round(pos.left)}px`;

  const basePlacement = placement as 'top' | 'bottom' | 'left' | 'right';
  switch (basePlacement) {
    case 'top':
      tooltip.style.transformOrigin = 'center bottom';
      break;
    case 'bottom':
      tooltip.style.transformOrigin = 'center top';
      break;
    case 'left':
      tooltip.style.transformOrigin = 'right center';
      break;
    case 'right':
      tooltip.style.transformOrigin = 'left center';
      break;
    default:
      tooltip.style.transformOrigin = 'center top';
  }

  if (wasVisible) {
    tooltip.style.visibility = 'visible';
  }
};

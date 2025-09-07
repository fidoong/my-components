/**
 * 提示框指令主模块
 * 整合所有工具模块，实现核心逻辑
 */

import type { Directive, DirectiveBinding } from 'vue';
import { type TooltipInstance, type TooltipOptions, DEFAULT_OPTIONS } from './src/type.ts';
import { createTooltipElement, updateArrowStyle, applyOverflowStyles } from './src/style.ts';
import { calculatePosition, updateTooltipPosition } from './src/position.ts';
import { checkTextOverflow, showTooltip, hideTooltip } from './src/utils.ts';

// 存储所有实例
const instances = new WeakMap<HTMLElement, TooltipInstance>();


// 提示框指令实现
const Tooltip: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 合并配置选项
    const options: TooltipOptions = {
      ...DEFAULT_OPTIONS,
      ...(binding.value || {})
    };

    // 应用溢出样式
    applyOverflowStyles(el, options.maxLines ?? DEFAULT_OPTIONS.maxLines!);

    // 创建提示框元素
    const tooltip = createTooltipElement(options);

    // 窗口大小改变处理
    const handleResize = async () => {
      const instance = instances.get(el);
      if (instance && instance.visible && instance.tooltip) {
        try {
          // 异步计算位置（修复可能的同步问题）
          const result = await calculatePosition(
            instance.reference,
            instance.tooltip,
            {
              placement: instance.options.placement ?? DEFAULT_OPTIONS.placement!,
              offset: instance.options.offset ?? DEFAULT_OPTIONS.offset!
            }
          );
          updateTooltipPosition(instance.tooltip, result.pos, result.actualPlacement);
          updateArrowStyle(
            instance.tooltip,
            result.actualPlacement,
            instance.options.theme ?? DEFAULT_OPTIONS.theme!
          );
        } catch (error) {
          console.error('窗口 resize 时更新位置失败:', error);
        }
      }
    };

    // 事件处理函数
    const handlers = {
      // 鼠标进入触发元素
      mouseenter: (e: MouseEvent) => {
        e.stopPropagation();
        const instance = instances.get(el);
        if (!instance) return;

        // 清除计时器
        if (instance.timer) clearTimeout(instance.timer);
        if (instance.hideTimer) clearTimeout(instance.hideTimer);

        instance.isMouseInReference = true;

        // 检查是否需要显示
        const shouldShow = !options.showWhenOverflow ||
          !!options.content ||
          checkTextOverflow(el, options.maxLines ?? DEFAULT_OPTIONS.maxLines!);

        if (!shouldShow) return;

        // 延迟显示
        instance.timer = window.setTimeout(async () => {
          const instance = instances.get(el);
          if (!instance || !instance.tooltip) return;

          try {
            // 异步计算位置（修复原同步调用问题）
            const result = await calculatePosition(
              el,
              instance.tooltip,
              {
                placement: options.placement ?? DEFAULT_OPTIONS.placement!,
                offset: options.offset ?? DEFAULT_OPTIONS.offset!
              }
            );

            // 更新位置和样式
            updateTooltipPosition(instance.tooltip, result.pos, result.actualPlacement);
            updateArrowStyle(
              instance.tooltip,
              result.actualPlacement,
              options.theme ?? DEFAULT_OPTIONS.theme!
            );

            // 显示提示框
            showTooltip(instance);
          } catch (error) {
            console.error('显示提示框时计算位置失败:', error);
          }
        }, options.delay ?? DEFAULT_OPTIONS.delay!);
      },

      // 鼠标离开触发元素
      mouseleave: (e: MouseEvent) => {
        e.stopPropagation();
        const instance = instances.get(el);
        if (!instance) return;

        instance.isMouseInReference = false;

        // 如果不允许进入提示框，直接隐藏
        if (!options.enterable) {
          hideTooltip(instance);
          return;
        }

        // 过渡保护
        instance.hideTimer = window.setTimeout(() => {
          const instance = instances.get(el);
          if (instance && !instance.isMouseInTooltip) {
            hideTooltip(instance);
          }
        }, options.transitionProtection ?? DEFAULT_OPTIONS.transitionProtection!);
      },

      // 鼠标进入提示框
      tooltipMouseenter: (e: MouseEvent) => {
        e.stopPropagation();
        if (!options.enterable) return;

        const instance = instances.get(el);
        if (!instance) return;

        // 清除隐藏计时器
        if (instance.hideTimer) {
          clearTimeout(instance.hideTimer);
          instance.hideTimer = null;
        }

        instance.isMouseInTooltip = true;
      },

      // 鼠标离开提示框
      tooltipMouseleave: (e: MouseEvent) => {
        e.stopPropagation();
        if (!options.enterable) return;

        const instance = instances.get(el);
        if (!instance) return;

        instance.isMouseInTooltip = false;

        // 如果鼠标也不在触发元素内，隐藏提示框
        if (!instance.isMouseInReference) {
          hideTooltip(instance);
        }
      },

      // 点击外部区域
      clickOutside: (e: MouseEvent) => {
        const instance = instances.get(el);
        if (instance && instance.visible && instance.tooltip &&
          !el.contains(e.target as Node) &&
          !instance.tooltip.contains(e.target as Node)) {
          hideTooltip(instance);
        }
      },

      // 窗口大小改变
      resize: handleResize
    };

    // 创建实例
    const instance: TooltipInstance = {
      tooltip,
      reference: el,
      isTruncated: false,
      visible: false,
      isMouseInReference: false,
      isMouseInTooltip: false,
      options,
      timer: null,
      hideTimer: null,
      handlers
    };

    // 存储实例
    instances.set(el, instance);

    // 绑定事件
    el.addEventListener('mouseenter', handlers.mouseenter);
    el.addEventListener('mouseleave', handlers.mouseleave);

    if (options.enterable) {
      tooltip.addEventListener('mouseenter', handlers.tooltipMouseenter);
      tooltip.addEventListener('mouseleave', handlers.tooltipMouseleave);
    }

    document.addEventListener('click', handlers.clickOutside);
    window.addEventListener('resize', handlers.resize);
  },

  // 元素更新时
  updated(el: HTMLElement) {
    const instance = instances.get(el);
    if (instance) {
      // 更新内容
      if (instance.visible && instance.tooltip) {
        const contentEl = instance.tooltip.querySelector('.tooltip-content');
        if (contentEl) {
          contentEl.textContent = instance.options.content || el.textContent || '';

          // 内容更新后重新计算位置
          (async () => {
            try {
              const result = await calculatePosition(
                el,
                instance.tooltip,
                {
                  placement: instance.options.placement ?? DEFAULT_OPTIONS.placement!,
                  offset: instance.options.offset ?? DEFAULT_OPTIONS.offset!
                }
              );
              updateTooltipPosition(instance.tooltip, result.pos, result.actualPlacement);
            } catch (error) {
              console.error('更新提示框内容后重新计算位置失败:', error);
            }
          })();
        }
      }
    }
  },

  // 元素卸载时
  unmounted(el: HTMLElement) {
    const instance = instances.get(el);
    if (instance) {
      // 清除计时器
      if (instance.timer) clearTimeout(instance.timer);
      if (instance.hideTimer) clearTimeout(instance.hideTimer);

      // 移除事件监听
      el.removeEventListener('mouseenter', instance.handlers.mouseenter);
      el.removeEventListener('mouseleave', instance.handlers.mouseleave);

      if (instance.tooltip) {
        if (instance.options.enterable) {
          instance.tooltip.removeEventListener('mouseenter', instance.handlers.tooltipMouseenter);
          instance.tooltip.removeEventListener('mouseleave', instance.handlers.tooltipMouseleave);
        }
        // 移除提示框元素
        instance.tooltip.remove();
      }

      document.removeEventListener('click', instance.handlers.clickOutside);
      window.removeEventListener('resize', instance.handlers.resize);

      // 移除实例
      instances.delete(el);
    }
  }
};

export default Tooltip;

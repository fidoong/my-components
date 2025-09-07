/**
 * 提示框类型定义模块
 * 集中管理所有接口、类型和默认配置
 */

// 提示框位置类型
export type Placement = 'top' | 'bottom' | 'left' | 'right';

// 主题类型
export type Theme = 'dark' | 'light';

// 提示框配置选项
export interface TooltipOptions {
  maxLines?: number;           // 最大显示行数
  delay?: number;              // 显示延迟时间(ms)
  placement?: Placement;       // 显示位置
  offset?: number;             // 与触发元素的距离(px)
  className?: string;          // 自定义样式类
  showWhenOverflow?: boolean;  // 是否仅在溢出时显示
  enterable?: boolean;         // 鼠标是否可进入提示框
  content?: string;            // 自定义提示内容
  duration?: number;           // 自动关闭时间(ms)，0表示不自动关闭
  transitionProtection?: number; // 过渡保护时间(ms)
  theme?: Theme;               // 主题
}

// 提示框实例接口
export interface TooltipInstance {
  tooltip: HTMLElement | null;  // 提示框DOM元素
  reference: HTMLElement;       // 触发元素
  isTruncated: boolean;         // 是否文本溢出
  visible: boolean;             // 是否可见
  isMouseInReference: boolean;  // 鼠标是否在触发元素内
  isMouseInTooltip: boolean;    // 鼠标是否在提示框内
  options: TooltipOptions;      // 配置选项
  timer: number | null;         // 显示计时器
  hideTimer: number | null;     // 隐藏计时器
  handlers: {                   // 事件处理函数
    mouseenter: (e: MouseEvent) => void;
    mouseleave: (e: MouseEvent) => void;
    tooltipMouseenter: (e: MouseEvent) => void;
    tooltipMouseleave: (e: MouseEvent) => void;
    clickOutside: (e: MouseEvent) => void;
    resize: () => void;
  };
}

// 位置计算参数
export interface PositionOptions {
  placement: Placement;
  offset: number;
}

// 默认配置
export const DEFAULT_OPTIONS: TooltipOptions = {
  maxLines: 1,
  delay: 100,
  placement: 'top',
  offset: 12,
  showWhenOverflow: true,
  enterable: true,
  duration: 0,
  transitionProtection: 300,
  theme: 'light'
};

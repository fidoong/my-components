import {RuleBuilder} from "@/composables/form-rules/src/core.ts";

export class StringRuleBuilder extends RuleBuilder {
  /**
   * 邮箱验证
   * @param message 错误提示信息
   * @returns StringRuleBuilder 实例
   */
  email(message: string = '请输入有效的邮箱地址'): this {
    return this.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message);
  }

  /**
   * 手机号验证
   * @param message 错误提示信息
   * @returns StringRuleBuilder 实例
   */
  phone(message: string = '请输入有效的手机号'): this {
    return this.pattern(/^1[3-9]\d{9}$/, message);
  }

  /**
   * 网址验证
   * @param message 错误提示信息
   * @returns StringRuleBuilder 实例
   */
  url(message: string = '请输入有效的网址'): this {
    return this.pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/, message);
  }

  /**
   * 用户名验证（字母、数字、下划线）
   * @param message 错误提示信息
   * @returns StringRuleBuilder 实例
   */
  username(message: string = '用户名只能包含字母、数字和下划线'): this {
    return this.pattern(/^[a-zA-Z0-9_]+$/, message);
  }

  /**
   * 中文字符验证
   * @param message 错误提示信息
   * @returns StringRuleBuilder 实例
   */
  chinese(message: string = '请输入中文'): this {
    return this.pattern(/^[\u4e00-\u9fa5]+$/, message);
  }
}

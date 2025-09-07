import {RuleBuilder} from "@/composables/form-rules/src/core.ts";

export class PasswordRuleBuilder extends RuleBuilder {
  /**
   * 弱密码验证（仅检查长度）
   * @param minLength 最小长度
   * @param message 错误提示信息
   * @returns PasswordRuleBuilder 实例
   */
  weak(minLength: number = 6, message?: string): this {
    return this.minLength(minLength, message || `密码长度不能少于${minLength}位`);
  }

  /**
   * 中等强度密码验证（包含字母和数字）
   * @param message 错误提示信息
   * @returns PasswordRuleBuilder 实例
   */
  medium(message: string = '密码必须包含字母和数字'): this {
    return this.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, message);
  }


  /**
   * 密码确认验证
   * @param targetPassword 目标密码（要确认的密码）
   * @param message 错误提示信息
   * @returns PasswordRuleBuilder 实例
   */
  confirm(targetPassword: string, message: string = '两次输入的密码不一致'): this {
    return this.validator((rule, value, callback) => {
      if (value !== targetPassword) {
        callback(new Error(message));
      } else {
        callback();
      }
    });
  }
}

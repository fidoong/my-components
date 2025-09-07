import type { FormItemRule } from 'element-plus';

// 定义验证规则类型
export type ValidatorRule = FormItemRule & {
  nestedRules?: ValidatorRule[];
};

// 核心 RuleBuilder 类
export class RuleBuilder {
  protected rules: ValidatorRule[] = [];
  protected currentRule: ValidatorRule = {};

  /**
   * 添加必填验证
   * @param message 错误提示信息
   * @returns RuleBuilder 实例，用于链式调用
   */
  required(message: string = '此字段为必填项'): this {
    this.currentRule.required = true;
    this.currentRule.message = message;
    return this;
  }

  /**
   * 添加长度验证
   * @param min 最小长度
   * @param max 最大长度
   * @param message 错误提示信息
   * @returns RuleBuilder 实例，用于链式调用
   */
  length(min: number, max: number, message?: string): this {
    this.currentRule.min = min;
    this.currentRule.max = max;
    this.currentRule.message = message || `长度必须在${min}到${max}之间`;
    return this;
  }

  /**
   * 添加最小长度验证
   * @param min 最小长度
   * @param message 错误提示信息
   * @returns RuleBuilder 实例，用于链式调用
   */
  minLength(min: number, message?: string): this {
    this.currentRule.min = min;
    this.currentRule.message = message || `长度不能小于${min}`;
    return this;
  }

  /**
   * 添加最大长度验证
   * @param max 最大长度
   * @param message 错误提示信息
   * @returns RuleBuilder 实例，用于链式调用
   */
  maxLength(max: number, message?: string): this {
    this.currentRule.max = max;
    this.currentRule.message = message || `长度不能大于${max}`;
    return this;
  }

  /**
   * 添加正则表达式验证
   * @param pattern 正则表达式
   * @param message 错误提示信息
   * @returns RuleBuilder 实例，用于链式调用
   */
  pattern(pattern: RegExp, message: string): this {
    this.currentRule.pattern = pattern;
    this.currentRule.message = message;
    return this;
  }

  /**
   * 添加自定义验证函数
   * @param validator 自定义验证函数
   * @returns RuleBuilder 实例，用于链式调用
   */
  validator(validator: FormItemRule['validator']): this {
    this.currentRule.validator = validator;
    return this;
  }

  /**
   * 添加类型验证
   * @param type 验证类型
   * @param message 错误提示信息
   * @returns RuleBuilder 实例，用于链式调用
   */
  type(type: FormItemRule['type'], message?: string): this {
    this.currentRule.type = type;
    if (message) {
      this.currentRule.message = message;
    }
    return this;
  }

  /**
   * 添加验证触发方式
   * @param trigger 触发方式，如'blur'、'change'等
   * @returns RuleBuilder 实例，用于链式调用
   */
  trigger(trigger: string | string[]): this {
    this.currentRule.trigger = trigger;
    return this;
  }

  /**
   * 结束当前规则的定义，并开始新的规则
   * @returns RuleBuilder 实例，用于链式调用
   */
  and(): this {
    this.rules.push({ ...this.currentRule });
    this.currentRule = {};
    return this;
  }

  /**
   * 组合其他构建器的规则
   * @param builder 其他规则构建器实例
   * @returns RuleBuilder 实例，用于链式调用
   */
  combine(builder: RuleBuilder): this {
    const combinedRules = builder.build();
    this.rules.push(...combinedRules);
    return this;
  }

  /**
   * 构建并返回所有验证规则
   * @returns 验证规则数组
   */
  build(): ValidatorRule[] {
    if (Object.keys(this.currentRule).length > 0) {
      this.rules.push(this.currentRule);
    }
    return [...this.rules];
  }
}

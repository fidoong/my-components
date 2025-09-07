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

export class NumberRuleBuilder extends RuleBuilder {
  /**
   * 范围验证
   * @param min 最小值
   * @param max 最大值
   * @param message 错误提示信息
   * @returns NumberRuleBuilder 实例
   */
  range(min: number, max: number, message?: string): this {
    return this.validator((rule, value, callback) => {
      if (value === null || value === undefined || value === '') {
        callback();
        return;
      }
      if (value < min || value > max) {
        callback(new Error(message || `必须在${min}-${max}之间`));
      } else {
        callback();
      }
    });
  }

  /**
   * 整数验证
   * @param message 错误提示信息
   * @returns NumberRuleBuilder 实例
   */
  integer(message: string = '请输入整数'): this {
    return this.pattern(/^-?\d+$/, message);
  }

  /**
   * 正整数验证
   * @param message 错误提示信息
   * @returns NumberRuleBuilder 实例
   */
  positiveInteger(message: string = '请输入正整数'): this {
    return this.pattern(/^[1-9]\d*$/, message);
  }

  /**
   * 正数验证（可以是小数）
   * @param message 错误提示信息
   * @returns NumberRuleBuilder 实例
   */
  positiveNumber(message: string = '请输入正数'): this {
    return this.pattern(/^[0-9]+(.[0-9]+)?$/, message);
  }

  /**
   * 小数验证
   * @param decimalPlaces 小数位数
   * @param message 错误提示信息
   * @returns NumberRuleBuilder 实例
   */
  decimal(decimalPlaces: number = 2, message?: string): this {
    const pattern = new RegExp(`^-?\\d+(\\.\\d{1,${decimalPlaces}})?$`);
    return this.pattern(
      pattern,
      message || `请输入最多${decimalPlaces}位小数的数字`
    );
  }
}

// 规则容器类，聚合所有模块规则
export class FormRules {

  get string(): StringRuleBuilder {
    return new StringRuleBuilder();
  }

  get number(): NumberRuleBuilder {
    return new NumberRuleBuilder();
  }

  get password(): PasswordRuleBuilder {
    return new PasswordRuleBuilder();
  }

  // 组合多个规则构建器
  combine(...builders: RuleBuilder[]): RuleBuilder {
    const combined = new RuleBuilder();
    builders.forEach(builder => {
      combined.combine(builder);
    });
    return combined;
  }

  // 常用字段的快捷规则
  username(messagePrefix = '用户名'): StringRuleBuilder {
    return this.string
      .required(`${messagePrefix}不能为空`)
      .and()
      .length(3, 15, `${messagePrefix}长度必须在3-15之间`)
      .and()
      .username(`${messagePrefix}只能包含字母、数字和下划线`);
  }

  email(messagePrefix = '邮箱'): StringRuleBuilder {
    return this.string
      .required(`${messagePrefix}不能为空`)
      .and()
      .email(`请输入有效的${messagePrefix}地址`);
  }

  phone(messagePrefix = '手机号'): StringRuleBuilder {
    return this.string
      .required(`${messagePrefix}不能为空`)
      .and()
      .phone(`请输入有效的${messagePrefix}`);
  }
}

// 创建规则容器实例的便捷函数
export function useFormRules(): FormRules {
  return new FormRules();
}

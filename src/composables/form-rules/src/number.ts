import {RuleBuilder} from "@/composables/form-rules/src/core.ts";

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

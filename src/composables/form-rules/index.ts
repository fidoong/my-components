import {StringRuleBuilder} from "@/composables/form-rules/src/string.ts";
import {NumberRuleBuilder} from "@/composables/form-rules/src/number.ts";
import {PasswordRuleBuilder} from "@/composables/form-rules/src/password.ts";
import {RuleBuilder} from "@/composables/form-rules/src/core.ts";

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

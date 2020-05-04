import isEmpty from "lodash/isEmpty";
import mapValues from "lodash/mapValues";
import findKey from "lodash/findKey";
import omitBy from "lodash/omitBy";
import isUndefined from "lodash/isUndefined";

export const validationTexts = {
  required: "require",
  minLength: value => `Min length - ${value}`,
}

export { isEmpty };
export const isNotEmpty = value => !isEmpty(value);

export const isEmptyValue = value => {
  let checkValue = value;
  if (Number.isInteger(value)) {
    checkValue = value.toString();
  } else {
    if (Number(value) !== 0 && !Number.isNaN(Number(value))) {
      checkValue = value.toString();
    }
  }
  return isEmpty(checkValue);
}

export const composeValidators = rules => {
  return (value, data) => {
    return findKey(rules, rule => {
      return rule(value, data);
    });
  };
};

export const makeFormValidator = rules => {
  return values => {
    const keys = mapValues(rules, (rule, key) => {
      const value = values ? values[key] : undefined;
      return rule(value, values);
    });
    const errors = omitBy(keys, isUndefined);
    return isEmpty(errors) ? undefined : errors;
  };
};

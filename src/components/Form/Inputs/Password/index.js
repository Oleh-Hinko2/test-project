import React from 'react';
import { Input } from 'antd';

const PasswordField = ({ input, meta, label = "", required, placeholder = "Enter", ...props }) => {
  return (
    <span>
      <label>{label}</label>
      <Input.Password
        {...input}
        {...props}
        placeholder={placeholder}
      />
      <div className="ant-form-explain">
        {meta.touched ? meta.error : ''}
      </div>
    </span>
  );
};

export default PasswordField;
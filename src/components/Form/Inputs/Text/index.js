import React from 'react';
import { Input } from 'antd';

const TextField = ({ input, meta, label = "", placeholder = "Enter", required, ...props }) => {
  return (
    <span>
      <label>{label}</label>
      <Input
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


export default TextField;
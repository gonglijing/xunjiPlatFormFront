import React from 'react';
import { Spin } from 'antd';
import './Loading.css';

interface LoadingProps {
  visible?: boolean;
  tip?: string;
}

const Loading: React.FC<LoadingProps> = ({ visible = true, tip = '加载中...' }) => {
  if (!visible) return null;
  
  return (
    <div className="loading-container">
      <Spin size="large">
        {tip && <div className="loading-tip">{tip}</div>}
      </Spin>
    </div>
  );
};

export default Loading;

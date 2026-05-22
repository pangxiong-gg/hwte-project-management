import React from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Card,
  message
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../services/api';

const { TextArea } = Input;

export default function CreateProject() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      await projectApi.create(values);
      message.success('專案建立成功');
      navigate('/projects');
    } catch (error) {
      message.error('專案建立失敗');
    }
  };

  const onCancel = () => {
    navigate('/projects');
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="新增專案" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="名稱"
            name="name"
            rules={[{ required: true, message: '請輸入專案名稱' }]}
          >
            <Input placeholder="請輸入專案名稱" />
          </Form.Item>

          <Form.Item
            label="代碼"
            name="code"
            rules={[{ required: true, message: '請輸入專案代碼' }]}
          >
            <Input placeholder="請輸入專案代碼" />
          </Form.Item>

          <Form.Item
            label="類型"
            name="type"
            rules={[{ required: true, message: '請選擇專案類型' }]}
          >
            <Select placeholder="請選擇專案類型">
              <Select.Option value="E化系統">E化系統</Select.Option>
              <Select.Option value="硬體設備">硬體設備</Select.Option>
              <Select.Option value="顧問專案">顧問專案</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="預算"
            name="budget"
          >
            <InputNumber
              placeholder="請輸入預算"
              style={{ width: '100%' }}
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
            />
          </Form.Item>

          <Form.Item
            label="開始日期"
            name="startDate"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="結束日期"
            name="endDate"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="業務背景"
            name="businessBackground"
          >
            <TextArea rows={4} placeholder="請輸入業務背景" />
          </Form.Item>

          <Form.Item
            label="核心目標"
            name="coreGoals"
          >
            <TextArea rows={4} placeholder="請輸入核心目標" />
          </Form.Item>

          <Form.Item
            label="說明"
            name="description"
          >
            <TextArea rows={4} placeholder="請輸入說明" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                送出
              </Button>
              <Button onClick={onCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
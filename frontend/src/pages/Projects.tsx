import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Select, Input } from 'antd';
import { EyeOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../services/api';

const { Option } = Select;

interface Project {
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  description: string;
  projectManager: { id: string; name: string; email: string };
  createdAt: string;
}

const statusColors: Record<string, string> = {
  DRAFT: 'gray',
  APPROVAL: 'blue',
  APPROVED: 'green',
  IN_PROGRESS: 'cyan',
  COMPLETED: 'purple',
  TERMINATED: 'red',
};

const statusLabels: Record<string, string> = {
  DRAFT: '草稿',
  APPROVAL: '審批中',
  APPROVED: '已批准',
  IN_PROGRESS: '進行中',
  COMPLETED: '已完成',
  TERMINATED: '已終止',
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectApi.getAll(statusFilter);
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: '專案名稱',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '專案代碼',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '類型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status] || 'default'}>
          {statusLabels[status] || status}
        </Tag>
      ),
    },
    {
      title: '專案經理',
      dataIndex: ['projectManager', 'name'],
      key: 'projectManager',
    },
    {
      title: '建立日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('zh-TW'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Project) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/projects/${record.id}`)}
        >
          檢視
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="專案列表" bordered={false}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/projects/create')}>新增專案</Button>
            <Input
              placeholder="搜尋專案名稱"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="篩選狀態"
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="DRAFT">草稿</Option>
              <Option value="APPROVAL">審批中</Option>
              <Option value="APPROVED">已批准</Option>
              <Option value="IN_PROGRESS">進行中</Option>
              <Option value="COMPLETED">已完成</Option>
              <Option value="TERMINATED">已終止</Option>
            </Select>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredProjects}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Space>
      </Card>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Table, Tag, Button, Tabs, Space, Timeline, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import { projectApi } from '../services/api';

interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: string;
  deliverables: string[];
}

interface TeamMember {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ApprovalRecord {
  decision: string;
  comments: string;
  approver: { name: string };
  decidedAt: string;
}

interface Approval {
  id: string;
  status: string;
  currentStep: number;
  workflow: {
    name: string;
    steps: string[];
  };
  records: ApprovalRecord[];
}

interface Feasibility {
  status: string;
  businessReport: string;
  technicalReport: string;
  costReport: string;
  riskReport: string;
}

interface Charter {
  status: string;
  charterDoc: string;
  requirementBaseline: string;
  scheduleBaseline: string;
  costBaseline: string;
}

interface Project {
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  description: string;
  businessBackground: string;
  coreGoals: string;
  budget: number;
  startDate: string;
  endDate: string;
  projectManager: { id: string; name: string; email: string };
  teams: TeamMember[];
  milestones: Milestone[];
  feasibility: Feasibility;
  charter: Charter;
  approvals: Approval[];
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

const milestoneStatusColors: Record<string, string> = {
  PENDING: 'default',
  IN_PROGRESS: 'processing',
  COMPLETED: 'success',
  DELAYED: 'error',
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (projectId: string) => {
    setLoading(true);
    try {
      const response = await projectApi.get(projectId);
      setProject(response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
      message.error('取得專案資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/projects');
  };

  const teamColumns = [
    {
      title: '姓名',
      dataIndex: ['user', 'name'],
      key: 'name',
    },
    {
      title: '電子郵件',
      dataIndex: ['user', 'email'],
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
  ];

  const approvalColumns = [
    {
      title: '環節',
      dataIndex: 'workflow',
      key: 'workflow',
      render: (workflow: { name: string }) => workflow.name,
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
      title: '当前步骤',
      dataIndex: 'currentStep',
      key: 'currentStep',
    },
    {
      title: '審批記錄',
      key: 'records',
      render: (_: any, record: Approval) => (
        <Space direction="vertical" size="small">
          {record.records.map((r, index) => (
            <div key={index}>
              <strong>{r.approver.name}</strong>: {r.decision} - {r.comments}
              <br />
              <small>{new Date(r.decidedAt).toLocaleDateString('zh-TW')}</small>
            </div>
          ))}
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: 'basic',
      label: '基本資訊',
      children: (
        <Card bordered={false}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="專案名稱">{project?.name}</Descriptions.Item>
            <Descriptions.Item label="專案代碼">{project?.code}</Descriptions.Item>
            <Descriptions.Item label="類型">{project?.type}</Descriptions.Item>
            <Descriptions.Item label="狀態">
              <Tag color={statusColors[project?.status || '']}>
                {statusLabels[project?.status || '']}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="專案經理">{project?.projectManager?.name}</Descriptions.Item>
            <Descriptions.Item label="電子郵件">{project?.projectManager?.email}</Descriptions.Item>
            <Descriptions.Item label="預算">{project?.budget?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="開始日期">
              {project?.startDate ? new Date(project.startDate).toLocaleDateString('zh-TW') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="結束日期">
              {project?.endDate ? new Date(project.endDate).toLocaleDateString('zh-TW') : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="執行期間" span={2}>
              {project?.startDate && project?.endDate
                ? `${Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))} 天`
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="業務背景" span={2}>
              {project?.businessBackground}
            </Descriptions.Item>
            <Descriptions.Item label="核心目標" span={2}>
              {project?.coreGoals}
            </Descriptions.Item>
            <Descriptions.Item label="簡介" span={2}>
              {project?.description}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
    {
      key: 'milestones',
      label: '里程碑',
      children: (
        <Card bordered={false}>
          <Timeline
            items={project?.milestones.map((m) => ({
              color: milestoneStatusColors[m.status] || 'blue',
              children: (
                <div>
                  <strong>{m.name}</strong>
                  <br />
                  {m.description && <span>{m.description}</span>}
                  <br />
                  <Tag color={milestoneStatusColors[m.status] || 'default'}>
                    {m.status}
                  </Tag>
                  <br />
                  <small>截止日期: {new Date(m.dueDate).toLocaleDateString('zh-TW')}</small>
                  {m.deliverables && m.deliverables.length > 0 && (
                    <>
                      <br />
                      <small>交付物: {m.deliverables.join(', ')}</small>
                    </>
                  )}
                </div>
              ),
            }))}
          />
        </Card>
      ),
    },
    {
      key: 'team',
      label: '團隊成員',
      children: (
        <Card bordered={false}>
          <Table
            columns={teamColumns}
            dataSource={project?.teams}
            rowKey="id"
            pagination={false}
          />
        </Card>
      ),
    },
    {
      key: 'approvals',
      label: '審批記錄',
      children: (
        <Card bordered={false}>
          <Table
            columns={approvalColumns}
            dataSource={project?.approvals}
            rowKey="id"
            pagination={false}
          />
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button
        icon={<LeftOutlined />}
        onClick={handleBack}
        style={{ marginBottom: 16 }}
      >
        返回
      </Button>
      <Card title="專案詳情" bordered={false} loading={loading}>
        {project && <Tabs items={items} />}
      </Card>
    </div>
  );
}
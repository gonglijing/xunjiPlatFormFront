import React, { useState, useEffect } from 'react';
import { Modal, Tree, message } from 'antd';
import sysApi from '../../../../api/system';

interface PermissionProps {
  visible: boolean;
  role: any;
  onClose: () => void;
}

interface MenuTreeItem {
  id: number;
  title: string;
  pid: number;
  children?: MenuTreeItem[];
}

const Permission: React.FC<PermissionProps> = ({ visible, role, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [menuTree, setMenuTree] = useState<MenuTreeItem[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  useEffect(() => {
    if (visible && role?.id) {
      loadMenuTree();
    }
  }, [visible, role]);

  const loadMenuTree = async () => {
    setLoading(true);
    try {
      const [treeRes, authRes]: any[] = await Promise.all([
        sysApi.menu.tree(),
        sysApi.role.auth.tree(role.id),
      ]);

      setMenuTree(treeRes || []);

      // Extract selected menu IDs from auth response
      if (authRes?.list) {
        setSelectedKeys(authRes.list.map((item: any) => item.menuId));
      }
    } catch (error) {
      message.error('获取菜单权限失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await sysApi.role.auth.update({
        roleId: role.id,
        menuIds: selectedKeys,
      });
      message.success('权限更新成功');
      onClose();
    } catch (error) {
      message.error('权限更新失败');
    }
  };

  const onCheck = (checkedKeys: any) => {
    setSelectedKeys(checkedKeys.checked || checkedKeys);
  };

  // Convert tree to Ant Design Tree format
  const convertToTreeNodes = (items: MenuTreeItem[]): any[] => {
    return items.map(item => ({
      title: item.title,
      key: item.id,
      children: item.children ? convertToTreeNodes(item.children) : undefined,
    }));
  };

  return (
    <Modal
      title={`权限配置 - ${role?.name || ''}`}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={loading}
      width={600}
    >
      <Tree
        checkable
        checkStrictly={false}
        treeData={convertToTreeNodes(menuTree)}
        checkedKeys={selectedKeys}
        onCheck={onCheck as any}
        height={400}
      />
    </Modal>
  );
};

export default Permission;

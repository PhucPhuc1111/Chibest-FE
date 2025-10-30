import { Modal } from 'antd';
import { useState } from 'react';
import BranchForm from './BranchForm';
import { BranchFormData } from '@/types/branch';
import { createBranch } from '@/api/branchApi';

interface CreateBranchModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateBranchModal: React.FC<CreateBranchModalProps> = ({
  visible,
  onClose,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: BranchFormData) => {
    try {
      setIsLoading(true);
      await createBranch(values);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating branch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo chi nhánh mới"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <BranchForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Modal>
  );
};

export default CreateBranchModal;
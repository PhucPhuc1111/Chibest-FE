import { Modal } from 'antd';
import { useState } from 'react';
import BranchForm from './BranchForm';
import { BranchFormData } from '@/types/branch';
import { updateBranch } from '@/api/branchApi';

interface UpdateBranchModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: BranchFormData & { id: string };
}

const UpdateBranchModal: React.FC<UpdateBranchModalProps> = ({
  visible,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: BranchFormData) => {
    try {
      setIsLoading(true);
      await updateBranch(initialData.id, values);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating branch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Cập nhật chi nhánh"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <BranchForm
        mode="edit"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        initialValues={{
          ...initialData
        }}
      />
    </Modal>
  );
};

export default UpdateBranchModal;
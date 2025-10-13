

import React, { useEffect, useState } from "react";
import { Button, Form, Image, Input, Select, Upload, UploadFile } from "antd";
import { useGetAllAllergies, useGetAllDiseases, useGetAllIngredients } from "@/app/data";
import { UploadOutlined } from "@ant-design/icons";




const DetailDiseaseForm: React.FC<{form:any,diseaseId: number,isEditing: boolean}> = ({
  form,
  isEditing,
  diseaseId,
}) => {


    const { data: ingredientsData, isLoading: isLoadingIngredients } =
    useGetAllIngredients(1, 500, "");

    
 
    const ingredientOptions =
    ingredientsData?.map((ingredient) => ({
      label: ingredient.ingredientName,
      value: ingredient.ingredientId,
    })) || [];


    useEffect(() => {
        // Get the current allergy data when it loads
        if (form) {
          form.setFieldsValue({
            ingredientIds: form.getFieldValue("ingredients")?.map((ingredient: any) => ingredient.ingredientId) || [], // Set ingredientIds based on the current allergy data
          });
        }
      }, [form, diseaseId]);

  return (
   <Form form={form} name="">

          <Form.Item name="diseaseName" label="Disease Name"
          rules={[
            { required: true, message: 'Disease Name is required' },  {
           pattern: /^[a-zA-Z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]*$/,
           message: 'Disease Name should not contain special characters',
         }]}>
            <Input disabled={!isEditing} />
          </Form.Item>

         

          <Form.Item name="description" label="Description">
            <Input disabled={!isEditing} />
          </Form.Item>

         
          <Form.Item name="ingredientIds" label="Ingredients to avoid">
        <Select
          mode="multiple"
          placeholder="Select ingredients to avoid"
          options={ingredientOptions}
          loading={isLoadingIngredients}
          allowClear
          disabled={!isEditing}
          showSearch
          filterOption={(input, option) => {
            if (option && option.label) {
            
              return (option.label as string).toLowerCase().includes(input.toLowerCase());
            }
            return false;
          }}
        />
      </Form.Item>
        

        


      <Form.Item name="diseaseId" initialValue={diseaseId} hidden>
        <Input />
      </Form.Item>
    </Form>
  );
};

export default DetailDiseaseForm;

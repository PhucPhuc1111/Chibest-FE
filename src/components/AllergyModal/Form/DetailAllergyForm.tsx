

import React, { useEffect, useState } from "react";
import { Button, Form, Image, Input, Select, Upload, UploadFile } from "antd";
import { useGetAllAllergies, useGetAllDiseases, useGetAllIngredients } from "@/app/data";
import { UploadOutlined } from "@ant-design/icons";




const DetailAllergyForm: React.FC<{form:any,allergyId: number,isEditing: boolean}> = ({
  form,
  isEditing,
  allergyId,
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
      }, [form, allergyId]);

  return (
   <Form form={form} name="food-details">

          <Form.Item name="allergyName" label="Allergy name"
          rules={[
             { required: true, message: 'Allergy name is requires' },  {
            pattern: /^[a-zA-Z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]*$/,
            message: 'Allergy name must not contain special characters',
          }]}>
            <Input disabled={!isEditing} />
          </Form.Item>

         

          <Form.Item name="notes" label="Note">
            <Input disabled={!isEditing} />
          </Form.Item>

         
          <Form.Item name="ingredientIds" label="Ingredients to avoid">
        <Select
          mode="multiple"
          placeholder="select ingredients to avoid"
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
        

        


      <Form.Item name="allergyId" initialValue={allergyId} hidden>
        <Input />
      </Form.Item>
    </Form>
  );
};

export default DetailAllergyForm;

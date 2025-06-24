import React, { ChangeEventHandler } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Avatar from "../common/avatar/Avatar";
import Icon from "../../assets/icon.jpg";
import { StyledTweetInputContainer } from "./TweetInputContainer";
import { StyledBorderlessTextArea } from "./BorderlessTextArea";
import { StyledErrorMessage } from "../common/ValidationStyles";

interface TweetInputProps {
  placeholder: string;
  src?: string;
  alt?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  maxLength: number;
  value?: string;
  images?: File[];
  onImagesChange?: (images: File[]) => void;
}

const TweetValidationSchema = (maxLength: number) => Yup.object().shape({
  content: Yup.string()
    .max(maxLength, `Tweet cannot exceed ${maxLength} characters`),
  images: Yup.array()
    .max(4, 'Cannot upload more than 4 images')
});

const TweetInput = ({
  placeholder,
  src,
  alt,
  onChange,
  maxLength,
  value,
  images = [],
  onImagesChange,
}: TweetInputProps) => {
  return (
    <Formik
      initialValues={{
        content: value ?? '',
        images: images
      }}
      validationSchema={TweetValidationSchema(maxLength)}
      onSubmit={() => {}}
      enableReinitialize={true}
    >
      {({ errors, touched, values, handleChange, handleBlur, setFieldValue }) => {
        
        const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
          handleChange(e);
          onChange?.(e);
          setFieldValue('content', e.target.value);
        };

        // Character count with warning states
        const characterCount = values.content.length;
        const isNearLimit = characterCount > maxLength * 0.8;
        const isOverLimit = characterCount > maxLength;

        return (
          <>
            <StyledTweetInputContainer>
              <Avatar src={src ?? Icon} alt={alt ?? "Icon"} />
              <StyledBorderlessTextArea
                onChange={handleTextChange}
                onBlur={handleBlur}
                maxLength={maxLength}
                placeholder={placeholder}
                value={values.content}
                name="content"
              />
            </StyledTweetInputContainer>
            
            {/* Validation messages - positioned outside main container to not affect layout */}
            {isNearLimit && (
              <div style={{ 
                fontSize: '12px', 
                color: isOverLimit ? '#ff6b6b' : '#ff8c00',
                marginTop: '4px',
                textAlign: 'right',
                fontFamily: 'Inter, sans-serif',
                paddingRight: '16px'
              }}>
                {characterCount}/{maxLength}
              </div>
            )}

            {errors.content && touched.content && (
              <StyledErrorMessage style={{ marginLeft: '60px' }}>{errors.content}</StyledErrorMessage>
            )}

            {errors.images && typeof errors.images === 'string' && (
              <StyledErrorMessage style={{ marginLeft: '60px' }}>{errors.images}</StyledErrorMessage>
            )}
          </>
        );
      }}
    </Formik>
  );
};
export default TweetInput;

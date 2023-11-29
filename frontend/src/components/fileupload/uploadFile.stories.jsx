import React from 'react';
import FileUpload from './uploadFile'; // Adjust the import path as necessary

// Default export that describes the component
export default {
    title: 'FileUpload',
    component: FileUpload,
};

// Template for your component
const Template = (args) => <FileUpload {...args} />;

// Default view of your component
export const Default = Template.bind({});

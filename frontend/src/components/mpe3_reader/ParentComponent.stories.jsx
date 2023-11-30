// ParentComponent.stories.jsx
import React from 'react';
import ParentComponent from './ParentComponent'; // Adjust the import path as needed

// This default export determines where your story goes in the story list
export default {
    title: 'ParentComponent',
    component: ParentComponent,
};

const Template = (args) => <ParentComponent {...args} />;

export const Default = Template.bind({});
// Here you can add props to Default if ParentComponent had any
// Default.args = {};

// Add more stories here if you have other variations to show

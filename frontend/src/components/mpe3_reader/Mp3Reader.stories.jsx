// Mp3Reader.stories.jsx
import React from 'react';
import Mp3Reader from './Mp3Reader'; // Adjust the import path as necessary

// Default export that describes the component
export default {
    title: 'Mp3Reader',
    component: Mp3Reader,
};

// Template for your component
const Template = (args) => <Mp3Reader {...args} />;

// Default view of your component
export const Default = Template.bind({});
